/* eslint-disable */
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WTabStop, WParagraphFormat } from '../format/paragraph-format';
import { WCellFormat, WTableFormat, WRowFormat, WStyle, WListFormat, WCharacterFormat, WColumnFormat, WSectionFormat } from '../format/index';
import { WBorder, WBorders, WShading } from '../format/index';
import { FontSchemeStruct, LayoutViewer } from '../index';
import {
    IWidget, LineWidget, ParagraphWidget, BlockContainer, BodyWidget, TextElementBox, Page, ElementBox, FieldElementBox, TableWidget,
    TableRowWidget, TableCellWidget, ImageElementBox, HeaderFooterWidget, HeaderFooters, ContentControl,
    ListTextElementBox, BookmarkElementBox, EditRangeStartElementBox, EditRangeEndElementBox,
    ChartElementBox, ChartDataTable, ChartTitleArea, ChartDataFormat, ChartLayout, ChartArea, ChartLegend, ChartCategoryAxis,
    CommentElementBox, CommentCharacterElementBox, TextFormField, CheckBoxFormField, DropDownFormField, ShapeElementBox,
    ContentControlProperties, FootnoteElementBox, ShapeBase, BreakElementBox, FootnoteEndnoteMarkerElementBox,
    FootNoteWidget
} from '../viewer/page';
import { BlockWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ElementInfo, HelperMethods } from '../editor/editor-helper';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { TextPosition } from '../selection';
import { DocumentHelper } from '../viewer';
import { WLevelOverride } from '../list';
import { DocumentEditor } from '../../document-editor';
import { Revision } from '../track-changes/track-changes';
import { Themes } from '../themes/themes';
import { MajorMinorFontScheme } from '../themes/major-minor-font-scheme';
import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { AutoShapeType, CellVerticalAlignment, CheckBoxSizeType, CompatibilityMode, ContentControlType, FollowCharacterType, FootEndNoteNumberFormat, FootnoteRestartIndex, FootnoteType, HeightType, HorizontalAlignment, HorizontalOrigin, LineDashing, LineFormatType, LineSpacingType, LineStyle, ListLevelPattern, OutlineLevel, ProtectionType, RevisionType, StyleType, TabJustification, TabLeader, TableAlignment, TextAlignment, TextFormFieldType, TextureStyle, TextWrappingStyle, TextWrappingType, VerticalAlignment, VerticalOrigin, WidthType } from '../../base/types';
import { sectionsProperty, imagesProperty, fontSubstitutionTableProperty, paraStyleNameProperty, characterFormatProperty, paragraphFormatProperty, listsProperty, abstractListsProperty, backgroundProperty, stylesProperty, commentsProperty, revisionsProperty, customXmlProperty, defaultTabWidthProperty, formattingProperty, trackChangesProperty, protectionTypeProperty, enforcementProperty, hashValueProperty, saltValueProperty, cryptProviderTypeProperty, cryptAlgorithmClassProperty, cryptAlgorithmTypeProperty, cryptAlgorithmSidProperty, cryptSpinCountProperty, doNotUseHTMLParagraphAutoSpacingProperty, alignTablesRowByRowProperty, formFieldShadingProperty, lastParagraphMarkCopiedProperty, footnotesProperty, endnotesProperty, compatibilityModeProperty, themeFontLanguagesProperty, themesProperty, nameProperty, basedOnProperty, nextProperty, linkProperty, localeIdProperty, localeIdFarEastProperty, localeIdBidiProperty, boldProperty, italicProperty, underlineProperty, baselineAlignmentProperty, strikethroughProperty, highlightColorProperty, fontSizeProperty, fontColorProperty, fontFamilyProperty, styleNameProperty, bidiProperty, bdoProperty, fontSizeBidiProperty, fontFamilyBidiProperty, boldBidiProperty, italicBidiProperty, allCapsProperty, complexScriptProperty, fontFamilyAsciiProperty, fontFamilyFarEastProperty, fontFamilyNonFarEastProperty, revisionIdsProperty, listIdProperty, listLevelNumberProperty, leftIndentProperty, rightIndentProperty, firstLineIndentProperty, textAlignmentProperty, afterSpacingProperty, beforeSpacingProperty, spaceAfterAutoProperty, spaceBeforeAutoProperty, lineSpacingProperty, lineSpacingTypeProperty, listFormatProperty, keepWithNextProperty, widowControlProperty, keepLinesTogetherProperty, outlineLevelProperty, contextualSpacingProperty, bordersProperty, tabsProperty, headerDistanceProperty, footerDistanceProperty, differentFirstPageProperty, differentOddAndEvenPagesProperty, pageWidthProperty, pageHeightProperty, leftMarginProperty, rightMarginProperty, topMarginProperty, bottomMarginProperty, restartPageNumberingProperty, pageStartingNumberProperty, endnoteNumberFormatProperty, footNoteNumberFormatProperty, restartIndexForFootnotesProperty, restartIndexForEndnotesProperty, initialFootNoteNumberProperty, initialEndNoteNumberProperty, pageNumberStyleProperty, columnsProperty, numberOfColumnsProperty, equalWidthProperty, lineBetweenColumnsProperty, breakCodeProperty, cellWidthProperty, columnSpanProperty, rowSpanProperty, verticalAlignmentProperty, allowBreakAcrossPagesProperty, isHeaderProperty, heightTypeProperty, beforeWidthProperty, afterWidthProperty, gridBeforeProperty, gridBeforeWidthProperty, gridBeforeWidthTypeProperty, gridAfterProperty, gridAfterWidthProperty, gridAfterWidthTypeProperty, allowAutoFitProperty, cellSpacingProperty, shadingProperty, tableAlignmentProperty, preferredWidthProperty, preferredWidthTypeProperty, horizontalPositionAbsProperty, textureProperty, backgroundColorProperty, foregroundColorProperty, shadowProperty, hasNoneStyleProperty, verticalProperty, horizontalProperty, diagonalUpProperty, diagonalDownProperty, lineStyleProperty, lineWidthProperty, layoutProperty, dataFormatProperty, yValueProperty, chartDataProperty, categoryXNameProperty, lineProperty, foreColorProperty, patternProperty, layoutXProperty, layoutYProperty, directionProperty, endStyleProperty, numberValueProperty, markerStyleProperty, markerColorProperty, markerSizeProperty, forwardProperty, backwardProperty, interceptProperty, isDisplayRSquaredProperty, isDisplayEquationProperty, seriesNameProperty, dataLabelProperty, errorBarProperty, seriesFormatProperty, trendLinesProperty, dataPointsProperty, firstSliceAngleProperty, holeSizeProperty, isLegendKeyProperty, isBubbleSizeProperty, isCategoryNameProperty, isSeriesNameProperty, isValueProperty, isPercentageProperty, isLeaderLinesProperty, showSeriesKeysProperty, hasHorizontalBorderProperty, hasVerticalBorderProperty, hasBordersProperty, categoryTypeProperty, chartCategoryProperty, chartSeriesProperty, chartAreaProperty, chartTitleAreaProperty, plotAreaProperty, chartLegendProperty, chartPrimaryCategoryAxisProperty, chartPrimaryValueAxisProperty, chartTitleProperty, chartTypeProperty, gapWidthProperty, overlapProperty, chartDataTableProperty, textProperty, shapeIdProperty, alternativeTextProperty, visibleProperty, widthProperty, heightProperty, widthScaleProperty, heightScaleProperty, lineFormatProperty, fillFormatProperty, textWrappingStyleProperty, textWrappingTypeProperty, verticalRelativePercentProperty, horizontalRelativePercentProperty, heightRelativePercentProperty, widthRelativePercentProperty, zOrderPositionProperty, layoutInCellProperty, lockAnchorProperty, autoShapeTypeProperty, textFrameProperty, colorProperty, fillProperty, textVerticalAlignmentProperty, imageStringProperty, metaFileImageStringProperty, lengthProperty, isInlineImageProperty, isMetaFileProperty, topProperty, bottomProperty, rightProperty, leftProperty, getImageHeightProperty, getImageWidthProperty, hasFieldEndProperty, formFieldDataProperty, fieldTypeProperty, enabledProperty, helpTextProperty, statusTextProperty, textInputProperty, checkBoxProperty, dropDownListProperty, maxLengthProperty, defaultValueProperty, formatProperty, sizeTypeProperty, sizeProperty, checkedProperty, dropDownItemsProperty, selectedIndexProperty, commentIdProperty, commentCharacterTypeProperty, authorProperty, initialProperty, dateProperty, doneProperty, replyCommentsProperty, revisionTypeProperty, revisionIdProperty, itemIDProperty, xmlProperty, footnoteTypeProperty, symbolCodeProperty, symbolFontNameProperty, customMarkerProperty, inlinesProperty, contentControlPropertiesProperty, lockContentControlProperty, lockContentsProperty, tagProperty, titleProperty, hasPlaceHolderTextProperty, multiLineProperty, isTemporaryProperty, dateCalendarTypeProperty, dateStorageFormatProperty, dateDisplayLocaleProperty, dateDisplayFormatProperty, isCheckedProperty, uncheckedStateProperty, checkedStateProperty, contentControlListItemsProperty, xmlMappingProperty, fontProperty, valueProperty, displayTextProperty, isMappedProperty, isWordMlProperty, prefixMappingProperty, xPathProperty, storeItemIdProperty, customXmlPartProperty, idProperty, cellFormatProperty, rowFormatProperty, cellsProperty, rowsProperty, descriptionProperty, wrapTextAroundProperty, positioningProperty, tableFormatProperty, allowOverlapProperty, distanceTopProperty, distanceRightProperty, distanceLeftProperty, distanceBottomProperty, verticalOriginProperty, verticalPositionProperty, horizontalOriginProperty, horizontalAlignmentProperty, horizontalPositionProperty, blocksProperty, headerProperty, footerProperty, evenHeaderProperty, evenFooterProperty, firstPageHeaderProperty, firstPageFooterProperty, headersFootersProperty, sectionFormatProperty, listLevelPatternProperty, followCharacterProperty, startAtProperty, restartLevelProperty, levelNumberProperty, numberFormatProperty, abstractListIdProperty, levelsProperty, overrideListLevelProperty, levelOverridesProperty, separatorProperty, continuationSeparatorProperty, continuationNoticeProperty, bookmarkTypeProperty, propertiesProperty, tabJustificationProperty, positionProperty, deletePositionProperty, leaderProperty, tabLeaderProperty, editRangeIdProperty, columnFirstProperty, columnLastProperty, userProperty, groupProperty, editableRangeStartProperty, spaceProperty, fontSchemeProperty, fontSchemeNameProperty, majorFontSchemeProperty, minorFontSchemeProperty, fontSchemeListProperty, fontTypefaceProperty, typefaceProperty, panoseProperty, typeProperty, majorUnitProperty, maximumValueProperty, minimumValueProperty, hasMajorGridLinesProperty, hasMinorGridLinesProperty, majorTickMarkProperty, minorTickMarkProperty, tickLabelPositionProperty, rgbProperty, appearanceProperty, lineFormatTypeProperty, allowSpaceOfSameStyleInTableProperty, weightProperty, inlineFormatProperty, fontNameProperty, isCompressedProperty, columnIndexProperty, columnCountProperty, gridProperty, isAfterParagraphMarkProperty, isAfterCellMarkProperty, isAfterRowMarkProperty, isAfterTableMarkProperty, belowTextProperty, breakClearTypeProperty, nsidProperty, isLegalStyleNumberingProperty, horizontalRuleProperty, isCreatedUsingHtmlSpanTagProperty, isAutoMajorProperty } from '../../index';
import { FieldSettingsModel } from '@syncfusion/ej2-navigations';
/**
 * Exports the document to Sfdt format.
 */
