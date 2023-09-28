# Changelog

## [Unreleased]

## 23.1.38 (2023-09-26)

### Document Editor

#### Bug Fixes

- `#I473464` - Resolve the destroy issue in document Editor.
- `#I490198` - Resolve the Page not responding while press TAB key continuously.
- `#I494676` - Content is missing after downloading the file as docx.
- `#I495070` - Issue with cursor position and indentation when in RTL mode.
- `#I495596` - Issue with pasting from Word to the editor in RTL mode.
- `#I497629` - Issue in Exported svg image.
- `#I504069` - Document editor insert image from URL facing issue in reopening the  exported document.

## 23.1.36 (2023-09-15)

### Document Editor

#### New Features

- `#I471020` - Added support for table title and description.

## 22.2.12 (2023-09-05)

### Document Editor

#### Bug Fixes

- `#I482661` - Auto fit table with preferred width table is layouted properly in Document editor
- `#I458332` - Now, able to search a word & apply properties like alignment(left/right/center) inside shape.
- `#I494044` - Resolved the exception issue while exporting a document in server side.
- `#I485502` - Now, Date field opened properly in form filling mode.

## 22.2.11 (2023-08-29)

### Document Editor

#### Bug Fixes

- `#I479032` - Now, Application is working in IE 11.
- `#I484782` - Resolved the formatting issue occurred when converting to DOCX in Server side.
- `#I484763` - Fixed the issue editing header throws script error in console.
- `#I485502` - Fixed the issue in exporting the document with an image.
- `#I485763` - Resolved the navigation issue using Ctrl+Right key.
- `#I486538` - Fixed the issue in saving the svg image.
- `#I488148` - Now, Accept/reject work properly after stopping protection.
- `#F183848` - Fixed the issue in docx exporting.
- `#F183866` - Resolved the issue in pasting a larger image.
- `#I488197` - Resolved the issue in spellCheck.
- `#I489064` - Fixed the issue bottom text overlapped with the footer line.
- `#I489638` - Now, Doughnut chart renders properly in DocumentEditor.
- `#I490573`, `#I491902` - Now, Able to edit text file.
- `#I494011`, `#I494218` - Fixed the issue script error occurred when opening a document.

## 22.2.10 (2023-08-22)

### Document Editor

#### Bug Fixes

- `#I482625` , `#F183478` - Resolved the script error of opening a chart document.
- `#F183689` , `#F183682` - Resolved the issue while inserting svg image.
- `#I483658` - Resolved the frozen issue while loading the given document.
- `#I483659` - Fixed the issue document editor crashes when trying to edit.
- `#I483689` - Fixed the Overlapping issue while loading.
- `#I484763` - Fixed the issue of editing header throws script error in console.
- `#I485401` - Resolved the script error while downloading the document.
- `#I485791` - Fixed the overlapping issue when we do enter before the shape.
- `#I486671` - Resolved the script error occurred when scrolling.

## 22.2.9 (2023-08-15)

### Document Editor

#### Bug Fixes

- `#I482578` - Fixed the unsafe-eval error in source.
- `#I486542` - Now, the Desired Font Family present properly in selecting Dropdown.
- `#I485462` - Resolved the issue in updating font families dynamically.
- `#F183689` - Resolved the issue while inserting svg image .
- `#I483658` - Resolved the frozen issue while loading the given document.
- `#I475459` - Added sanitize for the open, copy, and paste APIs.

## 22.2.8 (2023-08-08)

### Document Editor

#### Bug Fixes

- `#I482386`, `#I486455` - Resolved the spell check issue.
- `#I482694` - Now, the table Header repeating is proper while enter new data at last row of the page.
- `#I483711` - Fixed the issue in custom style preservation and applying.
- `#I478257` - Fixed the issue in list format rendering.
- `#I484131` - Resolved the table lines missing after saving the document.
- `#I485502` - Resolved the issue in exporting the document with an image.
- `#I486096` - Now, Update field appear in the context menu.

## 22.2.7 (2023-08-02)

### Document Editor

#### Bug Fixes

- `#I480272` - Resolved the Page get Freeze issue while opening a document.
- `#I484011` - Added 1/2 px option in table properties pane width options.
- `#F183323` - Resolved the table rendering issue.
- `#I478257` - Fixed the issue in list format rendering.
- `#I479946` - Now, the tracked content is preserved properly.
- `#I479193` - Fixed the issue in opening an exported HTML file.
- `#I477577` - Resolved the script error while clicking on the field.
- `#FB44883` - Fixed the form fill pop-up rendering issues.
- `#I481912` - Fixed the image overlapping issue in the header.

## 22.2.5 (2023-07-27)

### Document Editor

#### Bug Fixes

- `#I475597` - Now, show alert Message while entering invalid hyperlink address.
- `#I473464` - Resolved the Toolbar disappear issue while destroy and re-append container instance.
- `#I478156` - Resolved the text cut issue while highlighting selected text

#### Breaking Changes

- By default, the `enableOptimizedSpellCheck` property is set to `false`. However, when you enable the `enableSpellCheck` property, the `enableOptimizedSpellCheck` is automatically enabled as well.

## 22.1.39 (2023-07-18)

### Document Editor

#### Bug Fixes

- `#I476853` - Resolved the script error while pasting content when enable track changes.
- `#I475577` - Now, text inserted correctly when setting column as left, right.
- `#I478156` - Resolved the exception throw while SaveAsBlobAsync and load in blazor.
- `#I477929` - Fixed the issue in header rendering.
- `#I476855` - Resolved the script error is thrown when deleting the tracked content.
- `#I461189` - Fixed the paste issue in Footnote content.
- `#I477905` - Resolved the Comments not highlighting issue.
- `#I477735` - Now, Properties pane has proper focus while moving mouse from the properties.

## 22.1.38 (2023-07-11)

### Document Editor

#### Bug Fixes

- `#I476430`, `#I475526` - Resolved the control freeze issue when inserting an image inside the table.
- `#I475535` - Fixed the wrong image rendering while pasting.
- `#I475151` - Resolved the time delay issue while editing the document.
- `#I471381` - Fixed the shape layout issue when do enter before the table.
- `#I477735` - Now, the properties pane has focus while moving the mouse from the properties.
- `#F182887` - Resolved the table missing issue while importing.
- `#I477569` - Fixed the formatting pane issue with Material 3 theme.

## 22.1.37 (2023-07-04)

### Document Editor

#### Bug Fixes

- `#I472778` - Fixed Console error occurred while managing options in the footer and header.
- `#I470576` - Table is now rendered properly without content overlapping issue.
- `#I471848` - The cell merging now working properly.
- `#I470071` - Resolved the Editor Stuck while giving comment.
- `#I469081` - Fixed the script error when delete the resize table.

## 22.1.36 (2023-06-28)

### Document Editor

#### Bug Fixes

- `#I462679` - Resolved performance issue occurred when inserting Text.
- `#F182725` - Resolved the table with border color below 1pt.
- `#I470871` - Resolved the issue in displaying the page number in the header section.
- `#I471871` - Resolved the drag & drop shape issue.
- `#I464996` - Resolved the table formatting issue while undoing.
- `#I466554` - Resolved the table unresponsive issue when backspacing.
- `#I473944` - Resolved the font change when exporting a document in docx format.
- `#I471205` - Resolved the issue occurred when loading a document.
- `#FB44186` - Resolved the horizontal line appears issue in the page header.
- `#F182850` - Resolved the issue in docx exporting.
- `#I469096` - Resolved the loss of original text formatting while pasting.
- `#I464759` - Resolved the issue in shape rendering.
- `#I464934` - Resolved the issue in customize the page size after inserting next page break.

## 21.2.10 (2023-06-13)

### Document Editor

#### Bug Fixes

- `#I470779` - Resolved the script error when inserting comments while restrict editing is enabled.
- `#I467632` - Resolved the Script error is thrown when opening a document after performing FindAllAsync.
- `#I444469`, `#I467461` - Resolved the Script error occurs when opening a document.
- `#I467769` - Print widow now closed properly after closing the parent window.

## 21.2.9 (2023-06-06)

### Document Editor

#### Bug Fixes

- `#I454822` - Resolved the issue occurred when performing the pasting functionality.
- `#I455887` - Resolved the Editor height is increased issue when selecting or inserting text.
- `#I461390` - Resolved the Endnote/footnote number inconsistency.
- `#F182256` - Table cell border now applying properly.
- `#I458144` - Now, Docx exporting properly.
- `#I464522` - Resolved the issue in bookmark removal when deleting table.
- `#I466742` - Resolved the text selection issue while retrieving the selected text.

## 21.2.8 (2023-05-30)

### Document Editor

#### Bug Fixes

- `#I454919` - ShowComment API is now working properly.
- `#FB43366` - when track changes is enabled, chinese letters are now properly rendered.
- `#I457517` - Resolved script error occurred when removing the content.
- `#I454821` - Resolved the issue with document parsing in the Tika server.
- `#I457688` - Resolved the selected content removing issue.
- `#I457853` - Select all content is now removed properly.
- `#I458134` - Table is now rendered properly without overlapping issue.
- `#I459215` - Resolved Black color chart appearance while exporting as Docx.
- `#I459220` - Resolved the component hanging issue on loading a document.
- `#I459229` - Delete/backspace is now working for RTL last content.
- `#I461305` - Resolved the style issue while pasting content from office 365.
- `#I453980` - When opening the exported document with chart in Document Editor is not throwing an error.
- `#I459906` - Header/Footer class is now added while converting docx/SFDT into HTML.
- `#F182457` - Resolved the style issue while pasting content from office 365.

## 21.2.6 (2023-05-23)

### Document Editor

#### Bug Fixes

- `#I455945` - Resolved the issue in Shape position.
- `#I457467` - Now, getStyle() API will return the paragraph format.
- `#I454858` - Resolved the image missing issue in footer.
- `#I451667` - Horizontal scroll bar is not update properly based on cursor position.
- `#I457039` - Resolved the console error while giving accept all.
- `#I453407` - Resolved the script error when loading the document with smileys.

#### New Features

- `#I448978` - Added preservation support for text wrapping break.
- `#F179297` - Added navigation support between the multiple comments in a single line while clicking the comment icon.
- `#I433546` - Added support to show start and end markers for restricted range.
- `#I450206` - Added support to restrict maximum number of columns when creating a table.

## 21.2.5 (2023-05-16)

### Document Editor

#### Bug Fixes

- `#I449912` - Resolved layout issue while opening document.
- `#I450342` - Resolved the wrong Font issue while opening a document.
- `#I458331` - Resolved the paragraph combine issue when insert and delete comment.
- `#I458334` - Cursor position issue is resolved when shift enter key is pressed.
- `#I449581` - Resolved the script error when loading the track changes document with author field empty
- `#I452303` - Layout issue is now not occurred when editing the document.
- `#I452150` - Resolved the hanging issue when opening the attached document.
- `#I453495` - Resolved the Overlapping issue when we do enter/page break before the shape.
- `#I453196` - Resolved the issue in when perform undo action for Arabic content
- `#I454659` - Resolved the issue occurred when performing track changes for Arabic content.
- `#I449049` - A performance issue is resolved when typing inside the table.

## 21.2.4 (2023-05-09)

### Document Editor

#### Bug Fixes

- `#I451421` - Resolved the issue with list indentation.
- `#I450834` - Resolved the Script issue while opening SFDT.
- `#I452243` - Resolved the issue with modifying the style in existing styles.
- `#I449324` - Resolved the issue occurred while exporting the document in the .docx format.

## 21.2.3 (2023-05-03)

### Document Editor

#### Bug Fixes

- `#SF-446881` - Using getFormFieldNames() methods, now form fields are retrieved in order.
- `#F181200` - Resolved Script error thrown when attempting to delete a checkbox form field.
- `#SF-448155` - Resolved the position issue while resizing table.
- `#FB42313`- Resolved Table Merge Cell & Insert Column bug.
- `#SF-449967` - Resolved the problem with the loading of the document.

## 21.1.41 (2023-04-18)

### Document Editor

#### Bug Fixes

- `#SF-447180` - Resolved Allow row to break across pages issue.
- `#SF-439301` - Resolved Textbox and picture is not preserved properly in Header.
- `#SF-442538` - Resolved the script error while updating table of contents.
- `#SF-447249` - Resolved issue in default character format.
- `#SF-447180` - Resolved Layouting issue while opening the document.
- `#SF-447117` - Resolved the issue with the replacement of the incorrect word.
- `#SF-444154` - Resolved the text is not preserved while drag and drop.
- `#SF-452497` - Resolved the script error while pasting images with text content.

## 21.1.39 (2023-04-11)

### Document Editor

#### Bug Fixes

- `#SF-442240` - Resolved the space issue while opening document.
- `#SF-446434` - Resolved the border rendering issue in first page.
- `#SF-442538` - Resolved the list number issue when updating table of contents.
- `#SF-443314` - Resolved the script errors while delete the content with track changes enabled.
- `#SF-444283` - Resolved the script error while loading mail merged document.
- `#SF-448042` - Resolved the Blank page created while printing with A5 paper.
- `#SF-434487` - Improved the cache logic in spell check for text with special character.

#### New Features

 - `#SF-438580` - Added support for the event `beforeAcceptRejectChanges` to prevent accepting or rejecting tracked changes.

## 21.1.38 (2023-04-04)

### Document Editor

#### Bug Fixes

- `#SF-440282` - Resolved an error while trying to change font for whole document.
- `#SF-441499` - Resolved the script error while opening Document.
- `#SF-438842` - Header/Footer area are now resized based on the inserted image.
- `#SF-441437` - Resolved the dropdown form field items expanding issue.

#### New Features

- `#I418721` - Added API to auto resize when the Document editor became visible.

## 21.1.37 (2023-03-29)

### Document Editor

#### Bug Fixes

- `#I438125` - Resolved the header issue when editing in different section format.
- `#I439280` - Selection is now working properly in the paragraph with indentation.
- `#I436536`, `#I435119` - Table and paragraph is not overlapped while loading the attached document.
- `#I436445` - Resolved the overlapping issue while opening the document.
- `#I446019` - Resolved the issue in opening "Dotx" format document.

## 21.1.35 (2023-03-23)

### Document Editor

#### Breaking Changes

- Starting from version v21.1.x, the SFDT file generated in Word Processor component is optimized by default to reduce the file size. Hence, the optimized SFDT files can't be directly manipulated as JSON string. Please refer the [documentation](https://ej2.syncfusion.com/documentation/document-editor/how-to/optimize-sfdt).

#### Bug Fixes

- `#425697` - Resolved the positioning and line spacing issue in shape document

#### New Features

- `#I249004`, `#I250933`, `#I256703`, `#I286287`, `#I290760`, `#I301513`, `#I313194`, `#I314827`, `#I316496`, `#I317964`, `#I320201`, `#I320872`, `#I327636`,  `#I331310`, `#I333899`, `#I334058`, `#I334929`, `#I337202`, `#I341931`, `#I341953`, `#I345929`, `#I348344`, `#I349206`, `#I349683`, `#I349895`, `#I354081`, `#I356432` - Added support for continuous section break in DocumentEditor.
- `#I422408`, `#I435125` - Optimized SFDT file to reduce the file size relative to a Docx file.
- `#I330729`, `#I256794` - Added support to display bookmark start and end in DocumentEditor.
- `#I333042`, `#I349829` - Added support disable the auto focus to DocumentEditor.
- `#I175038` - Added API to modify the predefine styles in DocumentEditor.

## 20.4.54 (2023-03-14)

### Document Editor

#### Bug Fixes

- `#I436974` - Combined the next paragraph while removing the paragraph mark.
- `#I436444` - Resolved the control hanging issue when editing inside table.
- `#I442823` - Restricted text inserting issue when restrict editing is in enabled state.

## 20.4.53 (2023-03-07)

### Document Editor

#### Bug Fixes

- `#I443034` - Resolved the font applying issue for Arabic content.
- `#I439255` - Resolved issue in "Allow spacing between the cells" check box.
- `#I438742` - Restricted editing in form field when it is disabled.

## 20.4.52 (2023-02-28)

### Document Editor

#### Bug Fixes

- `#I436133` - When inserting, the endnote order was resolved.
- `#I434491` - Resolved the Text off the page and outside the margin issue when paste the text.

## 20.4.51 (2023-02-21)

### Document Editor

#### Bug Fixes

- `#I434382` - Resolved script error thrown while clicking the New button after loading protected document.
- `#I436256` - Accept All/ Reject All  is now disappear in Read only.

## 20.4.50 (2023-02-14)

### Document Editor

#### Bug Fixes

- `#I426407` - Resolved the issue with application-level CSS inherited to the content during copy and paste operation.
- `#I430244` - Resolved the issue when cursor position is at second line start and press backspace key.
- `#I428246` - Resolved the footnote overlapping and row interchanging issue while resizing the table.
- `#I433138` - Resolved the undo issue when find and replace the text.
- `#I433139` - Resolved the typed letters are appearing twice issue.

## 20.4.49 (2023-02-07)

### Document Editor

#### Bug Fixes

- `#I426407` - Resolved the issue with application-level CSS inherited to the content during copy and paste operation.
- `#I428463` - Resolved the issue while editing in header with track changes enabled state.
- `#I420355` - Resolved the issue with page break and paragraph pagination properties preservation.
`#I371788` - Resolved the multiple spell check call triggering when enabled of initial disabled in creation.

## 20.4.48 (2023-02-01)

### Document Editor

#### Bug Fixes

- `#I426081` - Included the Footnote while printing.
- `#I426150` - Resolved the Whole Paragraph moving while entering TAB key.
- `#I425934` - Resolved the Error Message while opening the document in Ms Word.
- `#I430307` - Table is now pasted while pasting the copied table content.
- `#I430526` - Resolved the issue while comment post a comment and removing the content.

## 20.4.44 (2023-01-18)

### Document Editor

#### Bug Fixes

- `#425697` - Resolved the positioning and line spacing issue in shape document

#### New Features

- `#419514` - Added API to modify form field name

## 20.4.43 (2023-01-10)

