/* eslint-disable camelcase */
/**
 * Specified the hyperlink type.
 */
export type HyperlinkType =
    /**
     * Specifies the link to a file. The link that starts with "file:///".
     */
    'File' |
    /**
     * Specifies the link to a web page. The link that starts with "http://", "https://", "www." etc.
     */
    'WebPage' |
    /**
     * Specifies the link to an e-mail. The link that starts with "mailto:".
     */
    'Email' |
    /**
     * Specifies the link to a bookmark. The link that refers to a bookmark.
     */
    'Bookmark';

/**
 * Indicates inserted revision types
 */
export type RevisionType =
    'Insertion' |
    'Deletion' |
    'MoveTo' |
    'MoveFrom';
/**
 * Indicates inserted revision types
 */
export type ReviewTabType =
    'Comments' |
    'Changes';

/**
 * Enum underline for character format
 */
export type Underline =
    /**
     * No underline will be drawn.
     */
    'None' |
    /**
     * Draws single underline.
     */
    'Single' |
    /**
     * Draws underline for words only.
     */
    'Words' |
    /**
     * Draws double underline.
     */
    'Double' |
    /**
     * Draws dotted underline.
     */
    'Dotted' |
    /**
     * Draws thick underline.
     */
    'Thick' |
    /**
     * Draws dash underline.
     */
    'Dash' |
    /**
     * Draws dash long underline.
     */
    'DashLong' |
    /**
     * Draws dot dash underline.
     */
    'DotDash' |
    /**
     * Draws dot dot dash underline.
     */
    'DotDotDash' |
    /**
     * Draws wavy underline.
     */
    'Wavy' |
    /**
     *  Draws dotted heavy underline.
     */
    'DottedHeavy' |
    /**
     * Draws dash heavy underline.
     */
    'DashHeavy' |
    /**
     * Draws dash long heavy underline.
     */
    'DashLongHeavy' |
    /**
     * Draws dot dash heavy underline.
     */
    'DotDashHeavy' |
    /**
     * Draws dot dot dash heavy underline.
     */
    'DotDotDashHeavy' |
    /**
     * Draws wavy heavy underline.
     */
    'WavyHeavy' |
    /**
     * Draws wavy double underline.
     */
    'WavyDouble';

/**
 * Enum strikethrough for character format
 */
export type Strikethrough =
    /**
     * No strike will be drawn.
     */
    'None' |
    /**
     * Draws single strike.
     */
    'SingleStrike' |
    /**
     * Draws double strike.
     */
    'DoubleStrike';

/**
 * Enum baseline alignment for character format
 */
export type BaselineAlignment =
    /**
     * Specifies the text to be rendered normally.
     */
    'Normal' |
    /**
     * Specifies the text to appear above the baseline of text.
     */
    'Superscript' |
    /**
     * Specifies the text to appear below the baseline of text.
     */
    'Subscript';

/**
 * Enum highlight color for character format
 */
export type HighlightColor =
    /**
     * No highlight color will be applied.
     */
    'NoColor' |
    /**
     * Highlights the content with yellow (#ffffff00) color.
     */
    'Yellow' |
    /**
     * Highlights the content with bright green (#ff00ff00) color.
     */
    'BrightGreen' |
    /**
     * Highlights the content with turquoise (#ff00ffff) color.
     */
    'Turquoise' |
    /**
     * Highlights the content with pink (#ffff00ff) color.
     */
    'Pink' |
    /**
     * Highlights the content with blue (#ff0000ff) color.
     */
    'Blue' |
    /**
     *  Highlights the content with red (#ffff0000) color.
     */
    'Red' |
    /**
     *  Highlights the content with dark blue (#ff000080) color.
     */
    'DarkBlue' |
    /**
     * Highlights the content with teal (#ff008080) color.
     */
    'Teal' |
    /**
     * Highlights the content with green (#ff008000) color.
     */
    'Green' |
    /**
     * Highlights the content with violet (#ff800080) color.
     */
    'Violet' |
    /**
     * Highlights the content with dark red (#ff800000) color.
     */
    'DarkRed' |
    /**
     * Highlights the content with dark yellow (#ff808000)  color.
     */
    'DarkYellow' |
    /**
     * Highlights the content with gray 50 (#ff808080) color.
     */
    'Gray50' |
    /**
     * Highlights the content with gray 25 (#ffc0c0c0) color.
     */
    'Gray25' |
    /**
     * Highlights the content with black (#ff000000) color.
     */
    'Black';

/**
 * Enum LineSpacingType For Paragraph Format Preservation
 */
export type LineSpacingType =
    /**
     * The line spacing can be greater than or equal to, but never less than,
     * the value specified in the LineSpacing property.
     */
    'AtLeast' |
    /**
     * The line spacing never changes from the value specified in the LineSpacing property,
     * even if a larger font is used within the paragraph.
     */
    'Exactly' |
    /**
     * The line spacing is specified in the LineSpacing property as the number of lines.
     * Single line spacing equals 12 points.
     */
    'Multiple';
/**
 * Enum TextAlignment For Paragraph Format Preservation
 */
export type TextAlignment =
    /**
     * Text is centered within the container.
     */
    'Center' |
    /**
     * Text is aligned to the left edge of the container.
     */
    'Left' |
    /**
     * Text is aligned to the right edge of the container.
     */
    'Right' |
    /**
     * Text is justified within the container.
     */
    'Justify';
/**
 * Enum for Header Footer
 */
export type HeaderFooterType =
    /**
     * Header for even numbered pages.
     */
    'EvenHeader' |
    /**
     * Header for odd numbered pages.
     */
    'OddHeader' |
    /**
     * Footer for even numbered pages.
     */
    'EvenFooter' |
    /**
     * Footer for odd numbered pages.
     */
    'OddFooter' |
    /**
     * Header for the first page of the section.
     */
    'FirstPageHeader' |
    /**
     * Footer for the first page of the section.
     */
    'FirstPageFooter';
/**
 * Enum for List type
 */
export type ListType =
    /**
     * Specifies the none list type.
     */
    'None' |
    /**
     * Specifies the bullet list type.
     */
    'Bullet' |
    /**
     * Specifies the numbering list type.
     */
    'Numbering' |
    /**
     * Specifies the outline numbering list type.
     */
    'OutlineNumbering';
/**
 * Enum for List Level Pattern
 */
export type ListLevelPattern =
    /**
     * Specifies the default pattern for the list level.
     */
    'Arabic' |
    /**
     * Specifies the upper roman (I, II, III, ...) pattern for the list level.
     */
    'UpRoman' |
    /**
     * Specifies the lower roman (i, ii, iii, ...) pattern for the list level.
     */
    'LowRoman' |
    /**
     * Specifies the uppercase letter (A, B, C, ...) pattern for the list level.
     */
    'UpLetter' |
    /**
     * Specifies the lowercase letter (a, b, c, ...) pattern for the list level.
     */
    'LowLetter' |
    /**
     * Specifies the ordinal (1st, 2nd, 3rd, ...) pattern for the list level.
     */
    'Ordinal' |
    /**
     * Specifies the numbering (1, 2, 3, ...) pattern for the list level.
     */
    'Number' |
    /**
     * Specifies the ordinal text (First, Second, Third, ...) pattern for the list level.
     */
    'OrdinalText' |
    /**
     * Specifies the leading zero (01, 02, 03, ...) pattern for the list level.
     */
    'LeadingZero' |
    /**
     * Specifies the bullet pattern for the list level.
     */
    'Bullet' |
    /**
     * Specifies the far east pattern for the list level.
     */
    'FarEast' |
    /**
     * Specifies the special pattern for the list level.
     */
    'Special' |
    /**
     * Specifies the Japanese counting pattern for the list level.
     */
    'KanjiDigit' |
    /**
     * Specifies no pattern for the list level.
     */
    'None';
/**
 * Enum for follow character type
 */
export type FollowCharacterType =
    /**
     * Specifies the list value to be followed with a single tab.
     */
    'Tab' |
    /**
     * Specifies the list value to be followed with a single space.
     */
    'Space' |
    /**
     * Specifies the list value to be followed with no follow character.
     */
    'None';
/**
 * Enum for table alignment
 */
export type TableAlignment =
    /**
     * Aligns the table to the left.
     */
    'Left' |
    /**
     * Aligns the table to the center.
     */
    'Center' |
    /**
     * Aligns the table to the right.
     */
    'Right';