export class SfdtExport {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private startLine: LineWidget = undefined;
    private endLine: LineWidget = undefined;
    private endOffset: number = undefined;
    private endCell: TableCellWidget = undefined;
    private startColumnIndex: number = undefined;
    private endColumnIndex: number = undefined;
    private lists: number[] = undefined;
    private images: number[] = undefined;
    private document: any = undefined;
    private writeInlineStyles: boolean = undefined;
    private nextBlock: any;
    private blockContent: boolean = false;
    private startContent: boolean = false;
    private multipleLineContent: boolean = false;
    private nestedContent: boolean = false;
    private contentType: string;
    private editRangeId: number = -1;
    private selectedCommentsId: string[] = [];
    private selectedRevisionId: string[] = [];
    private startBlock: BlockWidget;
    private endBlock: BlockWidget;
    private nestedBlockContent: boolean = false;
    private nestedBlockEnabled: boolean = false;
    private blocks: any = [];
    private contentInline: any = [];
    private isContentControl: boolean = false;
    private isBlockClosed: boolean = true;
    private isWriteInlinesFootNote = false;
    private isWriteEndFootNote = false;
    public bookmarkCollection: BookmarkElementBox[] = [];
    /**
     * @private
     */
    // For spell check when serailize the page no to need to wirte the formatting. So we do this property as true it will skip the formatting.
    private skipExporting: boolean = false;
    /**
     * @private
     */
    public iscontentInsert = true;
    /**
     * @private
     */
    public keywordIndex: number = undefined;
    /**
     * @private
     */
    private isExport: boolean = true;
    /**
     * @private
     */
    public isPartialExport: boolean = false;
    private documentHelper: DocumentHelper;
    private checkboxOrDropdown: boolean = false;
    /**
     * @private
     */
    public copyWithTrackChange: boolean = false;
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    private get owner(): DocumentEditor {
        return this.documentHelper.owner;
    }
    private getModuleName(): string {
        return 'SfdtExport';
    }
    private clear(): void {
        this.writeInlineStyles = undefined;
        this.startLine = undefined;
        this.endLine = undefined;
        this.lists = undefined;
        this.images = undefined;
        this.document = undefined;
        this.endCell = undefined;
        this.startColumnIndex = undefined;
        this.endColumnIndex = undefined;
        this.selectedCommentsId = [];
        this.selectedRevisionId = [];
        this.startBlock = undefined;
        this.endBlock = undefined;
        this.isPartialExport = false;
        this.keywordIndex = undefined;
    }
    /**
     * Serialize the data as Syncfusion document text.
     *
     * @private
     */
    public serialize(): string {
        return this.seralizeInternal(this.owner.documentEditorSettings.optimizeSfdt ? 1 : 0);
    }
    /**
     * Serialize the data as Syncfusion document text.
     *
     * @private
     */
    public seralizeInternal(index: number): string {
        return JSON.stringify(this.write(index));
    }
    /**
     * @private
     * @param documentHelper - Specifies document helper instance.
     * @returns {Promise<Blob>}
     */
    public saveAsBlobNonOptimized(documentHelper: DocumentHelper): Promise<Blob> {
        let sfdt: Blob = new Blob([this.serialize()], { type: 'text/plain' });
        return new Promise((resolve: Function, reject: Function) => {
            resolve(sfdt);
        });
    }
    /**
     * @private
     * @param documentHelper - Specifies document helper instance.
     * @returns {Promise<Blob>}
     */
    public saveAsBlob(documentHelper: DocumentHelper): Promise<Blob> {
        const jsonString: string = this.serialize();
            const blob: Blob = new Blob([jsonString], {
                type: 'application/json'
            });
            const archiveItem: ZipArchiveItem = new ZipArchiveItem(blob, "sfdt");
            const mArchive: ZipArchive = new ZipArchive();
            mArchive.addItem(archiveItem);
            return mArchive.saveAsBlob();
    }
    private updateEditRangeId(): void {
        let index: number = -1;
        for (let i: number = 0; i < this.documentHelper.editRanges.keys.length; i++) {
            const keys: string[] = this.documentHelper.editRanges.keys;
            for (let j: number = 0; j < keys[i].length; j++) {
                const editRangeStart: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(keys[i]);
                for (let z: number = 0; z < editRangeStart.length; z++) {
                    index++;
                    editRangeStart[z].editRangeId = index;
                    if (!isNullOrUndefined(editRangeStart[z].editRangeEnd)) {
                        editRangeStart[z].editRangeEnd.editRangeId = index;
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    /* eslint-disable  */
    public write(index?: number, line?: LineWidget, startOffset?: number, endLine?: LineWidget, endOffset?: number, writeInlineStyles?: boolean, isExport?: boolean): any {
        if (writeInlineStyles) {
            this.writeInlineStyles = true;
        }
        if (!isNullOrUndefined(index)) {
            this.keywordIndex = index;
        }
        else {
            this.keywordIndex = this.owner.documentEditorSettings.optimizeSfdt ? 1 : 0;
        } 
        this.Initialize();
        this.updateEditRangeId();
        if (line instanceof LineWidget && endLine instanceof LineWidget) {
            this.isExport = false;
            if (!isNullOrUndefined(isExport)) {
                this.isExport = isExport;
            }
            // For selection
            let startPara: ParagraphWidget = line.paragraph;
            let endPara: ParagraphWidget = endLine.paragraph;

            if (this.isPartialExport) {
                this.startBlock = this.getParentBlock(startPara);
                this.endBlock = this.getParentBlock(endPara);
            }
            let startCell: TableCellWidget = startPara.associatedCell;
            let endCell: TableCellWidget = endPara.associatedCell;
            // Creates section
            let bodyWidget: BlockContainer = startPara.bodyWidget as BlockContainer;
            let section: any = this.createSection(line.paragraph.bodyWidget as BlockContainer);
            this.document[sectionsProperty[this.keywordIndex]].push(section);
            let selectionStartCell: TableCellWidget = startCell;
            let selectionEndCell: TableCellWidget = endCell;
            if (startCell instanceof TableCellWidget) {
                selectionStartCell = this.getParentCell(selectionStartCell);
            }
            if (endCell instanceof TableCellWidget) {
                selectionEndCell = this.getParentCell(selectionEndCell);
            }
            let isSameCell: boolean = selectionStartCell instanceof TableCellWidget && selectionEndCell instanceof TableCellWidget
                && selectionStartCell.equals(selectionEndCell);
            if (isSameCell || isNullOrUndefined(endCell)) {
                this.startLine  = line;
                this.endLine = endLine;
                this.endOffset = endOffset;
            } else {
                // Todo: Handle nested table cases
                if (startCell instanceof TableCellWidget) {
                    let startTable: TableWidget = startCell.getContainerTable();
                    let endTable: TableWidget = endCell.getContainerTable();
                    if (startTable.tableFormat === endTable.tableFormat) {
                        this.endCell = endCell;
                        if (this.endCell.ownerTable !== startCell.ownerTable && startCell.ownerTable.associatedCell
                            && startCell.ownerTable.associatedCell.ownerTable === this.endCell.ownerTable &&
                            (startCell.ownerTable.associatedCell.childWidgets.indexOf(startCell.ownerTable) === 0)) {
                            startCell = startCell.ownerTable.associatedCell;
                        }
                        this.endColumnIndex = this.endCell.columnIndex + this.endCell.cellFormat.columnSpan;
                        this.startColumnIndex = startCell.columnIndex;
                    }
                } else {
                    this.endCell = endCell;
                }
            }
            let nextBlock: BlockWidget;
            if ((isSameCell && !this.isPartialExport) || isNullOrUndefined(startCell)) {
                let lastBlock: BlockWidget = line.paragraph;
                const paraEndOffset: number = this.owner.selection.getLineLength(endPara.lastChild as LineWidget);
                const isBlockContentControl = startPara === endPara && this.endOffset === paraEndOffset + 1;
                if (this.owner.documentHelper.isCopying && !isNullOrUndefined(startPara.contentControlProperties) && (startOffset === 0 || startOffset === 1) && (startPara !== endPara || (isBlockContentControl))) {
                    this.isContentControl = true;
                    nextBlock = this.writeBlock(lastBlock, 0, section[blocksProperty[this.keywordIndex]]);
                    if (isBlockContentControl) {
                        let paragraph: any = this.createParagraph(line.paragraph);
                        section[blocksProperty[this.keywordIndex]].push(paragraph);
                    }
                    this.isContentControl = false;
                } else {
                    let paragraph: any = this.createParagraph(line.paragraph);
                    section[blocksProperty[this.keywordIndex]].push(paragraph);
                    nextBlock = this.writeParagraph(line.paragraph, paragraph, section[blocksProperty[this.keywordIndex]], line.indexInOwner, startOffset);
                }
                if (this.isPartialExport) {
                    nextBlock = this.getNextBlock(nextBlock, lastBlock);
                    section = this.document[sectionsProperty[this.keywordIndex]][this.document[sectionsProperty[this.keywordIndex]].length - 1];
                }
                while (nextBlock) {
                    const isDifferentSection = nextBlock.containerWidget instanceof BodyWidget && lastBlock.containerWidget instanceof BodyWidget && nextBlock.containerWidget.sectionIndex !== lastBlock.containerWidget.sectionIndex;
                    if (isDifferentSection) {
                        section = this.createSection(nextBlock.containerWidget as BlockContainer);
                        this.document[sectionsProperty[this.keywordIndex]].push(section);
                        let paragraph: any = this.createParagraph(nextBlock as ParagraphWidget);
                        section[blocksProperty[this.keywordIndex]].push(paragraph);
                        lastBlock = nextBlock;
                        nextBlock = this.writeParagraph(lastBlock as ParagraphWidget, paragraph, section[blocksProperty[this.keywordIndex]], line.indexInOwner, startOffset);
                        continue;
                    }
                    lastBlock = nextBlock;
                    if (this.owner.documentHelper.isCopying && nextBlock instanceof ParagraphWidget && !isNullOrUndefined(nextBlock.contentControlProperties) && nextBlock === endPara && this.endOffset !== paraEndOffset + 1) {
                        this.isContentControl = true;
                        let paragraph: any = this.createParagraph(nextBlock);
                        section[blocksProperty[this.keywordIndex]].push(paragraph);
                        const offset: number = !nextBlock.isEmpty() ? this.owner.selection.getNextValidOffset(nextBlock.firstChild as LineWidget, 0) : 0;
                        nextBlock = this.writeParagraph(nextBlock, paragraph, section[blocksProperty[this.keywordIndex]], 0, offset);
                        this.isContentControl = false;
                    } else {
                        nextBlock = this.writeBlock(nextBlock, 0, section[blocksProperty[this.keywordIndex]]);
                    }
                    if (this.isPartialExport && isNullOrUndefined(nextBlock)) {
                        nextBlock = this.getNextBlock(nextBlock, lastBlock);
                        section = this.document[sectionsProperty[this.keywordIndex]][this.document[sectionsProperty[this.keywordIndex]].length - 1];
                    }
                }
                // Todo:continue in next section
            } else {
                // Specially handled for nested table cases
                // selection start inside table and end in paragraph outside table
                if (isNullOrUndefined(endCell) && startCell.ownerTable.associatedCell) {
                    let startTable: TableWidget = startCell.getContainerTable();
                    let lastRow: TableRowWidget = startTable.childWidgets[startTable.childWidgets.length - 1] as TableRowWidget;
                    let endCell: TableCellWidget = lastRow.childWidgets[lastRow.childWidgets.length - 1] as TableCellWidget;
                    if (endCell.ownerTable !== startCell.ownerTable && startCell.ownerTable.associatedCell
                        && (startCell.ownerTable.associatedCell.childWidgets.indexOf(startCell.ownerTable) === 0)) {
                        while (startCell.ownerTable !== endCell.ownerTable) {
                            startCell = startCell.ownerTable.associatedCell;
                        }
                    }
                    this.endColumnIndex = endCell.columnIndex + endCell.cellFormat.columnSpan;
                    this.startColumnIndex = startCell.columnIndex;
                }
                let table: any = this.createTable(startCell.ownerTable);
                section[blocksProperty[this.keywordIndex]].push(table);
                let lastBlock: BlockWidget = startCell.ownerTable;
                nextBlock = this.writeTable(startCell.ownerTable, table, startCell.ownerRow.indexInOwner, section[blocksProperty[this.keywordIndex]]);
                if (this.isPartialExport) {
                    nextBlock = this.getNextBlock(nextBlock, lastBlock);
                    section = this.document[sectionsProperty[this.keywordIndex]][this.document[sectionsProperty[this.keywordIndex]].length - 1];
                }
                while (nextBlock) {
                    const isDifferentSection = nextBlock.containerWidget instanceof BodyWidget && lastBlock.containerWidget instanceof BodyWidget && nextBlock.containerWidget.sectionIndex !== lastBlock.containerWidget.sectionIndex;
                    if (isDifferentSection) {
                        section = this.createSection(nextBlock.containerWidget as BlockContainer);
                        this.document[sectionsProperty[this.keywordIndex]].push(section);
                        let paragraph: any = this.createParagraph(nextBlock as ParagraphWidget);
                        section[blocksProperty[this.keywordIndex]].push(paragraph);
                        lastBlock = nextBlock;
                        nextBlock = this.writeParagraph(lastBlock as ParagraphWidget, paragraph, section[blocksProperty[this.keywordIndex]], line.indexInOwner, startOffset);
                        continue;
                    }
                    lastBlock = nextBlock;
                    nextBlock = this.writeBlock(nextBlock, 0, section[blocksProperty[this.keywordIndex]]);
                    if (this.isPartialExport) {
                        nextBlock = this.getNextBlock(nextBlock, lastBlock);
                        section = this.document[sectionsProperty[this.keywordIndex]][this.document[sectionsProperty[this.keywordIndex]].length - 1];
                    }
                }
            }
        } else {
            this.isExport = true;
            if (this.documentHelper.pages.length > 0) {
                let page: Page = this.documentHelper.pages[0];
                this.writePage(page, false);
            } else {
                this.serializeMinimal();
            }
        }
        this.document[backgroundProperty[this.keywordIndex]]={[colorProperty[this.keywordIndex]]:this.documentHelper.backgroundColor};
        this.writeStyles(this.documentHelper);
        this.writeLists(this.documentHelper);
        this.writeComments(this.documentHelper);
        this.writeRevisions(this.documentHelper);
        this.writeCustomXml(this.documentHelper);
        this.writeImages(this.documentHelper);
        this.footnotes(this.documentHelper);
        this.endnotes(this.documentHelper);
        let doc: Document = this.document;
        this.clear();
        return doc;
    }

    private serializeMinimal(): void {
        let section: any = {};
        section[sectionFormatProperty[this.keywordIndex]] = {};
        section[blocksProperty[this.keywordIndex]] = [];
        let paragraph: any = {};
        paragraph[inlinesProperty[this.keywordIndex]] = [];
        section[blocksProperty[this.keywordIndex]].push(paragraph);
        section[headersFootersProperty[this.keywordIndex]] = {};
        this.document[sectionsProperty[this.keywordIndex]].push(section);
    }

    private getNextBlock(nextBlock: BlockWidget, lastBlock: BlockWidget): BlockWidget {
        if (isNullOrUndefined(nextBlock) && this.isPartialExport && this.endBlock
            && !this.endBlock.equals(lastBlock)) {
            nextBlock = lastBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
            if (nextBlock && lastBlock.bodyWidget.index !== nextBlock.bodyWidget.index) {
                let section: any = this.createSection(nextBlock.bodyWidget as BlockContainer);
                this.document[sectionsProperty[this.keywordIndex]].push(section);
            } else {
                nextBlock = undefined;
            }
        }
        return nextBlock;
    }
    /**
     * @private
     */
    public Initialize(): void {
        this.lists = [];
        this.images = [];
        this.document = {};
        this.document.optimizeSfdt = this.owner.documentEditorSettings.optimizeSfdt;
        this.document[sectionsProperty[this.keywordIndex]] = [];
        this.document[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat(this.documentHelper.characterFormat, this.keywordIndex);
        this.document[paragraphFormatProperty[this.keywordIndex]] = this.writeParagraphFormat(this.documentHelper.paragraphFormat, this.keywordIndex);
        if (!isNullOrUndefined(this.documentHelper.fontSubstitutionTable)) {
            this.document[fontSubstitutionTableProperty[this.keywordIndex]] = this.writeFontSubsitutionTable(this.documentHelper);
        }
        this.document[themeFontLanguagesProperty[this.keywordIndex]] = this.writeCharacterFormat(this.documentHelper.themeFontLanguage, this.keywordIndex);
        this.document[defaultTabWidthProperty[this.keywordIndex]] = this.documentHelper.defaultTabWidth;
        this.document[trackChangesProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(this.owner.enableTrackChanges, this.keywordIndex);
        this.document[enforcementProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(this.documentHelper.isDocumentProtected, this.keywordIndex);
        this.document[hashValueProperty[this.keywordIndex]] = this.documentHelper.hashValue;
        this.document[saltValueProperty[this.keywordIndex]] = this.documentHelper.saltValue;
        this.document[formattingProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(this.documentHelper.restrictFormatting, this.keywordIndex);
        this.document[protectionTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getProtectionTypeEnumValue(this.documentHelper.protectionType) : this.documentHelper.protectionType;
        this.document[doNotUseHTMLParagraphAutoSpacingProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(this.documentHelper.dontUseHtmlParagraphAutoSpacing, this.keywordIndex);
        this.document[formFieldShadingProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(this.documentHelper.owner.documentEditorSettings.formFieldSettings.applyShading, this.keywordIndex);
        this.document[compatibilityModeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getCompatibilityModeEnumValue(this.documentHelper.compatibilityMode) : this.documentHelper.compatibilityMode;
        this.document[allowSpaceOfSameStyleInTableProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(this.documentHelper.allowSpaceOfSameStyleInTable, this.keywordIndex);
        if (this.documentHelper.hasThemes) {
            this.document[themesProperty[this.keywordIndex]] = this.writeThemes(this.documentHelper.themes);
        }
    }
    private writeFontSubsitutionTable(documentHelper: DocumentHelper): any {
        let fontSubstitutionTable: any = {};
        for (let i: number = 0; i < documentHelper.fontSubstitutionTable.length; i++) {    
            let key: string = documentHelper.fontSubstitutionTable.keys[i];
            fontSubstitutionTable[key] = this.documentHelper.fontSubstitutionTable.get(key);
        }
        return fontSubstitutionTable;
    }
    /**
     * @private
     */
    public writePage(page: Page, spellChecker: boolean): any {
        this.skipExporting = spellChecker;
        if (page.bodyWidgets.length > 0) {
            let nextBlock: BodyWidget = page.bodyWidgets[0];
            do {
                nextBlock = this.writeBodyWidget(nextBlock, 0);
            } while (!isNullOrUndefined(nextBlock));
        }
        this.skipExporting = false;
        return this.document;
    }
    private writeBodyWidget(bodyWidget: BodyWidget, index: number): BodyWidget {
        if (!(bodyWidget instanceof BodyWidget)) {
            return undefined;
        }
        let section: any = this.createSection(bodyWidget);
        this.document[sectionsProperty[this.keywordIndex]].push(section);
        this.writeHeaderFooters(this.documentHelper.headersFooters[bodyWidget.index], section);
        let firstBlock: BlockWidget = bodyWidget.childWidgets[index] as BlockWidget;
        if (isNullOrUndefined(firstBlock) && bodyWidget.nextRenderedWidget) {
            firstBlock = bodyWidget.nextRenderedWidget.childWidgets[index] as BlockWidget;
        }
        do {
            firstBlock = this.writeBlock(firstBlock as BlockWidget, 0, section[blocksProperty[this.keywordIndex]]);
        } while (firstBlock);
        let next: BodyWidget = bodyWidget;
        do {
            bodyWidget = next;
            next = next.nextRenderedWidget as BodyWidget;
            if (isNullOrUndefined(next) && !isNullOrUndefined(bodyWidget.page.nextPage) && !isNullOrUndefined(bodyWidget.page.nextPage)) {
                next = bodyWidget.page.nextPage.bodyWidgets[0];
            }
        } while (next instanceof BodyWidget && next.index === bodyWidget.index);
        // While importing, If the last paragraph is empty and the section break is present, then the empty paragraph is removed. So, added the empty paragraph at the end of the section while exporting.
        // let islastEmptyParagraph: boolean;
        // if (!isNullOrUndefined(bodyWidget.lastChild) && bodyWidget.lastChild instanceof ParagraphWidget) {
        //     islastEmptyParagraph = (bodyWidget.lastChild as ParagraphWidget).isEmpty();
        //     if (bodyWidget.lastChild.isSectionBreak && !isNullOrUndefined(bodyWidget.lastChild.previousRenderedWidget) && bodyWidget.lastChild.previousRenderedWidget instanceof TableWidget) {
        //         islastEmptyParagraph = false;
        //     }
        // } 
        // if (!isNullOrUndefined(next) && next instanceof BodyWidget && bodyWidget.sectionIndex !== next.sectionIndex && islastEmptyParagraph) {
        //     var paragraph = {};
        //     paragraph[inlinesProperty[this.keywordIndex]] = [];
        //     section[blocksProperty[this.keywordIndex]].push(paragraph);
        // }
        return next;
    }
    private writeHeaderFooters(hfs: HeaderFooters, section: any): void {
        if (isNullOrUndefined(hfs)) {
            return;
        }
        let headersFooters: any = section[headersFootersProperty[this.keywordIndex]];
        if (!(isNullOrUndefined(hfs[0]) || hfs[0].isEmpty)) {
            headersFooters[headerProperty[this.keywordIndex]] = this.writeHeaderFooter(hfs[0]);
            if (JSON.stringify(headersFooters[headerProperty[this.keywordIndex]]) == "{}") {
                delete headersFooters[headerProperty[this.keywordIndex]];
            }
        }
        if (!(isNullOrUndefined(hfs[1]) || hfs[1].isEmpty)) {
            headersFooters[footerProperty[this.keywordIndex]] = this.writeHeaderFooter(hfs[1]);
            if (JSON.stringify(headersFooters[footerProperty[this.keywordIndex]]) == "{}") {
                delete headersFooters[footerProperty[this.keywordIndex]];
            }
        }
        if (!(isNullOrUndefined(hfs[2]) || hfs[2].isEmpty)) {
            headersFooters[evenHeaderProperty[this.keywordIndex]] = this.writeHeaderFooter(hfs[2]);
            if (JSON.stringify(headersFooters[evenHeaderProperty[this.keywordIndex]]) == "{}") {
                delete headersFooters[evenHeaderProperty[this.keywordIndex]];
            }
        }
        if (!(isNullOrUndefined(hfs[3]) || hfs[3].isEmpty)) {
            headersFooters[evenFooterProperty[this.keywordIndex]] = this.writeHeaderFooter(hfs[3]);
            if (JSON.stringify(headersFooters[evenFooterProperty[this.keywordIndex]]) == "{}") {
                delete headersFooters[evenFooterProperty[this.keywordIndex]];
            }
        }
        if (!(isNullOrUndefined(hfs[4]) || hfs[4].isEmpty)) {
            headersFooters[firstPageHeaderProperty[this.keywordIndex]] = this.writeHeaderFooter(hfs[4]);
            if (JSON.stringify(headersFooters[firstPageHeaderProperty[this.keywordIndex]]) == "{}") {
                delete headersFooters[firstPageHeaderProperty[this.keywordIndex]];
            }
        }
        if (!(isNullOrUndefined(hfs[5]) || hfs[5].isEmpty)) {
            headersFooters[firstPageFooterProperty[this.keywordIndex]] = this.writeHeaderFooter(hfs[5]);
            if (JSON.stringify(headersFooters[firstPageFooterProperty[this.keywordIndex]]) == "{}") {
                delete headersFooters[firstPageFooterProperty[this.keywordIndex]];
            }
        }
    }
    private writeHeaderFooter(widget: HeaderFooterWidget): any {
        if (isNullOrUndefined(widget) || widget.isEmpty) {
            return undefined;
        }
        let headerFooter: any = {};
        if (widget && widget.childWidgets && widget.childWidgets.length > 0) {
            headerFooter[blocksProperty[this.keywordIndex]] = [];
            let firstBlock: BlockWidget = widget.firstChild as BlockWidget;
            do {
                firstBlock = this.writeBlock(firstBlock, 0, headerFooter[blocksProperty[this.keywordIndex]]);
            } while (firstBlock);
        }
        return headerFooter;
    }
    private createSection(bodyWidget: BlockContainer): any {
        let section: any = {};
        section[sectionFormatProperty[this.keywordIndex]] = {};
        section[sectionFormatProperty[this.keywordIndex]] = this.writeSectionFormat(bodyWidget.sectionFormat, section[sectionFormatProperty[this.keywordIndex]], this.keywordIndex);
        section[blocksProperty[this.keywordIndex]] = [];
        section[headersFootersProperty[this.keywordIndex]] = {};
        return section;
    }

    /**
     * @private
     */
    public writeSectionFormat(sectionFormat: WSectionFormat, section: any, keywordIndex: number): any {
        if (this.skipExporting) {
            return section;
        }
        section[pageWidthProperty[keywordIndex]] = sectionFormat.pageWidth;
        section[pageHeightProperty[keywordIndex]] = sectionFormat.pageHeight;
        section[leftMarginProperty[keywordIndex]] = sectionFormat.leftMargin;
        section[rightMarginProperty[keywordIndex]] = sectionFormat.rightMargin;
        section[topMarginProperty[keywordIndex]] = sectionFormat.topMargin;
        section[bottomMarginProperty[keywordIndex]] = sectionFormat.bottomMargin;
        section[headerDistanceProperty[keywordIndex]] = sectionFormat.headerDistance;
        section[footerDistanceProperty[keywordIndex]] = sectionFormat.footerDistance;
        section[differentFirstPageProperty[keywordIndex]] = HelperMethods.getBoolInfo(sectionFormat.differentFirstPage, keywordIndex);
        section[differentOddAndEvenPagesProperty[keywordIndex]] = HelperMethods.getBoolInfo(sectionFormat.differentOddAndEvenPages, keywordIndex);
        section[bidiProperty[keywordIndex]] = HelperMethods.getBoolInfo(sectionFormat.bidi, keywordIndex);
        if (!isNullOrUndefined(sectionFormat.breakCode)) {
            section[breakCodeProperty[keywordIndex]] = sectionFormat.breakCode;
        }
        if (sectionFormat.restartPageNumbering) {
            section[restartPageNumberingProperty[keywordIndex]] = HelperMethods.getBoolInfo(sectionFormat.restartPageNumbering, keywordIndex);
            section[pageStartingNumberProperty[keywordIndex]] = sectionFormat.pageStartingNumber;
        }

        section[endnoteNumberFormatProperty[keywordIndex]] = keywordIndex == 1 ? this.getFootEndNoteNumberFormatEnumValue(sectionFormat.endnoteNumberFormat) : sectionFormat.endnoteNumberFormat;
        section[footNoteNumberFormatProperty[keywordIndex]] = keywordIndex == 1 ? this.getFootEndNoteNumberFormatEnumValue(sectionFormat.footNoteNumberFormat) : sectionFormat.footNoteNumberFormat;
        section[restartIndexForFootnotesProperty[keywordIndex]] = keywordIndex == 1 ? this.getFootnoteRestartIndexEnumValue(sectionFormat.restartIndexForFootnotes) : sectionFormat.restartIndexForFootnotes;
        section[restartIndexForEndnotesProperty[keywordIndex]] = keywordIndex == 1 ? this.getFootnoteRestartIndexEnumValue(sectionFormat.restartIndexForEndnotes) : sectionFormat.restartIndexForEndnotes;
        section[initialFootNoteNumberProperty[keywordIndex]] = sectionFormat.initialFootNoteNumber;
        section[initialEndNoteNumberProperty[keywordIndex]] = sectionFormat.initialEndNoteNumber;

        if(!isNullOrUndefined(sectionFormat.pageNumberStyle)) {
            section[pageNumberStyleProperty[keywordIndex]] = sectionFormat.pageNumberStyle;
        }
        if(!isNullOrUndefined(sectionFormat.columns) && !isNullOrUndefined(sectionFormat.numberOfColumns && sectionFormat.numberOfColumns > 1 )) {
            let cols: WColumnFormat[] = sectionFormat.columns;
            section[numberOfColumnsProperty[keywordIndex]] = sectionFormat.numberOfColumns;
            section[equalWidthProperty[keywordIndex]] = HelperMethods.getBoolInfo(sectionFormat.equalWidth, keywordIndex);
            section[lineBetweenColumnsProperty[keywordIndex]] = HelperMethods.getBoolInfo(sectionFormat.lineBetweenColumns, keywordIndex);
            section[columnsProperty[keywordIndex]] = [];
            for (let i: number = 0; i < cols.length; i++) {
                let newCol: any = {};
                newCol[widthProperty[keywordIndex]] = HelperMethods.convertPixelToPoint(cols[i].width as number);
                newCol[spaceProperty[keywordIndex]] = HelperMethods.convertPixelToPoint(cols[i].space as number);
                section[columnsProperty[keywordIndex]].push(newCol);
            }
        }
        return section;
    }

    private writeBlock(widget: BlockWidget, index: number, blocks: any): BlockWidget {
        if (!(widget instanceof BlockWidget)) {
            return undefined;
        }
        if (widget instanceof ParagraphWidget) {
            if (widget.hasOwnProperty('contentControlProperties') && widget.contentControlProperties && widget.contentControlProperties.type !== 'BuildingBlockGallery') {
                let block: any = this.blockContentControl(widget);
                this.blockContent = false;
                if (!isNullOrUndefined(block) && (this.isBlockClosed || !this.nestedBlockContent)) {
                    this.nestedBlockEnabled = false;
                    blocks.push(block);
                    this.blocks = [];
                }
                return this.nextBlock;
            } else {
                let paragraph: any = this.createParagraph(widget);
                blocks.push(paragraph);
                return this.writeParagraph(widget, paragraph, blocks);
            }
        } else {
            let tableWidget: TableWidget = widget as TableWidget;
            if (tableWidget.hasOwnProperty('contentControlProperties') && tableWidget.contentControlProperties && tableWidget.contentControlProperties.type !== 'BuildingBlockGallery') {
                let block: any = this.tableContentControl(tableWidget);
                if (!isNullOrUndefined(block) && this.isBlockClosed) {
                    blocks.push(block);
                }
                return this.nextBlock;
            }
            let table: any = this.createTable(tableWidget);
            blocks.push(table);
            return this.writeTable(tableWidget, table, 0, blocks);
        }
    }
    private writeParagraphs(widget: ParagraphWidget): any {
        let blocks: any = this.blocks;
        let child: LineWidget = widget.childWidgets[0] as LineWidget;
        let firstElement: ElementBox = child.children[0];
        let secondElement: ElementBox = child.children[1];
        if (firstElement instanceof ListTextElementBox || secondElement instanceof ListTextElementBox) {
            firstElement = child.children[2];
            secondElement = child.children[3];
        }
        if (this.nestedBlockEnabled) {
            blocks = [];
        }
        if ((firstElement instanceof ContentControl && secondElement instanceof ContentControl && !this.nestedBlockContent) || (this.blockContent && firstElement instanceof ContentControl && !this.nestedBlockContent)) {
            let nestedBlocks: boolean = false;
            if (secondElement instanceof ContentControl) {
                if ((secondElement as ContentControl).contentControlWidgetType === 'Block') {
                    nestedBlocks = true;
                }
            }
            if ((nestedBlocks || (this.blockContent && firstElement instanceof ContentControl && !this.nestedBlockContent && (firstElement as ContentControl).type === 0 && secondElement instanceof ContentControl && (firstElement as ContentControl).contentControlWidgetType === 'Block'))) {
                this.nestedBlockContent = true;
                this.nestedBlockEnabled = true;
                let block: any = this.blockContentControl(widget);
                if (!isNullOrUndefined(block)) {
                    this.blocks.push(block);
                }
            } else {
                let paragraph: any = this.createParagraph(widget);
                blocks.push(paragraph);
                this.nextBlock = this.writeParagraph(widget, paragraph, blocks);
            }
        } else {
            let paragraph: any = this.createParagraph(widget);
            blocks.push(paragraph);
            this.nextBlock = this.writeParagraph(widget, paragraph, blocks);
        }
        if (!this.nestedBlockContent && this.nestedBlockEnabled) {
            this.nestedBlockEnabled = false;
        }
        return blocks;
    }
    /**
     * @private
     */
    public contentControlProperty(contentControlPropertie: ContentControlProperties, keywordIndex?: number): any {
        if (isNullOrUndefined(keywordIndex)) {
            keywordIndex = this.keywordIndex;
        }
        let contentControlProperties: any = {};
        let contentControlListItems: any = [];
        contentControlProperties[lockContentControlProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.lockContentControl, keywordIndex);
        contentControlProperties[lockContentsProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.lockContents, keywordIndex);
        contentControlProperties[tagProperty[keywordIndex]] = contentControlPropertie.tag;
        contentControlProperties[colorProperty[keywordIndex]] = contentControlPropertie.color;
        contentControlProperties[titleProperty[keywordIndex]] = contentControlPropertie.title;
        if (!isNullOrUndefined(contentControlPropertie.appearance)) {
            contentControlProperties[appearanceProperty[keywordIndex]] = keywordIndex == 1 ? this.getContentControlAppearanceEnumValue(contentControlPropertie.appearance) : contentControlPropertie.appearance;
        }
        contentControlProperties[typeProperty[keywordIndex]] = keywordIndex == 1 ? this.getContentControlTypeEnumValue(contentControlPropertie.type) : contentControlPropertie.type;
        contentControlProperties[hasPlaceHolderTextProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.hasPlaceHolderText, keywordIndex);
        contentControlProperties[multiLineProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.multiline, keywordIndex);
        contentControlProperties[isTemporaryProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.isTemporary, keywordIndex);
        if (!isNullOrUndefined(contentControlPropertie.isChecked)) {
            contentControlProperties[isCheckedProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.isChecked, keywordIndex);
        }
        if (!isNullOrUndefined(contentControlPropertie.uncheckedState)) {
            contentControlProperties[uncheckedStateProperty[keywordIndex]] = this.tounCheckedState(contentControlPropertie.uncheckedState);
        }
        if (!isNullOrUndefined(contentControlPropertie.checkedState)) {
            contentControlProperties[checkedStateProperty[keywordIndex]] = this.toCheckedState(contentControlPropertie.checkedState);
        }
        if (!isNullOrUndefined(contentControlPropertie.dateCalendarType)) {
            contentControlProperties[dateCalendarTypeProperty[keywordIndex]] = keywordIndex == 1 ? this.getDateCalendarTypeEnumValue(contentControlPropertie.dateCalendarType) : contentControlPropertie.dateCalendarType;
        }
        if (!isNullOrUndefined(contentControlPropertie.dateStorageFormat)) {
            contentControlProperties[dateStorageFormatProperty[keywordIndex]] = keywordIndex == 1 ? this.getDateStorageFormatEnumValue(contentControlPropertie.dateStorageFormat) : contentControlPropertie.dateStorageFormat;
        }
        if (!isNullOrUndefined(contentControlPropertie.dateDisplayLocale)) {
            contentControlProperties[dateDisplayLocaleProperty[keywordIndex]] = contentControlPropertie.dateDisplayLocale;
        }
        if (!isNullOrUndefined(contentControlPropertie.dateDisplayFormat)) {
            contentControlProperties[dateDisplayFormatProperty[keywordIndex]] = contentControlPropertie.dateDisplayFormat;
        }
        if (!isNullOrUndefined(contentControlPropertie.xmlMapping)) {
            let xmlMapping: any = {};
            let customXmlPart: any = {};
            xmlMapping[isMappedProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.xmlMapping.isMapped, keywordIndex);
            xmlMapping[isWordMlProperty[keywordIndex]] = HelperMethods.getBoolInfo(contentControlPropertie.xmlMapping.isWordMl, keywordIndex);
            if (!isNullOrUndefined(contentControlPropertie.xmlMapping.prefixMapping)) {
                xmlMapping[prefixMappingProperty[keywordIndex]] = contentControlPropertie.xmlMapping.prefixMapping;
            }
            xmlMapping[xPathProperty[keywordIndex]] = contentControlPropertie.xmlMapping.xPath;
            xmlMapping[storeItemIdProperty[keywordIndex]] = contentControlPropertie.xmlMapping.storeItemId;
            if (!isNullOrUndefined(contentControlPropertie.xmlMapping.customXmlPart)) {
                customXmlPart[idProperty[keywordIndex]] = contentControlPropertie.xmlMapping.customXmlPart.id;
                customXmlPart[xmlProperty[keywordIndex]] = contentControlPropertie.xmlMapping.customXmlPart.xml;
                xmlMapping[customXmlPartProperty[keywordIndex]] = customXmlPart;
            }
            contentControlProperties[xmlMappingProperty[keywordIndex]] = xmlMapping;
        }
        if (!isNullOrUndefined(contentControlPropertie.characterFormat)) {
            contentControlProperties[characterFormatProperty[keywordIndex]] = this.writeCharacterFormat(contentControlPropertie.characterFormat, keywordIndex);
        }
        if (!isNullOrUndefined(contentControlPropertie.contentControlListItems)) {
            for (let i: number = 0; i < contentControlPropertie.contentControlListItems.length; i++) {
                let listItems: any = {};
                listItems[displayTextProperty[keywordIndex]] = contentControlPropertie.contentControlListItems[i].displayText;
                listItems[valueProperty[keywordIndex]] = contentControlPropertie.contentControlListItems[i].value;
                contentControlListItems.push(listItems);
            }
        }
        contentControlProperties[contentControlListItemsProperty[keywordIndex]] = contentControlListItems;
        return contentControlProperties;
    }
    private tounCheckedState(state: any): any {
        let unCheckedState: any = {};
        unCheckedState[fontProperty[this.keywordIndex]] = state.font;
        unCheckedState[valueProperty[this.keywordIndex]] = state.value;
        return unCheckedState;
    }
    private toCheckedState(state: any): any {
        let checkedState: any = {};
        checkedState[fontProperty[this.keywordIndex]] = state.font;
        checkedState[valueProperty[this.keywordIndex]] = state.value;
        return checkedState;
    }
    private blockContentControl(widget: ParagraphWidget): any {
        let block: any = {};
        if (widget.childWidgets.length === 0) {
            this.nextBlock = widget.nextWidget;
            return undefined;
        }
        if (!this.isBlockClosed && this.nestedBlockContent && !isNullOrUndefined(widget.associatedCell) && !isNullOrUndefined(widget.associatedCell.ownerTable)
            && !isNullOrUndefined(widget.associatedCell.ownerTable.contentControlProperties)) {
            this.nestedBlockEnabled = true;
        }
        block[blocksProperty[this.keywordIndex]] = this.writeParagraphs(widget);    
        if (!isNullOrUndefined(this.nextBlock)) {
            if (widget.contentControlProperties === this.nextBlock.contentControlProperties) {
                this.isBlockClosed = false;
                this.nestedBlockContent = true;
                return this.blocks = block[blocksProperty[this.keywordIndex]];
            } else {
                this.isBlockClosed = true;
            }
        } else {
            this.isBlockClosed = true;
        }
        if (!isNullOrUndefined(block[blocksProperty[this.keywordIndex]])) {
            let child: LineWidget = widget.childWidgets[0] as LineWidget;
            let firstChild: ElementBox = child.children[0];
            let secondChild: ElementBox = child.children[1];
            if (firstChild instanceof ListTextElementBox || secondChild instanceof ListTextElementBox) {
                firstChild = child.children[2];
                secondChild = child.children[3];
            }
            if ((firstChild instanceof ContentControl && secondChild instanceof ContentControl && !this.nestedBlockContent) || (this.blockContent && firstChild instanceof ContentControl && !this.nestedBlockContent)) {
                if (!(secondChild instanceof ContentControl)) {
                    block[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(firstChild.contentControlProperties);
                    return block;
                } else if ((secondChild as ContentControl).contentControlWidgetType === 'Block') {
                    block[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(secondChild.contentControlProperties);
                } else {
                    block[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(widget.contentControlProperties);
                }
            } else {
                block[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(widget.contentControlProperties);
            }
            return block;
        }
    }
    private tableContentControl(tableWidget: TableWidget): any {
        let block: any = {};
        block[blocksProperty[this.keywordIndex]] = this.tableContentControls(tableWidget);
        if (!isNullOrUndefined(this.nextBlock)) {
            if (tableWidget.contentControlProperties === this.nextBlock.contentControlProperties) {
                this.isBlockClosed = false;
                return this.blocks = block[blocksProperty[this.keywordIndex]];
            } else {
                this.isBlockClosed = true;
            }
        }
        block[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(tableWidget.contentControlProperties);        
        return block;
    }
    private tableContentControls(tableWidget: TableWidget): any {
        let blocks: any = [];
        if (!this.isBlockClosed) {
            blocks = this.blocks;
        }
        let table: any = this.createTable(tableWidget);
        blocks.push(table);
        this.nextBlock = this.writeTable(tableWidget, table, 0, blocks);
        return blocks;
    }
    private writeParagraph(paragraphWidget: ParagraphWidget, paragraph: any, blocks: any, lineIndex?: number, start?: number): BlockWidget {
        if (isNullOrUndefined(lineIndex)) {
            lineIndex = 0;
        }
        if (isNullOrUndefined(start)) {
            start = 0;
        }
        let next: BlockWidget = paragraphWidget;
        while (next instanceof ParagraphWidget) {
            if (this.writeLines(next, lineIndex, start, paragraph[inlinesProperty[this.keywordIndex]])) {
                if (this.endLine === next.lastChild && this.endOffset === this.owner.selection.getLineLength(next.lastChild as LineWidget) + 1 && next.paragraphFormat.listFormat.listId === -1 && !this.isContentControl) {
                    blocks.push(this.createParagraph(next));
                }
                return undefined;
            }
            lineIndex = 0;
            start = 0;
            paragraphWidget = next;
            next = paragraphWidget.nextSplitWidget as ParagraphWidget;
        }
        next = paragraphWidget.nextRenderedWidget as BlockWidget;
        if (this.documentHelper.owner.layoutType !== 'Continuous' && isNullOrUndefined(next) && paragraphWidget.containerWidget instanceof BodyWidget &&
            !isNullOrUndefined((paragraphWidget.containerWidget as BodyWidget).page) && !isNullOrUndefined((paragraphWidget.containerWidget as BodyWidget).page.nextPage) &&
            !isNullOrUndefined((paragraphWidget.containerWidget as BodyWidget).page.nextPage.bodyWidgets)) {
            next = (paragraphWidget.containerWidget as BodyWidget).page.nextPage.bodyWidgets[0].childWidgets[0] as BlockWidget;
        }
        if (this.isExport) {
            const isSameContainer = next instanceof BlockWidget && paragraphWidget.containerWidget.index === next.containerWidget.index;
            const isTableCell = next instanceof BlockWidget && next.containerWidget instanceof TableCellWidget;
            return (isSameContainer || isTableCell) ? next : undefined;
        } else {
            return next;
        }
    }
    private writeInlines(paragraph: ParagraphWidget, line: LineWidget, inlines: any): void {
        this.contentInline = [];
        let lineWidget: LineWidget = line;
        let isformField: boolean = false;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let element: ElementBox = lineWidget.children[i];
            if (this.isExport && this.checkboxOrDropdown) {
                if (isformField && element instanceof TextElementBox) {
                    continue;
                }
                if (element instanceof FieldElementBox && element.fieldType === 2) {
                    isformField = true;
                }
            }
            if (element instanceof ListTextElementBox) {
                continue;
            }
            if (element instanceof FootnoteElementBox) {
                inlines.push(this.writeInlinesFootNote(element));
                continue;
            }
            if (element instanceof ContentControl || this.startContent || this.blockContent) {
                this.writeInlinesContentControl(element, line, inlines, i);
            } else {
                if (!this.skipExporting && element instanceof TextElementBox && !isNullOrUndefined(element.previousNode) && element.previousNode instanceof TextElementBox
                    && !this.isSpecialCharacter(element.text) && !this.isSpecialCharacter(element.previousNode.text)
                    && element.previousNode.characterFormat.isEqualFormat(element.characterFormat)
                    && element.previousNode.scriptType === element.scriptType
                    && element.revisions.length === 0 && element.previousNode.revisions.length === 0
                    && (element.previousNode.text.length > 0 && element.previousNode.text[element.previousNode.text.length - 1] !== '-')
                    && inlines.length > 0) {
                    let elementText: string = element.text;
                    if (!this.isWriteEndFootNote && (isNullOrUndefined(this.owner.editorModule) || !this.owner.editorModule.isPaste)) {
                        elementText = HelperMethods.removeInvalidXmlChars(elementText);
                    }
                    if (this.isWriteInlinesFootNote && element.indexInOwner === 0 && element.line.indexInOwner === 0
                        && element.paragraph.indexInOwner == 0 && HelperMethods.checkTextFormat(elementText)) {
                        elementText = "\u0002";
                    }
                    // replacing the no break hyphen character by '-'
                    if (elementText.indexOf(String.fromCharCode(30)) !== -1) {
                        elementText.replace(/\u001e/g, '-');
                    } else if (elementText.indexOf(String.fromCharCode(31)) !== -1) {
                        elementText.replace(/\u001f/g, '');
                    }
                    inlines[inlines.length - 1][textProperty[this.keywordIndex]] += elementText;
                } else {
                    let inline: any = this.writeInline(element);
                    if (!isNullOrUndefined(inline)) {
                        inlines.push(inline);
                    }
                }
            }
            if (this.isExport && element instanceof FieldElementBox && element.fieldType === 1) {
                isformField = false;
                this.checkboxOrDropdown = false;
            }
        }
    }
    private isSpecialCharacter(text: string): boolean {
        const specialChars: string[] = ['\t', '\v', '\f', '\r', String.fromCharCode(14), String.fromCharCode(31), String.fromCharCode(8194)];
        return specialChars.indexOf(text) !== -1;
    }
    private inlineContentControl(element: ElementBox, nextElement: any, inlines?: any): any {
        let inline: any = {};
        let nestedContentInline: any = [];
        if (!isNullOrUndefined(inlines)) {
            if (this.nestedContent) {
                inlines = inlines[inlines.length - 1][inlinesProperty[this.keywordIndex]];
                if(inlines[inlines.length - 1][inlinesProperty[this.keywordIndex]]==undefined){
                    inlines[inlines.length - 1][inlinesProperty[this.keywordIndex]] = [];
                }
                // if (isNullOrUndefined(inlines[inlines.length - 1][inlinesProperty[this.keywordIndex]])) {
                //     let nestInlines:any =[];
                //     // nestInlines.inlines=[];
                //     let inlineObject:{}={[inlinesProperty[this.keywordIndex]]:nestInlines}
                //     inlines.push(inlineObject);
                // }
                inline = this.inlineContentControls(element, inlines[inlines.length - 1][inlinesProperty[this.keywordIndex]]);
                let nestedContentinline: any = this.nestedContentProperty(nextElement, inlines[inlines.length - 1]);
                if (!isNullOrUndefined(nestedContentinline)) {
                    this.contentInline.push(inline);
                    nestedContentInline = [];
                }
            } else {
                this.inlineContentControls(element, inlines[inlines.length - 1][inlinesProperty[this.keywordIndex]]);
            }
        } else {
            if (this.nestedContent) {
                inline[inlinesProperty[this.keywordIndex]] = this.inlineContentControls(element, undefined, nestedContentInline);
                let nestedContentinline: any = this.nestedContentProperty(nextElement, inline);
                if (!isNullOrUndefined(nestedContentinline) || this.multipleLineContent) {
                    this.contentInline.push(inline);
                    nestedContentInline = [];
                }
            } else {
                inline[inlinesProperty[this.keywordIndex]] = this.inlineContentControls(element, this.contentInline);
            }
        }
        if (nextElement instanceof ContentControl && nextElement.type === 1 && !this.nestedContent) {
            if (this.multipleLineContent && !isNullOrUndefined(inlines)) {
                inlines[inlines.length - 1][contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(nextElement.contentControlProperties);
                this.multipleLineContent = false;
                return;
            } else {
                inline[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(nextElement.contentControlProperties);
            }
            return inline;
        } else if (this.startContent) {
            this.multipleLineContent = true;
            return inline;
        }
    }
    private nestedContentProperty(nextElement: any, inline: any, inlines?: any): any {
        if (!isNullOrUndefined(nextElement)) {
            if (nextElement.type === 1) {
                inline[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(nextElement.contentControlProperties);
                return inline;
            } else if (this.startContent) {
                this.multipleLineContent = true;
                return inline;
            }
        } else if (this.startContent) {
            this.multipleLineContent = true;
            return inline;
        }
    }
    private inlineContentControls(element: ElementBox, contentInline: any, nestedContentInline?: any): any {
        let inline: any = this.writeInline(element);
        if (!isNullOrUndefined(nestedContentInline)) {
            nestedContentInline.push(inline);
            return nestedContentInline;
        }
        contentInline.push(inline);
        return contentInline;
    }
    /* eslint-disable  */
    private writeInline(element: ElementBox): any {
        let inline: any = {};
        if (element.removedIds.length > 0) {
            for (let i: number = 0; i < element.removedIds.length; i++) {
                element.revisions[i] = this.documentHelper.revisionsInternal.get(element.removedIds[i]);
            }
        }
        inline[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat(element.characterFormat, this.keywordIndex);
        if (element instanceof FieldElementBox) {
            inline[fieldTypeProperty[this.keywordIndex]] = element.fieldType;
            if (element.fieldType === 0) {
                inline[hasFieldEndProperty[this.keywordIndex]] = element.hasFieldEnd;
                if (element.formFieldData) {
                    inline[formFieldDataProperty[this.keywordIndex]] = {};
                    inline[formFieldDataProperty[this.keywordIndex]][nameProperty[this.keywordIndex]] = element.formFieldData.name;
                    inline[formFieldDataProperty[this.keywordIndex]][enabledProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.formFieldData.enabled, this.keywordIndex);
                    inline[formFieldDataProperty[this.keywordIndex]][helpTextProperty[this.keywordIndex]] = element.formFieldData.helpText;
                    inline[formFieldDataProperty[this.keywordIndex]][statusTextProperty[this.keywordIndex]] = element.formFieldData.statusText;
                    if (element.formFieldData instanceof TextFormField) {
                        inline[formFieldDataProperty[this.keywordIndex]][textInputProperty[this.keywordIndex]] = {};
                        inline[formFieldDataProperty[this.keywordIndex]][textInputProperty[this.keywordIndex]][typeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTextFormFieldTypeEnumValue((element.formFieldData as TextFormField).type) : (element.formFieldData as TextFormField).type;
                        inline[formFieldDataProperty[this.keywordIndex]][textInputProperty[this.keywordIndex]][maxLengthProperty[this.keywordIndex]] = (element.formFieldData as TextFormField).maxLength;
                        inline[formFieldDataProperty[this.keywordIndex]][textInputProperty[this.keywordIndex]][defaultValueProperty[this.keywordIndex]] = (element.formFieldData as TextFormField).defaultValue;
                        inline[formFieldDataProperty[this.keywordIndex]][textInputProperty[this.keywordIndex]][formatProperty[this.keywordIndex]] = this.keywordIndex == 1 && (element.formFieldData as TextFormField).type === 'Text' ? this.getTextFormFieldFormatEnumValue((element.formFieldData as TextFormField).format) : (element.formFieldData as TextFormField).format;
                    } else if (element.formFieldData instanceof CheckBoxFormField) {
                        inline[formFieldDataProperty[this.keywordIndex]][checkBoxProperty[this.keywordIndex]] = {};
                        this.checkboxOrDropdown = true;
                        inline[formFieldDataProperty[this.keywordIndex]][checkBoxProperty[this.keywordIndex]][sizeTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getCheckBoxSizeTypeEnumValue((element.formFieldData as CheckBoxFormField).sizeType) : (element.formFieldData as CheckBoxFormField).sizeType;
                        inline[formFieldDataProperty[this.keywordIndex]][checkBoxProperty[this.keywordIndex]][sizeProperty[this.keywordIndex]] = (element.formFieldData as CheckBoxFormField).size;
                        inline[formFieldDataProperty[this.keywordIndex]][checkBoxProperty[this.keywordIndex]][defaultValueProperty[this.keywordIndex]] = HelperMethods.getBoolInfo((element.formFieldData as CheckBoxFormField).defaultValue, this.keywordIndex);
                        inline[formFieldDataProperty[this.keywordIndex]][checkBoxProperty[this.keywordIndex]][checkedProperty[this.keywordIndex]] = HelperMethods.getBoolInfo((element.formFieldData as CheckBoxFormField).checked, this.keywordIndex);
                    } else {
                        inline[formFieldDataProperty[this.keywordIndex]][dropDownListProperty[this.keywordIndex]] = {};
                        this.checkboxOrDropdown = true;
                        inline[formFieldDataProperty[this.keywordIndex]][dropDownListProperty[this.keywordIndex]][dropDownItemsProperty[this.keywordIndex]] = (element.formFieldData as DropDownFormField).dropdownItems;
                        inline[formFieldDataProperty[this.keywordIndex]][dropDownListProperty[this.keywordIndex]][selectedIndexProperty[this.keywordIndex]] = (element.formFieldData as DropDownFormField).selectedIndex;
                    }
                }
            }
            if (element.fieldCodeType && element.fieldCodeType !== '') {
                inline.fieldCodeType = element.fieldCodeType;
            }
        } else if (element instanceof ChartElementBox) {
            this.writeChart(element, inline);
        } else if (element instanceof ImageElementBox) {
            inline[imageStringProperty[this.keywordIndex]] = element.imageString;
            this.images.push(parseInt(element.imageString, 10));
            inline[metaFileImageStringProperty[this.keywordIndex]] = element.metaFileImageString;
            inline[isMetaFileProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.isMetaFile, this.keywordIndex);
            inline[isCompressedProperty[this.keywordIndex]] = element.isCompressed;
            if (isNaN(element.width)) {
                inline[widthProperty[this.keywordIndex]] = element.width.toString();
            }
            else {
                inline[widthProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.width);
            }
            if (isNaN(element.height)) {
                inline[heightProperty[this.keywordIndex]] = element.height.toString();
            }
            else {
                inline[heightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.height);
            }
            //inline.iscrop = element.isCrop;
            if (element.isCrop) {
                inline[bottomProperty[this.keywordIndex]] = element.bottom;
                inline[rightProperty[this.keywordIndex]] = element.right;
                inline[leftProperty[this.keywordIndex]] = element.left;
                inline[topProperty[this.keywordIndex]] = element.top;
                inline[getImageWidthProperty[this.keywordIndex]] = element.cropWidthScale;
                inline[getImageHeightProperty[this.keywordIndex]] = element.cropHeightScale;
            }
            inline[nameProperty[this.keywordIndex]] = element.name;
            inline[alternativeTextProperty[this.keywordIndex]] = element.alternateText;
            inline[titleProperty[this.keywordIndex]] = element.title;
            inline[visibleProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.visible, this.keywordIndex);
            inline[widthScaleProperty[this.keywordIndex]] = element.widthScale;
            inline[heightScaleProperty[this.keywordIndex]] = element.heightScale;
            inline[verticalPositionProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.verticalPosition);
            inline[verticalOriginProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getVerticalOriginEnumValue(element.verticalOrigin) : element.verticalOrigin;
            inline[verticalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getShapeVerticalAlignmentEnumValue(element.verticalAlignment) : element.verticalAlignment;
            inline[horizontalPositionProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.horizontalPosition);
            inline[horizontalOriginProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getHorizontalOriginEnumValue(element.horizontalOrigin) : element.horizontalOrigin;
            inline[horizontalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getShapeHorizontalAlignmentEnumValue(element.horizontalAlignment) : element.horizontalAlignment;
            inline[allowOverlapProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.allowOverlap, this.keywordIndex);
            inline[textWrappingStyleProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTextWrappingStyleEnumValue(element.textWrappingStyle) : element.textWrappingStyle;
            inline[textWrappingTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTextWrappingTypeEnumValue(element.textWrappingType) : element.textWrappingType;
            inline[belowTextProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.isBelowText, this.keywordIndex);
            if(!isNullOrUndefined(element.distanceBottom)) {
                inline[distanceBottomProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceBottom);
            }
            if(!isNullOrUndefined(element.distanceLeft)) {
                inline[distanceLeftProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceLeft);
            }
            if(!isNullOrUndefined(element.distanceRight)) {
                inline[distanceRightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceRight);
            }
            if(!isNullOrUndefined(element.distanceTop)) {
                inline[distanceTopProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceTop);
            }
            inline[layoutInCellProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.layoutInCell, this.keywordIndex);
            inline[zOrderPositionProperty[this.keywordIndex]] = element.zOrderPosition;
        } else if (element instanceof BookmarkElementBox) {
            inline[bookmarkTypeProperty[this.keywordIndex]] = element.bookmarkType;
            inline[nameProperty[this.keywordIndex]] = element.name;
            if (!isNullOrUndefined(element.properties)) {
                let properties: any = {};
                if (!isNullOrUndefined(element.properties['isAfterParagraphMark'])) {
                    properties[isAfterParagraphMarkProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.properties['isAfterParagraphMark'], this.keywordIndex);
                }
                if (!isNullOrUndefined(element.properties['isAfterTableMark'])) {
                    properties[isAfterTableMarkProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.properties['isAfterTableMark'], this.keywordIndex);
                }
                if (!isNullOrUndefined(element.properties['isAfterRowMark'])) {
                    properties[isAfterRowMarkProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.properties['isAfterRowMark'], this.keywordIndex);
                }
                if (!isNullOrUndefined(element.properties['isAfterCellMark'])) {
                    properties[isAfterCellMarkProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.properties['isAfterCellMark'], this.keywordIndex);
                }
                if (!isNullOrUndefined(element.properties['columnFirst'])) {
                    properties[columnFirstProperty[this.keywordIndex]] = element.properties['columnFirst'];
                }
                if (!isNullOrUndefined(element.properties['columnLast'])) {
                    properties[columnLastProperty[this.keywordIndex]] = element.properties['columnLast'];
                }
                inline[propertiesProperty[this.keywordIndex]] = properties;
            }
        } else if (element instanceof BreakElementBox) {
            inline[breakClearTypeProperty[this.keywordIndex]] = this.keywordIndex == 1? HelperMethods.getBreakClearType(element.breakClearType): element.breakClearType;
        } else if (element instanceof FootnoteElementBox) {
            inline = this.writeInlinesFootNote(element)
        } else if (element instanceof TextElementBox) {
            let elementText: string = element.text;
            if (!this.isWriteEndFootNote && (isNullOrUndefined(this.owner.editorModule) || !this.owner.editorModule.isPaste)) {
                elementText = HelperMethods.removeInvalidXmlChars(elementText);
            }
            if(this.isWriteInlinesFootNote
                && element.indexInOwner === 0
                && element.line.indexInOwner === 0
                && element.paragraph.indexInOwner == 0
                && HelperMethods.checkTextFormat(elementText)) {
                elementText = "\u0002";
            }
            // replacing the no break hyphen character by '-'
            if (elementText.indexOf(String.fromCharCode(30)) !== -1) {
                inline[textProperty[this.keywordIndex]] = elementText.replace(/\u001e/g, '-');
            } else if (elementText.indexOf(String.fromCharCode(31)) !== -1) {
                inline[textProperty[this.keywordIndex]] = elementText.replace(/\u001f/g, '');
            } else if (element instanceof FootnoteEndnoteMarkerElementBox) {
                inline[textProperty[this.keywordIndex]] = '\u0002';
            }else if (element.revisions.length !== 0) {
                if (!this.isExport && this.owner.enableTrackChanges && !this.isPartialExport) {
                    this.copyWithTrackChange = true;
                    for (let x: number = 0; x < element.revisions.length; x++) {
                        let revision: Revision = element.revisions[x];
                        if (this.selectedRevisionId.indexOf(revision.revisionID) === -1) {
                            this.selectedRevisionId.push(revision.revisionID);
                        }
                        if (element.revisions[x].revisionType !== 'Deletion') {
                            inline[textProperty[this.keywordIndex]] = elementText;
                        }
                    }
                } else {
                    inline[textProperty[this.keywordIndex]] = elementText;
                }
            } else {
                inline[textProperty[this.keywordIndex]] = elementText;
            }
        } else if (element instanceof EditRangeStartElementBox) {
            if(element.user !== ''){
                inline[userProperty[this.keywordIndex]] = element.user;
            }
            inline[groupProperty[this.keywordIndex]] = element.group;
            inline[columnFirstProperty[this.keywordIndex]] = element.columnFirst;
            inline[columnLastProperty[this.keywordIndex]] = element.columnLast;
            inline[editRangeIdProperty[this.keywordIndex]] = element.editRangeId.toString();
        } else if (element instanceof EditRangeEndElementBox) {
            inline[editableRangeStartProperty[this.keywordIndex]] = {};
            inline[editableRangeStartProperty[this.keywordIndex]][userProperty[this.keywordIndex]] = element.editRangeStart.user;
            inline[editableRangeStartProperty[this.keywordIndex]][groupProperty[this.keywordIndex]] = element.editRangeStart.group;
            inline[editableRangeStartProperty[this.keywordIndex]][columnFirstProperty[this.keywordIndex]] = element.editRangeStart.columnFirst;
            inline[editableRangeStartProperty[this.keywordIndex]][columnLastProperty[this.keywordIndex]] = element.editRangeStart.columnLast;
            inline[editRangeIdProperty[this.keywordIndex]] = element.editRangeId.toString();
        } else if (element instanceof CommentCharacterElementBox) {
            if(this.iscontentInsert) {
                if (!this.isExport && element.commentType === 0) {
                    this.selectedCommentsId.push(element.commentId);
                }
                inline[commentCharacterTypeProperty[this.keywordIndex]] = element.commentType;
                inline[commentIdProperty[this.keywordIndex]] = element.commentId;
            } else {
                return undefined;
            }
        } else if (element instanceof ShapeElementBox) {
            this.writeShape(element, inline);
        } else {
            inline = undefined;
        }
        this.writeInlineRevisions(inline, element);
        /*if(element.removedIds.length > 0){
            inline.revisionIds = [];
            for(let x:number = 0;x < element.removedIds.length; x++){
            inline.revisionIds.push(element.removedIds);
            }
        }*/
        return inline;
    }
    private writeInlineRevisions(inline: any, element: ElementBox): void {
        if ((element.revisions.length > 0) && (this.isExport || !this.isExport && !this.owner.enableTrackChanges)) {
            inline[revisionIdsProperty[this.keywordIndex]] = [];
            for (let x: number = 0; x < element.revisions.length; x++) {
                //revisionIdes[x] = element.revisions[x];
                if (this.selectedRevisionId.indexOf(element.revisions[x].revisionID) === -1) {
                    this.selectedRevisionId.push(element.revisions[x].revisionID);
                }
                inline[revisionIdsProperty[this.keywordIndex]].push(element.revisions[x].revisionID);
                //this.document.revisionIdes.push(inline.revisionIds)
            }
        }
    }
    private writeShape(element: ShapeElementBox, inline: any): void {
        inline[shapeIdProperty[this.keywordIndex]] = element.shapeId;
        inline[nameProperty[this.keywordIndex]] = element.name;
        inline[alternativeTextProperty[this.keywordIndex]] = element.alternateText;
        inline[titleProperty[this.keywordIndex]] = element.title;
        inline[visibleProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.visible, this.keywordIndex);
        inline[widthProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.width);
        inline[heightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.height);
        if (element.isZeroHeight) {
            inline[heightProperty[this.keywordIndex]] = 0;
        } else {
            inline[heightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.height);
        }
        inline[widthScaleProperty[this.keywordIndex]] = element.widthScale;
        inline[heightScaleProperty[this.keywordIndex]] = element.heightScale;
        inline[verticalPositionProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.verticalPosition);
        inline[verticalOriginProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getVerticalOriginEnumValue(element.verticalOrigin) : element.verticalOrigin;
        inline[verticalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getShapeVerticalAlignmentEnumValue(element.verticalAlignment) : element.verticalAlignment;
        inline[verticalRelativePercentProperty[this.keywordIndex]] = element.verticalRelativePercent;
        inline[horizontalPositionProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.horizontalPosition);
        inline[horizontalOriginProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getHorizontalOriginEnumValue(element.horizontalOrigin) : element.horizontalOrigin;
        inline[horizontalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getShapeHorizontalAlignmentEnumValue(element.horizontalAlignment) : element.horizontalAlignment;
        inline[horizontalRelativePercentProperty[this.keywordIndex]] = element.horizontalRelativePercent;
        inline[heightRelativePercentProperty[this.keywordIndex]] = element.heightRelativePercent;
        inline[widthRelativePercentProperty[this.keywordIndex]] = element.widthRelativePercent;
        inline[zOrderPositionProperty[this.keywordIndex]] = element.zOrderPosition;
        inline[allowOverlapProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.allowOverlap, this.keywordIndex);
        inline[textWrappingStyleProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTextWrappingStyleEnumValue(element.textWrappingStyle) : element.textWrappingStyle;
        inline[textWrappingTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTextWrappingTypeEnumValue(element.textWrappingType) : element.textWrappingType;
        inline[belowTextProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.isBelowText, this.keywordIndex);
        inline[horizontalRuleProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.isHorizontalRule, this.keywordIndex);
        if(!isNullOrUndefined(element.distanceBottom)) {
            inline[distanceBottomProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceBottom);
        }
        if(!isNullOrUndefined(element.distanceLeft)) {
            inline[distanceLeftProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceLeft);
        }
        if(!isNullOrUndefined(element.distanceRight)) {
            inline[distanceRightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceRight);
        }
        if(!isNullOrUndefined(element.distanceTop)) {
            inline[distanceTopProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.distanceTop);
        }
        inline[layoutInCellProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.layoutInCell, this.keywordIndex);
        inline[lockAnchorProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.lockAnchor, this.keywordIndex);
        inline[autoShapeTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getAutoShapeTypeEnumValue(element.autoShapeType) : element.autoShapeType;
        // inline[autoShapeTypeProperty[this.keywordIndex]] = this.getAutoShapeTypeEnumValue(element.autoShapeType);
        if (element.fillFormat) {
            inline[fillFormatProperty[this.keywordIndex]] = {};
            inline[fillFormatProperty[this.keywordIndex]][colorProperty[this.keywordIndex]] = element.fillFormat.color;
            inline[fillFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.fillFormat.fill, this.keywordIndex);
        }
        if (element.lineFormat) {
            inline[lineFormatProperty[this.keywordIndex]] = {};
            inline[lineFormatProperty[this.keywordIndex]][lineFormatTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getLineFormatTypeEnumValue(element.lineFormat.lineFormatType) : element.lineFormat.lineFormatType;
            inline[lineFormatProperty[this.keywordIndex]][colorProperty[this.keywordIndex]] = element.lineFormat.color;
            inline[lineFormatProperty[this.keywordIndex]][weightProperty[this.keywordIndex]] = element.lineFormat.weight;
            inline[lineFormatProperty[this.keywordIndex]][lineStyleProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getLineDashStyleEnumValue(element.lineFormat.dashStyle) : element.lineFormat.dashStyle;
            inline[lineFormatProperty[this.keywordIndex]][lineProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(element.lineFormat.line, this.keywordIndex);
        }
        if (element.textFrame) {
            inline[textFrameProperty[this.keywordIndex]] = {};
            inline[textFrameProperty[this.keywordIndex]][textVerticalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTextVerticalAlignmentEnumValue(element.textFrame.textVerticalAlignment) : element.textFrame.textVerticalAlignment;
            inline[textFrameProperty[this.keywordIndex]][leftMarginProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.textFrame.marginLeft);
            inline[textFrameProperty[this.keywordIndex]][rightMarginProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.textFrame.marginRight);
            inline[textFrameProperty[this.keywordIndex]][topMarginProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.textFrame.marginTop);
            inline[textFrameProperty[this.keywordIndex]][bottomMarginProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.textFrame.marginBottom);
            inline[textFrameProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]] = [];
            for (let j: number = 0; j < element.textFrame.childWidgets.length; j++) {
                let textFrameBlock: BlockWidget = element.textFrame.childWidgets[j] as BlockWidget;
                if (textFrameBlock.hasOwnProperty('contentControlProperties') && !isNullOrUndefined(element.paragraph) && (element.paragraph.hasOwnProperty('contentControlProperties'))) {
                    this.blocks = [];
                }
                this.writeBlock(textFrameBlock, 0, inline[textFrameProperty[this.keywordIndex]][blocksProperty[this.keywordIndex]]);
            }
        }
    }
    public writeChart(element: ChartElementBox, inline: any): void {
        inline[chartLegendProperty[this.keywordIndex]] = {};
        inline[chartTitleAreaProperty[this.keywordIndex]] = {};
        inline[chartAreaProperty[this.keywordIndex]] = {};
        inline[plotAreaProperty[this.keywordIndex]] = {};
        inline[chartCategoryProperty[this.keywordIndex]] = [];
        inline[chartSeriesProperty[this.keywordIndex]] = [];
        inline[chartPrimaryCategoryAxisProperty[this.keywordIndex]] = {};
        inline[chartPrimaryValueAxisProperty[this.keywordIndex]] = {};
        this.writeChartTitleArea(element.chartTitleArea, inline[chartTitleAreaProperty[this.keywordIndex]]);
        this.writeChartArea(element.chartArea, inline[chartAreaProperty[this.keywordIndex]]);
        this.writeChartArea(element.chartPlotArea, inline[plotAreaProperty[this.keywordIndex]]);
        this.writeChartCategory(element, inline[chartCategoryProperty[this.keywordIndex]]);
        this.createChartSeries(element, inline[chartSeriesProperty[this.keywordIndex]]);
        this.writeChartLegend(element.chartLegend, inline[chartLegendProperty[this.keywordIndex]]);
        this.writeChartCategoryAxis(element.chartPrimaryCategoryAxis, inline[chartPrimaryCategoryAxisProperty[this.keywordIndex]]);
        this.writeChartCategoryAxis(element.chartPrimaryValueAxis, inline[chartPrimaryValueAxisProperty[this.keywordIndex]]);
        if (element.chartDataTable.showSeriesKeys !== undefined) {
            inline[chartDataTableProperty[this.keywordIndex]] = {};
            this.writeChartDataTable(element.chartDataTable, inline[chartDataTableProperty[this.keywordIndex]]);
        }
        inline[chartTitleProperty[this.keywordIndex]] = element.title;
        inline[chartTypeProperty[this.keywordIndex]] = element.type;
        inline[gapWidthProperty[this.keywordIndex]] = element.chartGapWidth;
        inline[overlapProperty[this.keywordIndex]] = element.chartOverlap;
        inline[heightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.height);
        inline[widthProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(element.width);
    }
    private writeChartTitleArea(titleArea: ChartTitleArea, chartTitleArea: any): void {
        chartTitleArea[fontNameProperty[this.keywordIndex]] = titleArea.chartfontName;
        chartTitleArea[fontSizeProperty[this.keywordIndex]] = titleArea.chartFontSize;
        chartTitleArea[layoutProperty[this.keywordIndex]]= {};
        chartTitleArea[dataFormatProperty[this.keywordIndex]] = this.writeChartDataFormat(titleArea.dataFormat);
        this.writeChartLayout(titleArea.layout, chartTitleArea[layoutProperty[this.keywordIndex]]);
    }
    private writeChartDataFormat(format: ChartDataFormat): any {
        let chartDataFormat: any = {};
        chartDataFormat[fillProperty[this.keywordIndex]] = {};
        chartDataFormat[lineProperty[this.keywordIndex]] = {};
        if (!isNullOrUndefined(format.id)) {
            chartDataFormat[idProperty[this.keywordIndex]] = format.id;
        }
        if (!isNullOrUndefined(format.fill.color)) {
            if (format.fill.color.length > 6) {
                chartDataFormat[fillProperty[this.keywordIndex]][foreColorProperty[this.keywordIndex]] = format.fill.color.substring(2);
            }
            else {
                chartDataFormat[fillProperty[this.keywordIndex]][foreColorProperty[this.keywordIndex]] = format.fill.color;
            }
        }
        chartDataFormat[fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]] = format.fill.rgb;
        chartDataFormat[lineProperty[this.keywordIndex]][colorProperty[this.keywordIndex]] = format.line.color;
        chartDataFormat[lineProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]] = format.line.rgb;
        return chartDataFormat;
    }
    private writeChartLayout(layout: ChartLayout, chartLayout: any): void {
        chartLayout[layoutXProperty[this.keywordIndex]] = layout.chartLayoutLeft;
        chartLayout[layoutYProperty[this.keywordIndex]] = layout.chartLayoutTop;
    }
    private writeChartArea(area: ChartArea, chartArea: any): void {
        chartArea[foreColorProperty[this.keywordIndex]] = area.chartForeColor;
    }
    private writeChartLegend(legend: ChartLegend, chartLegend: any): void {
        chartLegend[positionProperty[this.keywordIndex]] = legend.chartLegendPostion;
        chartLegend[chartTitleAreaProperty[this.keywordIndex]] = {};
        this.writeChartTitleArea(legend.chartTitleArea, chartLegend[chartTitleAreaProperty[this.keywordIndex]]);
    }
    private writeChartCategoryAxis(categoryAxis: ChartCategoryAxis, primaryCategoryAxis: any): void {
        primaryCategoryAxis[chartTitleProperty[this.keywordIndex]] = categoryAxis.categoryAxisTitle;
        primaryCategoryAxis[chartTitleAreaProperty[this.keywordIndex]] = {};
        this.writeChartTitleArea(categoryAxis.chartTitleArea, primaryCategoryAxis[chartTitleAreaProperty[this.keywordIndex]]);
        primaryCategoryAxis[categoryTypeProperty[this.keywordIndex]] = categoryAxis.categoryAxisType;
        primaryCategoryAxis[fontSizeProperty[this.keywordIndex]] = categoryAxis.axisFontSize;
        primaryCategoryAxis[fontNameProperty[this.keywordIndex]] = categoryAxis.axisFontName;
        primaryCategoryAxis[numberFormatProperty[this.keywordIndex]] = categoryAxis.categoryNumberFormat;
        primaryCategoryAxis[maximumValueProperty[this.keywordIndex]] = categoryAxis.max;
        primaryCategoryAxis[minimumValueProperty[this.keywordIndex]] = categoryAxis.min;
        primaryCategoryAxis[isAutoMajorProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(categoryAxis.isAutoInternal, this.keywordIndex);
        primaryCategoryAxis[majorUnitProperty[this.keywordIndex]] = categoryAxis.interval;
        primaryCategoryAxis[hasMajorGridLinesProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(categoryAxis.majorGridLines, this.keywordIndex);
        primaryCategoryAxis[hasMinorGridLinesProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(categoryAxis.minorGridLines, this.keywordIndex);
        primaryCategoryAxis[majorTickMarkProperty[this.keywordIndex]] = categoryAxis.majorTick;
        primaryCategoryAxis[minorTickMarkProperty[this.keywordIndex]] = categoryAxis.minorTick;
        primaryCategoryAxis[tickLabelPositionProperty[this.keywordIndex]] = categoryAxis.tickPosition;
    }
    private writeChartDataTable(chartDataTable: ChartDataTable, dataTable: any): void {
        dataTable[showSeriesKeysProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(chartDataTable.showSeriesKeys, this.keywordIndex);
        dataTable[hasHorizontalBorderProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(chartDataTable.hasHorzBorder, this.keywordIndex);
        dataTable[hasVerticalBorderProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(chartDataTable.hasVertBorder, this.keywordIndex);
        dataTable[hasBordersProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(chartDataTable.hasBorders, this.keywordIndex);
    }
    private writeChartCategory(element: any, chartCategory: any): void {
        let data: any = element.chartCategory;
        chartCategory[chartDataProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < data.length; i++) {
            let xData: any = data[i];
            let categories: any = this.createChartCategory(xData, element.chartType);
            chartCategory.push(categories);
        }
    }
    private createChartCategory(data: any, type: string): any {
        let chartCategory: any = {};
        chartCategory[chartDataProperty[this.keywordIndex]] = [];
        this.writeChartData(data, chartCategory[chartDataProperty[this.keywordIndex]], type);
        chartCategory[categoryXNameProperty[this.keywordIndex]] = data.categoryXName;
        return chartCategory;
    }
    private writeChartData(element: any, chartData: any, type: string): any {
        let data: any = element.chartData;
        for (let i: number = 0; i < data.length; i++) {
            let yData: any = data[i];
            let yCategory: any = this.createChartData(yData, type);
            chartData.push(yCategory);
        }
    }
    private createChartData(data: any, type: string): any {
        let chartData: any = {};
        chartData[yValueProperty[this.keywordIndex]] = data.yValue;
        if (type === 'Bubble') {
            chartData[sizeProperty[this.keywordIndex]] = data.size;
        }
        return chartData;
    }
    private createChartSeries(element: any, chartSeries: any): any {
        let data: any = element.chartSeries;
        let type: string = element.chartType;
        for (let i: number = 0; i < data.length; i++) {
            let yData: any = data[i];
            let series: any = this.writeChartSeries(yData, type);
            chartSeries.push(series);
        }
    }
    private writeChartSeries(series: any, type: string): any {
        let isPieType: boolean = (type === 'Pie' || type === 'Doughnut');
        let chartSeries: any = {};
        let errorBar: any = {};
        let errorBarData: any = series.errorBar;
        chartSeries[dataPointsProperty[this.keywordIndex]] = [];
        chartSeries[seriesNameProperty[this.keywordIndex]] = series.seriesName;
        if (isPieType) {
            if (!isNullOrUndefined(series.firstSliceAngle)) {
                chartSeries[firstSliceAngleProperty[this.keywordIndex]] = series.firstSliceAngle;
            }
            if (type === 'Doughnut') {
                chartSeries[holeSizeProperty[this.keywordIndex]] = series.doughnutHoleSize;
            }
        }
        if (!isNullOrUndefined(series.dataLabels.labelPosition)) {
            let dataLabel: any = this.writeChartDataLabels(series.dataLabels);
            chartSeries[dataLabelProperty[this.keywordIndex]] = dataLabel;
        }
        if (!isNullOrUndefined(series.seriesFormat.markerStyle)) {
            let seriesFormat: any = {};
            let format: any = series.seriesFormat;
            seriesFormat[markerStyleProperty[this.keywordIndex]] = format.markerStyle;
            seriesFormat[markerSizeProperty[this.keywordIndex]] = format.numberValue;
            seriesFormat[markerColorProperty[this.keywordIndex]] = format.markerColor;
            chartSeries[seriesFormatProperty[this.keywordIndex]] = seriesFormat;
        }
        if (!isNullOrUndefined(errorBarData.type)) {
            errorBar[typeProperty[this.keywordIndex]] = errorBarData.type;
            errorBar[directionProperty[this.keywordIndex]] = errorBarData.direction;
            errorBar[endStyleProperty[this.keywordIndex]] = errorBarData.endStyle;
            errorBar[numberValueProperty[this.keywordIndex]] = errorBarData.numberValue;
            chartSeries[errorBarProperty[this.keywordIndex]] = errorBar;
        }
        if (series.trendLines.length > 0) {
            chartSeries[trendLinesProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < series.trendLines.length; i++) {
                let trendLine: any = this.writeChartTrendLines(series.trendLines[i]);
                chartSeries[trendLinesProperty[this.keywordIndex]].push(trendLine);
            }
        }
        for (let i: number = 0; i < series.chartDataFormat.length; i++) {
            let format: any = this.writeChartDataFormat(series.chartDataFormat[i]);
            chartSeries[dataPointsProperty[this.keywordIndex]].push(format);
        }
        return chartSeries;
    }
    private writeChartDataLabels(dataLabels: any): any {
        let dataLabel: any = {};
        dataLabel[positionProperty[this.keywordIndex]] = dataLabels.position;
        dataLabel[fontNameProperty[this.keywordIndex]] = dataLabels.fontName;
        dataLabel[fontColorProperty[this.keywordIndex]] = HelperMethods.convertArgbToRgb(dataLabels.fontColor);
        dataLabel[fontSizeProperty[this.keywordIndex]] = dataLabels.fontSize;
        dataLabel[isLegendKeyProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isLegendKey, this.keywordIndex);
        dataLabel[isBubbleSizeProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isBubbleSize, this.keywordIndex);
        dataLabel[isCategoryNameProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isCategoryName, this.keywordIndex);
        dataLabel[isSeriesNameProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isSeriesName, this.keywordIndex);
        dataLabel[isValueProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isValue, this.keywordIndex);
        dataLabel[isPercentageProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isPercentage, this.keywordIndex);
        dataLabel[isLeaderLinesProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(dataLabels.isLeaderLines, this.keywordIndex);
        return dataLabel;
    }
    private writeChartTrendLines(trendLines: any): any {
        let trendLine: any = {};
        trendLine[nameProperty[this.keywordIndex]] = trendLines.trendLineName;
        trendLine[typeProperty[this.keywordIndex]] = trendLines.trendLineType;
        trendLine[forwardProperty[this.keywordIndex]] = trendLines.forwardValue;
        trendLine[backwardProperty[this.keywordIndex]] = trendLines.backwardValue;
        trendLine[interceptProperty[this.keywordIndex]] = trendLines.interceptValue;
        trendLine[isDisplayEquationProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(trendLines.isDisplayEquation, this.keywordIndex);
        trendLine[isDisplayRSquaredProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(trendLines.isDisplayRSquared, this.keywordIndex);
        return trendLine;
    }
    private writeLines(paragraph: ParagraphWidget, lineIndex: number, offset: number, inlines: any): boolean {
        let startIndex: number = lineIndex;
        let endParagraph: boolean = this.endLine instanceof LineWidget && this.endLine.paragraph === paragraph;
        let endIndex: number = endParagraph ? this.endLine.indexInOwner : paragraph.childWidgets.length - 1;
        for (let i: number = startIndex; i <= endIndex; i++) {
            let child: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (this.endLine === child || (lineIndex === i && offset !== 0)) {
                if (this.endLine === child && paragraph.paragraphFormat.bidi && this.startLine !== this.endLine) {
                    this.endOffset = child.getEndOffset();
                }
                this.writeLine(child, (this.startLine !== this.endLine && child !== this.startLine && !this.isContentControl) ? 0 : offset, inlines);
            } else {
                this.writeInlines(paragraph, child, inlines);
            }
        }
        return endParagraph;
    }
    private writeLine(line: LineWidget, offset: number, inlines: any): void {
        this.contentInline = [];
        // let isContentStarted: boolean = false;
        // let contentControl: boolean = false;
        let isEnd: boolean = line === this.endLine;
        let lineWidget: LineWidget = line;
        let started: boolean = false;
        let ended: boolean = false;
        let length: number = 0;
        for (let j: number = 0; j < lineWidget.children.length; j++) {
            let element: ElementBox = lineWidget.children[j];
            if (element instanceof ListTextElementBox) {
                continue;
            }
            let inline: any = undefined;
            length += element.length;
            started = length > offset;
            // if (element instanceof ContentControl) {
            //     if (!started) {
            //         isContentStarted = element.type === 0 ? true : false;
            //     }
            //     contentControl = true;
            // }
            // if (element instanceof TextElementBox && element.hasOwnProperty('contentControlProperties') && started && !contentControl) {
            //     isContentStarted = true;
            // }
            // if (element instanceof ContentControl) {
            //     if (isContentStarted) {
            //         if (element.type === 1) {
            //             isContentStarted = false;
            //         }
            //     }
            //     if (contentControl) {
            //         if (element.type === 1) {
            //             contentControl = false;
            //         }
            //     }
            // }
            ended = isEnd && length >= this.endOffset;
            if (!started) {
                continue;
            }
            if (element instanceof BookmarkElementBox && !isNullOrUndefined(this.bookmarkCollection) && ((element.bookmarkType === 0 && this.bookmarkCollection.indexOf(element) === -1) || (element.bookmarkType === 1 && this.bookmarkCollection.indexOf(element.reference) === -1))) {
                continue;
            }
            if (element instanceof ContentControl || this.startContent || this.blockContent) {
                if (ended) {
                    this.startContent = false;
                    break;
                }
                this.writeInlinesContentControl(element, line, inlines, j);
                continue;
            }
            inline = this.writeInline(element);
            if(!isNullOrUndefined(inline)) {
                inlines[inlines.length] = inline;
                if (length > offset || ended) {
                    if (inline.hasOwnProperty(textProperty[this.keywordIndex])) {
                        let startIndex: number = length - element.length;
                        let indexInInline: number = offset - startIndex;
                        let endIndex: number = ended ? this.endOffset - startIndex : element.length;
                        inline[textProperty[this.keywordIndex]] = inline[textProperty[this.keywordIndex]].substring(indexInInline, endIndex);
                    }
                    offset = -1;
                }
            }
            if (ended) {
                break;
            }
        }
    }
    private writeInlinesFootNote(element: any): any {
        this.isWriteInlinesFootNote = true;
        let inline: any = {};
        inline[footnoteTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getFootnoteTypeEnumValue(element.footnoteType) : element.footnoteType;
        inline[characterFormatProperty[this.keywordIndex]] = {};
        inline[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat(element.characterFormat, this.keywordIndex);
        inline[blocksProperty[this.keywordIndex]] = [];
        let bodyWidget: BlockWidget = element.bodyWidget;
        while (bodyWidget) {
            for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
                if (!(bodyWidget.childWidgets[i] as BlockWidget).previousSplitWidget) {
                    this.writeBlock(bodyWidget.childWidgets[i] as BlockWidget, 0, inline[blocksProperty[this.keywordIndex]]);
                }
            }
            // Proceed only if the bodyWidget container is an Endnote
            if (!isNullOrUndefined(bodyWidget.containerWidget) && bodyWidget.containerWidget instanceof FootNoteWidget && bodyWidget.containerWidget.footNoteType === 'Endnote') {
                bodyWidget = bodyWidget.nextSplitWidget as BlockWidget;
            } else {
                break;
            }
        }
        inline[symbolCodeProperty[this.keywordIndex]] = element.symbolCode;
        inline[symbolFontNameProperty[this.keywordIndex]] = element.symbolFontName;
        inline[customMarkerProperty[this.keywordIndex]] = element.customMarker;
        this.writeInlineRevisions(inline, element);
        this.isWriteInlinesFootNote = false;
        return inline;
    }
    private writeInlinesContentControl(element: ElementBox, lineWidget: LineWidget, inlines: any, i: number): any {
        if (element instanceof ContentControl) {
            if (element.contentControlWidgetType === 'Block') {
                this.isBlockClosed = false;
                if (this.blockContent && element.type === 0) {
                    this.nestedBlockContent = true;
                    return true;
                } else if (this.nestedBlockContent && element.type === 1) {
                    this.nestedBlockContent = false;
                    return true;
                }
                this.blockContent = (element.type === 0) ? true : false;
                if (lineWidget.children[i - 1] instanceof ContentControl) {
                    if ((lineWidget.children[i - 1] as ContentControl).contentControlWidgetType === 'Block') {
                        this.blockContent = true;
                    }
                }
                if (!this.blockContent) {
                    this.isBlockClosed = true;
                }
                return true;
            }
        }
        if (element instanceof ContentControl) {
            if (this.startContent && element.type === 0) {
                this.nestedContent = true;
                return true;
            } else if (this.startContent && this.nestedContent) {
                let inline: any = {};
                inline[inlinesProperty[this.keywordIndex]] = this.contentInline;
                if (this.contentInline.length > 0) {
                    let nestedContent: any = this.nestedContentProperty(lineWidget.children[i + 1], inline);
                    inlines.push(nestedContent);
                    this.contentInline = [];
                }
                if (this.multipleLineContent) {
                    inline = inlines[inlines.length - 1];
                    this.nestedContentProperty(lineWidget.children[i + 1], inline);
                    this.multipleLineContent = false;
                }
                this.nestedContent = false;
                return true;
            }
            this.contentType = element.contentControlWidgetType;
            this.startContent = (element.type === 0) ? true : false;
            return true;
        }
        if (this.startContent && ((this.contentType === 'Inline'))) {
            if (this.multipleLineContent && !isNullOrUndefined(inlines) && inlines.length > 0) {
                this.inlineContentControl(element, element.nextNode, inlines);
                this.contentInline = [];
            } else {
                let contentinline: any = this.inlineContentControl(element, element.nextNode);
                if (!isNullOrUndefined(contentinline)) {
                    if (this.nestedContent && this.multipleLineContent) {
                        let inline: any = {};
                        inline[inlinesProperty[this.keywordIndex]] = this.contentInline;
                        inlines.push(inline);
                        this.contentInline = [];
                    } else {
                        inlines.push(contentinline);
                        this.contentInline = [];
                        return false;
                    }
                }
            }
        } else {
            let inline: any = this.writeInline(element);
            if (!isNullOrUndefined(inline)) {
                inlines.push(inline);
            }
        }
    }
    private createParagraph(paragraphWidget: ParagraphWidget): any {
        let paragraph: any = {};
        let isParaSelected: boolean = false;
        let isListPara: boolean = false;
        if (this.documentHelper.selection && !this.documentHelper.selection.isEmpty && !this.isExport) {
            let endPos: TextPosition = this.documentHelper.selection.end;
            if (!this.documentHelper.selection.isForward) {
                endPos = this.documentHelper.selection.start;
            }
            let lastLine: LineWidget = endPos.paragraph.childWidgets[endPos.paragraph.childWidgets.length - 1] as LineWidget;
            isListPara = !isNullOrUndefined(paragraphWidget.paragraphFormat.listFormat.list);
            isParaSelected = this.documentHelper.selection.isParagraphLastLine(lastLine)
                && (endPos.offset === this.documentHelper.selection.getLineLength(lastLine) + 1 || (!(paragraphWidget.indexInOwner == endPos.paragraph.indexInOwner) && isListPara));
        } else {
            isParaSelected = true;
        }
        paragraph[paragraphFormatProperty[this.keywordIndex]] = this.writeParagraphFormat(isParaSelected ? paragraphWidget.paragraphFormat : new WParagraphFormat(paragraphWidget), this.keywordIndex);
        paragraph[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat(isParaSelected ? paragraphWidget.characterFormat : new WCharacterFormat(paragraphWidget), this.keywordIndex);
        paragraph[inlinesProperty[this.keywordIndex]] = [];
        return paragraph;
    }
    /**
     * @private
     */
    public writeCharacterFormat(format: WCharacterFormat, keywordIndex: number, isInline?: boolean): any {
        let characterFormat: any = {};
        if (this.skipExporting) {
            return characterFormat;
        }
        HelperMethods.writeCharacterFormat(characterFormat, isInline, format, keywordIndex);
        characterFormat[boldBidiProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.boldBidi, keywordIndex) : format.getValue('boldBidi');
        characterFormat[italicBidiProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.italicBidi, keywordIndex) : format.getValue('italicBidi');
        if (format.revisions.length > 0) {
            characterFormat[revisionIdsProperty[keywordIndex]] = [];
            for (let x: number = 0; x < format.revisions.length; x++) {
                characterFormat[revisionIdsProperty[keywordIndex]].push(format.revisions[x].revisionID);
            }
        }
        if (this.writeInlineStyles && !isInline) {
            characterFormat[inlineFormatProperty[keywordIndex]] = this.writeCharacterFormat(format, keywordIndex, true);
        }
        return characterFormat;
    }
    /**
     * @private
     */
    public writeParagraphFormat(format: WParagraphFormat, keywordIndex: number, isInline?: boolean): any {
        let paragraphFormat: any = {};
        if (this.skipExporting) {
            return paragraphFormat;
        }
        this.keywordIndex = isNullOrUndefined(this.keywordIndex) ? 0 : this.keywordIndex;
        HelperMethods.writeParagraphFormat(paragraphFormat, isInline, format, keywordIndex);
        paragraphFormat[listFormatProperty[keywordIndex]] = this.writeListFormat(format.listFormat, isInline);
        paragraphFormat[tabsProperty[keywordIndex]] = this.writeTabs(format.tabs);
        if (this.writeInlineStyles && !isInline) {
            paragraphFormat[inlineFormatProperty[keywordIndex]] = this.writeParagraphFormat(format, keywordIndex, true);
        }
        return paragraphFormat;
    }
    private writeThemes(source: Themes): any {
        let themes: any = {};
        themes[fontSchemeProperty[this.keywordIndex]] = {};
        themes[fontSchemeProperty[this.keywordIndex]][fontSchemeNameProperty[this.keywordIndex]] = source.fontScheme.fontSchemeName;
        themes[fontSchemeProperty[this.keywordIndex]][majorFontSchemeProperty[this.keywordIndex]] = this.writeMajorMinorFontScheme(source.fontScheme.majorFontScheme);
        themes[fontSchemeProperty[this.keywordIndex]][minorFontSchemeProperty[this.keywordIndex]] = this.writeMajorMinorFontScheme(source.fontScheme.minorFontScheme);
        return themes;
    }
    private writeMajorMinorFontScheme(source: MajorMinorFontScheme): any {
        let majorMinorFontScheme: any = {};
        majorMinorFontScheme[fontSchemeListProperty[this.keywordIndex]] = this.writeFontSchemeList(source.fontSchemeList);
        let keys: string [] = source.fontTypeface.keys;
        let fontTypeface: any = {};
        for(let key of keys) {
            fontTypeface[key] = source.fontTypeface.get(key);
        }
        majorMinorFontScheme[fontTypefaceProperty[this.keywordIndex]] = fontTypeface;
        return majorMinorFontScheme;
    }
    private writeFontSchemeList(source: FontSchemeStruct[]): any {
        let fontSchemeStructs: any = [];
        source.forEach(val => {
            let schemeStruct: any = {};
            schemeStruct[nameProperty[this.keywordIndex]] = val.name;
            schemeStruct[typefaceProperty[this.keywordIndex]] = val.typeface;
            schemeStruct[panoseProperty[this.keywordIndex]] = val.panose;
            fontSchemeStructs.push(schemeStruct);
        });
        return fontSchemeStructs;
    }
    private writeTabs(tabStops: WTabStop[]): any {
        if (isNullOrUndefined(tabStops) || tabStops.length < 1) {
            return undefined;
        }
        let tabs: any = [];
        for (let i: number = 0; i < tabStops.length; i++) {
            let tabStop: WTabStop = tabStops[i];
            let tab: any = {};
            tab[positionProperty[this.keywordIndex]] = tabStop.position;
            tab[deletePositionProperty[this.keywordIndex]] = tabStop.deletePosition;
            tab[tabJustificationProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTabJustificationEnumValue(tabStop.tabJustification) : tabStop.tabJustification;
            tab[tabLeaderProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTabLeaderEnumValue(tabStop.tabLeader) : tabStop.tabLeader;
            tabs.push(tab);
        }
        return tabs;
    }
    /**
     * @private
     */
    public writeListFormat(format: WListFormat, isInline?: boolean): any {
        let listFormat: any = {};
        let listIdValue: Object = format.getValue('listId');
        if (!isNullOrUndefined(listIdValue)) {
            listFormat[listIdProperty[this.keywordIndex]] = listIdValue;
            if (isNullOrUndefined(this.lists)) {
                this.lists = [];
            }
            if (this.lists.indexOf(format.listId) < 0) {
                this.lists.push(format.listId);
            }
        }
        let listLevelNumber: Object = format.getValue('listLevelNumber');
        if (!isNullOrUndefined(listLevelNumber)) {
            listFormat[listLevelNumberProperty[this.keywordIndex]] = listLevelNumber;
        }
        let nsid: Object = format.getValue('nsid');
        if (!isNullOrUndefined(nsid)) {
            listFormat[nsidProperty] = nsid;
        }
        return listFormat;
    }
    private writeTable(tableWidget: TableWidget, table: any, index: number, blocks: any): BlockWidget {
        let widget: IWidget = tableWidget.childWidgets[index];
        if (widget instanceof TableRowWidget) {
            if (this.writeRow(widget, table[rowsProperty[this.keywordIndex]])) {
                return undefined;
            }
        }
        let next: BlockWidget = tableWidget;
        do {
            tableWidget = next as TableWidget;
            next = tableWidget.nextSplitWidget as TableWidget;
        } while (next instanceof BlockWidget);

        next = tableWidget.nextRenderedWidget as BlockWidget;
        return (next instanceof BlockWidget && next.containerWidget.index === tableWidget.containerWidget.index) ? next : undefined;
    }
    private writeRow(rowWidget: TableRowWidget, rows: any): boolean {
        let next: TableRowWidget = rowWidget;
        do {
            rowWidget = next;
            next = this.writeRowInternal(next, rows);
            if (rowWidget === next) {
                return true;
            }
        } while (next instanceof TableRowWidget)
        return false;
    }
    private writeRowInternal(rowWidget: TableRowWidget, rows: any): TableRowWidget {
        if (!(rowWidget instanceof TableRowWidget)) {
            return rowWidget;
        }
        if (!rowWidget.isCellsHaveSameWidthUnit()) { 
            rowWidget.updateUniformWidthUnitForCells();
        }
        let row: any = this.createRow(rowWidget);
        rows.push(row);
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let widget: IWidget = rowWidget.childWidgets[i];
            if (widget instanceof TableCellWidget) {
                if (rowWidget.index === widget.rowIndex
                    && (isNullOrUndefined(this.startColumnIndex) || widget.columnIndex >= this.startColumnIndex)
                    && (isNullOrUndefined(this.endColumnIndex) || widget.columnIndex < this.endColumnIndex)) {
                    if (this.writeCell(widget, row[cellsProperty[this.keywordIndex]])) {
                        return rowWidget;
                    }
                }
            }
        }
        let next: TableRowWidget = rowWidget;
        do {
            rowWidget = next;
            next = rowWidget.nextRenderedWidget as TableRowWidget;
            if (!isNullOrUndefined(rowWidget.ownerTable.bodyWidget) && next && ((rowWidget.ownerTable.index !== next.ownerTable.index &&
                rowWidget.ownerTable.bodyWidget.sectionIndex === next.ownerTable.bodyWidget.sectionIndex)
                || rowWidget.ownerTable.bodyWidget.sectionIndex !== next.ownerTable.bodyWidget.sectionIndex)) {
                next = undefined;
            }
        } while (next instanceof TableRowWidget && next.index === rowWidget.index);
        return next;
    }
    private writeCell(cellWidget: TableCellWidget, cells: any): boolean {
        let cell: any = this.createCell(cellWidget);
        cells.push(cell);
        let firstBlock: BlockWidget = cellWidget.firstChild as BlockWidget;
        do {
            firstBlock = this.writeBlock(firstBlock as BlockWidget, 0, cell[blocksProperty[this.keywordIndex]]);
        } while (firstBlock);
        return this.endCell instanceof TableCellWidget ? this.endCell.cellFormat === cellWidget.cellFormat : false;
    }
    private createTable(tableWidget: TableWidget): any {
        let table: any = {};
        if (isNullOrUndefined(this.keywordIndex)) {
            this.keywordIndex = 0;
        }
        table[rowsProperty[this.keywordIndex]] = [];
        table[gridProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < tableWidget.tableHolder.columns.length; i++) {
            table[gridProperty[this.keywordIndex]][i] = tableWidget.tableHolder.columns[i].preferredWidth;
        }
        table[tableFormatProperty[this.keywordIndex]] = this.writeTableFormat(tableWidget.tableFormat, this.keywordIndex);
        table[descriptionProperty[this.keywordIndex]] = tableWidget.tableFormat.description;
        table[titleProperty[this.keywordIndex]] = tableWidget.tableFormat.title;
        table[columnCountProperty[this.keywordIndex]] = tableWidget.tableHolder.columns.length;
        this.writeTablePositioning(table, tableWidget);
        return table;
    }
    private writeTablePositioning(table: any, tableWidget: TableWidget): void {
        if (tableWidget.wrapTextAround) {
            table[wrapTextAroundProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(tableWidget.wrapTextAround, this.keywordIndex);
            table[positioningProperty[this.keywordIndex]] = {};
            table[positioningProperty[this.keywordIndex]][allowOverlapProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(tableWidget.positioning.allowOverlap, this.keywordIndex);
            if(!isNullOrUndefined(tableWidget.positioning.distanceBottom)) {
                table[positioningProperty[this.keywordIndex]][distanceBottomProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceBottom);
            }
            if(!isNullOrUndefined(tableWidget.positioning.distanceLeft)) {
                table[positioningProperty[this.keywordIndex]][distanceLeftProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceLeft);
            }
            if(!isNullOrUndefined(tableWidget.positioning.distanceRight)) {
                table[positioningProperty[this.keywordIndex]][distanceRightProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceRight);
            }
            if(!isNullOrUndefined(tableWidget.positioning.distanceTop)) {
                table[positioningProperty[this.keywordIndex]][distanceTopProperty[this.keywordIndex]] = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceTop);
            }
            if (!isNullOrUndefined(tableWidget.positioning.verticalAlignment)) {
                table[positioningProperty[this.keywordIndex]][verticalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTableVerticalPositionEnumValue(tableWidget.positioning.verticalAlignment): tableWidget.positioning.verticalAlignment;
            }
            if (!isNullOrUndefined(tableWidget.positioning.verticalOrigin)) {
                table[positioningProperty[this.keywordIndex]][verticalOriginProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTableVerticalRelationEnumValue(tableWidget.positioning.verticalOrigin): tableWidget.positioning.verticalOrigin;
            }
            table[positioningProperty[this.keywordIndex]][verticalPositionProperty[this.keywordIndex]] = tableWidget.positioning.verticalPosition;
            if (!isNullOrUndefined(tableWidget.positioning.horizontalAlignment)) {
                table[positioningProperty[this.keywordIndex]][horizontalAlignmentProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTableHorizontalPositionEnumValue(tableWidget.positioning.horizontalAlignment): tableWidget.positioning.horizontalAlignment;
            }
            if (!isNullOrUndefined(tableWidget.positioning.horizontalOrigin)) {
                table[positioningProperty[this.keywordIndex]][horizontalOriginProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getTableHorizontalRelationEnumValue(tableWidget.positioning.horizontalOrigin): tableWidget.positioning.horizontalOrigin;
            }
            table[positioningProperty[this.keywordIndex]][horizontalPositionProperty[this.keywordIndex]] = tableWidget.positioning.horizontalPosition;
        }
    }
    private createRow(rowWidget: TableRowWidget): any {
        let row: any = {};
        row[cellsProperty[this.keywordIndex]] = [];
        row[rowFormatProperty[this.keywordIndex]] = this.writeRowFormat(rowWidget.rowFormat, this.keywordIndex);
        if (rowWidget.hasOwnProperty('contentControlProperties')) {
            row[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(rowWidget.contentControlProperties);
        }
        return row;
    }
    private createCell(cellWidget: TableCellWidget): any {
        let cell: any = {};
        cell[blocksProperty[this.keywordIndex]] = [];
        cell[cellFormatProperty[this.keywordIndex]] = this.writeCellFormat(cellWidget.cellFormat, this.keywordIndex);
        cell[columnIndexProperty[this.keywordIndex]] = cellWidget.columnIndex;
        if (cellWidget.hasOwnProperty('contentControlProperties')) {
            cell[contentControlPropertiesProperty[this.keywordIndex]] = this.contentControlProperty(cellWidget.contentControlProperties);
        }
        return cell;
    }
    /**
     * @private
     */
    public writeShading(wShading: WShading, keyIndex: number): any {
        let shading: any = {};
        shading[backgroundColorProperty[keyIndex]] = wShading.hasValue('backgroundColor') ? wShading.backgroundColor : undefined;
        shading[foregroundColorProperty[keyIndex]] = wShading.hasValue('foregroundColor') ? wShading.foregroundColor : undefined;
        shading[textureProperty[keyIndex]] = wShading.hasValue('textureStyle') ? 
        keyIndex == 1 ? this.getTextureStyleEnumValue(wShading.textureStyle) : wShading.textureStyle : undefined;
        return shading;
    }

    private writeBorders(wBorders: WBorders, keyIndex: number): any {
        let borders: any = {};
        borders[topProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.top, keyIndex);
        borders[leftProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.left, keyIndex);
        borders[rightProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.right, keyIndex);
        borders[bottomProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.bottom, keyIndex);
        borders[diagonalDownProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.diagonalDown, keyIndex);
        borders[diagonalUpProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.diagonalUp, keyIndex);
        borders[horizontalProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.horizontal, keyIndex);
        borders[verticalProperty[keyIndex]] = HelperMethods.writeBorder(wBorders.vertical, keyIndex);
        return borders;
    }
    /**
     * @private
     */
    public writeCellFormat(wCellFormat: WCellFormat, keyIndex: number): any {
        let cellFormat: any = {};
        cellFormat[bordersProperty[keyIndex]] = this.writeBorders(wCellFormat.borders, keyIndex);
        cellFormat[shadingProperty[keyIndex]] = this.writeShading(wCellFormat.shading, keyIndex);
        cellFormat[topMarginProperty[keyIndex]] = wCellFormat.hasValue('topMargin') ? wCellFormat.topMargin : undefined;
        cellFormat[rightMarginProperty[keyIndex]] = wCellFormat.hasValue('rightMargin') ? wCellFormat.rightMargin : undefined;
        cellFormat[leftMarginProperty[keyIndex]] = wCellFormat.hasValue('leftMargin') ? wCellFormat.leftMargin : undefined;
        cellFormat[bottomMarginProperty[keyIndex]] = wCellFormat.hasValue('bottomMargin') ? wCellFormat.bottomMargin : undefined;
        cellFormat[preferredWidthProperty[keyIndex]] = wCellFormat.hasValue('preferredWidth') ? wCellFormat.preferredWidth : undefined;
        cellFormat[preferredWidthTypeProperty[keyIndex]] = wCellFormat.hasValue('preferredWidthType') ? keyIndex == 1 ? this.getWidthTypeEnumValue(wCellFormat.preferredWidthType) : wCellFormat.preferredWidthType : undefined;
        cellFormat[cellWidthProperty[keyIndex]] = wCellFormat.hasValue('cellWidth') ? wCellFormat.cellWidth : undefined;
        cellFormat[columnSpanProperty[keyIndex]] = wCellFormat.columnSpan;
        cellFormat[rowSpanProperty[keyIndex]] = wCellFormat.rowSpan;
        cellFormat[verticalAlignmentProperty[keyIndex]] = wCellFormat.hasValue('verticalAlignment') ? keyIndex == 1 ? this.getCellVerticalAlignmentEnumValue(wCellFormat.verticalAlignment) : wCellFormat.verticalAlignment : undefined;
        return cellFormat;
    }
    private writeRowFormat(wRowFormat: WRowFormat, keyIndex: number): any {
        let rowFormat: any = {};
        let revisionIds: any = [];
        this.assignRowFormat(rowFormat, wRowFormat, keyIndex);
        for (let j: number = 0; j < wRowFormat.revisions.length; j++) {
            rowFormat[revisionIdsProperty[keyIndex]] = this.writeRowRevisions(wRowFormat.revisions[j], revisionIds);
        }
        return rowFormat;
    }
    /**
     * @private
     */
    public assignRowFormat(rowFormat: any, wRowFormat: WRowFormat, keyIndex: number): void {
        rowFormat[heightProperty[keyIndex]] = wRowFormat.hasValue('height') ? wRowFormat.height : undefined;
        rowFormat[allowBreakAcrossPagesProperty[keyIndex]] = wRowFormat.hasValue('allowBreakAcrossPages') ? HelperMethods.getBoolInfo(wRowFormat.allowBreakAcrossPages, this.keywordIndex) : undefined;
        rowFormat[heightTypeProperty[keyIndex]] = wRowFormat.hasValue('heightType') ? this.keywordIndex == 1 ? this.getHeighTypeEnumValue(wRowFormat.heightType) : wRowFormat.heightType : undefined;
        rowFormat[isHeaderProperty[keyIndex]] = wRowFormat.hasValue('isHeader') ? HelperMethods.getBoolInfo(wRowFormat.isHeader, this.keywordIndex) : undefined;
        rowFormat[bordersProperty[keyIndex]] = this.writeBorders(wRowFormat.borders, keyIndex);
        rowFormat[gridBeforeProperty[keyIndex]] = wRowFormat.gridBefore;
        rowFormat[gridBeforeWidthProperty[keyIndex]] = wRowFormat.hasValue('gridBeforeWidth') ? wRowFormat.gridBeforeWidth : undefined;
        rowFormat[gridBeforeWidthTypeProperty[keyIndex]] = wRowFormat.hasValue('gridBeforeWidthType') ? this.keywordIndex == 1 ? this.getWidthTypeEnumValue(wRowFormat.gridBeforeWidthType) : wRowFormat.gridBeforeWidthType : undefined;
        rowFormat[gridAfterProperty[keyIndex]] = wRowFormat.gridAfter;
        rowFormat[gridAfterWidthProperty[keyIndex]] = wRowFormat.hasValue('gridAfterWidth') ? wRowFormat.gridAfterWidth : undefined;
        rowFormat[gridAfterWidthTypeProperty[keyIndex]] = wRowFormat.hasValue('gridAfterWidthType') ? this.keywordIndex == 1 ? this.getWidthTypeEnumValue(wRowFormat.gridAfterWidthType) : wRowFormat.gridAfterWidthType : undefined;
        rowFormat[leftMarginProperty[keyIndex]] = wRowFormat.hasValue('leftMargin') ? wRowFormat.leftMargin : undefined;
        rowFormat[topMarginProperty[keyIndex]] = wRowFormat.hasValue('topMargin') ? wRowFormat.topMargin : undefined;
        rowFormat[rightMarginProperty[keyIndex]] = wRowFormat.hasValue('rightMargin') ? wRowFormat.rightMargin : undefined;
        rowFormat[bottomMarginProperty[keyIndex]] = wRowFormat.hasValue('bottomMargin') ? wRowFormat.bottomMargin : undefined;
        rowFormat[leftIndentProperty[keyIndex]] = wRowFormat.hasValue('leftIndent') ? wRowFormat.leftIndent : undefined;
    }
    private writeRowRevisions(wrevisions: Revision, revisionIds: any): any {
        if (this.selectedRevisionId.indexOf(wrevisions.revisionID) === -1) {
            this.selectedRevisionId.push(wrevisions.revisionID);
        }
        revisionIds.push(wrevisions.revisionID);
        return revisionIds;
    }
    /**
     * @private
     */
    public writeTableFormat(wTableFormat: WTableFormat, keyIndex: number): any {
        let tableFormat: any = {};
        tableFormat[bordersProperty[keyIndex]] = this.writeBorders(wTableFormat.borders, keyIndex);
        tableFormat[shadingProperty[keyIndex]] = this.writeShading(wTableFormat.shading, keyIndex);
        tableFormat[cellSpacingProperty[keyIndex]] = wTableFormat.hasValue('cellSpacing') ? wTableFormat.cellSpacing : undefined;
        tableFormat[leftIndentProperty[keyIndex]] = wTableFormat.hasValue('leftIndent') ? wTableFormat.leftIndent : undefined;
        tableFormat[tableAlignmentProperty[keyIndex]] = wTableFormat.hasValue('tableAlignment') ? this.keywordIndex == 1 ? this.getTableAlignmentEnumValue(wTableFormat.tableAlignment) : wTableFormat.tableAlignment : undefined;
        tableFormat[topMarginProperty[keyIndex]] = wTableFormat.hasValue('topMargin') ? wTableFormat.topMargin : undefined;
        tableFormat[rightMarginProperty[keyIndex]] = wTableFormat.hasValue('rightMargin') ? wTableFormat.rightMargin : undefined;
        tableFormat[leftMarginProperty[keyIndex]] = wTableFormat.hasValue('leftMargin') ? wTableFormat.leftMargin : undefined;
        tableFormat[bottomMarginProperty[keyIndex]] = wTableFormat.hasValue('bottomMargin') ? wTableFormat.bottomMargin : undefined;
        tableFormat[preferredWidthProperty[keyIndex]] = wTableFormat.hasValue('preferredWidth') ? wTableFormat.preferredWidth : undefined;
        tableFormat[preferredWidthTypeProperty[keyIndex]] = wTableFormat.hasValue('preferredWidthType') ? this.keywordIndex == 1 ? this.getWidthTypeEnumValue(wTableFormat.preferredWidthType) : wTableFormat.preferredWidthType : undefined;
        tableFormat[bidiProperty[keyIndex]] = wTableFormat.hasValue('bidi') ? HelperMethods.getBoolInfo(wTableFormat.bidi, this.keywordIndex) : undefined;
        tableFormat[allowAutoFitProperty[keyIndex]] = wTableFormat.hasValue('allowAutoFit') ? HelperMethods.getBoolInfo(wTableFormat.allowAutoFit, this.keywordIndex) : undefined;
        tableFormat[styleNameProperty[keyIndex]] = !isNullOrUndefined(wTableFormat.styleName) ? wTableFormat.styleName : undefined;
        if (this.owner.documentHelper.isCopying && this.documentHelper.selection && this.documentHelper.selection.isWholeColumnSelected()) {
            tableFormat[lastParagraphMarkCopiedProperty[this.keywordIndex]] = true;
        }
        return tableFormat;
    }
    private footnotes(documentHelper: DocumentHelper): void {
        this.isWriteEndFootNote = true;
        for (let i: number = 0; i < documentHelper.footnotes.separator.length; i++) {
            this.seprators(documentHelper);
        }
        this.isWriteEndFootNote = false;
    }
    private seprators(documentHelper: any): any {
        if (documentHelper.footnotes.separator.length > 0) {
            this.document[footnotesProperty[this.keywordIndex]] = {};
            this.document[footnotesProperty[this.keywordIndex]][separatorProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < documentHelper.footnotes.separator.length; i++) {
                this.writeBlock(documentHelper.footnotes.separator[i], 0, this.document[footnotesProperty[this.keywordIndex]][separatorProperty[this.keywordIndex]]);
            }
        }
        if (documentHelper.footnotes.continuationSeparator.length > 0) {
            this.document[footnotesProperty[this.keywordIndex]][continuationSeparatorProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < documentHelper.footnotes.continuationSeparator.length; i++) {
                this.writeBlock(documentHelper.footnotes.continuationSeparator[i], 0, this.document[footnotesProperty[this.keywordIndex]][continuationSeparatorProperty[this.keywordIndex]]);
            }
        }
        if (documentHelper.footnotes.continuationNotice.length > 0) {
            this.document[footnotesProperty[this.keywordIndex]][continuationNoticeProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < documentHelper.footnotes.continuationNotice.length; i++) {
                this.writeBlock(documentHelper.footnotes.continuationNotice[i], 0, this.document[footnotesProperty[this.keywordIndex]][continuationNoticeProperty[this.keywordIndex]]);
            }
        }
    }
    private endnotes(documentHelper: DocumentHelper): void {
        this.isWriteEndFootNote = true;
        for (let i: number = 0; i < this.documentHelper.endnotes.separator.length; i++) {
            this.endnoteSeparator(documentHelper);
        }
        this.isWriteEndFootNote = false;
    }
    private endnoteSeparator(documentHelper: DocumentHelper): void {
        if (documentHelper.endnotes.separator.length > 0) {
            this.document[endnotesProperty[this.keywordIndex]] = {};
            this.document[endnotesProperty[this.keywordIndex]][separatorProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < documentHelper.endnotes.separator.length; i++) {
                this.writeBlock(documentHelper.endnotes.separator[i], 0, this.document[endnotesProperty[this.keywordIndex]][separatorProperty[this.keywordIndex]]);
            }
        }
        if (documentHelper.endnotes.continuationSeparator.length > 0) {
            this.document[endnotesProperty[this.keywordIndex]][continuationSeparatorProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < documentHelper.endnotes.continuationSeparator.length; i++) {
                this.writeBlock(documentHelper.endnotes.continuationSeparator[i], 0, this.document[endnotesProperty[this.keywordIndex]][continuationSeparatorProperty[this.keywordIndex]]);
            }
        }
        if (documentHelper.endnotes.continuationNotice.length > 0) {
            this.document[endnotesProperty[this.keywordIndex]][continuationNoticeProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < documentHelper.endnotes.continuationNotice.length; i++) {
                this.writeBlock(documentHelper.endnotes.continuationNotice[i], 0, this.document[endnotesProperty[this.keywordIndex]][continuationNoticeProperty[this.keywordIndex]]);
            }
        }
    }
    private writeStyles(documentHelper: DocumentHelper): void {
        let styles: Object[] = [];
        this.document[stylesProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < documentHelper.styles.length; i++) {
            this.document[stylesProperty[this.keywordIndex]].push(this.writeStyle(documentHelper.styles.getItem(i) as WStyle));
        }
    }
    /**
     * @private
     */
    public writeStyle(style: WStyle): any {
        let wStyle: any = {};
        wStyle[nameProperty[this.keywordIndex]] = style.name;
        if (style.type === 'Paragraph') {
            wStyle[typeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getStyleTypeEnumValue(style.type) : style.type;
            wStyle[paragraphFormatProperty[this.keywordIndex]] = this.writeParagraphFormat((style as any).paragraphFormat, this.keywordIndex);
            wStyle[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat((style as any).characterFormat, this.keywordIndex);
        }
        if (style.type === 'Character') {
            wStyle[typeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getStyleTypeEnumValue(style.type) : style.type;
            wStyle[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat((style as any).characterFormat, this.keywordIndex);
        }
        if (style.type === 'Table') {
            wStyle[typeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getStyleTypeEnumValue(style.type) : style.type;
        }
        if (!isNullOrUndefined(style.basedOn)) {
            wStyle[basedOnProperty[this.keywordIndex]] = style.basedOn.name;
        }
        if (!isNullOrUndefined(style.link)) {
            wStyle[linkProperty[this.keywordIndex]] = style.link.name;
        }
        if (!isNullOrUndefined(style.next)) {
            wStyle[nextProperty[this.keywordIndex]] = style.next.name;
        }
        return wStyle;
    }
    public writeRevisions(documentHelper: DocumentHelper): void {
        this.document[revisionsProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < documentHelper.owner.revisions.changes.length; i++) {
            if (this.isExport ||
                (!this.isExport && !this.owner.enableTrackChanges && this.selectedRevisionId.indexOf(documentHelper.owner.revisions.changes[i].revisionID) !== -1)) {
                this.document[revisionsProperty[this.keywordIndex]].push(this.writeRevision(documentHelper.owner.revisions.changes[i]));
            }
        }
    }
    private writeRevision(revisions: Revision): any {
        let revision: any = {};
        revision[authorProperty[this.keywordIndex]] = revisions.author;
        revision[dateProperty[this.keywordIndex]] = revisions.date;
        revision[revisionTypeProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getRevisionTypeEnumValue(revisions.revisionType) : revisions.revisionType;
        revision[revisionIdProperty[this.keywordIndex]] = revisions.revisionID;
        return revision;
    }
    public writeComments(documentHelper: DocumentHelper): void {
        this.document[commentsProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < documentHelper.comments.length; i++) {
            // if (this.documentHelper.comments[i].isPosted && (this.isExport ||
            //     (!this.isExport && this.selectedCommentsId.indexOf(this.documentHelper.comments[i].commentId) !== -1))) {
            if (this.isExport ||
                (!this.isExport && this.selectedCommentsId.indexOf(this.documentHelper.comments[i].commentId) !== -1)) {
                this.document[commentsProperty[this.keywordIndex]].push(this.writeComment(this.documentHelper.comments[i]));
            }
        }
    }
    public writeCustomXml(documentHelper: DocumentHelper): void {
        this.document[customXmlProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < documentHelper.customXmlData.length; i++) {
            let customXml: any = {};
            let key: string = documentHelper.customXmlData.keys[i];
            customXml[itemIDProperty[this.keywordIndex]] = key;
            let xmlValue: string = this.documentHelper.customXmlData.get(key);
            customXml[xmlProperty[this.keywordIndex]] = xmlValue;
            this.document[customXmlProperty[this.keywordIndex]].push(customXml);
        }
    }
    public writeImages(documentHelper: DocumentHelper): void {
        this.document[imagesProperty[this.keywordIndex]] = {};
        for (let i = 0; i < this.images.length; i++) {
            let key: number = this.images[i];
            let base64ImageString: string[] = documentHelper.images.get(key);
            this.document[imagesProperty[this.keywordIndex]][key] = base64ImageString;
        }
    }
    private writeComment(comments: CommentElementBox): any {
        let comment: any = {};
        comment[commentIdProperty[this.keywordIndex]] = comments.commentId;
        comment[authorProperty[this.keywordIndex]] = comments.author;
        comment[dateProperty[this.keywordIndex]] = comments.date;
        comment[blocksProperty[this.keywordIndex]] = HelperMethods.commentInlines(comments.text, comments.mentions, this.keywordIndex);
        comment[doneProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(comments.isResolved, this.keywordIndex);
        comment[replyCommentsProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < comments.replyComments.length; i++) {
            comment[replyCommentsProperty[this.keywordIndex]].push(this.writeComment(comments.replyComments[i]));
        }
        return comment;
    }

    private writeLists(documentHelper: DocumentHelper): void {
        let abstractLists: number[] = [];
        this.document[listsProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < documentHelper.lists.length; i++) {
            let list: WList = documentHelper.lists[i];
            if (this.lists.indexOf(list.listId) > -1) {
                this.document[listsProperty[this.keywordIndex]].push(this.writeList(list));
                if (abstractLists.indexOf(list.abstractListId) < 0) {
                    abstractLists.push(list.abstractListId);
                }
            }
        }
        this.document[abstractListsProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < documentHelper.abstractLists.length; i++) {
            let abstractList: WAbstractList = documentHelper.abstractLists[i];
            if (abstractLists.indexOf(abstractList.abstractListId) > -1) {
                this.document[abstractListsProperty[this.keywordIndex]].push(this.writeAbstractList(abstractList));
            }
        }
    }
    /**
     * @private
     */
    public writeAbstractList(wAbstractList: WAbstractList): any {
        let abstractList: any = {};
        abstractList[abstractListIdProperty[this.keywordIndex]] = wAbstractList.abstractListId;
        abstractList[nsidProperty] = wAbstractList.nsid;
        abstractList[levelsProperty[this.keywordIndex]] = [];
        for (let i: number = 0; i < wAbstractList.levels.length; i++) {
            abstractList[levelsProperty[this.keywordIndex]][i] = this.writeListLevel(wAbstractList.levels[i]);
        }
        return abstractList;
    }
    /**
     * @private
     */
    public writeList(wList: WList): any {
        let list: any = {};
        if (!isNullOrUndefined(wList)) {
            list[abstractListIdProperty[this.keywordIndex]] = wList.abstractListId;
            list[levelOverridesProperty[this.keywordIndex]] = [];
            for (let i: number = 0; i < wList.levelOverrides.length; i++) {
                list[levelOverridesProperty[this.keywordIndex]].push(this.writeLevelOverrides(wList.levelOverrides[i]));
            }
            list[listIdProperty[this.keywordIndex]] = wList.listId;
            list[nsidProperty] = wList.nsid;
        }
        return list;
    }
    private writeLevelOverrides(wlevel: WLevelOverride): any {
        let levelOverrides: any = {};
        levelOverrides[levelNumberProperty[this.keywordIndex]] = wlevel.levelNumber;
        if (wlevel.overrideListLevel) {
            levelOverrides[overrideListLevelProperty[this.keywordIndex]] = this.writeListLevel(wlevel.overrideListLevel);
        }
        levelOverrides[startAtProperty[this.keywordIndex]] = wlevel.startAt;
        return levelOverrides;
    }
    private writeListLevel(wListLevel: WListLevel): any {
        let listLevel: any = {};

        listLevel[characterFormatProperty[this.keywordIndex]] = this.writeCharacterFormat(wListLevel.characterFormat, this.keywordIndex);
        listLevel[paragraphFormatProperty[this.keywordIndex]] = this.writeParagraphFormat(wListLevel.paragraphFormat, this.keywordIndex);

        listLevel[isLegalStyleNumberingProperty[this.keywordIndex]] = HelperMethods.getBoolInfo(wListLevel.isLegalStyleNumbering, this.keywordIndex);
        listLevel[followCharacterProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getFollowCharacterType(wListLevel.followCharacter) : wListLevel.followCharacter;
        listLevel[listLevelPatternProperty[this.keywordIndex]] = this.keywordIndex == 1 ? this.getListLevelPatternEnumValue(wListLevel.listLevelPattern) : wListLevel.listLevelPattern;
        listLevel[numberFormatProperty[this.keywordIndex]] = wListLevel.numberFormat;
        listLevel[paraStyleNameProperty[this.keywordIndex]] = wListLevel.paraStyleName;
        listLevel[restartLevelProperty[this.keywordIndex]] = wListLevel.restartLevel;
        listLevel[startAtProperty[this.keywordIndex]] = wListLevel.startAt;

        return listLevel;
    }
    private getParentBlock(widget: BlockWidget): BlockWidget {
        if (widget.isInsideTable) {
            widget = this.owner.documentHelper.layout.getParentTable(widget);
        }
        return widget;
    }
    private getParentCell(cell: TableCellWidget): TableCellWidget {
        while (cell.ownerTable.isInsideTable) {
            cell = cell.ownerTable.associatedCell;
        }
        return cell;
    }

    private getWidthTypeEnumValue(widthType: WidthType): number {
        switch (widthType) {
            case 'Auto':
                return 0;
            case 'Percent':
                return 1;
            case 'Point':
                return 2;
        }
    }
    private getTableAlignmentEnumValue(tableAlignment: TableAlignment): number {
        switch (tableAlignment) {
            case 'Left':
                return 0;
            case 'Center':
                return 1;
            case 'Right':
                return 2;
        }
    }

    private getTextureStyleEnumValue(textureStyle: TextureStyle): number {
        switch (textureStyle) {
            case 'TextureNone':
                return 0;
            case 'Texture2Pt5Percent':
                return 1;
            case 'Texture5Percent':
                return 2;
            case 'Texture7Pt5Percent':
                return 3;
            case 'Texture10Percent':
                return 4;
            case 'Texture12Pt5Percent':
                return 5;
            case 'Texture15Percent':
                return 6;
            case 'Texture17Pt5Percent':
                return 7;
            case 'Texture20Percent':
                return 8;
            case 'Texture22Pt5Percent':
                return 9;
            case 'Texture25Percent':
                return 10;
            case 'Texture27Pt5Percent':
                return 11;
            case 'Texture30Percent':
                return 12;
            case 'Texture32Pt5Percent':
                return 13;
            case 'Texture35Percent':
                return 14;
            case 'Texture37Pt5Percent':
                return 15;
            case 'Texture40Percent':
                return 16;
            case 'Texture42Pt5Percent':
                return 17;
            case 'Texture45Percent':
                return 18;
            case 'Texture47Pt5Percent':
                return 19;
            case 'Texture50Percent':
                return 20;
            case 'Texture52Pt5Percent':
                return 21;
            case 'Texture55Percent':
                return 22;
            case 'Texture57Pt5Percent':
                return 23;
            case 'Texture60Percent':
                return 24;
            case 'Texture62Pt5Percent':
                return 25;
            case 'Texture65Percent':
                return 26;
            case 'Texture67Pt5Percent':
                return 27;
            case 'Texture70Percent':
                return 28;
            case 'Texture72Pt5Percent':
                return 29;
            case 'Texture75Percent':
                return 30;
            case 'Texture77Pt5Percent':
                return 31;
            case 'Texture80Percent':
                return 32;
            case 'Texture82Pt5Percent':
                return 33;
            case 'Texture85Percent':
                return 34;
            case 'Texture87Pt5Percent':
                return 35;
            case 'Texture90Percent':
                return 36;
            case 'Texture92Pt5Percent':
                return 37;
            case 'Texture95Percent':
                return 38;
            case 'Texture97Pt5Percent':
                return 39;
            case 'TextureSolid':
                return 40;
            case 'TextureDarkHorizontal':
                return 41;
            case 'TextureDarkVertical':
                return 42;
            case 'TextureDarkDiagonalDown':
                return 43;
            case 'TextureDarkDiagonalUp':
                return 44;
            case 'TextureDarkCross':
                return 45;
            case 'TextureDarkDiagonalCross':
                return 46;
            case 'TextureHorizontal':
                return 47;
            case 'TextureVertical':
                return 48;
            case 'TextureDiagonalDown':
                return 49;
            case 'TextureDiagonalUp':
                return 50;
            case 'TextureCross':
                return 51;
            case 'TextureDiagonalCross':
                return 52;
        }
    }
    private getHeighTypeEnumValue(heightType: HeightType): number {
        switch (heightType) {
            case 'AtLeast':
                return 0;
            case 'Exactly':
                return 1;
            default:
                return 0;
        }
    }
    private getCellVerticalAlignmentEnumValue(cellVerticalAlignment: CellVerticalAlignment): number {
        switch (cellVerticalAlignment) {
            case 'Top':
                return 0;
            case 'Center':
                return 1;
            case 'Bottom':
                return 2;
        }
    }
    private getListLevelPatternEnumValue(listLevelPattern: ListLevelPattern): number {
        switch (listLevelPattern) {
            case 'None':
                return 0;
            case 'KanjiDigit':
            case 'Arabic':
                return 1;
            case 'UpRoman':
                return 2;
            case 'LowRoman':
                return 3;
            case 'UpLetter':
                return 4;
            case 'LowLetter':
                return 5;
            case 'Ordinal':
                return 6;
            case 'Number':
                return 7;
            case 'OrdinalText':
                return 8;
            case 'LeadingZero':
                return 9;
            case 'Bullet':
                return 10;
            case 'FarEast':
                return 11;
            case 'Special':
                return 12;
        }
    }
    private getStyleTypeEnumValue(styleType: StyleType): number {
        switch (styleType) {
            case 'Paragraph':
                return 0;
            case 'Character':
                return 1;
            case 'Table':
                return 2;
        }
    }
    private getProtectionTypeEnumValue(protectionType: ProtectionType): number {
        switch (protectionType) {
            case 'NoProtection':
                return 0;
            case 'ReadOnly':
                return 1;
            case 'FormFieldsOnly':
                return 2;
            case 'CommentsOnly':
                return 3;
            case 'RevisionsOnly':
                return 4;
        }
    }
    private getRevisionTypeEnumValue(revisionType: RevisionType): number {
        switch (revisionType) {
            case 'Insertion':
                return 1;
            case 'Deletion':
                return 2;
            case 'MoveTo':
                return 3;
            case 'MoveFrom':
                return 4;
        }
    }
    private getFootnoteTypeEnumValue(footnoteType: FootnoteType): number {
        switch (footnoteType) {
            case 'Footnote':
                return 0;
            case 'Endnote':
                return 1;
        }
    }
    private getFootnoteRestartIndexEnumValue(footnoteRestartIndex: FootnoteRestartIndex): number {
        switch (footnoteRestartIndex) {
            case 'DoNotRestart':
                return 0;
            case 'RestartForEachSection':
                return 1;
            case 'RestartForEachPage':
                return 2;
        }
    }
    private getFootEndNoteNumberFormatEnumValue(footEndNoteNumberFormat: FootEndNoteNumberFormat): number {
        switch (footEndNoteNumberFormat) {
            case 'Arabic':
                return 0;
            case 'UpperCaseRoman':
                return 1;
            case 'LowerCaseRoman':
                return 2;
            case 'UpperCaseLetter':
                return 3;
            case 'LowerCaseLetter':
                return 4;
        }
    }
    private getTextVerticalAlignmentEnumValue(textVerticalAlignment: VerticalAlignment): number {
        switch (textVerticalAlignment) {
            case 'Top':
                return 0;
            case 'Middle':
            case 'Center':
                return 1;
            case 'Bottom':
                return 2;
            default:
                return 0;
        }
    }
    private getShapeVerticalAlignmentEnumValue(shapeVerticalAlignment: VerticalAlignment): number {
        switch (shapeVerticalAlignment) {
            case 'None':
                return 0;
            case 'Top':
                return 1;
            case 'Center':
                return 2;
            case 'Bottom':
                return 3;
            case 'Inline':
                return 4;
            case 'Inside':
                return 5;
            case 'Outside':
                return 6;
            default:
                return 0;
        }
    }
    private getShapeHorizontalAlignmentEnumValue(shapeHorizontalAlignment: HorizontalAlignment): number {
        switch (shapeHorizontalAlignment) {
            case 'None':
                return 0;
            case 'Center':
                return 1;
            case 'Inside':
                return 2;
            case 'Left':
                return 3;
            case 'Outside':
                return 4;
            case 'Right':
                return 5;
        }
    }
    private getVerticalOriginEnumValue(verticalOrigin: VerticalOrigin): number {
        switch (verticalOrigin) {
            case 'Paragraph':
                return 0;
            case 'BottomMargin':
                return 1;
            case 'InsideMargin':
                return 2;
            case 'Line':
                return 3;
            case 'Margin':
                return 4;
            case 'OutsideMargin':
                return 5;
            case 'Page':
                return 6;
            case 'TopMargin':
                return 7;
        }
    }
    private getHorizontalOriginEnumValue(horizontalOrigin: HorizontalOrigin): number {
        switch (horizontalOrigin) {
            case 'Column':
                return 0;
            case 'Character':
                return 1;
            case 'InsideMargin':
                return 2;
            case 'LeftMargin':
                return 3;
            case 'Margin':
                return 4;
            case 'OutsideMargin':
                return 5;
            case 'Page':
                return 6;
            case 'RightMargin':
                return 7;
        }
    }
    private getTableVerticalRelationEnumValue(tableRelation: string): number {
        switch (tableRelation) {
            case 'Paragraph':
                return 0;
            case 'Margin':
                return 1;
            case 'Page':
                return 2;
            default:
                return 0;
        }
    }
    private getTableHorizontalRelationEnumValue(tableRelation: string): number {
        switch (tableRelation) {
            case 'Column':
                return 0;
            case 'Margin':
                return 1;
            case 'Page':
                return 2;
            default:
                return 0;
        }
    }

    private getTableVerticalPositionEnumValue(tableVerticalPosition: VerticalAlignment): number {
        switch (tableVerticalPosition) {
            case 'None':
                return 0;
            case 'Top':
                return 1;
            case 'Center':
                return 2;
            case 'Bottom':
                return 3;
            case 'Inside':
                return 4;
            case 'Outside':
                return 5;
            default:
                return 0;
        }
    }
    private getTableHorizontalPositionEnumValue(tableHorizontalPosition: HorizontalAlignment): number {
        switch (tableHorizontalPosition) {
            case 'Left':
                return 0;
            case 'Center':
                return 1;
            case 'Inside':
                return 2;
            case 'Outside':
                return 3;
            case 'Right':
                return 4;
            default:
                return 0;
        }
    }
    private getLineDashStyleEnumValue(lineDashStyle: LineDashing): number {
        switch (lineDashStyle) {
            case 'Solid':
                return 0;
            case 'Dash':
                return 1;
            case 'DashDot':
                return 2;
            case 'DashDotDot':
                return 3;
            case 'DashDotGEL':
                return 4;
            case 'DashGEL':
                return 5;
            case 'Dot':
                return 6;
            case 'DotGEL':
                return 7;
            case 'LongDashDotDotGEL':
                return 8;
            case 'LongDashDotGEL':
                return 9;
            case 'LongDashGEL':
                return 10;
        }
    }
    private getHorizontalPositionAbsEnumValue(horizontalPositionAbs: HorizontalAlignment): number {
        switch (horizontalPositionAbs) {
            case 'Left':
                return 0;
            case 'Center':
                return 1;
            case 'Right':
                return 2;
            case 'Inside':
                return 3;
            case 'Outside':
                return 4;
            default:
                return 0;
        }
    }
    private getTabJustificationEnumValue(tabJustification: TabJustification): number {
        switch (tabJustification) {
            case 'Left':
                return 0;
            case 'Bar':
                return 1;
            case 'Center':
                return 2;
            case 'Decimal':
                return 3;
            case 'List':
                return 4;
            case 'Right':
                return 5;
        }
    }
    private getTabLeaderEnumValue(tabLeader: TabLeader): number {
        switch (tabLeader) {
            case 'None':
                return 0;
            case 'Single':
                return 1;
            case 'Dot':
                return 2;
            case 'Hyphen':
                return 3;
            case 'Underscore':
                return 4;
        }
    }
    private getTextFormFieldTypeEnumValue(textFormFieldType: TextFormFieldType): number {
        switch (textFormFieldType) {
            case 'Text':
                return 0;
            case 'Number':
                return 1;
            case 'Date':
                return 2;
            case 'Calculation':
                return 3;
        }
    }
    private getTextFormFieldFormatEnumValue(textFormFieldFormat: string): number {
        switch (textFormFieldFormat) {
            case 'None':
                return 0;
            case 'FirstCapital':
                return 1;
            case 'Lowercase':
                return 2;
            case 'Uppercase':
                return 3;
            case 'Titlecase':
                return 4;
            default:
                return 0;
        }
    }
    private getCheckBoxSizeTypeEnumValue(checkBoxSizeType: CheckBoxSizeType): number {
        switch (checkBoxSizeType) {
            case 'Auto':
                return 0;
            case 'Exactly':
                return 1;
        }
    }
    private getContentControlAppearanceEnumValue(contentControlAppearance: string): number {
        switch (contentControlAppearance) {
            case 'BoundingBox':
                return 1;
            case 'Hidden':
                return 2;
            case 'Tags':
                return 3;
            default:
                return 1;
        }
    }
    private getContentControlTypeEnumValue(contentControlType: ContentControlType): number {
        switch (contentControlType) {
            case 'RichText':
                return 0;
            case 'BuildingBlockGallery':
                return 1;
            case 'CheckBox':
                return 2;
            case 'ComboBox':
                return 3;
            case 'Date':
                return 4;
            case 'DropDownList':
                return 5;
            case 'Group':
                return 6;
            case 'Picture':
                return 7;
            case 'RepeatingSection':
                return 8;
            case 'Text':
                return 9;
        }
    }
    private getDateCalendarTypeEnumValue(dateCalendarType: string): number {
        switch (dateCalendarType) {
            case 'Gregorian':
                return 0;
            case 'GregorianArabic':
                return 1;
            case 'GregorianEnglish':
                return 2;
            case 'GregorianMiddleEastFrench':
                return 3;
            case 'GregorianTransliteratedEnglish':
                return 4;
            case 'GregorianTransliteratedFrench':
                return 5;
            case 'Hebrew':
                return 6;
            case 'Hijri':
                return 7;
            case 'Japan':
                return 8;
            case 'Korean':
                return 9;
            case 'Saka':
                return 10;
            case 'Taiwan':
                return 11;
            case 'Thai':
                return 12;
            default:
                return 0;
        }
    }
    private getDateStorageFormatEnumValue(dateStorageFormat: string): number {
        switch (dateStorageFormat) {
            case 'DateStorageDate':
                return 1;
            case 'DateStorageDateTime':
                return 2;
            case 'DateStorageText':
                return 3;
            default:
                return 0;
        }
    }
    private getTextWrappingStyleEnumValue(textWrappingStyle: TextWrappingStyle): number {
        switch (textWrappingStyle) {
            case 'Inline':
                return 0;
            case 'InFrontOfText':
                return 1;
            case 'Square':
                return 2;
            case 'TopAndBottom':
                return 3;
            case 'Behind':
                return 4;
            default:
                return 0;
        }
    }
    private getTextWrappingTypeEnumValue(textWrappingType: TextWrappingType): number {
        switch (textWrappingType) {
            case 'Both':
                return 0;
            case 'Left':
                return 1;
            case 'Right':
                return 2;
            case 'Largest':
                return 3;
        }
    }
    private getCompatibilityModeEnumValue(compatibilityMode: CompatibilityMode): number {
        switch (compatibilityMode) {
            case 'Word2013':
                return 0;
            case 'Word2003':
                return 1;
            case 'Word2007':
                return 2;
            case 'Word2010':
                return 3;
        }
    }
    private getLineFormatTypeEnumValue(lineFormatType: LineFormatType): number {
        switch (lineFormatType) {
            case 'Solid':
                return 0;
            case 'Patterned':
                return 1;
            case 'Gradient':
                return 2;
            case 'None':
                return 3;
        }
    }
    private getAutoShapeTypeEnumValue(autoShapeType: AutoShapeType): number {
        switch (autoShapeType) {
            case 'Rectangle':
                return 1;
            case 'RoundedRectangle':
                return 2;
            case 'StraightConnector':
                return 3;
            case 'Oval':
                return 4;
            case 'IsoscelesTriangle':
                return 5;
            case 'RightTriangle':
                return 6;
            case 'Parallelogram':
                return 7;
            case 'Trapezoid':
                return 8;
            case 'Diamond':
                return 9;
            case 'RegularPentagon':
                return 10;
            case 'Hexagon':
                return 11;
            case 'Heptagon':
                return 12;
            case 'Octagon':
                return 13;
            case 'Decagon':
                return 14;
            case 'Dodecagon':
                return 15;
            case 'Chord':
                return 16;
            case 'Teardrop':
                return 17;
            case 'Frame':
                return 18;
            case 'HalfFrame':
                return 19;
            case 'L_Shape':
                return 20;
            case 'Pie':
                return 21;
            case 'DiagonalStripe':
                return 22;
            case 'Cross':
                return 23;
            case 'Plaque':
                return 24;
            case 'Can':
                return 25;
            case 'Cube':
                return 26;
            case 'Bevel':
                return 27;
            case 'Donut':
                return 28;
            case 'NoSymbol':
                return 29;
            case 'BlockArc':
                return 30;
            case 'FoldedCorner':
                return 31;
            case 'SmileyFace':
                return 32;
            case 'Heart':
                return 33;
            case 'LightningBolt':
                return 34;
            case 'Sun':
                return 35;
            case 'Moon':
                return 36;
            case 'Cloud':
                return 37;
            case 'Arc':
                return 38;
            case 'DoubleBracket':
                return 39;
            case 'DoubleBrace':
                return 40;
            case 'LeftBracket':
                return 41;
            case 'RightBracket':
                return 42;
            case 'LeftBrace':
                return 43;
            case 'RightBrace':
                return 44;
            //flowchartShapes 
            case 'FlowChartProcess':
                return 45;
            case 'FlowChartAlternateProcess':
                return 46;
            case 'FlowChartDecision':
                return 47;
            case 'FlowChartData':
                return 48;
            case 'FlowChartPredefinedProcess':
                return 49;
            case 'FlowChartInternalStorage':
                return 50;
            case 'FlowChartDocument':
                return 51;
            case 'FlowChartMultiDocument':
                return 52;
            case 'FlowChartTerminator':
                return 53;
            case 'FlowChartPreparation':
                return 54;
            case 'FlowChartManualInput':
                return 55;
            case 'FlowChartManualOperation':
                return 56;
            case 'FlowChartConnector':
                return 57;
            case 'FlowChartOffPageConnector':
                return 58;
            case 'FlowChartCard':
                return 59;
            case 'FlowChartPunchedTape':
                return 60;
            case 'FlowChartSummingJunction':
                return 61;
            case 'FlowChartOr':
                return 62;
            case 'FlowChartCollate':
                return 63;
            case 'FlowChartSort':
                return 64;
            case 'FlowChartExtract':
                return 65;
            case 'FlowChartMerge':
                return 66;
            case 'FlowChartStoredData':
                return 67;
            case 'FlowChartDelay':
                return 68;
            case 'FlowChartSequentialAccessStorage':
                return 69;
            case 'FlowChartMagneticDisk':
                return 70;
            case 'FlowChartDirectAccessStorage':
                return 71;
            case 'FlowChartDisplay':
                return 72;
            // block arrows
            case 'RightArrow':
                return 73;
            case 'LeftArrow':
                return 74;
            case 'UpArrow':
                return 75;
            case 'DownArrow':
                return 76;
            case 'LeftRightArrow':
                return 77;
            case 'UpDownArrow':
                return 78;
            case 'QuadArrow':
                return 79;
            case 'LeftRightUpArrow':
                return 80;
            case 'BentArrow':
                return 81;
            case 'UTurnArrow':
                return 82;
            case 'LeftUpArrow':
                return 83;
            case 'BentUpArrow':
                return 84;
            case 'CurvedRightArrow':
                return 85;
            case 'CurvedLeftArrow':
                return 86;
            case 'CurvedUpArrow':
                return 87;
            case 'CurvedDownArrow':
                return 88;
            case 'StripedRightArrow':
                return 89;
            case 'NotchedRightArrow':
                return 90;
            case 'Pentagon':
                return 91;
            case 'Chevron':
                return 92;
            case 'RightArrowCallout':
                return 93;
            case 'DownArrowCallout':
                return 94;
            case 'LeftArrowCallout':
                return 95;
            case 'UpArrowCallout':
                return 96;
            case 'LeftRightArrowCallout':
                return 97;
            case 'QuadArrowCallout':
                return 98;
            case 'CircularArrow':
                return 99;
            // Equation shapes
            case 'MathPlus':
                return 100;
            case 'MathMinus':
                return 101;
            case 'MathMultiply':
                return 102;
            case 'MathDivision':
                return 103;
            case 'MathEqual':
                return 104;
            case 'MathNotEqual':
                return 105;
            // Stars and Banners
            case 'Explosion1':
                return 106;
            case 'Explosion2':
                return 107;
            case 'Star4Point':
                return 108;
            case 'Star5Point':
                return 109;
            case 'Star6Point':
                return 110;
            case 'Star7Point':
                return 111;
            case 'Star8Point':
                return 112;
            case 'Star10Point':
                return 113;
            case 'Star12Point':
                return 114;
            case 'Star16Point':
                return 115;
            case 'Star24Point':
                return 116;
            case 'Star32Point':
                return 117;
            case 'UpRibbon':
                return 118;
            case 'DownRibbon':
                return 119;
            case 'CurvedUpRibbon':
                return 120;
            case 'CurvedDownRibbon':
                return 121;
            case 'VerticalScroll':
                return 122;
            case 'HorizontalScroll':
                return 123;
            case 'Wave':
                return 124;
            case 'DoubleWave':
                return 125;
            // Rectangles
            case 'SnipSingleCornerRectangle':
                return 126;
            case 'SnipSameSideCornerRectangle':
                return 127;
            case 'SnipDiagonalCornerRectangle':
                return 128;
            case 'SnipAndRoundSingleCornerRectangle':
                return 129;
            case 'RoundSingleCornerRectangle':
                return 130;
            case 'RoundSameSideCornerRectangle':
                return 131;
            case 'RoundDiagonalCornerRectangle':
                return 132;
            case 'Unknown':
                return 133;
            case 'ElbowConnector':
                return 134;
            case 'CurvedConnector':
                return 135;     
            default:
                return 0;
        }
    }
    private getFollowCharacterType(followCharacterType: FollowCharacterType): number {
        switch (followCharacterType) {
            case 'Tab':
                return 0;
            case 'Space':
                return 1;
            case 'None':
                return 2;
        }
    }


    /** 
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.lists = undefined;
        this.images = undefined;
        this.endLine = undefined;
        this.startLine = undefined;
        this.endOffset = undefined;
        this.documentHelper = undefined;
        if (this.bookmarkCollection) {
            this.bookmarkCollection = undefined;
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