### Document Editor

#### Bug Fixes

- `#I424682` - Resolved the issue in the delete and backspace case in bookmark start and end element.
- `#I425401` - Header is now read-only when resizing a table.

## 20.4.42 (2023-01-04)

### Document Editor

#### Bug Fixes

- `#I423889` - Resolved the text alignment issue in RTL paragraph.
- `#I423889` - Resolved the content overlapping issue in RTL paragraph
- `#F179129` - Resolved the paragraph format applying issue.
- `#I419630` - Resolved the script error while opening a document containing clustered bar chart.
- `#I422366`, `#I423320` - Resolved the script error while removing content in protected document.
- `#I424337` - Handled mouse selection inside table cell similar to Microsoft Word.
- `#F179297` - Resolved the comment icon positioning issue.

## 20.4.40 (2022-12-28)

### Document Editor

#### Bug Fixes

- `#I421680` - Resolved the paragraph overlapping and border issue while opening the attached document.
- `#I424498` - Attached document with hyperlink text is now displayed properly.
- `#I425696` - Resolved the overlap issue in options pane.

## 20.3.60 (2022-12-06)

### Document Editor

#### Bug Fixes

- `#I418719` - Resolved the issue with removing bookmark element.
- `#I420043` - Table of content (TOC) is now updated properly.

## 20.3.59 (2022-11-29)

### Document Editor

#### Bug Fixes

- `#I417535` - The page number is not updated properly while inserting TOC.
- `#I418000` , `#F178993` - Resolved the tab character width issue.

## 20.3.58 (2022-11-22)

### Document Editor

#### Bug Fixes

- `#I417708` - Comment with multiple paragraph is now exported properly.
- `#I414849` - Textbox with no outline is now exported properly.
- `#I419171` - Resolved the script error while discarding the unposted comment.
- `#I417911` - Resolved the consecutive symbol selection issue while selecting text with white spaces.
- `#I418127` - Image width and height is now resized to fit inside the page width.
- `#I417899` - Table borders are now removed when border style set as none.
- `#I417257` - Ordinal number format is now preserved properly in exported word document.
- `#F178501` - Resolved document corruption issue due to insert revision not serialized properly.

## 20.3.57 (2022-11-15)

### Document Editor

#### Bug Fixes

- `#I415922` - Resolved the browser hanging issue while opening the document.
- `#I415359` - Resolved the table layouting issue while resizing the table.
- `#I414775` - Resolved the layouting issue while inserting page break.
- `#I414224` - Table resizing is now working properly in header/footer.
- `#I413303`, `#I417629` - Resolved the script error while opening the word document.
- `#I413477` - Resolved the script error while deleting text with comment.
- `#F178063` - Scrolling on bookmark navigation is now working similar to Microsoft Word.

## 20.3.56 (2022-11-08)

### Document Editor

#### Bug Fixes

- `#FB37929` - Resolved the exception while exporting the document with duplicate character style.
- `#I412146` - Resolved the script error while opening the document.
- `#I408099` - Resolved the list numbering issue.
- `#I412284` - Table border is now rendering properly.
- `#I413316` - Resolved the script error while deleting content of few pages.
- `#I414066` - Resolved the script error while modifying locale key.
- `#I412817` - Formatting is now applied properly in track changes protection mode.
- `#I413284` - Strike through is now properly skipped for trailing space characters like Microsoft Word.
- `#I412529` - Resolved the script error while opening html document with nested list.

#### New Features

- `#I297837`, `#I336116`, `#I342219`, `#I346980`, `#F164814`, `#F168911` - Improved the display of the RTL text in a bi-directional layout.

## 20.3.52 (2022-10-26)

### Document Editor

#### Bug Fixes

- `#I410179` - Cell background color is now rendering properly.
- `#I411016` - List numbering is now rendered properly.
- `#I411008` - Paragraph border is now rendering properly.
- `#FB37770` - Resolved the script error while printing the document.
- `#I409887` - Replacing text with bookmark is now working properly.

## 20.3.50 (2022-10-18)

### Document Editor

#### Bug Fixes

- `#I410296` - Tooltip for the show/hide properties button is now updated properly.
- `#I407021` - Table properties are now reverted properly on undo/redo.
- `#I408686` - Comments pane is now switching properly while adding comment.
- `#I409821` - Resolved the next paragraph deletion issue while switching paste option.
- `#I408431` - Resolved the script error while opening the document with track changes.
- `#I409991` - Resolved the table layouting issue.
- `#I407092` - Resolved the paragraph border rendering issue.
- `#I410940` - Resolved the script error while merging cells in header/footer.

## 20.3.49 (2022-10-11)

### Document Editor

#### Bug Fixes

- `#I401609` - Resolved the curly braces preservation in RTL paragraph
- `#I400473` - Resolved the paragraph mark selection issue on shift + page up.
- `#I405251` - Resolved the script error while opening the document with duplicate style name.
- `#I398151` - Resolved the issue with accept all/reject all from track changes pane.
- `#I399611` - Paragraph formatting is now preserved properly on copy and paste.
- `#I404592` - Resolved the script error while exporting the document with content control.
- `#I405251` - Resolved the script error while opening the document with line break character.
- `#I396300` - Resolved the overlapping issue while resizing the table cell.

## 20.3.48 (2022-10-05)

### Document Editor

#### Bug Fixes

- `#I400154` - Handled selecting consecutive special character on double click.
- `#I400506` - Handled selection while navigating the page using page down/ page up.
- `#I403371` - Resolved the inline shape alignment issue.
- `#I404840` - Resolved the browser hanging issue while changing the line spacing.
- `#I401957` - Resolved the script error while inserting the table.
- `#I403238` - Newly added custom style is now updated properly in properties pane.
- `#I401826` - Resolved the pagination issue on the exported word document.
- `#I408407`. `#I403326` - Resolved the script error while deleting the content.
- `#I379655` - Newly added paragraph is now removed properly while rejecting the changes.
- `#I403248` - Resolved script error while deleting the text with comment.
- `#I401520` - Underline format is now preserved properly in exported word document.
- `#F175079` - Resolved search issue in splitted table cell.

## 20.3.47 (2022-09-29)

### Document Editor

#### New Features

- `#I345329`,`#I325944`,`#I302342`,`#I301994`,`#I258650`,`#F157122`,`#F164860` - Added support to show or hide the hidden formatting symbols like spaces, tab, paragraph marks, and breaks.

## 20.1.52 (2022-05-04)

### Document Editor

#### Bug Fixes

- `#I368653` - Resolved the Document Editor numbering continuity issue.
- `#I376374` - Resolved the exception thrown on exporting a sfdt without a metafile property in server-side.
- `#I373298` - Resolved the  extra paragraph added while updating the table of contents.
- `#I373359` - Resolved the multiples instances of table of content creation when track changes is enabled.
- `#I373451` - Resolved exception while open the document with image without relation identifier.
- `#I373159` - Resolved the console error thrown on pasting a content and then changing page orientation.
- `#I373175` - Resolved the script error thrown on deleting the revision text.
- `#I372741` - Resolved inconsistent behaviour of text selection inside an editable table cell within a read only document.
- `#I372794` - Resolved the script error while serializing sfdt document with page break to html format in server-side.
- `#I372636` - Resolved the text inside the shape with wrapping style 'in-front of text'.
- `#I372159` - Default number format for Page field is now displayed properly.
- `#I371816` - List format is now preserved properly on importing.
- `#I371644` - Table formatting is now preserved properly while copy pasting table and resolved the document hanging in copying.
- `#I370909` - Resolved the script error rendering after content delete.
- `#I369585` - Resolved the scrolling becomes quite slow while selecting the text in document with more than 20 pages.
- `#I368794` - Resolved the tab space issue.
- `#I366157`, `#I367362` - Resolved the table rendering issue at the bottom of the page.
- `#I293527` - Justify paragraph layout issue in new page first paragraph is now resolved.
- `#I373340` - Resolved the content hanging issue while opening the attached document.
- `#I372431` - Resolved the table misalignment issue if the table has positioning properties.

## 20.1.51 (2022-04-26)

### Document Editor

#### Bug Fixes

- `#I361566`, `#I372584` - Resolved the wrapping style issue in header/footer.
- `#I373016` - Resolved the script error in accepting the revision inside the table.
- `#I370714` - Resolved the character format updating issue.
- `#I364803` - Resolved the track changes to empty page.
- `#I356022` - Resolved the wrong comma placing in Hebrew language.
- `#I368816` - Resolved the pie chart rendering and exporting issue.

## 20.1.50 (2022-04-19)

### Document Editor

#### Bug Fixes

- `#I374477` - Resolved the script error in XmlHttpRequest in lock and edit.
- `#I372421` - Resolved issues in insert row/column paragraph format inheritance from previous paragraph.
- `#IF173898` - Resolved the highlight color is not preserved in copy/paste.

## 20.1.48 (2022-04-12)

### Document Editor

#### Bug Fixes

- `#I374325`, `#I374720` - Resolved the text input issue replacing the selected text.
- `#I366806` - Resolved the content overlapping issue.
- `#I360442`, `#I372285` - Resolved the add to dictionary context item localization issue.
- `#I368653` - Resolved the numbering continuity issue.
- `#I368442` - Resolved the table of content alignment issue.
- `#I369908` - Resolved the alignment issue in the header.
- `#I368287` - Resolved the rendering issue for font family with number in canvas element.
- `#I368056` - Resolved the newly inserted footnote content style issue.
- `#I365347` - Resolved the paste content in between a paragraph.
- `#I366850` - Resolved the script error in DocumentEditorContainer component destroy.
- `#I368658` - Resolved the script error in pasting the content.
- `#F171582`, `#F173213` - Resolved the color preservation issue in pasting the highlighted cell from excel.
- `#F173430` - Resolved the delay in filling a document with large number of form fields.
- `#I370428` - Resolved the script error in replacing the text.
- `#I370305` - Resolved the cropped image rendering issue.
- `#I368292` - Resolved the empty merge field layout issue.
- `#I369092` - Indentation behaviour for numbered list is updated.

## 20.1.47 (2022-04-04)

### Document Editor

#### Bug Fixes

- `#I367457` - Resolved the nested table content positioning issue.
- `#I365347` - Copied content is now pasted properly in between the paragraph.
- `#I361140` - Resolved the script error in inserting footnote content.
- `#I366968` - Newly added table row border is now exported properly in server-side word export.
- `#I366806` - Resolved the content overlapping issue with wrapped shape.
- `#I363360` - Resolved the new window sample dialog height issue.

#### New Features

- `#I348441` - Added support for adding SVG image in a Word document.
- `#I348727` - Added support for setting automatic space before and after a paragraph in a Word document.
- `#I268209` - Added support for restricting documents with comments only protection type.
- `#I363489` - Improved the performance of the server-side spell check library.

## 19.4.56 (2022-03-15)

### Document Editor

#### Bug Fixes

- `#SF-366157`, `#SF-367362` - Table in the end of the page is now rendered properly.
- `#SF-365958` - Resolved the issue in track change undo/redo.
- `#SF-366627` - Resolved the script error in the inline form fill mode.
- `#SF-367474`, `#SF-367493` - Resolved the line breaking issue in keep text only mode pasting.
- `#SF-366968` - Table border is now exported properly in server-side word export.
- `#SF-361925` - Resolved the script error in creating consecutive styles.
- `#SF-366592` - Resolved the number format issue in decreasing the indent.

## 19.4.55 (2022-03-08)

### Document Editor

#### Bug Fixes

- `#SF-368151` - Resolved the upper case function in localization.
- `#SF-367003` - Text is congested after using numbering is resolved.
- `#SF-366157` - Resolved the multi level list restart numbering issue.
- `#SF-365713` - Resolved the table layout issue in compatibility mode.
- `#SF-354038` - Resolved the script error in exporting document with large.
- `#SF-364803` - Resolved the track changes to empty page.
- `#F172160` - Resolved the editing the document after inserting table of contents.
- `#SF-367119` - Resolved the script error while loading a document.
- `#SF-369375` - Resolved the revision duplication in loading document with track changes.
- `#SF-365347` - Resolved the copy/paste for match destination formatting.
- `#SF-366101` - Resolved the font size binding issue in font dialog.
- `#SF-362395` - Resolved the table delete issue when track changes is enabled.
- `#SF-359599` - Resolved the empty paragraph track changes not showing in track changes pane.
- `#SF-361140` - Endnote splitting issue to new page is resolved.
- `#SF-367119` - Resolved the script error in opening document with shapes.

## 19.4.54 (2022-03-01)

### Document Editor

#### Bug Fixes

- `#SF-365347` - Resolved the copy/paste for match destination formatting.
- `#SF-366101` - Resolved the font size binding issue in font dialog.
- `#SF-362395` - Resolved the table delete issue when track changes is enabled.
- `#SF-359599` - Resolved the empty paragraph track changes not showing in track changes pane.
- `#SF-361140` - Endnote splitting issue to new page is resolved.
- `#SF-367119` - Resolved the script error in opening document with shapes.

## 19.4.53 (2022-02-22)

### Document Editor

#### Bug Fixes

- `#F172362` - Resolved the script error in removing form field
- `#SF-363487` - Resolved the spell check call triggering issue along with spell check by page.
- `#SF-365295` - Comment and track changes date time is now compatible with MS Word.
- `#SF-363790` - Resolved the performance issue in selection when focus moves out for Document editor.
- `#SF-293910` - Comment operation is are restricted in the read only mode.
- `#F171981` - Resolved the `beforeFormFieldFill` event triggering issue keyboard navigation.
- `#SF-363546` - Resolved the script error in deleting the table with the bookmark.
- `#FB31160` - Resolved the empty lines tracked changes.
- `#SF-364322`, `#SF-365061` - Resolved the high light colour exporting issue in server-side saving.
- `#FB32346` - Resolved the script error in deleting the image in spell check enabled mode.

## 19.4.52 (2022-02-15)

### Document Editor

#### Bug Fixes

- `#SF-356242`, `#SF-364511` - Resolved the character format and paragraph format in inserting new row and column.
- `#SF-363021` - Resolved the bullet list copy paste issue.
- `#SF-363285` - Resolved the bulleted list deletion issue inside table.
- `#SF-362395` - Resolved the table delete issue when track changes is enabled.
- `#F171944` - Resolved the document scrolling issue.
- `#SF-361169` - Resolved the pasting issue in large non-formatted content.
- `#SF-356384` - Resolved the merged cell rendering issue.
- `#SF-355425` - Resolved the relayout issue in editing wrapped table editing.
- `#SF-352941` - Resolved the table border rendering.
- `#SF-353976` - Resolved the table merged cells rendering issue.

#### New Features

- `#F168557` - Added support for insert new paragraph using \r\n, \r, \n
- `#SF-358641` - Added API to get/set field information.

## 19.4.50 (2022-02-08)

### Document Editor

#### Bug Fixes

- `#F171012` - Character style is now applied properly.
- `#SF-361141` - Resolved the endnote number format rendering issue.
- `#SF-359056` - Resolved the hanging issue in loading document with hebrew text.
- `#SF-352586`, `#F170330` - Resolved the track changes and restrict editing region issues in header/footer.
- `#SF-364411` - Resolved the image height and width serialization issue in server-side exporting.
- `#SF-361566` - Resolved the wrapping style issue in header/footer.
- `#SF-361147` - Resolved the relayout issue in footnote moving to next page.
- `#SF-361532` - Resolved the strike through applying issue for bulleted list.
- `#F171673`, `#SF-362944` - Resolved the comments pane opening issue in editing.
- `#SF-361056`, `#SF-364408` - Resolved the empty revision loading issue track changes pane.

## 19.4.48 (2022-01-31)

### Document Editor

#### Bug Fixes

- `#SF-355895` - Resolved the stacked column rendering issue.
- `#SF-359392` - Resolved the pie chart color rendering issue.
- `#F171212` - Resolved the section format copy/paste issue.
- `#SF-359809` - Table formatting is not applied properly.
- `#SF-359914` - Resolved the nested table height issue.
- `#SF-362938` - Resolved the spell check shows error for correct word after backspace/delete.
- `#SF-358997` - Resolved the script error in selection when first page of the document filled with shape with image and wrapping style.
- `#SF-361108` - Resolved the script error in the copy/paste.
- `#FB29987` - Resolved the table layouting issue in conversion from HTML to Document.
- `#SF-362365` - Resolved the modifying level in drop down.
- `#SF-363485` - Resolved the preferred width type mismatch in server-side SFDT to Docx conversion.
- `#F171941` - Resolved the insert page break in optimized spell check mode.
- `#SF-359775` - Column Clustered is not rendered properly.
- `#SF-359392` - Resolved the default chart color applied to pie chart.
- `#SF-359223` - Resolved the backspace issue in track changes.
- `#SF-356022` - Resolved the wrong comma placing in Hebrew language.
- `#SF-359056` - Resolved document hanging issue opening hebrew document.
- `#F169863`, `#SF-354348` - Resolved the server-side exporting issue in SFDT to Docx.
- `#SF-359780` - Resolved the layout issue in word 2013 justification for list applied text.
- `#SF-356294` - Resolved the extra space adding while copying and pasting text with bookmarks.
- `#SF-356242` - Resolved the style issue for the newly added rows & columns in the table.
- `#SF-358936` - Resolved the HTML Element ContentEditable property issue in DocumentEditor.
- `#SF-357051` - Resolved the element alignment issue due to page break.
- `#SF-355713` - Resolved the script error in applying restrict editing in DocumentEditorContainer.
- `#SF-354207` - Resolved the atleast line spacing type line height issue.
- `#SF-354215` - Resolved the floating elements positioning issue after update form fields.
- `#SF-357939` - Resolved the footer overlapping issue after pasting large content.
- `#SF-354644` - Resolved the overlapping issue for image with top and bottom wrapping style in header.
- `#SF-358814` - Document with applied list format is exported properly.
- `#F171012` - Resolved the script error in applying the list format to character style applied text.
- `#SF-358474` - Resolved the header/footer tooltip and toolbar item text wrap issue when localized.
- `#SF-358523` - Resolved the status bar and font family style issue when localized.
- `#SF-356958` - Resolved the misalignment after list applying.
- `#SF-355425` - Resolved the auto fit table with preferred with type 'Point' is now layouted properly.
- `#SF-359606` - Resolved the default tab width calculation with tab stop.
- `#SF-355860` - Resolved the tab element layout issue in footer.
- `#SF-359156` - Resolved the cropped image issue rendering in header/footer.
- `#SF-354038` - Resolved the performance issue in inserting table more rows.
- `#SF-354463` - Resolved the crashing issue in splitting rows in rendering table.
- `#SF-353961` - Resolved the performance issue in editing document with merge field.
- `#SF-355429` - Resolved selection issue for the shape with in front of text wrapping.
- `#SF-360442` - Resolved the spell check suggestion replace issue in localized document editor.
- `#F171032` - Resolved the empty line adding in text exporting.
- `#F171461` - Resolved the content control preservation issue in exporting.
- `#I347750` - Resolved the hanging issue when pasting large non-formatted content.
- `#I349289`, `#I349128` - Resolved the endnote shifting and overlapping issue.
- `#F171307` - Resolved the track changes issue in editing paragraph inside table.
- `#SF-356951`, `#F170963`, `#SF-351886`, `#SF-359815`, `#SF-359312` - Resolved the merged cell width rendering issue.
- `#I347523` - Resolved the invalid SFDT generation after pasting formatted content.
- `#SF-357703` - Resolved the table row splitting issue.

