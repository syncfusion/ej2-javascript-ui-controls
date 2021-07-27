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
     * HTML Format.
     */
    'Html' |
    /**
     * Plain Text Format.
     */
    'Txt' |
    /**
     * Syncfusion Document Text Format.
     */
    'Sfdt';
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
    'Character';

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
    'TableOfContents';

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
| 'LineSpacing'
| 'LineSpacingType'
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
| 'Paste' |
'DeleteCells' | 'ClearCells' | 'InsertTable' | 'RowResizing' | 'CellResizing' | 'MergeCells' | 'ClearFormat' | 'ClearCharacterFormat' |
'ClearParagraphFormat' | 'AutoList' | 'BordersAndShading'
| 'TableMarginsSelection' | 'CellMarginsSelection' | 'CellOptions' | 'TableOptions' |
'TableAlignment' | 'TableLeftIndent' | 'CellSpacing' | 'DefaultCellLeftMargin' | 'DefaultCellRightMargin'
| 'TablePreferredWidthType' | 'TablePreferredWidth' | 'CellPreferredWidthType' | 'CellPreferredWidth'
| 'DefaultCellTopMargin' | 'DefaultCellBottomMargin' | 'CellContentVerticalAlignment' | 'CellLeftMargin' | 'CellRightMargin'
| 'CellTopMargin' | 'CellBottomMargin' | 'RowHeight' | 'RowHeightType' | 'RowHeader' | 'AllowBreakAcrossPages' | 'PageHeight' |
'PageWidth' | 'LeftMargin' | 'RightMargin' | 'TopMargin' | 'BottomMargin' | 'DefaultCellSpacing'
| 'ListCharacterFormat' | 'ContinueNumbering' | 'RestartNumbering' | 'ListSelect' | 'Shading' | 'Borders' | 'TOC' | 'StyleName'
| 'ApplyStyle' | 'SectionBreak' | 'PageBreak' | 'IMEInput' | 'TableAutoFitToContents' | 'TableAutoFitToWindow' | 'TableFixedColumnWidth'
| 'ParagraphBidi' | 'TableBidi' | 'ContextualSpacing' | 'RestrictEditing' | 'RemoveEditRange' | 'InsertComment' | 'DeleteComment'
| 'RemoveInline' | 'DeleteAllComments' | 'InsertCommentWidget' | 'DeleteCommentWidget' | 'FormField' | 'UpdateFormField' |
'FormTextFormat' | 'Accept Change' | 'Reject Change' | 'Accept All' | 'Reject All' | 'ParaMarkTrack' | 'ParaMarkReject' |
'RemoveRowTrack' | 'AcceptTOC' | 'ClearRevisions' | 'TrackingPageBreak' | 'InsertTextParaReplace' | 'Uppercase'| 'PasteColumn'|
'PasteRow' | 'PasteOverwrite' | 'PasteNested' | 'SkipCommentInline' | 'DeleteCommentInline';
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
    'FormFieldsOnly';

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
export type TablePasteOptions = 'InsertAsRows' | 'NestTable' | 'InsertAsColumns' | 'OverwriteCells' | 'DefaultPaste';

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
     * PageSetup option in the toolbar item.
     */
    'PageSetup' |
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
export type TextFormFieldType = 'Text' | 'Number' | 'Date';
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
export type VerticalAlignment = 'None' | 'Top' | 'Center' | 'Bottom' | 'Inside' | 'Outside';
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
export type LineFormatType = 'None' | 'Solid';
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
export type AutoShapeType = 'Rectangle' | 'Oval';
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
 * Specifies the compatibility mode
 */
export type CompatibilityMode = 'Word2003' | 'Word2007' | 'Word2010' | 'Word2013';
