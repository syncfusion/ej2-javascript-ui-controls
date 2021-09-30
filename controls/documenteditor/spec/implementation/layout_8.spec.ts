import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, Layout, PageLayoutViewer, ParagraphWidget, LineWidget, TextElementBox, ListTextElementBox, TableCellWidget, WBorder } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

let table_border:any={"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"outlineLevel":"Level1","styleName":"Heading 1"},"inlines":[{"text":"Schülerinformationen"}]}],"cellFormat":{"columnSpan":6,"rowSpan":1,"preferredWidth":100.0,"preferredWidthType":"Percent","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#731F1CFF"}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Vorname"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[{"text":"Klicken oder tippen Sie hier, um Text einzugeben.","characterFormat":{"styleName":"Placeholder Text"}}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Nachname"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[{"text":"Klicken oder tippen Sie hier, um Text einzugeben.","characterFormat":{"styleName":"Placeholder Text"}}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Klasse"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Adresse"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Ort/Bundesland/Postleitzahl"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Telefon"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":29.579999923706055,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Telefon 2"}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":18.020000457763672,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":25.719999313354492,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"E-Mail"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":2.7000000476837158,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontSize":4.0,"fontFamily":"Corbel"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":6,"rowSpan":1,"preferredWidth":100.0,"preferredWidthType":"Percent","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"outlineLevel":"Level1","styleName":"Heading 1"},"inlines":[{"text":"Elterninformationen 1"}]}],"cellFormat":{"columnSpan":6,"rowSpan":1,"preferredWidth":100.0,"preferredWidthType":"Percent","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#731F1CFF"}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Vorname"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Nachname"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Telefon mobil"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":29.579999923706055,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Telefon geschäftlich"}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":18.020000457763672,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":25.719999313354492,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"E-Mail"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":34.900001525878906,"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":2,"rowSpan":1,"preferredWidth":15.380000114440918,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Als Freiwilliger melden"}]}],"cellFormat":{"columnSpan":4,"rowSpan":1,"preferredWidth":84.620002746582031,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":2.7000000476837158,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontSize":4.0,"fontFamily":"Corbel"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":6,"rowSpan":1,"preferredWidth":100.0,"preferredWidthType":"Percent","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"outlineLevel":"Level1","styleName":"Heading 1"},"inlines":[{"name":"_Hlk521325947","bookmarkType":0},{"text":"Elterninformationen 2"}]}],"cellFormat":{"columnSpan":6,"rowSpan":1,"preferredWidth":100.0,"preferredWidthType":"Percent","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#731F1CFF"}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"name":"_Hlk521325947","bookmarkType":1},{"text":"Vorname","characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"}}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Nachname","characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"}}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"Telefon mobil","characterFormat":{"fontColor":"#00000000","styleName":"Placeholder Text"}}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":29.579999923706055,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"Telefon geschäftlich"}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":18.020000457763672,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":25.719999313354492,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal Indent"},"inlines":[{"text":"E-Mail"}]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":18.0},"paragraphFormat":{"leftIndent":34.900001525878906,"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":2,"rowSpan":1,"preferredWidth":15.380000114440918,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[{"text":"Als Freiwilliger melden"}]}],"cellFormat":{"columnSpan":4,"rowSpan":1,"preferredWidth":84.620002746582031,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"bold":true,"fontSize":4.0,"fontFamily":"Corbel"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":26.680000305175781,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"characterFormat":{"bold":true,"fontSize":4.0,"fontFamily":"Corbel"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":3,"rowSpan":1,"preferredWidth":73.319999694824219,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":18.0},"paragraphFormat":{"leftIndent":-1.0,"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":6.7399997711181641,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"beforeSpacing":6.0,"styleName":"Normal"},"inlines":[{"text":"Nehmen Sie uns nicht in das Verzeichnis auf"}]}],"cellFormat":{"columnSpan":5,"rowSpan":1,"preferredWidth":93.260002136230469,"preferredWidthType":"Percent","verticalAlignment":"Bottom","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidth":100.0,"preferredWidthType":"Percent","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"characterFormat":{"fontSize":6.0},"paragraphFormat":{"afterSpacing":0.0,"styleName":"Normal"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":49.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":-5.4000000953674316,"styleName":"Header"},"inlines":[{"name":"_Hlk521325785","bookmarkType":0},{"imageString":"data:image/png;base64,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","length":1,"width":50.400001525878906,"height":50.400001525878906,"isInlineImage":true,"isMetaFile":false}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":67.5,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"paragraphFormat":{"styleName":"Header"},"inlines":[{"text":"Schülerinformationen"},{"name":"_Hlk521325785","bookmarkType":1}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":400.0,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"characterFormat":{"fontSize":10.0},"paragraphFormat":{"afterSpacing":0.0,"styleName":"No Spacing"},"inlines":[]}]},"footer":{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"characterFormat":{"fontSize":9.0},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":490.5,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"text":"Doppelklicken Sie auf die Fußzeile, um den Namen der Schule einzusetzen und das Logo zu aktualisieren","characterFormat":{"styleName":"Fußzeile Zchn"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"blocks":[{"characterFormat":{"fontSize":9.0},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","textAlignment":"Right","styleName":"Normal","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":490.5,"tabLeader":"None","deletePosition":0.0}]},"inlines":[{"imageString":"data:image/png;base64,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","length":1,"width":100.80000305175781,"height":38.891338348388672,"isInlineImage":true,"isMetaFile":false}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}},{"paragraphFormat":{"styleName":"No Spacing"},"inlines":[]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":21.600000381469727,"pageWidth":595.29998779296875,"pageHeight":841.9000244140625,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false}}],"characterFormat":{"fontSize":14.0,"fontFamily":"Calibri"},"paragraphFormat":{"afterSpacing":10.0,"lineSpacing":1.1291667222976685,"lineSpacingType":"Multiple"},"lists":[{"listId":12,"abstractListId":12},{"listId":13,"abstractListId":13},{"listId":15,"abstractListId":15},{"listId":16,"abstractListId":16}],"abstractLists":[{"abstractListId":12,"levels":[{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","fontFamily":"Symbol","fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0}},{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"o","characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":54.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":2,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%3.","paragraphFormat":{"leftIndent":40.5,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%4.","paragraphFormat":{"leftIndent":76.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":4,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%5.","paragraphFormat":{"leftIndent":112.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":5,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%6.","paragraphFormat":{"leftIndent":148.5,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%7.","paragraphFormat":{"leftIndent":184.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":7,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%8.","paragraphFormat":{"leftIndent":220.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":8,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%9.","paragraphFormat":{"leftIndent":256.5,"firstLineIndent":-9.0}}]},{"abstractListId":13,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":1,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%2.","paragraphFormat":{"leftIndent":54.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":2,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%3.","paragraphFormat":{"leftIndent":40.5,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%4.","paragraphFormat":{"leftIndent":76.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":4,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%5.","paragraphFormat":{"leftIndent":112.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":5,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%6.","paragraphFormat":{"leftIndent":148.5,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%7.","paragraphFormat":{"leftIndent":184.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":7,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%8.","paragraphFormat":{"leftIndent":220.5,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":8,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%9.","paragraphFormat":{"leftIndent":256.5,"firstLineIndent":-9.0}}]},{"abstractListId":15,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","characterFormat":{"fontSize":16.0,"fontFamily":"Corbel"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":1,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%2.","paragraphFormat":{"leftIndent":72.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":2,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%3.","paragraphFormat":{"leftIndent":108.0,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%4.","paragraphFormat":{"leftIndent":144.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":4,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%5.","paragraphFormat":{"leftIndent":180.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":5,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%6.","paragraphFormat":{"leftIndent":216.0,"firstLineIndent":-9.0}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%7.","paragraphFormat":{"leftIndent":252.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":7,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%8.","paragraphFormat":{"leftIndent":288.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":8,"listLevelPattern":"LowRoman","followCharacter":"Tab","numberFormat":"%9.","paragraphFormat":{"leftIndent":324.0,"firstLineIndent":-9.0}}]},{"abstractListId":16,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"Kapitel %1","characterFormat":{"bold":true,"italic":false,"fontFamily":"Calibri","fontColor":"#A6A6A6FF"},"paragraphFormat":{"leftIndent":18.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","fontColor":"#694A77FF"},"paragraphFormat":{"leftIndent":18.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.%2.%3","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","fontColor":"#694A77FF"},"paragraphFormat":{"leftIndent":18.0,"firstLineIndent":-18.0}},{"startAt":1,"restartLevel":3,"listLevelPattern":"None","followCharacter":"Tab","numberFormat":"%1.%2.%3.%4","paragraphFormat":{"leftIndent":43.200000762939453,"firstLineIndent":-43.200000762939453}},{"startAt":1,"restartLevel":4,"listLevelPattern":"None","followCharacter":"Tab","paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0}},{"startAt":1,"restartLevel":5,"listLevelPattern":"None","followCharacter":"Tab","paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0}},{"startAt":1,"restartLevel":6,"listLevelPattern":"None","followCharacter":"None","paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0}},{"startAt":1,"restartLevel":7,"listLevelPattern":"None","followCharacter":"Tab","paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0}},{"startAt":1,"restartLevel":8,"listLevelPattern":"None","followCharacter":"Tab","paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0}}]}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Heading 1","link":"Überschrift 1 Zchn","characterFormat":{"bold":true,"fontFamily":"Corbel","fontColor":"#FFFFFFFF"},"paragraphFormat":{"beforeSpacing":3.0,"afterSpacing":3.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level1"}},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","link":"Überschrift 2 Zchn","characterFormat":{"bold":true,"fontSize":16.0,"fontColor":"#694A77FF"},"paragraphFormat":{"beforeSpacing":18.0,"afterSpacing":12.0,"outlineLevel":"Level2","tabs":[{"tabJustification":"Left","position":36.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":59.950000762939453,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Überschrift 3 Zchn","characterFormat":{"bold":true,"fontColor":"#694A77FF"},"paragraphFormat":{"beforeSpacing":18.0,"afterSpacing":12.0,"outlineLevel":"Level3","tabs":[{"tabJustification":"Left","position":45.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":78.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","link":"Überschrift 4 Zchn","characterFormat":{"bold":true,"fontSize":12.5},"paragraphFormat":{"beforeSpacing":9.1999998092651367,"outlineLevel":"Level4"}},{"type":"Paragraph","name":"Heading 5","basedOn":"Heading 2","link":"Überschrift 5 Zchn","characterFormat":{"fontColor":"#4BACC6FF"},"paragraphFormat":{"beforeSpacing":6.0,"outlineLevel":"Level5","listFormat":{"listLevelNumber":4}}},{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","link":"Überschrift 6 Zchn","characterFormat":{"fontFamily":"Corbel","fontColor":"#0A273BFF"},"paragraphFormat":{"beforeSpacing":2.0,"outlineLevel":"Level6","listFormat":{"listLevelNumber":5,"listId":16}}},{"type":"Paragraph","name":"Heading 7","basedOn":"Normal","next":"Normal","link":"Überschrift 7 Zchn","characterFormat":{"italic":true,"fontFamily":"Corbel","fontColor":"#0A273BFF"},"paragraphFormat":{"beforeSpacing":2.0,"outlineLevel":"Level7","listFormat":{"listLevelNumber":6,"listId":16}}},{"type":"Paragraph","name":"Heading 8","basedOn":"Normal","next":"Normal","link":"Überschrift 8 Zchn","characterFormat":{"fontSize":10.5,"fontFamily":"Corbel","fontColor":"#272727FF"},"paragraphFormat":{"beforeSpacing":2.0,"outlineLevel":"Level8","listFormat":{"listLevelNumber":7,"listId":16}}},{"type":"Paragraph","name":"Heading 9","basedOn":"Normal","next":"Normal","link":"Überschrift 9 Zchn","characterFormat":{"italic":true,"fontSize":10.5,"fontFamily":"Corbel","fontColor":"#272727FF"},"paragraphFormat":{"beforeSpacing":2.0,"outlineLevel":"Level9","listFormat":{"listLevelNumber":8,"listId":16}}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Character","name":"Überschrift 1 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontFamily":"Corbel","fontColor":"#FFFFFFFF"}},{"type":"Character","name":"Hashtag","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#2B579AFF"}},{"type":"Paragraph","name":"Nummerierte Liste","basedOn":"Normal","characterFormat":{"bold":true},"paragraphFormat":{"listFormat":{"listLevelNumber":6,"listId":15}}},{"type":"Paragraph","name":"Standard1","characterFormat":{"fontFamily":"Calibri","fontColor":"#000000FF"}},{"type":"Character","name":"Überschrift 2 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":16.0,"fontColor":"#694A77FF"}},{"type":"Paragraph","name":"Normal Indent","basedOn":"Normal","next":"Normal Indent","paragraphFormat":{"leftIndent":36.0,"beforeSpacing":6.0}},{"type":"Character","name":"Überschrift 3 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontColor":"#694A77FF"}},{"type":"Paragraph","name":"TOC 1","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontColor":"#694A77FF"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":63.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":72.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":491.5,"tabLeader":"Dot","deletePosition":0.0}]}},{"type":"Paragraph","name":"Footnote Text","basedOn":"Normal","link":"Fußnotentext Zchn","characterFormat":{"fontSize":9.0},"paragraphFormat":{"beforeSpacing":6.0}},{"type":"Character","name":"Fußnotentext Zchn","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0}},{"type":"Paragraph","name":"List Bullet","basedOn":"Normal","paragraphFormat":{"beforeSpacing":6.0,"listFormat":{"listId":12},"tabs":[{"tabJustification":"Left","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"annotation text","basedOn":"Normal","link":"Kommentartext Zchn"},{"type":"Character","name":"Kommentartext Zchn","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Kopfzeile Zchn","characterFormat":{"bold":true,"fontSize":22.0,"fontFamily":"Corbel","fontColor":"#731F1CFF"},"paragraphFormat":{"afterSpacing":0.0,"tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Kopfzeile Zchn","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":22.0,"fontFamily":"Corbel","fontColor":"#731F1CFF"}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","link":"Fußzeile Zchn","characterFormat":{"fontSize":9.0},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":490.5,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Fußzeile Zchn","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0}},{"type":"Character","name":"Footnote Reference","basedOn":"Default Paragraph Font","characterFormat":{"baselineAlignment":"Superscript"}},{"type":"Character","name":"annotation reference","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0}},{"type":"Paragraph","name":"List Number","basedOn":"Normal","paragraphFormat":{"beforeSpacing":6.0,"listFormat":{"listId":13}}},{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","characterFormat":{"underline":"Single","fontColor":"#BF678EFF"}},{"type":"Paragraph","name":"annotation subject","basedOn":"annotation text","next":"annotation text","link":"Kommentarthema Zchn","characterFormat":{"bold":true}},{"type":"Character","name":"Kommentarthema Zchn","basedOn":"Kommentartext Zchn","characterFormat":{"bold":true,"fontSize":11.0,"fontFamily":"Calibri"}},{"type":"Paragraph","name":"No Spacing","basedOn":"Normal","next":"No Spacing","characterFormat":{"fontSize":9.0}},{"type":"Paragraph","name":"Title","basedOn":"Normal","next":"Normal","link":"Titel Zchn","characterFormat":{"fontSize":28.0,"fontFamily":"Corbel"}},{"type":"Character","name":"Titel Zchn","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":28.0,"fontFamily":"Corbel"}},{"type":"Paragraph","name":"List Bullet 2","basedOn":"Normal","paragraphFormat":{"beforeSpacing":6.0,"listFormat":{"listLevelNumber":1,"listId":12}}},{"type":"Character","name":"Überschrift 4 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.5}},{"type":"Character","name":"Überschrift 5 Zchn","basedOn":"Überschrift 2 Zchn","characterFormat":{"bold":true,"fontSize":16.0,"fontColor":"#4BACC6FF"}},{"type":"Character","name":"Überschrift 6 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Corbel","fontColor":"#0A273BFF"}},{"type":"Character","name":"Überschrift 7 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontFamily":"Corbel","fontColor":"#0A273BFF"}},{"type":"Character","name":"Überschrift 8 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":10.5,"fontFamily":"Corbel","fontColor":"#272727FF"}},{"type":"Character","name":"Überschrift 9 Zchn","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontSize":10.5,"fontFamily":"Corbel","fontColor":"#272727FF"}},{"type":"Paragraph","name":"TOC 2","basedOn":"Normal","next":"Normal","characterFormat":{"fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":45.349998474121094,"rightIndent":28.799999237060547,"firstLineIndent":-27.350000381469727,"beforeSpacing":4.0,"tabs":[{"tabJustification":"Left","position":45.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":491.5,"tabLeader":"Dot","deletePosition":0.0}]}},{"type":"Paragraph","name":"TOC 3","basedOn":"Normal","next":"Normal","characterFormat":{"fontSize":10.0},"paragraphFormat":{"leftIndent":45.0,"beforeSpacing":4.0,"tabs":[{"tabJustification":"Left","position":81.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":491.5,"tabLeader":"Dot","deletePosition":0.0}]}},{"type":"Paragraph","name":"Table of Figures","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent":67.699996948242188,"rightIndent":28.799999237060547,"firstLineIndent":-67.699996948242188,"beforeSpacing":6.0,"tabs":[{"tabJustification":"Left","position":67.5,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":491.25,"tabLeader":"Dot","deletePosition":0.0}]}},{"type":"Paragraph","name":"List Number 2","basedOn":"Normal","paragraphFormat":{"beforeSpacing":6.0,"listFormat":{"listLevelNumber":1,"listId":13}}},{"type":"Character","name":"FollowedHyperlink","basedOn":"Default Paragraph Font","characterFormat":{"underline":"Single","fontColor":"#731F1CFF"}},{"type":"Paragraph","name":"Normal (Web)","basedOn":"Normal","characterFormat":{"fontFamily":"Times New Roman"},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0}},{"type":"Character","name":"Book Title","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"italic":true}},{"type":"Paragraph","name":"TOC Heading","basedOn":"Normal","next":"Normal","characterFormat":{"bold":true,"fontSize":16.0,"fontFamily":"Calibri","fontColor":"#000000FF"},"paragraphFormat":{"outlineLevel":"Level1"}},{"type":"Paragraph","name":"Macro Text","link":"Makrotext Zchn","characterFormat":{"fontSize":10.0,"fontFamily":"Consolas"},"paragraphFormat":{"tabs":[{"tabJustification":"Left","position":24.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":48.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":72.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":96.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":120.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":144.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":168.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":192.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Left","position":216.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Makrotext Zchn","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":10.0,"fontFamily":"Consolas"}},{"type":"Character","name":"Placeholder Text","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#808080FF"}}]};

describe('Table border render validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection,Editor);
        editor = new DocumentEditor({isReadOnly:false,enableSelection:true,enableEditor:true});        
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(table_border));
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
    it('page count to be 2', () => {
console.log('page count to be 2');
      expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('get adjacent bottom border to render', () => {
console.log('get adjacent bottom border to render');
      editor.selection.handleDownKey();
      editor.selection.handleDownKey();
      editor.selection.handleControlRightKey();
      editor.selection.handleControlRightKey();
      let cellWidget:TableCellWidget=(editor.selection.start.paragraph.containerWidget as TableCellWidget);
      let bottomBorder:WBorder=cellWidget.getAdjacentCellBottomBorder(cellWidget.cellFormat.borders.bottom,cellWidget);
      expect(bottomBorder.lineStyle).toBe('Single');
      expect(bottomBorder.lineWidth).toBe(0.5);
    });
    it('get adjacent top border to render', () => {
console.log('get adjacent top border to render');
        editor.selection.handleDownKey();        
        let cellWidget:TableCellWidget=(editor.selection.start.paragraph.containerWidget as TableCellWidget);
        let bottomBorder:WBorder=cellWidget.getPreviousCellTopBorder(cellWidget.cellFormat.borders.top,cellWidget);
        expect(bottomBorder.lineStyle).toBe('Single');
        expect(bottomBorder.lineWidth).toBe(0.5);
      });
});
let doc : any = {
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
                   "afterSpacing": 36,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "#4472C4FF"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 18,
                         "fontFamily": "Monotype Corsiva",
                         "fontColor": "#4472C4FF",
                         "fontSizeBidi": 18,
                         "fontFamilyBidi": "Monotype Corsiva"
                      },
                      "text": "List of text alignment options"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Left-aligned"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Center",
                   "beforeSpacing": 18,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Centered"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Center",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Right",
                   "beforeSpacing": 18,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Right-aligned"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Right",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "beforeSpacing": 18,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Justified"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 8,
                   "lineSpacing": 1.0791667,
                   "lineSpacingType": "Multiple",
                   "styleName": "Normal",
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
                      "text": " "
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 36,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "#4472C4FF"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 18,
                         "fontFamily": "Monotype Corsiva",
                         "fontColor": "#4472C4FF",
                         "fontSizeBidi": 18,
                         "fontFamilyBidi": "Monotype Corsiva"
                      },
                      "text": "List of indentation options"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "leftIndent": 36,
                   "textAlignment": "Justify",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Left "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "indent "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "48 "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "leftIndent": 36,
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "rightIndent": 36,
                   "textAlignment": "Justify",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Right "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "indent "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "48 "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "rightIndent": 36,
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "firstLineIndent": 36,
                   "textAlignment": "Justify",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "First "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "line "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "indent "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "48 "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "firstLineIndent": 36,
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "leftIndent": 36,
                   "firstLineIndent": -36,
                   "textAlignment": "Justify",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Hanging "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "indent "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "48 "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "leftIndent": 36,
                   "firstLineIndent": -36,
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 8,
                   "lineSpacing": 1.0791667,
                   "lineSpacingType": "Multiple",
                   "styleName": "Normal",
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
                      "text": " "
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 36,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "#4472C4FF"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 18,
                         "fontFamily": "Monotype Corsiva",
                         "fontColor": "#4472C4FF",
                         "fontSizeBidi": 18,
                         "fontFamilyBidi": "Monotype Corsiva"
                      },
                      "text": "List of line spacing options"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "lineSpacing": 2,
                   "lineSpacingType": "Multiple",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Double "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "line "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "spacing"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "lineSpacing": 2,
                   "lineSpacingType": "Multiple",
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "lineSpacing": 18,
                   "lineSpacingType": "AtLeast",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Line "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "spacing "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "at "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "least "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "24 "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "lineSpacing": 18,
                   "lineSpacingType": "AtLeast",
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "lineSpacing": 15,
                   "lineSpacingType": "Exactly",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Line "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "spacing "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "exactly "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "20 "
                   },
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "lineSpacing": 15,
                   "lineSpacingType": "Exactly",
                   "styleName": "Normal",
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
                      "text": "Lorem "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ipsum "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolor "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "sed "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "et "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "dolore "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "leftIndent": 36,
                   "textAlignment": "Justify",
                   "afterSpacing": 18,
                   "lineSpacing": 15,
                   "lineSpacingType": "Exactly",
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontFamily": "Calibri",
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {},
                      "text": " "
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "#4472C4FF"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 18,
                         "fontFamily": "Monotype Corsiva",
                         "fontColor": "#4472C4FF",
                         "fontSizeBidi": 18,
                         "fontFamilyBidi": "Monotype Corsiva"
                      },
                      "text": "List of paragraph spacing options"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "beforeSpacing": 18,
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Spacing before the paragraph is 24 pixels and after the paragraph is 16 pixels"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "textAlignment": "Left",
                   "beforeSpacing": 18,
                   "afterSpacing": 12,
                   "lineSpacingType": "Multiple",
                   "styleName": "Normal",
                   "listFormat": {},
                   "widowControl": true
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
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "No spacing before and after the paragraph"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontFamily": "Calibri",
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": []
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
                },
                "characterFormat": {
                   "bold": true,
                   "fontSize": 14,
                   "fontFamily": "Calibri",
                   "boldBidi": true,
                   "fontSizeBidi": 14,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "bold": true,
                         "fontSize": 14,
                         "fontFamily": "Calibri",
                         "boldBidi": true,
                         "fontSizeBidi": 14,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Keep with next and Keep lines together"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "afterSpacing": 12,
                   "styleName": "Normal",
                   "listFormat": {},
                   "keepLinesTogether": true,
                   "keepWithNext": true
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
                      "text": "Lorem ipsum dolor sit "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "amet"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consectetur"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "adipiscing"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "elit"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", sed do "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "eiusmod"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "tempor"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "incididunt"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "labore et dolore magna "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliqua"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ". Ut "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "enim"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ad minim "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "veniam"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": ", "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "quis"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "nostrud"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " exercitation "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ullamco"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "laboris"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " nisi "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ut"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "aliquip"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " ex "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "ea"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "commodo"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "consequat"
                   },
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontFamily": "Calibri",
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": []
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
             "evenHeader": {
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
             "evenFooter": {
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
             "firstPageHeader": {
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
             "firstPageFooter": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "listFormat": {}
                      },
                      "characterFormat": {},
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
       "lineSpacing": 1.0791667,
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
             "afterSpacing": 0,
             "lineSpacing": 1,
             "lineSpacingType": "Multiple",
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 12,
             "fontFamily": "Times New Roman",
             "fontSizeBidi": 12,
             "fontFamilyBidi": "Times New Roman"
          },
          "next": "Normal"
       },
       {
          "name": "Heading 1",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 12,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level1",
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 16,
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "fontSizeBidi": 16,
             "fontFamilyBidi": "Calibri Light"
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
             "beforeSpacing": 2,
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
          "name": "Heading 3",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level3",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri Light",
             "fontColor": "#1F3763FF",
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
          "name": "Notes",
          "type": "Paragraph",
          "paragraphFormat": {
             "afterSpacing": 6,
             "listFormat": {}
          },
          "characterFormat": {
             "bold": true,
             "boldBidi": true
          },
          "basedOn": "Normal",
          "next": "Normal"
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
                "listFormat": {}
             },
             "characterFormat": {},
             "inlines": []
          }
       ]
    }
 }
 describe('Widow/Orphan overlap', () => {
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
   it('after apply', () => {
      editor.open(JSON.stringify(doc));
      let len = editor.documentHelper.pages[2].bodyWidgets[0].childWidgets.length;
      expect(len).toEqual(4);
   });
});