#### New Features

- `#SF-354038` - Added API to restrict the maximum number of rows in insert table dialog(`DocumentEditorSettings.maximumRows`)
- `#SF-348990` - Added screen tip support for hyperlink.

## 19.4.47 (2022-01-25)

### Document Editor

#### Bug Fixes

- `#FB29987` - Resolved the table layouting issue in conversion from HTML to Document.
- `#SF-362365` - Resolved the modifying level in drop down.
- `#SF-363485` - Resolved the preferred width type mismatch in server-side SFDT to Docx conversion.
- `#F171941` - Resolved the insert page break in optimized spell check mode.
- `#SF-359775` - Column Clustered is not rendered properly.
- `#SF-359392` - Resolved the default chart color applied to pie chart.
- `#SF-359223` - Resolved the backspace issue in track changes.
- `#SF-356022` - Resolved the wrong comma placing in Hebrew language.
- `#SF-359056` - Resolved document hanging issue opening hebrew document.

## 19.4.43 (2022-01-18)

### Document Editor

#### Bug Fixes

- `#F169863`, `#SF-354348` - Resolved the server-side exporting issue in SFDT to Docx.
- `#SF-359780` - Resolved the layout issue in word 2013 justification for list applied text.
- `#SF-356294` - Resolved the extra space adding while copying and pasting text with bookmarks.
- `#SF-356242` - Resolved the style issue for the newly added rows & columns in the table.
- `#SF-358936` - Resolved the HTML Element ContentEditable property issue in DocumentEditor.
- `#SF-357051` - Resolved the element alignment issue due to page break.
- `#SF-355713` - Resolved the script error in applying restrict editing in DocumentEditorContainer.
- `#SF-354207` - Resolved the atleast line spacing type line height issue.
- `#SF-354215` - Resolved the floating elements positioning issue after update form fields.
- `#SF-357939` - Resolved the footer overlapping issue after pasting large content.
- `#SF-354644` - Resolved the overlapping issue for image with top and bottom wrapping style in header.
- `#SF-358814` - Document with applied list format is exported properly.
- `#F171012` - Resolved the script error in applying the list format to character style applied text.
- `#SF-358474` - Resolved the header/footer tooltip and toolbar item text wrap issue when localized.
- `#SF-358523` - Resolved the status bar and font family style issue when localized.
- `#SF-356958` - Resolved the misalignment after list applying.
- `#SF-355425` - Resolved the auto fit table with preferred with type 'Point' is now layouted properly.
- `#SF-359606` - Resolved the default tab width calculation with tab stop.
- `#SF-355860` - Resolved the tab element layout issue in footer.
- `#SF-359156` - Resolved the cropped image issue rendering in header/footer.
- `#SF-354038` - Resolved the performance issue in inserting table more rows.

## 19.4.41 (2022-01-04)

### Document Editor

#### Bug Fixes

- `#SF-354463` - Resolved the crashing issue in splitting rows in rendering table.
- `#SF-353961` - Resolved the performance issue in editing document with merge field.
- `#SF-355429` - Resolved selection issue for the shape with in front of text wrapping.
- `#SF-360442` - Resolved the spell check suggestion replace issue in localized document editor.
- `#F171032` - Resolved the empty line adding in text exporting.
- `#F171461` - Resolved the content control preservation issue in exporting.

#### New Features

- `#SF-354038` - Added API to restrict the maximum number of rows in insert table dialog(`DocumentEditorSettings.maximumRows`)

## 19.4.40 (2021-12-28)

### Document Editor

#### Bug Fixes

- `#I347750` - Resolved the hanging issue when pasting large non-formatted content.
- `#I349289`, `#I349128` - Resolved the endnote shifting and overlapping issue.
- `#F171307` - Resolved the track changes issue in editing paragraph inside table.
- `#SF-359156` - Resolved the cropped image issue rendering in header/footer.
- `#SF-356951`, `#F170963`, `#SF-351886`, #`SF-359815`, `#SF-359312` - Resolved the merged cell width rendering issue.
- `#I347523` - Resolved the invalid SFDT generation after pasting formatted content.
- `#SF-357703` - Resolved the table row splitting issue.

## 19.4.38 (2021-12-17)

### Document Editor

#### Bug Fixes

- `#I348089` - Resolved the protected columns, rows, and cells editing issue.
- `#I344822` - Word with hyphen characters are now displayed properly.
- `#I345558` - Resolved the table layout for the nested table with position.
- `#I346408` - Table cell content reversed on undo is now resolved.
- `#I346992` - Paragraph with widow/orphan property is now displayed properly.
- `#I341119` - Document with image and table with top and bottom wrapping style is now opened properly.
- `#I344713`- Resolved table header row rendering issue.
- `#I341963`, `#I341840` - Resolved the table rendering issue.
- `#I344704` - Resolved issue with tracking changes in empty paragraph.
- `#I344351` - Line height is now calculated properly when space character has font size greater than the paragraph mark.
- `#I345759`, `#I343106`- Resolved the table border rendering issue.
- `#I343645` - Table grid after width defined as percentage type is now properly exported in server-side.
- `#I341659` - Resolved the list alignment issue.
- `#I347230` - Line spacing value zero is now properly exported in server-side.
- `#I346468` - Resolved the document corruption issue due to z-order in server-side exporting.
- `#I344830` - Resolved exception in opening and saving the document with calculation type form field.
- `#I345582`, `#I341985` - Document with tab width is now displayed properly.
- `#I346985` - Line height is now properly updated for tab character when its font size greater than other elements in the line.
- `#FB29648` - Table rows/columns in header and footer are now resized properly.
- `#I349115` - Resolved the scrolling behaviour issue when using `goToPage` API.
- `#I348516` - Table/Cell background color is preserved properly during copy/paste.
- `#I341891` - Resolved the hanging issue while editing the footnote content.
- `#I344790` - Resolved the footnote overlapping issue when editing a table.
- `#I343310` - Resolved the blank page issue in the exported Word document due to footnote.
- `#I345594` - Resolved the new style listing problem when Document editor is localized for languages other than English.
- `#I344840` - Resolved the height and width for `insertImage` API.
- `#I343403` - Resolved the script error while opening document with tracked changes and restrict editing enabled.
- `#I342774` - The Word document is now exported properly when the document contains content control.
- `#I340276` - Resolved issue with entering custom date time value for form field.
- `#I344605` - Resolved the context menu displaying issue when multiple instances of Document Editor are used in same page.
- `#I337087`, `#I344332` - Improved the suggestion construction logic for error words.
- `#I338302` - Resolved the hanging issue when opening document with table.
- `#I339240` - RTL list is now deleted properly.
- `#I340758` - The Word document is now exported properly when the document contains table with merged cells.
- `#I341140` - Tracked changes is now updated properly for the existing empty line.
- `#F167253`, `#F168269` - Track changes pane visibility issue is now resolved.
- `#F168463` - The floating element with square wrapping style is now displayed properly.
- `#I338947` - Resolved the issue with undo after pasting Hebrew text.
- `#I341435` - Optimized the content change event triggering in Document Editor.
- `#I340867` - Selection is now working properly after applying character format.
- `#I341335` - Text formatting is now preserved properly for merge fields.
- `#I339239`, `#I339242`, `#I339021` - RTL text are now arranged properly.
- `#I335659` - RTL text are now preserved properly on undo/redo.
- `#I340643` - The comment mark is now removed properly when deleting comment.
- `#I339335` - Resolved the hanging issue when editing document with Hebrew text.
- `#I340121` - Resolved the issue with rendering elbow connector as line connector.
- `#I339453` - Resolved the issue with rendering a fixed width table.
- `#I341119` - Resolved the overlapping issue for image with top and bottom wrapping inside table.
- `#I339602` – Track changes is now updated properly in header and footer.
- `#I341964`, `#I342165` – RTL text is now arranged properly when copy/paste.
- `#I339714` – Footnote order is now updated properly.
- `#I339973` - Table is now preserved properly in the exported Word document.
- `#I340795` – Field is now copied properly.
- `#I339872` – Page number in footer is now updated properly.
- `#I339576`, `#F168072` – Resolved the issue in applying page orientation with the section break.
- `#I339027` – Resolved the script error in saving document with tracked changes in header/footer.
- `#I340532` – Html elements are now properly disposed.
- `#F168319` – Resolved the ViewChange event binding issue in Document Editor component.
- `#I341375` – Resolved the undo/redo issue in comment editing operations.

#### New Features

- `#I345565` - Added support for Word 2013 justification.
- `#I343497` - Added support to display the texture style for table cell shading.
- `#I343751` - Added alert window for row and column specified more than 63 and 32767 respectively in insert table dialog.
- `#I342110` - Added event to customize the XMLHttpRequest in DocumentEditor and DocumentEditorContainer component.

## 19.3.56 (2021-12-02)

### Document Editor

#### Bug Fixes

- `#I343645` - Table grid after width percentage value is now properly exported in server-side.
- `#I341659` - Resolved the list alignment issues.
- `#I347230` - Zero line spacing value is now properly exported in server-side.
- `#I346468` - Resolved the document corruption issue due to z-order in server-side exporting.
- `#I344830` - Resolved in exception in opening and saving document with calculation form field.
- `#I345582`, `#I341985` - Document with tab width is now rendered properly.
- `#I346985` - Line height issue is now properly updated for tab character with greater size than rest of the elements in the line.
- `#FB29648` - Table rows/columns in header and footer are now resized properly.
- `#I349115` - Resolved the `goToPage` API scrolling behaviour issue.
- `#I348516` - Table/Cell background color serialized properly in copy/paste.
- `#I341891` - Resolved the hanging issue in editing the footnote content.
- `#I344790` - Resolved footnote overlapping issue when editing a table.

## 19.3.55 (2021-11-23)

### Document Editor

#### Bug Fixes

- `I345759`- Resolved the table border rendering issue.

## 19.3.54 (2021-11-17)

### Document Editor

#### Bug Fixes

- `I344713`- Resolved table header row rendering issue.
- `I341963` - Resolved the table rendering issue.
- `I344704` - Resolved the empty paragraph tracking issue.
- `I344351` - Line height is now calculated property when space character has larger font size the paragraph mark.

## 19.3.53 (2021-11-12)

### Document Editor

#### Bug Fixes

- `#I343310` - Resolved the blank page adding issue in exported word document due to footnote.
- `#I345594` - Resolved the new style listing problem during localization.
- `#I344840` - Resolved the height and width for `insertImage` API.
- `#I343403` - Resolved the script error while opening document with tracked changes and restrict editing enabled.
- `#I342774` - Resolved the word export issue for document with content control.
- `#I340276` - Resolved issue with entering custom date time value in form field.
- `#I344605` - Resolved the context menu rendering issue for multiple instances of DocumentEditor in the same page.
- `#I343106` - Resolved the table border rendering issue.
- `#I337087`, `#I344332` - Improved the suggestion construction logic for error words.
- `#I338302` - Resolved the hanging issue when opening document with table.
- `#I339240` - RTL list is now deleted properly.
- `#I340758` - Resolved the word export issue for the table with merged cells.
- `#I341140` - Track changes content is now updated properly for the existing empty line.
- `#F167253`, `#F168269` - Track changes pane visibility issue is resolved.
- `#I341985` - Resolved the tab space rendering issue.
- `#F168463` - Resolved the layout issue for the element with square wrapping style.
- `#I338947` - Resolved the undo problem after paste of hebrew text.
- `#I341435` - Optimized the content change event triggering in Document Editor.
- `#I340867` - Selection issue after applying character format is resolved.
- `#I341335` - Resolved the text formatting preservation for merge fields.
- `#I339239`, `#I339242`, `#I339021` - Resolved the text arrangement issue for RTL documents.
- `#I335659` - Resolved the undo/redo some text in RTL mode.
- `#I340643` - Resolved the comment mark removal issue in comment delete.
- `#I339335` - Resolved the hanging issue in editing document with Hebrew text.
- `#I340121` - Resolved the issue with elbow connector rendering as line connector.
- `#I339453` - Resolved the rendering issue in fixed table width case.
- `#I341119` - Resolved the image with top and bottom wrapping overlapping issue with table.
- `#I339602` – Track changes is now updated properly in header and footer.
- `#I341964`, `#I342165` – Resolved the text rearrange issue in copy/paste of RTL text.
- `#I339714` – Footnote order is now updated properly.
- `#I339973` - Table serialization issue in word export is resolved.
- `#I340795` – Issue with copying field is resolved.
- `#I339872` – Page number is footer is now updated properly.
- `#I339576`, `#F168072` – Resolved the issue in applying page orientation with the section break.
- `#I339027` – Resolved the script error in saving tracked content in header/footer.
- `#I340532` – Html elements are nor properly disposed.
- `#F168319` – Resolved the ViewChange event binding issue in Document Editor component.
- `#I341375` – Resolved the history issue in comment operations.
- `#I341840` – Resolved the table rendering issue.

#### New Features

- `#I345565` - Added support for Word 2013 justification.
- `#I343497` - Added support to render the texture style for table cell shading.
- `#I343751` - Added alert window for row and column specified more than 63 and 32767 respectively in insert table dialog.
- `#I342110` - Added event to customize the XMLHttpRequest in DocumentEditor and DocumentEditorContainer component.

## 19.3.48 (2021-11-02)

### Document Editor

#### Bug Fixes

- `#I340276` - Resolved issue with entering custom date time value in form field.
- `#I344605` - Resolved the context menu rendering issue for multiple instances of DocumentEditor in the same page.
- `#I343106` - Resolved the table border rendering issue.

## 19.3.47 (2021-10-26)

### Document Editor

#### Bug Fixes

- `#I337087`, `#I344332` - Improved the suggestion construction logic for error words.
- `#I338302` - Resolved the hanging issue when opening document with table.
- `#I339240` - RTL list is now deleted properly.

## 19.3.46 (2021-10-19)

### Document Editor

#### Bug Fixes

- `#I340758` - Resolved the word export issue for the table with merged cells.
- `#I341140` - Track changes content is now updated properly for the existing empty line.
- `#F167253`, `#F168269` - Track changes pane visibility issue is resolved.
- `#I341985` - Resolved the tab space rendering issue.
- `#F168463` - Resolved the layout issue for the element with square wrapping style.
- `#I338947` - Resolved the undo problem after paste of hebrew text.

#### New Features

- `#I345565` - Added support for Word 2013 justification.
- `#I343751` - Added alert window for row and column specified more than 63 and 32767 respectively in insert table dialog.

## 19.3.45 (2021-10-12)

### Document Editor

#### Bug Fixes

- `#I341435` - Optimized the content change event triggering in Document Editor.
- `#I340867` - Selection issue after applying character format is resolved.
- `#I341335` - Resolved the text formatting preservation for merge fields.
- `#I339239`, `#I339242`, `#I339021` - Resolved the text arrangement issue for RTL documents.
- `#I335659` - Resolved the undo/redo some text in RTL mode.
- `#I340643` - Resolved the comment mark removal issue in comment delete.
- `#I339335` - Resolved the hanging issue in editing document with Hebrew text.
- `#I340121` - Resolved the issue with elbow connector rendering as line connector.
- `#I339453` - Resolved the rendering issue in fixed table width case.
- `#I341119` - Resolved the image with top and bottom wrapping overlapping issue with table.

#### New Features

- `#I343497` - Added support to render the texture style for table cell shading.

## 19.3.44 (2021-10-05)

### Document Editor

#### Bug Fixes

- `#I339602` – Track changes is now updated properly in header and footer.
- `#I341964`, `#I342165` – Resolved the text rearrange issue in copy/paste of RTL text.
- `#I339714` – Footnote order is now updated properly.
- `#I339973` - Table serialization issue in word export is resolved.
- `#I340795` – Issue with copying field is resolved.
- `#I339872` – Page number is footer is now updated properly.
- `#I339576`, `#F168072` – Resolved the issue in applying page orientation with the section break.
- `#I339027` – Resolved the script error in saving tracked content in header/footer.
- `#I340532` – Html elements are now properly disposed.
- `#F168319` – Resolved the ViewChange event binding issue in Document Editor component
- `#I340643`, `#I341375` – Resolved the history issue in comment operations
- `#I341840` – Resolved the table rendering issue.

#### New Features

- `#I342110` - Added event to customize the XMLHttpRequest in DocumentEditor and DocumentEditorContainer component.

## 19.3.43 (2021-09-30)

### Document Editor

#### Breaking Changes

- Optimized the accuracy of text size measurements such as to match Microsoft Word pagination for most Word documents. This improvement is included as default behaviour along with an optional API `enableOptimizedTextMeasuring` in Document editor settings. To disable this improvement and retain the document pagination behaviour of older versions, kindly set `false` to `enableOptimizedTextMeasuring` property.