/**
 * Enum WidthType for table and cells
 */
export type WidthType =
    /**
     * Specifies the width to be determined automatically.
     */
    'Auto' |
    /**
     * Specifies the width in percentage.
     */
    'Percent' |
    /**
     * Specifies the width in points.
     */
    'Point';

/**
 * Enum for cell vertical alignment.
 */
export type CellVerticalAlignment =
    /**
     * Aligns the content to the top.
     */
    'Top' |
    /**
     * Aligns the content to the center.
     */
    'Center' |
    /**
     * Aligns the content ot the bottom.
     */
    'Bottom';
/**
 * Enum for row height type
 */
export type HeightType =
    /**
     * Specifies the height to be determined automatically.
     */
    'Auto' |
    /**
     * Specifies the least height in points.
     */
    'AtLeast' |
    /**
     * Specifies the exact height in points.
     */
    'Exactly';
/**
 * Enum for line style
 */
export type LineStyle =
    /**
     * No border.
     */
    'None' |
    /**
     * A single solid line.
     */
    'Single' |
    /**
     * Dots.
     */
    'Dot' |
    /**
     * A dash followed by a small gap.
     */
    'DashSmallGap' |
    /**
     * A dash followed by a large gap.
     */
    'DashLargeGap' | //dashed
    /**
     * A dash followed by a dot.
     */
    'DashDot' | //dotDash
    /**
     * A dash followed by two dots.
     */
    'DashDotDot' | //dotDotDash
    /**
     * Double solid lines.
     */
    'Double' |
    /**
     * Three solid thin lines.
     */
    'Triple' |
    /**
     * An internal single thin solid line surrounded by a single thick solid line with
     * a small gap between them.
     */
    'ThinThickSmallGap' |
    /**
     * An internal single thick solid line surrounded by a single thin solid line with
     * a small gap between them.
     */
    'ThickThinSmallGap' |
    /**
     * An internal single thin solid line surrounded by a single thick solid line surrounded
     * by a single thin solid line with a small gap between all lines.
     */
    'ThinThickThinSmallGap' |
    /**
     * An internal single thin solid line surrounded by a single thick solid line with
     * a medium gap between them.
     */
    'ThinThickMediumGap' |
    /**
     * An internal single thick solid line surrounded by a single thin solid line with
     * a medium gap between them.
     */
    'ThickThinMediumGap' |
    /**
     * An internal single thin solid line surrounded by a single thick solid line surrounded
     * by a single thin solid line with a medium gap between all lines.
     */
    'ThinThickThinMediumGap' |
    /**
     * An internal single thin solid line surrounded by a single thick solid line with
     * a large gap between them.
     */
    'ThinThickLargeGap' |
    /**
     * An internal single thick solid line surrounded by a single thin solid line with
     * a large gap between them.
     */
    'ThickThinLargeGap' |
    /**
     * An internal single thin solid line surrounded by a single thick solid line surrounded
     * by a single thin solid line with a large gap between all lines.
     */
    'ThinThickThinLargeGap' |
    /**
     * A single wavy solid line.
     */
    'SingleWavy' | //wave.
    /**
     * Double wavy solid lines.
     */
    'DoubleWavy' | //doubleWave.
    /**
     * A dash followed by a dot stroke, thus rendering a border similar to a barber
     * pole.
     */
    'DashDotStroked' |
    /**
     * The border appears to have a 3-D embossed look.
     */
    'Emboss3D' |
    /**
     * The border appears to have a 3-D engraved look.
     */
    'Engrave3D' |
    /**
     * The border appears to be outset.
     */
    'Outset' |
    /**
     * The border appears to be inset.
     */
    'Inset' |
    /**
     * Additional enums supported in Microsoft word in the XML level as well as by DocIO.
     */
    'Thick' |
    /**
     * Cleared border.
     */
    'Cleared';

/**
 * Enum for texture style
 */
export type TextureStyle =
    /**
     *  No shading
     */
    'TextureNone' |
    /**
     * 2.5 percent shading.
     */
    'Texture2Pt5Percent' |
    /**
     * 5 percent shading.
     */
    'Texture5Percent' |
    /**
     * 7.5 percent shading.
     */
    'Texture7Pt5Percent' |
    /**
     * 10 percent shading.
     */
    'Texture10Percent' |
    /**
     * 12.5 percent shading.
     */
    'Texture12Pt5Percent' |
    /**
     * 15 percent shading.
     */
    'Texture15Percent' |
    /**
     * 17.5 percent shading.
     */
    'Texture17Pt5Percent' |
    /**
     * 20 percent shading.
     */
    'Texture20Percent' |
    /**
     * 22.5 percent shading.
     */
    'Texture22Pt5Percent' |
    /**
     * 25 percent shading.
     */
    'Texture25Percent' |
    /**
     * 27.5 percent shading.
     */
    'Texture27Pt5Percent' |
    /**
     * 30 percent shading.
     */
    'Texture30Percent' |
    /**
     * 32.5 percent shading.
     */
    'Texture32Pt5Percent' |
    /**
     * 35 percent shading.
     */
    'Texture35Percent' |
    /**
     * 37.5 percent shading.
     */
    'Texture37Pt5Percent' |
    /**
     * 40 percent shading.
     */
    'Texture40Percent' |
    /**
     * 42.5 percent shading.
     */
    'Texture42Pt5Percent' |
    /**
     * 45 percent shading.
     */
    'Texture45Percent' |
    /**
     * 47.5 percent shading.
     */
    'Texture47Pt5Percent' |
    /**
     * 50 percent shading.
     */
    'Texture50Percent' |
    /**
     * 52.5 percent shading.
     */
    'Texture52Pt5Percent' |
    /**
     * 55 percent shading.
     */
    'Texture55Percent' |
    /**
     * 57.5 percent shading.
     */
    'Texture57Pt5Percent' |
    /**
     * 60 percent shading.
     */
    'Texture60Percent' |
    /**
     * 62.5 percent shading.
     */
    'Texture62Pt5Percent' |
    /**
     * 65 percent shading.
     */
    'Texture65Percent' |
    /**
     * 67.5 percent shading.
     */
    'Texture67Pt5Percent' |
    /**
     * 70 percent shading.
     */
    'Texture70Percent' |
    /**
     * 72.5 percent shading.
     */
    'Texture72Pt5Percent' |
    /**
     * 75 percent shading.
     */
    'Texture75Percent' |
    /**
     * 77.5 percent shading.
     */
    'Texture77Pt5Percent' |
    /**
     * 80 percent shading.
     */
    'Texture80Percent' |
    /**
     * 82.5 percent shading.
     */
    'Texture82Pt5Percent' |
    /**
     * 85 percent shading.
     */
    'Texture85Percent' |
    /**
     * 87.5 percent shading.
     */
    'Texture87Pt5Percent' |
    /**
     * 90 percent shading.
     */
    'Texture90Percent' |
    /**
     * 92.5 percent shading.
     */
    'Texture92Pt5Percent' |
    /**
     * 95 percent shading.
     */
    'Texture95Percent' |
    /**
     * 97.5 percent shading.
     */
    'Texture97Pt5Percent' |
    /**
     * Solid shading.
     */
    'TextureSolid' |
    /**
     * Dark horizontal shading.
     */
    'TextureDarkHorizontal' |
    /**
     * Dark vertical shading.
     */
    'TextureDarkVertical' |
    /**
     * Dark diagonal down shading.
     */
    'TextureDarkDiagonalDown' |
    /**
     * Dark diagonal up shading.
     */
    'TextureDarkDiagonalUp' |
    /**
     * Dark horizontal cross shading.
     */
    'TextureDarkCross' |
    /**
     * Dark diagonal cross shading.
     */
    'TextureDarkDiagonalCross' |
    /**
     * Horizontal shading.
     */
    'TextureHorizontal' |
    /**
     * Vertical shading.
     */
    'TextureVertical' |
    /**
     * Diagonal down shading.
     */
    'TextureDiagonalDown' |
    /**
     * Diagonal up shading.
     */
    'TextureDiagonalUp' |
    /**
     * Horizontal cross shading.
     */
    'TextureCross' |
    /**
     * Diagonal cross shading.
     */
    'TextureDiagonalCross';

/**
 * Format type.
 */
