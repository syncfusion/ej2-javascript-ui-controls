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
 * Enum underline for character format
 */
export type Underline =
    // No underline will be drawn.
    'None' |
    // Draws single underline.
    'Single' |
    // Draws underline for words only.
    'Words' |
    // Draws double underline.
    'Double' |
    // Draws dotted underline.
    'Dotted' |
    // Draws thick underline.
    'Thick' |
    // Draws dash underline.
    'Dash' |
    // Draws dash long underline.
    'DashLong' |
    // Draws dot dash underline.
    'DotDash' |
    // Draws dot dot dash underline.
    'DotDotDash' |
    // Draws wavy underline.
    'Wavy' |
    // Draws dotted heavy underline.
    'DottedHeavy' |
    // Draws dash heavy underline.
    'DashHeavy' |
    // Draws dash long heavy underline.
    'DashLongHeavy' |
    // Draws dot dash heavy underline.
    'DotDashHeavy' |
    // Draws dot dot dash heavy underline.
    'DotDotDashHeavy' |
    // Draws wavy heavy underline.
    'WavyHeavy' |
    // Draws wavy double underline.
    'WavyDouble';

/**
 * enum strikethrough for character format
 */
export type Strikethrough =
    // No strike will be drawn.
    'None' |
    // Draws single strike.
    'SingleStrike' |
    // Draws double strike.
    'DoubleStrike';

/**
 * enum baseline alignment for character format
 */
export type BaselineAlignment =
    // Specifies the text to be rendered normally.
    'Normal' |
    // Specifies the text to appear above the baseline of text.
    'Superscript' |
    // Specifies the text to appear below the baseline of text.
    'Subscript';

/**
 * enum highlight color for character format
 */
export type HighlightColor =
    // No highlight color will be applied.
    'NoColor' |
    // Highlights the content with yellow (#ffffff00) color.
    'Yellow' |
    // Highlights the content with bright green (#ff00ff00) color.
    'BrightGreen' |
    // Highlights the content with turquoise (#ff00ffff) color.
    'Turquoise' |
    // Highlights the content with pink (#ffff00ff) color.
    'Pink' |
    // Highlights the content with blue (#ff0000ff) color.
    'Blue' |
    // Highlights the content with red (#ffff0000) color.
    'Red' |
    // Highlights the content with dark blue (#ff000080) color.
    'DarkBlue' |
    // Highlights the content with teal (#ff008080) color.
    'Teal' |
    // Highlights the content with green (#ff008000) color.
    'Green' |
    // Highlights the content with violet (#ff800080) color.
    'Violet' |
    // Highlights the content with dark red (#ff800000) color.
    'DarkRed' |
    // Highlights the content with dark yellow (#ff808000)  color.
    'DarkYellow' |
    // Highlights the content with gray 50 (#ff808080) color.
    'Gray50' |
    // Highlights the content with gray 25 (#ffc0c0c0) color.
    'Gray25' |
    // Highlights the content with black (#ff000000) color.
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
    /// <summary>
    /// Header for even numbered pages.
    /// </summary>
    'EvenHeader' |
    /// <summary>
    /// Header for odd numbered pages.
    /// </summary>
    'OddHeader' |
    /// <summary>
    /// Footer for even numbered pages.
    /// </summary>
    'EvenFooter' |
    /// <summary>
    /// Footer for odd numbered pages.
    /// </summary>
    'OddFooter' |
    /// <summary>
    /// Header for the first page of the section. 
    /// </summary>
    'FirstPageHeader' |
    /// <summary>
    /// Footer for the first page of the section. 
    /// </summary>
    'FirstPageFooter';
/**
 * Enum for List type
 */
export type ListType =
    'None' |
    'Bullet' |
    'Numbering' |
    'OutlineNumbering';
/** 
 * Enum for List Level Pattern
 */
export type ListLevelPattern =
    // Specifies the default pattern for the list level.
    'Arabic' |
    // Specifies the upper roman (I, II, III, ...) pattern for the list level.
    'UpRoman' |
    // Specifies the lower roman (i, ii, iii, ...) pattern for the list level.
    'LowRoman' |
    // Specifies the uppercase letter (A, B, C, ...) pattern for the list level.
    'UpLetter' |
    // Specifies the lowercase letter (a, b, c, ...) pattern for the list level.
    'LowLetter' |
    // Specifies the ordinal (1st, 2nd, 3rd, ...) pattern for the list level.
    'Ordinal' |
    // Specifies the numbering (1, 2, 3, ...) pattern for the list level.
    'Number' |
    // Specifies the ordinal text (First, Second, Third, ...) pattern for the list level.
    'OrdinalText' |
    // Specifies the leading zero (01, 02, 03, ...) pattern for the list level.
    'LeadingZero' |
    // Specifies the bullet pattern for the list level.
    'Bullet' |
    // Specifies the far east pattern for the list level.
    'FarEast' |
    // Specifies the special pattern for the list level.
    'Special' |
    // Specifies no pattern for the list level.
    'None';