#### Bug Fixes

- `#I334754`, `#I337720`, `#F167429` - Resolved the localization issue.
- `#I333264` - Resolved the before spacing issue for the paragraph starting in new page.
- `#I333226` - Resolved the underline issue.
- `#I332508` - Resolved the tracking of multiline and empty paragraph revision.
- `#I335858`, `#F148494` - Resolved the script error in component destroy.
- `#F166420` - Resolved the SFDT exporting issue with shape.
- `#I332253` - Resolved the cut paste hyperlink issue when track changes enabled.
- `#I335409` - Resolved user list updating issue in restrict editing pane.
- `#I328976` - Table and document content is now displayed properly.
- `#I331333` - Resolved the page unresponsive issue when opening a document with nested table.
- `#I331763` - Table with position property is now displayed properly after editing the document.
- `#I330233` - Resolved the extra page issue when updating cross reference field.
- `#I329790`, `#I331351` - Table is now displayed properly based on compatibility mode of the document.
- `#I332483` - Bookmark is now preserved properly after deleting the content from a document containing bookmark.
- `#I331762` - Table with merged cell is now displayed properly.
- `#I330485` - Ole picture is now preserved properly as normal picture.
- `#I330776` - Resolved the casing issue in the suggestions generated by spell checker.
- `#I330982` - Resolved the text encoding problem when pasting with Java server-side library.
- `#I325741` - Footnote is now displayed properly when opening a document.
- `#I331634` - Table with preferred width type percent and allow auto fit property false is now displayed properly.
- `#I331274` - Table positioning property is now preserved properly.
- `#I331667` - Document with building block gallery content control is now exported properly.
- `#I331452` - Footnote inside the table is now displayed properly.
- `#I331606` - Document with block content control is now exported properly.
- `#I331667`, `#I332223` - Shape in footer is now preserved properly.
- `#I330686`, `#I331349`, `#I310463` - Shape fill is now preserved properly.
- `#I332333` - Zoom value is now updated properly in status bar.
- `#I319210` - The changes and comment tab in the review pane will be visible only if at least one tracked change or comment is present in the document.
- `#I337569` - Table in a document with compatibility mode is now displayed properly after editing.
- `#I331349` - Resolved the text clipping issue.
- `#I336632` - Resolved the next style hierarchy issue.
- `#I335857` - Resolved the after spacing preservation issue during copy and paste.
- `#I335107` - Table with position property is now displayed properly when it overlap on another table.
- `#I334036` - Resolved the spell check word by word service triggering issue in optimized spell check mode.
- `#I330165`, `#I327647`, `#I324515`, `#I338278` - Resolved the issues in comment edit, delete, and history operation.
- `#I336315` - Tab character inside absolute positioned table is now displayed properly.
- `#I319206` - Resolved the issue with displaying the horizontal line shape.
- `#F167416` - Line spacing is now preserved properly in server-side export.
- `#I335145`, `#I337499` - Resolved the text size measurement issue when HTML and body tag contains styles.
- `#I339105` - Resolved the number formatting color change issue.
- `#I340265` - Default value for text form field is now preserved properly in Word export.
- `#I336632` - Style names are now properly listed in the drop down of text properties pane.
- `#I338027` - Track changes close icon is now positioned properly in RTL mode.
- `#I337566` - Last empty paragraph (cell mark) inside a table cell after a nested table is now invisible.
- `#I340416` - Resolved the script error with custom toolbar items during destroy.
- `#I337274` - Resolved the border issue for merged cell.
- `#I336588` - Resolved the RTL text issue when copy and paste with text only option.
- `#I338123` - Line spacing is now applied properly for the result text of text form field.
- `#I337118` - Shape inside a table is now displayed properly.
- `#I337397` - Resolved the script error when opening a document with nested table.
- `#I337786` - Empty footer is now ignored properly from bottom margin calculation.
- `#I337968` - Resolved the automatic color issue for the text inside table.
- `#I339240` - Resolved the RTL text issue when deleting the text.
- `#I339488` - Resolved the script error while opening a document with footnote.
- `#I339715` - Footnote is now displayed properly on next page after editing.
- `#I339454` - Resolved alignment issue for a table that is wrapped over a positioned object.
- `#I341016` - Resolved the script error while exporting a document with empty list.
- `#I334046` - Optimized the spell check by page service call in optimized spell check mode.

#### New Features

- `#I256210`, `#F150773`, `#I295055`, `#I295551`, `#I324037`, `#I326715` - Added support for Widow/Orphan control, Keep with next and Keep lines together properties.
- `#I298019`, `#I307321`, `#F160804`, `#F164217`, `#F164872` – Improved the accuracy of text size measurements such as to match Microsoft Word pagination for most Word documents.
- `#I243246`, `#I249594`, `#I287633`, `#I295055`, `#I295549`, `#I299657`, `#I308408`, `#I326567` – Added support to preserve tables with position properties.
- Added option to directly convert DocIO's WordDocument to SFDT and vice-versa in .NET and Java server-side library.
- Added Word-to-SFDT conversion in Java server-side library.
- Added new spell checker library for Java.

## 19.2.62 (2021-09-14)

### Document Editor

#### Bug Fixes

- `#I337118` - Resolved the table rendering issue.
- `#I338123` - Form field elements are now aligned properly.

## 19.2.60 (2021-09-07)

### Document Editor

#### Bug Fixes

- `#I340416` - Resolved the toolbar reinitialization issue.
- `#I337274` - Resolved the merged cell border rendering issue.
- `#I335107` - Text is not layouted properly when used with floating table.
- `#I336588` - Resolved the RTL text Copy/paste text only mode.

## 19.2.59 (2021-08-31)

### Document Editor

#### Bug Fixes

- `#I339105` - Resolved the number formatting color change issue.
- `#I340265` - Text form field default value is preserved in word export.
- `#I336632` - Style names are now properly listed in the drop down.
- `#I338027` - Track changes close icon is now positioned properly in RTL mode.
- `#I337566` - Resolved the table empty paragraph rendering issue.

## 19.2.57 (2021-08-24)

### Document Editor

#### Bug Fixes

- `#I335857` - Resolved the after spacing preservation issue in copy paste.
- `#I335107` - Resolved the table rendering issue.
- `#I336632` - Resolved the next style hierarchy issue.
- `#I334046` - Optimized the spell check by page service call in optimized spell check mode.
- `#I330165`, `#I327647`, `#I324515`, `#I338278` - Resolved the issues in comment delete and history operation.
- `#I336315` - Resolved the tab issue for the text with floating table.
- `#I319206` - Resolved issue with horizontal line shape rendering.
- `#F167416` - Line spacing is now preserved properly in server side export.
- `#I337720` - Resolved the localization in Document Editor.
- `#I335145`, `#I337499` - Resolved the text measuring issue when HTML and Body tag contains styles.

## 19.2.56 (2021-08-17)

### Document Editor

#### Bug Fixes

- `#I337569` - Resolved the table relayout issue for the document with compatibility mode.
- `#I331349` - Resolved the text content clipping issue.
- `#I334046` - Optimized the service triggering in spell check by page mode.

## 19.2.55 (2021-08-11)

### Document Editor

#### New Features

- `#I256210`,`#F150773`,`#I295055`,`#I295551`,`#I324037`,`#I326715` - Added support for keep with next and keep lines together.

#### Bug Fixes

- `#I334754`, `#F167429` - Resolved the localization issue.
- `#I333264` - Resolved the before spacing issue for the paragraph starting in new page.
- `#I333226` - Resolved the underline issue.
- `#I332508` - Resolved the tracking of multiline tracking and empty paragraph revision.
- `#I335858`, `#F148494` - Resolved the script error in component destroy.
- `#F166420` - Resolved the SFDT exporting issue with shape.
- `#I332253` - Resolved the cut paste hyperlink with track changes enabled.
- `#I335409` - Resolved user list updating issue in restrict editing pane.
- `#I328976` - Table and document content is not layouted properly.
- `#I331333` - Resolved the page unresponsive issue in splitting the nested tables.
- `#I331763` - Resolve the shifting issue in the table with table positioning property on relayouting
- `#I330233` - Resolved the extra page adding issue when using update field.
- `#I329790`, `#I331351` - Table is now layouted based on compatibility mode.
- `#I332483` - Resolved the issue on bookmark shifting while removing document content.
- `#I331762` - Table with merged cell is now layouted properly.
- `#I330485` - Ole picture is now preserved as normal picture.
- `#I330776` - Resolved the casing issue in the generated suggestions.
- `#I330982` - Resolved the unexpected characters when pasting using Java server-side library.
- `#I325741` - Resolved the footnote layouting issue when opening a document.
- `#I331634` - Resolved the issue on updating the table cell width.
- `#I331274` - Table positioning property is now preserved properly.
- `#I331667` - Document with BuildingBlockGallery content control type is now exported properly.
- `#I331452` - Resolved the layout issue on footnote inside the table.
- `#I331606` - Document with content control block saving issue is now exported properly.
- `#I331667`, `#I332223` - Shape in footer is now preserved properly.
- `#I330686`, `#I331349`, `#I310463` - Shape fill is now preserved properly.
- `#I332333` - Zoom value is now updated properly in status bar.
- `#I330165`, `#I327647`, `#I324515` - Resolved the worst case scenario issues in comment editing and deleting.
- `#I319210` - The changes and comment tab in the review pane will be visible only if at least one tracked change or comment is present respectively in the document.

## 19.2.49 (2021-07-27)

### Document Editor

#### Bug Fixes

- `#I333226` - Resolved the underline issue.
- `#I330233` - Resolved the shape shifting issue in editing.
- `#I332508` - Resolved the tracking of multiline tracking and empty paragraph revision.
- `#I335858`, `#F148494` - Resolved the script error in component destroy.
- `#F166420` - Resolved the SFDT exporting issue with shape.
- `#I332253` - Resolved the cut paste hyperlink with track changes enabled.

## 19.2.48 (2021-07-20)

### Document Editor

#### Bug Fixes

- `#I329790`, `#I331351` - Resolved export issue for the Table with compatibility mode.
- `#I335409` - Resolved user list updating issue in restrict editing pane.
- `#I328976` - Table and document content is not layouted properly.
- `#I331333` - Resolved the page unresponsive issue in splitting the nested tables.

## 19.2.47 (2021-07-13)

### Document Editor

#### Bug Fixes

- `#I331763` - Resolve the shifting issue in the table with table positioning property on relayouting
- `#I330233` - Resolved the extra page adding issue when using update field.
- `#I329790`, `#I331351` - Table is now layouted based on compatibility mode.
- `#I332483` - Resolved the issue on bookmark shifting while removing document content.
- `#I331762` - Table with merged cell is now layouted properly.
- `#I330485` - Ole picture is now preserved as normal picture.
- `#I330776` - Resolved the casing issue in the generated suggestions.
- `#I330982` - Resolved the unexpected characters when pasting using Java server-side library.

#### New Features

- `#326715` - Added support to preserve "Keep With Next" and "Keep Lines Together" paragraph formatting in the document.

## 19.2.46 (2021-07-06)

### Document Editor

#### Bug Fixes

- `#I325741` - Resolved the footnote layouting issue when opening a document.
- `#I331634` - Resolved the issue on updating the table cell width.
- `#I331274` - Table positioning property is now preserved properly.
- `#I331667` - Document with BuildingBlockGallery content control type is now exported properly.
- `#I331452` - Resolved the layout issue on footnote inside the table.
- `#I331606` - Document with content control block saving issue is now exported properly.
- `#I331667`, `#I332223` - Shape in footer is now preserved properly.
- `#I330686`, `#I331349`, `#I310463` - Shape fill is now preserved properly.
- `#I332333` - Zoom value is now updated properly in status bar.
- `#I330165`, `#I327647`, `#I324515` - Resolved the worst case scenario issues in comment editing and deleting.
- `#I319210` - The changes and comment tab in the review pane will be visible only if at least one tracked change or comment is present respectively in the document.

## 19.2.44 (2021-06-30)

### Document Editor

#### New Features

- `#I278021`, `#I301809` - Added table paste options.
- `#I165071`, `#I226674`, `#I229069`, `#I231373`, `#I241445`, `#I251719`, `#I251720`, `#I267474`, `#I284190`, `#I287633`, `#I291766`, `#I295055`, `#I295549`, `#I298036`, `#I297705`, `#I301313`, `#I291964`, `#I306274`, `#I305349`, `#I308409`, `#I310463`, `#I311260`, `#I312302`, `#I313526`, `#I314192`, `#I317340`, `#I319563` - Added support to preserve image position with square, in-front of text, behind text, top and bottom wrapping styles.
- `#I137901`,`#I158324`,`#I208312`,`#I219539`,`#I226018`,`#I226019`,`#I227643`,`#I238552`,`#I243495`,`#I246168`,`#I247514`,`#I248720`,`#I252754`,`#I253251`,`#I280213`,`#I280379`,`#I285871`,`#I290372`,`#I297705`,`#I298334`,`#I306415`,`#I306466`,`#I308411`,`#I310537`,`#I312846`,`#I314262`,`#I317497`,`#I319206`,`#I320434`,`#I324903`,`#I333100` - Textbox shape with square, in-front of text, behind text, top and bottom wrapping styles.
- `#I307321` - Added support to preserve table positioning properties.
- `#I298019` - Added support for exporting the document pages as image.
- `#I324911` - Provided support for inserting non-breaking space character on Ctrl + Shift + Space key combination.
- `#I326184` - Added option to specify the device pixel ratio for the image generated while printing the document.

#### Bug Fixes

- `#I318381` - Resolved the script error while adding comments across two pages.
- `#I318283` - Handled the "Different First Page" in Headers and Footers after section breaks.
- `#I319182` - Selection issue after editing header is resolved.
- `#I315240` - The script error while parsing shape is resolved.
- `#I319182` - Resolved the script error while editing the header/footer.
- `#F163188` - Highlight color is now working properly.
- `#I320821` - Resolved the script error while opening document with table.
- `#I319403`, `#I317463` - Resolved file corruption issue while exporting the document with shapes.
- `#I319185` - Resolved left border rendering issue in merged cells.
- `#I313943` - Tab character is now displayed properly.
- `#I318786` - The document with footnote is now opened properly.
- `#I318786` - Table column width is now updated properly.
- `#I319991` - Inline form filling is now working properly in Internet Explorer.
- `#I319782` - Resolved script error while deleting the content.
- `#I320821`, `#I320991` - Table is now displayed with proper line width.
- `#I319987` - Table with merged cells is now displayed properly.
- `#I320513` - Header content is now displayed properly.
- `#I321397` - Table with merged cells is now preserved properly in the exported document.
- `#I317683` - Exported document with footnote is no longer corrupted.
- `#I313465` - Image inserted using API is now displayed properly.
- `#I308899` - Track changes is now listed properly in revision pane.
- `#I320270` - Table changes are now tracked during paste operation.
- `#I313821` - Table with preferred width type as auto is now displayed properly.
- `#F162726` - Line spacing is now updated properly.
- `#I319819` - Undo/Redo for multilevel list is now working properly.
- `#I318381` - Comment is now added properly.
- `#I317743` - Script error on accept track changes is now resolved.
- `#I307321` - Checkbox with tab width is rendered properly.
- `#FB23691` - Resolved changes pane visibility issue in read only mode.
- `#I319397` - Spell checker now works properly for words ending with ‘ies’.
- `#F164367` - Resolved the script error in npm run sass.
- `#I319824` - Resolved the extra page rendering issue.
- `#I319824` - Border displayed properly in the exported word document.
- `#I319421`, `#F163236` - Resolved the copy/paste issue for content copied from Document editor.
- `#I307321` - Line shape is now preserved properly in the exported document.
- `#I307321` - Exported document is now displayed properly.
- `#I321190` - Resolved the icon issue in material-dark, bootstrap-dark, fabric-dark themes.
- `#I319808` - Document with tab is now displayed properly.
- `#I317303` - Spacing after the numbered list is preserved properly.
- `#I324052` - Added the footnote and endnote locale strings.
- `#I307321` - Table border is now preserved properly in exported word document.
- `#I307321` - List with hanging indent is displayed properly.
- `#I321108` - Script error on tracking the changes is now resolved.
- `#I321923` - Script error on pasting image URL in track change mode is now resolved.
- `#I317358` - Image copy/paste issue in ASP.NET MVC framework is now resolved.
- `#I318843` - Resolved the list formatting issue in copy pasted content.
- `#I319868` - Exported document with image in header is now opened properly in Libre Office.
- `#I324025` - Resolved the font dialog option value in localized mode.
- `#I324223`, `#I324023` - Resolved the underline issue while exporting word document.
- `#I322402` - Before pane switch event triggering twice issue is resolved.
- `#F163664` - Document editor now opens large size text file properly.
- `#I322548` - Resolved the issue with track changes.
- `#I322561` - Bookmark delete and undo/redo operation is now working properly.
- `#I324028` - Resolved the issue with applying properties in font dialog.
- `#I323597` - Textbox in RTF documents are now displayed properly.
- `#I323603` - Resolved the footnote issue when switching to web layout.
- `#I321745` - Comment is now selected properly.
- `#I322561` - Resolved the script error with bookmark undo/redo operation.
- `#I323670` - Resolved the font size and font family issue during copy paste.
- `#I325291` - Document with alternate chunks is now displayed properly.
- `#I323401`, `#I323423` - Resolved the page wise footnote content display issue.
- `#I326150` - Resolved issue in updating cross reference field.
- `#F160804` - Styles are now considered properly while deleting the content.
- `#I312306` - Hyperlink content is now retrieved properly.
- `#I325681` - Resolved the Textbox border displaying issue.
- `#I323059` - Resolved the script error when ignore action in spelling dialog.
- `#I323423` - Resolved the issue when moving footnote to next page.
- `#I324169` - Resolved opacity issue in toolbar item.
- `#I322560`, `#I323516` - Script error in the top and bottom layout is resolved.
- `#I323824` - Resolved the document corruption issue when opening the document in MS Office 2007.
- `#I325554` - Resolved the script error when multiple documents pasted as SFDT.
- `#I327626` - Footnote is now displayed properly.
- `#I326000` - Document content is now displayed properly.
- `#I327097` - Resolved the script error related to square wrapping style.
- `#I327458` - Text overlapping issue is resolved.
- `#I327647` - Issue with removing comment is resolved.
- `#I322560` - Resolved the issue with duplication of page content.
- `#I322560` - Font size is now parsed properly.
- `#I323423` - Footnote is now displayed properly.
- `#I325920` - Selection behaviour is now working properly when mouse pointer goes outside the control.
- `#I323608` - Textbox with fill color is now displayed properly.
- `#I326144` - Resolved the issue with multi-line track changes.
- `#I328063` - Document with checkbox form field applied is now displayed properly.
- `#I328067` - Resolved the navigation issue when form filling mode is inline.
- `#F164875`, `#F163714` - Resolved the border issue when textbox has square border.
- `#I327817` - Resolved the script error when using insert footnote in custom toolbar.
- `#I325320` - Page number is now updated properly.
- `#FB25004` - Exported document with table is opened properly in Libre Office.
- `#I325323` - Textbox shape is now displayed properly.
- `#FB24917` - Document is now exported properly after deleting comment.
- `#F163116` - Hanging indent is now retrieved properly in paragraph dialog.
- `#I327769` - Checkbox is now displayed properly.
- `#I326567` - Nested table with preferred width type percentage is now displayed properly.
- `#I328479` - Resolved script error while deleting merged cells.
- `#I329173`, `#I330233` - Resolve script error while updating cross reference field.
- `#F165501` - Resolve script error while applying border.
- `#I328310` - Shape is now rendered properly in header and footer.
- `#I325741` - Footnote content is now displayed properly.
- `#I329564` - Accept and reject changes are now disabled properly in read only mode.
- `#F164814` - Character format is now applied properly for RTL text.
- `#I328063` - Resolved script error while scrolling.
- `#I327450` - Resolved the overlapping issue in footnote section when working with text.
- `#I327606` - Font size is now updated properly for the cursor position.
- `#I329354` - Resolved the exception while exporting documents in server-side.
- `#I330375` - Updated the constants for locale constants.
- `#I330047` - Resolved the script error with refresh API.
- `#I329637` - Resoled the issue with deleting comment.
- `#I330918`, `#I331136` - Resolved the issue with updating cursor.
- `#I329954` - Resolved the overlapping issue in options pane.
- `#I327635`, `#I330160` - Resolved the text overlapping when editing the footnote.
- `#I315396`, `#I316110` - Enhanced Word to SFDT conversion in Java server-side library.
- `#I324042` - Resolved the issue with displaying document footer.
- `#I315376` - Resolved the script error related to Jest framework.
- `#I318321` - Resolved the script error with `showRestrictEditingPane` API.
- `#I307321` - Resolved the issue with document zooming.