export type FormatType =
    /**
     * Microsoft Word Open XML Format.
     */
    'Docx' |
    /**
     * Plain Text Format.
     */
    'Txt' |
    /**
     * Syncfusion Document Text Format.
     */
    'Sfdt'|
    /**
     * Microsoft Word Template format.
     */
    'Dotx';
/**
 * Enum for find option
 */
export type FindOption =
    /**
     * Specifies default find option; Uses case-independent, arbitrary character boundaries.
     */
    'None' |
    /**
     * Specifies the find option to match whole words only.
     */
    'WholeWord' |
    /**
     * Specifies the find option to match case sensitive.
     */
    'CaseSensitive' |
    /**
     * Specifies the find option to match case sensitive and whole words.
     */
    'CaseSensitiveWholeWord';

/**
 * WColor interface
 *
 * @private
 */
export interface WColor {
    r: number
    g: number
    b: number
}

/**
 * Enum for outline level
 */
export type OutlineLevel =
    /**
     * Outline level 1.
     */
    'Level1' |
    /**
     * Outline level 2.
     */
    'Level2' |
    /**
     * Outline level 3.
     */
    'Level3' |
    /**
     * Outline level 4.
     */
    'Level4' |
    /**
     * Outline level 5.
     */
    'Level5' |
    /**
     * Outline level 6.
     */
    'Level6' |
    /**
     * Outline level 7.
     */
    'Level7' |
    /**
     * Outline level 8.
     */
    'Level8' |
    /**
     * Outline level 9.
     */
    'Level9' |
    /**
     *  No outline level.
     */
    'BodyText';

/**
 * Specifies style type.
 */
export type StyleType =
    /**
     * Paragraph style.
     */
    'Paragraph' |
    /**
     * Character style.
     */
    'Character' |
    /**
     * Table style.
     */
    'Table';

/**
 * Specifies table row placement.
 *
 * @private
 */
export type RowPlacement =

    /**
     * Places the row above.
     */
    'Above' |

    /**
     * Places the row below.
     */
    'Below';

/**
 * Specifies table column placement.
 *
 * @private
 */
export type ColumnPlacement =
    /**
     * Places the column left.
     */
    'Left' |

    /**
     * Places the column right.
     */
    'Right';

/**
 * Specifies the tab justification.
 */
export type TabJustification =
    /**
     * Bar
     */
    'Bar' |
    /**
     * Center
     */
    'Center' |
    /**
     * Decimal
     */
    'Decimal' |
    /**
     * Left
     */
    'Left' |
    /**
     * List
     */
    'List' |
    /**
     * Right
     */
    'Right';
/**
 * Specifies the tab leader.
 */
export type TabLeader =
    /**
     * None
     */
    'None' |
    /**
     * Single
     */
    'Single' |
    /**
     * Dotted
     */
    'Dot' |
    /**
     * Hyphenated
     */
    'Hyphen' |
    /**
     * Underscore
     */
    'Underscore';

/**
 * Specifies the page fit type.
 */
export type PageFitType =
    /**
     * Fits the page to 100%.
     */
    'None' |
    /**
     * Fits atleast one page in view.
     */
    'FitOnePage' |
    /**
     * Fits the page to its width in view.
     */
    'FitPageWidth';

/**
 * Specifies the context type at selection.
 */
export type ContextType =
    /**
     * Specified the curret context is in text.
     */
    'Text' |
    /**
     * Specified the curret context is in image.
     */
    'Image' |
    /**
     * Specified this curretn context is in list.
     */
    'List' |
    /**
     * Specified the curret context is in text which is inside table.
     */
    'TableText' |
    /**
     * Specified the curret context is in image which is inside table.
     */
    'TableImage' |
    /**
     * Specified the curret context is in text which is inside header.
     */
    'HeaderText' |
    /**
     * Specified the curret context is in image which is inside header.
     */
    'HeaderImage' |
    /**
     * Specified the curret context is in text which is inside table & is in header region.
     */
    'HeaderTableText' |
    /**
     * Specified the curret context is in text which is inside table & is in header region.
     */
    'HeaderTableImage' |
    /**
     * Specified the curret context is in text which is inside footer.
     */
    'FooterText' |
    /**
     * Specified the curret context is in image which is inside footer.
     */
    'FooterImage' |
    /**
     * Specified the curret context is in text which is inside table & is in footer region.
     */
    'FooterTableText' |
    /**
     * Specified the curret context is in image which is inside table & is in footer region.
     */
    'FooterTableImage' |
    /**
     * Current context is in table of contents.
     */
    'TableOfContents' |
    /**
     * Current context is in xml Mapping.
     */
    'XMLMapping'|
    /**
     * Current context is in Rich text Content control.
     */
    'RichTextContentControl' |
    /**
     * Current context is in Plain text Content control.
     */
    'PlainTextContentControl' |
    /**
     * Current context is in Picture content control.
     */
    'PictureContentControl' |
    /**
     * Current context is in Date picker content control.
     */
    'DatePickerContentControl' |
    /**
     * Current context is in Dropdown list content control.
     */
    'DropDownListContentControl' |
    /**
     * Current context is in Combobox content control.
     */
    'ComboBoxContentControl' |
    /**
     * Current context is in Checkbox content control.
     */
    'CheckBoxContentControl';

/**
 * Specifies the border type to be applied.
 */
export type BorderType =
    /**
     * Outside border.
     */
    'OutsideBorders' |
    /**
     * All border.
     */
    'AllBorders' |
    /**
     * Insider borders.
     */
    'InsideBorders' |
    /**
     * Left border.
     */
    'LeftBorder' |
    /**
     * Inside vertical border.
     */
    'InsideVerticalBorder' |
    /**
     * Right border.
     */
    'RightBorder' |
    /**
     * Top border.
     */
    'TopBorder' |
    /**
     * Insider horizontal border.
     */
    'InsideHorizontalBorder' |
    /**
     * Bottom border.
     */
    'BottomBorder' |
    /**
     * No border.
     */
    'NoBorder';

/**
 * Specifies the dialog type.
 */
export type DialogType =
    /**
     * Specifies hyperlink dialog.
     */
    'Hyperlink' |
    /**
     * Specifies table dialog.
     */
    'Table' |
    /**
     * Specifies bookmark dialog.
     */
    'Bookmark' |
    /**
     * Specifies table of contents dialog.
     */
    'TableOfContents' |
    /**
     * Specifies page setup dialog.
     */
    'PageSetup' |
    /**
     * Specifies ContentControlProperties dialog.
     */
    'ContentControlProperties' |
    /**
     * * Specifies Picture Content Control dialog.
     */
    'PictureContentControl' |
    /**
     * Specifies DatePicker Content Control Dialog
     */
    'DatepickerContentControl' |
    /**
     * Specifies Columns dialog.
     */
    'Columns' |
    /**
     * Specifies list dialog.
     */
    'List' |
    /**
     * Specifies style dialog.
     */
    'Style' |
    /**
     * Specifies styles dialog.
     */
    'Styles' |
    /**
     * Specifies paragraph dialog.
     */
    'Paragraph' |
    /**
     * Specifies font dialog.
     */
    'Font' |
    /**
     * Specifies table properties dialog.
     */
    'TableProperties' |
    /**
     * Specifies borders and shading dialog.
     */
    'BordersAndShading' |
    /**
     * Specifies table options dialog.
     */
    'TableOptions' |
    /**
     * Specifies spell check dialog.
     */
    'SpellCheck';
    // /**
    //  * Specifies tab stop dialog.
    //  */
    // 'TabStop';

/**
 * Action type
 *
 * @private
 */