/**
 * Enum for follow character type
 */
export type FollowCharacterType =
    /// <summary>
    /// Specifies the list value to be followed with a single tab.
    /// </summary>
    'Tab' |
    /// <summary>
    /// Specifies the list value to be followed with a single space.
    /// </summary>
    'Space' |
    /// <summary>
    /// Specifies the list value to be followed with no follow character.
    /// </summary>
    'None';
export type TableAlignment =
    // Aligns the table to the left.>
    'Left' |
    // Aligns the table to the center.
    'Center' |
    // Aligns the table to the right.
    'Right';
export type WidthType =
    // Specifies the width to be determined automatically.
    'Auto' |
    // Specifies the width in percentage.
    'Percent' |
    // Specifies the width in points.
    'Point';
export type CellVerticalAlignment =
    // Aligns the content to the top.
    'Top' |
    // Aligns the content to the center.
    'Center' |
    // Aligns the content ot the bottom.
    'Bottom';
export type HeightType =
    // Specifies the height to be determined automatically.
    'Auto' |
    // Specifies the least height in points.
    'AtLeast' |
    // Specifies the exact height in points.
    'Exactly';
export type LineStyle =
    /// <summary>
    /// No border.
    /// </summary>
    'None' |
    /// <summary>
    /// A single solid line.
    /// </summary>
    'Single' |
    /// <summary>
    /// Dots.
    /// </summary>
    'Dot' |
    /// <summary>
    /// A dash followed by a small gap.
    /// </summary>
    'DashSmallGap' |
    /// <summary>
    /// A dash followed by a large gap.
    /// </summary>
    'DashLargeGap' | //dashed
    /// <summary>
    /// A dash followed by a dot.
    /// </summary>
    'DashDot' | //dotDash
    /// <summary>
    /// A dash followed by two dots.
    /// </summary>
    'DashDotDot' | //dotDotDash
    /// <summary>
    /// Double solid lines.
    /// </summary>
    'Double' |
    /// <summary>
    /// Three solid thin lines.
    /// </summary>
    'Triple' |
    /// <summary>
    /// An internal single thin solid line surrounded by a single thick solid line with 
    /// a small gap between them.
    /// </summary>
    'ThinThickSmallGap' |
    /// <summary>
    /// An internal single thick solid line surrounded by a single thin solid line with
    /// a small gap between them.
    /// </summary>
    'ThickThinSmallGap' |
    /// <summary>
    /// An internal single thin solid line surrounded by a single thick solid line surrounded
    /// by a single thin solid line with a small gap between all lines.
    /// </summary>
    'ThinThickThinSmallGap' |
    /// <summary>
    /// An internal single thin solid line surrounded by a single thick solid line with
    /// a medium gap between them.
    /// </summary>
    'ThinThickMediumGap' |
    /// <summary>
    /// An internal single thick solid line surrounded by a single thin solid line with
    /// a medium gap between them.
    /// </summary>
    'ThickThinMediumGap' |
    /// <summary>
    /// An internal single thin solid line surrounded by a single thick solid line surrounded
    /// by a single thin solid line with a medium gap between all lines.
    /// </summary>
    'ThinThickThinMediumGap' |
    /// <summary>
    /// An internal single thin solid line surrounded by a single thick solid line with
    /// a large gap between them.
    /// </summary>
    'ThinThickLargeGap' |
    /// <summary>
    /// An internal single thick solid line surrounded by a single thin solid line with
    /// a large gap between them.
    /// </summary>
    'ThickThinLargeGap' |
    /// <summary>
    /// An internal single thin solid line surrounded by a single thick solid line surrounded
    /// by a single thin solid line with a large gap between all lines.
    /// </summary>
    'ThinThickThinLargeGap' |
    /// <summary>
    /// A single wavy solid line.
    /// </summary>
    'SingleWavy' | //wave.
    /// <summary>
    /// Double wavy solid lines.
    /// </summary>
    'DoubleWavy' | //doubleWave.
    /// <summary>
    /// A dash followed by a dot stroke, thus rendering a border similar to a barber
    /// pole.
    /// </summary>
    'DashDotStroked' |
    /// <summary>
    /// The border appears to have a 3-D embossed look.
    /// </summary>
    'Emboss3D' |
    /// <summary>
    /// The border appears to have a 3-D engraved look.
    /// </summary>
    'Engrave3D' |
    /// <summary>
    /// The border appears to be outset.
    /// </summary>
    'Outset' |
    /// <summary>
    /// The border appears to be inset.
    /// </summary>
    'Inset' |
    /// <summary>
    /// Additional enums supported in Microsoft word in the XML level as well as by DocIO.
    /// </summary>
    'Thick' |
    /// <summary>
    /// Cleared border.
    /// </summary>
    'Cleared';