## 19.1.69 (2021-06-15)

### Document Editor

#### Bug Fixes

- `#I329173`, `#I330233` - Resolve script error while updating cross reference field.
- `#F165501` - Resolve script error while applying border.
- `#I328310` - Shape is now rendered properly in header & footer.
- `#I325741` - Footnote content is now layout properly.
- `#I329564` - Disabled accept and reject changes in read only mode.
- `#F164814` - Character format is now applied properly in RTL text.
- `#I328063` - Resolved script error while scrolling.

## 19.1.67 (2021-06-08)

### Document Editor

#### Bug Fixes

- `#FB25004` - Exported document with table is opened properly in Libre Office.
- `#I325323` - Textbox shape is now rendered properly.
- `#FB24917` - Document is now exporting properly after deleting comment.
- `#F163116` - Hanging indent is now retrieved properly in paragraph dialog.
- `#I327769` - Checkbox is now layout properly.
- `#I326567` - Nested table with preferred width type percent now rendered properly.
- `#I328479` - Resolved script error while deleting merged cells.

## 19.1.66 (2021-06-01)

### Document Editor

- `#I326144` - Resolved the issue with multi line track changes.
- `#I328063` - Document with checkbox form field applied with to character format is now opened properly.
- `#I328067` - Resolved the navigation issue in inline form field editing.
- `#F164875`, `#F163714` - Resolved the unsupported textbox border as square border.
- `#I327817` - Resolved the script error in using insert footnote in custom toolbar.
- `#I325320` - Page number is now updated properly.

## 19.1.65 (2021-05-25)

### Document Editor

#### Bug Fixes

- `#I325554` - Resolved the script error in multiple document pasted as SFDT.
- `#I327626` - Footnote is rendered now.
- `#I326000` - Resolved the document rendering issue.
- `#I327097` - Resolved the script error in square wrapping style.
- `#I327458` - Text overlapping issue is resolved.
- `#I327647` - Issue with comment removal is resolved.
- `#I322560` - Resolved the page content duplication issue.
- `#I322560` - Resolved the font size parsing issue.
- `#I323423` - Footnote is rendering issue is resolved.
- `#I325920` - Selection behaviour is handled for moving outside the control.
- `#I323608` - Textbox with fill color is rendered.

## 19.1.64 (2021-05-19)

### Document Editor

#### Bug Fixes

- `#I325681` - Resolved the textbox border rendering issue.
- `#I323059` - Resolved the script error when ignore action in spelling dialog.
- `#I323423` - Resolved the footnote moving issue to next page.
- `#I324169` - Resolved opacity issue in toolbar item.
- `#I322560`, `#I323516` - Script error in the top and bottom layout is resolved.
- `#I323824` - Resolved the document corruption issue in MS Office 2007.
- Resolved the document rendering issue document footer.
- Resolved the script error for Jest framework.

## 19.1.63 (2021-05-13)

### Document Editor

#### Bug Fixes

`#I326717` - Table border is preserved in the exported word document
`#I325968` - New line changes are now tracked properly
`#I325590` - Context menu behaviour for spell check is resolved.
`#I325697` - Spell check in tracked changes is now updated properly.
`#I324896` - List track changes are now applied properly.
`#I322387` - DocumentEditorContainer disposing issue is resolved.
`#I324622` - Resolved the chart parsing issue.
`#I324911` - Console error when opening document with footnote is resolved.
`#I324907` - Numbering list is copied with proper color.
`#I323215` - Table is now layout properly after row delete.
`#I322560` - Page content duplication issue is resolved.

#### New Features

- `#I324911` - Provided support for inserting non-breaking space character on Ctrl + Shift + Space key combination.
- `#I326184` - Added option to specify the device pixel ratio for the image generated while printing the document.

## 19.1.59 (2021-05-04)

### Document Editor

#### New Features

- `#I307321` - Added support table positioning properties.

#### Bug Fixes

- `#I324028` - Resolved the font dialog properties applied in font dialog.
- `#I323597` - Resolved the text box rendering in RTF documents.
- `#I323603` - Resolved the footnote issue when switching to web layout.
- `#I321745` - Resolved the comment selection issue.
- `#I322561` - Resolved the bookmark undo and redo script error.
- `#I323670` - Resolved the font size and font family issue in copy paste.
- `#I325291` - Document with alternate chunks is now loaded properly.
- `#I323401`, `#I323423` - Resolved the page wise footnote content layout issue.
- `#I326150` - Resolved issue in updating cross reference field.
- `#F160804` - Styles not considered properly while deleting the content.
- `#I324169` - Resolved opacity issue in toolbar item.
- `#I312306` - Hyperlink context is now retrieved properly.
- Resolved the `showRestrictEditingPane` API script error.
- Resolved the document zooming issue.

## 19.1.58 (2021-04-27)

### Document Editor

#### Bug Fixes

- `#I324223`, `#I324023` - Resolved the underline issue in word document export.
- `#I322560`, `#I323516` - Script error in the top and bottom layout is resolved.
- `#I322402` - Before pane switch event triggering twice issue is resolved.
- `#F163664` - Unresponsive issue in opening large size text file is resolved.
- `#I323401`, `#I323423` - Resolved the page wise footnote content layout issue.
- `#I322548` - Resolved the track changes issue in track changes.
- `#I322561` - Bookmark delete and history operation is working fine.

#### New Features

- `#I307321` - Added support table positioning properties.

## 19.1.57 (2021-04-20)

### Document Editor

#### Bug Fixes

- `#I319397` - Resolved the spell check for certain words ending with `ies`.
- `#F164367` - Resolved the script error in `npm run sass`.
- `#I319824` - Resolved the extra page rendering issue.
- `#I319824` - Resolved the border rendering issue in the exported word document.
- `#I319421`, `#F163236` - Resolved the copy/paste issue for content copied from Document Editor.
- `#I307321` - Document exporting issue with line shape is resolved.
- `#I307321` - Exported document rendering issue in resolved.
- `#I321190` - Resolved the icon issue in material-dark, bootstrap-dark, fabric-dark themes.
- `#I319808` - Document with tab is now rendered properly.
- `#I317303` - Spacing after the numbered list is preserved.
- `#I324052` - Added the footnote and endnote locale strings.
- `#I307321` - Table border issue in exported word document is resolved.
- `#I307321` - List with hanging indent is rendered properly.
- `#I313465` - Resolved the image rendering issue in insert image API.
- `#I321108` - Script error in tracking the changes is resolved.
- `#I321923` - Script error in pasting image URL in track change mode is resolved.
- `#I317358` - Image copy/paste issue in ASP.NET MVC framework is resolved.
- `#I318843` - Resolved the list formatting issue in copy pasted content.
- `#I319868` - Exported document with image in header is opened properly in Libre Office.
- `#I324025` - Resolved the font dialog option value in localized mode.

## 19.1.56 (2021-04-13)

### Document Editor

#### Bug Fixes

- `#I319991` - Inline form filling is now working properly in Internet Explorer.
- `#319782` - Resolved script error while deleting the content.
- `#I320821`, `#I320991` - Table is now drawn with proper line width.
- `#I319987` - Table with merged cells now layout properly.
- `#I320513` - Header content is not rendered properly.
- `#I321397` - Table with merged cells is now exported properly.
- `#I317683` - Exported document with footnote is no longer corrupted.
- `#I313465` - Insert image renders the image properly.
- `#I308899` - Track changes is now listed properly in revision pane.
- `#I320270` - Table track changes is now tracked in paste.
- `#I319403`, `#I317463` - Resolved file corruption issue while exporting the document with shapes.
- `#I319185` - Resolved left border rendering issue in merged cells.
- `#I313943` - Tab character is now layout properly.
- `#I313821` - Fixed layouting issue in table with preferred width type as auto.
- `#F162726` - Line spacing is now updated properly.
- `#I319819` - Issue with Undo/Redo in multilevel list is resolved.
- `#I318381` - Comment is not added properly.
- `#I317743` - Accept track changes script error is resolved.
- `#I307321` - Checkbox with tab width rendered properly.
- `#FB23691` - Updated the track changes behaviour in read only mode.

## 19.1.55 (2021-04-06)

### Document Editor

#### Bug Fixes

- `#I318381` - Resolved the script error in adding comments across two pages.
- `#I318283` - Handled the "Different First Page" in Headers and Footers after section breaks.
- `#I319182` - Selection issue after editing header is resolved.
- `#I315240` - Shape parsing script error is resolved.
- `#I319182` - Resolved the script error while editing the header/footer.
- `#F163188` - Highlight color is now working properly.
- `#I320821` - Resolved the script error in opening document with table.
- `#319403`, `#317463` - Resolved file corruption issue while exporting the document with shapes.
- `#319185` - Resolved left border rendering issue in merged cells.
- `#313943` - Tab character is now layout properly.
- `#313821` - Fixed layouting issue in table with preferred width type as auto.
- `#318786` - Resolved the document with footnote opening issue.
Table column width is now updated properly.

## 19.1.54 (2021-03-30)

### Document Editor

#### Breaking Changes

- The `DictionaryData(int langID,string dictPath,string affPath,string customPath)` is marked as obsolete. Please use the alternate new constructor `DictionaryData(int langID, string dictPath, string affPath)` in `Syncfusion.EJ2.SpellChecker` spell checker.
- The `SpellChecker(List<SpellCheckDictionary> dictItem)` is marked as obsolete. Please use the alternate new constructor `SpellChecker(List<DictionaryData> dictItem, string customDicPath)` in `Syncfusion.EJ2.SpellChecker` spell checker.

#### Bug Fixes

- `#315096` - Selection behaviour is updated properly, while pasting a URL and clicking enter after the URL.
- `#315413`, `#317463` - Table cell is now rendered properly.
- `#314467` - Find and replace is now working properly.
- `#315441` - While inserting same bookmark multiple times and deleting, bookmarks were preserved properly now.
- `#316532` - ParagraphFormat is now preserved while pasting with text only option.
- `#314193` - Document with charts were now preserved properly on exporting.
- `#161908`, `#318321` - Added API to show/hide restrict editing pane.
- `#315435` - Table cell width now preserved properly on editing.
- `#162638` - Table background color was now updated properly on updating borders and shading.

## 18.4.49 (2021-03-23)

### Document Editor

#### Bug Fixes

- `#317061` - The merged cell table border rendering issue is resolved.
- `#318283` - Resolved script error while editing the last section header.
- `#310874` - The table with the merged cell is exporting properly.
- `#162017` - Restart page numbering is now preserved properly on exporting.
- `#316810` - Spell check script error is now resolved for layout type change.
- `#163236` - Strike through and underline content are now copy-pasted properly.

## 18.4.48 (2021-03-16)

### Document Editor

#### Bug Fixes

- `#163116`, `#317496`, `#315005` - Implemented the line spacing Hanging similar to MS word.
- `#317691` - Resolve the Number formatting after applying bullet formats.
- `#317524` - Replace all with empty string is now working.
- `#317605` - Shape with line format value null was now preserved properly.
- `#317150` - Can press 'p' key in Firefox after control + a and then backspace.
- Resolve hanging issue while opening document.
- `#315656` - Resolve script error when importing document.

## 18.4.47 (2021-03-09)

### Document Editor

#### Breaking Changes

- The `DictionaryData(int langID,string dictPath,string affPath,string customPath)` is marked as obsolete. Please use the alternate new constructor `DictionaryData(int langID, string dictPath, string affPath)` in `Syncfusion.EJ2.SpellChecker` spell checker.
- The `SpellChecker(List<SpellCheckDictionary> dictItem)` is marked as obsolete. Please use the alternate new constructor `SpellChecker(List<DictionaryData> dictItem, string customDicPath)` in `Syncfusion.EJ2.SpellChecker` spell checker.

#### Bug Fixes

- `#315096` - Selection behaviour is updated properly, while pasting a URL and clicking enter after the URL.
- `#315413`, `#317463` - Table cell is now rendered properly.
- `#314467` - Find and replace is now working properly.
- `#315441` - While inserting same bookmark multiple times and deleting, bookmarks were preserved properly now.
- `#316532` - ParagraphFormat is now preserved while pasting with text only option.
- `#314193` - Document with charts were now preserved properly on exporting.
- `#161908`, `#318321` - Added API to show/hide restrict editing pane.
- `#315435` - Table cell width now preserved properly on editing.
- `#162638` - Table background color was now updated properly on updating borders and shading.

## 18.4.46 (2021-03-02)

### Document Editor

#### Bug Fixes

- `#311796`, `#316639`, `#308845`, `#316676`, `#162561` - All the pages in the document were now loaded properly.
- `#309052`, `#315953` - Footnote now layouts properly.
- `#307997` - Resolved issue on updating the bullet list.
- `#314313`, `#316278` - When copy pasting the merge field, merge field was now preserved properly.
- `#315435` - Table cells layouts properly now.
- `#315413`, `#317463` - Table cells renders to preferred width now.

## 18.4.44 (2021-02-23)

### Document Editor

#### Bug Fixes

- `#313564`, `#314479` - Bookmark co ordinates were now updated properly.
- `#162017` - Restart page number behaviour was implemented also for page break now.
- `#310874` - Table with merged cells were exported properly now.
- `#162017` - Page number was now updated properly based on page index.
- `#313821` - Table column were now layout properly.
- `#311371` - While deleting the bookmark extra spaces between the text were now removed properly.
- `#312082` - Resolved script error on updating TOC.
- `#312306` - Hyperlink label was not added while editing the link address now.

## 18.4.43 (2021-02-16)

### Document Editor

#### Bug Fixes

- `#160804`, `#160805` - Line space was now considered properly on exporting.
- `#161513` - Properties pane was now disabled while enabling restrict editing.
- `#311371` - While deleting a text extra spaces between the text were now removed properly.
- `#311884` - Document with table was imported properly now.
- `#310754` - Hebrew text was now layout properly with spaces and numbers renders properly.
- Resolved performance lagging issue while editing.

## 18.4.42 (2021-02-09)

### Document Editor

#### Bug Fixes

- `#311518` - Vertical scrollbar was now updated properly on container resize.
- `#161047` - Document with tab stop was now exported properly.
- `#310258` - All the contents were preserved on pasting now.
- `#307321`, `#309396` - Line shape was now rendered properly.
- `#307321`, `#313943` - Tab stops were now rendered properly.
- `#311296` - Odd headers were added to all odd pages now.
- `#307321`, `#313948` - Straight connectors were now rendered properly.
- `#309565` - When enable track changes is false changes tab is hide in review pane now.

## 18.4.41 (2021-02-02)

### Document Editor

#### Bug Fixes

- `#264813` - List tab element now layouts properly.
- `#309425` - Paragraph formats were considered while creating a new table.
- `#309976` - List was not updated properly from level 1 to level 2.
- `#306480` - Review pane was now updated properly on resizing.
- `#309052` - Document with footnote now rendered properly without overlap.
- `#309565` - When enable comment is false comment tab is hide in review pane now.
- `#307321` - Table with no cell border now rendered properly.
- `#307860` - While pasting no extra paragraph was added now.
- `#311336` - Text was now updated properly on undo without overlap.

## 18.4.35 (2021-01-19)

### Document Editor

#### Bug Fixes

