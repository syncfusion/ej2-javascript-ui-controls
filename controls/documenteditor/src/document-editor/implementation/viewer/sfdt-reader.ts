/* eslint-disable */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { WAbstractList } from '../list/abstract-list';
import { WLevelOverride } from '../list/level-override';
import { WCharacterFormat, WListFormat, WParagraphFormat, WCellFormat, WTableFormat, WSectionFormat, WRowFormat, WColumnFormat } from '../format/index';
import { WBorder, WBorders, WShading, WCharacterStyle, WParagraphStyle, WStyles, WStyle, WTabStop } from '../format/index';
import { LayoutViewer, DocumentHelper } from './viewer';
import {
    Widget, LineWidget, ParagraphWidget, ImageElementBox, BodyWidget, TextElementBox, TableCellWidget,
    TableRowWidget, TableWidget, FieldElementBox, BlockWidget, HeaderFooterWidget, HeaderFooters,
    BookmarkElementBox, FieldTextElementBox, TabElementBox, EditRangeStartElementBox,
    EditRangeEndElementBox, ChartElementBox, ChartCategoryAxis, ChartLegend, ChartLayout, ChartTitleArea, ChartDataFormat,
    ChartDataTable, ChartArea, ChartCategory, ChartData, ChartSeries, ChartDataLabels, ChartTrendLines,
    ChartSeriesFormat, ElementBox, CommentCharacterElementBox, CommentElementBox, FormField,
    TextFormField, CheckBoxFormField, DropDownFormField, ShapeElementBox, LineFormat, TextFrame, ContentControlProperties,
    ContentControlListItems, ContentControl, IWidget, CheckBoxState, XmlMapping, CustomXmlPart, Footnote, FootnoteElementBox, FillFormat,
    TablePosition,
    BreakElementBox
} from './page';
import { HelperMethods } from '../editor/editor-helper';
import { Dictionary } from '../../base/dictionary';
import { ChartComponent } from '@syncfusion/ej2-office-chart';
import { Revision } from '../track-changes/track-changes';
import { AutoShapeType, BaselineAlignment, BiDirectionalOverride, BreakClearType, CellVerticalAlignment, CheckBoxSizeType, CompatibilityMode, ContentControlType, FollowCharacterType, FootEndNoteNumberFormat, FootnoteRestartIndex, FootnoteType, HeightType, HighlightColor, HorizontalAlignment, HorizontalOrigin, LineDashing, LineFormatType, LineSpacingType, LineStyle, ListLevelPattern, OutlineLevel, ProtectionType, RevisionType, Strikethrough, StyleType, TabJustification, TabLeader, TableAlignment, TextAlignment, TextFormFieldType, TextureStyle, TextWrappingStyle, TextWrappingType, Underline, VerticalAlignment, VerticalOrigin, WidthType } from '../../base/types';
import { Themes, FontSchemeStruct, MajorMinorFontScheme } from '../index';
import { sectionsProperty, imagesProperty, fontSubstitutionTableProperty, characterFormatProperty, paragraphFormatProperty, listsProperty, abstractListsProperty, backgroundProperty, stylesProperty, commentsProperty, revisionsProperty, customXmlProperty, defaultTabWidthProperty, formattingProperty, trackChangesProperty, protectionTypeProperty, enforcementProperty, hashValueProperty, saltValueProperty, cryptProviderTypeProperty, cryptAlgorithmClassProperty, cryptAlgorithmTypeProperty, cryptAlgorithmSidProperty, cryptSpinCountProperty, doNotUseHTMLParagraphAutoSpacingProperty, alignTablesRowByRowProperty, formFieldShadingProperty, lastParagraphMarkCopiedProperty, footnotesProperty, endnotesProperty, compatibilityModeProperty, themeFontLanguagesProperty, themesProperty, nameProperty, basedOnProperty, nextProperty, linkProperty, localeIdProperty, localeIdFarEastProperty, localeIdBidiProperty, boldProperty, italicProperty, underlineProperty, baselineAlignmentProperty, strikethroughProperty, highlightColorProperty, fontSizeProperty, fontColorProperty, fontFamilyProperty, styleNameProperty, bidiProperty, bdoProperty, fontSizeBidiProperty, fontFamilyBidiProperty, boldBidiProperty, italicBidiProperty, allCapsProperty, complexScriptProperty, fontFamilyAsciiProperty, fontFamilyFarEastProperty, fontFamilyNonFarEastProperty, revisionIdsProperty, listIdProperty, listLevelNumberProperty, leftIndentProperty, rightIndentProperty, firstLineIndentProperty, textAlignmentProperty, afterSpacingProperty, beforeSpacingProperty, spaceAfterAutoProperty, spaceBeforeAutoProperty, lineSpacingProperty, lineSpacingTypeProperty, listFormatProperty, keepWithNextProperty, widowControlProperty, keepLinesTogetherProperty, outlineLevelProperty, contextualSpacingProperty, bordersProperty, tabsProperty, headerDistanceProperty, footerDistanceProperty, differentFirstPageProperty, differentOddAndEvenPagesProperty, pageWidthProperty, pageHeightProperty, leftMarginProperty, rightMarginProperty, topMarginProperty, bottomMarginProperty, restartPageNumberingProperty, pageStartingNumberProperty, endnoteNumberFormatProperty, footNoteNumberFormatProperty, restartIndexForFootnotesProperty, restartIndexForEndnotesProperty, initialFootNoteNumberProperty, initialEndNoteNumberProperty, pageNumberStyleProperty, columnsProperty, numberOfColumnsProperty, equalWidthProperty, lineBetweenColumnsProperty, breakCodeProperty, cellWidthProperty, columnSpanProperty, rowSpanProperty, verticalAlignmentProperty, allowBreakAcrossPagesProperty, isHeaderProperty, heightTypeProperty, beforeWidthProperty, afterWidthProperty, gridBeforeProperty, gridBeforeWidthProperty, gridBeforeWidthTypeProperty, gridAfterProperty, gridAfterWidthProperty, gridAfterWidthTypeProperty, allowAutoFitProperty, cellSpacingProperty, shadingProperty, tableAlignmentProperty, preferredWidthProperty, preferredWidthTypeProperty, horizontalPositionAbsProperty, textureProperty, backgroundColorProperty, foregroundColorProperty, shadowProperty, hasNoneStyleProperty, verticalProperty, horizontalProperty, diagonalUpProperty, diagonalDownProperty, lineStyleProperty, lineWidthProperty, layoutProperty, dataFormatProperty, yValueProperty, chartDataProperty, categoryXNameProperty, lineProperty, foreColorProperty, patternProperty, layoutXProperty, layoutYProperty, directionProperty, endStyleProperty, numberValueProperty, markerStyleProperty, markerColorProperty, markerSizeProperty, forwardProperty, backwardProperty, interceptProperty, isDisplayRSquaredProperty, isDisplayEquationProperty, seriesNameProperty, dataLabelProperty, errorBarProperty, seriesFormatProperty, trendLinesProperty, dataPointsProperty, firstSliceAngleProperty, holeSizeProperty, isLegendKeyProperty, isBubbleSizeProperty, isCategoryNameProperty, isSeriesNameProperty, isValueProperty, isPercentageProperty, isLeaderLinesProperty, showSeriesKeysProperty, hasHorizontalBorderProperty, hasVerticalBorderProperty, hasBordersProperty, categoryTypeProperty, chartCategoryProperty, chartSeriesProperty, chartAreaProperty, chartTitleAreaProperty, plotAreaProperty, chartLegendProperty, chartPrimaryCategoryAxisProperty, chartPrimaryValueAxisProperty, chartTitleProperty, chartTypeProperty, gapWidthProperty, overlapProperty, chartDataTableProperty, textProperty, shapeIdProperty, alternativeTextProperty, visibleProperty, widthProperty, heightProperty, widthScaleProperty, heightScaleProperty, lineFormatProperty, fillFormatProperty, textWrappingStyleProperty, textWrappingTypeProperty, verticalRelativePercentProperty, horizontalRelativePercentProperty, heightRelativePercentProperty, widthRelativePercentProperty, zOrderPositionProperty, layoutInCellProperty, lockAnchorProperty, autoShapeTypeProperty, textFrameProperty, colorProperty, fillProperty, textVerticalAlignmentProperty, imageStringProperty, metaFileImageStringProperty, lengthProperty, isInlineImageProperty, isMetaFileProperty, topProperty, bottomProperty, rightProperty, leftProperty, getImageHeightProperty, getImageWidthProperty, hasFieldEndProperty, formFieldDataProperty, fieldTypeProperty, enabledProperty, helpTextProperty, statusTextProperty, textInputProperty, checkBoxProperty, dropDownListProperty, maxLengthProperty, defaultValueProperty, formatProperty, sizeTypeProperty, sizeProperty, checkedProperty, dropDownItemsProperty, selectedIndexProperty, commentIdProperty, commentCharacterTypeProperty, authorProperty, initialProperty, dateProperty, doneProperty, replyCommentsProperty, revisionTypeProperty, revisionIdProperty, itemIDProperty, xmlProperty, footnoteTypeProperty, symbolCodeProperty, symbolFontNameProperty, customMarkerProperty, inlinesProperty, contentControlPropertiesProperty, lockContentControlProperty, lockContentsProperty, tagProperty, titleProperty, hasPlaceHolderTextProperty, multiLineProperty, isTemporaryProperty, dateCalendarTypeProperty, dateStorageFormatProperty, dateDisplayLocaleProperty, dateDisplayFormatProperty, isCheckedProperty, uncheckedStateProperty, checkedStateProperty, contentControlListItemsProperty, xmlMappingProperty, fontProperty, valueProperty, displayTextProperty, isMappedProperty, isWordMlProperty, prefixMappingProperty, xPathProperty, storeItemIdProperty, customXmlPartProperty, idProperty, cellFormatProperty, rowFormatProperty, cellsProperty, rowsProperty, descriptionProperty, wrapTextAroundProperty, positioningProperty, tableFormatProperty, allowOverlapProperty, distanceTopProperty, distanceRightProperty, distanceLeftProperty, distanceBottomProperty, verticalOriginProperty, verticalPositionProperty, horizontalOriginProperty, horizontalAlignmentProperty, horizontalPositionProperty, blocksProperty, headerProperty, footerProperty, evenHeaderProperty, evenFooterProperty, firstPageHeaderProperty, firstPageFooterProperty, headersFootersProperty, sectionFormatProperty, listLevelPatternProperty, followCharacterProperty, startAtProperty, restartLevelProperty, levelNumberProperty, numberFormatProperty, abstractListIdProperty, levelsProperty, overrideListLevelProperty, levelOverridesProperty, separatorProperty, continuationSeparatorProperty, continuationNoticeProperty, bookmarkTypeProperty, propertiesProperty, tabJustificationProperty, positionProperty, deletePositionProperty, leaderProperty, tabLeaderProperty, editRangeIdProperty, columnFirstProperty, columnLastProperty, userProperty, groupProperty, editableRangeStartProperty, spaceProperty, fontSchemeProperty, fontSchemeNameProperty, majorFontSchemeProperty, minorFontSchemeProperty, fontSchemeListProperty, fontTypefaceProperty, typefaceProperty, panoseProperty, typeProperty, majorUnitProperty, maximumValueProperty, minimumValueProperty, hasMajorGridLinesProperty, hasMinorGridLinesProperty, majorTickMarkProperty, minorTickMarkProperty, tickLabelPositionProperty, rgbProperty, appearanceProperty, lineFormatTypeProperty, allowSpaceOfSameStyleInTableProperty, weightProperty, inlineFormatProperty, fontNameProperty, isCompressedProperty, columnIndexProperty, isAfterParagraphMarkProperty, isAfterRowMarkProperty, isAfterCellMarkProperty , isAfterTableMarkProperty, belowTextProperty, breakClearTypeProperty, characterSpacingProperty, scalingProperty, nsidProperty } from '../../index';
import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
/**
 * @private
 */