export type TextureStyle =
    /// <summary>
    ///  No shading
    /// </summary>
    'TextureNone' |
    /// <summary>
    /// 2.5 percent shading.
    /// </summary>
    'Texture2Pt5Percent' |
    /// <summary>
    /// 5 percent shading.
    /// </summary>
    'Texture5Percent' |
    /// <summary>
    /// 7.5 percent shading.
    /// </summary>
    'Texture7Pt5Percent' |
    /// <summary>
    /// 10 percent shading.
    /// </summary>
    'Texture10Percent' |
    /// <summary>
    /// 12.5 percent shading.
    /// </summary>
    'Texture12Pt5Percent' |
    /// <summary>
    /// 15 percent shading.
    /// </summary>
    'Texture15Percent' |
    /// <summary>
    /// 17.5 percent shading.
    /// </summary>
    'Texture17Pt5Percent' |
    /// <summary>
    /// 20 percent shading.
    /// </summary>
    'Texture20Percent' |
    /// <summary>
    /// 22.5 percent shading.
    /// </summary>
    'Texture22Pt5Percent' |
    /// <summary>
    /// 25 percent shading.
    /// </summary>
    'Texture25Percent' |
    /// <summary>
    /// 27.5 percent shading.
    /// </summary>
    'Texture27Pt5Percent' |
    /// <summary>
    /// 30 percent shading.
    /// </summary>
    'Texture30Percent' |
    /// <summary>
    /// 32.5 percent shading.
    /// </summary>
    'Texture32Pt5Percent' |
    /// <summary>
    /// 35 percent shading.
    /// </summary>
    'Texture35Percent' |
    /// <summary>
    /// 37.5 percent shading.
    /// </summary>
    'Texture37Pt5Percent' |
    /// <summary>
    /// 40 percent shading.
    /// </summary>
    'Texture40Percent' |
    /// <summary>
    /// 42.5 percent shading.
    /// </summary>
    'Texture42Pt5Percent' |
    /// <summary>
    /// 45 percent shading.
    /// </summary>
    'Texture45Percent' |
    /// <summary>
    /// 47.5 percent shading.
    /// </summary>
    'Texture47Pt5Percent' |
    /// <summary>
    /// 50 percent shading.
    /// </summary>
    'Texture50Percent' |
    /// <summary>
    /// 52.5 percent shading.
    /// </summary>
    'Texture52Pt5Percent' |
    /// <summary>
    /// 55 percent shading.
    /// </summary>
    'Texture55Percent' |
    /// <summary>
    /// 57.5 percent shading.
    /// </summary>
    'Texture57Pt5Percent' |
    /// <summary>
    /// 60 percent shading.
    /// </summary>
    'Texture60Percent' |
    /// <summary>
    /// 62.5 percent shading.
    /// </summary>
    'Texture62Pt5Percent' |
    /// <summary>
    /// 65 percent shading.
    /// </summary>
    'Texture65Percent' |
    /// <summary>
    /// 67.5 percent shading.
    /// </summary>
    'Texture67Pt5Percent' |
    /// <summary>
    /// 70 percent shading.
    /// </summary>
    'Texture70Percent' |
    /// <summary>
    /// 72.5 percent shading.
    /// </summary>
    'Texture72Pt5Percent' |
    /// <summary>
    /// 75 percent shading.
    /// </summary>
    'Texture75Percent' |
    /// <summary>
    /// 77.5 percent shading.
    /// </summary>
    'Texture77Pt5Percent' |
    /// <summary>
    /// 80 percent shading.
    /// </summary>
    'Texture80Percent' |
    /// <summary>
    /// 82.5 percent shading.
    /// </summary>
    'Texture82Pt5Percent' |
    /// <summary>
    /// 85 percent shading.
    /// </summary>
    'Texture85Percent' |
    /// <summary>
    /// 87.5 percent shading.
    /// </summary>
    'Texture87Pt5Percent' |
    /// <summary>
    /// 90 percent shading.
    /// </summary>
    'Texture90Percent' |
    /// <summary>
    /// 92.5 percent shading.
    /// </summary>
    'Texture92Pt5Percent' |
    /// <summary>
    /// 95 percent shading.
    /// </summary>
    'Texture95Percent' |
    /// <summary>
    /// 97.5 percent shading.
    /// </summary>
    'Texture97Pt5Percent' |
    /// <summary>
    /// Solid shading.
    /// </summary>
    'TextureSolid' |
    /// <summary>
    /// Dark horizontal shading.
    /// </summary>
    'TextureDarkHorizontal' |
    /// <summary>
    /// Dark vertical shading.
    /// </summary>
    'TextureDarkVertical' |
    /// <summary>
    /// Dark diagonal down shading.
    /// </summary>
    'TextureDarkDiagonalDown' |
    /// <summary>
    /// Dark diagonal up shading.
    /// </summary>
    'TextureDarkDiagonalUp' |
    /// <summary>
    /// Dark horizontal cross shading.
    /// </summary>
    'TextureDarkCross' |
    /// <summary>
    /// Dark diagonal cross shading.
    /// </summary>
    'TextureDarkDiagonalCross' |
    /// <summary>
    /// Horizontal shading.
    /// </summary>
    'TextureHorizontal' |
    /// <summary>
    /// Vertical shading.
    /// </summary>
    'TextureVertical' |
    /// <summary>
    /// Diagonal down shading.
    /// </summary>
    'TextureDiagonalDown' |
    /// <summary>
    /// Diagonal up shading.
    /// </summary>
    'TextureDiagonalUp' |
    /// <summary>
    /// Horizontal cross shading.
    /// </summary>
    'TextureCross' |
    /// <summary>
    /// Diagonal cross shading.
    /// </summary>
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
    // Specifies default find option; Uses case-independent, arbitrary character boundaries.
    'None' |
    // Specifies the find option to match whole words only.
    'WholeWord' |
    // Specifies the find option to match case sensitive.
    'CaseSensitive' |
    // Specifies the find option to match case sensitive and whole words.
    'CaseSensitiveWholeWord';