- `#160177` - The document with tables were now rendered properly without page unresponsive error.
- `#305777` - Selection was now updated properly on zooming for web layout.
- `#297705` - Handled behaviour similar to MS Word if page and section break in same paragraph.
- `#305110` - The document with large tables were now rendered properly without page unresponsive error.
- `#307321` - Table borders now renders properly if the border color is none.
- `#303643` - Edit hyperlink now works properly on image with hyperlink.

## 18.4.34 (2021-01-12)

### Document Editor

#### Bug Fixes

- `#306130` - The document content now renders properly while pasting the contents after inserting header with maximum header distance.
- `#307321` - Top borders of table with merged cell were rendered properly now.
- `#307746`, `#307748` - Auto fit tables were rendered properly now.
- `#309747` - Resolved spelling issue on default font family collection.
- `#295084`, `#291801` - Charts were now rendered properly on pasting.
- `#307318`, `#307327` - Creation of new comment was now restricted until existing comment was posted or discarded.
- `#307321` - Tab stop was rendered properly now.
- `#299850` - Auto fit table with preferred width and cell width was now rendered properly.
- `#308899` - Track changes revision was now preserved properly for justified paragraph.

## 18.4.33 (2021-01-05)

### Document Editor

#### Bug Fixes

- `#297703`, `#160488` - Cursor was now updated properly for RTL languages.
- `#307715` - Table with merged cells were now exported properly.

## 18.4.32 (2020-12-29)

### Document Editor

#### Bug Fixes

- `#306939` - Table with merged cells were now exported properly.
- `#302508` - List format was now preserved properly after pasting some content in list line.
- `#299511` - On discarding the comment, comment tag was removed properly on file level now.

## 18.4.31 (2020-12-22)

### Document Editor

#### Bug Fixes

- `#305640` - Track changes is now preserved properly on exported document.
- `#305804` - Document scrolling is now working properly when document contains clipped image.
- `#305804` - In IE, Ctrl+ P is now working properly without text insertion in cursor position.
- `#299850` - Paragraph format was now applied properly inside the table.
- `#304588` - Application level formats were now preserved properly.
- `#305834`, `#302444` - Comment tab is also visible now while clicking on the track changes.
- `#301314` - Resolved the script error thrown on entering a new line and backspace sequentially.

## 18.4.30 (2020-12-17)

### Document Editor

#### New Features

- `227250`, `143540`, `234463`, `252453`, `267474`, `67852`, `268213`, `273871`, `285146`, `288507`, `290372`, `295055`, `295548` - Added support for Footnote and Endnote.

## 18.3.53 (2020-12-08)

### Document Editor

#### Bug Fixes

- `305508` - Resolved page unresponsive error while selecting field.
- `302470` - Chart series color now applied properly.
- `292515` - Resolved paste option issue on IE.

## 18.3.52 (2020-12-01)

### Document Editor

#### Bug Fixes

- `302151` - Vertical alignment for cell now working properly in header and footer.
- `304069` - Table cell spacing now exported properly.
- `304048`, `294075` - Auto fit table is now layout properly if table has preferred width.

## 18.3.51 (2020-11-24)

### Document Editor

#### Bug Fixes

- `#291766`, `#293053` - Resolved the page unresponsive error while selecting the image.
- `#301016` - Multiple server calls on optimized spell checking was now optimized to single call per page.
- `#300330` - Document with comment can be opened without any script errors now.
- `#292912`, `#293388` - Document with empty comment is now exported properly.
- `#299940` - Table with center alignment is now rendered properly and footer contents are rendered properly now on zooming.
- `#290277` - Navigating to bookmark now works properly without script error.
- `#301035`, `#300947` - Changes were tracked properly now on pasting.

## 18.3.50 (2020-11-17)

### Document Editor

#### Bug Fixes

- Strike through button now toggles properly.
- `#297703` - Resolved issue on exporting a RTL document.

## 18.3.48 (2020-11-11)

### Document Editor

#### Bug Fixes

- `#294075` - Resolved table bottom border rendering issue when table contains merged cell.
- `#292515` - Resolved context menu position issue in IE11.

## 18.3.47 (2020-11-05)

### Document Editor

#### New Features

- `#281067`, `#279595` - Added partial lock and edit support.

#### Bug Fixes

- `#296222` - Resolved table rendering issue when table contains merged cell.
- `#297479` - Field result text with multiple lines are now inserted properly when track changes enabled.
- `#296863` - Resolved script error when field code contains table.
- `#281339` - Resolved paragraph renders outside the page in RTL format document issue.
- Resolved script error Navigating to the specified bookmark.
- `#296222` - Resolved exporting issue when exporting document with shape.
- `#294306` - Resolved page number update issue when page contains page field.
- `#295176` - Ctrl + V now works properly in Edge.
- `#296782`, `#296781` - Resolved issue on cursor visibility when cursor is in editable region.
- `#293369` - Document with merged cell is now exported properly.
- `#294261` - Accepting or rejecting changes were now preserved in restrict editing.
- `#292726` - Row header was now repeated properly for each page.
- `#281339` - Numbered list in the RTL was now rendered properly.
- `#295753` - Sections with restart page number now updated properly.
- `#293980` - Skipped form field insertion in header and footer similar to MS Word.
- `#294075`,`#293472` - Resolved table border rendering issue.
- `#291766` - Resolved file picker not opening issue in IE.
- `#296842` - Resolved issue on selecting a merge field.
- `#292515` - Polish characters are now working properly in IE.
- `#291766` - Resolved script error on loading a document with text wrapped image.
- `#292515` - Resolved toolbar rendering issue in IE.
- `#289186`,`#293172` - Text box with none style is now exported properly.
- `#291766` - Resolved issue on table rendering black.
- `#293342`,`#295176` - Ctrl + V now works properly in IE.

## 18.3.44 (2020-10-27)

### Document Editor

#### Bug Fixes

- `#296222` - Resolved table rendering issue when table contains merged cell.
- `#297479` - Field result text with multiple lines are now inserted properly when track changes enabled.
- `#296863` - Resolved script error when field code contains table.
- `#281339` - Resolved paragraph renders outside the page in RTL format document issue.
- Resolved script error Navigating to the specified bookmark.
- `#296222` - Resolved exporting issue when exporting document with shape.

## 18.3.42 (2020-10-20)

### Document Editor

#### New Features

- `#281067`, `#279595` - Added partial lock and edit support.

#### Bug Fixes

- `#294306` - Resolved page number update issue when page contains page field.
- `#295176` - Ctrl + V now works properly in Edge.
- `#296782`, `#296781` - Resolved issue on cursor visibility when cursor is in editable region.
- `#293369` - Document with merged cell is now exported properly.
- `#294261` - Accepting or rejecting changes were now preserved in restrict editing.
- `#292726` - Row header was now repeated properly for each page.
- `#281339` - Numbered list in the RTL was now rendered properly.
- `#295753` - Sections with restart page number now updated properly.
- `#293980` - Skipped form field insertion in header and footer similar to MS Word.

## 18.3.40 (2020-10-13)

### Document Editor

#### Bug Fixes

- `294075`,`293472` - Resolved table border rendering issue.
- `#291766` - Resolved file picker not opening issue in IE.
- `#296842` - Resolved issue on selecting a merge field.
- `#292515` - Polish characters are now working properly in IE.
- `#291766` - Resolved script error on loading a document with text wrapped image.
- `#292515` - Resolved toolbar rendering issue in IE.
- `289186`,`293172` - Text box with none style is now exported properly.
- `#291766` - Resolved issue on table rendering black.
- `293342`,`295176` - Ctrl + V now works properly in IE.

## 18.3.35 (2020-10-01)

### Document Editor

#### Bug Fixes

- `#283180` - Resolved font family no records found issue.
- `#282303` - Paste dropdown now hides when creating or opening new document.
- `#280951` - Table content renders properly now for table with merged cells.
- `#280973` - Resolved script while getting bookmarks from selection.
- `#284486` - Comment Tab in pane is removed when enable comment is false.
- `#283344` - Resolved the initial delay in pasting images.
- `#282707`,`#284035` - Resolved bullet list exporting issue in MAC devices.
- `#284412` - Comment mark is now deleted properly when comment is deleted.
- `#281339` - Resolved RTL issue when editing a list content.
- `#276616` - Paragraph maintained when inserting text in whole paragraph similar to MS Word.
- `#284775` - Resolved table resize enabled issue in protected mode.
- `#282504` - Resolved footer content overlapping issue when inserting image and table in footer.
- `#286986` - Table properties are now written properly on html exporting.
- `#286520` - Inserted text selection now applied properly after applying style.
- `#287740` - Paper size dropdown in page setup dialog now updated for document with A4 format.
- `#282515` - Resolved error on exporting a document which contains restart numbering.
- `#287633` - Table containing alignment is now exporting properly with alignment.
- `#286469` - Resolved table formatting issue when table splits to multiple pages.
- `#285747` - Resolved script error on server side export.
- `#284704` - Resolved script error on changing the footer distance.
- `#283529` - Resolved table layout issue when table is center aligned.
- `#286474` - Resolved table re layout issue when table have left indent value.
- `#289186` - Resolved issue on exporting a text box with line format none.
- `#288198` - Font family customization is also available on modify style dialog now.
- `#289187` - Resolved table border rendering issue when table have merged cells.
- `#287255` - Resolved page unresponsive error occurs on mail merge.
- `#286474`, `#288778` - Resolved script error thrown on choosing fill color.
- `#155699` - Image resize history is now called before the content change event.
- `#156086` - Resolved table layout issue on opening a saved document with merged cells.
- `#148494` - Resolved script error on destroying the container.
- `#289186` - Resolved layout issue on exporting a text box.
- `#289172` - Resolved script error when two or more server request is passed at same time.
- `#287775` - Resolved script error on saving a document with form field.
- `#289902` - Custom page height and width is now updating properly in page setup dialog.
- `#289902` - Resolved review pane enabled issue when track changes is disabled.
- `#157264` - Resolved script error when finding a text with curly braces.
- `#290625` - Tick icon in line spacing is aligned properly now.
- `#291882` - Now,Text contents were not transformed to upper case while copying.
- `#287582` - Apply shading property for form field is now maintained also on exported document.
- `#280951` - Table contents were not rendered on footer region now.
- `#287195` - Resolved script error throw while deleting large text inside a table.
- `#155699` - Resolved selection change event gets triggered before created event of document editor issue.
- `#290271` - Resolved some elements are not created with unique id in document editor component issue.
- `#288253` - Exported document with comments from editor contain initials property in file level now.
- `#287740` - Landscape Orientation not updated properly in page setup dialog now.
- `#291080`, `#157393` - Restrict editing property works when setting on component creation now.

#### New Features

- Added API to delete bookmark.
- `#267515`- Added API to get searched item hierarchical index.
- `#284937`- Added API show restrict editing pane.
- `#280089`, `#283427`, `#250760` - Added event to notify service failure.
- `#275184` - Added support for retrieving next and previous element context type from current selection range.
- `#243495` - Added support for automatic text color.
- `#279355` - Added support to enable properties pane in read only mode.
- `#260677`, `#277329` - Added support for cropping images in document editor.
- `#250760` -  Added before file open event to restrict document loading based on file size.
- `#256210`, `#259583`, `#280989`, `#282228` - Added support for all Caps property for character.
- `#156915` - Added public API to check whether the selection is in edit region.
- `#287831` - Added public API to show spell check dialog.
- `#284434` - Spell checker performance was optimized.
- `#290372` - Added support to apply restart page number for different sections.
- `#290423` - Added resize API in document editor container.
- `#243495`, `#247427`, `#248347`, `#252755`, `#254094`, `#254684`, `#256926`, `#248347`, `#260233`, `#262638`, `#273681`, `#155458`, `#278038` - Added support to preserve content control feature.

## 18.2.58 (2020-09-15)

### Document Editor

#### New Features

- `#290372` - Added support to apply restart page number for different sections.
- `#290423` - Added resize API in document editor container.
- `#243495`, `#247427`, `#248347`, `#252755`, `#254094`, `#254684`, `#256926`, `#248347`, `#260233`, `#262638`, `#273681`, `#155458`, `#278038` - Added support to preserve content control feature.

#### Bug Fixes

- `#155699` - Resolved selection change event gets triggered before created event of document editor issue.
- `#290271` - Resolved some elements are not created with unique id in document editor component issue.
- `#288253` - Exported document with comments from editor contain initials property in file level now.
- `#287740` - Landscape Orientation not updated properly in page setup dialog now.
- `#291080`, `#157393` - Restrict editing property works when setting on component creation now.

## 18.2.57 (2020-09-08)

### Document Editor

#### New Features

- `#156915` - Added public API to check whether the selection is in edit region.
- `#287831` - Added public API to show spell check dialog.
- `#284434` - Spell checker performance was optimized.

#### Bug Fixes

- `#148494` - Resolved script error on destroying the container.
- `#289186` - Resolved layout issue on exporting a text box.
- `#289172` - Resolved script error when two or more server request is passed at same time.
- `#287775` - Resolved script error on saving a document with form field.
- `#289902` - Custom page height and width is now updating properly in page setup dialog.
- `#289902` - Resolved review pane enabled issue when track changes is disabled.
- `#157264` - Resolved script error when finding a text with curly braces.
- `#290625` - Tick icon in line spacing is aligned properly now.
- `#291882` - Now,Text contents were not transformed to upper case while copying.
- `#287582` - Apply shading property for form field is now maintained also on exported document.
- `#280951` - Table contents were not rendered on footer region now.
- `#287195` - Resolved script error throw while deleting large text inside a table.

## 18.2.55 (2020-08-25)

### Document Editor

#### Bug Fixes

- `#286474` - Resolved table re layout issue when table have left indent value.
- `#289186` - Resolved issue on exporting a text box with line format none.
- `#288198` - Font family customization is also available on modify style dialog now.
- `#289187` - Resolved table border rendering issue when table have merged cells.
- `#287255` - Resolved page unresponsive error occurs on mail merge.
- `#286474`, `#288778` - Resolved script error thrown on choosing fill color.
- `#155699` - Image resize history is now called before the content change event.
- `#156086` - Resolved table layout issue on opening a saved document with merged cells.

## 18.2.54 (2020-08-18)

### Document Editor

#### New Features

- `#275184` - Added support for retrieving next and previous element context type from current selection range.
- `#243495` - Added support for automatic text color.
- `#279355` - Added support to enable properties pane in read only mode.
- `#260677`, `#277329` - Added support for cropping images in document editor.
- `#250760` -  Added before file open event to restrict document loading based on file size.
- `#256210`, `#259583`, `#280989`, `#282228` - Added support for all Caps property for character.
- Added API to delete bookmark.
- `#267515`- Added API to get searched item hierarchical index.
- `#284937`- Added API show restrict editing pane.
- `#280089`, `#283427`, `#250760` - Added event to notify service failure.

#### Bug Fixes

- `#286986` - Table properties are now written properly on html exporting.
- `#286520` - Inserted text selection now applied properly after applying style.
- `#287740` - Paper size dropdown in page setup dialog now updated for document with A4 format.
- `#282515` - Resolved error on exporting a document which contains restart numbering.
- `#287633` - Table containing alignment is now exporting properly with alignment.
- `#286469` - Resolved table formatting issue when table splits to multiple pages.
- `#285747` - Resolved script error on server side export.
- `#284704` - Resolved script error on changing the footer distance.
- `#283529` - Resolved table layout issue when table is center aligned.
- `#283180` - Resolved font family no records found issue.
- `#282303` - Paste dropdown now hides when creating or opening new document.
- `#280951` - Table content renders properly now for table with merged cells.
- `#280973` - Resolved script while getting bookmarks from selection.
- `#284486` - Comment Tab in pane is removed when enable comment is false.
- `#283344` - Resolved the initial delay in pasting images.
- `#282707`,`#284035` - Resolved bullet list exporting issue in MAC devices.
- `#284412` - Comment mark is now deleted properly when comment is deleted.
- `#281339` - Resolved RTL issue when editing a list content.
- `#276616` - Paragraph maintained when inserting text in whole paragraph similar to MS Word.
- `#284775` - Resolved table resize enabled issue in protected mode.
- `#282504` - Resolved footer content overlapping issue when inserting image and table in footer.

## 18.2.47 (2020-07-28)

### Document Editor

#### New Features

- `#280089`, `#283427`, `#250760` - Added event to notify service failure.

#### Bug Fixes

- `#284775` - Resolved table resize enabled issue in protected mode.
- `#282504` - Resolved footer content overlapping issue when inserting image and table in footer.

## 18.2.46 (2020-07-21)

### Document Editor

#### New Features

- `#284937`- Added API show restrict editing pane.

#### Bug Fixes

- `#284486` - Comment Tab in pane is removed when enable comment is false.
- `#283344` - Resolved the initial delay in pasting images.
- `#282707`,`#284035` - Resolved bullet list exporting issue in MAC devices.
- `#284412` - Comment mark is now deleted properly when comment is deleted.
- `#281339` - Resolved RTL issue when editing a list content.
- `#276616` - Paragraph maintained when inserting text in whole paragraph similar to MS Word.

## 18.2.45 (2020-07-14)

### Document Editor

#### New Features

- Added API to delete bookmark.
- `#267515`- Added API to get searched item hierarchical index.

#### Bug Fixes

- `#283180` - Resolved font family no records found issue.
- `#282303` - Paste dropdown now hides when creating or opening new document.
- `#280951` - Table content renders properly now for table with merged cells.
- `#280973` - Resolved script while getting bookmarks from selection.

## 18.2.44 (2020-07-07)

### Document Editor

#### Breaking Changes

- The property `dropDownItems` in DropDownFormFieldInfo is changed to `dropdownItems`.

#### New Features