export type Action = 'Insert' | 'Delete' | 'BackSpace' | 'Selection' | 'MultiSelection' | 'Enter' | 'ImageResizing'
| 'ReplaceAll' | 'Cut' | 'CharacterFormat' |
'Bold' | 'Italic' | 'FontSize' | 'FontFamily' | 'HighlightColor' |
'BaselineAlignment' | 'Strikethrough' | 'Underline'
| 'InsertHyperlink'
| 'InsertBookmark' | 'InsertElements' | 'DeleteBookmark'
| 'FontColor' | 'InsertInline' | 'RemoveHyperlink'
| 'AutoFormatHyperlink'
| 'TextAlignment'
| 'LeftIndent'
| 'AfterSpacing'
| 'BeforeSpacing'
| 'RightIndent'
| 'FirstLineIndent'
| 'DifferentOddAndEvenPages'
| 'LineSpacing'
| 'LineSpacingType'
| 'SpaceAfterAuto'
| 'SpaceBeforeAuto'
| 'ListFormat'
| 'ParagraphFormat'
| 'SectionFormat'
| 'List'
| 'InsertRowAbove'
| 'InsertRowBelow'
| 'InsertTableBelow'
| 'DeleteTable'
| 'DeleteRow'
| 'DeleteColumn'
| 'InsertColumnLeft'
| 'InsertColumnRight'
| 'TableFormat'
| 'RowFormat'
| 'CellFormat'
| 'TableProperties'
| 'Paste' | 'RemoveComment' |
'DeleteCells' | 'ClearCells' | 'InsertTable' | 'RowResizing' | 'CellResizing' | 'MergeCells' | 'ClearFormat' | 'ClearCharacterFormat' |
'ClearParagraphFormat' | 'AutoList' | 'BordersAndShading'
| 'TableMarginsSelection' | 'CellMarginsSelection' | 'CellOptions' | 'TableOptions' |
'TableAlignment' | 'TableLeftIndent' | 'CellSpacing' | 'DefaultCellLeftMargin' | 'DefaultCellRightMargin'
| 'TablePreferredWidthType' | 'TablePreferredWidth' | 'CellPreferredWidthType' | 'CellPreferredWidth'
| 'DefaultCellTopMargin' | 'DefaultCellBottomMargin' | 'CellContentVerticalAlignment' | 'CellLeftMargin' | 'CellRightMargin'
| 'CellTopMargin' | 'CellBottomMargin' | 'RowHeight' | 'RowHeightType' | 'RowHeader' | 'AllowBreakAcrossPages' | 'PageHeight' |
'PageWidth' | 'LeftMargin' | 'RightMargin' | 'TopMargin' | 'BottomMargin' | 'DefaultCellSpacing'
| 'ListCharacterFormat' | 'ContinueNumbering' | 'RestartNumbering' | 'ListSelect' | 'Shading' | 'Borders' | 'TOC' | 'StyleName'
| 'ApplyStyle' | 'SectionBreak' | 'SectionBreakContinuous' | 'PageBreak' | 'IMEInput' | 'TableAutoFitToContents' | 'TableAutoFitToWindow' | 'TableFixedColumnWidth'
| 'ParagraphBidi' | 'TableBidi' | 'ContextualSpacing' | 'RestrictEditing' | 'RemoveEditRange' | 'InsertComment' | 'DeleteComment'
| 'RemoveInline' | 'DeleteAllComments' | 'InsertCommentWidget' | 'DeleteCommentWidget' | 'FormField' | 'UpdateFormField' |
'FormTextFormat' | 'Accept Change' | 'Reject Change' | 'Accept All' | 'Reject All' | 'ParaMarkTrack' | 'ParaMarkReject' |
'RemoveRowTrack' | 'AcceptTOC' | 'ClearRevisions' | 'TrackingPageBreak' | 'InsertTextParaReplace' | 'Uppercase'|'ToggleCase'|'Lowercase'|'SentenceCase'|'CapitalizeEachWord'| 'PasteColumn'|
'PasteRow' | 'PasteOverwrite' | 'PasteNested' | 'SkipCommentInline' | 'DeleteCommentInline' | 'ResolveComment'
|'TopBorder'
|'LeftBorder'
|'RightBorder'
|'BottomBorder'
|'HorizontalBorder'
|'VerticalBorder'|'ColumnBreak'
| 'DragAndDropContent' | 'LinkToPrevious' | 'GroupAction' | 'DeleteHeaderFooter' | 'EditComment' | 'TableTitle' | 'TableDescription' | 'TabStop' | 'Grouping' | 'ModifyStyle'|'InsertContentControl'|'RemoveContentControl' | 'InsertSectionBreak';
/**
 * Enum for direction
 */
export type BiDirectionalOverride =
    /**
     * None
     */
    'None' |
    /**
     * Left to Right
     */
    'LTR' |
    /**
     * Right to left
     */
    'RTL';

/**
 * Enum for table auto fit type
 */
export type AutoFitType =
    /**
     * Fit the contents respect to contents.
     */
    'FitToContents' |
    /**
     * Fit the contents respect to window/pageWidth.
     */
    'FitToWindow' |
    /**
     * Fit the contents respect to fixed column width.
     */
    'FixedColumnWidth';

/**
 * Specifies the type of protection
 *
 * @private
 */
export type ProtectionType =
    /**
     * Do not apply protection to the document.
     */
    'NoProtection' |
    /**
     * Allow read-only access to the document.
     */
    'ReadOnly' |
    /**
     * Allow form filling only.
     */
    'FormFieldsOnly' |
    /**
     * Allow only comments to be added to the document.
     */
    'CommentsOnly' |
    /**
     * Allow only revisions to be made to existing content. All the changes will be tracked.
     */
    'RevisionsOnly';

/**
 * Specifies the paste options
 */
export type PasteOptions =
    /**
     * Apply source formatting options.
     */
    'KeepSourceFormatting' |
    /**
     * Merge with existing formatting.
     */
    'MergeWithExistingFormatting' |
    /**
     * Keep text only.
     */
    'KeepTextOnly';

/**
 * Specifies the paste options for table
 *
 * @private
 */
/**
 * Represents the available options for pasting content into a table.
 *
 * - 'InsertAsRows': Insert the content as new rows.
 * - 'NestTable': Nest the content as a table within the existing table.
 * - 'InsertAsColumns': Insert the content as new columns.
 * - 'OverwriteCells': Overwrite the existing cells with the new content.
 */
export type TablePasteOptions = 'InsertAsRows' | 'NestTable' | 'InsertAsColumns' | 'OverwriteCells';

/**
 * Specifies the paste options for table
 *
 * @private
 */
export type PasteOptionSwitch = 'DefaultPaste' | 'TextOnly';

/**
 * Specifies the layout type
 */
export type LayoutType =
    /**
     * Specifies the content to be displayed in multiple pages.
     */
    'Pages' |
    /**
     * Specifies the content to be displayed continuously in single page.
     */
    'Continuous';


/**
 * Defines Predefined toolbar items.
 */
export type ToolbarItem =
    /**
     * New option in the toolbar item.
     */
    'New' |
    /**
     * Open option in the toolbar item.
     */
    'Open' |
    /**
     * Seperator in the toolbar item.
     */
    'Separator' |
    /**
     * Undo option in the toolbar item.
     */
    'Undo' |
    /**
     * Redo option in the toolbar item.
     */
    'Redo' |
    /**
     * Comments option in the toolbar item.
     */
    'Comments' |
    /**
     * Track changes option in toolbar item.
     */
    'TrackChanges' |
    /**
     * Insert image option in the toolbar item.
     */
    'Image' |
    /**
     * Insert Table option in the toolbar item.
     */
    'Table' |
    /**
     * Hyperlink option in the toolbar item.
     */
    'Hyperlink' |
    /**
     * Bookmark option in the toolbar item.
     */
    'Bookmark' |
    /**
     * Table of Contents in the toolbar item.
     */
    'TableOfContents' |
    /**
     * Header option in the toolbar item.
     */
    'Header' |
    /**
     * Footer option in the toolbar item.
     */
    'Footer' |
    /**
     * xml mapping option in the toolbar item.
     */
    'XML Mapping' |
    /**
     * PageSetup option in the toolbar item.
     */
    'PageSetup' |
    /**
     * Content Control option in the toolbar item
     */
    'ContentControl' |
    /**
     * Insert page number option in the toolbar item.
     */
    'PageNumber' |
    /**
     * Break option in the toolbar item.
     */
    'Break' |
    /**
     * Find option in the toolbar item.
     */
    'Find' |
    /**
     * Local clipboard option in the toolbar item.
     */
    'LocalClipboard' |
    /**
     * RestrictEditing option in the toolbar item.
     */
    'RestrictEditing' |
    /**
     * Form fiels option in the toolbar item.
     */
    'FormFields' |
    /**
     * Update fields options in toolbar item.
     */
    'UpdateFields'|
    /**
     * InsertFootnote option in the toolbar item.
     */
    'InsertFootnote' |
    /**
     * InsertEndnote option in the toolbar item.
     */
    'InsertEndnote';
/**
 * Specifies the type of Text formField
 *
 * @private
 */
export type TextFormFieldType = 'Text' | 'Number' | 'Date' | 'Calculation';
/**
 * Specifies the type of Checkbox formField size
 *
 * @private
 */