export class SfdtReader {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private documentHelper: DocumentHelper = undefined;
    private fieldSeparator: FieldElementBox;
    /**
     * @private
     */
    public commentStarts: Dictionary<string, CommentCharacterElementBox> = undefined;
    /**
     * @private
     */
    public commentEnds: Dictionary<string, CommentCharacterElementBox> = undefined;
    /**
     * @private
     */
    public commentsCollection: Dictionary<string, CommentElementBox> = undefined;
    /**
     * @private
     */
    public revisionCollection: Dictionary<string, Revision> = undefined;
    private isPageBreakInsideTable: boolean = false;
    private referedRevisions: any = [];
    private editableRanges: Dictionary<string, EditRangeStartElementBox>;
    private isParseHeader: boolean = false;
    public footnotes: Footnote = undefined;
    public endnotes: Footnote = undefined;
    public keywordIndex: number = undefined;
    public themes:Themes = undefined;
    /**
     * @private
     */
    public isCutPerformed: boolean = false;
    /**
     * @private
     */
    public isPaste: boolean = false;
    /**
     * @private
     */
    public isHtmlPaste: boolean = false;
    private get isPasting(): boolean {
        return this.viewer && this.viewer.owner.isPastingContent;
    }
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.editableRanges = new Dictionary<string, EditRangeStartElementBox>();
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    public convertJsonToDocument(json: string): BodyWidget[] {
        this.commentStarts = new Dictionary<string, CommentCharacterElementBox>();
        this.commentEnds = new Dictionary<string, CommentCharacterElementBox>();
        this.commentsCollection = new Dictionary<string, CommentElementBox>();
        this.revisionCollection = new Dictionary<string, Revision>();
        this.referedRevisions = [];
        this.keywordIndex = 0;
        this.footnotes = new Footnote();
        this.endnotes = new Footnote();
        const sections: BodyWidget[] = [];
        let jsonObject: any = HelperMethods.getSfdtDocument(json);

        if (!isNullOrUndefined(jsonObject.optimizeSfdt) && jsonObject.optimizeSfdt) {
            this.keywordIndex = 1;
        }
        if (isNullOrUndefined(jsonObject[characterFormatProperty[this.keywordIndex]])) {
            this.parseCharacterFormat(0, this.viewer.owner.characterFormat, this.documentHelper.characterFormat);
        } else {
            this.parseCharacterFormat(this.keywordIndex, jsonObject[characterFormatProperty[this.keywordIndex]], this.documentHelper.characterFormat);
        }
        if (isNullOrUndefined(jsonObject[paragraphFormatProperty[this.keywordIndex]])) {
            this.parseParagraphFormat(0, this.viewer.owner.paragraphFormat, this.documentHelper.paragraphFormat);
        } else {
            this.parseParagraphFormat(this.keywordIndex, jsonObject[paragraphFormatProperty[this.keywordIndex]], this.documentHelper.paragraphFormat);
        }
        if(!isNullOrUndefined(jsonObject[themeFontLanguagesProperty[this.keywordIndex]])){
            this.parseCharacterFormat(this.keywordIndex, jsonObject[themeFontLanguagesProperty[this.keywordIndex]], this.documentHelper.themeFontLanguage);
        }
        this.parseDocumentProtection(jsonObject);
        if (!isNullOrUndefined(jsonObject[defaultTabWidthProperty[this.keywordIndex]])) {
            this.documentHelper.defaultTabWidth = jsonObject[defaultTabWidthProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(jsonObject[trackChangesProperty[this.keywordIndex]])) {
            this.documentHelper.owner.enableTrackChanges = HelperMethods.parseBoolValue(jsonObject[trackChangesProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[doNotUseHTMLParagraphAutoSpacingProperty[this.keywordIndex]])) {
            this.documentHelper.dontUseHtmlParagraphAutoSpacing = HelperMethods.parseBoolValue(jsonObject[doNotUseHTMLParagraphAutoSpacingProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[allowSpaceOfSameStyleInTableProperty[this.keywordIndex]])) {
            this.documentHelper.allowSpaceOfSameStyleInTable = HelperMethods.parseBoolValue(jsonObject[allowSpaceOfSameStyleInTableProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[alignTablesRowByRowProperty[this.keywordIndex]])) {
            this.documentHelper.alignTablesRowByRow = HelperMethods.parseBoolValue(jsonObject[alignTablesRowByRowProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[backgroundProperty[this.keywordIndex]])) {
            this.documentHelper.backgroundColor = this.getColor(jsonObject[backgroundProperty[this.keywordIndex]][colorProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[compatibilityModeProperty[this.keywordIndex]])) {
            this.documentHelper.compatibilityMode = this.getCompatibilityMode(jsonObject[compatibilityModeProperty[this.keywordIndex]]);
            if (!isNullOrUndefined(this.documentHelper.owner.documentSettings)) {
                this.documentHelper.owner.documentSettings.compatibilityMode = this.getCompatibilityMode(jsonObject[compatibilityModeProperty[this.keywordIndex]]);
            }
        }
        if (!isNullOrUndefined(jsonObject[abstractListsProperty[this.keywordIndex]])) {
            this.parseAbstractList(jsonObject, this.documentHelper.abstractLists);
        }
        if (!isNullOrUndefined(jsonObject[listsProperty[this.keywordIndex]])) {
            this.parseList(jsonObject, this.documentHelper.lists);
        }
        if (!isNullOrUndefined(jsonObject[stylesProperty[this.keywordIndex]])) {
            this.parseStyles(jsonObject, this.documentHelper.styles);
        }
        if (!isNullOrUndefined(jsonObject[commentsProperty[this.keywordIndex]])) {
            this.parseComments(jsonObject, this.documentHelper.comments);
        }
        if (!isNullOrUndefined(jsonObject[revisionsProperty[this.keywordIndex]])) {
            this.parseRevisions(jsonObject, this.viewer.owner.revisionsInternal.changes);
        }
        if (!isNullOrUndefined(jsonObject[imagesProperty[this.keywordIndex]])) {
            this.parseImages(jsonObject[imagesProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[sectionsProperty[this.keywordIndex]])) {
            this.parseSections(jsonObject[sectionsProperty[this.keywordIndex]], sections);
        }
        if (!isNullOrUndefined(jsonObject[customXmlProperty[this.keywordIndex]])) {
            this.parseCustomXml(jsonObject);
        }
        if (!isNullOrUndefined(jsonObject[formFieldShadingProperty[this.keywordIndex]])) {
            this.documentHelper.owner.documentEditorSettings.formFieldSettings.applyShading = HelperMethods.parseBoolValue(jsonObject[formFieldShadingProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(jsonObject[footnotesProperty[this.keywordIndex]])) {
            this.parseFootnotes(jsonObject[footnotesProperty[this.keywordIndex]], this.documentHelper.footnotes);
        }
        if (!isNullOrUndefined(jsonObject[endnotesProperty[this.keywordIndex]])) {
            this.parseEndtnotes(jsonObject[endnotesProperty[this.keywordIndex]], this.documentHelper.endnotes);
        }
        if (!isNullOrUndefined(jsonObject[themesProperty[this.keywordIndex]])) {
            this.parseThemes(jsonObject[themesProperty[this.keywordIndex]],this.documentHelper.themes);
        }
        this.generalizeRevisions();
        this.removeUnmappedBookmark();
        return sections;
    }
    private removeUnmappedBookmark(): void {
        let bookmarkKeys: string[] = this.documentHelper.bookmarks.keys;
        let endBookmark: string[] = this.documentHelper.endBookmarksUpdated;
        for (let i: number = 0; i < bookmarkKeys.length; i++) {
            if (endBookmark.indexOf(bookmarkKeys[i]) === -1) {
                let bookmark: BookmarkElementBox = this.documentHelper.bookmarks.get(bookmarkKeys[i]);
                if (bookmark) {
                    bookmark.line.children.splice(bookmark.line.children.indexOf(bookmark), 1);
                }
                this.documentHelper.bookmarks.remove(bookmarkKeys[i]);
            }
        }
        this.documentHelper.endBookmarksUpdated = [];
    }
    
    private generalizeRevisions(): void {
        let tempRevisionCollection: Dictionary<string, Revision> = new Dictionary<string, Revision>();
        let tempRevisons: Revision[] = [];
        this.referedRevisions.forEach((element: any) => {
            let revision = this.documentHelper.revisionsInternal.get(element);
            if (tempRevisons.indexOf(revision) === -1) {
                tempRevisons.push(revision);
                tempRevisionCollection.add(element, revision);
            }
        });
        this.viewer.owner.revisionsInternal.changes = tempRevisons;
        this.documentHelper.revisionsInternal = tempRevisionCollection;
    }
    private parseFootnotes(data: any, footnote: Footnote): void {
        if (!isNullOrUndefined(data[separatorProperty[this.keywordIndex]])) {
            this.parseBody(data[separatorProperty[this.keywordIndex]], footnote.separator);
        }
        if (!isNullOrUndefined(data[continuationNoticeProperty[this.keywordIndex]])) {
            this.parseBody(data[continuationNoticeProperty[this.keywordIndex]], footnote.continuationNotice);
        }
        if (!isNullOrUndefined(data[continuationSeparatorProperty[this.keywordIndex]])) {
            this.parseBody(data[continuationSeparatorProperty[this.keywordIndex]], footnote.continuationSeparator);
        }
    }
    /**
     * @private
     */
    public parseImages(data: any): void {
        for (let img in data) {
            if (Array.isArray(data[`${img}`])) {
                this.documentHelper.images.add(parseInt(img), data[`${img}`]);
            } else {
                let images: string[] = [];
                images.push(data[`${img}`]);
                this.documentHelper.images.add(parseInt(img), images);
            }
        }
    }
    private parseEndtnotes(data: any, endnote: Footnote): void {
        if (!isNullOrUndefined(data[separatorProperty[this.keywordIndex]])) {
            this.parseBody(data[separatorProperty[this.keywordIndex]], endnote.separator);
        }
        if (!isNullOrUndefined(data[continuationNoticeProperty[this.keywordIndex]])) {
            this.parseBody(data[continuationNoticeProperty[this.keywordIndex]], endnote.continuationNotice);
        }
        if (!isNullOrUndefined(data[continuationSeparatorProperty[this.keywordIndex]])) {
            this.parseBody(data[continuationSeparatorProperty[this.keywordIndex]], endnote.continuationSeparator);
        }
    }
    private parseCustomXml(data: any): void {
        for (let i: number = 0; i < data[customXmlProperty[this.keywordIndex]].length; i++) {
            const xmlData: any = data[customXmlProperty[this.keywordIndex]][i];
            if (!this.revisionCollection.containsKey(xmlData[itemIDProperty[this.keywordIndex]])) {
                this.documentHelper.customXmlData.add(xmlData[itemIDProperty[this.keywordIndex]], xmlData[xmlProperty[this.keywordIndex]]);
            }
        }
    }
    private parseDocumentProtection(data: any): void {
        if (!isNullOrUndefined(data[formattingProperty[this.keywordIndex]])) {
            this.documentHelper.restrictFormatting = HelperMethods.parseBoolValue(data[formattingProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(data[enforcementProperty[this.keywordIndex]])) {
            this.documentHelper.isDocumentProtected = HelperMethods.parseBoolValue(data[enforcementProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(data[protectionTypeProperty[this.keywordIndex]])) {
            this.documentHelper.protectionType = this.getProtectionType(data[protectionTypeProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(data[hashValueProperty[this.keywordIndex]])) {
            this.documentHelper.hashValue = data[hashValueProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[saltValueProperty[this.keywordIndex]])) {
            this.documentHelper.saltValue = data[saltValueProperty[this.keywordIndex]];
        }
    }
    /**
     * @private
     */
    public parseStyles(data: any, styles: WStyles): void {
        for (let i: number = 0; i < data[stylesProperty[this.keywordIndex]].length; i++) {
            var editor = this.documentHelper.owner.editor;
            if ((!isNullOrUndefined(editor) && editor.isRemoteAction) || isNullOrUndefined(this.documentHelper.styles.findByName(data[stylesProperty[this.keywordIndex]][i][nameProperty[this.keywordIndex]]))) {
                this.parseStyle(data, data[stylesProperty[this.keywordIndex]][i], styles);
            }
        }
    }
    public parseRevisions(data: any, revisions: Revision[]): void {
        for (let i: number = 0; i < data[revisionsProperty[this.keywordIndex]].length; i++) {
            const revisionData: any = data[revisionsProperty[this.keywordIndex]][i];
            if (!isNullOrUndefined(revisionData[revisionIdProperty[this.keywordIndex]]) && !isNullOrUndefined(revisionData[revisionTypeProperty[this.keywordIndex]])) {
                const revision: Revision = this.parseRevision(revisionData);
                let revisionCheck: boolean = true;
                if (!this.documentHelper.owner.sfdtExportModule.copyWithTrackChange && this.isPaste) {
                    if (this.getRevisionType(revisionData[revisionTypeProperty[this.keywordIndex]]) === 'Insertion' && this.isPaste && this.documentHelper.owner.enableTrackChanges) {
                        var editor = this.documentHelper.owner.editor;
                        if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                            this.documentHelper.owner.editor.revisionData.push(this.documentHelper.owner.editor.getMarkerData(undefined, undefined, revision));
                        }
                        continue;
                    } else {
                        if (!this.revisionCollection.containsKey(revisionData[revisionIdProperty[this.keywordIndex]])) {
                            this.revisionCollection.add(revisionData[revisionIdProperty[this.keywordIndex]], revision);
                        }
                    }
                } else {
                    this.revisionCollection.add(revisionData[revisionIdProperty[this.keywordIndex]], revision);
                }
                for (let j: number = 0; j < revisions.length; j++) {
                    if (revisions[j].revisionID === revision.revisionID) {
                        revisionCheck = false;
                    }
                }
                if (revisionCheck) {
                    revisions.push(revision);
                }
            }
        }
        this.documentHelper.revisionsInternal = this.revisionCollection;
        if (this.documentHelper.owner.sfdtExportModule) {
            this.documentHelper.owner.sfdtExportModule.copyWithTrackChange = false;
        }
    }
    public parseRevision(data: any): Revision {
        if (!isNullOrUndefined(data)) {
            const revision: Revision = new Revision(this.viewer.owner, data[authorProperty[this.keywordIndex]], data[dateProperty[this.keywordIndex]]);
            revision.revisionID = data[revisionIdProperty[this.keywordIndex]];
            revision.revisionType = this.getRevisionType(data[revisionTypeProperty[this.keywordIndex]]);
            return revision;
        } else {
            return undefined;
        }
    }
    private checkAndApplyRevision(keyIndex: number, inline: any, item: any): void {
        if (!isNullOrUndefined(inline[revisionIdsProperty[keyIndex]]) && inline[revisionIdsProperty[keyIndex]].length > 0) {
            for (let i: number = 0; i < inline[revisionIdsProperty[keyIndex]].length; i++) {
                const id: string = inline[revisionIdsProperty[keyIndex]][i];
                if (this.revisionCollection.containsKey(id)) {
                    this.referedRevisions.push(id);
                    const revision: Revision = this.revisionCollection.get(id);
                    if (!(item instanceof WParagraphFormat)) {
                        revision.range.push(item);
                    }
                    item.revisions.push(revision);
                }
            }
        }
    }
    public parseComments(data: any, comments: CommentElementBox[]): void {
        let count: number = 0;
        for (let i: number = 0; i < data[commentsProperty[this.keywordIndex]].length; i++) {
            const commentData: any = data[commentsProperty[this.keywordIndex]][i];
            let commentElement: CommentElementBox = undefined;
            commentElement = this.parseComment(commentData, commentElement);
            while (count < commentData[replyCommentsProperty[this.keywordIndex]].length) {
                let replyComment: CommentElementBox = undefined;
                replyComment = this.parseComment(commentData[replyCommentsProperty[this.keywordIndex]][count], replyComment);
                replyComment.ownerComment = commentElement;
                replyComment.isReply = true;
                commentElement.replyComments.push(replyComment);
                this.commentsCollection.add(replyComment.commentId, replyComment);
                count++;
            }
            this.commentsCollection.add(commentElement.commentId, commentElement);
            comments.push(commentElement);
            count = 0;
        }
    }
    private parseComment(commentData: any, commentElement: CommentElementBox): CommentElementBox {
        commentElement = new CommentElementBox(commentData[dateProperty[this.keywordIndex]]);
        commentElement.author = commentData[authorProperty[this.keywordIndex]];
        commentElement.initial = commentData[initialProperty[this.keywordIndex]];
        commentElement.commentId = commentData[commentIdProperty[this.keywordIndex]];
        commentElement.isResolved = HelperMethods.parseBoolValue(commentData[doneProperty[this.keywordIndex]]);
        commentElement.text = this.parseCommentText(commentData[blocksProperty[this.keywordIndex]]);
        return commentElement;
    }
    private parseCommentText(blocks: any): string {
        let text: string = '';
        for (let i: number = 0; i < blocks.length; i++) {
            if (i !== 0) {
                text += '\n';
            }
            for (let j: number = 0; j < blocks[i][inlinesProperty[this.keywordIndex]].length; j++) {
                text = text + blocks[i][inlinesProperty[this.keywordIndex]][j][textProperty[this.keywordIndex]];
            }
        }
        return text;
    }
    public parseStyle(data: any, style: any, styles: WStyles, resetKeyIndex?: boolean): void {
        let wStyle: any;
        let keyIndex: number = 0;
        var editor = this.documentHelper.owner.editor;
        if (!isNullOrUndefined(resetKeyIndex) && resetKeyIndex) {
            keyIndex = this.keywordIndex;
            this.keywordIndex = 0;
        }
        if (!isNullOrUndefined(style[typeProperty[this.keywordIndex]])) {
            if (this.getStyleType(style[typeProperty[this.keywordIndex]]) === 'Paragraph') {
                wStyle = new WParagraphStyle();
                wStyle.type = 'Paragraph';
            }
            if (this.getStyleType(style[typeProperty[this.keywordIndex]]) === 'Character') {
                wStyle = new WCharacterStyle();
                wStyle.type = 'Character';
            }
            if (!isNullOrUndefined(style[nameProperty[this.keywordIndex]])) {
                wStyle.name = style[nameProperty[this.keywordIndex]];
            }
            styles.push(wStyle);
            if (!isNullOrUndefined(style[basedOnProperty[this.keywordIndex]])) {
                let basedOn: Object;
                if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                    basedOn = this.documentHelper.styles.findByName(style[basedOnProperty[this.keywordIndex]]);
                } else {
                    basedOn = styles.findByName(style[basedOnProperty[this.keywordIndex]]);
                }
                if (!isNullOrUndefined(basedOn)) {
                    if ((basedOn as WStyle).type === wStyle.type && (basedOn as WStyle).name !== wStyle.name) {
                        wStyle.basedOn = basedOn;
                    }
                } else {
                    const basedStyle: any = this.getStyle(style[basedOnProperty[this.keywordIndex]], data);
                    let styleString: any;
                    if (!isNullOrUndefined(basedStyle) && this.getStyleType(basedStyle[typeProperty[this.keywordIndex]]) === wStyle.type) {
                        styleString = basedStyle;
                    } else {
                        if (wStyle.type === 'Paragraph') {
                            styleString = JSON.parse('{"type":"Paragraph","name":"Normal","next":"Normal"}');
                        } else {
                            styleString = JSON.parse('{"type": "Character","name": "Default Paragraph Font"}');
                        }
                    }
                    this.parseStyle(data, styleString, styles);
                    if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                        wStyle.basedOn = this.documentHelper.styles.findByName(styleString[nameProperty[this.keywordIndex]]);
                    } else {
                        wStyle.basedOn = styles.findByName(styleString[nameProperty[this.keywordIndex]]);
                    }
                }
            }
            if (!isNullOrUndefined(style[linkProperty[this.keywordIndex]])) {
                let link: Object = styles.findByName(style[linkProperty[this.keywordIndex]]);
                const linkStyle: any = this.getStyle(style[linkProperty[this.keywordIndex]], data);
                if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                    link = this.documentHelper.styles.findByName(style[linkProperty[this.keywordIndex]]);
                }
                let styleString: any;
                if (isNullOrUndefined(link)) {
                    if (isNullOrUndefined(linkStyle)) {
                        //Construct the CharacterStyle string
                        const charaStyle: any = {};
                        charaStyle.characterFormat = style[characterFormatProperty[this.keywordIndex]];
                        charaStyle.name = style[nameProperty[this.keywordIndex]] + ' Char';
                        charaStyle.type = 'Character';
                        //TODO: Implement basedOn
                        charaStyle.basedOn = style[basedOnProperty[this.keywordIndex]] === 'Normal' ? 'Default Paragraph Font' : (style[basedOnProperty[this.keywordIndex]] + ' Char');
                        styleString = charaStyle;
                    } else {
                        styleString = linkStyle;
                    }
                    this.parseStyle(data, styleString, styles);
                    if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                        wStyle.link = isNullOrUndefined(this.documentHelper.styles.findByName(styleString.name)) ? style[linkProperty[this.keywordIndex]] : this.documentHelper.styles.findByName(styleString.name);
                    } else {
                        wStyle.link = isNullOrUndefined(styles.findByName(styleString.name)) ? style[linkProperty[this.keywordIndex]] : styles.findByName(styleString.name);
                    }
                } else {
                    wStyle.link = link;
                }

            }
            if (!isNullOrUndefined(style[characterFormatProperty[this.keywordIndex]])) {
                this.parseCharacterFormat(this.keywordIndex, style[characterFormatProperty[this.keywordIndex]], wStyle.characterFormat);
            }
            if (!isNullOrUndefined(style[paragraphFormatProperty[this.keywordIndex]])) {
                this.parseParagraphFormat(this.keywordIndex, style[paragraphFormatProperty[this.keywordIndex]], wStyle.paragraphFormat);
            }
            if (!isNullOrUndefined(style[nextProperty[this.keywordIndex]])) {
                if (style[nextProperty[this.keywordIndex]] === style[nameProperty[this.keywordIndex]]) {
                    wStyle.next = wStyle;
                } else {
                    let next: Object;
                    if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                        next = this.documentHelper.styles.findByName(style[nextProperty[this.keywordIndex]]);
                    } else {
                        next = styles.findByName(style[nextProperty[this.keywordIndex]]);
                    }
                    if (!isNullOrUndefined(next) && (next as WStyle).type === wStyle.type) {
                        wStyle.next = next;
                    } else {
                        const nextStyleString: any = this.getStyle(style[nextProperty[this.keywordIndex]], data);
                        if (!isNullOrUndefined(nextStyleString)) {
                            this.parseStyle(data, nextStyleString, styles);
                            if (!isNullOrUndefined(editor) && editor.isRemoteAction) {
                                wStyle.next = this.documentHelper.styles.findByName(nextStyleString.name);
                            } else {
                                wStyle.next = styles.findByName(nextStyleString.name);
                            }
                        } else {
                            wStyle.next = wStyle;
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(resetKeyIndex) && resetKeyIndex) {
            this.keywordIndex = keyIndex;
        }
        if(!isNullOrUndefined(wStyle)) {
            this.documentHelper.addToStylesMap(wStyle);
        }
    }
    private getStyle(name: string, data: any): any {
        for (let i: number = 0; i < data[stylesProperty[this.keywordIndex]].length; i++) {
            if (data[stylesProperty[this.keywordIndex]][i][nameProperty[this.keywordIndex]] === name) {
                return data[stylesProperty[this.keywordIndex]][i];
            }
        }
        return undefined;
    }
    public parseAbstractList(data: any, abstractLists: WAbstractList[]): void {
        for (let i: number = 0; i < data[abstractListsProperty[this.keywordIndex]].length; i++) {
            const abstractList: WAbstractList = new WAbstractList();
            const abstract: any = data[abstractListsProperty[this.keywordIndex]][i];
            if (!isNullOrUndefined(abstract)) {
                if (!isNullOrUndefined(abstract[abstractListIdProperty[this.keywordIndex]])) {
                    abstractList.abstractListId = abstract[abstractListIdProperty[this.keywordIndex]];
                }
                if (!isNullOrUndefined(abstract[nsidProperty])) {
                    abstractList.nsid = abstract[nsidProperty];
                } else {
                    // Backward compatibility
                    abstractList.nsid = HelperMethods.generateUniqueId(undefined, abstractLists);
                }
                if (!isNullOrUndefined(abstract[levelsProperty[this.keywordIndex]])) {
                    for (let j: number = 0; j < abstract[levelsProperty[this.keywordIndex]].length; j++) {
                        const level: any = abstract[levelsProperty[this.keywordIndex]][j];
                        if (!isNullOrUndefined(level)) {
                            const listLevel: WListLevel = this.parseListLevel(level, abstractList);
                            abstractList.levels.push(listLevel);
                        }
                    }
                }
            }
            abstractLists.push(abstractList);
        }
    }
    private parseListLevel(data: any, owner: any): WListLevel {
        const listLevel: WListLevel = new WListLevel(owner);
        if (this.getListLevelPattern(data[listLevelPatternProperty[this.keywordIndex]]) === 'Bullet') {
            listLevel.listLevelPattern = 'Bullet';
            listLevel.numberFormat = !isNullOrUndefined(data[numberFormatProperty[this.keywordIndex]]) ? data[numberFormatProperty[this.keywordIndex]] : '';
        } else {
            listLevel.listLevelPattern = this.getListLevelPattern(data[listLevelPatternProperty[this.keywordIndex]]);
            listLevel.startAt = data[startAtProperty[this.keywordIndex]];
            listLevel.numberFormat = !isNullOrUndefined(data[numberFormatProperty[this.keywordIndex]]) ? data[numberFormatProperty[this.keywordIndex]] : '';
            if (data[restartLevelProperty[this.keywordIndex]] >= 0) {
                listLevel.restartLevel = data[restartLevelProperty[this.keywordIndex]];
            } else {
                listLevel.restartLevel = data[levelNumberProperty[this.keywordIndex]];
            }
        }
        listLevel.followCharacter = this.getFollowCharacterType(data[followCharacterProperty[this.keywordIndex]]);
        this.parseCharacterFormat(this.keywordIndex, data[characterFormatProperty[this.keywordIndex]], listLevel.characterFormat);
        this.parseParagraphFormat(this.keywordIndex, data[paragraphFormatProperty[this.keywordIndex]], listLevel.paragraphFormat);
        return listLevel;
    }
    public parseList(data: any, listCollection: WList[]): void {
        for (let i: number = 0; i < data[listsProperty[this.keywordIndex]].length; i++) {
            const list: WList = new WList();
            const lists: any = data[listsProperty[this.keywordIndex]][i];
            if (!isNullOrUndefined(lists[abstractListIdProperty[this.keywordIndex]])) {
                list.abstractListId = lists[abstractListIdProperty[this.keywordIndex]];
                list.abstractList = this.documentHelper.getAbstractListById(lists[abstractListIdProperty[this.keywordIndex]]);
            }
            listCollection.push(list);
            if (!isNullOrUndefined(lists[listIdProperty[this.keywordIndex]])) {
                list.listId = lists[listIdProperty[this.keywordIndex]];
            }
            if (!isNullOrUndefined(lists[nsidProperty])) {
                list.nsid = lists[nsidProperty];
            } else {
                list.nsid = list.abstractList.nsid;
            }
            if (lists.hasOwnProperty(levelOverridesProperty[this.keywordIndex])) {
                this.parseLevelOverride(lists[levelOverridesProperty[this.keywordIndex]], list);
            }
        }
    }
    private parseLevelOverride(data: any, list: WList): void {
        if (isNullOrUndefined(data)) {
            return;
        }
        for (let i: number = 0; i < data.length; i++) {
            const levelOverrides: WLevelOverride = new WLevelOverride();
            const levelOverride: any = data[i];
            levelOverrides.startAt = levelOverride[startAtProperty[this.keywordIndex]];
            levelOverrides.levelNumber = levelOverride[levelNumberProperty[this.keywordIndex]];
            if (!isNullOrUndefined(levelOverride[overrideListLevelProperty[this.keywordIndex]])) {
                levelOverrides.overrideListLevel = this.parseListLevel(levelOverride[overrideListLevelProperty[this.keywordIndex]], levelOverrides);
            }
            list.levelOverrides.push(levelOverrides);
        }
    }
    private parseSections(data: any, sections: BodyWidget[]): void {
        for (let i: number = 0; i < data.length; i++) {
            const section: BodyWidget = new BodyWidget();
            section.sectionFormat = new WSectionFormat(section);
            section.index = i;
            const item: any = data[i];
            if (!isNullOrUndefined(item[sectionFormatProperty[this.keywordIndex]])) {
                this.parseSectionFormat(this.keywordIndex, item[sectionFormatProperty[this.keywordIndex]], section.sectionFormat);
            }
            if (isNullOrUndefined(item[headersFootersProperty[this.keywordIndex]])) {
                item[headersFootersProperty[this.keywordIndex]] = {};
            }
            this.documentHelper.headersFooters.push(this.parseHeaderFooter(item[headersFootersProperty[this.keywordIndex]], this.documentHelper.headersFooters));
            this.isParseHeader = false;
            this.parseTextBody(item[blocksProperty[this.keywordIndex]], section, i + 1 < data.length);
            for (let i: number = 0; i < section.childWidgets.length; i++) {
                (section.childWidgets[i] as BlockWidget).containerWidget = section;
            }
            sections.push(section);
        }
    }
    public parseHeaderFooter(data: any, headersFooters: any): HeaderFooters {
        this.isParseHeader = true;
        const hfs: HeaderFooters = {};
        if (!isNullOrUndefined(data[headerProperty[this.keywordIndex]])) {
            const oddHeader: HeaderFooterWidget = new HeaderFooterWidget('OddHeader');
            hfs[0] = oddHeader;
            this.parseTextBody(data[headerProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], oddHeader);
        }
        if (!isNullOrUndefined(data[footerProperty[this.keywordIndex]])) {
            const oddFooter: HeaderFooterWidget = new HeaderFooterWidget('OddFooter');
            hfs[1] = oddFooter;
            this.parseTextBody(data[footerProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], oddFooter);
        }
        if (!isNullOrUndefined(data[evenHeaderProperty[this.keywordIndex]])) {
            const evenHeader: HeaderFooterWidget = new HeaderFooterWidget('EvenHeader');
            hfs[2] = evenHeader;
            this.parseTextBody(data[evenHeaderProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], evenHeader);
        }
        if (!isNullOrUndefined(data[evenFooterProperty[this.keywordIndex]])) {
            const evenFooter: HeaderFooterWidget = new HeaderFooterWidget('EvenFooter');
            hfs[3] = evenFooter;
            this.parseTextBody(data[evenFooterProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], evenFooter);
        }
        if (!isNullOrUndefined(data[firstPageHeaderProperty[this.keywordIndex]])) {
            const firstPageHeader: HeaderFooterWidget = new HeaderFooterWidget('FirstPageHeader');
            hfs[4] = firstPageHeader;
            this.parseTextBody(data[firstPageHeaderProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], firstPageHeader);
        }
        if (!isNullOrUndefined(data[firstPageFooterProperty[this.keywordIndex]])) {
            const firstPageFooter: HeaderFooterWidget = new HeaderFooterWidget('FirstPageFooter');
            hfs[5] = firstPageFooter;
            this.parseTextBody(data[firstPageFooterProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], firstPageFooter);
        }
        return hfs;
    }
    private parseTextBody(data: any, section: Widget, isSectionBreak?: boolean): void {
        this.parseBody(data, section.childWidgets as BlockWidget[], section, isSectionBreak);
    }
    public addCustomStyles(data: any): void {
        if (!isNullOrUndefined(data[stylesProperty[this.keywordIndex]])) {
            for (let i: number = 0; i < data[stylesProperty[this.keywordIndex]].length; i++) {
                const style: any = this.documentHelper.styles.findByName(data[stylesProperty[this.keywordIndex]][i][nameProperty[this.keywordIndex]]);
                if (style === undefined) {
                    this.parseStyle(data, data[stylesProperty[this.keywordIndex]][i], this.documentHelper.styles);
                }
            }
        }
    }
    public parseBody(data: any, blocks: BlockWidget[], container?: Widget, isSectionBreak?: boolean, contentControlProperties?: ContentControlProperties, styles?: any): void {
        if (!isNullOrUndefined(data)) {
            for (let i: number = 0; i < data.length; i++) {
                const block: any = data[i];
                let hasValidElmts: boolean = false;
                if (block.hasOwnProperty(inlinesProperty[this.keywordIndex])) {
                    const writeInlineFormat: boolean = false;
                    //writeInlineFormat = this.isPasting && i === data.length - 1;
                    const paragraph: ParagraphWidget = new ParagraphWidget();
                    paragraph.characterFormat = new WCharacterFormat(paragraph);
                    paragraph.paragraphFormat = new WParagraphFormat(paragraph);
                    if (block[inlinesProperty[this.keywordIndex]].length > 0) {
                        hasValidElmts = this.parseParagraph(block[inlinesProperty[this.keywordIndex]], paragraph, writeInlineFormat);
                    }
                    if (!(isSectionBreak && block === data[data.length - 1] && block[inlinesProperty[this.keywordIndex]].length === 0 && !hasValidElmts)) {
                        this.parseCharacterFormat(this.keywordIndex, block[characterFormatProperty[this.keywordIndex]], paragraph.characterFormat);
                        this.parseParagraphFormat(this.keywordIndex, block[paragraphFormatProperty[this.keywordIndex]], paragraph.paragraphFormat);
                        let styleObj: Object;
                        let styleName: string = 'Normal';
                        if (!isNullOrUndefined(block[paragraphFormatProperty[this.keywordIndex]]) && !isNullOrUndefined(block[paragraphFormatProperty[this.keywordIndex]][styleNameProperty[this.keywordIndex]])) {
                            //Default value to link style object.
                            styleName = block[paragraphFormatProperty[this.keywordIndex]][styleNameProperty[this.keywordIndex]];
                        }
                        styleObj = this.documentHelper.styles.findByName(styleName, 'Paragraph');
                        if (!isNullOrUndefined(styleObj)) {
                            if (this.isPaste && styles) {
                                for (let j = 0; j < styles.length; j++) {
                                    if (styles[j][nameProperty[this.keywordIndex]] === styleName) {
                                        var fontColor = styles[j][characterFormatProperty[this.keywordIndex]];
                                        if (fontColor[fontColorProperty[this.keywordIndex]] !== (styleObj as WCharacterStyle).characterFormat.fontColor) {
                                            const charFormat: WCharacterFormat = new WCharacterFormat();
                                            this.parseCharacterFormat(this.keywordIndex, styles[j][characterFormatProperty[this.keywordIndex]], charFormat);
                                            (styleObj as WCharacterStyle).characterFormat.copyFormat(charFormat);
                                            break;
                                        }
                                    }
                                }
                            }
                            paragraph.paragraphFormat.applyStyle(styleObj as WStyle);
                        }
                        blocks.push(paragraph);
                    } else if (isSectionBreak && data.length === 1) {
                        blocks.push(paragraph);
                    }
                    paragraph.index = blocks.length - 1;
                    paragraph.containerWidget = container;
                } else if (block.hasOwnProperty(rowsProperty[this.keywordIndex])) {
                    this.parseTable(block, blocks, blocks.length, container);
                } else if (block.hasOwnProperty(contentControlPropertiesProperty[this.keywordIndex])) {
                    const blockStartContentControl: ContentControl = new ContentControl('Block');
                    const blockEndContentControl: ContentControl = new ContentControl('Block');
                    this.parseContentControlProperties(block[contentControlPropertiesProperty[this.keywordIndex]], blockStartContentControl.contentControlProperties);
                    blockEndContentControl.contentControlProperties = blockStartContentControl.contentControlProperties;
                    blockStartContentControl.type = 0;
                    blockEndContentControl.type = 1;

                    this.parseBody(block[blocksProperty[this.keywordIndex]], blocks, container, isSectionBreak, blockStartContentControl.contentControlProperties);
                    for (let j: number = 0; j < 2; j++) {
                        const para: IWidget = (blocks.length < block[blocksProperty[this.keywordIndex]].length) ? blocks[0] : j === 0 ? blocks[blocks.length - block[blocksProperty[this.keywordIndex]].length] : blocks[blocks.length - 1];
                        let blockWidget: BlockWidget;
                        if (para instanceof ParagraphWidget) {
                            blockWidget = para as BlockWidget;
                        } else if (para instanceof TableWidget) {
                            if (j === 0) {
                                blockWidget = ((para.firstChild as TableRowWidget).firstChild as TableCellWidget).firstChild as BlockWidget;
                            } else {
                                const cell: TableCellWidget = (para.lastChild as TableRowWidget).lastChild as TableCellWidget;
                                blockWidget = cell.lastChild as BlockWidget;
                            }
                        }
                        if (!isNullOrUndefined(blockWidget) && blockWidget.childWidgets.length === 0) {
                            const lineWidget: LineWidget = new LineWidget(blockWidget as ParagraphWidget);
                            blockWidget.childWidgets.push(lineWidget);
                        }
                        if (j === 0) {
                            (blockWidget.firstChild as LineWidget).children.splice(0, 0, blockStartContentControl);
                            blockStartContentControl.line = blockWidget.firstChild as LineWidget;
                        } else {
                            (blockWidget.lastChild as LineWidget).children.push(blockEndContentControl);
                            blockEndContentControl.line = blockWidget.lastChild as LineWidget;
                        }
                    }
                }
                if (!isNullOrUndefined(contentControlProperties)) {
                    (blocks[blocks.length - 1] as BlockWidget).contentControlProperties = contentControlProperties;
                }
            }
        }
    }
    private parseTable(block: any, blocks: BlockWidget[], index: number, section: Widget): void {
        const table: TableWidget = new TableWidget();
        table.index = index;
        if (!isNullOrUndefined(block[tableFormatProperty[this.keywordIndex]])) {
            this.parseTableFormat(block[tableFormatProperty[this.keywordIndex]], table.tableFormat, this.keywordIndex);
        }
        table.tableFormat.title = block[titleProperty[this.keywordIndex]];
        table.tableFormat.description = block[descriptionProperty[this.keywordIndex]];
        this.parseTablePositioning(block, table);
        for (let i: number = 0; i < block[rowsProperty[this.keywordIndex]].length; i++) {
            const row: TableRowWidget = new TableRowWidget();
            row.rowFormat = new WRowFormat(row);
            const tableRow: any = block[rowsProperty[this.keywordIndex]][i];
            if (!isNullOrUndefined(tableRow[contentControlPropertiesProperty[this.keywordIndex]])) {
                row.contentControlProperties = new ContentControlProperties('Row');
                this.parseContentControlProperties(tableRow[contentControlPropertiesProperty[this.keywordIndex]], row.contentControlProperties);
            }
            if (tableRow.hasOwnProperty(rowFormatProperty[this.keywordIndex])) {
                this.parseRowFormat(tableRow[rowFormatProperty[this.keywordIndex]], row.rowFormat, this.keywordIndex);
                this.parseRowGridValues(tableRow, row.rowFormat);
                this.parseRowGridValues(tableRow[rowFormatProperty[this.keywordIndex]], row.rowFormat);
                row.index = i;
                for (let j: number = 0; j < tableRow[cellsProperty[this.keywordIndex]].length; j++) {
                    const cell: TableCellWidget = new TableCellWidget();
                    cell.cellFormat = new WCellFormat(cell);
                    const tableCell: any = tableRow[cellsProperty[this.keywordIndex]][j];
                    if (!isNullOrUndefined(tableCell[contentControlPropertiesProperty[this.keywordIndex]])) {
                        cell.contentControlProperties = new ContentControlProperties('Cell');
                        this.parseContentControlProperties(tableCell[contentControlPropertiesProperty[this.keywordIndex]], cell.contentControlProperties);
                    }
                    row.childWidgets.push(cell);
                    cell.containerWidget = row;
                    cell.index = j;
                    cell.rowIndex = i;
                    cell.columnIndex = j;
                    if (tableCell.hasOwnProperty(cellFormatProperty[this.keywordIndex])) {
                        this.parseCellFormat(tableCell[cellFormatProperty[this.keywordIndex]], cell.cellFormat, this.keywordIndex);
                    }
                    let item: any = tableCell[blocksProperty[this.keywordIndex]];
                    for (let k: number = 0; k < item.length; k++) {
                        if (item[k].hasOwnProperty([rowsProperty[this.keywordIndex]])) {
                            table.isContainInsideTable = true;

                        }
                    }
                    this.isPageBreakInsideTable = true;
                    this.parseTextBody(tableCell[blocksProperty[this.keywordIndex]], cell, false);
                    if (!isNullOrUndefined(cell.contentControlProperties)) {
                        const cellStartContentControl: ContentControl = new ContentControl('Cell');
                        const cellEndContentControl: ContentControl = new ContentControl('Cell');
                        cellStartContentControl.contentControlProperties = cell.contentControlProperties;
                        cellEndContentControl.contentControlProperties = cell.contentControlProperties;
                        cellStartContentControl.type = 0;
                        cellEndContentControl.type = 1;

                        if ((cell.firstChild as ParagraphWidget).childWidgets.length === 0) {
                            const lineWidget: LineWidget = new LineWidget(cell.firstChild as ParagraphWidget);
                            (cell.firstChild as ParagraphWidget).childWidgets.push(lineWidget);
                        }
                        cellStartContentControl.line = (cell.firstChild as ParagraphWidget).firstChild as LineWidget;
                        ((cell.firstChild as ParagraphWidget).firstChild as LineWidget).children.splice(0, 0, cellStartContentControl);
                        if ((cell.lastChild as ParagraphWidget).childWidgets.length === 0) {
                            const lineWidget: LineWidget = new LineWidget(cell.lastChild as ParagraphWidget);
                            (cell.lastChild as ParagraphWidget).childWidgets.push(lineWidget);
                        }
                        cellEndContentControl.line = (cell.lastChild as ParagraphWidget).lastChild as LineWidget;
                        ((cell.lastChild as ParagraphWidget).lastChild as LineWidget).children.push(cellEndContentControl);
                    }
                    if (!isNullOrUndefined(row.contentControlProperties)) {
                        if (row.firstChild === cell) {
                            const rowStartContentControl: ContentControl = new ContentControl('Row');
                            rowStartContentControl.contentControlProperties = row.contentControlProperties;
                            rowStartContentControl.type = 0;
                            if ((cell.firstChild as ParagraphWidget).childWidgets.length === 0) {
                                const lineWidget: LineWidget = new LineWidget(cell.firstChild as ParagraphWidget);
                                (cell.firstChild as ParagraphWidget).childWidgets.push(lineWidget);
                            }
                            rowStartContentControl.line = (cell.firstChild as ParagraphWidget).firstChild as LineWidget;
                            ((cell.firstChild as ParagraphWidget).firstChild as LineWidget).children.splice(0, 0, rowStartContentControl);
                        } else if (row.lastChild === cell) {
                            const rowEndContentControl: ContentControl = new ContentControl('Row');
                            rowEndContentControl.contentControlProperties = row.contentControlProperties;
                            rowEndContentControl.type = 1;
                            if ((cell.lastChild as ParagraphWidget).childWidgets.length === 0) {
                                const lineWidget: LineWidget = new LineWidget(cell.lastChild as ParagraphWidget);
                                (cell.lastChild as ParagraphWidget).childWidgets.push(lineWidget);
                            }
                            rowEndContentControl.line = (cell.lastChild as ParagraphWidget).lastChild as LineWidget;
                            ((cell.lastChild as ParagraphWidget).lastChild as LineWidget).children.push(rowEndContentControl);
                        }
                    }
                    this.isPageBreakInsideTable = false;
                }
            }
            table.childWidgets.push(row);
            row.containerWidget = table;
        }
        table.containerWidget = section;
        blocks.push(table);
        table.isGridUpdated = false;
    }
    private parseTablePositioning(block: any, table: TableWidget): void {
        table.wrapTextAround = !isNullOrUndefined(block[wrapTextAroundProperty[this.keywordIndex]]) ? HelperMethods.parseBoolValue(block[wrapTextAroundProperty[this.keywordIndex]]) : false;
        if (table.wrapTextAround) {
            table.positioning = new TablePosition();
            table.positioning.allowOverlap = HelperMethods.parseBoolValue(block[positioningProperty[this.keywordIndex]][allowOverlapProperty[this.keywordIndex]]);
            if(!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][distanceBottomProperty[this.keywordIndex]])) {
                table.positioning.distanceBottom = HelperMethods.convertPointToPixel(block[positioningProperty[this.keywordIndex]][distanceBottomProperty[this.keywordIndex]]);
            }
            if(!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][distanceLeftProperty[this.keywordIndex]])) {
                table.positioning.distanceLeft = HelperMethods.convertPointToPixel(block[positioningProperty[this.keywordIndex]][distanceLeftProperty[this.keywordIndex]]);
            }
            if(!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][distanceRightProperty[this.keywordIndex]])) {
                table.positioning.distanceRight = HelperMethods.convertPointToPixel(block[positioningProperty[this.keywordIndex]][distanceRightProperty[this.keywordIndex]]);
            }
            if(!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][distanceTopProperty[this.keywordIndex]])) {
                table.positioning.distanceTop = HelperMethods.convertPointToPixel(block[positioningProperty[this.keywordIndex]][distanceTopProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][verticalAlignmentProperty[this.keywordIndex]])) {
                table.positioning.verticalAlignment = this.getTableVerticalPosition(block[positioningProperty[this.keywordIndex]][verticalAlignmentProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][verticalOriginProperty[this.keywordIndex]])) {
                table.positioning.verticalOrigin = this.getTableVerticalRelation(block[positioningProperty[this.keywordIndex]][verticalOriginProperty[this.keywordIndex]]);
            }
            table.positioning.verticalPosition = block[positioningProperty[this.keywordIndex]][verticalPositionProperty[this.keywordIndex]];
            if (!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][horizontalAlignmentProperty[this.keywordIndex]])) {
                table.positioning.horizontalAlignment = this.getTableHorizontalPosition(block[positioningProperty[this.keywordIndex]][horizontalAlignmentProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(block[positioningProperty[this.keywordIndex]][horizontalOriginProperty[this.keywordIndex]])) {
                table.positioning.horizontalOrigin = this.getTableHorizontalRelation(block[positioningProperty[this.keywordIndex]][horizontalOriginProperty[this.keywordIndex]]);
            }
            table.positioning.horizontalPosition = block[positioningProperty[this.keywordIndex]][horizontalPositionProperty[this.keywordIndex]];
        }
    }
    private parseRowGridValues(data: any, rowFormat: WRowFormat): void {
        if (!isNullOrUndefined(data[gridBeforeProperty[this.keywordIndex]])) {
            rowFormat.gridBefore = data[gridBeforeProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[gridBeforeWidthProperty[this.keywordIndex]])) {
            rowFormat.gridBeforeWidth = data[gridBeforeWidthProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[gridBeforeWidthTypeProperty[this.keywordIndex]])) {
            rowFormat.gridBeforeWidthType = this.getWidthType(data[gridBeforeWidthTypeProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(data[gridAfterProperty[this.keywordIndex]])) {
            rowFormat.gridAfter = data[gridAfterProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[gridAfterWidthProperty[this.keywordIndex]])) {
            rowFormat.gridAfterWidth = data[gridAfterWidthProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[gridAfterWidthTypeProperty[this.keywordIndex]])) {
            rowFormat.gridAfterWidthType = this.getWidthType(data[gridAfterWidthTypeProperty[this.keywordIndex]]);
        }
    }
    private parseContentControlProperties(wContentControlProperties: any, contentControlProperties: ContentControlProperties): void {
        if (!isNullOrUndefined(wContentControlProperties[lockContentControlProperty[this.keywordIndex]])) {
            contentControlProperties.lockContentControl = HelperMethods.parseBoolValue(wContentControlProperties[lockContentControlProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[lockContentsProperty[this.keywordIndex]])) {
            contentControlProperties.lockContents = HelperMethods.parseBoolValue(wContentControlProperties[lockContentsProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[tagProperty[this.keywordIndex]])) {
            contentControlProperties.tag = wContentControlProperties[tagProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(wContentControlProperties[colorProperty[this.keywordIndex]])) {
            contentControlProperties.color = wContentControlProperties[colorProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(wContentControlProperties[titleProperty[this.keywordIndex]])) {
            contentControlProperties.title = wContentControlProperties[titleProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(wContentControlProperties[appearanceProperty[this.keywordIndex]])) {
            contentControlProperties.appearance = this.getContentControlAppearance(wContentControlProperties[appearanceProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[typeProperty[this.keywordIndex]])) {
            contentControlProperties.type =  this.getContentControlType(wContentControlProperties[typeProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[hasPlaceHolderTextProperty[this.keywordIndex]])) {
            contentControlProperties.hasPlaceHolderText = HelperMethods.parseBoolValue(wContentControlProperties[hasPlaceHolderTextProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[multiLineProperty[this.keywordIndex]])) {
            contentControlProperties.multiline = HelperMethods.parseBoolValue(wContentControlProperties[multiLineProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[isTemporaryProperty[this.keywordIndex]])) {
            contentControlProperties.isTemporary = HelperMethods.parseBoolValue(wContentControlProperties[isTemporaryProperty[this.keywordIndex]]);
        }
        if (!isNullOrUndefined(wContentControlProperties[characterFormatProperty[this.keywordIndex]])) {
            this.parseCharacterFormat(this.keywordIndex, wContentControlProperties[characterFormatProperty[this.keywordIndex]], contentControlProperties.characterFormat);
        }
        if (contentControlProperties.type === 'CheckBox') {
            if (!isNullOrUndefined(wContentControlProperties[isCheckedProperty[this.keywordIndex]])) {
                contentControlProperties.isChecked = HelperMethods.parseBoolValue(wContentControlProperties[isCheckedProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(wContentControlProperties[uncheckedStateProperty[this.keywordIndex]])) {
                contentControlProperties.uncheckedState = new CheckBoxState();
                contentControlProperties.uncheckedState.font = wContentControlProperties[uncheckedStateProperty[this.keywordIndex]][fontProperty[this.keywordIndex]];
                contentControlProperties.uncheckedState.value = wContentControlProperties[uncheckedStateProperty[this.keywordIndex]][valueProperty[this.keywordIndex]];
            }
            if (!isNullOrUndefined(wContentControlProperties[checkedStateProperty[this.keywordIndex]])) {
                contentControlProperties.checkedState = new CheckBoxState();
                contentControlProperties.checkedState.font = wContentControlProperties[checkedStateProperty[this.keywordIndex]][fontProperty[this.keywordIndex]];
                contentControlProperties.checkedState.value = wContentControlProperties[checkedStateProperty[this.keywordIndex]][valueProperty[this.keywordIndex]];
            }
        } else if (contentControlProperties.type === 'Date') {
            if (!isNullOrUndefined(wContentControlProperties[dateCalendarTypeProperty[this.keywordIndex]])) {
                contentControlProperties.dateCalendarType = this.getDateCalendarType(wContentControlProperties[dateCalendarTypeProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(wContentControlProperties[dateStorageFormatProperty[this.keywordIndex]])) {
                contentControlProperties.dateStorageFormat = this.getDateStorageFormat(wContentControlProperties[dateStorageFormatProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(wContentControlProperties[dateDisplayLocaleProperty[this.keywordIndex]])) {
                contentControlProperties.dateDisplayLocale = wContentControlProperties[dateDisplayLocaleProperty[this.keywordIndex]];
            }
            if (!isNullOrUndefined(wContentControlProperties[dateDisplayFormatProperty[this.keywordIndex]])) {
                contentControlProperties.dateDisplayFormat = wContentControlProperties[dateDisplayFormatProperty[this.keywordIndex]];
            }
        } else if (contentControlProperties.type === 'ComboBox' || contentControlProperties.type === 'DropDownList') {
            if (!isNullOrUndefined(wContentControlProperties[contentControlListItemsProperty[this.keywordIndex]])) {
                for (let i: number = 0; i < wContentControlProperties[contentControlListItemsProperty[this.keywordIndex]].length; i++) {
                    const contentControlListItem: ContentControlListItems = new ContentControlListItems();
                    contentControlListItem.displayText = wContentControlProperties[contentControlListItemsProperty[this.keywordIndex]][i][displayTextProperty[this.keywordIndex]];
                    contentControlListItem.value = wContentControlProperties[contentControlListItemsProperty[this.keywordIndex]][i][valueProperty[this.keywordIndex]];
                    contentControlProperties.contentControlListItems.push(contentControlListItem);
                }
            }
        }
        if (!isNullOrUndefined(wContentControlProperties[xmlMappingProperty[this.keywordIndex]])) {
            contentControlProperties.xmlMapping = new XmlMapping();
            contentControlProperties.xmlMapping.isMapped = HelperMethods.parseBoolValue(wContentControlProperties[xmlMappingProperty[this.keywordIndex]][isMappedProperty[this.keywordIndex]]);
            contentControlProperties.xmlMapping.isWordMl = HelperMethods.parseBoolValue(wContentControlProperties[xmlMappingProperty[this.keywordIndex]][isWordMlProperty[this.keywordIndex]]);
            if (!isNullOrUndefined(wContentControlProperties[xmlMappingProperty[this.keywordIndex]][prefixMappingProperty[this.keywordIndex]])) {
                contentControlProperties.xmlMapping.prefixMapping = wContentControlProperties[xmlMappingProperty[this.keywordIndex]][prefixMappingProperty[this.keywordIndex]];
            }
            contentControlProperties.xmlMapping.xPath = wContentControlProperties[xmlMappingProperty[this.keywordIndex]][xPathProperty[this.keywordIndex]];
            contentControlProperties.xmlMapping.storeItemId = wContentControlProperties[xmlMappingProperty[this.keywordIndex]][storeItemIdProperty[this.keywordIndex]];
            if (!isNullOrUndefined(wContentControlProperties[xmlMappingProperty[this.keywordIndex]][customXmlPartProperty[this.keywordIndex]])) {
                contentControlProperties.xmlMapping.customXmlPart = new CustomXmlPart();
                contentControlProperties.xmlMapping.customXmlPart.id = wContentControlProperties[xmlMappingProperty[this.keywordIndex]][customXmlPartProperty[this.keywordIndex]][idProperty[this.keywordIndex]];
                contentControlProperties.xmlMapping.customXmlPart.xml = wContentControlProperties[xmlMappingProperty[this.keywordIndex]][customXmlPartProperty[this.keywordIndex]][xmlProperty[this.keywordIndex]];
            }
        }
    }

    /* eslint-disable  */
    private parseParagraph(data: any, paragraph: ParagraphWidget, writeInlineFormat?: boolean, lineWidget?: LineWidget): boolean {
        let isContentControl: boolean = false;
        if (isNullOrUndefined(lineWidget)) {
            lineWidget = new LineWidget(paragraph);
        } else {
            isContentControl = true;
        }
        let hasValidElmts: boolean = false;
        let revision: Revision;
        let trackChange: boolean = this.viewer.owner.enableTrackChanges;
        for (let i: number = 0; i < data.length; i++) {
            let inline: any = data[i];
            if (inline.hasOwnProperty(textProperty[this.keywordIndex]) || inline.hasOwnProperty(breakClearTypeProperty[this.keywordIndex])) {
                let textElement: any = undefined;
                if (this.documentHelper.isPageField) {
                    textElement = new FieldTextElementBox();
                    (textElement as FieldTextElementBox).fieldBegin = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                } else if (inline[textProperty[this.keywordIndex]] === '\t') {
                    textElement = new TabElementBox();

                } else if (inline[textProperty[this.keywordIndex]] === '\f' && this.isPageBreakInsideTable) {
                    continue;
                } else {
                    if (inline.hasOwnProperty(breakClearTypeProperty[this.keywordIndex])) {
                        textElement = new BreakElementBox();
                        textElement.breakClearType = this.getBreakClearType(inline[breakClearTypeProperty[this.keywordIndex]]);
                    } else {
                        textElement = new TextElementBox();
                    }
                }
                textElement.characterFormat = new WCharacterFormat(textElement);
                this.parseCharacterFormat(this.keywordIndex, inline[characterFormatProperty[this.keywordIndex]], textElement.characterFormat, writeInlineFormat);
                this.applyCharacterStyle(inline, textElement);
                textElement.text = textElement instanceof BreakElementBox ? "\v" : inline[textProperty[this.keywordIndex]];
                if (this.isHtmlPaste && (textElement instanceof TextElementBox || textElement instanceof BreakElementBox)) {
                    let previousElement: ElementBox;
                    if (lineWidget.children.length > 0) {
                        previousElement = lineWidget.children[lineWidget.children.length - 1];
                    }
                    // In html content, text bidi property is not present in the file level
                    // Hence bidi property is false for RTL content
                    // So, For html pasting we need to check and content and enable bidi to order the content similar to MS Word
                    if (this.documentHelper.textHelper.isRTLText(textElement.text)) {
                        textElement.characterFormat.bidi = true;
                        if (previousElement instanceof TextElementBox && previousElement.text === ' ') {
                            previousElement.characterFormat.bidi = true;
                        }
                    } 
                    //If previous element is RTL element, the we need to enable bidi for space character
                    else if (textElement.text === ' ' && previousElement && previousElement.characterFormat.bidi) {
                        textElement.characterFormat.bidi = true;
                    }
                }
                if (this.documentHelper.owner.parser.isPaste && !(this.isCutPerformed)) {
                    if (!isNullOrUndefined(inline[revisionIdsProperty[this.keywordIndex]])) {
                        for (let j: number = 0; j < inline[revisionIdsProperty[this.keywordIndex]].length; j++) {
                            if (this.revisionCollection.containsKey(inline[revisionIdsProperty[this.keywordIndex]][j])) {
                                if (trackChange) {
                                    revision = this.revisionCollection.get(inline[revisionIdsProperty[this.keywordIndex]][j]);
                                }
                                if (!isNullOrUndefined(revision) && !isNullOrUndefined(lineWidget.children[i - 1].revisions[j]) && ((!trackChange) || (trackChange && (revision.revisionType === 'Deletion')))) {
                                    if (revision.revisionID === inline[revisionIdsProperty[this.keywordIndex]][j]) {
                                        inline[revisionIdsProperty[this.keywordIndex]][j] = lineWidget.children[i - 1].revisions[j].revisionID;
                                        this.checkAndApplyRevision(this.keywordIndex, inline, textElement);
                                        continue;
                                    }
                                }
                                if (!trackChange) {
                                    revision = this.documentHelper.revisionsInternal.get(inline[revisionIdsProperty[this.keywordIndex]][j]);
                                }
                                this.documentHelper.owner.editorModule.insertRevision(textElement, revision.revisionType, revision.author);
                                inline[revisionIdsProperty[this.keywordIndex]][j] = textElement.revisions[j].revisionID;
                            }
                        }
                    }
                } else {
                    this.checkAndApplyRevision(this.keywordIndex, inline, textElement);
                }
                textElement.line = lineWidget;
                lineWidget.children.push(textElement);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty(footnoteTypeProperty[this.keywordIndex])) {
                let footnoteElement: FootnoteElementBox = new FootnoteElementBox();
                footnoteElement.line = lineWidget;
                footnoteElement.footnoteType = this.getFootnoteType(inline[footnoteTypeProperty[this.keywordIndex]]);
                if (footnoteElement.footnoteType === 'Footnote') {
                    this.documentHelper.footnoteCollection.push(footnoteElement);
                } else {
                    this.documentHelper.endnoteCollection.push(footnoteElement);
                }
                footnoteElement.symbolCode = inline[symbolCodeProperty[this.keywordIndex]];
                footnoteElement.symbolFontName = inline[symbolFontNameProperty[this.keywordIndex]];
                footnoteElement.customMarker = inline[customMarkerProperty[this.keywordIndex]];
                footnoteElement.characterFormat = new WCharacterFormat(footnoteElement);
                this.parseCharacterFormat(this.keywordIndex, inline[characterFormatProperty[this.keywordIndex]], footnoteElement.characterFormat, writeInlineFormat);
                this.applyCharacterStyle(inline, footnoteElement);
                this.parseBody(inline[blocksProperty[this.keywordIndex]], footnoteElement.bodyWidget.childWidgets as BlockWidget[], footnoteElement.bodyWidget, false);
                this.checkAndApplyRevision(this.keywordIndex, inline, footnoteElement);
                lineWidget.children.push(footnoteElement);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty(chartTypeProperty[this.keywordIndex])) {
                // chartPreservation
                if (this.documentHelper.owner.editor) {
                    this.documentHelper.owner.editor.chartType = true;
                }
                let chartElement: ChartElementBox = new ChartElementBox();
                chartElement.title = inline[chartTitleProperty[this.keywordIndex]];
                chartElement.type = inline[chartTypeProperty[this.keywordIndex]];
                chartElement.chartGapWidth = inline[gapWidthProperty[this.keywordIndex]];
                chartElement.chartOverlap = inline[overlapProperty[this.keywordIndex]];
                this.parseChartTitleArea(inline[chartTitleAreaProperty[this.keywordIndex]], chartElement.chartTitleArea);
                this.parseChartArea(inline[chartAreaProperty[this.keywordIndex]], chartElement.chartArea);
                this.parseChartArea(inline[plotAreaProperty[this.keywordIndex]], chartElement.chartPlotArea);
                this.parseChartLegend(inline[chartLegendProperty[this.keywordIndex]], chartElement.chartLegend);
                this.parseChartData(inline, chartElement);
                this.parseChartCategoryAxis(inline[chartPrimaryCategoryAxisProperty[this.keywordIndex]], chartElement.chartPrimaryCategoryAxis);
                this.parseChartCategoryAxis(inline[chartPrimaryValueAxisProperty[this.keywordIndex]], chartElement.chartPrimaryValueAxis);
                if (inline[chartDataTableProperty[this.keywordIndex]] != null) {
                    this.parseChartDataTable(inline[chartDataTableProperty[this.keywordIndex]], chartElement.chartDataTable);
                }
                chartElement.line = lineWidget;
                lineWidget.children.push(chartElement);
                chartElement.height = HelperMethods.convertPointToPixel(inline[heightProperty[this.keywordIndex]]);
                chartElement.width = HelperMethods.convertPointToPixel(inline[widthProperty[this.keywordIndex]]);

                let officeChart: ChartComponent = new ChartComponent();
                officeChart.chartRender(inline, this.keywordIndex);
                chartElement.officeChart = officeChart;
                officeChart.chart.appendTo(chartElement.targetElement);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty(imageStringProperty[this.keywordIndex])) {
                let image: ImageElementBox = new ImageElementBox(HelperMethods.parseBoolValue(inline[isInlineImageProperty[this.keywordIndex]]));
                image.isMetaFile = HelperMethods.parseBoolValue(inline[isMetaFileProperty[this.keywordIndex]]);
                image.isCompressed = inline[isCompressedProperty[this.keywordIndex]];
                image.metaFileImageString = inline[metaFileImageStringProperty[this.keywordIndex]];
                image.characterFormat = new WCharacterFormat(image);
                image.line = lineWidget;
                this.checkAndApplyRevision(this.keywordIndex, inline, image);
                lineWidget.children.push(image);
                let imageString: string = HelperMethods.formatClippedString(inline[imageStringProperty[this.keywordIndex]]).formatClippedString;
                let isValidImage: boolean = this.validateImageUrl(imageString);
                if (!isValidImage) {
                    image.imageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC';
                } else {
                    if(this.isPaste && !isNullOrUndefined(this.documentHelper.owner.editor.pasteImageIndex)) {
                        image.imageString = this.documentHelper.owner.editor.pasteImageIndex.get(inline[imageStringProperty[this.keywordIndex]]);
                    }
                    else {
                        image.imageString = inline[imageStringProperty[this.keywordIndex]];
                    }
                }
                // Before 21.1 duplicate images are preserved as inline images with direct base64 string in the image string property. TO provide backward compatibility we are checking both the index based retrieval from images collections and inline image string.
                let imgStrValue: number = parseInt(inline[imageStringProperty[this.keywordIndex]]);
                if (imgStrValue.toString() === "NaN" ? true : false) {
                    this.documentHelper.addBase64StringInCollection(image);
                }
                image.element.src = this.documentHelper.getImageString(image);
                image.width = HelperMethods.convertPointToPixel(inline[widthProperty[this.keywordIndex]]);
                image.height = HelperMethods.convertPointToPixel(inline[heightProperty[this.keywordIndex]]);
                image.top = inline[topProperty[this.keywordIndex]];
                image.left = inline[leftProperty[this.keywordIndex]];
                image.bottom = inline[bottomProperty[this.keywordIndex]];
                image.right = inline[rightProperty[this.keywordIndex]];
                image.cropHeightScale = inline[getImageHeightProperty[this.keywordIndex]];
                image.cropWidthScale = inline[getImageWidthProperty[this.keywordIndex]];
                image.name = inline[nameProperty[this.keywordIndex]];
                image.alternateText = inline[alternativeTextProperty[this.keywordIndex]];
                image.title = inline[titleProperty[this.keywordIndex]];
                image.visible = HelperMethods.parseBoolValue(inline[visibleProperty[this.keywordIndex]]);
                image.widthScale = inline[widthScaleProperty[this.keywordIndex]];
                image.heightScale = inline[heightScaleProperty[this.keywordIndex]];
                image.verticalPosition = HelperMethods.convertPointToPixel(inline[verticalPositionProperty[this.keywordIndex]]);
                image.verticalOrigin = this.getVerticalOrigin(inline[verticalOriginProperty[this.keywordIndex]]);
                image.verticalAlignment = this.getShapeVerticalAlignment(inline[verticalAlignmentProperty[this.keywordIndex]]);
                image.horizontalPosition = HelperMethods.convertPointToPixel(inline[horizontalPositionProperty[this.keywordIndex]]);
                image.horizontalOrigin = this.getHorizontalOrigin(inline[horizontalOriginProperty[this.keywordIndex]]);
                image.horizontalAlignment = this.getShapeHorizontalAlignment(inline[horizontalAlignmentProperty[this.keywordIndex]]);
                image.allowOverlap = HelperMethods.parseBoolValue(inline[allowOverlapProperty[this.keywordIndex]]);
                if(!isNullOrUndefined(inline[textWrappingStyleProperty[this.keywordIndex]])) {
                    image.textWrappingStyle =  this.getTextWrappingStyle(inline[textWrappingStyleProperty[this.keywordIndex]]);
                }
                if(!isNullOrUndefined(inline[textWrappingTypeProperty[this.keywordIndex]])) {
                    image.textWrappingType = this.getTextWrappingType(inline[textWrappingTypeProperty[this.keywordIndex]]);
                }
                image.isBelowText = HelperMethods.parseBoolValue(inline[belowTextProperty[this.keywordIndex]]);
                if(!isNullOrUndefined(inline[distanceBottomProperty[this.keywordIndex]])) {
                    image.distanceBottom = HelperMethods.convertPointToPixel(inline[distanceBottomProperty[this.keywordIndex]]);
                }
                if(!isNullOrUndefined(inline[distanceLeftProperty[this.keywordIndex]])) {
                    image.distanceLeft = HelperMethods.convertPointToPixel(inline[distanceLeftProperty[this.keywordIndex]]);
                }
                if(!isNullOrUndefined(inline[distanceRightProperty[this.keywordIndex]])) {
                    image.distanceRight = HelperMethods.convertPointToPixel(inline[distanceRightProperty[this.keywordIndex]]);                    
                }
                if(!isNullOrUndefined(inline[distanceTopProperty[this.keywordIndex]])) {
                    image.distanceTop = HelperMethods.convertPointToPixel(inline[distanceTopProperty[this.keywordIndex]]);
                }
                image.zOrderPosition = inline[zOrderPositionProperty[this.keywordIndex]];
                image.layoutInCell = HelperMethods.parseBoolValue(inline[layoutInCellProperty[this.keywordIndex]]);
                if (!isNullOrUndefined(inline[topProperty[this.keywordIndex]]) && inline[topProperty[this.keywordIndex]] !== 0 ||
                    !isNullOrUndefined(inline[bottomProperty[this.keywordIndex]]) && inline[bottomProperty[this.keywordIndex]] !== 0 ||
                    !isNullOrUndefined(inline[leftProperty[this.keywordIndex]]) && inline[leftProperty[this.keywordIndex]] !== 0 ||
                    !isNullOrUndefined(inline[rightProperty[this.keywordIndex]]) && inline[rightProperty[this.keywordIndex]] !== 0) {
                    image.isCrop = true;
                }
                if (this.getTextWrappingStyle(image.textWrappingStyle) !== 'Inline') {
                    paragraph.floatingElements.push(image);
                }
                this.parseCharacterFormat(this.keywordIndex, inline[characterFormatProperty[this.keywordIndex]], image.characterFormat);
                hasValidElmts = true;
            } else if (inline.hasOwnProperty(hasFieldEndProperty[this.keywordIndex]) || (inline.hasOwnProperty(fieldTypeProperty[this.keywordIndex]) && inline[fieldTypeProperty[this.keywordIndex]] === 0)) {
                let fieldBegin: FieldElementBox = new FieldElementBox(0);
                this.parseCharacterFormat(this.keywordIndex, inline[characterFormatProperty[this.keywordIndex]], fieldBegin.characterFormat, writeInlineFormat);
                this.applyCharacterStyle(inline, fieldBegin);
                fieldBegin.fieldCodeType = inline.fieldCodeType;
                fieldBegin.hasFieldEnd = inline[hasFieldEndProperty[this.keywordIndex]];
                if (inline.hasOwnProperty(formFieldDataProperty[this.keywordIndex])) {
                    let formFieldData: FormField;
                    formFieldData = this.parseFormFieldData(this.keywordIndex, inline, formFieldData);
                    fieldBegin.formFieldData = formFieldData;
                    this.documentHelper.formFields.push(fieldBegin);
                }
                this.documentHelper.fieldStacks.push(fieldBegin);
                this.checkAndApplyRevision(this.keywordIndex, inline, fieldBegin);
                fieldBegin.line = lineWidget;
                this.documentHelper.fields.push(fieldBegin);
                lineWidget.children.push(fieldBegin);
            } else if (inline.hasOwnProperty([fieldTypeProperty[this.keywordIndex]])) {
                let field: FieldElementBox = undefined;
                if (inline[fieldTypeProperty[this.keywordIndex]] === 2) {
                    field = new FieldElementBox(2);
                    this.parseCharacterFormat(this.keywordIndex, inline[characterFormatProperty[this.keywordIndex]], field.characterFormat, writeInlineFormat);
                    this.checkAndApplyRevision(this.keywordIndex, inline, field);
                    this.fieldSeparator = field;
                    if (this.documentHelper.fieldStacks.length > 0) {
                        field.fieldBegin = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                        field.fieldBegin.fieldSeparator = field;
                        //finds the whether the field is page filed or not
                        let lineWidgetCount: number = lineWidget.children.length;
                        if (lineWidgetCount >= 2) {
                            let fieldTextElement: ElementBox = this.containsFieldBegin(lineWidget);
                            if (!isNullOrUndefined(fieldTextElement) && fieldTextElement instanceof TextElementBox && (fieldTextElement.text.match('PAGE') || fieldTextElement.text.match('page'))) {
                                const textField: any = fieldTextElement.text;
                                if (!textField.startsWith('HYPERLINK')) {
                                    this.documentHelper.isPageField = true;
                                }
                            }
                        }
                    }
                } else if (inline[fieldTypeProperty[this.keywordIndex]] === 1) {
                    field = new FieldElementBox(1);
                    this.parseCharacterFormat(this.keywordIndex, inline[characterFormatProperty[this.keywordIndex]], field.characterFormat, writeInlineFormat);
                    this.applyCharacterStyle(inline, field);
                    this.checkAndApplyRevision(this.keywordIndex, inline, field);
                    //For Field End Updated begin and separator.                                      
                    if (this.documentHelper.fieldStacks.length > 0) {
                        field.fieldBegin = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                        field.fieldBegin.fieldEnd = field;
                    }
                    if (!isNullOrUndefined(field.fieldBegin) && field.fieldBegin.fieldSeparator) {
                        field.fieldSeparator = field.fieldBegin.fieldSeparator;
                        field.fieldBegin.fieldSeparator.fieldEnd = field;
                        hasValidElmts = true;
                    }
                    //After setting all the property clear the field values
                    this.documentHelper.fieldStacks.splice(this.documentHelper.fieldStacks.length - 1, 1);
                    this.fieldSeparator = undefined;
                    this.documentHelper.isPageField = false;
                    this.documentHelper.fieldCollection.push(field.fieldBegin);
                }
                field.line = lineWidget;
                lineWidget.children.push(field);
            } else if (inline.hasOwnProperty([bookmarkTypeProperty[this.keywordIndex]])) {
                let bookmark: BookmarkElementBox = undefined;
                bookmark = new BookmarkElementBox(inline[bookmarkTypeProperty[this.keywordIndex]]);
                bookmark.name = inline[nameProperty[this.keywordIndex]];
                bookmark.properties = inline[propertiesProperty[this.keywordIndex]];
                if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]])) {
                    if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]][isAfterParagraphMarkProperty[this.keywordIndex]])) {
                        bookmark.properties['isAfterParagraphMark'] = HelperMethods.parseBoolValue(inline[propertiesProperty[this.keywordIndex]][isAfterParagraphMarkProperty[this.keywordIndex]]);
                    }
                    if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]][isAfterTableMarkProperty[this.keywordIndex]])) {
                        bookmark.properties['isAfterTableMark'] = HelperMethods.parseBoolValue(inline[propertiesProperty[this.keywordIndex]][isAfterTableMarkProperty[this.keywordIndex]]);
                    }
                    if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]][isAfterRowMarkProperty[this.keywordIndex]])) {
                        bookmark.properties['isAfterRowMark'] = HelperMethods.parseBoolValue(inline[propertiesProperty[this.keywordIndex]][isAfterRowMarkProperty[this.keywordIndex]]);
                    }
                    if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]][isAfterCellMarkProperty[this.keywordIndex]])) {
                        bookmark.properties['isAfterCellMark'] = HelperMethods.parseBoolValue(inline[propertiesProperty[this.keywordIndex]][isAfterCellMarkProperty[this.keywordIndex]]);
                    }
                    if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]][columnFirstProperty[this.keywordIndex]])) {
                        bookmark.properties['columnFirst'] = inline[propertiesProperty[this.keywordIndex]][columnFirstProperty[this.keywordIndex]];
                    }
                    if (!isNullOrUndefined(inline[propertiesProperty[this.keywordIndex]][columnLastProperty[this.keywordIndex]])) {
                        bookmark.properties['columnLast'] = inline[propertiesProperty[this.keywordIndex]][columnLastProperty[this.keywordIndex]];
                    }
                }
                this.checkAndApplyRevision(this.keywordIndex, inline, bookmark);
                lineWidget.children.push(bookmark);
                bookmark.line = lineWidget;
                if (!this.isParseHeader || this.isPaste) {
                    if (inline[bookmarkTypeProperty[this.keywordIndex]] === 0) {
                        let isAdd: boolean = this.isPaste && !this.documentHelper.bookmarks.containsKey(bookmark.name);
                        if (!this.isPaste || isAdd) {
                            this.documentHelper.bookmarks.add(bookmark.name, bookmark);
                        } else if (!isAdd) {
                            lineWidget.children.splice(lineWidget.children.indexOf(bookmark), 1);
                        }
                    } else if (inline[bookmarkTypeProperty[this.keywordIndex]] === 1) {
                        if (this.documentHelper.bookmarks.containsKey(bookmark.name)) {
                            let bookmarkStart: BookmarkElementBox = this.documentHelper.bookmarks.get(bookmark.name);
                            let isConsider: boolean = this.isPaste && isNullOrUndefined(bookmarkStart.reference);
                            if (!this.isPaste || isConsider) {
                                bookmarkStart.reference = bookmark;
                                bookmark.reference = bookmarkStart;
                                this.documentHelper.endBookmarksUpdated.push(bookmark.name);
                            } else if (!isConsider) {
                                lineWidget.children.splice(lineWidget.children.indexOf(bookmark), 1);
                            }                            
                        }
                    }
                }
                if (bookmark.name.indexOf('_') !== 0) {
                    hasValidElmts = true;
                }
            } else if (inline.hasOwnProperty([editRangeIdProperty[this.keywordIndex]])) {
                if (inline.hasOwnProperty(editableRangeStartProperty[this.keywordIndex])) {
                    let permEnd: EditRangeEndElementBox = new EditRangeEndElementBox();
                    if (this.editableRanges.containsKey(inline[editRangeIdProperty[this.keywordIndex]])) {
                        let start: EditRangeStartElementBox = this.editableRanges.get(inline[editRangeIdProperty[this.keywordIndex]]);
                        permEnd.editRangeStart = start;
                        start.editRangeEnd = permEnd;
                        if (!isNullOrUndefined(inline[editRangeIdProperty[this.keywordIndex]])) {
                            permEnd.editRangeId = inline[editRangeIdProperty[this.keywordIndex]]
                        }
                        this.editableRanges.remove(inline[editRangeIdProperty[this.keywordIndex]]);
                    }
                    lineWidget.children.push(permEnd);
                    permEnd.line = lineWidget;
                } else {
                    let permStart: EditRangeStartElementBox = this.parseEditableRangeStart(inline);
                    lineWidget.children.push(permStart);
                    permStart.line = lineWidget;
                    if (!this.editableRanges.containsKey(inline[editRangeIdProperty[this.keywordIndex]])) {
                        this.editableRanges.add(inline[editRangeIdProperty[this.keywordIndex]], permStart);
                    }
                }
                hasValidElmts = true;
            } else if (inline.hasOwnProperty([commentIdProperty[this.keywordIndex]])) {
                let commentID: string = inline[commentIdProperty[this.keywordIndex]];
                let commentStart: CommentCharacterElementBox = undefined;
                let comment: CommentElementBox;
                if (this.commentStarts.containsKey(commentID)) {
                    commentStart = this.commentStarts.get(commentID);
                }
                let commentEnd: CommentCharacterElementBox = undefined;
                if (this.commentEnds.containsKey(commentID)) {
                    commentEnd = this.commentEnds.get(commentID);
                }
                if (inline.hasOwnProperty([commentCharacterTypeProperty[this.keywordIndex]])) {
                    if (inline[commentCharacterTypeProperty[this.keywordIndex]] === 0) {
                        let commentStartElement: CommentCharacterElementBox = new CommentCharacterElementBox(0);
                        commentStartElement.commentId = commentID;
                        if (!this.commentStarts.containsKey(commentID)) {
                            this.commentStarts.add(commentID, commentStartElement);
                        }
                        commentStartElement.line = lineWidget;
                        lineWidget.children.push(commentStartElement);
                        comment = this.commentsCollection.get(commentID);
                        if (!isNullOrUndefined(comment)) {
                            comment.commentStart = commentStartElement;
                            commentStartElement.comment = comment;
                        }
                    } else {
                        let commentEndElement: CommentCharacterElementBox = new CommentCharacterElementBox(1);
                        commentEndElement.commentId = commentID;
                        if (!this.commentEnds.containsKey(commentID)) {
                            this.commentEnds.add(commentID, commentEndElement);
                        }
                        commentEndElement.line = lineWidget;
                        lineWidget.children.push(commentEndElement);
                        comment = this.commentsCollection.get(commentID);
                        if (!isNullOrUndefined(comment)) {
                            comment.commentEnd = commentEndElement;
                            commentEndElement.comment = comment;
                        }
                    }
                    if (!isNullOrUndefined(comment) && comment.isReply) {
                        if (isNullOrUndefined(comment.ownerComment.commentStart)) {
                            comment.ownerComment.commentStart = comment.commentStart;
                        }
                        if (isNullOrUndefined(comment.ownerComment.commentEnd)) {
                            comment.ownerComment.commentEnd = comment.commentEnd;
                        }
                    }
                }
            } else if (inline.hasOwnProperty([shapeIdProperty[this.keywordIndex]])) {
                let shape: ShapeElementBox = new ShapeElementBox();
                shape.shapeId = inline[shapeIdProperty[this.keywordIndex]];
                shape.name = inline[nameProperty[this.keywordIndex]];
                shape.alternateText = inline[alternativeTextProperty[this.keywordIndex]];
                shape.title = inline[titleProperty[this.keywordIndex]];
                shape.visible = HelperMethods.parseBoolValue(inline[visibleProperty[this.keywordIndex]]);
                shape.width = HelperMethods.convertPointToPixel(inline[widthProperty[this.keywordIndex]]);
                shape.height = HelperMethods.convertPointToPixel(inline[heightProperty[this.keywordIndex]]);
                if (shape.height === 0) {
                    shape.isZeroHeight = true;
                }
                shape.widthScale = inline[widthScaleProperty[this.keywordIndex]];
                shape.heightScale = inline[heightScaleProperty[this.keywordIndex]];
                shape.verticalPosition = HelperMethods.convertPointToPixel(inline[verticalPositionProperty[this.keywordIndex]]);
                shape.verticalOrigin = this.getVerticalOrigin(inline[verticalOriginProperty[this.keywordIndex]]);
                shape.verticalAlignment = this.getShapeVerticalAlignment(inline[verticalAlignmentProperty[this.keywordIndex]]);
                shape.verticalRelativePercent = inline[verticalRelativePercentProperty[this.keywordIndex]];
                shape.horizontalPosition = HelperMethods.convertPointToPixel(inline[horizontalPositionProperty[this.keywordIndex]]);
                shape.horizontalOrigin = this.getHorizontalOrigin(inline[horizontalOriginProperty[this.keywordIndex]]);
                shape.horizontalAlignment = this.getShapeHorizontalAlignment(inline[horizontalAlignmentProperty[this.keywordIndex]]);
                shape.horizontalRelativePercent = inline[horizontalRelativePercentProperty[this.keywordIndex]];
                shape.heightRelativePercent = inline[heightRelativePercentProperty[this.keywordIndex]];
                shape.widthRelativePercent = inline[widthRelativePercentProperty[this.keywordIndex]];
                shape.zOrderPosition = inline[zOrderPositionProperty[this.keywordIndex]];
                shape.allowOverlap = HelperMethods.parseBoolValue(inline[allowOverlapProperty[this.keywordIndex]]);
                shape.textWrappingStyle = this.getTextWrappingStyle(inline[textWrappingStyleProperty[this.keywordIndex]]);
                shape.textWrappingType = this.getTextWrappingType(inline[textWrappingTypeProperty[this.keywordIndex]]);
                shape.isBelowText = HelperMethods.parseBoolValue(inline[belowTextProperty[this.keywordIndex]]);
                if(!isNullOrUndefined(inline[distanceBottomProperty[this.keywordIndex]])) {
                    shape.distanceBottom = HelperMethods.convertPointToPixel(inline[distanceBottomProperty[this.keywordIndex]]);
                }
                if(!isNullOrUndefined(inline[distanceLeftProperty[this.keywordIndex]])) {
                    shape.distanceLeft = HelperMethods.convertPointToPixel(inline[distanceLeftProperty[this.keywordIndex]]);
                }
                if(!isNullOrUndefined(inline[distanceRightProperty[this.keywordIndex]])) {
                    shape.distanceRight = HelperMethods.convertPointToPixel(inline[distanceRightProperty[this.keywordIndex]]);
                }
                if(!isNullOrUndefined(inline[distanceTopProperty[this.keywordIndex]])) {
                    shape.distanceTop = HelperMethods.convertPointToPixel(inline[distanceTopProperty[this.keywordIndex]]);
                }
                shape.layoutInCell = HelperMethods.parseBoolValue(inline[layoutInCellProperty[this.keywordIndex]]);
                shape.lockAnchor = HelperMethods.parseBoolValue(inline[lockAnchorProperty[this.keywordIndex]]);
                shape.autoShapeType = this.getAutoShapeType(inline[autoShapeTypeProperty[this.keywordIndex]]);
                if (inline.hasOwnProperty(lineFormatProperty[this.keywordIndex])) {
                    let lineFormat: LineFormat = new LineFormat();
                    lineFormat.line = HelperMethods.parseBoolValue(inline[lineFormatProperty[this.keywordIndex]][lineProperty[this.keywordIndex]]);
                    lineFormat.lineFormatType = this.getLineFormatType(inline[lineFormatProperty[this.keywordIndex]][lineFormatTypeProperty[this.keywordIndex]]);
                    lineFormat.color = inline[lineFormatProperty[this.keywordIndex]][colorProperty[this.keywordIndex]];
                    lineFormat.weight = inline[lineFormatProperty[this.keywordIndex]][weightProperty[this.keywordIndex]];
                    lineFormat.dashStyle = this.getLineDashStyle(inline[lineFormatProperty[this.keywordIndex]][lineStyleProperty[this.keywordIndex]]);
                    shape.lineFormat = lineFormat;
                }
                if (inline.hasOwnProperty(fillFormatProperty[this.keywordIndex])) {
                    let fillFormat: FillFormat = new FillFormat();
                    fillFormat.color = inline[fillFormatProperty[this.keywordIndex]][colorProperty[this.keywordIndex]];
                    fillFormat.fill = HelperMethods.parseBoolValue(inline[fillFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]]);
                    shape.fillFormat = fillFormat;
                }
                if (inline.hasOwnProperty(textFrameProperty[this.keywordIndex])) {
                    let textFrame: TextFrame = new TextFrame();
                    textFrame.textVerticalAlignment = this.getTextVerticalAlignment(inline[textFrameProperty[this.keywordIndex]][textVerticalAlignmentProperty[this.keywordIndex]]);
                    textFrame.marginLeft = HelperMethods.convertPointToPixel(inline[textFrameProperty[this.keywordIndex]][leftMarginProperty[this.keywordIndex]]);
                    textFrame.marginRight = HelperMethods.convertPointToPixel(inline[textFrameProperty[this.keywordIndex]][rightMarginProperty[this.keywordIndex]]);
                    textFrame.marginTop = HelperMethods.convertPointToPixel(inline[textFrameProperty[this.keywordIndex]][topMarginProperty[this.keywordIndex]]);
                    textFrame.marginBottom = HelperMethods.convertPointToPixel(inline[textFrameProperty[this.keywordIndex]][bottomMarginProperty[this.keywordIndex]]);
                    this.parseBody(inline[textFrameProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]], textFrame.childWidgets as BlockWidget[], textFrame);
                    shape.textFrame = textFrame;
                    textFrame.containerShape = shape;
                }
                shape.line = lineWidget;
                this.checkAndApplyRevision(this.keywordIndex, inline, shape);
                lineWidget.children.push(shape);
                paragraph.floatingElements.push(shape);
            } else if (inline.hasOwnProperty(contentControlPropertiesProperty[this.keywordIndex])) {
                let inlineStartContentControl: ContentControl = new ContentControl('Inline');
                let inlineEndContentControl: ContentControl = new ContentControl('Inline');
                this.parseContentControlProperties(inline[contentControlPropertiesProperty[this.keywordIndex]], inlineStartContentControl.contentControlProperties);
                inlineEndContentControl.contentControlProperties = inlineStartContentControl.contentControlProperties;
                inlineStartContentControl.line = lineWidget;
                inlineEndContentControl.line = lineWidget;
                inlineStartContentControl.type = 0;
                inlineEndContentControl.type = 1;

                lineWidget.children.push(inlineStartContentControl);
                this.parseParagraph(inline[inlinesProperty[this.keywordIndex]], paragraph, writeInlineFormat, lineWidget);
                let element: ElementBox = lineWidget.children[lineWidget.children.length - 1];
                while (!(element instanceof ContentControl)) {
                    (element as ElementBox).contentControlProperties = inlineStartContentControl.contentControlProperties;
                    element = (element as ElementBox).previousElement;
                }
                lineWidget.children.push(inlineEndContentControl);
                hasValidElmts = true;
            }
        }
        this.isCutPerformed = false;
        if (!isContentControl) {
            paragraph.childWidgets.push(lineWidget);
        }
        return hasValidElmts;
    }
    /**
     * @private
     */
    public parseFormFieldData(keywordIndex: number, sourceData: any, formFieldData: FormField): FormField {
        if (formFieldData instanceof TextFormField || formFieldData instanceof CheckBoxFormField || formFieldData instanceof DropDownFormField) {
            if (formFieldData instanceof CheckBoxFormField) {
                (formFieldData as CheckBoxFormField).sizeType = sourceData.sizeType;
                (formFieldData as CheckBoxFormField).size = sourceData.size;
                (formFieldData as CheckBoxFormField).defaultValue = sourceData.defaultValue;
                (formFieldData as CheckBoxFormField).checked = sourceData.checked;
            } else if (formFieldData instanceof TextFormField) {
                (formFieldData as TextFormField).type = sourceData.type;
                (formFieldData as TextFormField).maxLength = sourceData.maxLength;
                (formFieldData as TextFormField).defaultValue = sourceData.defaultValue;
                (formFieldData as TextFormField).format = sourceData.format;
            } else {
                (formFieldData as DropDownFormField).dropdownItems = sourceData.dropdownItems;
                (formFieldData as DropDownFormField).selectedIndex = sourceData.selectedIndex;
            }
            formFieldData.name = sourceData.name;
            formFieldData.enabled = sourceData.enabled;
            formFieldData.helpText = sourceData.helpText;
            formFieldData.statusText = sourceData.statusText;
        } else {
            if (sourceData[formFieldDataProperty[keywordIndex]].hasOwnProperty(textInputProperty[keywordIndex])) {
                formFieldData = new TextFormField();
                (formFieldData as TextFormField).type = this.getTextFormFieldType(sourceData[formFieldDataProperty[keywordIndex]][textInputProperty[keywordIndex]][typeProperty[keywordIndex]]);
                (formFieldData as TextFormField).maxLength = sourceData[formFieldDataProperty[keywordIndex]][textInputProperty[keywordIndex]][maxLengthProperty[keywordIndex]];
                (formFieldData as TextFormField).defaultValue = sourceData[formFieldDataProperty[keywordIndex]][textInputProperty[keywordIndex]][defaultValueProperty[keywordIndex]];
                (formFieldData as TextFormField).format = this.getTextFormFieldFormat(sourceData[formFieldDataProperty[keywordIndex]][textInputProperty[keywordIndex]][formatProperty[keywordIndex]]);
            } else if (sourceData[formFieldDataProperty[keywordIndex]].hasOwnProperty(checkBoxProperty[keywordIndex])) {
                formFieldData = new CheckBoxFormField();
                (formFieldData as CheckBoxFormField).sizeType = this.getCheckBoxSizeType(sourceData[formFieldDataProperty[keywordIndex]][checkBoxProperty[keywordIndex]][sizeTypeProperty[keywordIndex]]);
                (formFieldData as CheckBoxFormField).size = sourceData[formFieldDataProperty[keywordIndex]][checkBoxProperty[keywordIndex]][sizeProperty[keywordIndex]];
                (formFieldData as CheckBoxFormField).defaultValue = HelperMethods.parseBoolValue(sourceData[formFieldDataProperty[keywordIndex]][checkBoxProperty[keywordIndex]][defaultValueProperty[keywordIndex]]);
                (formFieldData as CheckBoxFormField).checked = HelperMethods.parseBoolValue(sourceData[formFieldDataProperty[keywordIndex]][checkBoxProperty[keywordIndex]][checkedProperty[keywordIndex]]);
            } else {
                formFieldData = new DropDownFormField();
                (formFieldData as DropDownFormField).dropdownItems = sourceData[formFieldDataProperty[keywordIndex]][dropDownListProperty[keywordIndex]][dropDownItemsProperty[keywordIndex]];
                (formFieldData as DropDownFormField).selectedIndex = sourceData[formFieldDataProperty[keywordIndex]][dropDownListProperty[keywordIndex]][selectedIndexProperty[keywordIndex]];
            }
            formFieldData.name = sourceData[formFieldDataProperty[keywordIndex]][nameProperty[keywordIndex]];
            formFieldData.enabled = HelperMethods.parseBoolValue(sourceData[formFieldDataProperty[keywordIndex]][enabledProperty[keywordIndex]]);
            formFieldData.helpText = sourceData[formFieldDataProperty[keywordIndex]][helpTextProperty[keywordIndex]];
            formFieldData.statusText = sourceData[formFieldDataProperty[keywordIndex]][statusTextProperty[keywordIndex]];
        }
        return formFieldData;
    }
    private applyCharacterStyle(inline: any, elementbox: ElementBox): void {
        if (!isNullOrUndefined(inline[characterFormatProperty[this.keywordIndex]]) && !isNullOrUndefined(inline[characterFormatProperty[this.keywordIndex]][styleNameProperty[this.keywordIndex]])) {
            let charStyle: Object = this.documentHelper.styles.findByName(inline[characterFormatProperty[this.keywordIndex]][styleNameProperty[this.keywordIndex]], 'Character');
            elementbox.characterFormat.applyStyle(charStyle as WStyle);
        }
    }
    private parseEditableRangeStart(data: any): EditRangeStartElementBox {
        let permStart: EditRangeStartElementBox = new EditRangeStartElementBox();
        if (!isNullOrUndefined(data[columnFirstProperty[this.keywordIndex]])) {
            permStart.columnFirst = data[columnFirstProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[columnLastProperty[this.keywordIndex]])) {
            permStart.columnLast = data[columnLastProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[editRangeIdProperty[this.keywordIndex]])) {
            permStart.editRangeId = data[editRangeIdProperty[this.keywordIndex]]
        }
        if (!isNullOrUndefined(data[userProperty[this.keywordIndex]])) {
            permStart.user = data[userProperty[this.keywordIndex]];
            if (this.documentHelper.userCollection.indexOf(permStart.user) === -1) {
                this.documentHelper.userCollection.push(permStart.user);
            }
            this.addEditRangeCollection(permStart.user, permStart);
        }
        if (!isNullOrUndefined(data[groupProperty[this.keywordIndex]]) && data[groupProperty[this.keywordIndex]] !== '') {
            permStart.group = data[groupProperty[this.keywordIndex]];
            permStart.group = permStart.group === 'everyone' ? 'Everyone' : permStart.group;
            if (this.documentHelper.userCollection.indexOf(permStart.group) === -1) {
                this.documentHelper.userCollection.push(permStart.group);
            }
            this.addEditRangeCollection(permStart.group, permStart);
        }
        return permStart;
    }
    private addEditRangeCollection(name: string, permStart: EditRangeStartElementBox): void {
        if (this.documentHelper.editRanges.containsKey(name)) {
            let editStartCollection: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(name);
            editStartCollection.push(permStart);
        } else {
            let newEditStartCollection: EditRangeStartElementBox[] = [];
            newEditStartCollection.push(permStart);
            this.documentHelper.editRanges.add(name, newEditStartCollection);
        }
    }
    private parseChartTitleArea(titleArea: any, chartTitleArea: ChartTitleArea): void {
        chartTitleArea.chartfontName = titleArea[fontNameProperty[this.keywordIndex]];
        chartTitleArea.chartFontSize = titleArea[fontSizeProperty[this.keywordIndex]];
        this.parseChartDataFormat(titleArea[dataFormatProperty[this.keywordIndex]], chartTitleArea.dataFormat);
        this.parseChartLayout(titleArea[layoutProperty[this.keywordIndex]], chartTitleArea.layout);

    }
    private parseChartDataFormat(format: any, dataFormat: ChartDataFormat): void {
        dataFormat.fill.color = format[fillProperty[this.keywordIndex]][foreColorProperty[this.keywordIndex]];
        dataFormat.fill.rgb = format[fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]];
        dataFormat.line.color = format[lineProperty[this.keywordIndex]][colorProperty[this.keywordIndex]];
        dataFormat.line.rgb = format[lineProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]];
    }
    private parseChartLayout(layout: any, chartLayout: ChartLayout): void {
        chartLayout.chartLayoutLeft = layout[layoutXProperty[this.keywordIndex]];
        chartLayout.chartLayoutTop = layout[layoutYProperty[this.keywordIndex]];
    }
    private parseChartLegend(legend: any, chartLegend: ChartLegend): void {
        chartLegend.chartLegendPostion = legend[positionProperty[this.keywordIndex]];
        this.parseChartTitleArea(legend[chartTitleAreaProperty[this.keywordIndex]], chartLegend.chartTitleArea);
    }
    private parseChartCategoryAxis(categoryAxis: any, primaryAxis: ChartCategoryAxis): void {
        primaryAxis.categoryAxisType = categoryAxis[categoryTypeProperty[this.keywordIndex]];
        primaryAxis.categoryNumberFormat = categoryAxis[numberFormatProperty[this.keywordIndex]];
        primaryAxis.interval = categoryAxis[majorUnitProperty[this.keywordIndex]];
        primaryAxis.axisFontSize = categoryAxis[fontSizeProperty[this.keywordIndex]];
        primaryAxis.axisFontName = categoryAxis[fontNameProperty[this.keywordIndex]];
        primaryAxis.max = categoryAxis[maximumValueProperty[this.keywordIndex]];
        primaryAxis.min = categoryAxis[minimumValueProperty[this.keywordIndex]];
        primaryAxis.majorGridLines = HelperMethods.parseBoolValue(categoryAxis[hasMajorGridLinesProperty[this.keywordIndex]]);
        primaryAxis.minorGridLines = HelperMethods.parseBoolValue(categoryAxis[hasMinorGridLinesProperty[this.keywordIndex]]);
        primaryAxis.majorTick = categoryAxis[majorTickMarkProperty[this.keywordIndex]];
        primaryAxis.minorTick = categoryAxis[minorTickMarkProperty[this.keywordIndex]];
        primaryAxis.tickPosition = categoryAxis[tickLabelPositionProperty[this.keywordIndex]];
        primaryAxis.categoryAxisTitle = categoryAxis[chartTitleProperty[this.keywordIndex]];
        if (categoryAxis[chartTitleProperty[this.keywordIndex]] != null) {
            this.parseChartTitleArea(categoryAxis[chartTitleAreaProperty[this.keywordIndex]], primaryAxis.chartTitleArea);
        }
    }
    private parseChartDataTable(dataTable: any, chartDataTable: ChartDataTable): void {
        chartDataTable.showSeriesKeys = HelperMethods.parseBoolValue(dataTable[showSeriesKeysProperty[this.keywordIndex]]);
        chartDataTable.hasHorzBorder = HelperMethods.parseBoolValue(dataTable[hasHorizontalBorderProperty[this.keywordIndex]]);
        chartDataTable.hasVertBorder = HelperMethods.parseBoolValue(dataTable[hasVerticalBorderProperty[this.keywordIndex]]);
        chartDataTable.hasBorders = HelperMethods.parseBoolValue(dataTable[hasBordersProperty[this.keywordIndex]]);
    }
    private parseChartArea(area: any, chartArea: ChartArea): void {
        chartArea.chartForeColor = area[foreColorProperty[this.keywordIndex]];
    }
    private parseChartData(inline: any, chart: ChartElementBox): void {
        for (let i: number = 0; i < inline[chartCategoryProperty[this.keywordIndex]].length; i++) {
            let chartCategory: ChartCategory = new ChartCategory();
            let xData: any = inline[chartCategoryProperty[this.keywordIndex]][i];
            if (xData.hasOwnProperty(categoryXNameProperty[this.keywordIndex])) {
                chartCategory.xName = xData[categoryXNameProperty[this.keywordIndex]];
            }
            for (let j: number = 0; j < xData[chartDataProperty[this.keywordIndex]].length; j++) {
                let chartData: ChartData = new ChartData();
                let yData: any = xData[chartDataProperty[this.keywordIndex]][j];
                chartData.yAxisValue = yData[yValueProperty[this.keywordIndex]];
                if (inline[chartTypeProperty[this.keywordIndex]] === 'Bubble') {
                    chartData.bubbleSize = yData[sizeProperty[this.keywordIndex]];
                }
                chartCategory.chartData.push(chartData);
            }
            chart.chartCategory.push(chartCategory);
        }
        this.parseChartSeries(inline, chart);
    }
    private parseChartSeries(inline: any, chart: ChartElementBox): void {
        let chartType: string = inline[chartTypeProperty[this.keywordIndex]];
        let isPieType: boolean = (chartType === 'Pie' || chartType === 'Doughnut');
        for (let i: number = 0; i < inline[chartSeriesProperty[this.keywordIndex]].length; i++) {
            let chartSeries: ChartSeries = new ChartSeries();
            let xData: any = inline[chartSeriesProperty[this.keywordIndex]][i];
            if (xData.hasOwnProperty(seriesNameProperty[this.keywordIndex])) {
                chartSeries.seriesName = xData[seriesNameProperty[this.keywordIndex]];
                if (isPieType) {
                    if (xData.hasOwnProperty(firstSliceAngleProperty[this.keywordIndex])) {
                        chartSeries.firstSliceAngle = xData[firstSliceAngleProperty[this.keywordIndex]];
                    }
                    if (chartType === 'Doughnut') {
                        chartSeries.doughnutHoleSize = xData[holeSizeProperty[this.keywordIndex]];
                    }
                }
                if (xData.hasOwnProperty(dataLabelProperty[this.keywordIndex])) {
                    this.parseChartDataLabels(xData[dataLabelProperty[this.keywordIndex]], chartSeries);
                }
                if (xData.hasOwnProperty(seriesFormatProperty[this.keywordIndex])) {
                    let seriesFormat: ChartSeriesFormat = new ChartSeriesFormat();
                    let format: any = xData[seriesFormatProperty[this.keywordIndex]];
                    seriesFormat.markerStyle = format[markerStyleProperty[this.keywordIndex]];
                    seriesFormat.markerColor = format[markerColorProperty[this.keywordIndex]];
                    seriesFormat.numberValue = format[markerSizeProperty[this.keywordIndex]];
                    chartSeries.seriesFormat = seriesFormat;
                }
                if (xData.hasOwnProperty(errorBarProperty[this.keywordIndex])) {
                    let errorBar: any = chartSeries.errorBar;
                    errorBar.errorType = xData[errorBarProperty[this.keywordIndex]][typeProperty[this.keywordIndex]];
                    errorBar.errorDirection = xData[errorBarProperty[this.keywordIndex]][directionProperty[this.keywordIndex]];
                    errorBar.errorEndStyle = xData[errorBarProperty[this.keywordIndex]][endStyleProperty[this.keywordIndex]];
                    errorBar.numberValue = xData[errorBarProperty[this.keywordIndex]][numberValueProperty[this.keywordIndex]];
                }
                if (xData.hasOwnProperty(trendLinesProperty[this.keywordIndex])) {
                    this.parseChartTrendLines(xData[trendLinesProperty[this.keywordIndex]], chartSeries);
                }
                this.parseChartSeriesDataPoints(xData[dataPointsProperty[this.keywordIndex]], chartSeries);
            }
            chart.chartSeries.push(chartSeries);
        }
    }
    private parseChartDataLabels(dataLabels: any, series: ChartSeries): void {
        let dataLabel: ChartDataLabels = new ChartDataLabels();
        dataLabel.labelPosition = dataLabels[positionProperty[this.keywordIndex]];
        dataLabel.fontName = dataLabels[fontNameProperty[this.keywordIndex]];
        dataLabel.fontColor = dataLabels[fontColorProperty[this.keywordIndex]];
        dataLabel.fontSize = dataLabels[fontSizeProperty[this.keywordIndex]];
        dataLabel.isLegendKey = HelperMethods.parseBoolValue(dataLabels[isLegendKeyProperty[this.keywordIndex]]);
        dataLabel.isBubbleSize = HelperMethods.parseBoolValue(dataLabels[isBubbleSizeProperty[this.keywordIndex]]);
        dataLabel.isCategoryName = HelperMethods.parseBoolValue(dataLabels[isCategoryNameProperty[this.keywordIndex]]);
        dataLabel.isSeriesName = HelperMethods.parseBoolValue(dataLabels[isSeriesNameProperty[this.keywordIndex]]);
        dataLabel.isValue = HelperMethods.parseBoolValue(dataLabels[isValueProperty[this.keywordIndex]]);
        dataLabel.isPercentage = HelperMethods.parseBoolValue(dataLabels[isPercentageProperty[this.keywordIndex]]);
        dataLabel.isLeaderLines = HelperMethods.parseBoolValue(dataLabels[isLeaderLinesProperty[this.keywordIndex]]);
        series.dataLabels = dataLabel;
    }
    private parseChartSeriesDataPoints(dataPoints: any, series: ChartSeries): void {
        for (let i: number = 0; i < dataPoints.length; i++) {
            let chartFormat: ChartDataFormat = new ChartDataFormat();
            this.parseChartDataFormat(dataPoints[i], chartFormat);
            series.chartDataFormat.push(chartFormat);
        }
    }
    private parseChartTrendLines(trendLines: any, series: ChartSeries): void {
        for (let i: number = 0; i < trendLines.length; i++) {
            let data: any = trendLines[i];
            let trendLine: ChartTrendLines = new ChartTrendLines();
            trendLine.trendLineName = data[nameProperty[this.keywordIndex]];
            trendLine.trendLineType = data[typeProperty[this.keywordIndex]];
            trendLine.forwardValue = data[forwardProperty[this.keywordIndex]];
            trendLine.backwardValue = data[backwardProperty[this.keywordIndex]];
            trendLine.interceptValue = data[interceptProperty[this.keywordIndex]];
            trendLine.isDisplayEquation = HelperMethods.parseBoolValue(data[isDisplayEquationProperty[this.keywordIndex]]);
            trendLine.isDisplayRSquared = HelperMethods.parseBoolValue(data[isDisplayRSquaredProperty[this.keywordIndex]]);
            series.trendLines.push(trendLine);
        }
    }
    /**
     * @private
     */
    public parseTableFormat(sourceFormat: any, tableFormat: WTableFormat, keywordIndex: number): void {
        this.parseBorders(keywordIndex, sourceFormat[bordersProperty[keywordIndex]], tableFormat.borders);
        if (!isNullOrUndefined(sourceFormat[allowAutoFitProperty[keywordIndex]])) {
            tableFormat.allowAutoFit = HelperMethods.parseBoolValue(sourceFormat[allowAutoFitProperty[keywordIndex]]);
        }
        if (!isNullOrUndefined(sourceFormat[cellSpacingProperty[keywordIndex]])) {
            tableFormat.cellSpacing = sourceFormat[cellSpacingProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[leftMarginProperty[keywordIndex]])) {
            tableFormat.leftMargin = sourceFormat[leftMarginProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[topMarginProperty[keywordIndex]])) {
            tableFormat.topMargin = sourceFormat[topMarginProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[rightMarginProperty[keywordIndex]])) {
            tableFormat.rightMargin = sourceFormat[rightMarginProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[bottomMarginProperty[keywordIndex]])) {
            tableFormat.bottomMargin = sourceFormat[bottomMarginProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[leftIndentProperty[keywordIndex]])) {
            tableFormat.leftIndent = sourceFormat[leftIndentProperty[keywordIndex]];
        }
        this.parseShading(sourceFormat[shadingProperty[keywordIndex]], tableFormat.shading, keywordIndex);
        if (!isNullOrUndefined(sourceFormat[tableAlignmentProperty[keywordIndex]])) {
            tableFormat.tableAlignment = this.getTableAlignment(sourceFormat[tableAlignmentProperty[keywordIndex]]);
        }
        if (!isNullOrUndefined(sourceFormat[preferredWidthProperty[keywordIndex]])) {
            tableFormat.preferredWidth = sourceFormat[preferredWidthProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[preferredWidthTypeProperty[keywordIndex]])) {
            tableFormat.preferredWidthType = this.getWidthType(sourceFormat[preferredWidthTypeProperty[keywordIndex]]);
        }
        if (!isNullOrUndefined(sourceFormat[bidiProperty[keywordIndex]])) {
            tableFormat.bidi = HelperMethods.parseBoolValue(sourceFormat[bidiProperty[keywordIndex]]);
        }
        if (!isNullOrUndefined(sourceFormat[horizontalPositionAbsProperty[keywordIndex]])) {
            tableFormat.horizontalPositionAbs = this.getHorizontalPositionAbs(sourceFormat[horizontalPositionAbsProperty[keywordIndex]]);
        }
        if (!isNullOrUndefined(sourceFormat[horizontalPositionProperty[keywordIndex]])) {
            tableFormat.horizontalPosition = sourceFormat[horizontalPositionProperty[keywordIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[styleNameProperty[keywordIndex]])) {
            tableFormat.styleName = sourceFormat[styleNameProperty[keywordIndex]];
        }
    }
    /**
     * @private
     */
    public parseCellFormat(sourceFormat: any, cellFormat: WCellFormat, keyIndex: number): void {
        if (!isNullOrUndefined(sourceFormat)) {
            this.parseBorders(keyIndex, sourceFormat[bordersProperty[keyIndex]], cellFormat.borders);
            if (!sourceFormat.isSamePaddingAsTable) {
                //    cellFormat.ClearMargins();
                //else
                this.parseCellMargin(sourceFormat, cellFormat, keyIndex);
            }
            if (!isNullOrUndefined(sourceFormat[cellWidthProperty[keyIndex]])) {
                cellFormat.cellWidth = sourceFormat[cellWidthProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[columnSpanProperty[keyIndex]])) {
                cellFormat.columnSpan = sourceFormat[columnSpanProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[rowSpanProperty[keyIndex]])) {
                cellFormat.rowSpan = sourceFormat[rowSpanProperty[keyIndex]];
            }
            this.parseShading(sourceFormat[shadingProperty[keyIndex]], cellFormat.shading, keyIndex);
            if (!isNullOrUndefined(sourceFormat[verticalAlignmentProperty[keyIndex]])) {
                cellFormat.verticalAlignment = this.getCellVerticalAlignment(sourceFormat[verticalAlignmentProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[preferredWidthTypeProperty[keyIndex]])) {
                cellFormat.preferredWidthType = this.getWidthType(sourceFormat[preferredWidthTypeProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[preferredWidthProperty[keyIndex]])) {
                cellFormat.preferredWidth = sourceFormat[preferredWidthProperty[keyIndex]];
            }
        }
    }
    private parseCellMargin(sourceFormat: any, cellFormat: WCellFormat, keyIndex: number): void {
        if (!isNullOrUndefined(sourceFormat[leftMarginProperty[keyIndex]])) {
            cellFormat.leftMargin = sourceFormat[leftMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[rightMarginProperty[keyIndex]])) {
            cellFormat.rightMargin = sourceFormat[rightMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[topMarginProperty[keyIndex]])) {
            cellFormat.topMargin = sourceFormat[topMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(sourceFormat[bottomMarginProperty[keyIndex]])) {
            cellFormat.bottomMargin = sourceFormat[bottomMarginProperty[keyIndex]];
        }
    }
    /**
     * @private
     */
    public parseRowFormat(sourceFormat: any, rowFormat: WRowFormat, keyIndex: number): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (!isNullOrUndefined(sourceFormat[allowBreakAcrossPagesProperty[keyIndex]])) {
                rowFormat.allowBreakAcrossPages = HelperMethods.parseBoolValue(sourceFormat[allowBreakAcrossPagesProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[isHeaderProperty[keyIndex]])) {
                rowFormat.isHeader = HelperMethods.parseBoolValue(sourceFormat[isHeaderProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[heightTypeProperty[keyIndex]])) {
                rowFormat.heightType = this.getHeightType(sourceFormat[heightTypeProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[heightProperty[keyIndex]])) {
                rowFormat.height = sourceFormat[heightProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[leftMarginProperty[keyIndex]])) {
                rowFormat.leftMargin = sourceFormat[leftMarginProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[topMarginProperty[keyIndex]])) {
                rowFormat.topMargin = sourceFormat[topMarginProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[rightMarginProperty[keyIndex]])) {
                rowFormat.rightMargin = sourceFormat[rightMarginProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[bottomMarginProperty[keyIndex]])) {
                rowFormat.bottomMargin = sourceFormat[bottomMarginProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[leftIndentProperty[keyIndex]])) {
                rowFormat.leftIndent = sourceFormat[leftIndentProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[revisionIdsProperty[keyIndex]]) && sourceFormat[revisionIdsProperty[keyIndex]].length > 0) {
                this.checkAndApplyRevision(keyIndex, sourceFormat, rowFormat);
            }
            this.parseBorders(keyIndex, sourceFormat[bordersProperty[keyIndex]], rowFormat.borders);
        }
    }
    private parseBorders(keyIndex: number, sourceBorders: any, destBorder: WBorders): void {
        if (!isNullOrUndefined(sourceBorders)) {
            destBorder.isParsing=true;
            this.parseBorder(keyIndex, sourceBorders[leftProperty[keyIndex]], destBorder.left);
            this.parseBorder(keyIndex, sourceBorders[rightProperty[keyIndex]], destBorder.right);
            this.parseBorder(keyIndex, sourceBorders[topProperty[keyIndex]], destBorder.top);
            this.parseBorder(keyIndex, sourceBorders[bottomProperty[keyIndex]], destBorder.bottom);
            this.parseBorder(keyIndex, sourceBorders[verticalProperty[keyIndex]], destBorder.vertical);
            this.parseBorder(keyIndex, sourceBorders[horizontalProperty[keyIndex]], destBorder.horizontal);
            this.parseBorder(keyIndex, sourceBorders[diagonalDownProperty[keyIndex]], destBorder.diagonalDown);
            this.parseBorder(keyIndex, sourceBorders[diagonalUpProperty[keyIndex]], destBorder.diagonalUp);
            destBorder.isParsing=false;
        }
    }
    private parseBorder(keyIndex: number, sourceBorder: any, destBorder: WBorder): void {
        if (!isNullOrUndefined(sourceBorder)) {
            if (!isNullOrUndefined(sourceBorder[colorProperty[keyIndex]])) {
                destBorder.color = this.getColor(sourceBorder[colorProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceBorder[lineStyleProperty[keyIndex]])) {
                destBorder.lineStyle = this.getLineStyle(sourceBorder[lineStyleProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceBorder[lineWidthProperty[keyIndex]])) {
                destBorder.lineWidth = sourceBorder[lineWidthProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceBorder[hasNoneStyleProperty[keyIndex]])) {
                destBorder.hasNoneStyle = HelperMethods.parseBoolValue(sourceBorder[hasNoneStyleProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceBorder[spaceProperty[keyIndex]])) {
                destBorder.space = sourceBorder[spaceProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceBorder[shadowProperty[keyIndex]])) {
                destBorder.shadow = HelperMethods.parseBoolValue(sourceBorder[shadowProperty[keyIndex]]);
            }
        }
    }
    private parseShading(sourceShading: any, destShading: WShading, keyIndex: number): void {
        if (!isNullOrUndefined(sourceShading)) {
            if (!isNullOrUndefined(sourceShading[backgroundColorProperty[keyIndex]])) {
                destShading.backgroundColor = this.getColor(sourceShading[backgroundColorProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceShading[foregroundColorProperty[keyIndex]])) {
                destShading.foregroundColor = this.getColor(sourceShading[foregroundColorProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceShading[textureProperty[keyIndex]]) || !isNullOrUndefined(sourceShading.textureStyle)) {
                destShading.textureStyle = !isNullOrUndefined(sourceShading[textureProperty[keyIndex]]) ? this.getTextureStyle(sourceShading[textureProperty[keyIndex]]) : this.getTextureStyle(sourceShading.textureStyle);
            }
        }
    }
    /**
     * @private
     */
    public parseCharacterFormat(keyIndex: number, sourceFormat: any, characterFormat: WCharacterFormat, writeInlineFormat?: boolean): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (writeInlineFormat && sourceFormat.hasOwnProperty(inlineFormatProperty[keyIndex])) {
                this.parseCharacterFormat(keyIndex, sourceFormat.inlineFormat, characterFormat);
                return;
            }
            if (!isNullOrUndefined(sourceFormat[baselineAlignmentProperty[keyIndex]])) {
                characterFormat.baselineAlignment = this.getBaseAlignment(sourceFormat[baselineAlignmentProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[underlineProperty[keyIndex]])) {
                characterFormat.underline = this.getUnderline(sourceFormat[underlineProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[strikethroughProperty[keyIndex]])) {
                characterFormat.strikethrough = this.getStrikethrough(sourceFormat[strikethroughProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[fontSizeProperty[keyIndex]])) {
                sourceFormat[fontSizeProperty[keyIndex]] = parseFloat(sourceFormat[fontSizeProperty[keyIndex]]);
                let number: number = sourceFormat[fontSizeProperty[keyIndex]] * 10;
                if (number % 10 !== 0) {
                    number = sourceFormat[fontSizeProperty[keyIndex]].toFixed(1) * 10;
                    //to check worst case scenerio like 8.2 or 8.7 like these to round off
                    if (number % 5 === 0) {
                        sourceFormat[fontSizeProperty[keyIndex]] = sourceFormat[fontSizeProperty[keyIndex]].toFixed(1);
                    } else {
                        sourceFormat[fontSizeProperty[keyIndex]] = Math.round(sourceFormat[fontSizeProperty[keyIndex]]);
                    }
                }
                let fontSize: number = parseFloat(sourceFormat[fontSizeProperty[keyIndex]]);
                characterFormat.fontSize = fontSize < 0 ? 0 : fontSize;
            }
            if (!isNullOrUndefined(sourceFormat[fontFamilyProperty[keyIndex]])) {
                if (sourceFormat[fontFamilyProperty[keyIndex]].indexOf('"') !== -1) {
                    sourceFormat[fontFamilyProperty[keyIndex]] = sourceFormat[fontFamilyProperty[keyIndex]].replace('"', '');
                }
                characterFormat.fontFamily = sourceFormat[fontFamilyProperty[keyIndex]];
                if (isNullOrUndefined(sourceFormat[fontFamilyFarEastProperty[keyIndex]])) {
                    characterFormat.fontFamilyFarEast = sourceFormat[fontFamilyProperty[keyIndex]];
                }
                if (isNullOrUndefined(sourceFormat[fontFamilyAsciiProperty[keyIndex]])) {
                    characterFormat.fontFamilyAscii = sourceFormat[fontFamilyProperty[keyIndex]];
                }
                if (isNullOrUndefined(sourceFormat[fontFamilyNonFarEastProperty[keyIndex]])) {
                    characterFormat.fontFamilyNonFarEast = sourceFormat[fontFamilyProperty[keyIndex]];
                }
            }
            if (!isNullOrUndefined(sourceFormat[boldProperty[keyIndex]])) {
                characterFormat.bold = HelperMethods.parseBoolValue(sourceFormat[boldProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[italicProperty[keyIndex]])) {
                characterFormat.italic = HelperMethods.parseBoolValue(sourceFormat[italicProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[highlightColorProperty[keyIndex]])) {
                characterFormat.highlightColor = this.getHighlightColor(sourceFormat[highlightColorProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[fontColorProperty[keyIndex]])) {
                characterFormat.fontColor = this.getColor(sourceFormat[fontColorProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[bidiProperty[keyIndex]])) {
                characterFormat.bidi = HelperMethods.parseBoolValue(sourceFormat[bidiProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[bdoProperty[keyIndex]])) {
                characterFormat.bdo = this.getBiDirectionalOverride(sourceFormat[bdoProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[fontSizeBidiProperty[keyIndex]])) {
                characterFormat.fontSizeBidi = sourceFormat[fontSizeBidiProperty[keyIndex]] < 0 ? 0 : sourceFormat[fontSizeBidiProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[fontFamilyBidiProperty[keyIndex]])) {
                if (sourceFormat[fontFamilyBidiProperty[keyIndex]].indexOf('"') !== -1) {
                    sourceFormat[fontFamilyBidiProperty[keyIndex]] = sourceFormat[fontFamilyBidiProperty[keyIndex]].replace('"', '');
                }
                characterFormat.fontFamilyBidi = sourceFormat[fontFamilyBidiProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[boldBidiProperty[keyIndex]])) {
                characterFormat.boldBidi = HelperMethods.parseBoolValue(sourceFormat[boldBidiProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[italicBidiProperty[keyIndex]])) {
                characterFormat.italicBidi = HelperMethods.parseBoolValue(sourceFormat[italicBidiProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[revisionIdsProperty[keyIndex]]) && sourceFormat[revisionIdsProperty[keyIndex]].length > 0) {
                this.checkAndApplyRevision(keyIndex, sourceFormat, characterFormat);
            }
            if (!isNullOrUndefined(sourceFormat[allCapsProperty[keyIndex]])) {
                characterFormat.allCaps = HelperMethods.parseBoolValue(sourceFormat[allCapsProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[localeIdBidiProperty[keyIndex]])) {
                characterFormat.localeIdBidi = sourceFormat[localeIdBidiProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[localeIdProperty[keyIndex]])) {
                characterFormat.localeIdAscii = sourceFormat[localeIdProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[localeIdFarEastProperty[keyIndex]])) {
                characterFormat.localeIdFarEast = sourceFormat[localeIdFarEastProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[complexScriptProperty[keyIndex]])) {
                characterFormat.complexScript = HelperMethods.parseBoolValue(sourceFormat[complexScriptProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[fontFamilyFarEastProperty[keyIndex]])) {
                if (sourceFormat[fontFamilyFarEastProperty[keyIndex]].indexOf('"') !== -1) {
                    sourceFormat[fontFamilyFarEastProperty[keyIndex]] = sourceFormat[fontFamilyFarEastProperty[keyIndex]].replace('"', '');
                }
                characterFormat.fontFamilyFarEast = sourceFormat[fontFamilyFarEastProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[fontFamilyAsciiProperty[keyIndex]])) {
                if (sourceFormat[fontFamilyAsciiProperty[keyIndex]].indexOf('"') !== -1) {
                    sourceFormat[fontFamilyAsciiProperty[keyIndex]] = sourceFormat[fontFamilyAsciiProperty[keyIndex]].replace('"', '');
                }
                characterFormat.fontFamilyAscii = sourceFormat[fontFamilyAsciiProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[fontFamilyNonFarEastProperty[keyIndex]])) {
                if (sourceFormat[fontFamilyNonFarEastProperty[keyIndex]].indexOf('"') !== -1) {
                    sourceFormat[fontFamilyNonFarEastProperty[keyIndex]] = sourceFormat[fontFamilyNonFarEastProperty[keyIndex]].replace('"', '');
                }
                characterFormat.fontFamilyNonFarEast = sourceFormat[fontFamilyNonFarEastProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[characterSpacingProperty[keyIndex]])) {
                characterFormat.characterSpacing = sourceFormat[characterSpacingProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[scalingProperty[keyIndex]])) {
                characterFormat.scaling = sourceFormat[scalingProperty[keyIndex]];
            }
        }
    }
    private getColor(color: string): string {
        let convertColor: string = color;
        return convertColor || '#ffffff';
    }
    public parseThemes(sourceFormat: any, themes: Themes): void {
        this.parseFontScheme(sourceFormat[fontSchemeProperty[this.keywordIndex]], themes);
    }
    public parseFontScheme(sourceFormat: any, themes: Themes): void {
        if (!isNullOrUndefined(sourceFormat[fontSchemeNameProperty[this.keywordIndex]]))
            themes.fontScheme.fontSchemeName = sourceFormat[fontSchemeNameProperty[this.keywordIndex]];
        if (!isNullOrUndefined(sourceFormat[majorFontSchemeProperty[this.keywordIndex]])) {
            this.parseMajorMinorFontScheme(sourceFormat[majorFontSchemeProperty[this.keywordIndex]], themes.fontScheme.majorFontScheme);
        }
        if (!isNullOrUndefined(sourceFormat[minorFontSchemeProperty[this.keywordIndex]])) {
            this.parseMajorMinorFontScheme(sourceFormat[minorFontSchemeProperty[this.keywordIndex]], themes.fontScheme.minorFontScheme);
        }
    }
    public parseMajorMinorFontScheme(sourceFormat: any, majorMinor: MajorMinorFontScheme): void {
        if (!isNullOrUndefined(sourceFormat[fontTypefaceProperty[this.keywordIndex]]) && Object.keys(sourceFormat[fontTypefaceProperty[this.keywordIndex]]).length > 0) {
            let keys: string[] = Object.keys(sourceFormat[fontTypefaceProperty[this.keywordIndex]]);
            for (let key of keys) {
                majorMinor.fontTypeface.add(key, sourceFormat[fontTypefaceProperty[this.keywordIndex]][key]);
            }
            this.documentHelper.hasThemes = true;
        }
        if (!isNullOrUndefined(sourceFormat[fontSchemeListProperty[this.keywordIndex]]) && sourceFormat[fontSchemeListProperty[this.keywordIndex]].length > 0) {
            for (let j: number = 0; j < sourceFormat[fontSchemeListProperty[this.keywordIndex]].length; j++) {
                let data: any = sourceFormat[fontSchemeListProperty[this.keywordIndex]][j];
                let fontList: FontSchemeStruct = new FontSchemeStruct();
                fontList.name = !isNullOrUndefined(data.fontName)? data[fontNameProperty[this.keywordIndex]] : data[nameProperty[this.keywordIndex]];
                fontList.typeface = !isNullOrUndefined(data.fontTypeface)? data.fontTypeface : data[typefaceProperty[this.keywordIndex]];
                fontList.panose = !isNullOrUndefined(data.pnose)? data.pnose : data[panoseProperty[this.keywordIndex]];
                majorMinor.fontSchemeList.push(fontList);
            }
            this.documentHelper.hasThemes = true;
        }
    }
    public parseParagraphFormat(keyIndex: number, sourceFormat: any, paragraphFormat: WParagraphFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (!isNullOrUndefined(sourceFormat[bordersProperty[keyIndex]])) {
                this.parseBorders(keyIndex, sourceFormat[bordersProperty[keyIndex]], paragraphFormat.borders);
            }
            if (!isNullOrUndefined(sourceFormat[bidiProperty[keyIndex]])) {
                paragraphFormat.bidi = HelperMethods.parseBoolValue(sourceFormat[bidiProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[leftIndentProperty[keyIndex]])) {
                paragraphFormat.leftIndent = sourceFormat[leftIndentProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[rightIndentProperty[keyIndex]])) {
                paragraphFormat.rightIndent = sourceFormat[rightIndentProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[firstLineIndentProperty[keyIndex]])) {
                paragraphFormat.firstLineIndent = sourceFormat[firstLineIndentProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[afterSpacingProperty[keyIndex]])) {
                paragraphFormat.afterSpacing = sourceFormat[afterSpacingProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[beforeSpacingProperty[keyIndex]])) {
                paragraphFormat.beforeSpacing = sourceFormat[beforeSpacingProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[spaceBeforeAutoProperty[keyIndex]])) {
                paragraphFormat.spaceBeforeAuto = HelperMethods.parseBoolValue(sourceFormat[spaceBeforeAutoProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[spaceAfterAutoProperty[keyIndex]])) {
                paragraphFormat.spaceAfterAuto = HelperMethods.parseBoolValue(sourceFormat[spaceAfterAutoProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[lineSpacingProperty[keyIndex]])) {
                paragraphFormat.lineSpacing = sourceFormat[lineSpacingProperty[keyIndex]];
            }
            if (!isNullOrUndefined(sourceFormat[lineSpacingTypeProperty[keyIndex]])) {
                paragraphFormat.lineSpacingType = this.getLineSpacingType(sourceFormat[lineSpacingTypeProperty[keyIndex]]);
            } else {
                if (!isNullOrUndefined(sourceFormat[lineSpacingProperty[keyIndex]])) {
                    paragraphFormat.lineSpacingType = 'Multiple'
                }
            }
            if (!isNullOrUndefined(sourceFormat[textAlignmentProperty[keyIndex]])) {
                paragraphFormat.textAlignment = this.getTextAlignment(sourceFormat[textAlignmentProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[outlineLevelProperty[keyIndex]])) {
                paragraphFormat.outlineLevel = this.getOutlineLevel(sourceFormat[outlineLevelProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[contextualSpacingProperty[keyIndex]])) {
                paragraphFormat.contextualSpacing = HelperMethods.parseBoolValue(sourceFormat[contextualSpacingProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[keepWithNextProperty[keyIndex]])) {
                paragraphFormat.keepWithNext = HelperMethods.parseBoolValue(sourceFormat[keepWithNextProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[keepLinesTogetherProperty[keyIndex]])) {
                paragraphFormat.keepLinesTogether = HelperMethods.parseBoolValue(sourceFormat[keepLinesTogetherProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(sourceFormat[widowControlProperty[keyIndex]])) {
                paragraphFormat.widowControl = HelperMethods.parseBoolValue(sourceFormat[widowControlProperty[keyIndex]]);
            }
            paragraphFormat.listFormat = new WListFormat(paragraphFormat);
            if (sourceFormat.hasOwnProperty(listFormatProperty[keyIndex])) {
                this.parseListFormat(keyIndex, sourceFormat, paragraphFormat.listFormat);
            }
            if (sourceFormat.hasOwnProperty(tabsProperty[keyIndex])) {
                this.parseTabStop(keyIndex, sourceFormat[tabsProperty[keyIndex]], paragraphFormat.tabs);
            }
        }
    }
    private parseListFormat(keyIndex: number, block: any, listFormat: WListFormat): void {
        if (!isNullOrUndefined(block[listFormatProperty[keyIndex]])) {
            if (!isNullOrUndefined(block[listFormatProperty[keyIndex]][listIdProperty[keyIndex]])) {
                listFormat.listId = block[listFormatProperty[keyIndex]][listIdProperty[keyIndex]];
                listFormat.list = this.documentHelper.getListById(block[listFormatProperty[keyIndex]][listIdProperty[keyIndex]]);
            }
            if (!isNullOrUndefined(block[listFormatProperty[keyIndex]][nsidProperty])) {
                listFormat.nsid = block[listFormatProperty[keyIndex]][nsidProperty];
            } else if (!isNullOrUndefined(listFormat.list)) {
                // Backward compatibility
                listFormat.nsid = listFormat.list.nsid;
            }
            if (!isNullOrUndefined(block[listFormatProperty[keyIndex]][listLevelNumberProperty[keyIndex]])) {
                listFormat.listLevelNumber = block[listFormatProperty[keyIndex]][listLevelNumberProperty[keyIndex]];
            }
        }
    }
    public parseSectionFormat(keyIndex: number, data: any, sectionFormat: WSectionFormat): void {
        if (!isNullOrUndefined(data[pageWidthProperty[keyIndex]])) {
            sectionFormat.pageWidth = data[pageWidthProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[pageHeightProperty[keyIndex]])) {
            sectionFormat.pageHeight = data[pageHeightProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[leftMarginProperty[keyIndex]])) {
            sectionFormat.leftMargin = data[leftMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[topMarginProperty[keyIndex]])) {
            sectionFormat.topMargin = data[topMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[rightMarginProperty[keyIndex]])) {
            sectionFormat.rightMargin = data[rightMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[bottomMarginProperty[keyIndex]])) {
            sectionFormat.bottomMargin = data[bottomMarginProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[headerDistanceProperty[keyIndex]])) {
            sectionFormat.headerDistance = data[headerDistanceProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[footerDistanceProperty[keyIndex]])) {
            sectionFormat.footerDistance = data[footerDistanceProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[differentFirstPageProperty[keyIndex]])) {
            sectionFormat.differentFirstPage = HelperMethods.parseBoolValue(data[differentFirstPageProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[differentOddAndEvenPagesProperty[keyIndex]])) {
            sectionFormat.differentOddAndEvenPages = HelperMethods.parseBoolValue(data[differentOddAndEvenPagesProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[bidiProperty[keyIndex]])) {
            sectionFormat.bidi = HelperMethods.parseBoolValue(data[bidiProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[restartPageNumberingProperty[keyIndex]])) {
            sectionFormat.restartPageNumbering = HelperMethods.parseBoolValue(data[restartPageNumberingProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[pageStartingNumberProperty[keyIndex]])) {
            sectionFormat.pageStartingNumber = data[pageStartingNumberProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[endnoteNumberFormatProperty[keyIndex]])) {
            sectionFormat.endnoteNumberFormat = this.getFootEndNoteNumberFormat(data[endnoteNumberFormatProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[footNoteNumberFormatProperty[keyIndex]])) {
            sectionFormat.footNoteNumberFormat = this.getFootEndNoteNumberFormat(data[footNoteNumberFormatProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[restartIndexForFootnotesProperty[keyIndex]])) {
            sectionFormat.restartIndexForFootnotes = this.getFootnoteRestartIndex(data[restartIndexForFootnotesProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[restartIndexForEndnotesProperty[keyIndex]])) {
            sectionFormat.restartIndexForEndnotes = this.getFootnoteRestartIndex(data[restartIndexForEndnotesProperty[keyIndex]]);
        }
        if (!isNullOrUndefined(data[initialFootNoteNumberProperty[keyIndex]])) {
            sectionFormat.initialFootNoteNumber = data[initialFootNoteNumberProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[initialEndNoteNumberProperty[keyIndex]])) {
            sectionFormat.initialEndNoteNumber = data[initialEndNoteNumberProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[pageNumberStyleProperty[keyIndex]])) {
            sectionFormat.pageNumberStyle = data[pageNumberStyleProperty[keyIndex]];
        }
        if (!isNullOrUndefined(data[columnsProperty[keyIndex]]) && !isNullOrUndefined(data[numberOfColumnsProperty[keyIndex]]) && data[numberOfColumnsProperty[keyIndex]] > 1) {
            sectionFormat.numberOfColumns = data[numberOfColumnsProperty[keyIndex]];
            sectionFormat.equalWidth = HelperMethods.parseBoolValue(data[equalWidthProperty[keyIndex]]);
            sectionFormat.lineBetweenColumns = HelperMethods.parseBoolValue(data[lineBetweenColumnsProperty[keyIndex]]);
            
            if (data[columnsProperty[keyIndex]]) {
                for (let i: number = 0; i < data[columnsProperty[keyIndex]].length; i++) {
                    let newCol: WColumnFormat = new WColumnFormat();
                    newCol.width = HelperMethods.convertPointToPixel(data[columnsProperty[keyIndex]][i][widthProperty[keyIndex]] as number);
                    newCol.space = HelperMethods.convertPointToPixel(data[columnsProperty[keyIndex]][i][spaceProperty[keyIndex]] as number);
                    newCol.index = i;
                    sectionFormat.columns.push(newCol);
                }
            }
        }
        if (!isNullOrUndefined(data[breakCodeProperty[keyIndex]])) {
            sectionFormat.breakCode = data[breakCodeProperty[keyIndex]];
        }
    }
    private parseColumns(wCols: any, columns: WColumnFormat[]): void {
        columns = [];
        if (wCols) {
            for (let i: number = 0; i < wCols.length; i++) {
                let newCol: WColumnFormat = new WColumnFormat();
                newCol.width = HelperMethods.convertPointToPixel(wCols[i][widthProperty[this.keywordIndex]] as number);
                newCol.space = HelperMethods.convertPointToPixel(wCols[i][spaceProperty[this.keywordIndex]] as number);
                newCol.index = i;
                columns.push(newCol);
            }
        }
    }

    private parseTabStop(keyIndex: number, wTabs: any, tabs: WTabStop[]): void {
        if (wTabs) {
            for (let i: number = 0; i < wTabs.length; i++) {
                let tabStop: WTabStop = new WTabStop();
                tabStop.position = wTabs[i][positionProperty[keyIndex]];
                tabStop.tabLeader = this.getTabLeader(wTabs[i][tabLeaderProperty[keyIndex]]);
                tabStop.deletePosition = wTabs[i][deletePositionProperty[keyIndex]];
                tabStop.tabJustification = this.getTabJustification(wTabs[i][tabJustificationProperty[keyIndex]]);
                tabs.push(tabStop);
            }
        }
    }

    private validateImageUrl(imagestr: string): boolean {
        let keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        imagestr = imagestr.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        let totalLength: number = imagestr.length * 3 / 4;
        if (imagestr.charAt(imagestr.length - 1) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (imagestr.charAt(imagestr.length - 2) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (totalLength % 1 !== 0) {
            // totalLength is not an integer, the length does not match a valid
            // base64 content. That can happen if:
            // - the imagestr is not a base64 content
            // - the imagestr is *almost* a base64 content, with a extra chars at the
            // beginning or at the end
            // - the imagestr uses a base64 variant (base64url for example)
            return false;
        }
        return true;
    }
    private containsFieldBegin(line: LineWidget): ElementBox {
        let element: ElementBox = undefined;
        for (let i: number = line.children.length - 1; i >= 0; i--) {
            element = line.children[i];
            if (element instanceof FieldElementBox && element.hasFieldEnd && element.nextElement instanceof TextElementBox) {
                return element.nextElement;
            } else if (element instanceof FieldElementBox) {
                return undefined;
            }
        }
        return element;
    }
    private getBaseAlignment(baselineAlignment: number | BaselineAlignment): BaselineAlignment {
        switch (baselineAlignment) {
            case 0:
                return 'Normal';
            case 1:
                return 'Superscript';
            case 2:
                return 'Subscript';
            default:
                return baselineAlignment as BaselineAlignment;
        }
    }
    private getUnderline(underline: number | Underline): Underline {
        switch (underline) {
            case 0:
                return 'None';
            case 1:
                return 'Single';
            case 2:
                return 'Words';
            case 3:
                return 'Double';
            case 4:
                return 'Dotted';
            case 5:
                return 'Thick';
            case 6:
                return 'Dash';
            case 7:
                return 'DashLong';
            case 8:
                return 'DotDash';
            case 9:
                return 'DotDotDash';
            case 10:
                return 'Wavy';
            case 11:
                return 'DottedHeavy';
            case 12:
                return 'DashHeavy';
            case 13:
                return 'DashLongHeavy';
            case 14:
                return 'DotDashHeavy';
            case 15:
                return 'DotDotDashHeavy';
            case 16:
                return 'WavyHeavy';
            case 17:
                return 'WavyDouble';
            default:
                return underline as Underline;
        }
    }
    private getStrikethrough(strikethrough: number | Strikethrough): Strikethrough {
        switch (strikethrough) {
            case 0:
                return 'None';
            case 1:
                return 'SingleStrike';
            case 2:
                return 'DoubleStrike';
            default:
                return strikethrough as Strikethrough;
        }
    }
    private getHighlightColor(highlightColor: number | HighlightColor): HighlightColor {
        switch (highlightColor) {
            case 0:
                return 'NoColor';
            case 1:
                return 'Yellow';
            case 2:
                return 'BrightGreen';
            case 3:
                return 'Turquoise';
            case 4:
                return 'Pink';
            case 5:
                return 'Blue';
            case 6:
                return 'Red';
            case 7:
                return 'DarkBlue';
            case 8:
                return 'Teal';
            case 9:
                return 'Green';
            case 10:
                return 'Violet';
            case 11:
                return 'DarkRed';
            case 12:
                return 'DarkYellow';
            case 13:
                return 'Gray50';
            case 14:
                return 'Gray25';
            case 15:
                return 'Black';
            default:
                return highlightColor as HighlightColor;
        }
    }
    private getLineSpacingType(lineSpacingType: number | LineSpacingType): LineSpacingType {
        switch (lineSpacingType) {
            case 0:
                return 'Multiple';
            case 1:
                return 'AtLeast';
            case 2:
                return 'Exactly';
            default:
                return lineSpacingType as LineSpacingType;
        }
    }
    private getOutlineLevel(outlineLevel: number | OutlineLevel): OutlineLevel {
        switch (outlineLevel) {
            case 0:
                return 'BodyText';
            case 1:
                return 'Level1';
            case 2:
                return 'Level2';
            case 3:
                return 'Level3';
            case 4:
                return 'Level4';
            case 5:
                return 'Level5';
            case 6:
                return 'Level6';
            case 7:
                return 'Level7';
            case 8:
                return 'Level8';
            case 9:
                return 'Level9';
            default:
                return outlineLevel as OutlineLevel;
        }
    }
    private getTextAlignment(textAlignment: number | TextAlignment): TextAlignment {
        switch (textAlignment) {
            case 0:
                return 'Left';
            case 1:
                return 'Center';
            case 2:
                return 'Right';
            case 3:
                return 'Justify';
            default:
                return textAlignment as TextAlignment;
        }
    }
    private getWidthType(widthType: number | WidthType): WidthType {
        switch (widthType) {
            case 0:
                return 'Auto';
            case 1:
                return 'Percent';
            case 2:
                return 'Point';
            default:
                return widthType as WidthType;
        }
    }
    private getTableAlignment(tableAlignment: number | TableAlignment): TableAlignment {
        switch (tableAlignment) {
            case 0:
                return 'Left';
            case 1:
                return 'Center';
            case 2:
                return 'Right';
            default:
                return tableAlignment as TableAlignment;
        }
    }
    private getLineStyle(lineStyle: number | LineStyle): LineStyle {
        switch (lineStyle) {
            case 0:
                return 'Single';
            case 1:
                return 'None';
            case 2:
                return 'Dot';
            case 3:
                return 'DashSmallGap';
            case 4:
                return 'DashLargeGap';
            case 5:
                return 'DashDot';
            case 6:
                return 'DashDotDot';
            case 7:
                return 'Double';
            case 8:
                return 'Triple';
            case 9:
                return 'ThinThickSmallGap';
            case 10:
                return 'ThickThinSmallGap';
            case 11:
                return 'ThinThickThinSmallGap';
            case 12:
                return 'ThinThickMediumGap';
            case 13:
                return 'ThickThinMediumGap';
            case 14:
                return 'ThinThickThinMediumGap';
            case 15:
                return 'ThinThickLargeGap';
            case 16:
                return 'ThickThinLargeGap';
            case 17:
                return 'ThinThickThinLargeGap';
            case 18:
                return 'SingleWavy';
            case 19:
                return 'DoubleWavy';
            case 20:
                return 'DashDotStroked';
            case 21:
                return 'Emboss3D';
            case 22:
                return 'Engrave3D';
            case 23:
                return 'Outset';
            case 24:
                return 'Inset';
            case 25:
                return 'Thick'
            case 26:
                return 'Cleared'
            default:
                return lineStyle as LineStyle;
        }
    }
    private getTextureStyle(textureStyle: number | TextureStyle): TextureStyle {
        switch (textureStyle) {
            case 0:
                return 'TextureNone';
            case 1:
                return 'Texture2Pt5Percent';
            case 2:
                return 'Texture5Percent';
            case 3:
                return 'Texture7Pt5Percent';
            case 4:
                return 'Texture10Percent';
            case 5:
                return 'Texture12Pt5Percent';
            case 6:
                return 'Texture15Percent';
            case 7:
                return 'Texture17Pt5Percent';
            case 8:
                return 'Texture20Percent';
            case 9:
                return 'Texture22Pt5Percent';
            case 10:
                return 'Texture25Percent';
            case 11:
                return 'Texture27Pt5Percent';
            case 12:
                return 'Texture30Percent';
            case 13:
                return 'Texture32Pt5Percent';
            case 14:
                return 'Texture35Percent';
            case 15:
                return 'Texture37Pt5Percent';
            case 16:
                return 'Texture40Percent';
            case 17:
                return 'Texture42Pt5Percent';
            case 18:
                return 'Texture45Percent';
            case 19:
                return 'Texture47Pt5Percent';
            case 20:
                return 'Texture50Percent';
            case 21:
                return 'Texture52Pt5Percent';
            case 22:
                return 'Texture55Percent';
            case 23:
                return 'Texture57Pt5Percent';
            case 24:
                return 'Texture60Percent';
            case 25:
                return 'Texture62Pt5Percent';
            case 26:
                return 'Texture65Percent';
            case 27:
                return 'Texture67Pt5Percent';
            case 28:
                return 'Texture70Percent';
            case 29:
                return 'Texture72Pt5Percent';
            case 30:
                return 'Texture75Percent';
            case 31:
                return 'Texture77Pt5Percent';
            case 32:
                return 'Texture80Percent';
            case 33:
                return 'Texture82Pt5Percent';
            case 34:
                return 'Texture85Percent';
            case 35:
                return 'Texture87Pt5Percent';
            case 36:
                return 'Texture90Percent';
            case 37:
                return 'Texture92Pt5Percent';
            case 38:
                return 'Texture95Percent';
            case 39:
                return 'Texture97Pt5Percent';
            case 40:
                return 'TextureSolid';
            case 41:
                return 'TextureDarkHorizontal';
            case 42:
                return 'TextureDarkVertical';
            case 43:
                return 'TextureDarkDiagonalDown';
            case 44:
                return 'TextureDarkDiagonalUp';
            case 45:
                return 'TextureDarkCross';
            case 46:
                return 'TextureDarkDiagonalCross';
            case 47:
                return 'TextureHorizontal';
            case 48:
                return 'TextureVertical';
            case 49:
                return 'TextureDiagonalDown';
            case 50:
                return 'TextureDiagonalUp';
            case 51:
                return 'TextureCross';
            case 52:
                return 'TextureDiagonalCross';
            default:
                return textureStyle as TextureStyle;
        }
    }
    private getHeightType(heightType: number | HeightType): HeightType {
        switch (heightType) {
            case 0:
                return 'AtLeast';
            case 1:
                return 'Exactly';
            default:
                return heightType as HeightType;
        }
    }
    private getCellVerticalAlignment(cellVerticalAlignment: number | CellVerticalAlignment): CellVerticalAlignment {
        switch (cellVerticalAlignment) {
            case 0:
                return 'Top';
            case 1:
                return 'Center';
            case 2:
                return 'Bottom';
            default:
                return cellVerticalAlignment as CellVerticalAlignment;
        }
    }
    private getListLevelPattern(listLevelPattern: number | ListLevelPattern): ListLevelPattern {
        switch (listLevelPattern) {
            case 0:
                return 'None';
            case 1:
                return 'Arabic';
            case 2:
                return 'UpRoman';
            case 3:
                return 'LowRoman';
            case 4:
                return 'UpLetter';
            case 5:
                return 'LowLetter';
            case 6:
                return 'Ordinal';
            case 7:
                return 'Number';
            case 8:
                return 'OrdinalText';
            case 9:
                return 'LeadingZero';
            case 10:
                return 'Bullet';
            case 11:
                return 'FarEast';
            case 12:
                return 'Special';
            default:
                return listLevelPattern as ListLevelPattern;
        }
    }
    private getFollowCharacterType(followCharacterType: number | FollowCharacterType): FollowCharacterType {
        switch (followCharacterType) {
            case 0:
                return 'Tab';
            case 1:
                return 'Space';
            case 2:
                return 'None';
            default:
                return followCharacterType as FollowCharacterType;
        }
    }
    private getStyleType(styleType: number | StyleType): StyleType {
        switch (styleType) {
            case 0:
                return 'Paragraph';
            case 1:
                return 'Character';
            default:
                return styleType as StyleType;
        }
    }
    private getProtectionType(protectionType: number | ProtectionType): ProtectionType {
        switch (protectionType) {
            case 0:
                return 'NoProtection';
            case 1:
                return 'ReadOnly';
            case 2:
                return 'FormFieldsOnly';
            case 3:
                return 'CommentsOnly';
            case 4:
                return 'RevisionsOnly';
            default:
                return protectionType as ProtectionType;
        }
    }
    private getRevisionType(revisionType: number | RevisionType): RevisionType {
        switch (revisionType) {
            case 1:
                return 'Insertion';
            case 2:
                return 'Deletion';
            case 3:
                return 'MoveTo';
            case 4:
                return 'MoveFrom';
            default:
                return revisionType as RevisionType;
        }
    }
    private getFootnoteType(footnoteType: number | FootnoteType): FootnoteType {
        switch (footnoteType) {
            case 0:
                return 'Footnote';
            case 1:
                return 'Endnote';
            default:
                return footnoteType as FootnoteType;
        }
    }
    private getFootnoteRestartIndex(footnoteRestartIndex: number | FootnoteRestartIndex): FootnoteRestartIndex {
        switch (footnoteRestartIndex) {
            case 0:
                return 'DoNotRestart';
            case 1:
                return 'RestartForEachSection';
            case 2:
                return 'RestartForEachPage';
            default:
                return footnoteRestartIndex as FootnoteRestartIndex;
        }
    }
    private getFootEndNoteNumberFormat(footEndNoteNumberFormat: number | FootEndNoteNumberFormat): FootEndNoteNumberFormat {
        switch (footEndNoteNumberFormat) {
            case 0:
                return 'Arabic';
            case 1:
                return 'UpperCaseRoman';
            case 2:
                return 'LowerCaseRoman';
            case 3:
                return 'UpperCaseLetter';
            case 4:
                return 'LowerCaseLetter';
            default:
                return footEndNoteNumberFormat as FootEndNoteNumberFormat;
        }
    }
    private getBiDirectionalOverride(biDirectionalOverride: number | BiDirectionalOverride): BiDirectionalOverride {
        switch (biDirectionalOverride) {
            case 0:
                return 'None';
            case 1:
                return 'LTR';
            case 2:
                return 'RTL';
            default:
                return biDirectionalOverride as BiDirectionalOverride;
        }
    }
    private getBreakClearType(breakClearType: number | BreakClearType): BreakClearType {
        switch (breakClearType) {
            case 0:
                return 'None';
            case 1:
                return 'Left';
            case 2:
                return 'Right';
            case 3:
                return 'All';
            default:
                return breakClearType as BreakClearType;
        }
    }
    private getTextVerticalAlignment(textVerticalAlignment: number | VerticalAlignment): VerticalAlignment {
        switch (textVerticalAlignment) {
            case 0:
                return 'Top';
            case 1:
                return 'Center';
            case 2:
                return 'Bottom';
            default:
                return textVerticalAlignment as VerticalAlignment;
        }
    }
    private getShapeVerticalAlignment(shapeVerticalAlignment: number | VerticalAlignment): VerticalAlignment {
        switch (shapeVerticalAlignment) {
            case 0:
                return 'None';
            case 1:
                return 'Top';
            case 2:
                return 'Center';
            case 3:
                return 'Bottom';
            case 4:
                return 'Inline';
            case 5:
                return 'Inside';
            case 6:
                return 'Outside';
            default:
                return shapeVerticalAlignment as VerticalAlignment;
        }
    }
    private getShapeHorizontalAlignment(shapeHorizontalAlignment: number | HorizontalAlignment): HorizontalAlignment {
        switch (shapeHorizontalAlignment) {
            case 0:
                return 'None';
            case 1:
                return 'Center';
            case 2:
                return 'Inside';
            case 3:
                return 'Left';
            case 4:
                return 'Outside';
            case 5:
                return 'Right';
            default:
                return shapeHorizontalAlignment as HorizontalAlignment;
        }
    }
    private getVerticalOrigin(verticalOrigin: number | VerticalOrigin): VerticalOrigin {
        switch (verticalOrigin) {
            case 0:
                return 'Paragraph';
            case 1:
                return 'BottomMargin';
            case 2:
                return 'InsideMargin';
            case 3:
                return 'Line';
            case 4:
                return 'Margin';
            case 5:
                return 'OutsideMargin';
            case 6:
                return 'Page';
            case 7:
                return 'TopMargin';
            default:
                return verticalOrigin as VerticalOrigin;
        }
    }
    private getHorizontalOrigin(horizontalOrigin: number | HorizontalOrigin): HorizontalOrigin {
        switch (horizontalOrigin) {
            case 0:
                return 'Column';
            case 1:
                return 'Character';
            case 2:
                return 'InsideMargin';
            case 3:
                return 'LeftMargin';
            case 4:
                return 'Margin';
            case 5:
                return 'OutsideMargin';
            case 6:
                return 'Page';
            case 7:
                return 'RightMargin';
            default:
                return horizontalOrigin as HorizontalOrigin;
        }
    }
    private getTableVerticalRelation(tableRelation: number | string): string {
        switch (tableRelation) {
            case 0:
                return 'Paragraph';
            case 1:
                return 'Margin';
            case 2:
                return 'Page';
            default:
                return tableRelation as string;
        }
    }
    private getTableHorizontalRelation(tableRelation: number | string): string {
        switch (tableRelation) {
            case 0:
                return 'Column';
            case 1:
                return 'Margin';
            case 2:
                return 'Page';
            default:
                return tableRelation as string;
        }
    }
            
    private getTableVerticalPosition(tableVerticalPosition: number | VerticalAlignment): VerticalAlignment {
        switch (tableVerticalPosition) {
            case 0:
                return 'None';
            case 1:
                return 'Top';
            case 2:
                return 'Center';
            case 3:
                return 'Bottom';
            case 4:
                return 'Inside';
            case 5:
                return 'Outside';
            default:
                return tableVerticalPosition as VerticalAlignment;
        }
    }
    private getTableHorizontalPosition(tableHorizontalPosition: number | HorizontalAlignment): HorizontalAlignment {
        switch (tableHorizontalPosition) {
            case 0:
                return 'Left';
            case 1:
                return 'Center';
            case 2:
                return 'Inside';
            case 3:
                return 'Outside';
            case 4:
                return 'Right';
            default:
                return tableHorizontalPosition as HorizontalAlignment;
        }
    }
    private getLineDashStyle(lineDashStyle: number | LineDashing): LineDashing {
        switch (lineDashStyle) {
            case 0:
                return 'Solid';
            case 1:
                return 'Dash';
            case 2:
                return 'DashDot';
            case 3:
                return 'DashDotDot';
            case 4:
                return 'DashDotGEL';
            case 5:
                return 'DashGEL';
            case 6:
                return 'Dot';
            case 7:
                return 'DotGEL';
            case 8:
                return 'LongDashDotDotGEL';
            case 9:
                return 'LongDashDotGEL';
            case 10:
                return 'LongDashGEL';
            default:
                return lineDashStyle as LineDashing;
        }
    }
    private getHorizontalPositionAbs(horizontalPositionAbs: number | HorizontalAlignment): HorizontalAlignment {
        switch (horizontalPositionAbs) {
            case 0:
                return 'Left';
            case 1:
                return 'Center';
            case 2:
                return 'Right';
            case 3:
                return 'Inside';
            case 4:
                return 'Outside';
            default:
                return horizontalPositionAbs as HorizontalAlignment;
        }
    }
    private getTabJustification(tabJustification: number | TabJustification): TabJustification {
        switch (tabJustification) {
            case 0:
                return 'Left';
            case 1:
                return 'Bar';
            case 2:
                return 'Center';
            case 3:
                return 'Decimal';
            case 4:
                return 'List';
            case 5:
                return 'Right';
            default:
                return tabJustification as TabJustification;
        }
    }
    private getTabLeader(tabLeader: number | TabLeader): TabLeader {
        switch (tabLeader) {
            case 0:
                return 'None';
            case 1:
                return 'Single';
            case 2:
                return 'Dot';
            case 3:
                return 'Hyphen';
            case 4:
                return 'Underscore';
            default:
                return tabLeader as TabLeader;
        }
    }
    private getTextFormFieldType(textFormFieldType: number | TextFormFieldType): TextFormFieldType {
        switch (textFormFieldType) {
            case 0:
                return 'Text';
            case 1:
                return 'Number';
            case 2:
                return 'Date';
            case 3:
                return 'Calculation'
            default:
                return textFormFieldType as TextFormFieldType;
        }
    }
    private getTextFormFieldFormat(textFormFieldFormat: number | string): string {
        switch (textFormFieldFormat) {
            case 0:
                return 'None';
            case 1:
                return 'FirstCapital';
            case 2:
                return 'Lowercase';
            case 3:
                return 'Uppercase';
            case 4:
                return 'Titlecase';
            default:
                return textFormFieldFormat as string;
        }
    }
    private getCheckBoxSizeType(checkBoxSizeType: number | CheckBoxSizeType): CheckBoxSizeType {
        switch (checkBoxSizeType) {
            case 0:
                return 'Auto';
            case 1:
                return 'Exactly';
            default:
                return checkBoxSizeType as CheckBoxSizeType;
        }
    }
    private getContentControlAppearance(contentControlAppearance: number | string): string {
        switch (contentControlAppearance) {
            case 1:
                return 'BoundingBox';
            case 2:
                return 'Hidden';
            case 3:
                return 'Tags';
            default:
                return contentControlAppearance as string;
        }
    }
    private getContentControlType(contentControlType: number | ContentControlType): ContentControlType {
        switch (contentControlType) {
            case 0:
                return 'RichText';
            case 1:
                return 'BuildingBlockGallery';
            case 2:
                return 'CheckBox';
            case 3:
                return 'ComboBox';
            case 4:
                return 'Date';
            case 5:
                return 'DropDownList';
            case 6:
                return 'Group';
            case 7:
                return 'Picture';
            case 8:
                return 'RepeatingSection';
            case 9:
                return 'Text';
            default:
                return contentControlType as ContentControlType;
        }
    }
    private getDateCalendarType(dateCalendarType: number | string): string {
        switch (dateCalendarType) {
            case 0:
                return 'Gregorian';
            case 1:
                return 'GregorianArabic';
            case 2:
                return 'GregorianEnglish';
            case 3:
                return 'GregorianMiddleEastFrench';
            case 4:
                return 'GregorianTransliteratedEnglish';
            case 5:
                return 'GregorianTransliteratedFrench';
            case 6:
                return 'Hebrew';
            case 7:
                return 'Hijri';
            case 8:
                return 'Japan';
            case 9:
                return 'Korean';
            case 10:
                return 'Saka';
            case 11:
                return 'Taiwan';
            case 12:
                return 'Thai';
            default:
                return dateCalendarType as string;
        }
    }
    private getDateStorageFormat(dateStorageFormat: number | string): string {
        switch (dateStorageFormat) {
            case 1:
                return 'DateStorageDate';
            case 2:
                return 'DateStorageDateTime';
            case 3:
                return 'DateStorageText';
            default:
                return dateStorageFormat as string;
        }
    }
    private getTextWrappingStyle(textWrappingStyle: number | TextWrappingStyle): TextWrappingStyle {
        switch (textWrappingStyle) {
            case 0:
                return 'Inline';
            case 1:
                return 'InFrontOfText';
            case 2:
                return 'Square';
            case 3:
                return 'TopAndBottom';
            case 4:
                return 'Behind';
            default:
                return textWrappingStyle as TextWrappingStyle;
        }
    }
    private getTextWrappingType(textWrappingType: number | TextWrappingType): TextWrappingType {
        switch (textWrappingType) {
            case 0:
                return 'Both';
            case 1:
                return 'Left';
            case 2:
                return 'Right';
            case 3:
                return 'Largest';
            default:
                return textWrappingType as TextWrappingType;
        }
    }
    private getCompatibilityMode(compatibilityMode: number | CompatibilityMode): CompatibilityMode {
        switch (compatibilityMode) {
            case 0:
                return 'Word2013';
            case 1:
                return 'Word2003';
            case 2:
                return 'Word2007';
            case 3:
                return 'Word2010';
            default:
                return compatibilityMode as CompatibilityMode;
        }
    }
    private getLineFormatType(lineFormatType: number | LineFormatType): LineFormatType {
        switch (lineFormatType) {
            case 0:
                return 'Solid';
            case 1:
                return 'Patterned'
            case 2:
                return 'Gradient';
            case 3:
                return 'None';
            default:
                return lineFormatType as LineFormatType;
        }
    }
    private getAutoShapeType(autoShapeType: number | AutoShapeType): AutoShapeType {
        switch (autoShapeType) {
            case 1:
                return 'Rectangle';
            case 2:
                return 'RoundedRectangle'
            case 3:
                return 'StraightConnector';
            default:
                return autoShapeType as AutoShapeType;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.footnotes) {
            this.footnotes.destroy();
        }
        this.footnotes = undefined;
        if (this.endnotes) {
            this.endnotes.destroy();
        }
        this.endnotes = undefined;
        if (this.editableRanges) {
            this.editableRanges.destroy();
        }
        this.editableRanges = undefined;
        if (this.commentEnds) {
            this.commentEnds.destroy();
        }
        this.commentEnds = undefined;
        if (this.commentStarts) {
            this.commentStarts.destroy();
        }
        this.commentStarts = undefined;
        if (this.commentsCollection) {
            this.commentsCollection.destroy();
        }
        this.commentsCollection = undefined;
        if (this.revisionCollection) {
            this.revisionCollection.destroy();
        }
        this.revisionCollection = undefined;
        this.documentHelper = undefined;
        this.keywordIndex = undefined;
    }
}