- `#268210` - Added support to customize user color in comment.
- `#268211` - Added support for restricting the user from delete comment.
- `#125563`,`#167098`,`#200655`,`#210401`,`#227193`,`#225881`,`#227250`,`#238531`,`#238529`,`#249506`,`#251329`,`#251816`,`#252988`,`#254094`, `#125563`,`#255850`, `#258472`, `#264794`, `#264634`, `#266286`, `#278191` - Added support for track changes.
- `#272634` - Added API to get hidden bookmark.
- `#267067`,`#267934` - Added API to customize font family dropdown.
- Added `height` and `width` API to define height and width of document editor.
- Added support for Legacy Form Fields.
- Added support for updating bookmark cross reference fields.

#### Bug Fixes

- `#279874` - Resolved paragraph spacing issue in the exported docx when opening it in libre office.
- `#278039` - Character formatting now preserved properly for dropdown field.
- `#278038` - Handle restrict editing inside dropdown field.
- `#278695` - Paste text only in editable region now working properly.
- `#267924` - Circular reference exception resolved when export the document contains chart.
- `#152124` - Resolved script error when modify style for locale changed text.
- `#266059` - Skipped adding bookmark when pasting content with bookmark.
- `#267949` - Table is now revert properly when insert table below another table.
- `#268472` - Selection format is now retrieved properly when paragraph contains more than two paragraph.
- `#269467` - List character format is now update properly when paragraph contains style.
- `#264813` - Tab width in list paragraph is now layout properly.
- `#264779` - Text clipping issue is resolved when text inside table.
- `#269397` - Context menu position is now update properly.
- `#269546` - Resolved key navigation issue when paragraph contains page break.
- `#269778` - $ symbol is now search properly when text contains $ symbol.
- `#269893` - Focus is in document editor after dialog gets closed.
- `#268907` - Selection character format is retrieved properly when selection is in list text.
- `#270424` - Footer content is now update properly when document contains more than one section.
- `#269743` , `#266534` - Focus is now update properly in Firefox when navigate to bookmark or search result.
- `#271039` - When paste content in RTL paragraph, formatting is now update properly.
- `#271928` - Resolved script when trying to create a new document and document have broken comments.
- `#271886` - Right tab width issue when paragraph contains right indent.
- `#271986` - Resolved error when updating Table of Contents with comments.
- `#271967` , `#271968` , `#271971` - Paste text only in empty paragraph is now working properly.
- `#271985` - Resolved script error when remove page break after bookmark.
- `#272009` , `#273868` - Modify style using numbering and paragraph dialog is now working properly.
- `#271977` - Pasting text in heading style is now maintain heading style in paragraph.
- `#271863` - Paragraph element splitting issue is now resolved when alignment is left and line combined with field.
- `#272290` - Resolved selection issue when paragraph contains line break character.
- `#272600` - Copy text with specific symbol (< , >) is now working properly.
- `#266059` - When pasting content with bookmark, bookmark is now preserved.
- `#269743` - Resolved focus issue in Firefox when navigate to bookmark or search result.
- `#269546` - Selection issue is now resolved when paragraph contains page break.
- `#274395` - Resolved script error when clicking on canvas in mobile view mode.
- `#273345` - Resolved table export issue when table contains vertical merge cell.
- `#271450` - Restricted user editing, when spinner is visible.
- `#271375` - Resolved table layout issue when table contain vertical merged cells.
- `#252868` - Resolved script error when minimize row height.
- `#275993` ,`#277160` - Button actions in comments and restrict editing pane will not trigger the form submit events now.
- `#276810` - Table alignment property is now export properly.
- `#277452` - Contents in table is now print properly.
- `#273870` - Bookmarks API will not retrieve bookmark when selection is at end of bookmark.
- `#273913` - Enable/Disable item by index in toolbar is now working properly.
- `#276399` - After copy and paste table, table is now exported properly.
- Comments pane locale string is now returns proper time.
- `#275137` - Apply vertical alignment for cell is now working properly when it inside table.
- `#275184` - Select bookmark API is now select bookmark element properly.
- `#275452` - Select current word using keys is now working properly when line contains comments.
- `#274525` - List font is now update properly on enter in list paragraph.
- `#273905` - Insert row below is now proper when cells have different borders.
- `#272762` - Modify list level using tab key is now proper.
- `#277823` - Resolved script error when deleting edit range element inside table.
- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.
- `#278685` - Resolved script error on backspace inside the edit range.
- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.

## 18.1.56 (2020-06-09)

### Document Editor

#### Bug Fixes

- `#278685` - Resolved script error on backspace inside the edit range.
- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.

## 18.1.55 (2020-06-02)

### Document Editor

#### Bug Fixes

- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.

## 18.1.54 (2020-05-26)

### Document Editor

#### Bug Fixes

- Comments pane locale string is now returns proper time.
- `#275137` - Apply vertical alignment for cell is now working properly when it inside table.
- `#275184` - Select bookmark API is now select bookmark element properly.
- `#275452` - Select current word using keys is now working properly when line contains comments.
- `#274525` - List font is now update properly on enter in list paragraph.
- `#273905` - Insert row below is now proper when cells have different borders.
- `#272762` - Modify list level using tab key is now proper.
- `#277823` - Resolved script error when deleting edit range element inside table.

## 18.1.53 (2020-05-19)

### Document Editor

#### New Features

- `#272634` - Added API to get hidden bookmark.

#### Bug Fixes

- `#275993` ,`#277160` - Button actions in comments and restrict editing pane will not trigger the form submit events now.
- `#276810` - Table alignment property is now export properly.
- `#277452` - Contents in table is now print properly.
- `#273870` - Bookmarks API will not retrieve bookmark when selection is at end of bookmark.
- `#273913` - Enable/Disable item by index in toolbar is now working properly.
- `#276399` - After copy and paste table, table is now exported properly.

## 18.1.52 (2020-05-13)

### Document Editor

#### New Features

- `#267067`,`#267934` - Added API to customize font family dropdown.

#### Bug Fixes

- `#271375` - Resolved table layout issue when table contain vertical merged cells.
- `#252868` - Resolved script error when minimize row height.

## 18.1.48 (2020-05-05)

### Document Editor

#### Bug Fixes

- `#272290` - Resolved selection issue when paragraph contains line break character.
- `#272600` - Copy text with specific symbol (< , >) is now working properly.
- `#266059` - When pasting content with bookmark, bookmark is now preserved.
- `#269743` - Resolved focus issue in Firefox when navigate to bookmark or search result.
- `#269546` - Selection issue is now resolved when paragraph contains page break.
- `#274395` - Resolved script error when clicking on canvas in mobile view mode.
- `#273345` - Resolved table export issue when table contains vertical merge cell.
- `#271450` - Restricted user editing, when spinner is visible.

## 18.1.46 (2020-04-28)

### Document Editor

#### New Features

- Added `height` and `width` API to define height and width of document editor.

#### Bug Fixes

- `#271928` - Resolved script when trying to create a new document and document have broken comments.
- `#271886` - Right tab width issue when paragraph contains right indent.
- `#271986` - Resolved error when updating Table of Contents with comments.
- `#271967` , `#271968` , `#271971` - Paste text only in empty paragraph is now working properly.
- `#271985` - Resolved script error when remove page break after bookmark.
- `#272009` , `#273868` - Modify style using numbering and paragraph dialog is now working properly.
- `#271977` - Pasting text in heading style is now maintain heading style in paragraph.
- `#271863` - Paragraph element splitting issue is now resolved when alignment is left and line combined with field.

## 18.1.45 (2020-04-21)

### Document Editor

#### Bug Fixes

- `#268907` - Selection character format is retrieved properly when selection is in list text.
- `#270424` - Footer content is now update properly when document contains more than one section.
- `#269743` , `#266534` - Focus is now update properly in Firefox when navigate to bookmark or search result.
- `#271039` - When paste content in RTL paragraph, formatting is now update properly.

## 18.1.44 (2020-04-14)

### Document Editor

#### New Features

- Added support for Legacy Form Fields.
- Added support for updating bookmark cross reference fields.

#### Bug Fixes

- `#269397` - Context menu position is now update properly.
- `#269546` - Resolved key navigation issue when paragraph contains page break.
- `#269778` - $ symbol is now search properly when text contains $ symbol.
- `#269893` - Focus is in document editor after dialog gets closed.

## 18.1.43 (2020-04-07)

### Document Editor

#### Bug Fixes

- `#267924` - Circular reference exception resolved when export the document contains chart.
- `#152124` - Resolved script error when modify style for locale changed text.
- `#266059` - Skipped adding bookmark when pasting content with bookmark.
- `#267949` - Table is now revert properly when insert table below another table.
- `#268472` - Selection format is now retrieved properly when paragraph contains more than two paragraph.
- `#269467` - List character format is now update properly when paragraph contains style.
- `#264813` - Tab width in list paragraph is now layout properly.
- `#264779` - Text clipping issue is resolved when text inside table.

## 18.1.42 (2020-04-01)

### Document Editor

#### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.
- Some locale properties are renamed as below

|Previous|Now|
|----|----|
|Linked(Paragraph and Character)|Linked Style|
|Don't add space between the paragraphs of the same styles|Contextual Spacing|
|The password don't match|Password Mismatch|
|Exceptions (optional)|Exceptions Optional|
|Select parts of the document and choose users who are allowed to freely edit them.|Select Part Of Document And User|
|Yes, Start Enforcing Protection|Enforcing Protection|
|This document is protected from unintentional editing. You may edit in this region.|Protected Document|
|You may format text only with certain styles.|You may format text only with certain styles|
|Type your comment hear|Type your comment here|
|Added comments not posted. If you continue, that comment will be discarded.|Discard Comment|
|Header & Footer|Header And Footer|
|Different header and footer for odd and even pages.|Different header and footer for odd and even pages|
|Different Odd & Even Pages|Different Odd And Even Pages|
|Different header and footer for first page.|Different header and footer for first page|
|Distance from top of the page to top of the header|Distance from top of the page to top of the header|
|Distance from bottom of the page to bottom of the footer.|Distance from bottom of the page to bottom of the footer|
|Insert / Delete|Insert Or Delete|
|Number of heading or outline levels to be shown in table of contents.|Number of heading or outline levels to be shown in table of contents|
|Show page numbers in table of contents.|Show page numbers in table of contents|
|Right align page numbers in table of contents.|Right align page numbers in table of contents|
|Use hyperlinks instead of page numbers.|Use hyperlinks instead of page numbers|
|Bold (Ctrl+B)|Bold Tooltip|
|Italic (Ctrl+I)|Italic Tooltip|
|Underline (Ctrl+U)|Underline Tooltip|
|Superscript (Ctrl+Shift++)|Superscript Tooltip|
|Subscript (Ctrl+=)|Subscript Tooltip|
|Align left (Ctrl+L)|Align left Tooltip|
|Center (Ctrl+E)|Center Tooltip|
|Align right (Ctrl+R)|Align right Tooltip|
|Justify (Ctrl+J)|Justify Tooltip|
|Create a new document.|Create a new document|
|Open a document.|Open a document|
|Undo the last operation (Ctrl+Z).|Undo Tooltip|
|Redo the last operation (Ctrl+Y).|Redo Tooltip|
|Insert inline picture from a file.|Insert inline picture from a file|
|Create a link in your document for quick access to web pages and files (Ctrl+K).|Create Hyperlink|
|Insert a bookmark in a specific place in this document.|Insert a bookmark in a specific place in this document|
|Provide an overview of your document by adding a table of contents.|Provide an overview of your document by adding a table of contents|
|Add or edit the header.|Add or edit the header|
|Add or edit the footer.|Add or edit the footer|
|Open the page setup dialog.|Open the page setup dialog|
|Add page numbers.|Add page numbers|
|Find text in the document (Ctrl+F).|Find Text|
|The current page number in the document. Click or tap to navigate specific page.|Current Page Number|

#### New Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.
- `253670` - Enhancements for copy and paste operation.
- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.
- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.
- `#256487` - Enhancements for mouse and keyboard selection.

#### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.
- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.
- `150960` - Enable/disable comment now working properly.
- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.
- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.
- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.
- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.
- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.
- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.
- `#264048` , `#267560` - Header style formatting is now preserved properly in local copy and paste.
- `#266571` - Table with auto fit is now layout properly.
- `#266534` - Resolved text navigation issue when spell check is enabled.
- `#151718` - Dynamic toolbar injection is now working properly.
- `#266060` - Fixed paste match destination formatting issue.
- `#267089` , `#255993` - Fixed exception when pasting html content.
- `#267793`, `#152022` - Resolved page scrolling issue when copy is triggered.
- `#267769` - Table width is not update properly when insert table inside table cell.

## 18.1.36-beta (2020-03-19)

### Document Editor

#### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.
- Some locale properties are renamed as below

|Previous|Now|
|----|----|
|Linked(Paragraph and Character)|Linked Style|
|Don't add space between the paragraphs of the same styles|Contextual Spacing|
|The password don't match|Password Mismatch|
|Exceptions (optional)|Exceptions Optional|
|Select parts of the document and choose users who are allowed to freely edit them.|Select Part Of Document And User|
|Yes, Start Enforcing Protection|Enforcing Protection|
|This document is protected from unintentional editing. You may edit in this region.|Protected Document|
|You may format text only with certain styles.|You may format text only with certain styles|
|Type your comment hear|Type your comment here|
|Added comments not posted. If you continue, that comment will be discarded.|Discard Comment|
|Header & Footer|Header And Footer|
|Different header and footer for odd and even pages.|Different header and footer for odd and even pages|
|Different Odd & Even Pages|Different Odd And Even Pages|
|Different header and footer for first page.|Different header and footer for first page|
|Distance from top of the page to top of the header|Distance from top of the page to top of the header|
|Distance from bottom of the page to bottom of the footer.|Distance from bottom of the page to bottom of the footer|
|Insert / Delete|Insert Or Delete|
|Number of heading or outline levels to be shown in table of contents.|Number of heading or outline levels to be shown in table of contents|
|Show page numbers in table of contents.|Show page numbers in table of contents|
|Right align page numbers in table of contents.|Right align page numbers in table of contents|
|Use hyperlinks instead of page numbers.|Use hyperlinks instead of page numbers|
|Bold (Ctrl+B)|Bold Tooltip|
|Italic (Ctrl+I)|Italic Tooltip|
|Underline (Ctrl+U)|Underline Tooltip|
|Superscript (Ctrl+Shift++)|Superscript Tooltip|
|Subscript (Ctrl+=)|Subscript Tooltip|
|Align left (Ctrl+L)|Align left Tooltip|
|Center (Ctrl+E)|Center Tooltip|
|Align right (Ctrl+R)|Align right Tooltip|
|Justify (Ctrl+J)|Justify Tooltip|
|Create a new document.|Create a new document|
|Open a document.|Open a document|
|Undo the last operation (Ctrl+Z).|Undo Tooltip|
|Redo the last operation (Ctrl+Y).|Redo Tooltip|
|Insert inline picture from a file.|Insert inline picture from a file|
|Create a link in your document for quick access to web pages and files (Ctrl+K).|Create Hyperlink|
|Insert a bookmark in a specific place in this document.|Insert a bookmark in a specific place in this document|
|Provide an overview of your document by adding a table of contents.|Provide an overview of your document by adding a table of contents|
|Add or edit the header.|Add or edit the header|
|Add or edit the footer.|Add or edit the footer|
|Open the page setup dialog.|Open the page setup dialog|
|Add page numbers.|Add page numbers|
|Find text in the document (Ctrl+F).|Find Text|
|The current page number in the document. Click or tap to navigate specific page.|Current Page Number|

#### New Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.
- `253670` - Enhancements for copy and paste operation.
- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.
- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.
- `#256487` - Enhancements for mouse and keyboard selection.

#### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.
- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.
- `150960` - Enable/disable comment now working properly.
- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.
- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.
- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.
- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.
- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.
- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.

## 17.4.55 (2020-03-10)

### Document Editor

#### New Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.

#### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.

## 17.4.51 (2020-02-25)

### Document Editor

#### Bug Fixes

- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.

## 17.4.50 (2020-02-18)

### Document Editor

#### New Features

- `253670` - Enhancements for copy and paste operation.

#### Bug Fixes

- `150960` - Enable/disable comment now working properly.

## 17.4.49 (2020-02-11)

### Document Editor

#### New Features

- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.

#### Bug Fixes

- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.

## 17.4.47 (2020-02-05)

### Document Editor

#### New Features

- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.

#### Bug Fixes

- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.

## 17.4.46 (2020-01-30)

### Document Editor

#### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.

#### Bug Fixes

- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.

## 17.4.43 (2020-01-14)

### Document Editor

#### Bug Fixes

- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.

## 17.4.41 (2020-01-07)

### Document Editor

#### New Features

- `#256487` - Enhancements for mouse and keyboard selection.

#### Bug Fixes

- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.

## 17.4.40 (2019-12-24)

### Document Editor

#### Breaking Changes

- Some locale properties are renamed as below