export type CheckBoxSizeType = 'Auto' | 'Exactly';
/**
 * Specifies the type of FormField
 *
 * @private
 */
export type FormFieldType = 'Text' | 'CheckBox' | 'DropDown';
/**
 * Specifies the type of VerticalOrigin
 *
 * @private
 */
export type VerticalOrigin = 'Margin' | 'Page' | 'Paragraph' | 'Line' | 'TopMargin' | 'BottomMargin' | 'InsideMargin' | 'OutsideMargin';
/**
 * Specifies the type of VerticalAlignment
 *
 * @private
 */
export type VerticalAlignment = 'None' | 'Top' | 'Bottom' | 'Inline' | 'Inside' | 'Outside'|'Center'|'Middle';
/**
 * Specifies the type of HorizontalOrigin
 *
 * @private
 */
export type HorizontalOrigin = 'Margin' | 'Page' | 'Column' | 'Character' | 'LeftMargin' | 'RightMargin' | 'InsideMargin' | 'OutsideMargin';
/**
 * Specifies the type of HorizontalAlignment
 *
 * @private
 */
export type HorizontalAlignment = 'None' | 'Left' | 'Center' | 'Right' | 'Inside' | 'Outside';
/**
 * Specifies the type of Line Format Type
 *
 * @private
 */
export type LineFormatType = 'None' | 'Patterned' | 'Gradient' | 'Solid';
/**
 * Specifies the type of Line Dashing
 *
 * @private
 */
export type LineDashing = 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'DashDotDot' | 'DotGEL' |
'DashGEL' | 'LongDashGEL' | 'DashDotGEL' | 'LongDashDotGEL' | 'LongDashDotDotGEL';
/**
 * Specifies the type of Auto Shape Type
 *
 * @private
 */
export type AutoShapeType = 'Rectangle' | 'RoundedRectangle' | 'StraightConnector' | 'Oval' | 'IsoscelesTriangle' | 'RightTriangle' | 'Parallelogram' | 'Trapezoid' | 'Diamond' |'RegularPentagon'|'Hexagon'| 'Heptagon'|'Octagon'|'Decagon'|'Dodecagon'| 'Chord'|'Teardrop'|'Frame'|'HalfFrame'|'L_Shape'|'Pie'|'DiagonalStripe'|'Cross'|'Plaque'|'Can'|'Cube'|'Bevel'|'Donut'|'NoSymbol'|'BlockArc'|'FoldedCorner'|'SmileyFace'|'Heart'|'LightningBolt'|'Sun'|'Moon'|'Cloud'|'Arc'|'DoubleBracket'|'DoubleBrace'|'LeftBracket'|'RightBracket'|'LeftBrace'|'RightBrace'| 'FlowChartProcess'|'FlowChartAlternateProcess'| 'FlowChartDecision'|'FlowChartData'|'FlowChartPredefinedProcess'|'FlowChartInternalStorage'|'FlowChartDocument'|'FlowChartMultiDocument'|'FlowChartTerminator'|'FlowChartPreparation'|'FlowChartManualInput'|'FlowChartManualOperation'|'FlowChartConnector'|'FlowChartOffPageConnector'|'FlowChartCard'|'FlowChartPunchedTape'|'FlowChartSummingJunction'|'FlowChartOr'|'FlowChartCollate'|'FlowChartSort'|'FlowChartExtract'|'FlowChartMerge'|'FlowChartStoredData'|'FlowChartDelay'|'FlowChartSequentialAccessStorage'|'FlowChartMagneticDisk'|'FlowChartDirectAccessStorage'|'FlowChartDisplay'|'RightArrow'|'LeftArrow'|'UpArrow'|'DownArrow'|'LeftRightArrow'|'UpDownArrow'|'QuadArrow'|'LeftRightUpArrow'|'BentArrow'|'UTurnArrow'|'LeftUpArrow'|'BentUpArrow'|'CurvedRightArrow'|'CurvedLeftArrow'|'CurvedUpArrow'|'CurvedDownArrow'|'StripedRightArrow'|'NotchedRightArrow'|'Pentagon'|'Chevron'|'RightArrowCallout'|'DownArrowCallout'|'LeftArrowCallout'|'UpArrowCallout'|'LeftRightArrowCallout'|'QuadArrowCallout'|'CircularArrow'|'MathPlus'|'MathMinus'|'MathMultiply'|'MathDivision'|'MathEqual'|'MathNotEqual'|'Explosion1'|'Explosion2'|'Star4Point'|'Star5Point'|'Star6Point'|'Star7Point'|'Star8Point'|'Star10Point'|'Star12Point'|'Star16Point'|'Star24Point'|'Star32Point'|'UpRibbon'|'DownRibbon'|'CurvedUpRibbon'|'CurvedDownRibbon'|'VerticalScroll'|'HorizontalScroll'|'Wave'|'DoubleWave'|'SnipSingleCornerRectangle'|'SnipSameSideCornerRectangle'|'SnipDiagonalCornerRectangle'|'SnipAndRoundSingleCornerRectangle'|'RoundSingleCornerRectangle'|'RoundSameSideCornerRectangle'|'RoundDiagonalCornerRectangle' | 'Unknown'| 'ElbowConnector'| 'CurvedConnector';
/**
 * Specifies the Export type of Auto Shape Type
 *
 * @private
 */
export type ExportAutoShapeType = 'roundRect'|'rect'|'straightConnector1'|'ellipse'|'triangle'|'rtTriangle'|'parallelogram'|'diamond'|'pentagon'|'hexagon'|'heptagon'|'octagon'|'decagon'|'dodecagon'|'pie'|'chord'|'teardrop'|'trapezoid'|'halfFrame'|'frame'|'corner'|'diagStripe'|'plus'|'plaque'|'can'|'cube'|'bevel'|'donut'|'noSmoking'|'blockArc'|'foldedCorner'|'smileyFace'|'heart'|'lightningBolt'|'sun'|'moon'|'cloud'|'bracketPair'|'arc'|'bracePair'|'leftBracket'|'rightBracket'|'leftBrace'|'rightBrace'|'rightArrow'|'leftArrow'|'upArrow'|'downArrow'|'leftRightArrow'|'upDownArrow'|'quadArrow'|'leftRightUpArrow'|'bentArrow'|'uturnArrow'|'leftUpArrow'|'bentUpArrow'|'curvedRightArrow'|'curvedLeftArrow'|'curvedUpArrow'|'curvedDownArrow'|'stripedRightArrow'|'homePlate'|'chevron'|'rightArrowCallout'|'downArrowCallout'|'leftArrowCallout'|'upArrowCallout'|'leftRightArrowCallout'|'quadArrowCallout'|'circularArrow'|'snip1Rect'|'snip2SameRect'|'snip2DiagRect'|'snipRoundRect'|'round1Rect'|'round2SameRect'|'round2DiagRect'|'notchedRightArrow'| 'flowChartDisplay'| 'flowChartMagneticDrum'| 'flowChartMagneticDisk'| 'flowChartMagneticTape'|
'flowChartDelay'| 'flowChartOnlineStorage'| 'flowChartMerge'| 'flowChartExtract'| 'flowChartSort'| 'flowChartCollate'| 'flowChartSummingJunction'|
'flowChartPunchedTape'| 'flowChartPunchedCard'| 'flowChartOffpageConnector'| 'flowChartOr' |'flowChartConnector'| 'flowChartManualOperation'| 'flowChartManualInput'|
'flowChartPreparation'| 'flowChartTerminator'| 'flowChartMultidocument'| 'flowChartDocument'| 'flowChartInternalStorage'| 'flowChartPredefinedProcess'|
'flowChartInputOutput'| 'flowChartDecision'| 'flowChartAlternateProcess'| 'flowChartProcess' | 'mathNotEqual'| 'mathEqual'| 'mathDivide'| 'mathMultiply'|
'mathMinus'| 'mathPlus'| 'doubleWave'| 'wave'| 'horizontalScroll'| 'verticalScroll'| 'ellipseRibbon'| 'ellipseRibbon2'| 'ribbon'| 'ribbon2'| 'star32'|
'star24'| 'star16'| 'star12'| 'star10'| 'star8'| 'star7'| 'star6'| 'star5'| 'star4'| 'irregularSeal2'| 'irregularSeal1'|'curvedConnector3'|'bentConnector3'|'textNoShape';
/**
 * Wrapping style
 *
 * @private
 */