/**
 * WColor interface
 * @private
 */
export interface WColor {
    r: number;
    g: number;
    b: number;
}
export type OutlineLevel =
    /// Outline level 1.
    'Level1' |
    /// Outline level 2.
    'Level2' |
    /// Outline level 3.
    'Level3' |
    /// Outline level 4.
    'Level4' |
    /// Outline level 5.
    'Level5' |
    /// Outline level 6.
    'Level6' |
    /// Outline level 7.
    'Level7' |
    /// Outline level 8.
    'Level8' |
    /// Outline level 9.
    'Level9' |
    /// No outline level.
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
 * @private
 */
export type RowPlacement =

    //Places the row above.
    'Above' |

    //Places the row below.
    'Below';

/**
 * Specifies table column placement.
 * @private
 */
export type ColumnPlacement =
    // Places the column left.
    'Left' |

    // Places the column right.
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
    //Specified the curret context is in text
    'Text' |
    //Specified the curret context is in image
    'Image' |
    //Specified this curretn context is in list 
    'List' |
    //Specified the curret context is in text which is inside table
    'TableText' |
    //Specified the curret context is in image which is inside table
    'TableImage' |
    //Specified the curret context is in text which is inside header
    'HeaderText' |
    //Specified the curret context is in image which is inside header
    'HeaderImage' |
    //Specified the curret context is in text which is inside table & is in header region
    'HeaderTableText' |
    //Specified the curret context is in text which is inside table & is in header region
    'HeaderTableImage' |
    //Specified the curret context is in text which is inside footer
    'FooterText' |
    //Specified the curret context is in image which is inside footer
    'FooterImage' |
    //Specified the curret context is in text which is inside table & is in footer region
    'FooterTableText' |
    //Specified the curret context is in image which is inside table & is in footer region
    'FooterTableImage' |
    //Current context is in table of contents
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
    'TableOptions';

/**
 * @private
 * Action type
 */
export type Action = 'Insert' | 'Delete' | 'BackSpace' | 'Selection' | 'MultiSelection' | 'Enter' | 'ImageResizing'
    | 'ReplaceAll' | 'Cut' | 'CharacterFormat' |
    'Bold' | 'Italic' | 'FontSize' | 'FontFamily' | 'FontColor' | 'HighlightColor' |
    'BaselineAlignment' | 'Strikethrough' | 'Underline'
    | 'InsertHyperlink'
    | 'InsertBookmark' | 'InsertElements' | 'DeleteBookmark'
    | 'Underline' | 'FontColor' | 'InsertInline' | 'RemoveHyperlink'
    | 'AutoFormatHyperlink'
    | 'TextAlignment'
    | 'LeftIndent'
    | 'AfterSpacing'
    | 'BeforeSpacing'
    | 'RightIndent'
    | 'LeftIndent'
    | 'FirstLineIndent'
    | 'LineSpacing'
    | 'LineSpacingType'
    | 'TextAlignment'
    | 'ListFormat'
    | 'ParagraphFormat'
    | 'SectionFormat'
    | 'List'
    | 'InsertRowAbove'
    | 'InsertRowBelow'
    | 'DeleteTable'
    | 'DeleteRow'
    | 'DeleteColumn'
    | 'InsertColumnLeft'
    | 'InsertColumnRight'
    | 'Paste'
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
    | 'ApplyStyle' | 'SectionBreak' | 'PageBreak' | 'IMEInput';