|Previous|Now|
|----|----|
|Linked(Paragraph and Character)|Linked Style|
|Don't add space between the paragraphs of the same styles|Contextual Spacing|
|The password don't match|Password Mismatch|
|Exceptions (optional)|Exceptions Optional|
|Select parts of the document and choose users who are allowed to freely edit them.|Select Part Of Document And User|
|Yes, Start Enforcing Protection|Enforcing Protection|
|This document is protected from unintentional editing. You may edit in this region.|Protected Document|
|You may format text only with certain styles.|You may format text only with certain styles|
|Type your comment hear|Type your comment here|
|Added comments not posted. If you continue, that comment will be discarded.|Discard Comment|
|Header & Footer|Header And Footer|
|Different header and footer for odd and even pages.|Different header and footer for odd and even pages|
|Different Odd & Even Pages|Different Odd And Even Pages|
|Different header and footer for first page.|Different header and footer for first page|
|Distance from top of the page to top of the header|Distance from top of the page to top of the header|
|Distance from bottom of the page to bottom of the footer.|Distance from bottom of the page to bottom of the footer|
|Insert / Delete|Insert Or Delete|
|Number of heading or outline levels to be shown in table of contents.|Number of heading or outline levels to be shown in table of contents|
|Show page numbers in table of contents.|Show page numbers in table of contents|
|Right align page numbers in table of contents.|Right align page numbers in table of contents|
|Use hyperlinks instead of page numbers.|Use hyperlinks instead of page numbers|
|Bold (Ctrl+B)|Bold Tooltip|
|Italic (Ctrl+I)|Italic Tooltip|
|Underline (Ctrl+U)|Underline Tooltip|
|Superscript (Ctrl+Shift++)|Superscript Tooltip|
|Subscript (Ctrl+=)|Subscript Tooltip|
|Align left (Ctrl+L)|Align left Tooltip|
|Center (Ctrl+E)|Center Tooltip|
|Align right (Ctrl+R)|Align right Tooltip|
|Justify (Ctrl+J)|Justify Tooltip|
|Create a new document.|Create a new document|
|Open a document.|Open a document|
|Undo the last operation (Ctrl+Z).|Undo Tooltip|
|Redo the last operation (Ctrl+Y).|Redo Tooltip|
|Insert inline picture from a file.|Insert inline picture from a file|
|Create a link in your document for quick access to web pages and files (Ctrl+K).|Create Hyperlink|
|Insert a bookmark in a specific place in this document.|Insert a bookmark in a specific place in this document|
|Provide an overview of your document by adding a table of contents.|Provide an overview of your document by adding a table of contents|
|Add or edit the header.|Add or edit the header|
|Add or edit the footer.|Add or edit the footer|
|Open the page setup dialog.|Open the page setup dialog|
|Add page numbers.|Add page numbers|
|Find text in the document (Ctrl+F).|Find Text|
|The current page number in the document. Click or tap to navigate specific page.|Current Page Number|

#### Bug Fixes

- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.

## 17.4.39 (2019-12-17)

### Document Editor

#### New Features

- `#249197`, `#249364`, `#148274`, `#253325` Added support for converting SFDT to Word document in server side.
- `#125563`, `#158324`, `#210401`, `#231575`, `#239871`, `#238529`, `#240405`, `#252988`, `#255850` - Added support for insert and edit comments.
- `#245203` - Added support for section pages field.
- `#255626`,`#254750` - RTL and locale is now updated properly on property change.
- `#251866` - Enhancement for Auto list feature.

## 17.3.29 (2019-11-26)

### Document Editor

#### Bug Fixes

- `#252868`, `#254873` - Resolved script error when resizing table row.
- `#251882` - Line spacing for paragraph is now apply properly when line spacing type is atleast.
- `#143383` - Paper size drop down is now update properly based on page width and page height.
- `#255741` - Fixed the focus issue when key pressed on input element.
- `#250770` - RTL text with special characters are now layout properly.
- `10269` - Line spacing is now exported properly.

## 17.3.28 (2019-11-19)

### Document Editor

#### New Features

- `#246305` - Added API to check whether selection is in field.
- `#246305` - Added API to select the current field if selection is in field.
- `#246305` - Added API to perform delete.

#### Bug Fixes

- `#253511` - Line spacing is now applying properly after set locale to document editor.
- `#254998` , `#251884` - Updated bookmark collection when bookmark gets added.
- `#246264` - Table with vertical merged split cells is now layout properly.
- `#246884` - List is now copied properly.

## 17.3.27 (2019-11-12)

### Document Editor

#### New Features

- `#253104` - Added API to set custom header in XmlHttpRequest.

#### Bug Fixes

- `#251603` - When apply numbering list, continue numbering is now updated properly.
- `#251689` - Resolved script error after cut and undo operation.
- `#250599` - Script error now resolved when deleting page break.
- `#250914` - Updated bookmark collection when bookmark gets removed.
- `#251606` - Scrolling is now proper when mouse move out of document editor.

## 17.3.26 (2019-11-05)

### Document Editor

#### New Features

- `#250061`, `#246305` - Added property to retrieve bookmarks on selection.
- `#251247` - Added API for restrict editing.
- `#251247`, `#238969`, `#252954`,`#253149` - Added API for selection.

#### Bug Fixes

- `251355` - Script error while importing the document is now resolved.
- `251910` - Status bar disappear on mouse hover is now resolved.
- `251219` - Script errors due to Content security policy are now resolved.

## 17.3.21 (2019-10-30)

### Document Editor

#### Bug Fixes

- `#251576` - Enable repeat row header is now enabled properly in table properties dialog.
- `#250638` - Scroll position is now maintained after inserting columns.
- `#253260` - Script error now resolved when double click on header footer.
- `#252506` - Spell checker performance has been improved.

## 17.3.19 (2019-10-22)

### Document Editor

#### New Features

- `#249783` - Added API to set default section format properties.

#### Bug Fixes

- `#249729` - List now updated when copy and paste from outside editor.
- `#249574` - Table now layout properly when resizing table middle column.
- `#249767` - Control elements are now destroyed properly.
- `#250041` - Paragraph formatting is now preserved properly when copy and paste contents.

## 17.3.17 (2019-10-15)

### Document Editor

#### Bug Fixes

- `#246264` - Page now becomes responsive, when document contains table with split cell widget.
- `#249138` - Table of contents dialog now rendered properly.
- `#245757` - Page now becomes responsive when we edit in header footer region.
- `#249049` - List continue numbering issues are resolved now.
- `#248304`, `#250801` - TOC is now updated properly, when paragraph contains page break with heading style.
- `#249736` - Focus is now set to text search result, when search icon is clicked in options pane.
- `#249542` - Draw image error is resolved now, when document contains invalid image source.
- `#249329` - Added localization for missed text in document editor.
- `#248710` - Character format is now applied, when selection start is in field.

## 17.3.16 (2019-10-09)

### Document Editor

#### Bug Fixes

- `#246365`, `#250077` - Table Width for auto type table format is now updated properly.
- `#249283` - Command + A key triggers properly in MAC machine's Safari browser.
- `#248301` - Text clipping issues are fixed when text inside table cell.
- `#246587` - backward selection issues and backspace issues for restrict editing are resolved now.
- `#244786` , `#248882` - Text now rendered properly in RTL paragraph, when copy and paste locally.
- `#248304` - Tab leader is now preserved properly, when updating table of contents.

## 17.3.14 (2019-10-03)

### Document Editor

#### New Features

- `#245203` - Added support to preserve and layout start page number for sections

#### Bug Fixes

- `#243771` - Clipboard data is now pasted as plain text, If XHTML validation fails.
- `#246264`, `#246143`, `#247143` - Styles now updated properly for the selected paragraph.
- `#246003` - Default character and paragraph format is now set on initial control rendering.
- `#245766` - Table of contents is now copied properly.
- `#245891` - Merge field is now copied as a plain text.
- `#245860`, `#246440` - Script error is fixed after paste switch to different formatting.
- `#245461` - Left border width is now updated properly.
- `#246168` - List tab width is now calculated properly when hanging indent is specified.
- `#245890` - Script error is fixed when pasting content copied from word.
- `#247896`, `#147336` - Text is now visible when its container contains flex style property.
- `#246884` - Copy and paste single paragraph containing list is now resolved.
- `#247831` - Script error is fixed while importing document.
- `#246168` - List font style is now rendered properly.
- `#246751` - Script error is now resolved when editing inside nested table.
- `#245453` - Paragraph is now lay-outed properly when it has based on style.
- `#244786`, `#248882` - RTL text exporting issues are fixed.
- `#244786` - Cursor now updated properly after inserting merge field when paragraph is set as RTL.

## 17.3.9-beta (2019-09-20)

### Document Editor

#### Bug Fixes

- `#245457`, `#245459` - Table is now layout properly.
- `#246127`, `#246597`, `#247364` - Page number field is now exported properly in Sfdt export.

## 17.2.49 (2019-09-04)

### Document Editor

#### Bug Fixes

- `#245473` - Line spacing is now exported properly.
- `#245469`, `#245470` - List level paragraph heading is now layout properly on page break.
- `#243495` - width is now calculated properly for the tab element, if it has single tab stop.
- `#244893` - Paste event is now triggered in safari browser.
- `#246003` - Insert field is now updated based on current selection format.
- `#243919` - Script error is fixed while pressing Ctrl + A.

## 17.2.47 (2019-08-27)

### Document Editor

#### Bug Fixes

- `#243874` - Contextual Spacing property on paragraph is now exported properly.
- `#243878` - Copy and paste when the document contains page break character within control is now working.
- `#243495` - Follow character width for list is now updated properly.

## 17.2.41 (2019-08-14)

### Document Editor

#### Bug Fixes

- `#243495` - List level paragraph heading 2 first line indent style is now applied properly.
- `#243495` - Section break paragraph style layout is now applied properly.
- `#243495` - TOC tab header layout is now applied properly for sub headings.
- `#243495` - Script error is fixed when calculating tab width for list in TOC.
- `#243495` - TOC hyperlink text style is now preserved properly.
- `#243878` - Table cell is now exported properly when table contains spanned rows.

## 17.2.40 (2019-08-06)

### Document Editor

#### Bug Fixes

- `#241445` - List level for RTL paragraph is now applied properly when tab is applied.
- `#241445` - Undo and redo is now working properly, after list level modified for RTL paragraph.
- `#241445` - Paragraph is now layout properly, when entering combination of RTL and English text.
- `#243622` - List is now exported properly in sfdt format.

## 17.2.39 (2019-07-30)

### Document Editor

#### New Features

- `#238969` - Added API to set paste formatting options

#### Bug Fixes

- `#146208` - Header footer contents are now rendered properly on print without any blur.
- `#240266` - Fixed Exception thrown while updating page number.

## 17.2.36 (2019-07-24)

### Document Editor

#### Bug Fixes

- `#239985` - List paragraph with style is now layout properly.
- `#236808` - Table is now layout properly if table width type is auto.
- `#228049` - Paragraph with right tab stop is now layout properly.

## 17.2.35 (2019-07-17)

### Document Editor

#### Bug Fixes

- `#144676` - Table is now layout properly if table contains grid after value.
- `#235990` - Table is now layout properly if table width type is not auto.
- `#228049` - Table with row margin is now layout properly.
- `#228049` - Text is now rendered properly without clipping.
- `#237734` - Table borders are now exported properly.

## 17.2.34 (2019-07-11)

### Document Editor

#### Breaking Changes

- The `pasteLocal` method in `Editor` module is changed to `paste`, which accepts the sfdt string as argument. If sfdt string does not present, paste the local clipboard data.

#### Bug Fixes

- `#240558` - Page numbers are now updated properly.
- `#228049` - Table left border and shadings are now rendered properly.
- `#228049` - Paragraph left indent will never add extra space in table cell.
- `#239144` - Font Type and size value gets highlight when focused on corresponding dropdown list.

## 17.2.28-beta (2019-06-27)

### Document Editor

#### Breaking Changes

- The `serviceUrl` property in `DocumentEditorContainer` component no longer expect the full path of the Web API action. Henceforth, it only expects the path up to controller name alone. And the Web API action name can be configured in `serverActionSettings` property for different actions.

#### New Features

- `#229069` - Added contextual spacing support.
- `#158324`, `#226019`, `#226018`, `#227644`, `#238417` - Added support for chart preservation.
- `#94889` ,`#87537`, `#223333` ,`#222513`, `#224521` ,`#227620` ,`#227052` ,`#227362`, `#236997` - Added spell check support.
- `#226631` ,`#227594`, `#231373`, `#233073` - Added clipboard paste with formatted content.
- `#140903` ,`#227192`, `#227641` ,`#227640` - Added restrict editing support.
- `#237725` - Added API to customize gap between each page.

#### Bug Fixes

- `#237415`, `#238902` - Document exported properly when document contains hyphen character.
- `#228049` - Tab character width is now calculated properly.
- `#228049` - Table with repeat header is now layout properly.
- `#234073` - Table is now pasted properly.
- `#236808` - Document exported properly when document contains text form field.
- `#144848` - Table shading is now exported properly.

## 17.1.50 (2019-06-04)

### Document Editor

#### Bug Fixes

- `#236930` - Table exported properly when document contains continuous table.
- `#236502` - Table last column resizing is now working properly.

## 17.1.49 (2019-05-29)

### Document Editor

#### Bug Fixes

- `#226399` - Header and Footer is now layout properly if document contains section break

## 17.1.48 (2019-05-21)

### Document Editor

#### Bug Fixes

- `#234799` - Bold button is now aligned properly in modify style dialog.
- `#236061`, `#236039` - Document editor container component is now destroyed properly.
- `#234146` - Section formats are now applied properly.
- `#233556`, `#234406` - Table of Contents are now inserted properly.
- `#234249` - Multilevel lists are now exported properly.
- `#234084` - Selection is now updated properly after clear formatting.
- `#234073` - Copy is now working properly for nested table.
- `#234799` - Renaming the existing style in modify style dialog is now updated properly.
- `#234799` - Text alignment is now updating properly while modify style using style dialog.

## 17.1.47 (2019-05-14)

### Document Editor

#### New Features

- `#142821` - Added API to insert bookmark and fetch all bookmarks in document.
- `#142820` - Added API to insert hyperlink.

#### Bug Fixes

- `#230628` - Updated dialog animation.

## 17.1.44 (2019-05-07)

### Document Editor

#### Bug Fixes

- `#233280` - Improvised performance while updating page field.

## 17.1.43 (2019-04-30)

### Document Editor

#### Bug Fixes

- `#233908` - Height for merged cell is now updated properly.

## 17.1.42 (2019-04-23)

### Document Editor

#### Bug Fixes

- `#231353` - Text search results are now navigated properly.

## 17.1.41 (2019-04-16)

### Document Editor

#### Bug Fixes

- `#232616` - Document contents are now exported properly.
- `#232616` - Page hang on editing the document is fixed.
- `#232327` - Tables are now removed properly.

## 17.1.40 (2019-04-09)

### Document Editor

#### Bug Fixes

- Tab stop width is now calculated properly.
- First page header and footer is now layout properly.
- Scrollbar now updated properly in Internet Explorer.
- Page reload issue on button click is fixed.

## 17.1.38 (2019-03-29)

### Document Editor

#### New Features

- Added API to customize the default character format and paragraph format of document editor.
- Added support to customize context menu.
- Optimized text rendering.

#### Bug Fixes

- Section break is now serialized properly.

## 17.1.32-beta (2019-03-13)

### Document Editor

#### New Features

- Added API to customize the default character format and paragraph format of document editor.
- Added support to customize context menu.
- Optimized text rendering.

#### Bug Fixes

- Section break is now serialized properly.

## 16.4.54 (2019-02-19)

### Document Editor

#### Bug Fixes

- Default tab width is parsed and serialized properly.

## 16.4.53 (2019-02-13)

### Document Editor

#### Bug Fixes

- Table inside header is now layout properly.
- Table re-layout while editing now layout properly.
- Page break inside table is handled.

## 16.4.48 (2019-01-22)

### Document Editor

#### Bug Fixes

- Broken image rendering is handled.

## 16.4.46 (2019-01-08)

### Document Editor

#### New Features

- Table editing performance optimized.

## 16.4.45 (2019-01-02)

### Document Editor

#### Bug Fixes

- Table border is rendered properly.

## 16.4.44 (2018-12-24)

### Document Editor

#### Bug Fixes

- Tab stop now layout properly in header and footer.
- Empty header and footer now layout properly.
- Table column span values are now updated properly.

## 16.4.40-beta (2018-12-10)

### Document Editor

#### New Features

- Added support for Right-to-left flow direction in control.
- Added support for table auto fit layout.
- Added Document Editor Container component for toolbar and properties pane.

## 16.3.33 (2018-11-20)

### Document Editor

#### Bug Fixes

- Updated Readme and GitHub URL.

## 16.3.29 (2018-10-31)

### Document Editor

#### New Features

- Added support for input method editor.

#### Bug Fixes

- Images are now displayed properly.

## 16.3.24 (2018-10-09)

### Document Editor

#### Bug Fixes

- Resizing table columns are working properly for merged cells.

## 16.3.23 (2018-10-03)

### Document Editor

#### New Features

- Added `created` and `destroyed` events in `DocumentEditor`.

## 16.3.21 (2018-09-22)

### Document Editor

#### Bug Fixes

- Cursor position is now updated properly when placed after image, bookmark.

## 16.3.17 (2018-09-12)

### Document Editor

#### New Features

- Added support for Page break.
- Added `insertSectionBreak` method in `Editor` class to insert a section break at current selection.

## 16.2.48 (2018-08-14)

### Document Editor

#### Bug Fixes

- Selection position is now updated properly on “Enter” key inside vertical merged cell.
- The content of a page no longer overlaps on next page while editing document contents.
- Undo & redo now works properly for list text editing.
- Line height is now updated properly for the paragraph contains bookmark element alone.

## 16.2.46 (2018-07-30)

### Document Editor

#### New Features

- Added support for .NET Framework 4.0 and 4.5 in `Syncfusion.EJ2.DocumentEditor` NuGet package.

## 16.2.41 (2018-06-25)

### Document Editor

The Document Editor component is used to create, edit, view, and print Word documents in web applications. All the user interactions and editing operations that run purely in the client-side provides much faster editing experience to the users.

- Opens the native `Syncfusion Document Text (*.sfdt)` format documents in the client-side.
- Saves the documents in the client-side as `Syncfusion Document Text (*.sfdt)` and `Word document (*.docx)`.
- Supports document elements like text, inline image, table, fields, bookmark, section, header, and footer.
- Supports the commonly used fields like hyperlink, page number, page count, and table of contents.
- Supports formats like text, paragraph, bullets and numbering, table, page settings, etc.
- Provides support to create, edit, and apply paragraph and character styles.
- Provides support to find and replace text within the document.
- Supports all the common editing and formatting operations along with undo and redo.
- Provides support to cut, copy, and paste rich text contents within the component. Also allows pasting simple text to and from other applications.
- Allows user interactions like zoom, scroll, select contents through touch, mouse, and keyboard.
- Provides intuitive UI options like context menu, dialogs, and navigation pane.
- Creates a lightweight Word viewer using module injection to view and prints Word documents.
- Added `Syncfusion.EJ2.DocumentEditor` NuGet package that contains helper library for converting Word documents to `Syncfusion Document Text (*.sfdt)`. It supports .NET Standard 2.0 Framework.