export type TextWrappingStyle = 'Inline' | 'InFrontOfText' | 'Behind' | 'Square' | 'TopAndBottom' | 'Tight';

/**
 * Wrapping Type
 *
 * @private
 */
export type TextWrappingType = 'Both' | 'Left' | 'Right' | 'Largest';

/**
 * Form Filling Mode
 */
export type FormFillingMode = 'Inline' | 'Popup';

/**
 * Specifies the list of Formatting Exceptions
 */
export type FormattingExceptions = 'Bold' | 'Italic' | 'FontSize' | 'FontFamily' | 'HighlightColor' |
'BaselineAlignment' | 'Strikethrough' | 'Underline' | 'FontColor' | 'TextAlignment' | 'LeftIndent' | 'RightIndent' | 'LineSpacing'
| 'LineSpacingType' | 'FirstLineIndent' | 'AfterSpacing'
| 'BeforeSpacing' | 'ContextualSpacing' | 'ListFormat';

/**
 * Specifies the Content Control Widget type
 */
export type ContentControlWidgetType = 'Block' | 'Inline' | 'Row' | 'Cell';
/**
 * Specifies the Content Control type
 */
export type ContentControlType = 'BuildingBlockGallery' | 'CheckBox' | 'ComboBox' | 'Date' | 'DropDownList' | 'Group' | 'Picture'
| 'RepeatingSection' | 'RichText' | 'Text';
/**
 * Specifies collaborative editing action
 */
export type CollaborativeEditingAction = 'LockContent' | 'SaveContent' | 'UnlockContent';
/**
 * Specifies comment action
 */
export type CommentAction = 'Delete' | 'Reply' | 'Edit' | 'Resolve' | 'Reopen' | 'Post';
/**
 * Specifies the Footnote type
 */
export type FootnoteType = 'Footnote' | 'Endnote';
/**
 * Specifies the Restart index for footnote
 */
export type FootnoteRestartIndex = 'DoNotRestart' | 'RestartForEachSection' | 'RestartForEachPage';
/**
 * Specifies the Footnote and Endnote number format
 */
export type FootEndNoteNumberFormat = 'Arabic' | 'UpperCaseRoman' | 'LowerCaseRoman' | 'UpperCaseLetter' | 'LowerCaseLetter';

/**
 * Specifies the image format to export.
 */
export type ImageFormat = 'Png' | 'Jpeg';

/**
 * Represents the compatibility mode of the document.
 */
export type CompatibilityMode =
/**
 * Specifies the Word 2003 compatibility mode.
 */
'Word2003' |
/**
 * Specifies the Word 2007 compatibility mode.
 */
'Word2007' |
/**
 * Specifies the Word 2010 compatibility mode.
 */
'Word2010' |
/**
 * Specifies the Word 2013 compatibility mode.
 */
'Word2013';
/**
 * Specifies the revision type.
 */
export type RevisionActionType =
/**
 * Specifies the accept action.
 */
'Accept' |
/**
 * Specifies the reject action.
 */
'Reject';


/**
 * @private
 */
export enum CharacterRangeType {
    LeftToRight = 0,
    RightToLeft = 1,
    WordSplit = 2,
    Number = 4,
    Tab = 6
}

/**
 * @private
 */
export enum FontScriptType {
    English = 0, // Consider as Default.
    Hindi = 1,
    Korean = 2,
    //To-Do : Should split the chinese script as "Simplified" and "Traditional".
    Chinese = 3,
    Arabic = 4,
    Hebrew = 5,
    Japanese = 6,
    Thai = 7
    //To-Do : Should add a enum field for other known scripts. Such as Tamil, Malayalam, Telugu, etc.
}
/**
 * @private
 */
export enum FontHintType {
    //0x00 - default
    Default = 0,
    //0x01 - eastAsia
    EastAsia = 1,
    //0x02 - cs
    CS = 2
}
/**
 * Specifies the server action types.
 */
export type ServerActionType = 'Import' | 'RestrictEditing' | 'SpellCheck' | 'SystemClipboard';
/**
 * @private
 */
export enum LocaleId {
    /**
     * African.
     */
    af_ZA = 1078,
    /**
     * Albanian.
     */
    sq_AL = 1052,
    /**
     * Amharic.
     */
    am_ET = 1118,
    /**
     * Alsatian.
     */
    gsw_FR = 1156,
    /**
     * Arabic Algerian.
     */
    ar_DZ = 5121,
    // /**
    //  * Arabic Bahraini.
    //  */
    ar_BH = 15361,
    /**
     * Arabic Egyptian.
     */
    ar_EG = 3073,
    /**
     * Arabic Iraqi.
     */
    ar_IQ = 2049,
    /**
     * Arabic Jordanian.
     */
    ar_JO = 11265,
    /**
     * Arabic Kuwaiti.
     */
    ar_KW = 13313,
    /**
     * Arabic Lebanese.
     */
    ar_LB = 12289,
    /**
     * Arabic Libyan.
     */
    ar_LY = 4097,
    /**
     * Arabic Moroccan.
     */
    ar_MA = 6145,
    // /**
    //  * Arabic Omani.
    //  */
    ar_OM = 8193,
    // /**
    //  * Arabic Qatari.
    //  */
    ar_QA = 16385,
    /**
     * Arabic Saudi.
     */
    ar_SA = 1025,
    /**
     * Arabic Syrian.
     */
    ar_SY = 10241,
    /**
     * Arabic Tunisian.
     */
    ar_TN = 7169,
    /**
     * Arabic United Arab Emirates.
     */
    ar_AE = 14337,
    /**
     * Arabic Yemeni.
     */
    ar_YE = 9217,
    /**
     * Armenian.
     */
    hy_AM = 1067,
    /**
     * Assamese.
     */
    as_IN = 1101,
    // /**
    //  * Azeri Cyrillic.
    //  */
    az_Cyrl_AZ = 2092,
    // /**
    //  * Azeri Latin.
    //  */
    az_Latn_AZ = 1068,
    // /**
    //  * Bashkir.
    //  */
    ba_RU = 1133,
    /**
     * Basque.
     */
    eu_ES = 1069,
    // /**
    //  * Belarusian.
    //  */
    be_BY = 1059,
    /**
     * Bengali (Bangladesh).
     */
    bn_BD = 2117,
    /**
     * Bengali (India).
     */
    bn_IN = 1093,
    /**
     * Bosnian (Cyrillic, Bosnia and Herzegovina).
     */
    bs_Cyrl_BA = 8218,
    /**
     * Bosnian (Bosnia/Herzegovina).
     */
    bs_Latn_BA = 5146,
    /**
     * Bulgarian.
     */
    bg_BG = 1026,
    /**
     * Breton.
     */
    br_FR = 1150,
    /**
     * Burmese.
     */
    my_MM = 1109,
    /**
     * Catalan.
     */
    ca_ES = 1027,
    /**
     * Cherokee - United States.
     */
    chr_US = 1116,
    // /**
    //  * Chinese - Hong Kong SAR.
    //  */
    zh_HK = 3076,
    // /**
    //  * Chinese - Macao SAR.
    //  */
    zh_MO = 5124,
    /**
     * Chinese - People's Republic of China.
     */
    zh_CN = 2052,
    /**
     * Chinese - Singapore.
     */
    zh_SG = 4100,
    /**
     * Chinese - Taiwan.
     */
    zh_TW = 1028,
    /**
     * Corsican.
     */
    co_FR = 1155,
    /**
     * Croatian (Bosnia/Herzegovina).
     */
    hr_BA = 4122,
    /**
     * Croatian.
     */
    hr_HR = 1050,
    /**
     * Czech.
     */
    cs_CZ = 1029,
    /**
     * Danish.
     */
    da_DK = 1030,
    /**
     * Dari.
     */
    prs_AF = 1164,
    // /**
    //  * Divehi.
    //  */
    dv_MV = 1125,
    /**
     * Dutch - Belgium.
     */
    nl_BE = 2067,
    /**
     * Dutch - Netherlands.
     */
    nl_NL = 1043,
    // /**
    //  * Edo.
    //  */
    bin_NG = 1126,
    /**
     * Estonian.
     */
    et_EE = 1061,
    /**
     * English - Australia.
     */
    en_AU = 3081,
    /**
     * English - Belize.
     */
    en_BZ = 10249,
    /**
     * English - Canada.
     */
    en_CA = 4105,
    /**
     * English - Caribbean.
     */
    en_029 = 9225,
    // /**
    //  * English - Hong Kong SAR.
    //  */
    en_HK = 15369,
    /**
     * English - India.
     */
    en_IN = 16393,
    /**
     * English - Indonesia.
     */
    en_ID = 14345,
    /**
     * English - Ireland.
     */
    en_IE = 6153,
    /**
     * English - Jamaica.
     */
    en_JM = 8201,
    /**
     * English - Malaysia.
     */
    en_MY = 17417,
    /**
     * English - New Zealand.
     */
    en_NZ = 5129,
    /**
     * English - Philippines.
     */
    en_PH = 13321,
    /**
     * English - Singapore.
     */
    en_SG = 18441,
    /**
     * English - South Africa.
     */
    en_ZA = 7177,
    /**
     * English - Trinidad.
     */
    en_TT = 11273,
    /**
     * English - United Kingdom.
     */
    en_GB = 2057,
    /**
     * English - United States.
     */
    en_US = 1033,
    /**
     * English - Zimbabwe.
     */
    en_ZW = 12297,
    // /**
    //  * Faroese.
    //  */
    fo_FO = 1080,
    /**
     * Filipino.
     */
    fil_PH = 1124,
    /**
     * Finnish.
     */
    fi_FI = 1035,
    /**
     * French - Belgium.
     */
    fr_BE = 2060,
    /**
     * French - Cameroon.
     */
    fr_CM = 11276,
    /**
     * French - Canada.
     */
    fr_CA = 3084,
    /**
     * French - Democratic Rep. of Congo.
     */
    fr_CD = 9228,
    // /**
    //  * French - Cote d'Ivoire.
    //  */
    fr_CI = 12300,
    /**
     * French - France.
     */
    fr_FR = 1036,
    /**
     * French - Haiti.
     */
    fr_HT = 15372,
    /**
     * French - Luxembourg.
     */
    fr_LU = 5132,
    /**
     * French - Mali.
     */
    fr_ML = 13324,
    /**
     * French - Monaco.
     */
    fr_MC = 6156,
    /**
     * French - Morocco.
     */
    fr_MA = 14348,
    /**
     * French - Reunion.
     */
    fr_RE = 8204,
    /**
     * French - Senegal.
     */
    fr_SN = 10252,
    /**
     * French - Switzerland.
     */
    fr_CH = 4108,
    /**
     * French - West Indies.
     */
    //fr_fr_WINDIES = 7180,
    /**
     * Frisian - Netherlands.
     */
    fy_NL = 1122,
    // /**
    //  * Fulfulde - Nigeria.
    //  */
    ff_NG = 1127,
    /**
     * Scottish Gaelic.
     */
    gd_GB = 1084,
    // /**
    //  * Galician.
    //  */
    gl_ES = 1110,
    /**
     * Georgian.
     */
    ka_GE = 1079,
    /**
     * German - Austria.
     */
    de_AT = 3079,
    /**
     * German - Germany.
     */
    de_DE = 1031,
    /**
     * German - Liechtenstein.
     */
    de_LI = 5127,
    /**
     * German - Luxembourg.
     */
    de_LU = 4103,
    /**
     * German - Switzerland.
     */
    de_CH = 2055,
    /**
     * Greek.
     */
    el_GR = 1032,
    /**
     * Guarani - Paraguay.
     */
    gn_PY = 1140,
    /**
     * Gujarati.
     */
    gu_IN = 1095,
    // /**
    //  * Greenlandic.
    //  */
    kl_GL = 1135,
    /**
     * Hausa - Nigeria.
     */
    ha_Latn_NG = 1128,
    /**
     * Hawaiian - United States.
     */
    haw_US = 1141,
    /**
     * Hebrew.
     */
    he_IL = 1037,
    /**
     * Hindi.
     */
    hi_IN = 1081,
    /**
     * Hungarian.
     */
    hu_HU = 1038,
    // /**
    //  * Ibibio - Nigeria.
    //  */
    ibb_NG = 1129,
    /**
     * Icelandic.
     */
    is_IS = 1039,
    // /**
    //  * Igbo - Nigeria.
    //  */
    ig_NG = 1136,
    /**
     * Indonesian.
     */
    id_ID = 1057,
    // /**
    //  * Inuktitut (Latin, Canada).
    //  */
    iu_Latn_CA = 2141,
    // /**
    //  * Inuktitut.
    //  */
    iu_Cans_CA = 1117,
    /**
     * Italian - Italy.
     */
    it_IT = 1040,
    /**
     * Italian - Switzerland.
     */
    it_CH = 2064,
    /**
     * Irish.
     */
    ga_IE = 2108,
    /**
     * Xhosa.
     */
    xh_ZA = 1076,
    /**
     * Zulu.
     */
    zu_ZA = 1077,
    /**
     * Kannada (India).
     */
    kn_IN = 1099,
    // /**
    //  * Kanuri - Nigeria.
    //  */
    kr_NG = 1137,
    // /**
    //  * Kashmiri.
    //  */
    ks_Deva = 2144,
    // /**
    //  * Kashmiri (Arabic).
    //  */
    ks_Arab = 1120,
    /**
     * Kazakh.
     */
    kk_KZ = 1087,
    /**
     * Khmer.
     */
    km_KH = 1107,
    // /**
    //  * Konkani.
    //  */
    kok_IN = 1111,
    /**
     * Korean.
     */
    ko_KR = 1042,
    // /**
    //  * Kyrgyz (Cyrillic).
    //  */
    ky_KG = 1088,
    // /**
    //  * K'iche.
    //  */
    qut_GT = 1158,
    // /**
    //  * Kinyarwanda.
    //  */
    rw_RW = 1159,
    /**
     * Lao.
     */
    lo_LA = 1108,
    /**
     * Latin.
     */
    la_Latn = 1142,
    /**
     * Latvian.
     */
    lv_LV = 1062,
    /**
     * Lithuanian.
     */
    lt_LT = 1063,
    // /**
    //  * Lower Sorbian (Germany).
    //  */
    dsb_DE = 2094,
    // /**
    //  * Luxembourgish.
    //  */
    lb_LU = 1134,
    // /**
    //  * FYRO Macedonian.
    //  */
    mk_MK = 1071,
    // /**
    //  * Malay - Brunei Darussalam.
    //  */
    ms_BN = 2110,
    /**
     * Malay - Malaysia.
     */
    ms_MY = 1086,
    /**
     * Malayalam.
     */
    ml_IN = 1100,
    /**
     * Maltese.
     */
    mt_MT = 1082,
    // /**
    //  * Manipuri.
    //  */
    mni_IN = 1112,
    /**
     * Maori - New Zealand.
     */
    mi_NZ = 1153,
    /**
     * Marathi.
     */
    mr_IN = 1102,
    // /**
    //  * Mapudungun.
    //  */
    arn_CL = 1146,
    /**
     * Mongolian (Cyrillic).
     */
    mn_MN = 1104,
    /**
     * Mongolian (Mongolian).
     */
    mn_Mong_CN = 2128,
    /**
     * Nepali.
     */
    ne_NP = 1121,
    /**
     * Nepali - India.
     */
    ne_IN = 2145,
    // /**
    //  * Norwegian (Bokml).
    //  */
    nb_NO = 1044,
    // /**
    //  * Norwegian (Nynorsk).
    //  */
    nn_NO = 2068,
    // /**
    //  * Occitan.
    //  */
    oc_FR = 1154,
    /**
     * Oriya.
     */
    or_IN = 1096,
    // /**
    //  * Oromo.
    //  */
    om_Ethi_ET = 1138,
    // /**
    //  * Papiamentu.
    //  */
    pap_AN = 1145,
    // /**
    //  * Pashto.
    //  */
    ps_AF = 1123,
    // /**
    //  * Farsi.
    //  */
    fa_IR = 1065,
    /**
     * Polish.
     */
    pl_PL = 1045,
    /**
     * Portuguese - Brazil.
     */
    pt_BR = 1046,
    /**
     * Portuguese - Portugal.
     */
    pt_PT = 2070,
    /**
     * Punjabi (India).
     */
    pa_IN = 1094,
    /**
     * Punjabi (Pakistan).
     */
    pa_PK = 2118,
    // /**
    //  * Quecha - Bolivia.
    //  */
    quz_BO = 1131,
    // /**
    //  * Quecha - Ecuador.
    //  */
    guz_EC = 2155,
    // /**
    //  * Quecha - Peru.
    //  */
    guz_PE = 3179,
    /**
     * Romanian.
     */
    ro_RO = 1048,
    // /**
    //  * Romanian - Moldava.
    //  */
    ro_MO = 2072,
    // /**
    //  * Rhaeto-Romanic.
    //  */
    rm_CH = 1047,
    /**
     * Russian.
     */
    ru_RU = 1049,
    // /**
    //  * Russian - Moldava.
    //  */
    ru_MO = 2073,
    // /**
    //  * Sami, Inari (Finland).
    //  */
    smn_FI = 9275,
    // /**
    //  * Sami, Lule (Norway).
    //  */
    smj_NO = 4155,
    // /**
    //  * Sami, Lule (Sweden).
    //  */
    smj_SE = 5179,
    // /**
    //  * Sami, Northern (Finland).
    //  */
    se_FI = 3131,
    // /**
    //  * Sami (Lappish).
    //  */
    se_NO = 1083,
    // /**
    //  * Sami, Northern (Sweden).
    //  */
    se_SE = 2107,
    // /**
    //  * Sami, Skolt (Finland).
    //  */
    sms_FI = 8251,
    // /**
    //  * Sami, Southern (Norway).
    //  */
    sma_NO = 6203,
    // /**
    //  * Sami, Southern (Sweden).
    //  */
    sma_SE = 7227,
    /**
     * Sanskrit - India.
     */
    sa_IN = 1103,
    /**
     * Serbian (Cyrillic, Bosnia and Herzegovina).
     */
    sr_Cyrl_BA = 7194,
    /**
     * Serbian (Cyrillic).
     */
    sr_Cyrl_CS = 3098,
    /**
     * Serbian (Latin, Bosnia and Herzegovina).
     */
    sr_Latn_BA = 6170,
    /**
     * Serbian (Latin, Serbia and Montenegro (Former)).
     */
    sr_Latn_CS = 2074,
    /**
     * Serbian (Latin).
     */
    nso_ZA = 1132,
    /**
     * Tswana.
     */
    tn_ZA = 1074,
    /**
     * Sindhi - Pakistan.
     */
    sd_Arab_PK = 2137,
    /**
     * Sindhi - India.
     */
    sd_Deva_IN = 1113,
    // /**
    //  * Sinhalese - Sri Lanka.
    //  */
    si_LK = 1115,
    /**
     * Slovak.
     */
    sk_SK = 1051,
    /**
     * Slovenian.
     */
    sl_SI = 1060,
    /**
     * Somali.
     */
    so_SO = 1143,
    /**
     * Spanish - Argentina.
     */
    es_AR = 11274,
    /**
     * Spanish - Bolivia.
     */
    es_BO = 16394,
    /**
     * Spanish - Chile.
     */
    es_CL = 13322,
    /**
     * Spanish - Colombia.
     */
    es_CO = 9226,
    /**
     * Spanish - Costa Rica.
     */
    es_CR = 5130,
    /**
     * Spanish - Dominican Republic.
     */
    es_DO = 7178,
    /**
     * Spanish - Ecuador.
     */
    es_EC = 12298,
    /**
     * Spanish - El Salvador.
     */
    es_SV = 17418,
    /**
     * Spanish - Guatemala.
     */
    es_GT = 4106,
    /**
     * Spanish - Honduras.
     */
    es_HN = 18442,
    /**
     * Spanish - Mexico.
     */
    es_MX = 2058,
    /**
     * Spanish - Nicaragua.
     */
    es_NI = 19466,
    /**
     * Spanish - Panama.
     */
    es_PA = 6154,
    /**
     * Spanish - Paraguay.
     */
    es_PY = 15370,
    /**
     * Spanish - Peru.
     */
    es_PE = 10250,
    /**
     * Spanish - Puerto Rico.
     */
    es_PR = 20490,
    /**
     * Spanish - International Sort.
     */
    es_ES = 3082,
    /**
     * Spanish - Spain (Traditional Sort).
     */
    es_ES_tradnl = 1034,
    /**
     * Spanish - United States.
     */
    es_US = 21514,
    /**
     * Spanish - Uruguay.
     */
    es_UY = 14346,
    /**
     * Spanish - Venezuela.
     */
    es_VE = 8202,
    // /**
    //  * Sutu.
    //  */
    st_ZA = 1072,
    /**
     * Swahili.
     */
    sw_KE = 1089,
    /**
     * Swedish - Finland.
     */
    sv_FI = 2077,
    /**
     * Swedish.
     */
    sv_SE = 1053,
    /**
     * Syriac.
     */
    syr_SY = 1114,
    // /**
    //  * Tajik.
    //  */
    tg_Cyrl_TJ = 1064,
    // /**
    //  * Tamazight.
    //  */
    tzm_Arab_MA = 1119,
    // /**
    //  * Tamazight (Latin).
    //  */
    tzm_Latn_DZ = 2143,
    /**
     * Tamil.
     */
    ta_IN = 1097,
    /**
     * Tatar.
     */
    tt_RU = 1092,
    /**
     * Telugu.
     */
    te_IN = 1098,
    /**
     * Thai.
     */
    th_TH = 1054,
    /**
     * Tibetan (PRC).
     */
    bo_CN = 1105,
    // /**
    //  * Tigrigna (Eritrea).
    //  */
    ti_ER = 2163,
    // /**
    //  * Tigrigna (Ethiopia).
    //  */
    ti_ET = 1139,
    // /**
    //  * Tsonga.
    //  */
    ts_ZA = 1073,
    /**
     * Turkish.
     */
    tr_TR = 1055,
    // /**
    //  * Turkmen.
    //  */
    tk_TM = 1090,
    /**
     * Uighur - China.
     */
    ug_CN = 1152,
    /**
     * Ukrainian.
     */
    uk_UA = 1058,
    // /**
    //  * Sorbian.
    //  */
    hsb_DE = 1070,
    /**
     * Urdu.
     */
    ur_PK = 1056,
    /**
     * Uzbek (Cyrillic).
     */
    uz_Cyrl_UZ = 2115,
    /**
     * Uzbek (Latin).
     */
    uz_Latn_UZ = 1091,
    // /**
    //  * Venda.
    //  */
    ve_ZA = 1075,
    /**
     * Vietnamese.
     */
    vi_VN = 1066,
    /**
     * Welsh.
     */
    cy_GB = 1106,
    // /**
    //  * Wolof.
    //  */
    wo_SN = 1160,
    /**
     * Yakut.
     */
    sah_RU = 1157,
    /**
     * Yi.
     */
    ii_CN = 1144,
    /**
     * Yiddish.
     */
    yi_Hebr = 1085,
    /**
     * Yoruba.
     */
    yo_NG = 1130,
    /**
     * Japanese.
     */
    ja_JP = 1041
}
/**
 * Specifies the type of the Section break.
 */
export enum SectionBreakType {
    /**
     * Section break with the new section beginning on the next even-numbered page.
     */
    EvenPage = 'EvenPage',
    /**
     * Section break with the new section beginning on the next page.
     */
    NewPage = 'NewPage',
    /**
     * Section break with the new section beginning on the next line of the same page.
     */
    Continuous = 'NoBreak',
    /**
     * Section break with the new section beginning on the next odd-numbered page.
     */
    OddPage = 'OddPage'
}
/**
 * Specifies the clear type of the Text Wrapping break.
 */
export type BreakClearType =
    /**
     * Specifies the text to start on next line ragrdless of any floating objects..
     */
    'None' |
    /**
     * Specifies the text to start on next text region left to right.
     */
    'Left' |
    /**
     * Specifies the text to start on next text region right to left.
     */
    'Right' |
    /**
     * Specifies the text to start on next full line.
     */
    'All';




/**
 * For internal use only.
 *
 * @private
 */
export const CONTROL_CHARACTERS: any = {
    'Tab': '\t',
    'Paragraph': '\n',
    'LineBreak': '\v',
    'PageBreak': '\f',
    'ColumnBreak': '\u000e',
    'Image': '\u0011',
    'Table': '\u0012',
    'Row': '\u0013',
    'Cell': '\u0014',
    'Marker_Start': '\u0015',
    'Marker_End': '\u0016',
    'Field_Separator': '\u0017',
    'Section_Break': '\u0018'
};
