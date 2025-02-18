/* eslint-disable */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import {
    HeaderFooterType, HorizontalAlignment, VerticalAlignment, HorizontalOrigin, HeightType, LineSpacingType, ListLevelPattern,
    TextAlignment, VerticalOrigin, TextWrappingStyle, FootEndNoteNumberFormat, CharacterRangeType, FontScriptType
} from '../../base/types';
import { BodyWidgetInfo, HelperMethods, LineElementInfo, SubWidthInfo, Point, FootNoteWidgetsInfo, WrapPosition, BlockInfo, SizeInfo, BorderRenderInfo, LineCountInfo } from '../editor/editor-helper';
import { WBorder, WBorders, WCharacterFormat, WListFormat, WParagraphFormat, WTabStop, WSectionFormat, WCellFormat, WColumnFormat } from '../format/index';
import { WAbstractList } from '../list/abstract-list';
import { WLevelOverride } from '../list/level-override';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import {
    BlockContainer, BlockWidget, BodyWidget, BookmarkElementBox, CommentElementBox, EditRangeEndElementBox, EditRangeStartElementBox,
    ElementBox, ErrorTextElementBox, FieldElementBox, FieldTextElementBox, HeaderFooterWidget, ImageElementBox, IWidget, LineWidget,
    ListTextElementBox, Margin, Page, ParagraphWidget, Rect, TabElementBox, TableCellWidget, TableRowWidget,
    TableWidget, TextElementBox, Widget, CheckBoxFormField, DropDownFormField, FormField, ShapeElementBox, TextFrame, ContentControl,
    FootnoteElementBox, FootNoteWidget, ShapeBase, TablePosition, CommentCharacterElementBox,
    FootnoteEndnoteMarkerElementBox,
    WTableHolder
} from './page';
import { TextSizeInfo } from './text-helper';
import { DocumentHelper, LayoutViewer, PageLayoutViewer, WebLayoutViewer } from './viewer';
import { Revision } from '../track-changes/track-changes';
import { TabPositionInfo } from '../editor';
import { TextHelper } from './text-helper';

// Check box character is rendered smaller when compared to MS Word
// So, mutiplied the font side by below factor to render check box character large.
const CHECK_BOX_FACTOR: number = 1.35;

/**
 * @private
 */
export class Layout {
    //private viewer:LayoutViewer;
    private documentHelper: DocumentHelper;
    private value: number;
    private previousPara: number;
    /**
     * @private
     */
    public islayoutFootnote: boolean = false;
    /**
     * @private
     */
    public isMultiColumnDoc: boolean = false;
    /**
     * @private
     */
    public allowLayout: boolean = true;
    /**
     * @private
     */
    public isReplaceAll: boolean = false;
    /**
     * @private
     */
    public isTextFormat: boolean =false;
    /**
    * @private
    */
     public isSectionBreakCont: boolean = false;
    /**
     * @private
     */
    public isReplacingAll: boolean = false;
    /**
     * @private
     */
    public footHeight: number = 0;
    /**
     * @private
     */
    public existFootnoteHeight: number = 0;
    /**
     * @private
     */
    public isfootMove: boolean = false;
    /**
     * @private
     */
    public footnoteHeight: number = 0;
    /**
     * @private
     */
    public isTableFootNote: boolean = false;
    /**
     * @private
     */
    public isRelayout: boolean = false;
    /**
     * @private
     */
     public isRelayoutneed: boolean = false;
     /**
      * @private
      */
    public isOverlapFloatTable: boolean = false;
    public isInitialLoad: boolean = true;
    /**
      * @private
      */
    public isInsertFormField: boolean = false;
    private fieldBegin: FieldElementBox = undefined;
    private maxTextHeight: number = 0;
    private maxBaseline: number = 0;
    private maxTextBaseline: number = 0;
    private isFieldCode: boolean = false;
    private isRtlFieldCode: boolean = false;
    private isRTLLayout: boolean = false;
    private isSkipFirstLineIndent: boolean = false;
    public currentCell: TableCellWidget = undefined;
    public isFootnoteContentChanged: boolean = false;
    public isEndnoteContentChanged: boolean = false;
    private keepWithNext: boolean = false;
    private is2013Justification: boolean = false;
    private nextElementToLayout: ElementBox = undefined;
    private endNoteHeight: number = 0;
    private isMultiColumnSplit = false;
    private isMultiColumnLayout: boolean = false;
    private skipUpdateContainerWidget = false;
    private isIFfield: boolean = false;
    /**
     * @private
     */
    public startat: number;
    public isLayoutWhole: boolean = false;

    /**
     * @private
     */
    public isBidiReLayout: boolean = false;

    /**
     * @private
     */
    public defaultTabWidthPixel: number = 48;

    /**
     * @private
     */
    public isRelayoutFootnote: boolean = false;

    private isRelayoutOverlap: boolean = false;
    private skipRelayoutOverlap: boolean = false;
    private startOverlapWidget: BlockWidget;
    private endOverlapWidget: BlockWidget;

    private isWrapText: boolean = false;
    private isYPositionUpdated: boolean = false;
    private isXPositionUpdated: boolean = false;
    private hasFloatingElement: boolean = false;
    private isFootNoteLayoutStart: boolean = false;
    public wrapPosition: WrapPosition[] = [];
    private shiftedFloatingItemsFromTable: any = [];
    public isDocumentContainsRtl: boolean = false;
    /**
     * @private
     */
    public isPastingContent: boolean = false;

    private layoutedFootnoteElement: FootnoteElementBox[] = [];
    /**
      * @private
      */
    public isAllColumnHasAutoWidthType: boolean = false;

    private isSameStyle(currentParagraph: ParagraphWidget, isAfterSpacing: boolean): boolean {
        let nextOrPrevSibling: ParagraphWidget = undefined;
        if (isAfterSpacing) {
            if (currentParagraph.nextWidget instanceof ParagraphWidget) {
                nextOrPrevSibling = currentParagraph.nextWidget as ParagraphWidget;
            }
        } else {
            if (currentParagraph.previousWidget instanceof ParagraphWidget) {
                nextOrPrevSibling = currentParagraph.previousWidget as ParagraphWidget;
            }
        }
        if (isNullOrUndefined(nextOrPrevSibling)) {
            //Need to skip contextual spacing behavior when document is not Word 2013 and paragraph preserved inside the table cell with AllowSpaceOfSameStyleInTable compatiblity options.
            if (currentParagraph.paragraphFormat.contextualSpacing && (currentParagraph.isInsideTable ? (!this.documentHelper.allowSpaceOfSameStyleInTable || this.documentHelper.compatibilityMode === 'Word2013') : false)) {
                if (currentParagraph.index === 0) {
                    nextOrPrevSibling = this.updateFirstParagraphSpacingBasedOnContextualSpacing(currentParagraph, isAfterSpacing);
                } else if (currentParagraph.index === currentParagraph.associatedCell.childWidgets.length - 1) {
                    nextOrPrevSibling = this.updateLastParagraphSpacingBasedOnContextualSpacing(currentParagraph);
                    if (nextOrPrevSibling === currentParagraph) {
                        return true;
                    }
                }
            }
            if (isNullOrUndefined(nextOrPrevSibling)) {
                return false;
            }
        }
        if (nextOrPrevSibling instanceof ParagraphWidget && currentParagraph.paragraphFormat.baseStyle === nextOrPrevSibling.paragraphFormat.baseStyle && (currentParagraph.isInsideTable ? !this.documentHelper.allowSpaceOfSameStyleInTable : true)) {
            if(currentParagraph.paragraphFormat.listFormat.listId >= 0 && nextOrPrevSibling.paragraphFormat.listFormat.listId >= 0){
                if(!currentParagraph.paragraphFormat.contextualSpacing){
                    if(isAfterSpacing && currentParagraph.paragraphFormat.spaceAfterAuto){
                        return true;
                    } else if(!isAfterSpacing && currentParagraph.paragraphFormat.spaceBeforeAuto){
                        return true;
                    }
                }
            }
            return currentParagraph.paragraphFormat.contextualSpacing;
        } 
        return false;
    }

    private updateFirstParagraphSpacingBasedOnContextualSpacing(paragraph: ParagraphWidget, isAfterSpacing: boolean): ParagraphWidget {
        let ownerCell: TableCellWidget = paragraph.associatedCell;
        let ownerRow: TableRowWidget = ownerCell.ownerRow;
        let ownerTable: TableWidget = ownerRow.ownerTable;
        let nextOrPrevSibling: ParagraphWidget;
        if(isAfterSpacing) {
            nextOrPrevSibling = isNullOrUndefined(paragraph.nextRenderedWidget) ? (!isNullOrUndefined(ownerCell.nextRenderedWidget)? (ownerCell.nextRenderedWidget as TableCellWidget).firstChild as ParagraphWidget : undefined) : paragraph.nextRenderedWidget as ParagraphWidget;
        } else {
            nextOrPrevSibling = isNullOrUndefined(paragraph.previousRenderedWidget) ? (!isNullOrUndefined(ownerCell.previousRenderedWidget)? (ownerCell.previousRenderedWidget as TableCellWidget).firstChild as ParagraphWidget : undefined) : paragraph.previousRenderedWidget as ParagraphWidget;
        }
        if (ownerCell.index === 0 && paragraph.index === 0)
        {
            if (ownerRow.index === 0)
            {
                if (ownerTable.isInsideTable && ownerTable.index == 0) {
                    nextOrPrevSibling = this.checkOwnerTablePrevItem(ownerTable, paragraph);
                }
                else {
                    //If paragraph is preserved in first row first cell means, need to check owner table previous sibling.
                    let ownerTablePrevSibling: ParagraphWidget = ownerTable.previousRenderedWidget as ParagraphWidget;
                    return ownerTablePrevSibling;
                }
            }
            else {
                if (isNullOrUndefined(nextOrPrevSibling) && paragraph.paragraphFormat.baseStyle.name === "Normal" && paragraph.paragraphFormat.listFormat.listId < 0) {
                    return paragraph;
                }
                return nextOrPrevSibling;
            }
        } else if (paragraph.index === 0 && !isAfterSpacing) {
            //If para is first item in any cell excluding first cell, need to check previous cell last item.
            let prevCell: TableCellWidget = ownerRow.childWidgets[ownerCell.index - 1] as TableCellWidget;
            let prevCelllastItem: BlockWidget = prevCell.childWidgets[prevCell.childWidgets.length - 1] as BlockWidget;
            //if previous cell last item is table means skip before spacing value no need to check any paragraph styles.
            if (prevCelllastItem instanceof TableWidget && paragraph.paragraphFormat.baseStyle.name === "Normal" && paragraph.paragraphFormat.listFormat.listId < 0)
            {
                return paragraph;
            }
        }
        return nextOrPrevSibling;
    }

    private updateLastParagraphSpacingBasedOnContextualSpacing(paragraph: ParagraphWidget): ParagraphWidget {
        let ownerCell: TableCellWidget = paragraph.associatedCell;
        let ownerRow: TableRowWidget = ownerCell.ownerRow;
        let nextCellFirstItem: BlockWidget;
        if (ownerCell.index === ownerRow.childWidgets.length - 1 && paragraph.index === ownerCell.childWidgets.length - 1) {
            if (paragraph.paragraphFormat.baseStyle.name === "Normal" && paragraph.paragraphFormat.listFormat.listId < 0) {
                //If para preserved in last item in cell and cell is last cell in current row means its after spacing value not considered.
                return paragraph;
            }
        }
        else if (paragraph.index === ownerCell.childWidgets.length - 1) {
            //If current para is last item in current cell then need to check next cell first item.
            let nextCell: TableCellWidget = ownerRow.childWidgets[ownerCell.index + 1] as TableCellWidget;
            nextCellFirstItem = nextCell.firstChild as BlockWidget;

            //If next cell first item is table then need to check inner table first para.
            //This is applicable for multiple nested table so when first item is table it try to get its first paragraph.
            while (nextCellFirstItem instanceof TableWidget) {
                nextCellFirstItem = (((nextCellFirstItem as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as BlockWidget;
            }
        }
        return nextCellFirstItem as ParagraphWidget;
    }

    private checkOwnerTablePrevItem(ownerTable: TableWidget, paragraph: ParagraphWidget): ParagraphWidget {
        let row: TableRowWidget = ownerTable.associatedCell.ownerRow;
        let prevSibling: BlockWidget;
        if (row.index > 0) {
            if (paragraph.paragraphFormat.baseStyle.name === "Normal" && paragraph.paragraphFormat.listFormat.listId < 0) {
                return paragraph;
            }
        }
        else {
            if (row.ownerTable.isInsideTable && row.ownerTable.index === 0) {
                this.checkOwnerTablePrevItem(row.ownerTable, paragraph);
            }
            else {
                let prevSibling: BlockWidget = row.ownerTable.previousRenderedWidget as BlockWidget;
                return prevSibling as ParagraphWidget;
            }
        }
        return prevSibling as ParagraphWidget;
    }

    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }

    public layout(): void {
        // Todo: Need to handle complete document layout(relayout).
        //const page: Page = this.documentHelper.pages[0];
        //const body: BodyWidget = page.bodyWidgets[0];
    }
    /**
     * Releases un-managed and - optionally - managed resources.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
        this.value = undefined;
        this.allowLayout = undefined;
        this.isInitialLoad = undefined;
        this.fieldBegin = undefined;
        this.maxTextHeight = undefined;
        this.maxBaseline = undefined;
        this.maxTextBaseline = undefined;
        this.isSkipFirstLineIndent = undefined;
        this.isFieldCode = undefined;
        this.footnoteHeight = undefined;
        this.isMultiColumnDoc = undefined;
        this.isIFfield = undefined;
        this.isPastingContent = undefined;
    }

    public layoutItems(sections: BodyWidget[], isReLayout: boolean, isContinuousSection?: boolean): void {
        let page: Page;
        let height: number = 0;
        let width: number = 0;
        for (let i: number = 0; i < sections.length; i++) {
            const section: BodyWidget = sections[i] as BodyWidget;
            if(section.sectionFormat.numberOfColumns > 1) {
                this.isMultiColumnDoc = true;
            }
            const nextSection: BodyWidget = sections[i + 1] as BodyWidget;
            this.viewer.columnLayoutArea.setColumns(section.sectionFormat);
            let lastpage: Page = this.documentHelper.pages[this.documentHelper.pages.length - 1];
            let bodyWidget: BodyWidget;
            if (!isNullOrUndefined(lastpage) && !isNullOrUndefined(lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1]) && lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1].childWidgets.length === 0 && !isNullOrUndefined(lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1].previousSplitWidget)) {
                bodyWidget = lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1].previousSplitWidget as BodyWidget;
            }
            /* eslint-disable-next-line max-len */
            if (i > 0 && !isNullOrUndefined(bodyWidget) && !isNullOrUndefined(bodyWidget.lastChild) && !(bodyWidget.lastChild instanceof TableWidget) && ((this.documentHelper.compatibilityMode === 'Word2013' && (bodyWidget.lastChild as ParagraphWidget).isEndsWithPageBreak || (bodyWidget.lastChild as ParagraphWidget).isEndsWithColumnBreak)) && lastpage.bodyWidgets[0].childWidgets.length === 0) {
                const removedPages = this.documentHelper.pages.splice(this.documentHelper.pages.length - 1, 1);
                removedPages[0].destroy();
                lastpage = this.documentHelper.pages[this.documentHelper.pages.length - 1];
            }
            let breakCode: string = section.sectionFormat.breakCode;
            let prevSection: BodyWidget = undefined;
            if (i !== 0 && this.documentHelper.compatibilityMode === 'Word2010' && breakCode === 'NewColumn') {
                let splitWidgets: BodyWidget[] = sections[i - 1].getSplitWidgets() as BodyWidget[];
                prevSection = splitWidgets[splitWidgets.length - 1];
                if (prevSection.sectionFormat.columns.length > 1 && section.sectionFormat.columns.length > 1 && prevSection.sectionFormat.columns.length === section.sectionFormat.columns.length && prevSection.sectionFormat.columns.length - 1 !== prevSection.columnIndex && !(prevSection.lastChild instanceof ParagraphWidget && prevSection.lastChild.isEndsWithPageBreak)) {
                    var nextColumn = this.viewer.columnLayoutArea.getNextColumnByBodyWidget(prevSection);
                    if (!isNullOrUndefined(nextColumn)) {
                        section.columnIndex = nextColumn.index;
                        section.isWord2010NextColumn = true;
                        section.y = prevSection.y;
                        this.viewer.clientActiveArea.height -= section.y - this.viewer.clientActiveArea.y;
                        this.viewer.clientActiveArea.y = section.y;
                    }
                }
            }
            if (!section.isWord2010NextColumn && breakCode !== 'NoBreak') {
                breakCode = 'NewPage';
            }
            if ((i === 0 && !isContinuousSection) || (i !== 0 && !section.isWord2010NextColumn && (isNullOrUndefined(breakCode) || breakCode === 'NewPage' || height !== section.sectionFormat.pageHeight || width !== section.sectionFormat.pageWidth || (!isNullOrUndefined(lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1].lastChild) && (lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1].lastChild as ParagraphWidget).isEndsWithPageBreak)))) {
                page = this.viewer.createNewPage(section);
            } else {
                let clientY: number = this.documentHelper.viewer.clientActiveArea.y;
                let clientHeight: number = this.documentHelper.viewer.clientActiveArea.height;
                if (isContinuousSection) {
                    let section: BodyWidget = this.getBodyWidget(lastpage.bodyWidgets[lastpage.bodyWidgets.length - 1], true);
                    let height: number = this.getNextWidgetHeight(section);
                    this.viewer.updateClientArea(section, section.page);
                    clientHeight = this.viewer.clientActiveArea.height - (height - this.viewer.clientActiveArea.y);
                    clientY = height;
                    isContinuousSection = false;
                }
                //if (i - 1 > 0) {
                page = lastpage;
                //}
                page.bodyWidgets.push(section);
                page.bodyWidgets[page.bodyWidgets.length - 1].page = page;
                this.documentHelper.viewer.updateClientArea(section, page);
                this.documentHelper.viewer.clientActiveArea.y = clientY;
                this.documentHelper.viewer.clientActiveArea.height = clientHeight;
            }
            height = section.sectionFormat.pageHeight;
            width = section.sectionFormat.pageWidth;
            this.addBodyWidget(this.viewer.clientActiveArea, section);
            if (this.documentHelper.pages.length > 1) {
                let pageIndex: number = 0;
                for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
                    const prevPage: Page = this.documentHelper.pages[i];
                    const prevSectionIndex: number = prevPage.sectionIndex;
                    const index: number = section.index;
                    if (prevSectionIndex > index || prevPage === page) {
                        break;
                    }
                    pageIndex++;
                }
                if (pageIndex < this.documentHelper.pages.length - 1) {
                    this.documentHelper.insertPage(pageIndex, page);
                }
            }
            this.layoutSection(section, 0, nextSection);
            if (section.isWord2010NextColumn && !isNullOrUndefined(prevSection)) {
                const sectionHeight: number = this.getNextWidgetHeight(prevSection);
                if (this.viewer.clientActiveArea.y < sectionHeight) {
                    this.viewer.updateClientArea(prevSection, prevSection.page);
                    this.viewer.clientActiveArea.height = this.viewer.clientActiveArea.height - (sectionHeight - this.viewer.clientActiveArea.y);
                    this.viewer.clientActiveArea.y = sectionHeight;
                }
            }
        }
        if (!isReLayout) {
            this.layoutComments(this.documentHelper.comments);
        }
        this.updateFieldElements();
        if (this.documentHelper.owner.layoutType === 'Pages') {
            this.layoutEndNoteElement();
        }
        
        /* tslint:disable:align */
        setTimeout((): void => {
            if (this.documentHelper) {
                this.documentHelper.isScrollHandler = true;
                // if (this.documentHelper.owner.isSpellCheck && this.documentHelper.owner.spellChecker.enableOptimizedSpellCheck) {
                //     this.documentHelper.triggerElementsOnLoading = true;
                // }
                this.documentHelper.clearContent();
                this.viewer.updateScrollBars();
                this.documentHelper.isScrollHandler = false;
                this.isInitialLoad = false;
            }
        }, 50);
    }
    /**
     * @private
     */
    public layoutComments(comments: CommentElementBox[]): void {
        if (!isNullOrUndefined(comments)) {
            this.viewer.owner.commentReviewPane.layoutComments(comments);
        }
    }
    private layoutSection(section: BodyWidget, index: number, nextSection: BodyWidget): void {
        let block: BlockWidget = section.firstChild as BlockWidget;
        let nextBlock: BlockWidget;
        let prevBlock: BlockWidget;
        do {

            if (!this.isLayoutWhole && block instanceof TableWidget && block.tableFormat.preferredWidthType === 'Auto'
                && !block.tableFormat.allowAutoFit) {
                block.calculateGrid();
            }
            if (!isNullOrUndefined(block)) {
                this.viewer.updateClientAreaForBlock(block, true, undefined, true, true);
                let bodyIndex: number = block.containerWidget.indexInOwner;
                nextBlock = this.layoutBlock(block, index);
                index = 0;
                this.viewer.updateClientAreaForBlock(block, false);
                prevBlock = block;
                block = nextBlock;
            }
        } while (block);
        block = section.firstChild as BlockWidget;
        if (this.viewer instanceof PageLayoutViewer && section.sectionFormat.numberOfColumns > 1 && !isNullOrUndefined(nextSection) && nextSection.sectionFormat.breakCode === 'NoBreak' && (section.sectionFormat.breakCode === 'NoBreak' || (section.sectionIndex === section.page.bodyWidgets[0].sectionIndex))) {
            if (this.getColumnBreak(section)) {
                let splittedSection: BodyWidget[] = section.getSplitWidgets() as BodyWidget[];
                let bodyWidget: BodyWidget = splittedSection[splittedSection.length - 1];
                if (!isNullOrUndefined(section.page.nextPage)) {
                    this.splitBodyWidgetBasedOnColumn(bodyWidget);
                } else {
                    let firstBody: BodyWidget = this.getBodyWidget(bodyWidget, true);
                    this.viewer.updateClientArea(firstBody, firstBody.page);
                    let height: number = this.getNextWidgetHeight(firstBody);
                    this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                    this.viewer.clientActiveArea.y = height;
                }
            } else {
                if (!isNullOrUndefined(section.page.nextPage)) {
                    section = this.documentHelper.pages[this.documentHelper.pages.length - 1].bodyWidgets[0];
                }
                this.splitBodyWidgetBasedOnColumn(section);
            }
        } 

        let page: Page;
        if (block && block.bodyWidget && block.bodyWidget.page) {
            page = block.bodyWidget.page;
        }
        while (page) {
            if (page.footnoteWidget) {
                this.layoutfootNote(page.footnoteWidget);
                page = page.nextPage;
            } else {
                page = page.nextPage;
            }
        } 
        page = undefined;
        block = undefined;
    }
    /**
     * @private
     *  
     */
    public reLayoutMultiColumn(section: BodyWidget, isFirstBlock: boolean, blockIndex: number): void {
        this.isInitialLoad = true;
        section = section.getSplitWidgets()[0] as BodyWidget;
        this.combineMultiColumnForRelayout(section);
        if (section.sectionFormat.numberOfColumns > 1) {
            this.isMultiColumnDoc = true;
        }
        this.isMultiColumnSplit = false;
        const previousSection: BodyWidget = section.previousRenderedWidget as BodyWidget;
        let nextSection: BodyWidget = section.nextRenderedWidget as BodyWidget;
        let isUpdatedClientArea: boolean = false;
        // Section's Y position is not updated properly when the two sections combined and layouted.
        if (!isFirstBlock && !isNullOrUndefined(section.firstChild) && section.firstChild instanceof ParagraphWidget && section.y !== section.firstChild.y) {
            section.y = section.firstChild.y;
        }
        if (isFirstBlock && nextSection && section.page !== nextSection.page && section.firstChild instanceof ParagraphWidget) {
            let paragraph: ParagraphWidget = section.firstChild as ParagraphWidget;
            let lineHeight: number = 0;
            if (paragraph.isEmpty()) {
                lineHeight = this.documentHelper.textHelper.getParagraphMarkSize(paragraph.characterFormat).Height;
            } else {
                let firstLine: LineWidget = paragraph.childWidgets[0] as LineWidget;
                lineHeight = this.getMaxElementHeight(firstLine);
            }
            let previousBlock: BlockWidget = paragraph.previousRenderedWidget as BlockWidget;
            if (section.y === this.viewer.clientActiveArea.y && lineHeight > this.viewer.clientActiveArea.height) {
                previousBlock = isNullOrUndefined(previousBlock) ? paragraph : previousBlock;
                this.moveBlocksToNextPage(previousBlock);
                this.viewer.columnLayoutArea.setColumns(section.sectionFormat);
                this.viewer.updateClientArea(section, section.page);
                isUpdatedClientArea = true;
            }
        } else if (!isNullOrUndefined(previousSection) && previousSection.page !== section.page && section.firstChild instanceof ParagraphWidget && previousSection.lastChild instanceof ParagraphWidget) {
            let previousParagraph: ParagraphWidget = previousSection.lastChild as ParagraphWidget;
            let paragraph: ParagraphWidget = section.firstChild as ParagraphWidget;
            if (section instanceof BodyWidget && previousSection.lastChild && previousParagraph instanceof ParagraphWidget && previousSection.sectionFormat.breakCode === 'NoBreak' && section.page.index !== previousSection.page.index && section.index !== previousSection.index) {
                let bodyWidget: BodyWidget = previousSection;
                if (bodyWidget.sectionFormat.columns.length > 1) {
                    bodyWidget = this.getBodyWidget(bodyWidget, true);
                }
                let bottom: number = HelperMethods.round((this.getNextWidgetHeight(bodyWidget) + paragraph.height), 2);
                // Bug 858530: Shift the widgets to previous container widget if the client height is not enough to place this widget.
                if (!(previousSection.lastChild as ParagraphWidget).isEndsWithPageBreak && !(previousSection.lastChild as ParagraphWidget).isEndsWithColumnBreak 
                    && bottom <= HelperMethods.round(this.viewer.clientActiveArea.bottom, 2)) {
                    let page: Page = previousSection.page;
                    let nextPage: Page = section.page;
                    for (let j: number = 0; j < nextPage.bodyWidgets.length; j++) {
                        let nextBodyWidget: BodyWidget = nextPage.bodyWidgets[j];
                        nextPage.bodyWidgets.splice(nextPage.bodyWidgets.indexOf(nextBodyWidget), 1);
                        page.bodyWidgets.splice(page.bodyWidgets.length, 0, nextBodyWidget);
                        nextBodyWidget.page = page;
                        j--;
                    }
                    section.y = this.viewer.clientActiveArea.y;
                    this.documentHelper.removeEmptyPages();
                }
            }
        }
        if (!isUpdatedClientArea) {
            this.viewer.columnLayoutArea.setColumns(section.sectionFormat);
            this.viewer.updateClientArea(section, section.page);
            this.viewer.clientActiveArea.height -= section.y - this.viewer.clientActiveArea.y;
            this.viewer.clientActiveArea.y = section.y;
        }
        this.addBodyWidget(this.viewer.clientActiveArea, section);
        this.clearBlockWidget(section.childWidgets, true, true, true);
        this.isMultiColumnLayout = true;
        this.reLayoutMultiColumnBlock(section, nextSection, blockIndex);
        this.isMultiColumnLayout = false;
        this.isInitialLoad = false;
        let splitSections: Widget[] = section.getSplitWidgets();
        let lastSection: BodyWidget = splitSections[splitSections.length - 1] as BodyWidget;
        const firstBody: BodyWidget = this.getBodyWidget(lastSection, true);
        this.viewer.updateClientArea(firstBody, firstBody.page);
        const height: number = this.getNextWidgetHeight(firstBody);
        this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
        this.viewer.clientActiveArea.y = height;
        if (!isNullOrUndefined(lastSection) && !isNullOrUndefined(lastSection.nextRenderedWidget)) {
            nextSection = lastSection.nextRenderedWidget as BodyWidget;
            let clientY: number = this.documentHelper.viewer.clientActiveArea.y;
            let clientHeight: number = this.documentHelper.viewer.clientActiveArea.height;
            this.documentHelper.viewer.updateClientArea(nextSection, nextSection.page);
            this.documentHelper.viewer.clientActiveArea.y = clientY;
            this.documentHelper.viewer.clientActiveArea.height = clientHeight;
            this.documentHelper.blockToShift = nextSection.firstChild as BlockWidget;
        }
        if (isNullOrUndefined(lastSection.nextRenderedWidget) || 
            (!isNullOrUndefined(lastSection.nextRenderedWidget) && lastSection.sectionFormat.breakCode !== 'NoBreak' && (lastSection.nextRenderedWidget as BodyWidget).sectionFormat.pageHeight !== lastSection.sectionFormat.pageHeight && (lastSection.nextRenderedWidget as BodyWidget).sectionFormat.pageWidth !== lastSection.sectionFormat.pageWidth)) {
            this.documentHelper.blockToShift = undefined;
        }
    }
    private combineMultiColumnForRelayout(section: BodyWidget): void {
        let splitSections: Widget[] = section.getSplitWidgets();
        let firstSection: BodyWidget = splitSections[0] as BodyWidget;
        section = splitSections[splitSections.length - 1] as BodyWidget;
        while (section !== firstSection) {
            let prevSection: BodyWidget = section.previousRenderedWidget as BodyWidget;
            let isPreviousSplit: boolean = false;
            for (let i = 0; i < section.childWidgets.length; i++) {
                if (section.childWidgets[i] instanceof BlockWidget && !isNullOrUndefined((section.childWidgets[i] as BlockWidget).previousSplitWidget)
                    && !isNullOrUndefined((section.childWidgets[i] as BlockWidget).previousSplitWidget.previousSplitWidget)
                    && ((section.childWidgets[i] as BlockWidget).previousSplitWidget as BlockWidget).bodyWidget.page !== ((section.childWidgets[i] as BlockWidget).previousSplitWidget.previousSplitWidget as BlockWidget).bodyWidget.page) {
                    isPreviousSplit = true;
                }
                if ((section.childWidgets[i] instanceof BlockWidget && !isNullOrUndefined((section.childWidgets[i] as BlockWidget).previousSplitWidget) && ((section.childWidgets[i] as BlockWidget).previousSplitWidget as BlockWidget).bodyWidget.page === (section.childWidgets[i] as BlockWidget).bodyWidget.page && !isPreviousSplit)) {
                    (section.childWidgets[i] as BlockWidget).combineWidget(this.viewer) as BlockWidget;
                    if (prevSection.lastChild instanceof TableWidget) {
                        this.updateCellHeightInCombinedTable(prevSection.lastChild as TableWidget);
                    }
                    i--;
                    continue;
                }
                prevSection.childWidgets.push(section.childWidgets[i]);
                (section.childWidgets[i] as BlockWidget).containerWidget = prevSection;
                ((section.childWidgets[i] as BlockWidget).containerWidget as BodyWidget).page = prevSection.page;
                section.childWidgets.splice(0, 1);
                i--;
            } section = section.previousRenderedWidget as BodyWidget;
        }
        this.documentHelper.removeEmptyPages();
    }
    private reLayoutMultiColumnBlock(section: BodyWidget, nextSection: BodyWidget, blockIndex: number): void {
        let block: BlockWidget = section.firstChild as BlockWidget;
        let nextBlock: BlockWidget;
        do {
            if (block instanceof TableWidget && block.tableFormat.preferredWidthType === 'Auto'
                && !block.tableFormat.allowAutoFit) {
                block.calculateGrid();
            }
            if (!isNullOrUndefined(block)) {
                this.viewer.updateClientAreaForBlock(block, true, undefined, true);
                nextBlock = this.layoutBlock(block, 0, block.index < blockIndex ? true : false);
                this.viewer.updateClientAreaForBlock(block, false);
                block = nextBlock;
            }
        } while (block && section.getSplitWidgets().indexOf(block.bodyWidget) !== -1);
        block = section.firstChild as BlockWidget;
        if (this.viewer instanceof PageLayoutViewer && section.sectionFormat.numberOfColumns > 1 && !isNullOrUndefined(nextSection) && nextSection.sectionFormat.breakCode === 'NoBreak' && (section.sectionFormat.breakCode === 'NoBreak' || (section.sectionIndex === section.page.bodyWidgets[0].sectionIndex))) {
            let splittedSection: BodyWidget[] = section.getSplitWidgets() as BodyWidget[];
            let bodyWidget: BodyWidget = splittedSection[splittedSection.length - 1];
            if (this.getColumnBreak(section)) {
                if (section.page !== bodyWidget.page) {
                    this.splitBodyWidgetBasedOnColumn(bodyWidget);
                } else {
                    let firstBody: BodyWidget = this.getBodyWidget(bodyWidget, true);
                    this.viewer.updateClientArea(firstBody, firstBody.page);
                    let height: number = this.getNextWidgetHeight(firstBody);
                    this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                    this.viewer.clientActiveArea.y = height;
                }
            } else if (!isNullOrUndefined(section.page.nextPage)) {
                this.splitBodyWidgetBasedOnColumn(bodyWidget);
            }
        }
    }
    private splitBodyWidgetBasedOnColumn(section: BodyWidget): void {
        section = this.getBodyWidget(section, true);
        let firstSection: BodyWidget = section;
        this.isMultiColumnSplit = true;
        if (!this.isInitialLoad && section.sectionFormat.equalWidth) {
            let previousStartIndex = this.documentHelper.selection.startOffset;
            let previousEndIndex = this.documentHelper.selection.endOffset;
            this.combineMultiColumn(section);
            this.layoutMultiColumnBody(section, false);
            if (previousStartIndex !== this.documentHelper.selection.startOffset) {
                this.documentHelper.selection.select(previousStartIndex, previousEndIndex);
            }
        }
        this.combineMultiColumn(section);
        let lineCountInfo: LineCountInfo = this.getCountOrLine(section, undefined, undefined, true);
        let totalHeight: number = lineCountInfo.lineCount;
        let lineToBeSplit: number = Math.round(totalHeight / section.sectionFormat.numberOfColumns);
        while (section) {
            let lineCountInfo: LineCountInfo = this.getCountOrLine(section, lineToBeSplit, true, false);
            let line: LineWidget = lineCountInfo.lineWidget;
            let lineIndexInCell: number = lineCountInfo.lineCount;
            if (!isNullOrUndefined(line)) {
                if (line.paragraph.containerWidget instanceof BodyWidget) {
                    this.moveToNextLine(line, true, line.indexInOwner);
                } else if (line.paragraph.containerWidget instanceof TableCellWidget) {
                    const table: TableWidget[] = [line.paragraph.containerWidget.ownerTable];
                    const rows: TableRowWidget[] = [line.paragraph.containerWidget.ownerRow];
                    let index: number = line.paragraph.containerWidget.index;
                    if (table[table.length - 1].isInsideTable) {
                        table[table.length - 1] = this.getParentTable(table[table.length - 1]);
                        rows[rows.length - 1] = this.getParentRow(rows[rows.length - 1]);
                    }
                    this.updateWidgetsToTable(table, rows, rows[rows.length - 1], false, lineIndexInCell, index, true);
                    let tableWidget: TableWidget = table[table.length - 1];
                    let rowWidget: TableRowWidget = rows[rows.length - 1];
                    let nextRow: TableRowWidget = rowWidget.nextRenderedWidget as TableRowWidget;
                    while (nextRow) {
                        this.clearRowWidget(nextRow, true, true, false);
                        nextRow = this.layoutRow(table, nextRow);
                        nextRow = nextRow.nextRenderedWidget as TableRowWidget;
                    }
                    if (!isNullOrUndefined(tableWidget.nextRenderedWidget) && section.sectionFormat.equalWidth) {
                        this.documentHelper.blockToShift = tableWidget.nextRenderedWidget as BlockWidget;
                        this.documentHelper.layout.shiftLayoutedItems(false);
                    }
                }
                let firstBody: BodyWidget = this.getBodyWidget(line.paragraph.bodyWidget, true);
                let lastBody: BodyWidget = this.getBodyWidget(firstBody, false);
                if (!firstBody.sectionFormat.equalWidth && lastBody.sectionFormat.numberOfColumns - 1 === lastBody.columnIndex && isNullOrUndefined(lastBody.nextSplitWidget)) {
                    let nonEqualBody: BodyWidget = firstBody;
                    let initialCount: number = (this.getCountOrLine(firstBody)).lineCount;
                    this.layoutMultiColumnBody(nonEqualBody, true);
                    let finalCount: number = (this.getCountOrLine(firstBody)).lineCount;
                    if (initialCount !== finalCount) {
                        this.splitBodyWidgetBasedOnColumn(firstBody);
                    }
                }
                if (isNullOrUndefined(lastBody.nextSplitWidget)) {
                    this.viewer.updateClientArea(firstBody, firstBody.page);
                    let height: number = this.getNextWidgetHeight(firstBody);
                    this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                    this.viewer.clientActiveArea.y = height;
                    this.viewer.clientArea.y = this.viewer.clientActiveArea.y;
                    this.viewer.clientArea.height = this.viewer.clientActiveArea.height;
                }
            }
            section = section.nextRenderedWidget as BodyWidget;
            if (!isNullOrUndefined(section) && section.columnIndex === section.sectionFormat.numberOfColumns - 1) {
                break;
            }
        } this.isMultiColumnSplit = false;
        if (!this.isInitialLoad) {
            section = this.getBodyWidget(firstSection, false);
            if (!isNullOrUndefined(section.nextRenderedWidget)) {
                this.documentHelper.blockToShift = section.nextRenderedWidget.firstChild as BlockWidget;
            }
        }
    }

     /**
    * @private
    */
   public getColumnBreak(section: BodyWidget): boolean {
    let firstBody: BodyWidget = this.getBodyWidget(section, true);
    if (firstBody.sectionFormat.numberOfColumns <= 1) {
        return false;
    }
    while (firstBody) {
        if (firstBody.lastChild instanceof ParagraphWidget && firstBody.lastChild.isEndsWithColumnBreak) {
            return true;
        }
        if (isNullOrUndefined(firstBody.nextRenderedWidget) || firstBody.index !== firstBody.nextRenderedWidget.index) {
            break;
        }
        firstBody = firstBody.nextRenderedWidget as BodyWidget;
    } return false;
   }
    private layoutMultiColumnBody(nonEqualBody: BodyWidget, updatePosition: boolean): void {
        let skipPosition: boolean = false;
        while (nonEqualBody) {
            if (!skipPosition) {
                this.viewer.updateClientArea(nonEqualBody, nonEqualBody.page);
                this.viewer.clientActiveArea.height -= nonEqualBody.y - this.viewer.clientActiveArea.y;
                if (nonEqualBody instanceof FootNoteWidget) {
                    this.viewer.clientArea.height = Number.POSITIVE_INFINITY;
                    this.viewer.clientActiveArea.height = Number.POSITIVE_INFINITY;
                } else {
                    this.viewer.clientActiveArea.y = nonEqualBody.y;
                }
            }
            skipPosition = updatePosition ? false : true;
            for (let i = 0; i < nonEqualBody.childWidgets.length; i++) {
                let block: BlockWidget = nonEqualBody.childWidgets[i] as BlockWidget;
                if (block instanceof TableWidget) {
                    this.clearTableWidget(block, true, true, true);
                }
                this.viewer.updateClientAreaForBlock(block, true);
                let isUpdatedList: boolean = false;
                if (block instanceof ParagraphWidget && !isNullOrUndefined(block.paragraphFormat) 
                    && block.paragraphFormat.listFormat.listId !== -1) {
                    isUpdatedList = block.paragraphFormat.listFormat.listLevelNumber === 0 ? true : false;
                }
                this.layoutBlock(block as BlockWidget, 0, isUpdatedList);
                this.viewer.updateClientAreaForBlock(block, false);
            }
            if (nonEqualBody.columnIndex === nonEqualBody.sectionFormat.numberOfColumns - 1 || (!isNullOrUndefined(nonEqualBody.nextRenderedWidget) && nonEqualBody.sectionIndex !== (nonEqualBody.nextRenderedWidget as BodyWidget).sectionIndex)) {
                break;
            } nonEqualBody = nonEqualBody.nextRenderedWidget as BodyWidget;
        }
    }
    public getNextWidgetHeight(body: BodyWidget): number {
        let height: number = 0;
        let updatedHeight: number = 0;
        while (body && body.childWidgets.length > 0) {
            height = (body.lastChild as BlockWidget).height;
            if (body.lastChild instanceof TableWidget) {
                height = this.getHeight(body.lastChild);
            }
            height += (body.lastChild as BlockWidget).y;
            if (height > updatedHeight) {
                updatedHeight = height;
            }
            if (!isNullOrUndefined(body) && body.columnIndex === body.sectionFormat.numberOfColumns - 1 || body.sectionFormat.numberOfColumns === 0 || (!isNullOrUndefined(body.nextRenderedWidget) && body.sectionIndex !== (body.nextRenderedWidget as BodyWidget).sectionIndex)) {
                break;
            }
            body = body.nextRenderedWidget as BodyWidget;
        } return updatedHeight;
    }

    private getHeight(block: BlockWidget): number {
        let height: number = 0;
        for (let i = 0; i < block.childWidgets.length; i++) {
            height += (block.childWidgets[i] as TableRowWidget).height;
        } return height;
    }

    private getBookmarkMargin(lineWidget: LineWidget): number {
        let height: number = 0;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let element: ElementBox = lineWidget.children[i];
            if (!isNullOrUndefined(element.margin) && element instanceof BookmarkElementBox) {
                height = element.margin.top + element.margin.bottom;
                break;
            }
        }
        return height;
    }

    private getCountOrLine(section: BodyWidget, lineToBeSplit?: number, isSplit?: boolean, getHeight?: boolean): LineCountInfo {
        let totalNoOflines: number = 0;
        let line: LineWidget;
        let count: number = 0;
        let skip: boolean = false;
        let maxHeight: number = 0;
        let lineIndexInCell: number = 0;
        let splitCountLine: LineCountInfo;
        let lineMargin: number = 0;
        while (section) {
            for (let i: number = 0; i < section.childWidgets.length; i++) {
                let block: BlockWidget = section.childWidgets[i] as BlockWidget;
                if (block instanceof ParagraphWidget) {
                    for (let j: number = 0; j < block.childWidgets.length; j++) {
                        let lineWidget: LineWidget = block.childWidgets[j] as LineWidget;
                        lineMargin = 0;
                        if (!isNullOrUndefined(lineWidget.margin)) {
                            lineMargin = lineWidget.margin.top + lineWidget.margin.bottom + this.getBookmarkMargin(lineWidget);
                        }
                        if (!isSplit) {
                            totalNoOflines++;
                            maxHeight += lineWidget.height - lineMargin;
                        } else {
                            maxHeight += lineWidget.height - lineMargin;
                            if (Math.round(lineToBeSplit) < Math.round(maxHeight)) {
                                line = block.childWidgets[j] as LineWidget;
                                skip = true;
                                count = 0;
                                break;
                            } else {
                                count++;
                            }
                        }
                    }
                } else if (block instanceof TableWidget) {
                    splitCountLine = this.getCountOrLineTable(block, lineToBeSplit, isSplit, maxHeight, false, getHeight);
                    if (getHeight) {
                        maxHeight += splitCountLine.lineCount;
                    } else if (!isSplit) {
                        totalNoOflines += splitCountLine.lineCount;
                    } else if (isNullOrUndefined(splitCountLine.lineWidget)) {
                      //  count = splitCountLine.lineCount;
                        maxHeight = splitCountLine.lineCount;
                    } else {
                        line = splitCountLine.lineWidget;
                        lineIndexInCell = splitCountLine.lineCount;
                        skip = true;
                    }
                }
                if (skip && isSplit) {
                    break;
                }
            }
            if (skip && isSplit) {
                break;
            }
            if (!isNullOrUndefined(section.nextRenderedWidget) && section.index !== section.nextRenderedWidget.index) {
                break;
            }
            section = section.nextRenderedWidget as BodyWidget;
        }
        if (getHeight) {
            return { lineWidget: undefined, lineCount: maxHeight };
        } else if (!isSplit) {
            return { lineWidget: undefined, lineCount: totalNoOflines };
        } else {
            return { lineWidget: line, lineCount: lineIndexInCell };
        }
    }

    private getCountOrLineTable(block: TableWidget, lineToBeSplit: number, isSplit: boolean, maxSplitHeight: number, isNested?: boolean, getHeight?: boolean): LineCountInfo {
        let lineIndexInCell: number = 0;
        let skip: boolean = false;
        let line: LineWidget;
        let totalNoOflines: number = 0;
        let totalHeight: number = 0;
        let minCount: number = 0;
        let maxCount: number = 0;
        let minHeight: number = 0;
        let maxHeight: number = 0;
        let splitCountLine: LineCountInfo;
        for (let i: number = 0; i < block.childWidgets.length; i++) {
            let row: TableRowWidget = block.childWidgets[i] as TableRowWidget;
            let minCountCell: TableCellWidget;
            let maxCountCell: TableCellWidget;
            minCount = 0;
            maxCount = 0;
            minHeight = 0;
            maxHeight = 0;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                for (let k: number = 0; k < cell.childWidgets.length; k++) {
                    let blocks: BlockWidget = cell.childWidgets[k] as BlockWidget;
                    if (blocks instanceof ParagraphWidget && blocks.childWidgets.length > 0) {
                        for (let l: number = 0; l < blocks.childWidgets.length; l++) {
                            minCount++;
                            minCountCell = cell;
                            minHeight += (blocks.childWidgets[l] as LineWidget).height;
                        }
                    } else {
                        splitCountLine = this.getCountOrLineTable(blocks as TableWidget, lineToBeSplit, isSplit, maxSplitHeight, true, getHeight);
                        minCount += splitCountLine.lineCount;
                        minHeight += splitCountLine.lineCount;
                    }
                }
                if (maxCount < minCount) {
                    maxCount = minCount;
                   // maxCountCell = minCountCell;
                }
                if (maxHeight < minHeight) {
                    maxHeight = minHeight;
                    maxCountCell = minCountCell;
                }
                minCount = 0;
                minHeight = 0;
            }
            if (!isSplit || isNested) {
                totalNoOflines = totalNoOflines + maxCount;
                totalHeight += maxHeight;
            } else {
                let countInCell: number = 0;
                for (let i: number = 0; i < maxCountCell.childWidgets.length; i++) {
                    let blocks: BlockWidget = maxCountCell.childWidgets[i] as BlockWidget;
                    if (blocks instanceof ParagraphWidget) {
                        for (let j: number = 0; j < blocks.childWidgets.length; j++) {
                                maxSplitHeight += (blocks.childWidgets[j] as LineWidget).height;
                            if (Math.round(lineToBeSplit) < Math.round(maxSplitHeight)) {
                                line = blocks.childWidgets[j] as LineWidget;
                                skip = true;
                                maxSplitHeight = 0;
                                lineIndexInCell = countInCell;
                                break;
                            } else {
                                countInCell++;
                            }
                            if (skip && isSplit) {
                                break;
                            }
                        }
                    } else {
                        splitCountLine = this.getCountOrLineTable(blocks as TableWidget, lineToBeSplit, isSplit, maxSplitHeight, false, getHeight);
                        if (isNullOrUndefined(splitCountLine.lineWidget)) {
                            countInCell += splitCountLine.lineCount;
                           // count = splitCountLine.lineCount;
                           maxSplitHeight += blocks.height;
                        } else {
                            skip = true;
                            maxSplitHeight = 0;
                            line = splitCountLine.lineWidget;
                            countInCell += splitCountLine.lineCount;
                            lineIndexInCell = countInCell;
                            break;
                        }
                    }
                    if (skip && isSplit) {
                        break;
                    }
                }
            }
            maxCount = 0;
            if (skip && isSplit) {
                break;
            }
        }
        if (getHeight) {
            return { lineWidget: undefined, lineCount: totalHeight };
        } else if (!isSplit) {
            return { lineWidget: undefined, lineCount: totalNoOflines };
        } else if (isSplit && isNullOrUndefined(line) && isNested) {
            return { lineWidget: undefined, lineCount: totalNoOflines };
        } else if (isSplit && isNullOrUndefined(line) && !isNested) {
            return { lineWidget: undefined, lineCount: maxSplitHeight };
        } else {
            return { lineWidget: line, lineCount: lineIndexInCell};
        }
    }
    /**
       * @private
       */
    public combineMultiColumn(section: BodyWidget): void {
        section = this.getBodyWidget(section, false);
        while (section && section.columnIndex !== 0) {
            let prevSection: BodyWidget = section.previousRenderedWidget as BodyWidget;
            if (prevSection.lastChild instanceof ParagraphWidget && prevSection.lastChild.isEndsWithColumnBreak) {
                break;
            }
            let isPreviousSplit: boolean = false;
            for (let i = 0; i < section.childWidgets.length; i++) {
                if (section.childWidgets[i] instanceof BlockWidget && !isNullOrUndefined((section.childWidgets[i] as BlockWidget).previousSplitWidget)
                    && !isNullOrUndefined((section.childWidgets[i] as BlockWidget).previousSplitWidget.previousSplitWidget)
                    && ((section.childWidgets[i] as BlockWidget).previousSplitWidget as BlockWidget).bodyWidget.page !== ((section.childWidgets[i] as BlockWidget).previousSplitWidget.previousSplitWidget as BlockWidget).bodyWidget.page) {
                    isPreviousSplit = true;
                }
                if ((section.childWidgets[i] instanceof BlockWidget && !isNullOrUndefined((section.childWidgets[i] as BlockWidget).previousSplitWidget) && ((section.childWidgets[i] as BlockWidget).previousSplitWidget as BlockWidget).bodyWidget.page === (section.childWidgets[i] as BlockWidget).bodyWidget.page && !isPreviousSplit)) {
                    (section.childWidgets[i] as BlockWidget).combineWidget(this.viewer) as BlockWidget;
                    if (prevSection.lastChild instanceof TableWidget) {
                        this.updateCellHeightInCombinedTable(prevSection.lastChild as TableWidget);
                    }
                    i--;
                    continue;
                }
                prevSection.childWidgets.push(section.childWidgets[i]);
                (section.childWidgets[i] as BlockWidget).containerWidget = prevSection;
                ((section.childWidgets[i] as BlockWidget).containerWidget as BodyWidget).page = prevSection.page;
                section.childWidgets.splice(0, 1);
                i--;
            } section = section.previousRenderedWidget as BodyWidget;
        } this.documentHelper.removeEmptyPages();
    }
    private updateCellHeightInCombinedTable(tableWidget: TableWidget) {
        let maxCellHeight: number = 0;
        let minCellHeight: number = 0;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let row: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                for (let k: number = 0; k < cell.childWidgets.length; k++) {
                    minCellHeight += (cell.childWidgets[k] as ParagraphWidget).height;
                }
                if (minCellHeight > maxCellHeight) {
                    maxCellHeight = minCellHeight;
                }
                minCellHeight = 0;
                for (let a: number = 0; a < row.childWidgets.length; a++) {
                    (row.childWidgets[a] as TableCellWidget).height = maxCellHeight;
                }
            }
            maxCellHeight = 0;
        }
    }
    public layoutHeaderFooter(section: BodyWidget, viewer: PageLayoutViewer, page: Page): void {
        //Header layout
        let headerFooterWidget: HeaderFooterWidget = viewer.getCurrentPageHeaderFooter(section, true);
        if (headerFooterWidget) {
            const parentHeader: HeaderFooterWidget = headerFooterWidget;
            if (isNullOrUndefined(headerFooterWidget.page)) {
                headerFooterWidget.page = page;
                headerFooterWidget.height = 0;
                this.clearBlockWidget(headerFooterWidget.childWidgets, true, true, true);
                viewer.updateHFClientArea(section.sectionFormat, true);
                this.layoutHeaderFooterItems(viewer, headerFooterWidget);
            }
            headerFooterWidget = parentHeader.clone();
            headerFooterWidget.parentHeaderFooter = parentHeader;
            this.clearBlockWidget(headerFooterWidget.childWidgets, true, true, true);
            const header: HeaderFooterWidget = headerFooterWidget;
            header.page = page;
            header.height = 0;
            this.updateRevisionsToHeaderFooter(header, page);
            viewer.updateHFClientArea(section.sectionFormat, true);
            page.headerWidget = this.layoutHeaderFooterItems(viewer, header);
            //this.updateHeaderFooterToParent(header);
            //When the vertical position is related to margin, then it should be adjusted based on the layouted header height. Not default header height.
            if (section.sectionFormat.topMargin < page.boundingRectangle.bottom && page.headerWidget.floatingElements.length > 0 && (page.headerWidget.floatingElements[0] as ImageElementBox).textWrappingStyle !== "Behind")
            {
                page.headerWidget = this.shiftItemsForVerticalAlignment(header);
            }
        }
        //Footer Layout
        headerFooterWidget = viewer.getCurrentPageHeaderFooter(section, false);
        if (headerFooterWidget) {
            const parentHeader: HeaderFooterWidget = headerFooterWidget;
            if (isNullOrUndefined(headerFooterWidget.page)) {
                headerFooterWidget.page = page;
                headerFooterWidget.height = 0;
                this.clearBlockWidget(headerFooterWidget.childWidgets, true, true, true);
                viewer.updateHFClientArea(section.sectionFormat, false);
                this.layoutHeaderFooterItems(viewer, headerFooterWidget);
            }
            headerFooterWidget = parentHeader.clone();
            headerFooterWidget.parentHeaderFooter = parentHeader;
            this.clearBlockWidget(headerFooterWidget.childWidgets, true, true, true);
            const footer: HeaderFooterWidget = headerFooterWidget;
            footer.page = page;
            footer.height = 0;
            viewer.updateHFClientArea(section.sectionFormat, false);
            this.updateRevisionsToHeaderFooter(footer, page);
            page.footerWidget = this.layoutHeaderFooterItems(viewer, footer);
        }
    }
    private shiftItemsForVerticalAlignment(headerWidget: HeaderFooterWidget): HeaderFooterWidget {
        let floatingElements: (ShapeBase | TableWidget)[] = headerWidget.floatingElements;
        for (let i: number = 0; i < floatingElements.length; i++) {
            let floatingItem: ShapeBase = floatingElements[i] as ShapeBase;
            let verticalOrigin: VerticalOrigin = floatingItem.verticalOrigin;
            let paragraph: ParagraphWidget = floatingItem.paragraph;
            // When a owner paragraph is inside the table, we have to skip the vertical alignment of the floating entity.
            if (verticalOrigin === 'Margin' && !paragraph.isInsideTable) {
                let yPosition: number = floatingItem.verticalPosition;
                if (yPosition != 0) {
                    yPosition += this.viewer.clientActiveArea.y;
                    let diff: number = yPosition - floatingItem.y;
                    floatingItem.y = yPosition;
                    if (floatingItem instanceof ShapeElementBox) {
                        for (let j: number = 0; j < floatingItem.textFrame.childWidgets.length; j++) {
                            let block: BlockWidget = floatingItem.textFrame.childWidgets[j] as BlockWidget;
                            if (block instanceof ParagraphWidget) {
                                block.y = block.y + diff;
                            }
                        }
                    }
                }
            }
        }
        return headerWidget;
    }
    public updateHeaderFooterToParent(node: HeaderFooterWidget): HeaderFooterWidget {
        const sectionIndex: number = node.page.sectionIndex;
        const typeIndex: number = (this.viewer as PageLayoutViewer).getHeaderFooter(node.headerFooterType);
        const clone: HeaderFooterWidget = node.clone();
        this.documentHelper.headersFooters[sectionIndex][typeIndex] = clone;
        for (let j: number = 0; j < clone.childWidgets.length; j++) {
            const child: BlockWidget = clone.childWidgets[j] as BlockWidget;
            if (child instanceof TableWidget) {
                this.clearTableWidget(child, false, true);
            }
        }
        return clone;
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private updateRevisionsToHeaderFooter(clone: HeaderFooterWidget, page: Page): any {
        const childWidge: any = clone.childWidgets;
        if (clone instanceof HeaderFooterWidget && childWidge.length > 0) {
            for (let i: number = 0; i < childWidge.length; i++) {
                if (childWidge[i].childWidgets.length > 0) {
                    const lineWidge: any = childWidge[i].childWidgets;
                    for (let j: number = 0; j < lineWidge.length; j++) {
                        const childrens: any = lineWidge[j].children;
                        if (childrens) {
                            for (let k: number = 0; k < childrens.length; k++) {
                                if (childrens[k].removedIds.length > 0) {
                                    const removeId: any = childrens[k].removedIds;
                                    for (let l: number = 0; l < removeId.length; l++) {
                                        const revision: Revision = this.documentHelper.revisionsInternal.get(removeId[l]);
                                        childrens[k].revisions[l] = revision;
                                        this.updateRevisionRange(revision, page);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private updateRevisionRange(revision: Revision, page: Page): any {
        for (let i: number = 0; i < revision.range.length; i++) {
            const inline: TextElementBox = (revision.range[i] as TextElementBox);
            if (!inline.line.paragraph.bodyWidget.page) {
                inline.line.paragraph.bodyWidget.page = page;
            }
        }
    }

    private linkFieldInHeaderFooter(widget: HeaderFooterWidget): void {
        let firstChild: BlockWidget = widget.firstChild as BlockWidget;
        do {
            if (firstChild instanceof ParagraphWidget) {
                this.linkFieldInParagraph(firstChild);
            } else {
                this.linkFieldInTable(firstChild as TableWidget);
            }
            /* eslint-disable no-cond-assign */
        } while (firstChild = firstChild.nextWidget as BlockWidget);
    }

    /**
     * @private
     */
    public linkFieldInParagraph(widget: ParagraphWidget): void {
        for (let j: number = 0; j < widget.childWidgets.length; j++) {
            const line: LineWidget = widget.childWidgets[j] as LineWidget;
            for (let i: number = 0; i < line.children.length; i++) {
                const element: ElementBox = line.children[i] as ElementBox;
                if (element instanceof FieldElementBox && (element.fieldType !== 0 || (element.fieldType === 0 &&
                    this.documentHelper.fields.indexOf(element) === -1))) {
                    element.linkFieldCharacter(this.documentHelper);
                }
                if (element instanceof FieldTextElementBox &&
                    !isNullOrUndefined(element.previousElement) &&
                    element.previousElement instanceof FieldElementBox &&
                    element.fieldBegin !== (element.previousElement as FieldElementBox).fieldBegin) {
                    element.fieldBegin = (element.previousElement as FieldElementBox).fieldBegin;
                }
                if (element instanceof ShapeElementBox) {
                    let firstBlock: BlockWidget = element.textFrame.firstChild as BlockWidget;
                    if (firstBlock) {
                        do {
                            if (firstBlock instanceof ParagraphWidget) {
                                this.linkFieldInParagraph(firstBlock);
                            } else {
                                this.linkFieldInTable(firstBlock as TableWidget);
                            }
                            /* eslint-disable no-cond-assign */
                        } while (firstBlock = firstBlock.nextWidget as BlockWidget);
                    }
                } else if(element instanceof CommentCharacterElementBox) {
                    let comment: CommentElementBox = this.getCommentById(this.documentHelper.comments, element.commentId);
                    if (!isNullOrUndefined(comment)) {
                        if (element.commentType === 0) {
                            comment.commentStart = element;
                        } else {
                            comment.commentEnd = element;
                        }
                        element.comment = comment;
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    public getCommentById(commentsCollection: CommentElementBox[], commentId: string): CommentElementBox {
        for (let i: number = 0; i < commentsCollection.length; i++) {
            let comment: CommentElementBox = commentsCollection[i] as CommentElementBox;
            if (comment.commentId === commentId) {
                return comment;
            }
        }
        return undefined;
    }

    public linkFieldInTable(widget: TableWidget): void {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            const row: TableRowWidget = widget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                for (let k: number = 0; k < cell.childWidgets.length; k++) {
                    const block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                    if (block instanceof ParagraphWidget) {
                        this.linkFieldInParagraph(block);
                    } else {
                        this.linkFieldInTable(block as TableWidget);
                    }
                }
            }
        }
    }

    public layoutHeaderFooterItems(viewer: LayoutViewer, widget: HeaderFooterWidget): HeaderFooterWidget {
        this.viewer.updateClientAreaLocation(widget, viewer.clientActiveArea);
        if (widget.childWidgets.length === 0) {
            const pargaraph: ParagraphWidget = new ParagraphWidget();
            const line: LineWidget = new LineWidget(pargaraph);
            pargaraph.childWidgets.push(line);
            widget.childWidgets.push(pargaraph);
            pargaraph.containerWidget = widget;
        }
        this.linkFieldInHeaderFooter(widget);
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            const block: BlockWidget = widget.childWidgets[i] as BlockWidget;
            if (block instanceof TableWidget && block.tableFormat.preferredWidthType === 'Auto'
                && !block.tableFormat.allowAutoFit && !block.isGridUpdated) {
                block.calculateGrid();
            }
            viewer.updateClientAreaForBlock(block, true);
            this.layoutBlock(block, 0);
            viewer.updateClientAreaForBlock(block, false);
        }
        const type: HeaderFooterType = widget.headerFooterType;
        if (type === 'OddFooter' || type === 'EvenFooter' || type === 'FirstPageFooter') {
            this.shiftChildLocation(viewer.clientArea.y - viewer.clientActiveArea.y, widget);
        }
        return widget;
    }

    private shiftChildLocation(shiftTop: number, bodyWidget: HeaderFooterWidget | FootNoteWidget): void {
        let widgetTop: number = bodyWidget.y + shiftTop;
        const footerMaxHeight: number = bodyWidget.page.boundingRectangle.height - (bodyWidget.page.boundingRectangle.height / 100) * 40;
        widgetTop = Math.max(widgetTop, footerMaxHeight);
        shiftTop = widgetTop - bodyWidget.y;
        let childTop: number = bodyWidget.y = widgetTop;
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            const childWidget: IWidget = bodyWidget.childWidgets[i];
            if (childWidget instanceof ParagraphWidget) {
                (childWidget as Widget).x = (childWidget as Widget).x;
                (childWidget as Widget).y = i === 0 ? (childWidget as Widget).y + shiftTop : childTop;
                childTop += childWidget.height;
                for (let j: number = 0; j < childWidget.childWidgets.length; j++){
                    const widget: any = (childWidget as Widget).childWidgets[j] as LineWidget;
                    for (let k: number = 0; k < widget.children.length; k++) {
                        const element: ElementBox = widget.children[k];
                        if (element instanceof ShapeBase && element.textWrappingStyle !== "Inline") {
                            if (element.verticalOrigin === "Paragraph" || element.verticalOrigin === "Line") {
                                element.y = (childWidget as Widget).y + element.verticalPosition;
                            }
                            else {
                                let position: Point = this.getFloatingItemPoints(element);
                                element.y = position.y;
                            }
                            if (element instanceof ShapeElementBox) {
                                const topMargin: number = element.textFrame.marginTop;
                                this.updateChildLocationForCellOrShape(element.y + topMargin, element as ShapeElementBox);
                            }
                        }
                    }
                }
            } else {
                this.shiftChildLocationForTableWidget(childWidget as TableWidget, shiftTop);
                childTop += (childWidget as Widget).height;
            }
        }
    }

    private shiftChildLocationForTableWidget(tableWidget: TableWidget, shiftTop: number): void {
        tableWidget.y = tableWidget.y + shiftTop;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            const childWidget: IWidget = tableWidget.childWidgets[i];
            if (childWidget instanceof TableRowWidget) {
                this.shiftChildLocationForTableRowWidget(childWidget as TableRowWidget, shiftTop);
            }
        }
    }

    private shiftChildLocationForTableRowWidget(rowWidget: TableRowWidget, shiftTop: number): void {
        rowWidget.y = rowWidget.y + shiftTop;
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            this.shiftChildLocationForTableCellWidget((rowWidget.childWidgets[i] as TableCellWidget), shiftTop);
        }
    }

    private shiftChildLocationForTableCellWidget(cellWidget: TableCellWidget, shiftTop: number): void {
        cellWidget.y = cellWidget.y + shiftTop;
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                (cellWidget.childWidgets[i] as Widget).x = (cellWidget.childWidgets[i] as Widget).x;
                (cellWidget.childWidgets[i] as Widget).y = (cellWidget.childWidgets[i] as Widget).y + shiftTop;
            } else {
                this.shiftChildLocationForTableWidget((cellWidget.childWidgets[i] as TableWidget), shiftTop);
            }
        }
    }

    private layoutBlock(block: BlockWidget, index: number, isUpdatedList?: boolean): BlockWidget {
        let nextBlock: BlockWidget;
        if (block instanceof ParagraphWidget) {
            if (this.isInitialLoad || (!this.isRelayout && block.paragraphFormat.bidi && this.isDocumentContainsRtl)) {
                block.splitTextRangeByScriptType(0);
                block.splitLtrAndRtlText(0);
                block.combineconsecutiveRTL(0);
            }
            nextBlock = this.layoutParagraph(block, index, isUpdatedList);
            const nextBlockToLayout: BlockWidget = this.checkAndRelayoutPreviousOverlappingBlock(block);
            if (nextBlockToLayout) {
                nextBlock = nextBlockToLayout;
            }
            // this.updateLinearIndex(block);
            // if (block != nextBlock) {
            //     this.updateLinearIndex(nextBlock);
            // }
        } else {
            nextBlock = this.layoutTable(block as TableWidget, index);
            this.checkAndRelayoutPreviousOverlappingBlock(block);
            this.updateTableYPositionBasedonTextWrap(nextBlock as TableWidget);
        }
        return nextBlock.nextRenderedWidget as BlockWidget;
    }
    // /**
    //  * @private
    //  */
    // private updateLinearIndex(block: BlockWidget, skipParaMark?: boolean): void {
    //     if (!isNullOrUndefined(block) && block instanceof ParagraphWidget) {
    //         let splittedWidgets = block.getSplitWidgets();
    //         (splittedWidgets[0] as ParagraphWidget).length = block.getTotalLength();
    //     }
    // }
    private updateTableYPositionBasedonTextWrap(table: TableWidget): void {
        if (!isNullOrUndefined(table.bodyWidget) && !(table.containerWidget instanceof TextFrame)) {
            const tableY: number = table.y;
            const tableRect: Rect = new Rect(table.x, table.y, table.width, table.height);
            table.bodyWidget.floatingElements.forEach((shape: ShapeElementBox | TableWidget) => {
                if (shape instanceof ShapeElementBox && !shape.paragraph.isInsideTable) {
                    const shapeRect: Rect = new Rect(shape.x, shape.y, shape.width, shape.height);
                    const considerShape: boolean = (shape.textWrappingStyle === 'TopAndBottom' || shape.textWrappingStyle === 'Square');
                    if (considerShape && tableRect.isIntersecting(shapeRect)) {
                        table.y = shape.y + shape.height + shape.distanceBottom;
                        this.updateChildLocationForTable(table.y, table);
                        const height: number = table.y - tableY;
                        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + height);
                    }
                }
            });
        }
    }
    private shiftWrapStyle(element: ShapeBase): boolean {
        return element.textWrappingStyle === 'InFrontOfText' || element.textWrappingStyle === 'Behind' || element.textWrappingStyle === 'Inline';
    }
    private checkAndRelayoutPreviousOverlappingBlock(block: BlockWidget): BlockWidget {
        if (!(block.containerWidget instanceof TextFrame) && !this.isRelayoutOverlap) {
            let preivousBlock: BlockWidget = block.previousWidget as BlockWidget;
            if (block instanceof ParagraphWidget) {
                if (block.floatingElements.length > 0) {
                    let height: number = 0;
                    for (let i: number = 0; i < block.floatingElements.length; i++) {
                        let element: ShapeBase = block.floatingElements[i];
                        if (this.shiftWrapStyle(element)) {
                            continue;
                        }
                        let shapeRect: Rect = new Rect(element.x, element.y, element.width, element.height);
                        while (preivousBlock) {
                            // if height exceeds the client area height. then the paragraph belongs to previous page.
                            // So, we need to skip relayouting overlapping widgets.
                            // Adding this condition for row splitting to multiple page scenario.
                            if (block.isInsideTable && height > this.viewer.clientArea.height) {
                                this.startOverlapWidget = undefined;
                                this.endOverlapWidget = undefined;
                                break;
                            }
                            if (preivousBlock instanceof ParagraphWidget) {
                                let paraRect: Rect = new Rect(preivousBlock.x, preivousBlock.y, preivousBlock.width, preivousBlock.height);
                                if (shapeRect.isIntersecting(paraRect) &&
                                    this.startOverlapWidget !== preivousBlock) {
                                    this.startOverlapWidget = preivousBlock;
                                    this.endOverlapWidget = block;
                                }
                            }
                            height += preivousBlock.height;
                            preivousBlock = preivousBlock.previousWidget as BlockWidget;
                        }
                        preivousBlock = block.previousWidget as BlockWidget;
                    }
                } else {
                    let widget: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
                    if (widget) {
                        return widget[widget.length - 1];
                    }
                }
            } else {
                let table: TableWidget = block as TableWidget;
                if (!table.wrapTextAround) {
                    return table;
                }
                let tableRect: Rect = new Rect(table.x, table.y, table.getTableCellWidth(), table.height);
                while (preivousBlock) {
                    if (preivousBlock instanceof ParagraphWidget) {
                        let blockRect: Rect = new Rect(preivousBlock.x, preivousBlock.y, preivousBlock.width, preivousBlock.height);
                        if (tableRect.isIntersecting(blockRect) &&
                            this.startOverlapWidget !== preivousBlock) {
                            this.startOverlapWidget = preivousBlock;
                            this.endOverlapWidget = block;
                        }
                    }
                    preivousBlock = preivousBlock.previousWidget as BlockWidget;
                }
                preivousBlock = block.previousWidget as BlockWidget;
            }
            if (block instanceof ParagraphWidget && block.containerWidget instanceof BodyWidget && block.floatingElements.length > 0 && !this.shiftWrapStyle(block.floatingElements[0]) && block.containerWidget.firstChild != block && block.y + block.floatingElements[0].height > this.viewer.clientArea.bottom) {
                let previousBlock: BlockWidget = block.previousWidget as BlockWidget;
                if (previousBlock && previousBlock instanceof ParagraphWidget && (previousBlock.y + previousBlock.height + this.getLineHeigth(block, (block.floatingElements[0].line as LineWidget)) + block.floatingElements[0].height) > this.viewer.clientArea.bottom) {
                    this.moveToNextPage(this.viewer, block.floatingElements[0].line, false, false, true);
                    this.startOverlapWidget = block;
                    this.endOverlapWidget = block;
                }
            }
            if (this.startOverlapWidget) {
                this.isRelayoutOverlap = true;
                this.skipRelayoutOverlap = true;
                this.layoutStartEndBlocks(this.startOverlapWidget, block);
                this.isRelayoutOverlap = false;
                this.skipRelayoutOverlap = false;
            }
            this.startOverlapWidget = undefined;
            this.endOverlapWidget = undefined;
        }
        return block as BlockWidget;
    }

    private getLineHeigth(paragraph: ParagraphWidget, line: LineWidget): number {
        let height: number = 0;
        for(let i: number = 0; i<paragraph.childWidgets.length; i++) {
            if(line != paragraph.childWidgets[i]) {
                height += (paragraph.childWidgets[i] as LineWidget).height;
            }
        }
        return height
    }

    private addParagraphWidget(area: Rect, paragraphWidget: ParagraphWidget): ParagraphWidget {
        // const ownerParaWidget: ParagraphWidget = undefined;
        if (paragraphWidget.isEmpty() && !isNullOrUndefined(paragraphWidget.paragraphFormat) &&
            (paragraphWidget.paragraphFormat.textAlignment === 'Center' || paragraphWidget.paragraphFormat.textAlignment === 'Right' 
            || (paragraphWidget.paragraphFormat.textAlignment === 'Justify' && paragraphWidget.paragraphFormat.bidi)) 
            && paragraphWidget.paragraphFormat.listFormat.listId === -1) {
            this.updateXPositionForEmptyParagraph(area, paragraphWidget);
            paragraphWidget.y = area.y;
        } else {
            if (this.viewer.clientActiveArea.width <= 0 && this.viewer instanceof WebLayoutViewer) {
                paragraphWidget.x = this.previousPara;
            }
            else {
                paragraphWidget.x = area.x;
                this.previousPara = paragraphWidget.x;
            }
            paragraphWidget.width = area.width;
            paragraphWidget.y = area.y;
            paragraphWidget.clientX = undefined;
            if (paragraphWidget.hasOwnProperty('absoluteXPosition')) {
                delete paragraphWidget['absoluteXPosition'];
            }
        }
        return paragraphWidget;
    }

    // update the x position for bidi empty paragraph.
    private updateXPositionForEmptyParagraph(area: Rect, paragraph: ParagraphWidget): void {
        if (paragraph.isEmpty() && !isNullOrUndefined(paragraph.paragraphFormat)) {
            // const top: number = 0;
            // const bottom: number = 0;
            const width: number = this.documentHelper.textHelper.getParagraphMarkWidth(paragraph.characterFormat);
            paragraph.clientX = area.x;
            let left: number = area.x;
            paragraph['absoluteXPosition'] = { 'width': area.width, 'x': area.x };
            if (paragraph.paragraphFormat.textAlignment === 'Center') {
                left += (area.width - width) / 2;
            } else {
                left += area.width - width;
            }
            paragraph.width = width;
            paragraph.x = left;
        }
    }

    private addLineWidget(paragraphWidget: ParagraphWidget): LineWidget {
        let line: LineWidget = undefined;
        line = new LineWidget(paragraphWidget);
        line.width = paragraphWidget.width;
        paragraphWidget.childWidgets.push(line);
        line.paragraph = paragraphWidget;
        return line;
    }

    public isFirstElementWithPageBreak(paragraphWidget: ParagraphWidget): boolean {
        let isPageBreak: boolean = false;
        if (this.viewer instanceof PageLayoutViewer) {
            const lineWidget: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
            if (lineWidget) {
                let element: ElementBox = lineWidget.children[0];
                while (element) {
                    if (element instanceof BookmarkElementBox && element.name.indexOf('_') >= 0) {
                        element = element.nextElement;
                        continue;
                    }
                    if (element instanceof TextElementBox && (element.text === '\f' || element.text === String.fromCharCode(14))) {
                        isPageBreak = true;
                    }
                    break;
                }
            }
        }
        return isPageBreak;
    }

    /**
     * Layouts specified paragraph.
     *
     * @private
     * @param footnote
     */
    public layoutfootNote(footnote: FootNoteWidget): BlockContainer {
        if (this.documentHelper.owner.layoutType === 'Pages') {
            const pageIndex: number = footnote.page.index;
            const clientActiveArea: Rect = this.viewer.clientActiveArea.clone();
            const clientArea: Rect = this.viewer.clientArea.clone();
            if (footnote.footNoteType === 'Footnote' && footnote.sectionFormat.columns.length > 1 && !this.isInitialLoad) {
                this.updateColumnIndex(footnote.bodyWidgets[0], false);
                this.layoutMultiColumnBody(footnote.bodyWidgets[0], true);
            }
            if (footnote.footNoteType === 'Endnote' && footnote.bodyWidgets[0].sectionFormat.numberOfColumns > 1) {
                if (!this.isInitialLoad) {
                    this.updateColumnIndex(footnote.bodyWidgets[0], false);
                }
                this.layoutMultiColumnBody(footnote.bodyWidgets[0], true);
                this.viewer.clientActiveArea = clientActiveArea;
            }
            let clientWidth: number = 0;
            if (footnote.sectionFormat.columns.length > 1 && footnote.footNoteType === 'Footnote') {
                this.viewer.updateClientArea(footnote, footnote.page);
                clientWidth = this.viewer.clientActiveArea.width;
            }
            if (footnote.footNoteType === 'Footnote') {
                (this.viewer as PageLayoutViewer).updateFootnoteClientArea(footnote.sectionFormat, footnote);
                if (footnote.sectionFormat.columns.length > 1) {
                    this.viewer.clientActiveArea.width = clientWidth;
                    this.viewer.clientArea.width = clientWidth;
                }
            } 
            footnote.height = 0;
            let block: BlockWidget;
            let height: number = 0;
            this.isRelayoutFootnote = false;
            let index: number = 0;
            //        this.isfoot = true;
            /* eslint-disable-next-line max-len */
            if (this.viewer instanceof PageLayoutViewer && footnote.bodyWidgets.length > 0 && ((footnote.footNoteType === 'Footnote' && footnote.sectionFormat.columns.length > 1) || (footnote.footNoteType === 'Endnote' && footnote.bodyWidgets[0].sectionFormat.columns.length > 1))) {
                if (this.isLayoutWhole) {
                    this.updateColumnIndex(footnote.bodyWidgets[0], false);
                }
                this.splitFootNoteWidgetBasedOnColumn(footnote.bodyWidgets[0]);
            }
            let footBody: BodyWidget = footnote.bodyWidgets[0];
            let clientX: number = 0;
            for (let i: number = 0; i < footnote.bodyWidgets.length; i++) {
                if (footnote.bodyWidgets[i].columnIndex !== footBody.columnIndex && ((footnote.footNoteType === 'Footnote' && footnote.sectionFormat.columns.length > 1) || (footnote.footNoteType === 'Endnote' && footnote.bodyWidgets[i].sectionFormat.columns.length > 1))) {
                    this.viewer.updateClientArea(footnote.bodyWidgets[i], footnote.bodyWidgets[i].page);
                    clientWidth = this.viewer.clientActiveArea.width;
                    clientX = this.viewer.clientActiveArea.x;
                    if (footnote.footNoteType === 'Footnote') {
                        (this.viewer as PageLayoutViewer).updateFootnoteClientArea(footnote.sectionFormat, footnote);
                    }
                    this.viewer.clientActiveArea.x = clientX;
                    this.viewer.clientArea.x = clientX;
                    this.viewer.clientActiveArea.width = clientWidth;
                    this.viewer.clientArea.width = clientWidth;
                    this.viewer.cutFromTop(footnote.y + height);
                }
                if (i === 0) {
                    let newPara: ParagraphWidget = new ParagraphWidget();
                    newPara.characterFormat = new WCharacterFormat();
                    newPara.paragraphFormat = new WParagraphFormat();
                    newPara.index = 0;
                    let lineWidget: LineWidget = new LineWidget(newPara);
                    newPara.childWidgets.push(lineWidget);
                    height = this.documentHelper.textHelper.getParagraphMarkSize(newPara.characterFormat).Height;
                    footnote.height += height;
                    footnote.y = this.viewer.clientActiveArea.y;
                    if (footnote.footNoteType === 'Endnote') {
                        this.viewer.updateClientArea(footnote.bodyWidgets[i], footnote.bodyWidgets[i].page, true);
                    }
                    this.viewer.cutFromTop(footnote.y + height);
                    footnote.margin = new Margin(0, height, 0, 0);
                }
                index = footnote.footNoteType === 'Endnote' ? 0 : index;
                for (let j: number = 0; j < footnote.bodyWidgets[i].childWidgets.length; j++) {
                    block = footnote.bodyWidgets[i].childWidgets[j] as BlockWidget;
                    if (footnote.footNoteType === 'Footnote' || footnote.bodyWidgets[i].getSplitWidgets().length === 1) {
                        block.index = index;
                        index++;
                    }
                    block.containerWidget = footnote.bodyWidgets[i];
                    (block.containerWidget as BodyWidget).page = footnote.page;
                    block.containerWidget.containerWidget = footnote;
                    // paragraph.index = i > 1 ? i - 1 : 0;
                    this.viewer.updateClientAreaForBlock(block, true);
                    if (block instanceof TableWidget) {
                        this.clearTableWidget(block, true, true, true);
                        this.isRelayoutFootnote = true;
                        if (footnote.footNoteType === 'Footnote') {
                            this.viewer.clientArea.height = Number.POSITIVE_INFINITY;
                            this.viewer.clientActiveArea.height = Number.POSITIVE_INFINITY;
                        }
                    }
                    this.layoutBlock(block, 0);
                    if (isNullOrUndefined(footnote.bodyWidgets[i])) {
                        break;
                    }
                    if (footnote.bodyWidgets[i].columnIndex === footBody.columnIndex) {
                        footnote.height += block.height;
                    }
                    this.viewer.updateClientAreaForBlock(block, false);
                }
                footBody = footnote.bodyWidgets[i];
            }
            if (footnote.sectionFormat.columns.length > 1) {
                let footHeight: number = this.getFootNoteBodyHeight(footnote.bodyWidgets[0]);
                footnote.height = footHeight + height;
            }
            if (footnote.footNoteType === 'Footnote') {
                this.shiftChildWidgetInFootnote(footnote);
            }
            if (footnote.footNoteType === 'Footnote' && footnote.sectionFormat.columns.length > 1 && footnote.page.bodyWidgets[footnote.page.bodyWidgets.length - 1].sectionFormat.columns.length > 1) {
                let section: BodyWidget = this.getBodyWidget(footnote.page.bodyWidgets[footnote.page.bodyWidgets.length - 1], true);
                let height: number = this.getNextWidgetHeight(section);
                if (height > footnote.y) {
                    this.footnoteHeight = footnote.height;
                    let isLayoutWhole: boolean = this.isLayoutWhole;
                    this.isLayoutWhole = false;
                    this.layoutMultiColumnBody(section, true);
                    this.isLayoutWhole = isLayoutWhole;
                }
            }
            this.viewer.clientActiveArea = clientActiveArea;
            this.viewer.clientArea = clientArea;
            if (!this.islayoutFootnote) {
                if (this.viewer.clientActiveArea.y + this.viewer.clientActiveArea.height > footnote.y) {
                    this.viewer.clientActiveArea.height -= footnote.height;
                    let sub: number = (this.viewer.clientActiveArea.y + this.viewer.clientActiveArea.height - footnote.y);
                    this.viewer.clientActiveArea.height -= sub;
                }
            }
            if (footnote.footNoteType === 'Endnote') {
                let endnote: FootNoteWidget = undefined;
                if (!isNullOrUndefined(footnote.page.nextPage) && !isNullOrUndefined(footnote.page.nextPage.endnoteWidget)) {
                    endnote = footnote.page.nextPage.endnoteWidget;
                } else if (footnote.page.index !== pageIndex) {
                    endnote = footnote;
                }
                if (!isNullOrUndefined(endnote)) {
                    const lastBodyWidget: BodyWidget = this.getBodyWidget(endnote.page.bodyWidgets[endnote.page.bodyWidgets.length - 1], true);
                    this.viewer.updateClientArea(lastBodyWidget, lastBodyWidget.page);
                    this.layoutfootNote(endnote);
                }
            }
        }
        this.footnoteHeight = 0;
        return footnote;
    }
    private getFootNoteBodyHeight(section: BodyWidget): number {
        let height: number = 0;
        while (section) {
            if (section.columnIndex !== 0) {
                break;
            }
            for (let i = 0; i < section.childWidgets.length; i++) {
                height += (section.childWidgets[i] as BlockWidget).height;
            }
            section = section.nextRenderedWidget as BodyWidget;
        } return height;
    }
    private splitFootNoteWidgetBasedOnColumn(section: BodyWidget): void {
        let lineCountInfo: LineCountInfo = this.getCountOrLine(section, undefined, undefined, true);
        let totalHeight: number = lineCountInfo.lineCount;
        let lineToBeSplit: number = Math.round(totalHeight / section.sectionFormat.numberOfColumns);
        while (section) {
            let lineCountInfo: LineCountInfo = this.getCountOrLine(section, lineToBeSplit, true, false);
            const clientActiveArea: Rect = this.viewer.clientActiveArea.clone();
            const clientArea: Rect = this.viewer.clientArea.clone();
            if (lineCountInfo.lineWidget.paragraph.indexInOwner === 0 && lineCountInfo.lineWidget.indexInOwner === 0) {
                this.updateColumnIndex(lineCountInfo.lineWidget.paragraph.bodyWidget as BodyWidget, true);
            } else {
                this.splitParagraph(lineCountInfo.lineWidget.paragraph, lineCountInfo.lineWidget.indexInOwner, undefined);
                let nextBody: BodyWidget = this.moveBlocksToNextPage(lineCountInfo.lineWidget.paragraph.previousRenderedWidget as BlockWidget);
                this.viewer.clientActiveArea = clientActiveArea;
                this.viewer.clientArea = clientArea;
                if (!isNullOrUndefined(nextBody.nextRenderedWidget)) {
                    this.updateColumnIndex(nextBody.nextRenderedWidget as BodyWidget, true);
                }
            }
            if (lineCountInfo.lineWidget.paragraph.bodyWidget.columnIndex === lineCountInfo.lineWidget.paragraph.bodyWidget.sectionFormat.numberOfColumns - 1) {
                break;
            }
            section = section.nextRenderedWidget as BodyWidget;
        }
    }
    private updateColumnIndex(section: BodyWidget, increase: boolean): void {
        while (section) {
            if (increase) {
                section.columnIndex++;
            } else {
                section.columnIndex = 0;
            } section = section.nextRenderedWidget as BodyWidget;
        }
    }
    private shiftChildWidgetInFootnote(footnote: FootNoteWidget): void {
        let page: Page = footnote.page;
        let yPosition: number = footnote.y - footnote.height;
        if (page.bodyWidgets[0].childWidgets.length === 1 && page.bodyWidgets[0].firstChild) {
            let startY: number = (page.bodyWidgets[0].firstChild as BlockWidget).y;
            let bodyWidgetHeight: number = this.getBodyWidgetHeight(page.bodyWidgets[0]);
            if (yPosition < startY + bodyWidgetHeight) {
                yPosition = startY + bodyWidgetHeight;
            }
        }
        footnote.y = yPosition;
        yPosition += footnote.margin.top;
        let multiColumnY: number = yPosition;
        let columnBody: BodyWidget = footnote.bodyWidgets[0];
        for (let i: number = 0; i < footnote.bodyWidgets.length; i++) {
            if (footnote.bodyWidgets[i].columnIndex !== columnBody.columnIndex) {
                yPosition = multiColumnY;
            }
            columnBody = footnote.bodyWidgets[i];
            for (let j: number = 0; j < footnote.bodyWidgets[i].childWidgets.length; j++) {
                let childWidget: BlockWidget = footnote.bodyWidgets[i].childWidgets[j] as BlockWidget;
                if (childWidget instanceof ParagraphWidget) {
                    childWidget.y = yPosition;
                    yPosition += childWidget.height;
                } else {
                    this.shiftChildLocationForTableWidget(childWidget as TableWidget, yPosition - childWidget.y);
                    yPosition += (childWidget as Widget).height;
                }
            }
        }
    }
    /**
       * @private
       */
    public getBodyWidgetHeight(bodyWidget: BodyWidget): number {
        let height: number = 0;
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            height += (bodyWidget.childWidgets[i] as BodyWidget).height;
        }
        return height;
    }
    
    // Check whether the block has the field separator or field end of the field begin.
    private checkBlockHasField(block: BlockWidget): boolean {
        if (block instanceof ParagraphWidget) {
            for (const lineWidget of block.childWidgets as LineWidget[]) {
                for (const element of lineWidget.children) {
                    if (element instanceof FieldElementBox && (element.fieldType === 2 || element.fieldType === 1)) {
                        if (this.documentHelper.fieldStacks.length > 0 && element.fieldBegin === this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1]) {
                            return true;
                        }
                    }
                }
            }
        } else {
            return this.checkTableHasField(block as TableWidget);
        }
        return false;
    }

    // Check whether the table has the field separator or field end of the field begin.
    private checkTableHasField(table: TableWidget): boolean {
        for (const row of table.childWidgets as TableRowWidget[]) {
            for (const cell of row.childWidgets as TableCellWidget[]) {
                for (const block of cell.childWidgets as BlockWidget[]) {
                    if (this.checkBlockHasField(block)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private layoutParagraph(paragraph: ParagraphWidget, lineIndex: number, isUpdatedList?: boolean): BlockWidget {
        if (this.isFieldCode && !this.checkBlockHasField(paragraph)) {
            if (paragraph.childWidgets.length === 0) {
                this.addLineWidget(paragraph);
            }
            paragraph.isFieldCodeBlock = true;
            return paragraph;
        }
        paragraph.x = 0;
        paragraph.textWrapWidth = false;
        this.addParagraphWidget(this.viewer.clientActiveArea, paragraph);
        let isListLayout: boolean = true;
        const isFirstElmIsparagraph: boolean = this.isFirstElementWithPageBreak(paragraph);
        if (!isFirstElmIsparagraph) {
            this.layoutListItems(paragraph, isUpdatedList);
            isListLayout = false;
        }
        if (paragraph.isEmptyInternal(true) && !this.checkIsFieldParagraph(paragraph)) {
            this.layoutEmptyLineWidget(paragraph, true);
        } else {
            let line: LineWidget = lineIndex < paragraph.childWidgets.length ?
                paragraph.childWidgets[lineIndex] as LineWidget : undefined;
            if (!this.isRelayoutOverlap && !(paragraph.containerWidget instanceof TextFrame)) {
                this.layoutFloatElements(paragraph);
            }
            while (line instanceof LineWidget) {
                if (paragraph !== line.paragraph && line.indexInOwner === 0 && isListLayout) {
                    if (line.previousLine.isEndsWithColumnBreak) {
                        this.viewer.updateClientAreaForBlock(paragraph, true);
                        this.layoutListItems(line.paragraph);
                        this.viewer.updateClientAreaForBlock(paragraph, false);
                    }
                    else {
                        this.layoutListItems(line.paragraph);
                    }
                }
                if (line.isFirstLine() && isNullOrUndefined(this.fieldBegin)) {
                    if (!isNullOrUndefined(paragraph.paragraphFormat)) {
                        const firstLineIndent: number = -HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent);
                        this.viewer.updateClientWidth(firstLineIndent);
                    }
                }
                line.marginTop = 0;
                //let bodyIndex: number = line.paragraph.bodyWidget.indexInOwner;
                // if (!this.isInitialLoad && !this.isBidiReLayout && this.isContainsRtl(line)) {
                //     this.reArrangeElementsForRtl(line, paragraph.paragraphFormat.bidi);
                // }
                line = this.layoutLine(line, 0);
                // if (!line.paragraph.isInsideTable && bodyIndex !== line.paragraph.containerWidget.indexInOwner) {
                //     line = undefined;
                // }
                // else {
                    paragraph = line.paragraph;
                    line = line.nextLine;
                // }
            }
        }
        this.updateWidgetToPage(this.viewer, paragraph);
        paragraph.isLayouted = true;
        // this.updateLinearIndex(paragraph);
        paragraph.isFieldCodeBlock = false;
        return paragraph;
    }
    private checkIsFieldParagraph(paragraph: ParagraphWidget): boolean {
        if (isNullOrUndefined(paragraph.childWidgets) || paragraph.childWidgets.length === 0) {
            return false;
        }
        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
            const line: LineWidget = paragraph.childWidgets[i] as LineWidget;
            for (let j: number = 0; j < line.children.length; j++) {
                const element: ElementBox = line.children[j];
                if (element instanceof FieldElementBox && element.hasFieldEnd) {
                    return true;
                }
            }
        }
        return false;
    }
    private clearLineMeasures(): void {
        this.maxBaseline = 0;
        this.maxTextBaseline = 0;
        this.maxTextHeight = 0;
    }
    private layoutFloatElements(paragraph: ParagraphWidget): void {
        paragraph.floatingElements.forEach((shape: ShapeBase) => {
            if (shape instanceof ShapeBase && shape.textWrappingStyle !== 'Inline') {
                if (!this.isRelayoutOverlap) {
                    this.layoutShape(shape);
                }
            }
        });
    }
    private layoutShape(element: ShapeBase): void {
        if (element instanceof ShapeElementBox && element.isHorizontalRule) {
            return;
        }
        if (element.textWrappingStyle !== 'Inline') {
            const position: Point = this.getFloatingItemPoints(element);
            element.x = position.x;
            element.y = position.y;
            if(!element.paragraph.isInsideTable && element.paragraph.indexInOwner !== 0 && element.verticalPosition >= 0 && Math.round(element.paragraph.y) >= Math.round(element.y) && this.viewer.clientArea.bottom <= element.y + element.height && (element.verticalOrigin == "Line" || element.verticalOrigin == "Paragraph") && element.textWrappingStyle !== "InFrontOfText" && element.textWrappingStyle !== "Behind") {
                this.moveToNextPage(this.viewer, element.line);
                this.updateShapeBaseLocation(element.line.paragraph);
            }
            const bodyWidget: BlockContainer = element.paragraph.bodyWidget;
            if (bodyWidget.floatingElements.indexOf(element) === -1) {
                bodyWidget.floatingElements.push(element);
                /* eslint:disable */
                bodyWidget.floatingElements.sort(function (a: ShapeBase, b: ShapeBase): number { return a.y - b.y; });
            }
            if (element.paragraph.floatingElements.indexOf(element) === -1) {
                element.paragraph.floatingElements.push(element);
            }
        } else {
            if (element.width === 0 && element.widthScale !== 0) {
                let containerWidth: number = HelperMethods.convertPointToPixel(element.line.paragraph.getContainerWidth());
                element.width = (containerWidth / 100) * element.widthScale;
            }
        }
        const clientArea: Rect = this.viewer.clientArea;
        const clientActiveArea: Rect = this.viewer.clientActiveArea;
        if (element instanceof ShapeElementBox) {
            const blocks: BlockWidget[] = element.textFrame.childWidgets as BlockWidget[];
            this.viewer.updateClientAreaForTextBoxShape(element, true);
            for (let i: number = 0; i < blocks.length; i++) {
                const block: BlockWidget = blocks[i];
                this.viewer.updateClientAreaForBlock(block, true);
                if (block instanceof TableWidget) {
                    this.clearTableWidget(block, true, true);
                }
                this.layoutBlock(block, 0);
                this.viewer.updateClientAreaForBlock(block, false);
            }
        }
        this.viewer.clientActiveArea = clientActiveArea;
        this.viewer.clientArea = clientArea;
    }
    private moveElementFromNextLine(line: LineWidget): void {
        let nextLine: LineWidget = line.nextLine;
        if (nextLine && !line.paragraph.bodyWidget.sectionFormat.equalWidth && line.paragraph.bodyWidget.columnIndex !== nextLine.paragraph.bodyWidget.columnIndex) {
            nextLine = undefined;
        }
        while (nextLine instanceof LineWidget) {
            if (nextLine.children.length > 0) {
                const element: ElementBox = nextLine.children.splice(0, 1)[0];
                line.children.push(element);
                element.line = line;
                break;
            } else {
                if (nextLine.paragraph.childWidgets.length === 1) {
                    nextLine.paragraph.destroy();
                } else {
                    nextLine.paragraph.childWidgets.splice(nextLine.paragraph.childWidgets.indexOf(nextLine), 1);
                }
                nextLine = line.nextLine;
            }
        }
    }
    private layoutLine(line: LineWidget, count: number): LineWidget {
        const paragraph: ParagraphWidget = line.paragraph;
        if (line.children.length === 0) {
            this.moveElementFromNextLine(line);
        }
        let element: ElementBox = line.children[count];
        let isNotEmptyField = true;
        if (element instanceof FieldElementBox && line.children[line.children.length - 1] instanceof FieldElementBox) {
            isNotEmptyField = false;
            for (var i = 0; i < line.children.length; i++) {
                if ((line.children[i] as FieldElementBox).fieldType == 2 && line.children[i].nextElement != undefined && !(line.children[i].nextElement instanceof FieldElementBox)) {
                    isNotEmptyField = true;
                    break;
                }
            }
        }
        this.clearLineMeasures();
        line.marginTop = 0;
        let bodyIndex: number = paragraph.bodyWidget.indexInOwner;
        let lineIndex: number = line.indexInOwner;
        while (element instanceof ElementBox) {
            if(!(element instanceof ListTextElementBox)) {
                element.padding.left = 0;
            }
            if (!isNotEmptyField) {
                this.layoutElement(element, paragraph, true);
                isNotEmptyField = true;
            } else {
                this.layoutElement(element, paragraph);
            }
            line = element.line;
            if (element instanceof TextElementBox) {
                const textElement: TextElementBox = element as TextElementBox;
                if (!isNullOrUndefined(textElement.errorCollection) && textElement.errorCollection.length > 0) {
                    textElement.ischangeDetected = true;
                }
            }
            if (!this.isRTLLayout) {
                const lineIndex: number = paragraph.childWidgets.indexOf(element.line);
                if (lineIndex > 0 && this.hasFloatingElement) {
                    this.hasFloatingElement = false;
                    if (paragraph.bodyWidget.floatingElements.length > 0 && element instanceof TextElementBox && !(paragraph.containerWidget instanceof TableCellWidget)) {
                        element = (paragraph.childWidgets[lineIndex] as LineWidget).children[0];                       
                    }
                } else {
                    this.hasFloatingElement = false;
                    if (this.is2013Justification && !isNullOrUndefined(this.nextElementToLayout) && !(!isNullOrUndefined((element.paragraph.containerWidget as TextFrame).containerShape) && (element.paragraph.containerWidget as TextFrame).containerShape === this.nextElementToLayout)) {
                        element = this.nextElementToLayout;
                    } else {
                        // if (!line.paragraph.isInsideTable && bodyIndex !== line.paragraph.containerWidget.indexInOwner && !isNullOrUndefined(element.nextElement)) {
                        //     if (element.nextElement.line.children.indexOf(element.nextElement) !== element.nextElement.line.children.length - 1) {
                        //         element = undefined;
                        //     }
                        // }
                        // if (!isNullOrUndefined(element)) {
                        element = element.nextElement;
                        // }
                        if(element instanceof TextElementBox && element.text.indexOf(" ") == 0 && element.text.length > 2){
                            if(isNullOrUndefined(element.nextElement) && element.text.trim().length > 0){
                                element.text = element.text.substring(1,element.text.length);
                                element.isWidthUpdated = false;
                                let elementIndex = element.line.children.indexOf(element);
                                element.line.children.splice(elementIndex,1);
                                let textElement = new TextElementBox();
                                textElement.text = " ";
                                textElement.line = element.line;
                                textElement.characterFormat.copyFormat(element.characterFormat);
                                // Copy revisions
                                if (element.revisions.length > 0) {
                                    for (let m: number = 0; m < element.revisions.length; m++) {
                                        const revision: Revision = element.revisions[m];
                                        textElement.revisions.push(revision);
                                        const rangeIndex: number = revision.range.indexOf(element);
                                        if (rangeIndex < 0) {
                                            revision.range.push(textElement);
                                        } else {
                                            revision.range.splice(rangeIndex, 0, textElement);
                                        }
                                    }
                                }
                                element.line.children.splice(elementIndex, 0 , textElement);
                                element.line.children.splice(elementIndex+1, 0 , element);
                                element = textElement;
                            }
                        }
                    }
                    this.nextElementToLayout = undefined;
                }
            } else {
                element = undefined;
                this.isRTLLayout = false;
            }
        }
        return line;
    }
    /* eslint-disable  */
    private layoutElement(element: ElementBox, paragraph: ParagraphWidget, isEmptyField?: boolean): void {
        if (((element.isColumnBreak || element.isPageBreak) && paragraph.isInHeaderFooter) || (element instanceof ShapeElementBox && element.isHorizontalRule)) {
            return;
        }
        let line: LineWidget = element.line;
        let text: string = '';
        let index: number = element.indexInOwner;
        if (this.viewer.owner.editorModule && this.viewer.owner.editorHistoryModule && this.viewer.owner.editorHistoryModule.isRedoing && !isNullOrUndefined((element.paragraph.containerWidget as BodyWidget).footNoteReference) && this.viewer.owner.enableTrackChanges && element.removedIds.length > 0) {
            this.viewer.owner.editorModule.constructRevisionFromID(element, true);
        }
        if (element instanceof FieldElementBox) {
            if (element.fieldType === 0) {
                if (this.documentHelper.fields.indexOf(element) === -1) {
                    this.documentHelper.fields.push(element);
                }
                if (!isNullOrUndefined(element.formFieldData) &&
                    this.documentHelper.formFields.indexOf(element) === -1 && !this.isInsertFormField) {
                    this.documentHelper.formFields.push(element);
                }
            }
            this.layoutFieldCharacters(element);
            if (element.line.isLastLine() && isNullOrUndefined(element.nextNode) && !this.isFieldCode) {
                // If a pargraph has a floating element and the line widget doesn't contain a valid element based on the element's width, then consider it an empty line.
                // Because the clientActiveArea position will be updated based on adjusted Rect in the adjustPoition method.
                if (!isNullOrUndefined(paragraph.containerWidget) && paragraph.floatingElements.length > 0 &&
                    !(paragraph.containerWidget instanceof TextFrame) && this.isConsiderAsEmptyLineWidget(element.line)) {
                    this.layoutEmptyLineWidget(paragraph, false, element.line);
                }
                this.moveToNextLine(line);
            } else if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width > 0 && !element.line.isLastLine()) {
                this.moveElementFromNextLine(line);
                if (element.line.isLastLine() && isNullOrUndefined(element.nextNode) && !this.isFieldCode) {
                    if (element.fieldType !== 2 && isNullOrUndefined(element.fieldSeparator)) {
                        this.layoutEmptyLineWidget(paragraph, false, element.line);
                    }
                    this.moveToNextLine(line);
                }
            } else if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width === 0) {
                this.moveToNextLine(line);
                if (line.paragraph.lastChild === line && !isNullOrUndefined(line.nextLine) &&
                    this.viewer.clientActiveArea.height >= 0) {
                    this.moveFromNextPage(line);
                }
            } else if (isEmptyField) {
                const textHelper: TextSizeInfo = this.documentHelper.textHelper.getHeight(paragraph.characterFormat);
                element.height = textHelper.Height;
            }
            return;
        }
        if (element instanceof ListTextElementBox || this.isFieldCode || element instanceof BookmarkElementBox ||
            element instanceof EditRangeEndElementBox || element instanceof EditRangeStartElementBox
            || element instanceof ContentControl ||
            (element instanceof ShapeBase && element.textWrappingStyle !== 'Inline')) {
                if (!this.isInitialLoad && element instanceof ContentControl && element.type === 0 && element.contentControlWidgetType === 'Block') {
                    if (!isNullOrUndefined(element.paragraph) && (element.paragraph.firstChild as LineWidget).children[0] === element && !isNullOrUndefined(element.reference)
                        && !isNullOrUndefined(element.reference.paragraph)
                        && (element.reference.paragraph.lastChild as LineWidget).children[(element.reference.paragraph.lastChild as LineWidget).children.length - 1] !== element.reference) {
                            element.contentControlWidgetType = 'Inline';
                            element.reference.contentControlWidgetType = 'Inline';
                            element.contentControlProperties.contentControlWidgetType = 'Inline';
                            let block: BlockWidget = element.paragraph;
                            if (block === element.reference.paragraph && element.reference.paragraph.contentControlProperties) {
                                element.reference.paragraph.contentControlProperties = undefined;
                            }
                            while(block instanceof ParagraphWidget && block && block.contentControlProperties && block !== element.reference.paragraph) {
                                block.contentControlProperties = undefined;
                                block = block.nextRenderedWidget as BlockWidget;
                            }
                    }
                }
            if (element instanceof BookmarkElementBox) {
                if (element.bookmarkType === 0 && !this.documentHelper.bookmarks.containsKey(element.name)) {
                    this.documentHelper.bookmarks.add(element.name, element);
                    if (!isNullOrUndefined(element.properties)) {
                        let columnFirst = parseInt(element.properties["columnFirst"]);
                        if (element.paragraph.isInsideTable) {
                            let row = element.paragraph.associatedCell.ownerRow;
                            let cell = row.getCellUsingColumnIndex(row.rowIndex, columnFirst);
                            if (!isNullOrUndefined(cell)) {
                                cell.isRenderBookmarkStart = true;
                            }
                        }
                    }
                } else if (element.bookmarkType === 1 && this.documentHelper.bookmarks.containsKey(element.name)) {
                    let bookmrkElement: BookmarkElementBox = this.documentHelper.bookmarks.get(element.name);
                    if (isNullOrUndefined(bookmrkElement.reference)
                        || isNullOrUndefined(bookmrkElement.reference.paragraph)
                        || isNullOrUndefined(bookmrkElement.reference.paragraph.bodyWidget)) {
                        bookmrkElement.reference = element;
                        element.reference = bookmrkElement;
                    }
                    if (isNullOrUndefined(bookmrkElement.properties)) {
                        if (!isNullOrUndefined(this.documentHelper.selection)) {
                            let cell: TableCellWidget = bookmrkElement.reference.paragraph.associatedCell;
                            if (!isNullOrUndefined(cell)) {
                                cell.isRenderBookmarkEnd = false;
                                if (this.documentHelper.selection.isRenderBookmarkAtEnd(bookmrkElement.reference)) {
                                    cell.isRenderBookmarkEnd = true;
                                }
                            }
                        }
                    } else{
                        if (!isNullOrUndefined(element.paragraph.associatedCell)) {
                            let lastPara: ParagraphWidget = this.documentHelper.selection.getLastParagraph(element.paragraph.associatedCell);
                            let lastLine: LineWidget = lastPara.lastChild as LineWidget;
                            if (!isNullOrUndefined(lastLine)) {
                                let lastElement = lastLine.children[lastLine.children.length - 1];
                                if (lastElement == element) {
                                    let columnLast: number = parseInt(element.reference.properties['columnLast']);
                                    let endRow: TableRowWidget = element.paragraph.associatedCell.ownerRow;
                                    let endCell: TableCellWidget = undefined;
                                    let cellIndex: number = columnLast;
                                    while (isNullOrUndefined(endCell) && cellIndex > -1) {
                                        endCell = endRow.getCellUsingColumnIndex(endRow.rowIndex, cellIndex);
                                        if (isNullOrUndefined(endCell)) {
                                            cellIndex--;
                                        }
                                    }
                                    if (!isNullOrUndefined(endCell)) {
                                        endRow.isRenderBookmarkEnd = true;
                                    }
                                }
                            }
                        }
                    }
                } else if (element.bookmarkType === 0 && this.documentHelper.bookmarks.containsKey(element.name)) {
                    if (isNullOrUndefined(element.reference)) {
                        this.documentHelper.bookmarks.remove(element.name);
                    }
                    if(!isNullOrUndefined(element.properties)){
                        let columnFirst = parseInt(element.properties["columnFirst"]);
                        if(element.paragraph.isInsideTable) {
                        let row = element.paragraph.associatedCell.ownerRow;
                        let cell = row.getCellUsingColumnIndex(row.rowIndex, columnFirst);
                        if(!isNullOrUndefined(cell)){
                            cell.isRenderBookmarkStart = true;
                        }
                    }
                }
            }
            }
            if (element instanceof EditRangeStartElementBox || element instanceof EditRangeEndElementBox) {
                if (element instanceof EditRangeStartElementBox) {
                    const user: string = element.user !== '' ? element.user : element.group;
                    if (this.documentHelper.editRanges.containsKey(user)) {
                        let editStartCollection: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(user);
                        if (editStartCollection.indexOf(element) === -1) {
                            editStartCollection.push(element);
                        }
                    } else {
                        let newEditStartCollection: EditRangeStartElementBox[] = [];
                        newEditStartCollection.push(element);
                        this.documentHelper.editRanges.add(user, newEditStartCollection);
                    }
                }
                if (element instanceof EditRangeStartElementBox && (this.documentHelper.owner.currentUser === element.user || (element.group === "Everyone" && element.user === ""))) {
                    if (element.columnFirst != -1 && element.columnLast != -1) {
                        let row = element.paragraph.associatedCell.ownerRow;
                        let cell = row.getCellUsingColumnIndex(row.rowIndex, element.columnFirst);
                        if (!isNullOrUndefined(cell)) {
                            cell.isRenderEditRangeStart = true;
                            row.editRangeID.add(element.editRangeId, element);
                        }
                    }
                } else if (element instanceof EditRangeEndElementBox && (this.documentHelper.owner.currentUser === element.editRangeStart.user || (element.editRangeStart.group === "Everyone" && element.editRangeStart.user === ""))) {
                    if (element.editRangeStart.columnFirst != -1 && element.editRangeStart.columnLast != -1) {
                        let row = element.paragraph.associatedCell.ownerRow;
                        if (row.editRangeID.containsKey(element.editRangeStart.editRangeId)) {
                            let cell = row.getCellUsingColumnIndex(row.rowIndex, element.editRangeStart.columnFirst);
                            if (!isNullOrUndefined(cell)) {
                                if (cell.isRenderEditRangeStart) {
                                    cell.isRenderEditRangeEnd = true;
                                }
                            }
                        } else {
                            let table = element.paragraph.associatedCell.ownerTable;
                            for (let i = row.rowIndex - 1; i >= 0; i--) {
                                let previousRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                                if (previousRow.editRangeID.containsKey(element.editRangeStart.editRangeId)) {
                                    let previousCell = previousRow.getCellUsingColumnIndex(previousRow.rowIndex, element.editRangeStart.columnFirst);
                                    if (!isNullOrUndefined(previousCell)) {
                                        if (previousCell.isRenderEditRangeStart) {
                                            previousCell.isRenderEditRangeEnd = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (element instanceof ShapeBase && element.textWrappingStyle !== 'Inline' && paragraph.floatingElements.indexOf(element) == -1) {
                if (element instanceof ShapeElementBox) {
                    if (paragraph.floatingElements.indexOf(element) === -1) {
                        paragraph.floatingElements.push(element);
                    }
                    if (paragraph.bodyWidget.floatingElements.indexOf(element) === -1) {
                        paragraph.bodyWidget.floatingElements.push(element);
                    }
                }
            }
            if (element instanceof ContentControl && this.documentHelper.contentControlCollection.indexOf(element) === -1) {
                if (element.type === 0) {
                    this.documentHelper.contentControlCollection.push(element);
                } else if (element.type === 1) {
                    let endPage: Page = element.paragraph.bodyWidget.page;
                    for (let i: number = 0; i < this.documentHelper.contentControlCollection.length; i++) {
                        let cCStart: ContentControl = this.documentHelper.contentControlCollection[i];
                        let isInHeaderFooter: boolean = cCStart.line.paragraph.isInHeaderFooter;
                        // Link content control present in same header.
                        if (isInHeaderFooter && element.contentControlProperties === cCStart.contentControlProperties
                            && endPage === cCStart.line.paragraph.bodyWidget.page) {
                            element.reference = cCStart;
                            cCStart.reference = element;
                        } else if (!isInHeaderFooter && element.contentControlProperties === cCStart.contentControlProperties) {
                            element.reference = cCStart;
                            cCStart.reference = element;
                        }
                    }
                }
                if (element instanceof ContentControl && paragraph.bodyWidget.floatingElements.length > 0)
                {
                    this.adjustPosition(element, element.line.paragraph.bodyWidget);
                }
            }
            if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width > 0 && !element.line.isLastLine()) {
                this.moveElementFromNextLine(line);
            }
            if (element.line.isLastLine() && isNullOrUndefined(element.nextElement)) {
                if (this.hasValidElement(line.paragraph) && !paragraph.isContainsShapeAlone()) {
                    this.moveToNextLine(line);
                } else if (!this.isInitialLoad && !this.hasValidElement(line.paragraph) && line.paragraph.paragraphFormat.bidi && line.paragraph.paragraphFormat.listFormat.listId !== -1) {
                    this.moveToNextLine(line);
                } else {
                    this.layoutEmptyLineWidget(line.paragraph, false, line, false);
                }
            }
            return;
        }
        if(element instanceof TextElementBox && element.characterFormat.highlightColor != "NoColor" && element.text.trim() != "" && element.text != element.text.trim()) {
            const firstLine = paragraph.firstChild
            const lastLine = paragraph.lastChild;
            if(!isNullOrUndefined(firstLine) && firstLine instanceof LineWidget && firstLine.children.length > 0 && element === firstLine.children[0]) {
                HelperMethods.splitSpaceInTextElementBox(element, true);
            } 
            if(!isNullOrUndefined(lastLine) && lastLine instanceof LineWidget && lastLine.children.length > 0 && element === lastLine.children[lastLine.children.length - 1]) {
                HelperMethods.splitSpaceInTextElementBox(element, false);
            }
        }
        let width: number = element.width;
        if (element instanceof FieldTextElementBox && !this.isTocField(element.fieldBegin)) {
            text = this.documentHelper.getFieldResult((element as FieldTextElementBox).fieldBegin, element.paragraph.bodyWidget.page);
            if (text !== '') {
                (element as FieldTextElementBox).text = text;
            } else {
                text = (element as TextElementBox).text;
            }
        } else if (element instanceof FootnoteElementBox) {
            text = this.startAt(element, text);
            if (text !== '') {
                (element as FootnoteElementBox).text = text;
            }
        } else if (element instanceof TextElementBox) {
            // skip when cliked enter in first footnote element
            if (!isNullOrUndefined((element.paragraph.containerWidget as BodyWidget).footNoteReference)
                && element.line.isFirstLine()
                && element.paragraph.index === 0
                && element.indexInOwner === 0
                && !this.documentHelper.owner.editorModule.handledEnter
                && element instanceof FootnoteEndnoteMarkerElementBox) {
                element.text = (element.paragraph.containerWidget as BodyWidget).footNoteReference.text;
            }
            this.checkAndSplitTabOrLineBreakCharacter(element.text, element);
            //TODO: Need to update revision
            // if (element.text.length > 1 && element.line.paragraph.bidi) {
            //     let splittedText: string[] = this.splitTextByConsecutiveLtrAndRtl(element);
            //     this.updateSplittedText(element, splittedText);
            // }
            text = element.text;
        }
        // Here field code width and height update need to skipped based on the hidden property.
        if (element instanceof TextElementBox) {
            if (!element.isWidthUpdated || element.width === 0 || this.isInitialLoad
                || (this.viewer.owner.editorModule && this.viewer.owner.editorModule.isMeasureParaWidth)) {
                width = this.documentHelper.textHelper.getTextSize(element as TextElementBox, element.characterFormat);
                element.isWidthUpdated = true;
            } else {
                width = element.trimEndWidth;
            }

            if (element.text === '\t') {
                width = this.getTabWidth(paragraph, this.viewer, index, line, element as TabElementBox);
                element.width = width;
            }
            // As per MS word behavior, optional hyper Or column break is shown only when show paragraph mark properly is enabled
            // We need to show this special character based on property `showHiddenMark`
            else if (element.text === String.fromCharCode(31) || element.text === String.fromCharCode(14)) {
                element.width = width = 0;
            }
        }
        if (!isNullOrUndefined(paragraph.containerWidget) && paragraph.bodyWidget.floatingElements.length > 0 &&
            !(element instanceof ShapeElementBox && element.textWrappingStyle == 'Inline') && !(paragraph.containerWidget instanceof TextFrame) && !(element instanceof CommentCharacterElementBox) &&
            !(paragraph.containerWidget instanceof TableCellWidget && paragraph.containerWidget.ownerTable.containerWidget instanceof TextFrame)) {
            this.adjustPosition(element, element.line.paragraph.bodyWidget);
            if (paragraph.textWrapWidth) {
                paragraph.x -= element.padding.left;
                paragraph.textWrapWidth = false;
            }
        }
        let beforeSpacing: number = line.isFirstLine() && element.indexInOwner === 0 ? this.getBeforeSpacing(paragraph) : 0;
        if (this.viewer instanceof PageLayoutViewer &&
            ((element instanceof ShapeElementBox && element.textWrappingStyle === 'Inline') || !(element instanceof ShapeElementBox))
            && this.viewer.clientActiveArea.height < beforeSpacing + element.height && this.viewer.clientActiveArea.y !== this.viewer.clientArea.y) {
            if ((element instanceof TextElementBox && (element.text !== '\f' && element.text !== String.fromCharCode(14) || (element.text === '\f' && paragraph.isPageBreak() && this.documentHelper.compatibilityMode === 'Word2013'))) || !(element instanceof TextElementBox)) {
                //let bodyIndex: number = line.paragraph.containerWidget.indexInOwner;
                this.moveToNextPage(this.viewer, line);
                // if (bodyIndex !== line.paragraph.containerWidget.indexInOwner) {
                //     return;
                // }
            }
            if (element instanceof FieldTextElementBox) {
                this.updateFieldText(element);
            }
            if (element.previousElement &&
                ((element.previousElement instanceof ShapeElementBox && element.previousElement.textWrappingStyle === 'Inline') ||
                    !(element.previousElement instanceof ShapeElementBox))) {
                this.cutClientWidth(element.previousElement, undefined, (element instanceof TextElementBox && element.text === '\f') ? true : false);
            }
        }
        if (element instanceof ShapeElementBox && element.textWrappingStyle === 'Inline') {
            if (paragraph.floatingElements.indexOf(element) === -1) {
                paragraph.floatingElements.push(element);
            }
            if (element.width > this.viewer.clientActiveArea.width) {
                this.splitElementForClientArea(paragraph, element);
                this.checkLineWidgetWithClientArea(line, element);
            }
            let is2013Justification: boolean = this.is2013Justification;
            this.layoutShape(element);
            this.is2013Justification = is2013Justification;
        }
        // tslint:disable-next-line:max-line-length
        if (element instanceof FootnoteElementBox && (!element.isLayout || this.isLayoutWhole) && this.documentHelper.owner.layoutType === 'Pages') {
            this.layoutFootEndNoteElement(element);
        }
        if (element instanceof FootnoteElementBox) {
            if (this.isfootMove) {
                this.moveToNextPage(this.viewer, element.line);
                if (element.previousElement &&
                    ((element.previousElement instanceof ShapeElementBox && element.previousElement.textWrappingStyle === 'Inline') ||
                        !(element.previousElement instanceof ShapeElementBox))) {
                    this.cutClientWidth(element.previousElement);
                }
                this.isfootMove = false;
            }
            if (paragraph.paragraphFormat.keepWithNext && paragraph.paragraphFormat.keepLinesTogether && !(!element.isLayout || this.isLayoutWhole)) {
                if (!isNullOrUndefined(paragraph.bodyWidget.page.footnoteWidget) && paragraph.bodyWidget.page.footnoteWidget.y !== 0 && paragraph.bodyWidget.page.footnoteWidget.y < this.viewer.clientActiveArea.y + this.viewer.clientActiveArea.height) {
                    let findDiff: number = this.viewer.clientActiveArea.y + this.viewer.clientActiveArea.height - paragraph.bodyWidget.page.footnoteWidget.y;
                    this.viewer.clientActiveArea.height -= findDiff;
                }
            }
        }
        if (parseFloat(width.toFixed(4)) <= parseFloat(this.viewer.clientActiveArea.width.toFixed(4)) || !this.viewer.textWrap) {
            //Fits the text in current line.
            this.addElementToLine(paragraph, element);
            if (isNullOrUndefined(element.nextElement) && !element.line.isLastLine()) {
                let nextLine: LineWidget = element.line.nextLine;
                let nextElement: ElementBox = nextLine.children[0];
                if (nextElement instanceof TextElementBox && nextElement.text.indexOf(" ") == 0) {
                    this.moveElementFromNextLine(line);
                }
            }
            if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width > 0 && !element.line.isLastLine()) {
                this.moveElementFromNextLine(line);
            } else if (!element.line.isLastLine() && isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width === 0) {
                this.moveToNextLine(line);
                if (line.paragraph.lastChild === line && this.viewer.clientActiveArea.height >= 0) {
                    this.moveFromNextPage(line);
                }
            }
        } else if (element instanceof TextElementBox) {
            if (element.text === '\t') {
                let currentLine: LineWidget = element.line;
                let isElementMoved : boolean = false;
                // Added the condition to check While the tab element width is greater then clientActiveArea width and while it was first element of line should not move to next line
				if(element.indexInOwner !== 0 && element instanceof TabElementBox) {
                    isElementMoved = true;
                    this.addSplittedLineWidget(currentLine, currentLine.children.indexOf(element) -1);
                } else {
                    if(this.isWrapText && this.viewer.clientActiveArea.x + this.viewer.clientActiveArea.width === this.viewer.clientActiveArea.right) {
                        this.isWrapText = false;
                    }
                    this.addSplittedLineWidget(currentLine, currentLine.children.indexOf(element));
                }
                this.moveToNextLine(currentLine);
                if (currentLine.paragraph.bodyWidget.floatingElements.length > 0 && isElementMoved) {
                    this.nextElementToLayout = element;
                    this.hasFloatingElement = true;
                    return;
                } else {
                    // Recalculates tab width based on new client active area X position
                    element.width = this.getTabWidth(paragraph, this.viewer, index, element.line, element as TabElementBox);
                    if(isElementMoved){
                        this.addElementToLine(paragraph, element);
                        if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width > 0
                            && !element.line.isLastLine()) {
                            this.moveElementFromNextLine(element.line);
                        }
                    }
                }
            } else {
                //Splits the text and arrange line by line, till end of text.
                do {
                    line = element.line;
                    //Added the condition to skip line split while layouting dropDownFormField 
                    if (!(element.previousElement instanceof FieldElementBox && element.previousElement.fieldType == 2
                        && !isNullOrUndefined(element.previousElement.fieldBeginInternal)
                        && element.previousElement.fieldBeginInternal.formFieldData instanceof DropDownFormField)) {
                        this.splitTextForClientArea(line, element, element.text, element.trimEndWidth, element.characterFormat);
                    }
                    this.checkLineWidgetWithClientArea(line, element);
                    if (element instanceof FieldTextElementBox && !this.isInitialLoad) {
                        this.updateFieldText(element);
                    }
                    if (element.line !== line && !isNullOrUndefined(this.nextElementToLayout) && this.is2013Justification) {
                        return;
                    }
                } while (element.line !== line && this.cutClientWidth(element));
            }
        } else {
            do {
                line = element.line;
                this.splitElementForClientArea(paragraph, element);
                this.checkLineWidgetWithClientArea(line, element);
                if (element instanceof FieldTextElementBox) {
                    this.updateFieldText(element);
                }
            } while (element.line !== line && this.cutClientWidth(element, true));
        }
        let contentControl: ContentControl;
        if(!isNullOrUndefined(element.nextNode) && element.nextNode instanceof ContentControl){
            contentControl = element.nextNode;
        }
        if ((text === '\v' || text === '\f' || text === '\r' || text === String.fromCharCode(14)) && !contentControl) {
            let elementIndex: number = line.children.indexOf(element);
            if (elementIndex > -1) {
                this.addSplittedLineWidget(line, elementIndex);
            }
        }
        if (element.line.isLastLine() && isNullOrUndefined(element.nextElement) || text === '\v' || text === '\f' || text === '\r' || text === String.fromCharCode(14)) {
            if (this.isXPositionUpdated) {
                this.isXPositionUpdated = false;
                return;
            }
            this.moveToNextLine(element.line);
            if (text === '\v' && isNullOrUndefined(element.nextNode)) {
                this.layoutEmptyLineWidget(paragraph, true, line, true);
            } else if ((text === '\f' || text === String.fromCharCode(14)) && this.viewer instanceof PageLayoutViewer && !(element.line.paragraph.containerWidget instanceof TableCellWidget)) {
                let isRTLLayout: boolean = this.isRTLLayout;
                this.isRTLLayout = false;
                if (isNullOrUndefined(element.nextNode) || element.nextNode instanceof ContentControl) {
                    if (text === String.fromCharCode(14)) {
                        this.moveToNextPage(this.viewer, element.line.nextLine, false);
                        this.layoutEmptyLineWidget(element.line.nextLine.paragraph, false, element.line.nextLine, true);
                    } else {
                        this.moveToNextPage(this.viewer, element.line, true);
                    }
                } else if (!isNullOrUndefined(element.line.nextLine)) {
                    this.moveToNextPage(this.viewer, element.line.nextLine, false);
                }
                this.isRTLLayout = isRTLLayout;
            }
        }
        this.isXPositionUpdated = false;
    }

    /**
    * @private
    */
    public adjustPosition(element: ElementBox, bodyWidget: BlockContainer) {
        let clientArea: Rect = this.viewer.clientActiveArea;
        const previousLeft: number = this.viewer.clientActiveArea.x;
        const previousTop: number = this.viewer.clientActiveArea.y;
        const previousWidth: number = this.viewer.clientActiveArea.width;
        let adjustedRect: Rect = this.adjustClientAreaBasedOnTextWrap(element, new Rect(clientArea.x, clientArea.y, clientArea.width, clientArea.height));
        this.viewer.clientActiveArea.width = adjustedRect.width;
        //Updated element padding for wrapping.
        // if (this.isWrapText) {
        let wrapDiff: number = this.viewer.clientActiveArea.x - previousLeft;
        // if (element.indexInOwner === 0 && element.line.isFirstLine()) {
        //     wrapDiff -= HelperMethods.convertPointToPixel(element.line.paragraph.paragraphFormat.firstLineIndent);
        // }
        if (element.line.isFirstLine() && this.getFirstElement(element.line) === element && wrapDiff > 0 && !this.isSkipFirstLineIndent) {
            let firstLineIndent: number = element.line.paragraph.paragraphFormat.firstLineIndent;
            wrapDiff += HelperMethods.convertPointToPixel(firstLineIndent > 0 ? firstLineIndent : 0);
        }
        this.isSkipFirstLineIndent = false;
        element.padding.left = wrapDiff > 0 ? wrapDiff : 0;
        if (previousWidth !== this.viewer.clientActiveArea.width) {
            let wrapPos: WrapPosition = new WrapPosition(this.viewer.clientActiveArea.x, this.viewer.clientActiveArea.width);
            this.updateWrapPosition(wrapPos);
        }
        //this.isWrapText = false;
        // }
        if (this.viewer.clientActiveArea.width === 0) {
            this.isWrapText = false;
        }
        if (this.isYPositionUpdated) {
            if (element.line.isFirstLine()) {
                if (!isNullOrUndefined(element.line.paragraph.associatedCell)) {
                    let previousRenderedWidget: Widget = element.line.paragraph.previousRenderedWidget;
                    if (!isNullOrUndefined(previousRenderedWidget)) {
                        element.line.paragraph.associatedCell.height += (this.viewer.clientActiveArea.y - previousRenderedWidget.y + previousRenderedWidget.height);
                    } else {
                        element.line.paragraph.associatedCell.height += (this.viewer.clientActiveArea.y - previousTop);
                    }
                }
                element.line.paragraph.y = this.viewer.clientActiveArea.y;
            } else if (element.line.children[0] === element) {
                element.line.marginTop += (this.viewer.clientActiveArea.y - previousTop);
            }
            if (element.line.paragraph.containerWidget instanceof HeaderFooterWidget) {
                element.line.paragraph.containerWidget.height += (this.viewer.clientActiveArea.y - previousTop);
            }
            if (!(element instanceof ListTextElementBox)) {
                this.isYPositionUpdated = false;
            }
        }
    }
    private getFirstElement(line: LineWidget): ElementBox {
        for (let j = 0; j < line.children.length; j++) {
            let element: ElementBox = line.children[j];
            if (!(element instanceof ShapeBase && (element as ShapeBase).textWrappingStyle !== 'Inline')) {
                return element;
            }
        }
        return undefined;
    }

    private updateWrapPosition(wrapPos: WrapPosition): void {
        for (let i: number = 0; i < this.wrapPosition.length; i++) {
            let previousWrapPos: WrapPosition = this.wrapPosition[i];
            if (Math.abs(previousWrapPos.right - wrapPos.right) > 1) {
                continue;
            } else {
                return;
            }
        }
        this.wrapPosition.push(wrapPos);
    }

    private isFirstitemInPage(element: ElementBox, yposition: number): boolean {
        if (!element.line.paragraph.isInHeaderFooter && Math.round(yposition) === this.viewer.clientArea.y) {
            return true;
        }
        return false;
    }
    private isTextFitBelow(rect: Rect, top: number, element: ElementBox | TableWidget): boolean {
        //TODO: After shape implementation.
        return false;
    }

    private isNeedToWrapForTopAndBottom(currWidgetOwnerPara: ParagraphWidget, elementBox: ElementBox, wrapOwnerIndex: number, wrapItemIndex: number, textWrappingStyle: TextWrappingStyle, textWrappingBounds: Rect, allowOverlap: boolean, wrapCollectionIndex: number, floatingEntity: TableWidget | ShapeBase, isTextRangeInTextBox: boolean, rect: Rect, width: number, height: number) {
        if (currWidgetOwnerPara.isInsideTable && textWrappingStyle === "TopAndBottom" && !(floatingEntity instanceof TableWidget)) {
            let floatingItemOwnerPara: ParagraphWidget = floatingEntity.paragraph;
        
            if (!isNullOrUndefined(floatingItemOwnerPara) && !isNullOrUndefined(floatingItemOwnerPara.associatedCell)) {
                let isLayoutInCell = floatingItemOwnerPara.isInsideTable;
                let floatingItemOwnerCell: TableCellWidget = floatingItemOwnerPara.associatedCell
                let currParaOwnerCell: TableCellWidget = currWidgetOwnerPara.associatedCell;
        
                if ((!isNullOrUndefined(floatingItemOwnerCell) && !isNullOrUndefined(currParaOwnerCell) && floatingItemOwnerCell !== currParaOwnerCell)
                    || (!isLayoutInCell && this.documentHelper.compatibilityMode !== "Word2013"))
                    return false;
            }
        }
        
        return ( wrapOwnerIndex !== wrapCollectionIndex
            && wrapItemIndex !== wrapCollectionIndex
            && textWrappingStyle === "TopAndBottom"
            && ((rect.y >= textWrappingBounds.y
                && rect.y < (textWrappingBounds.bottom))
                || ((rect.y + height > textWrappingBounds.y
                || this.isTextFitBelow(textWrappingBounds, rect.y + height, floatingEntity))
                && (rect.y + height < (textWrappingBounds.bottom)))
                || (rect.y < textWrappingBounds.y && rect.y + height > textWrappingBounds.bottom && textWrappingBounds.height > 0))
            && !(allowOverlap && (isTextRangeInTextBox || ((elementBox instanceof ImageElementBox)
            && elementBox.textWrappingStyle !== 'Inline' && elementBox.allowOverlap))));
    }


    private isNeedToWrapForSquareTightAndThrough(bodyWidget: BlockContainer, elementBox: ElementBox, wrapOwnerIndex: number, wrapItemIndex: number, textWrappingStyle: TextWrappingStyle, textWrappingBounds: Rect, allowOverlap: boolean, wrapCollectionIndex: number, floatingEntity: ShapeBase | TableWidget, isTextRangeInTextBox: boolean, rect: Rect, width: number, height: number): boolean {
        return (bodyWidget.floatingElements.length > 0
            && wrapOwnerIndex !== wrapCollectionIndex
            && wrapItemIndex !== wrapCollectionIndex
            && textWrappingStyle !== 'Inline'
            && textWrappingStyle !== 'Behind'
            && textWrappingStyle !== 'TopAndBottom'
            && textWrappingStyle !== 'InFrontOfText'
            && (Math.round((rect.y + height)) > Math.round(textWrappingBounds.y) ||
                this.isTextFitBelow(textWrappingBounds, rect.y + height, floatingEntity))
            && Math.round(rect.y) < Math.round((textWrappingBounds.y + textWrappingBounds.height))
            && !(allowOverlap && (isTextRangeInTextBox || ((elementBox instanceof ImageElementBox)
                && elementBox.textWrappingStyle !== 'Inline' && elementBox.allowOverlap))));
    }
    private isNeedToWrapForSquareTightAndThroughForTable(container: BlockContainer, table: TableWidget, wrapIndex: number, wrapItemIndex: number, wrappingStyle: TextWrappingStyle, textWrappingBounds: Rect, allowOverlap: boolean, wrapCollectionIndex: number, floatingElemnt: ShapeBase | TableWidget, isInTextBox: boolean, rect: Rect, width: number, height: number): boolean {
        return (container.floatingElements.length > 0 && wrapIndex !== wrapCollectionIndex
            && wrapItemIndex !== wrapCollectionIndex && wrappingStyle !== 'Inline'
            && wrappingStyle !== 'Behind' && wrappingStyle !== 'TopAndBottom'
            && wrappingStyle !== 'InFrontOfText'
            && ((Math.round(rect.y + height) >= Math.round(textWrappingBounds.y)
            && Math.round(rect.y) < Math.round(textWrappingBounds.bottom))
            //Checks whether the bottom of the table intersects with floating item.
            || Math.round(rect.y + height) <= Math.round(textWrappingBounds.bottom)
            && Math.round(rect.y + height) >= Math.round(textWrappingBounds.y))
            && !(allowOverlap && (isInTextBox)));
    }
    private isNeedToWrapLeafWidget(pargaraph: ParagraphWidget, elementBox: ElementBox): boolean {
        let IsNeedToWrap: boolean = true;
        return (pargaraph.bodyWidget.floatingElements.length > 0
            && (IsNeedToWrap || pargaraph.associatedCell)
            && !(elementBox instanceof ShapeBase && (elementBox.textWrappingStyle === 'InFrontOfText' || elementBox.textWrappingStyle === 'Behind')));
    }
    private getMinWidth(currTextRange: TextElementBox, width: number, height: number, rect: Rect): number {
        let text: string = currTextRange.text;
        let split: string[] = text.split(' ');

        // Gets the minimum width from the text when it contains only empty space.
        if (text !== '' && text.trim() === ''
            && currTextRange && currTextRange.line.paragraph
            && currTextRange.previousNode && currTextRange.nextNode
            && currTextRange.line.paragraph.isEmpty) {
            split = [''];
        }
        // Initialized the text with additional empty string.
        // It avoids the minimum width calculation from next sibling (GetNextTextRangeWidth).

        let minwidth: number = this.documentHelper.textHelper.measureText(split[0], currTextRange.characterFormat, currTextRange.scriptType).Width;
        //Need to layout the unicode characters (chinese) character by character.
        // if (DrawingContext.IsUnicodeText(text)) {
        //     minwidth = DrawingContext.MeasureTextRange(currTextRange, text[0].ToString()).Width;
        // }

        let nextSibling: TextElementBox = this.getNextSibling(currTextRange) as TextElementBox;
        if (split.length === 1 && nextSibling) {
            let nextSiblingText: string = nextSibling.text;
            minwidth += this.getNextTextRangeWidth(nextSibling, nextSiblingText, width, height, rect);
        }// Add the minimum character width of that paragraph, if this text range is para mark
        return minwidth;
    }
    private getNextTextRangeWidth(nextSiblingTextRange: ElementBox, nextSiblingText: string, width: number, height: number, rect: Rect): number {
        let nextsibling: TextElementBox = nextSiblingTextRange as TextElementBox;
        // if (nextSiblingTextRange instanceof WFootnote)
        //     nextsibling = ((nextSiblingTextRange as IWidget).LayoutInfo as LayoutFootnoteInfoImpl).TextRange;
        let sizeNext: Rect = new Rect(0, 0, 0, 0);
        let isNextSiblingSizeNeedToBeMeasure: boolean = this.isNextSibligSizeNeedToBeMeasure(sizeNext, nextSiblingTextRange, rect, width, height);
        while (isNextSiblingSizeNeedToBeMeasure
            && this.isLeafWidgetNextSiblingIsTextRange(nextsibling)
            && width + sizeNext.width < rect.width) {
            nextsibling = this.getNextSibling(nextsibling) as TextElementBox;
            if (!this.isNextSibligSizeNeedToBeMeasure(sizeNext, nextsibling, rect, width, height)) {
                break;
            }
            nextSiblingText += nextsibling.text;
        }
        return sizeNext.width;
    }
    private isLeafWidgetNextSiblingIsTextRange(textRange: TextElementBox): boolean {
        let nextSiblingTextRange: TextElementBox = this.getNextSibling(textRange) as TextElementBox;
        if (nextSiblingTextRange && nextSiblingTextRange instanceof TextElementBox) {
            return true;
        }
        return false;
    }
    private isNextSibligSizeNeedToBeMeasure(sizeNext: Rect, nextSiblingwidget: ElementBox, rect: Rect, width: number, height: number): boolean {
        let text: string = null;
        let nextSiblingTextRange: TextElementBox = nextSiblingwidget as TextElementBox;
        if (nextSiblingTextRange) {
            text = nextSiblingTextRange.text;
            if (text.indexOf(' ') !== -1 || (text.indexOf('-') !== -1 || (text.indexOf('_') !== -1)
                && ((width + sizeNext.width + (this.documentHelper.textHelper.measureText(text.split('-')[0], nextSiblingTextRange.characterFormat, nextSiblingTextRange.scriptType)).Width) < rect.width))
                || ((nextSiblingTextRange).text === '\t')) {
                let elementWidth: number = nextSiblingTextRange.width;
                if (text !== text.split(' ')[0]) {
                    elementWidth = this.documentHelper.textHelper.measureText(text.split(' ')[0], nextSiblingTextRange.characterFormat, nextSiblingTextRange.scriptType).Width;
                }
                if ((width + sizeNext.width + elementWidth) > rect.width && text.indexOf('-')) {
                    if (text !== text.split('-')[0] + '-') {
                        elementWidth = this.documentHelper.textHelper.measureText(text.split('-')[0] + '-', nextSiblingTextRange.characterFormat, nextSiblingTextRange.scriptType).Width;
                    }
                }
                sizeNext.width += elementWidth;
                return false;
            }
            else {
                if (nextSiblingTextRange.text.length > 0) {
                    let textInfo = this.documentHelper.textHelper.measureText(nextSiblingTextRange.text, nextSiblingTextRange.characterFormat, nextSiblingTextRange.scriptType);
                    sizeNext.height += textInfo.Height;
                    sizeNext.width += textInfo.Width;
                }
            }
        }
        return true;
    }
    private isNeedDoIntermediateWrapping(remainingClientWidth: number, textWrappingStyle: string, rect: Rect, width: number, paragraph: ParagraphWidget, textWrappingBounds: Rect, leafWidget: ElementBox, minwidth: number, minimumWidthRequired: number): boolean {
        return (((remainingClientWidth > minimumWidthRequired)
            && (((Math.round(rect.width) <= Math.round(minwidth)
                || (rect.width < width && leafWidget.paragraph.isInsideTable))
                && textWrappingStyle !== 'Left'                 // Skip to update width when the wrap type as left
                && textWrappingStyle !== 'Largest')
                || textWrappingStyle === 'Right'  //To layout right side when the wrap type as right
                || (rect.width < remainingClientWidth && textWrappingStyle === 'Largest'))) // Check whether the right side width is greater than the left side when the wrap type as largest
            || ((Math.round(textWrappingBounds.x - paragraph.x + paragraph.leftIndent) < minimumWidthRequired    // Check whether the left side of text wrap object is have minimum width to layout or not
                || (leafWidget instanceof TextElementBox && this.isFloatingItemOnLeft(rect, minwidth, textWrappingBounds)))
                && (textWrappingStyle !== 'Left' || remainingClientWidth < minimumWidthRequired)));
    }
    private isFloatingItemOnLeft(rect: Rect, minWidth: number, bounds: Rect): boolean {
        return false;
    }
    private getNextSibling(currentElementBox: TextElementBox): TextElementBox {
        let nextSibling: ElementBox = currentElementBox.nextNode;
        let isFieldCode: boolean = false;
        while (nextSibling) {
            if ((nextSibling instanceof FieldElementBox) || (nextSibling instanceof BookmarkElementBox) || isFieldCode || nextSibling instanceof ListTextElementBox) {
                if (nextSibling instanceof FieldElementBox) {
                    if (nextSibling.fieldType === 0) {
                        isFieldCode = true;
                    } else if (nextSibling.fieldType === 2) {
                        isFieldCode = false;
                    }
                }
            } else if (nextSibling instanceof TextElementBox) {
                break;
            }
            nextSibling = nextSibling.nextNode;
        }
        return nextSibling as TextElementBox;
    }
    private adjustClientAreaBasedOnTextWrap(elementBox: ElementBox, rect: Rect): Rect {
        let ownerPara: ParagraphWidget = elementBox.line.paragraph;
        let bodyWidget: BlockContainer = ownerPara.bodyWidget;
        let yValue: number = 0;
        let layouter: LayoutViewer = this.viewer;
        let yposition = rect.y;
        let isFirstItem: boolean = this.isFirstitemInPage(elementBox, yposition);
        if (isFirstItem) {
            yValue = yposition;
        }
        isFirstItem = isNullOrUndefined(ownerPara.previousWidget);
        //Update Layout area based on text wrap
        if (this.isNeedToWrapLeafWidget(ownerPara, elementBox)) {
            let clientLayoutArea: Rect = layouter.clientArea;
            //Need to handle sorting floating items.
            // Sort based on Y position
            bodyWidget.floatingElements.sort(function (a, b) { return a.y - b.y; });
            // Sort based on X position
            bodyWidget.floatingElements.sort(function (a, b) { return a.x - b.x; });
            for (let i: number = 0; i < bodyWidget.floatingElements.length; i++) {
                let floatingItem: ShapeBase | TableWidget = bodyWidget.floatingElements[i];
                let allowOverlap: boolean = false;
                if (floatingItem instanceof ShapeBase) {
                    allowOverlap = floatingItem.allowOverlap;
                } else {
                    allowOverlap = floatingItem.positioning.allowOverlap;
                }
                if (ownerPara.isInsideTable) {
                    if (floatingItem instanceof TableWidget && !floatingItem.isInsideTable) {
                        continue;
                    }
                }
                if (this.isRelayout && !this.isRelayoutOverlap &&
                    this.viewer.documentHelper.selection.isExistAfter(floatingItem instanceof TableWidget ? floatingItem : floatingItem.line.paragraph, elementBox.line.paragraph)
                    || this.isRelayout && this.isRelayoutOverlap && this.viewer.documentHelper.selection.isExistAfter(floatingItem instanceof TableWidget ? floatingItem : floatingItem.line.paragraph, this.endOverlapWidget)) {
                    continue;
                }
                // if (ownerPara.isInsideTable && allowOverlap
                //     && (ownerPara.associatedCell.ownerTable.positioning.allowOverlap))
                // {
                //     WParagraph ownerParagraph = (m_lcOperator as Layouter).FloatingItems[i].OwnerParagraph;
                //     if (!(ownerParagraph !== null
                //         && ownerParagraph.IsInCell
                //         && ownerPara.GetOwnerEntity() === ownerParagraph.GetOwnerEntity()))
                //     {
                //         continue;
                //     }
                // }
                let xPosition: number = floatingItem.x;
                let distanceLeft: number = 0;
                let distanceTop: number = 0;
                let distanceRight: number = 0;
                let distanceBottom: number = 0;
                let width: number = 0;
                if (floatingItem instanceof ShapeBase) {
                    distanceLeft = floatingItem.distanceLeft;
                    distanceTop = floatingItem.distanceTop;
                    distanceRight = floatingItem.distanceRight;
                    distanceBottom = floatingItem.distanceBottom;
                    width = floatingItem.width;
                } else {
                    width = floatingItem.getTableCellWidth();
                    distanceLeft = floatingItem.positioning.distanceLeft;
                    distanceTop = floatingItem.positioning.distanceTop;
                    distanceRight = floatingItem.positioning.distanceRight;
                    distanceBottom = floatingItem.positioning.distanceBottom;
                }
                let textWrappingBounds: Rect = new Rect(floatingItem.x - distanceLeft, floatingItem.y - distanceTop,
                    width + distanceLeft + distanceRight,
                    floatingItem.height + distanceTop + distanceBottom);
                let textWrappingStyle: TextWrappingStyle = floatingItem instanceof TableWidget ? 'Square' : floatingItem.textWrappingStyle;
                let textWrappingType: string = floatingItem instanceof TableWidget ? 'Both' : floatingItem.textWrappingType;

                //  //Need to skip the wrapping for line break when it is first item of corresponding paragraph and that paragraph contains First line indent as per Word 2010 and its lower version behavior.
                //  if (IsLineBreakIntersectOnFloatingItem(leafWidget, textWrappingStyle, textWrappingBounds, rect, size, ownerPara))
                //  continue;
                let minimumWidthRequired: number = 24;
                let bottom: number = layouter.clientArea.y + floatingItem.height;

                // if (this.isNeedToWrapParaMarkToRightSide(elementBox, ownerPara, textWrappingBounds, bottom, layouter, this.viewer.clientArea, textWrappingType, minimumWidthRequired)) {
                //     if (lineBreakPosition !== 0) {
                //         this.viewer.clientArea.y = lineBreakPosition;
                //         //m_layoutArea.UpdateBoundsBasedOnTextWrap(lineBreakPosition);
                //     }
                //     this.viewer.clientArea.x += textWrappingBounds.width;
                //     //(LeafWidget as IWidget).LayoutInfo.IsLineBreak = false;
                //     elementBox.height = 0;
                //     elementBox.width = textWrappingBounds.width;
                //     return;
                // }

                if (!(clientLayoutArea.x > (textWrappingBounds.right + minimumWidthRequired) || clientLayoutArea.right < textWrappingBounds.x - minimumWidthRequired)) {
                    if (this.isNeedToWrapForSquareTightAndThrough(bodyWidget, elementBox, -1, -1, textWrappingStyle, textWrappingBounds, allowOverlap, 1, floatingItem, false, rect, elementBox.width, elementBox.height)) {
                        let rightIndent: number = 0;
                        let leftIndent: number = 0;
                        let listLeftIndent: number = 0;
                        let firstLineIndent: number = HelperMethods.convertPointToPixel(elementBox.paragraph.paragraphFormat.firstLineIndent);
                        let paragraphLeftIndent: number = HelperMethods.convertPointToPixel(ownerPara.paragraphFormat.leftIndent);
                        let paragarphRightIndent: number = HelperMethods.convertPointToPixel(ownerPara.paragraphFormat.rightIndent);
                        firstLineIndent = ((elementBox.indexInOwner === 0 && elementBox.line.isFirstLine()) && firstLineIndent > 0) ? firstLineIndent : 0;
                        let currTextRange: ElementBox = elementBox instanceof TextElementBox || elementBox instanceof ListTextElementBox ? elementBox : null;
                        let containerWidget: Widget = floatingItem instanceof TableWidget ? floatingItem.containerWidget : floatingItem.line.paragraph.containerWidget;
                        let isnewline: boolean = false;
                        if (elementBox.line.paragraph) {
                            //Right indent is considered only if the rect.X greater than the floating item's X position and
                            //Text wrapping style should not be left
                            if (rect.x >= textWrappingBounds.x && textWrappingType !== 'Left') {
                                rightIndent = paragarphRightIndent;
                            }
                            //Left indent is considered only if the rect.X less than the floating item's X position and
                            //Text wrapping style should not be right
                            if (rect.x < textWrappingBounds.x && textWrappingType !== 'Right') {
                                leftIndent = paragraphLeftIndent;
                            }
                            let listFormat: WListFormat = ownerPara.paragraphFormat.listFormat;
                            let listLevel: WListLevel = this.getListLevel(listFormat.list, listFormat.listLevelNumber);
                            if (rect.x === (clientLayoutArea.x + paragraphLeftIndent)
                                && listFormat && listFormat.baseStyle
                                && listLevel && listLevel.paragraphFormat.leftIndent !== 0) {
                                listLeftIndent = paragraphLeftIndent;
                                isnewline = true;// to denote the current line is new line of the paragraph
                            }
                        }
                        // if (this.isXPositionUpdated && textWrappingType === 'Both' && this.layoutState === 'Splitted') {
                        //     rect.width = bodyWidget.width - this.viewer.clientActiveArea.x;
                        //     rect.x = textWrappingBounds.right;
                        //     this.viewer.updateClientAreaForTextWrap(rect);
                        //     return rect;
                        // }
                        
                        /* Since the Microsoft Word has different behavior to calculate minimum width required to fit a word to a side of Table, 
                        the minimum width required changes based upon table border value and table alignment.
                        And this value even differ for different word version, such that 2013, will have different minimum required value, where all other version shares the same logic to calculate minimum width required */
                        let border: number = 0;
                        let isBorderValueZero: boolean = false;
                        let table: TableWidget;
                        let borderThickness: number = 0;
                        let tableHorizontalPosition: HorizontalAlignment;
                        if (floatingItem instanceof TableWidget) {
                            table = floatingItem;
                            tableHorizontalPosition = floatingItem.positioning.horizontalAlignment;
                            border = this.getMaximumRightCellBorderWidth(floatingItem);
                            isBorderValueZero = this.getDefaultBorderSpacingValue(border, isBorderValueZero, tableHorizontalPosition);
                            borderThickness = floatingItem.tableFormat.borders.left.lineWidth / 2;
                        }
                        // Skip to update when the wrap type as left
                        if (rect.x + borderThickness >= textWrappingBounds.x && rect.x < textWrappingBounds.right && textWrappingType !== 'Left') // Skip to update when the wrap type as left
                        {
                            rect.width = rect.width - (textWrappingBounds.right - rect.x) - rightIndent;
                            this.isWrapText = true;
                            let isEntityFitInCurrentLine: boolean = true;
                            if (!isNullOrUndefined(table)) {
                                minimumWidthRequired = this.getMinimumWidthRequiredForTable(isBorderValueZero, tableHorizontalPosition, border);
                            }
                            //checks minimum width
                            if (!isEntityFitInCurrentLine || Math.round(rect.width) < minimumWidthRequired || (rect.width < elementBox.width && (elementBox as TextElementBox).text === '\t')
                                || (textWrappingBounds.x < ownerPara.x + paragraphLeftIndent)) // check whether the TextWrap X position is less than the paragraph X position
                            {
                                //TODO
                                rect.width = this.viewer.clientArea.right - textWrappingBounds.right - (isnewline ? listLeftIndent : 0);
                                //checks minimum width of the single word
                                let minwidth: number = 0;
                                if (!isNullOrUndefined(currTextRange)) {
                                    minwidth = this.getMinWidth(elementBox as TextElementBox, elementBox.width, elementBox.height, rect);
                                } else {
                                    minwidth = elementBox.width;
                                }
                               
                                if (Math.round(rect.width) < minimumWidthRequired || rect.width < minwidth) {
                                    if (isEntityFitInCurrentLine && (textWrappingBounds.x - (ownerPara.x + ownerPara.leftIndent)) > minimumWidthRequired
                                        && (this.viewer.clientArea.right - textWrappingBounds.right) > minimumWidthRequired) {
                                        rect.width = 0;
                                    } else {
                                        let topMarginValue = 0;
                                        //topMarginValue = GetTopMarginValueForFloatingTable(ownerPara,
                                        //layouter.FloatingItems[i].FloatingEntity, rect.Y);
                                        let isPositionsUpdated: boolean = false;
                                        //Check whether left side of current floating item has enoush place to fit current widget.
                                        //If it has, need to fit left side of the floating item, instead of moving to bottom.
                                        // if (layouter.clientArea.x + elementBox.width < floatingItem.x) {
                                        //     //Current item should preserve below to the floating item,which preserved left side of the floating item.
                                        //     //If left side has multiple items or none of items this may fail, need to handle this cases.
                                        //     let tempBounds: Rect = GetIntersectingItemBounds(floatingItem, yposition);
                                        //     if (tempBounds.bottom !== 0 && tempBounds.bottom <= textWrappingBounds.bottom) {
                                        //         rect.x = clientLayoutArea.x;
                                        //         rect.width = clientLayoutArea.width;
                                        //         rect.y = tempBounds.bottom + topMarginValue;
                                        //         rect.height = clientLayoutArea.bottom - tempBounds.bottom;
                                        //         this.isYPositionUpdated = true;
                                        //         isPositionsUpdated = true;
                                        //     }
                                        // }
                                       if(!isPositionsUpdated) {
                                            this.isYPositionUpdated = true;
                                            rect.width = this.viewer.clientArea.width;
                                            rect.height -= (textWrappingBounds.bottom + topMarginValue - rect.y);
                                            rect.y = textWrappingBounds.bottom + topMarginValue;
                                        }
                                    }
                                    this.viewer.updateClientAreaForTextWrap(rect);
                                    this.isWrapText = false;
                                } else {
                                    let xposition = rect.x;
                                    //TabsLayoutInfo tabsInfo = null;
                                    rect.x = textWrappingBounds.right + (isnewline ? listLeftIndent : 0) + firstLineIndent;
                                    rect.width -= firstLineIndent;
                                    this.isSkipFirstLineIndent = true;

                                    //When there is no space to fit the content in right, then update the y position.
                                    if (textWrappingStyle === 'Square' && rect.width < 0 && elementBox.width > 0) {
                                        // let topMarginValue = GetTopMarginValueForFloatingTable(ownerPara, layouter.FloatingItems[i].FloatingEntity, rect.Y);
                                        let topMarginValue: number = 0;
                                        this.isYPositionUpdated = true;
                                        rect.width = this.viewer.clientArea.width;
                                        rect.height -= (textWrappingBounds.bottom + topMarginValue - rect.y);
                                        rect.y = textWrappingBounds.bottom + topMarginValue;
                                        rect.x = xposition;
                                    } else {
                                        // this.isXPositionUpdated = true;
                                    }
                                    this.viewer.updateClientAreaForTextWrap(rect);//
                                    // if (!(leafWidget is Break))
                                    // AdjustClientAreaBasedOnExceededTab(leafWidget, size, ref rect, ownerPara);

                                    // if (leafWidget != null)
                                    //     tabsInfo = (leafWidget as ILeafWidget).LayoutInfo as TabsLayoutInfo;
                                    //if (tabsInfo == null) {
                                    //this.isWrapText = true;
                                    //this.viewer.updateClientAreaForTextWrap(rect);//
                                    // if (layouter.FloatingItems[i].FloatingEntity is WTable)
                                    // layouter.FloatingTableBottom = textWrappingBounds.Bottom;
                                    //}
                                }
                            } else {
                                //Check whether the RightPositionOfTabStopInterSectingFloattingItems have the value or not.
                                //if contains value means continue the layouting even x position exceeds the page right position.

                                let xposition: number = rect.x;
                                rect.x = textWrappingBounds.right + (isnewline ? listLeftIndent : 0) + firstLineIndent;
                                rect.width = this.viewer.clientArea.right - textWrappingBounds.right - (isnewline ? listLeftIndent : 0) - firstLineIndent;
                                this.isSkipFirstLineIndent = true;

                                //When there is no space to fit the content in right, then update the y position.
                                if (textWrappingStyle === 'Square' && rect.width < 0 && elementBox.width > 0) {
                                    // float topMarginValue = GetTopMarginValueForFloatingTable(ownerPara,
                                    //     layouter.FloatingItems[i].FloatingEntity, rect.Y);
                                    let topMarginValue: number = 0;
                                    this.isYPositionUpdated = true;
                                    rect.width = this.viewer.clientArea.width;
                                    rect.height -= (textWrappingBounds.bottom + topMarginValue - rect.y);
                                    rect.y = textWrappingBounds.bottom + topMarginValue;
                                    rect.x = xposition;
                                }
                                //else
                                // this.isXPositionUpdated = true;
                                // if (!(leafWidget is Break))
                                //     AdjustClientAreaBasedOnExceededTab(leafWidget, size, ref rect, ownerPara);

                                // //Microsoft Word 2013 doesn't split text character by character, when current line has floating item.
                                // if (ownerPara != null && ownerPara.Document.Settings.CompatibilityMode == CompatibilityMode.Word2013)
                                //     layouter.m_canSplitbyCharacter = false;
                                this.isWrapText = true;
                                this.viewer.updateClientAreaForTextWrap(rect);//

                            }
                        } else if (textWrappingBounds.x >= rect.x && rect.right > textWrappingBounds.x) {
                            rect.width = textWrappingBounds.x - rect.x - rightIndent;
                            //Remaining right side width
                            let remainingClientWidth: number = this.viewer.clientArea.right - textWrappingBounds.right;
                            remainingClientWidth = remainingClientWidth > 0 ? remainingClientWidth : 0;
                            this.isWrapText = true;
                            let isUpdateClientArea: boolean = false;
                            //checks minimum width
                            let minwidth: number = 0;
                            if (!isNullOrUndefined(currTextRange)) {
                                minwidth = this.getMinWidth(currTextRange as TextElementBox, elementBox.width, elementBox.height, rect);
                            } else {
                                minwidth = elementBox.width;
                            }
                            if (!isNullOrUndefined(table)) {
                                minimumWidthRequired = this.getMinimumWidthRequiredForTable(isBorderValueZero, tableHorizontalPosition, border);
                            }
                            if (this.isNeedDoIntermediateWrapping(remainingClientWidth, textWrappingType, rect, elementBox.width, elementBox.paragraph, textWrappingBounds, elementBox, minwidth, minimumWidthRequired)) {
                                let leftMinimumWidthRequired: number = 24;
                                rect.width = remainingClientWidth;
                                this.isWrapText = true;
                                if (rect.x + minwidth > textWrappingBounds.x || textWrappingType === 'Right' || clientLayoutArea.x > textWrappingBounds.x - leftMinimumWidthRequired) //Update X position when the wrap type as largest or right or the minimum width + rect.X > wrap x position
                                {
                                    rect.x = textWrappingBounds.right;
                                    // let listFormat: WListFormat = null;
                                    // let listLevel: WListLevel = null;
                                    // if (elementBox.line.isFirstLine
                                    //    && (listFormat = ownerPara.GetListFormatValue()) != null
                                    //    && listFormat.CurrentListStyle != null
                                    //    && (listLevel = ownerPara.GetListLevel(listFormat)) != null
                                    //    && listLevel.ParagraphFormat.LeftIndent != 0)
                                    // {
                                    //     float x = 0;
                                    //     float width = rect.Width;
                                    //     //Updates the paragraph firstline horizontal positions, such as first line indent and listtab value
                                    //     UpdateParaFirstLineHorizontalPositions(paragraphLayoutInfo, ownerPara, ref x, ref width);
                                    //     rect.X += (x + (float)paragraphLayoutInfo.Margins.Left);
                                    //     rect.Width -= (x + (float)paragraphLayoutInfo.Margins.Left);
                                    // }
                                    // this.isXPositionUpdated = true;
                                    // if (textWrappingStyle == TextWrappingStyle.Through
                                    //     && layouter.FloatingItems[i].IsDoesNotDenotesRectangle) {
                                    //     UpdateXposition(textWrappingBounds, i, ref rect, size, minwidth);
                                    // }
                                    if (rect.width > minwidth || textWrappingType === 'Right') {
                                        this.viewer.updateClientAreaForTextWrap(rect);
                                    } else if (rect.width < minwidth && elementBox.line.children[0] !== elementBox && textWrappingType === 'Both' && floatingItem instanceof ShapeBase) {
                                        this.viewer.updateClientAreaForTextWrap(rect);
                                        isUpdateClientArea = true;
                                    }
                                }
                                if ((rect.width < minimumWidthRequired && !(minwidth < remainingClientWidth && ('Tight' === textWrappingStyle)))
                                    || (rect.width < minwidth && Math.round(rect.right) === Math.round(this.viewer.clientArea.right)
                                        && textWrappingType === 'Both')) {
                                    let rect1: Rect = textWrappingBounds;
                                    if (Math.round(rect.x) === Math.round(bodyWidget.sectionFormat.leftMargin + ownerPara.paragraphFormat.leftIndent)) {
                                        //Updates top margin of the paragraph when paragraph mark not wrap based on the floating table.
                                        let topMarginValue: number = 0;
                                        //topMarginValue = GetTopMarginValueForFloatingTable(ownerPara, floatingItem, rect.y);
                                        rect.y = rect1.bottom + topMarginValue;
                                        this.isYPositionUpdated = true;
                                        rect.width = this.viewer.clientArea.width;
                                        rect.height = rect.height - (rect1.height + topMarginValue);
                                        this.viewer.updateClientAreaForTextWrap(rect);
                                        this.isWrapText = false;
                                    }
                                    // Reset the rectangle position when the rectangle right position is equialent to layout area right position
                                    else if (!isUpdateClientArea && Math.round(rect.right) >= Math.round(this.viewer.clientArea.right) && textWrappingType === 'Both') {
                                        //Updates top margin of the paragraph when paragraph mark not wrap based on the floating table.
                                        let topMarginValue = 0;
                                        // topMarginValue = GetTopMarginValueForFloatingTable(ownerPara, floatingItem, rect.y);
                                        rect.y = rect1.bottom + topMarginValue;
                                        rect.width = this.viewer.clientArea.width;
                                        rect.height = rect.height - (rect1.height + topMarginValue);
                                        rect.x = this.viewer.clientArea.x + leftIndent;
                                        this.viewer.updateClientAreaForTextWrap(rect);
                                        // this.isXPositionUpdated = true;
                                        this.isYPositionUpdated = true;
                                        this.isWrapText = false;
                                    }
                                    else {
                                        rect.width = 0;
                                        this.viewer.updateClientAreaForTextWrap(rect);
                                    }
                                }
                            } else {
                                //While text intersecting with SQUARE type floating item and there is no space
                                //available to fit this text in current line then move the text to bottom
                                //of the floating item and this behavior is applicable only for Word 2013.
                                //Lower versions split the text character by character.
                                if ((elementBox.line.isFirstLine() && elementBox.indexInOwner === 0 || remainingClientWidth === 0 && elementBox.line.children[0] === elementBox) && textWrappingStyle === 'Square'
                                    && Math.round(rect.width) <= Math.round(minwidth)
                                    && ownerPara.containerWidget === containerWidget) {
                                    rect.x = clientLayoutArea.x;
                                    rect.y = textWrappingBounds.bottom;
                                    rect.width = clientLayoutArea.width;
                                    rect.height -= (textWrappingBounds.bottom - rect.y);
                                    this.isYPositionUpdated = true;
                                } else if (Math.round(rect.width) <= Math.round(minwidth) && Math.round(rect.x - leftIndent) !== Math.round(this.viewer.clientArea.x)) {
                                    rect.width = 0;
                                } 
                                this.viewer.updateClientAreaForTextWrap(rect);//
                            }
                        }
                        if (textWrappingType !== 'Both') {
                            this.isWrapText = false;
                        }
                    } else if (this.isNeedToWrapForTopAndBottom(ownerPara, elementBox, -1, -1, textWrappingStyle, textWrappingBounds,
                        allowOverlap, 1, floatingItem, false, rect, elementBox.width, elementBox.height)) {
                        // if ((textWrappingStyle === TextWrappingStyle.Tight || textWrappingStyle === TextWrappingStyle.Through)
                        //     && !(this.getBaseEntity(layouter.floatingItems[i].floatingEntity) instanceof HeaderFooter)
                        //     && !layouter.floatingItems[i].isDoesNotDenotesRectangle) {
                        //     //Gets the exact tight and throught floatting item's bottom position.
                        //     let floattingItemBottomPosition = this.getFloattingItemBottom(layouter.floatingItems[i].floatingEntity, textWrappingBounds.bottom);
                        //     textWrappingBounds = this.getBottomPositionForTightAndThrough(floattingItemBottomPosition, textWrappingBounds, ownerPara, rect.y, size.height);
                        // }
                        //Updates top margin of the paragraph when paragraph mark not wrap based on the floating table.
                        let topMarginValue: number = 0;
                        // topMarginValue = this.getTopMarginValueForFloatingTable(ownerPara,
                        //     layouter.floatingItems[i].floatingEntity, rect.y);
                        //previous floating item y position.
                        let prevY = rect.y;
                        rect.y = textWrappingBounds.bottom + topMarginValue;
                        this.isYPositionUpdated = true;
                        //Updating the rectangle height by reducing the previous floating item's y from the current floating item's bottom.
                        rect.height = rect.height - (textWrappingBounds.bottom - prevY + topMarginValue);
                        //Update the before spacing value once sets the floating item bottom position as paragraph y position
                        if (rect.y !== yposition && elementBox instanceof TextElementBox && !(floatingItem instanceof TableWidget)
                            && elementBox.line.isFirstLine()) {
                            rect.y += elementBox.margin.top;
                            yposition = rect.y;
                        }
                        this.viewer.updateClientAreaForTextWrap(rect);
                    }
                }
            }
        }
        return rect;
    }

    private adjustClientAreaBasedOnTextWrapForTable(table: TableWidget, rect: Rect): Rect {
        //let ownerPara: ParagraphWidget = elementBox.line.paragraph;
        if (isNullOrUndefined(table.containerWidget) || isNullOrUndefined(table.bodyWidget)) {
            return rect;
        }
        let bodyWidget: BlockContainer = table.bodyWidget;
        let yValue: number = 0;
        let layouter: LayoutViewer = this.viewer;
        let yposition = rect.y;
        let isFirstItem: boolean = isNullOrUndefined(table.previousWidget);
        if (isFirstItem) {
            yValue = yposition;
        }
        if (bodyWidget.floatingElements.length > 0) {
            let clientLayoutArea: Rect = layouter.clientActiveArea;
            bodyWidget.floatingElements.sort(function (a, b) { return a.y - b.y; });
            bodyWidget.floatingElements.sort(function (a, b) { return a.x - b.x; });
            for (let i: number = 0; i < bodyWidget.floatingElements.length; i++) {
                let floatingElement: ShapeBase | TableWidget = bodyWidget.floatingElements[i];
                let allowOverlap: boolean = false;
                if (floatingElement instanceof ShapeBase) {
                    allowOverlap = floatingElement.allowOverlap;
                } else {
                    allowOverlap = floatingElement.positioning.allowOverlap;
                }
                if (table.isInsideTable) {
                    if (floatingElement instanceof TableWidget && !floatingElement.isInsideTable) {
                        continue;
                    }
                }
                if(floatingElement instanceof TableWidget && floatingElement.wrapTextAround && floatingElement.positioning.allowOverlap){
                    if(table.wrapTextAround && table.positioning.allowOverlap){
                        continue;
                    }
                }
                let tableWidth: number = table.getTableCellWidth();
                let isShape: boolean = floatingElement instanceof ShapeBase;
                let distanceLeft: number = isShape ? (floatingElement as ShapeBase).distanceLeft : (floatingElement as TableWidget).positioning.distanceLeft;
                let distanceTop: number = isShape ? (floatingElement as ShapeBase).distanceTop : (floatingElement as TableWidget).positioning.distanceTop;
                let distanceRight: number = isShape ? (floatingElement as ShapeBase).distanceRight : (floatingElement as TableWidget).positioning.distanceRight;
                let distanceBottom: number = isShape ? (floatingElement as ShapeBase).distanceBottom : (floatingElement as TableWidget).positioning.distanceBottom;
                let width: number = isShape ? floatingElement.width : (floatingElement as TableWidget).getTableCellWidth();
                let wrappingBounds: Rect = new Rect(floatingElement.x - distanceLeft, floatingElement.y - distanceTop,
                    width + distanceLeft + distanceRight,
                    floatingElement.height + distanceTop + distanceBottom);
                let textWrappingStyle: TextWrappingStyle = floatingElement instanceof TableWidget ? 'Square' : floatingElement.textWrappingStyle;
                let textWrappingType: string = floatingElement instanceof TableWidget ? 'Both' : floatingElement.textWrappingType;
                let minimumWidthRequired: number = 24;
                let tableHeight: number = table.childWidgets.length > 0 ? (table.childWidgets[0] as TableRowWidget).rowFormat.height : 0;
                let lastNestedTable: TableWidget = this.getNestedTable(table);
                let characterFormat: WCharacterFormat = (((lastNestedTable.firstChild as TableRowWidget).firstChild as TableCellWidget).firstChild as ParagraphWidget).characterFormat;
                let size: TextSizeInfo = this.documentHelper.textHelper.measureText(" ", characterFormat);
                if (tableHeight < size.Height) {
                    tableHeight = size.Height;
                }
                if (!(clientLayoutArea.x > (wrappingBounds.right + minimumWidthRequired) || clientLayoutArea.right < wrappingBounds.x - minimumWidthRequired)) {
                    if (this.isNeedToWrapForSquareTightAndThroughForTable(bodyWidget, table, -1, -1, textWrappingStyle, wrappingBounds, allowOverlap, 1, floatingElement, false, rect, tableWidth, tableHeight) && !(this.isRelayout && floatingElement instanceof TableWidget && floatingElement.positioning.verticalOrigin === 'Paragraph'&& table.index < floatingElement.index)) {
                        // Skip to update when the wrap type as left
                        if (rect.x >= wrappingBounds.x && rect.x < wrappingBounds.right && textWrappingType !== 'Left') // Skip to update when the wrap type as left
                        {
                            rect.width = rect.width - (wrappingBounds.right - rect.x);
                            this.isWrapText = true;
                            let isEntityFitInCurrentLine: boolean = true;
                            if (!isEntityFitInCurrentLine || Math.round(rect.width) < minimumWidthRequired || (rect.width < tableWidth)
                                || (wrappingBounds.x < table.x)) // check whether the TextWrap X position is less than the paragraph X position
                            {
                                rect.width = this.viewer.clientArea.right - wrappingBounds.right;
                                let minwidth: number = tableWidth;
                                if (Math.round(rect.width) < minimumWidthRequired || rect.width < minwidth) {
                                    if (isEntityFitInCurrentLine && (wrappingBounds.x - (table.x)) > minimumWidthRequired
                                        && (this.viewer.clientArea.right - wrappingBounds.right) > minimumWidthRequired) {
                                        rect.width = 0;
                                    } else {
                                        let topMarginValue = 0;
                                        let isPositionsUpdated: boolean = false;
                                        if (!isPositionsUpdated) {
                                            this.isYPositionUpdated = true;
                                            rect.width = this.viewer.clientArea.width;
                                            rect.height -= (wrappingBounds.bottom + topMarginValue - rect.y);
                                            rect.y = wrappingBounds.bottom + topMarginValue;
                                        }
                                    }
                                    this.viewer.updateClientAreaForTextWrap(rect);
                                    this.isWrapText = false;
                                } else {
                                    let xposition = rect.x;
                                    //TabsLayoutInfo tabsInfo = null;
                                    rect.x = wrappingBounds.right;
                                    //When there is no space to fit the content in right, then update the y position.
                                    if (textWrappingStyle === 'Square' && rect.width < 0 && tableWidth > 0) {
                                        // let topMarginValue = GetTopMarginValueForFloatingTable(ownerPara, layouter.FloatingItems[i].FloatingEntity, rect.Y);
                                        let marginTop: number = 0;
                                        this.isYPositionUpdated = true;
                                        rect.height -= (wrappingBounds.bottom + marginTop - rect.y);
                                        rect.width = this.viewer.clientArea.width;
                                        rect.y = wrappingBounds.bottom + marginTop;
                                        rect.x = xposition;
                                    }
                                    this.viewer.updateClientAreaForTextWrap(rect);//
                                }
                            } else {
                                let xposition: number = rect.x;
                                rect.x = wrappingBounds.right + ((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin;
                                rect.width = this.viewer.clientArea.right - wrappingBounds.right;
                                //When there is no space to fit the content in right, then update the y position.
                                if (textWrappingStyle === 'Square' && rect.width < 0 && tableWidth > 0) {
                                    // float topMarginValue = GetTopMarginValueForFloatingTable(ownerPara,
                                    //     layouter.FloatingItems[i].FloatingEntity, rect.Y);
                                    let topMarginValue: number = 0;
                                    this.isYPositionUpdated = true;
                                    rect.width = this.viewer.clientArea.width;
                                    rect.height -= (wrappingBounds.bottom + topMarginValue - rect.y);
                                    rect.y = wrappingBounds.bottom + topMarginValue;
                                    rect.x = xposition;
                                }
                                this.viewer.updateClientAreaForTextWrap(rect);//

                            }
                        }
                    }
                }
            }
        }
        return rect;
    }
    private getNestedTable(tableWidget: TableWidget): TableWidget {
        let table: TableWidget = tableWidget as TableWidget;
        while (((table.firstChild as TableRowWidget).firstChild as TableCellWidget).firstChild instanceof TableWidget) {
            table = ((table.firstChild as TableRowWidget).firstChild as TableCellWidget).firstChild as TableWidget;
        }
        return table;
    }

    private startAt(element: FootnoteElementBox, text: string): string {
        if (element.footnoteType === 'Footnote') {
            this.startat = element.paragraph.bodyWidget.sectionFormat.initialFootNoteNumber;
            text = this.getFootEndNote(element.paragraph.bodyWidget.sectionFormat.footNoteNumberFormat, this.documentHelper.footnoteCollection.indexOf(element) + this.startat);
        } else {
            this.startat = element.paragraph.bodyWidget.sectionFormat.initialEndNoteNumber;
            text = this.getFootEndNote(element.paragraph.bodyWidget.sectionFormat.endnoteNumberFormat, this.documentHelper.endnoteCollection.indexOf(element) + this.startat);
        }
        return text;
    }
    private layoutFootEndNoteElement(element: FootnoteElementBox): boolean {
        this.isFootnoteContentChanged = true;
        let footnote: FootNoteWidget;
        let positionchanged: boolean = false;
        let footIndex: number = this.documentHelper.footnoteCollection.indexOf(element);
        let insertIndex: number = 1;
        this.islayoutFootnote = true;
        let isFitted: boolean;
        let clientArea: Rect = new Rect(this.viewer.clientArea.x, this.viewer.clientArea.y, this.viewer.clientArea.width, this.viewer.clientArea.height);
        let clientActiveArea: Rect = new Rect(this.viewer.clientActiveArea.x, this.viewer.clientActiveArea.y, this.viewer.clientActiveArea.width, this.viewer.clientActiveArea.height);
        let bodyWidget: BlockContainer = element.paragraph.bodyWidget;
        let isCreated: boolean = false;
        let height: number = 0;
        if (bodyWidget.page.footnoteWidget) {
            for (let j: number = 0; j < bodyWidget.page.footnoteWidget.bodyWidgets.length; j++) {
                insertIndex = bodyWidget.page.footnoteWidget.bodyWidgets.length;
                let currentIndex: number = this.documentHelper.footnoteCollection.indexOf((bodyWidget.page.footnoteWidget.bodyWidgets[j]).footNoteReference);
                if (currentIndex > footIndex) {
                    if (currentIndex - footIndex === 1) {
                        insertIndex = j;
                        positionchanged = true;
                        break;
                    }
                }
            }
        }
        element.isLayout = true;
        if (element.footnoteType === 'Footnote') {
            if (bodyWidget.page.footnoteWidget && bodyWidget.page.footnoteWidget instanceof FootNoteWidget) {
                footnote = bodyWidget.page.footnoteWidget as FootNoteWidget;
            } else {
                isCreated = true;
                footnote = new FootNoteWidget();
                footnote.footNoteType = 'Footnote';
                footnote.page = bodyWidget.page;
                let newParagraph: ParagraphWidget = new ParagraphWidget();
                newParagraph.characterFormat = new WCharacterFormat();
                newParagraph.paragraphFormat = new WParagraphFormat();
                newParagraph.index = 0;
                let lineWidget: LineWidget = new LineWidget(newParagraph);
                newParagraph.childWidgets.push(lineWidget);
                height = this.documentHelper.textHelper.getParagraphMarkSize(newParagraph.characterFormat).Height;
                footnote.margin = new Margin(0, height, 0, 0);
            }
            this.isFootNoteLayoutStart = true;
            if (isCreated) {
                bodyWidget.page.footnoteWidget = footnote;
            }
            let body: BlockContainer = element.bodyWidget;
            this.viewer.updateClientArea(footnote, footnote.page);
            this.viewer.clientArea.y = clientArea.y;
            this.viewer.clientActiveArea.y = clientActiveArea.y;
            for (let i: number = 0; i < element.bodyWidget.childWidgets.length; i++) {
                let block: BlockWidget = element.bodyWidget.childWidgets[i] as BlockWidget;
                block.containerWidget = body;
                body.page = bodyWidget.page;
                body.sectionFormat = footnote.sectionFormat;
                block.containerWidget.containerWidget = footnote;
                this.viewer.updateClientAreaForBlock(block, true);
                if (block instanceof TableWidget) {
                    this.clearTableWidget(block, true, true);
                }
                this.layoutBlock(block, 0);
                height += block.height;
                block.y = 0;
                this.viewer.updateClientAreaForBlock(block, false);
                body.height += block.height;
            }
            if (footnote.sectionFormat.columns.length > 1 && !(footnote.bodyWidgets.length === 0 && body.childWidgets.length <= 1 && (body.childWidgets[0] as BlockWidget).childWidgets.length <= 1)) {
                height = (height / footnote.sectionFormat.numberOfColumns);
            }
            this.isFootNoteLayoutStart = false;
            isFitted = false;
            if (height >= clientActiveArea.height) {
                this.isfootMove = true;
            }
            if (positionchanged) {
                footnote.bodyWidgets.splice(insertIndex, 0, body);
            } else {
                footnote.bodyWidgets.push(body);
            }
            if (element.line.paragraph.isInsideTable) {
                let table: TableWidget = this.getParentTable(element.line.paragraph.associatedCell.ownerTable);
                if (isNullOrUndefined(table.footnoteElement)) {
                    table.footnoteElement = []
                }
                if (table.footnoteElement.indexOf(element) == -1) {
                    table.footnoteElement.push(element);
                    this.layoutedFootnoteElement.push(element);
                    let currentTable: TableWidget = (element.line.paragraph.containerWidget as TableCellWidget).ownerTable;
                    if (currentTable.footnoteElement.indexOf(element) == -1) {
                        currentTable.footnoteElement.push(element);
                    }
                }
            }
            footnote.height += height;
            isFitted = true;
            this.viewer.clientActiveArea = clientActiveArea;
            this.viewer.clientActiveArea.height -= height;
            this.footnoteHeight += height;
            this.viewer.clientArea = clientArea;
        }
        return isFitted;
    }
    private layoutEndNoteElement(): void {
        let totalPage: number = this.documentHelper.pages.length;
        if (this.documentHelper.endnoteCollection.length > 0) {
            let foot: FootnoteElementBox;
            let endNote: FootNoteWidget;
            let isCreated: boolean;
            let lastPage: Page = this.documentHelper.pages[totalPage - 1];
            let bodyWidget: BlockContainer = lastPage.bodyWidgets[0];
            let lastSection: BodyWidget = lastPage.bodyWidgets[lastPage.bodyWidgets.length - 1];
            if (this.viewer instanceof PageLayoutViewer && lastSection.sectionFormat.numberOfColumns > 1) {
                let firstSection = this.getBodyWidget(lastSection, true);
                this.splitBodyWidgetBasedOnColumn(firstSection);
            }
            for (let i: number = 0; i < this.documentHelper.endnoteCollection.length; i++) {
                foot = this.documentHelper.endnoteCollection[i];
                if (bodyWidget.page.endnoteWidget instanceof FootNoteWidget && bodyWidget.page.endnoteWidget.footNoteType === 'Endnote') {
                    endNote = bodyWidget.page.endnoteWidget as FootNoteWidget;
                } else {
                    isCreated = true;
                    endNote = new FootNoteWidget();
                    endNote.footNoteType = 'Endnote';
                    endNote.page = bodyWidget.page;
                }
                let body: BlockContainer = foot.bodyWidget;
                body.page = endNote.page;
                for (let j: number = 0; j < foot.bodyWidget.childWidgets.length; j++) {
                    let block: BlockWidget = foot.bodyWidget.childWidgets[j] as BlockWidget;
                    block.containerWidget = body;
                    block.containerWidget.containerWidget = endNote;
                }
                if (endNote.bodyWidgets.indexOf(body) === -1) {
                    body.index = endNote.bodyWidgets.length;
                    endNote.bodyWidgets.push(body);
                    body.sectionFormat = endNote.page.bodyWidgets[endNote.page.bodyWidgets.length - 1].sectionFormat;
                }
                if (isCreated) {
                    bodyWidget.page.endnoteWidget = endNote;
                }
            }
            this.layoutfootNote(endNote);
        }
    }
    public hasValidElement(paragraph: ParagraphWidget): boolean {
        let line: LineWidget = paragraph.firstChild as LineWidget;
        if (line) {
            let elementBox: ElementBox = line.children[0];
            while (elementBox) {
                if (elementBox instanceof FieldElementBox) {
                    elementBox = this.documentHelper.getNextValidElementForField(elementBox);
                    if (!isNullOrUndefined(elementBox) && !elementBox.line.paragraph.equals(paragraph)) {
                        return false;
                    }
                }
                if (elementBox instanceof TextElementBox || elementBox instanceof ImageElementBox) {
                    return true;
                }
                if (!isNullOrUndefined(elementBox)) {
                    elementBox = elementBox.nextNode;
                }
            }
        }
        return false;
    }
    private isConsiderAsEmptyLineWidget(lineWidget: LineWidget): boolean {
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let element: ElementBox = lineWidget.children[i];
            if (element instanceof ShapeBase && element.textWrappingStyle !== 'Inline') {
                continue;
            }
            if (element.width > 0) {
                return false;
            }
        }
        return true;
    }
    private updateFieldText(element: ElementBox): void {
        let text: string = this.documentHelper.getFieldResult((element as FieldTextElementBox).fieldBegin, element.paragraph.bodyWidget.page);
        if (text !== '') {
            (element as FieldTextElementBox).text = text;
            this.documentHelper.textHelper.getTextSize(element as TextElementBox, element.characterFormat);
        }
    }
    private checkLineWidgetWithClientArea(line: LineWidget, element: ElementBox): void {
        if (line !== element.line || element.line === line && isNullOrUndefined(element.nextElement)
            && !element.line.isLastLine()) {
            this.moveToNextLine(line);
            if (this.documentHelper.compatibilityMode !== 'Word2013' && this.isOverlapFloatTable) {
                let table: TableWidget;
                if(element.line.paragraph.previousRenderedWidget instanceof TableWidget && element.line.paragraph.previousRenderedWidget.wrapTextAround) {
                    table = element.line.paragraph.previousRenderedWidget;
                    this.viewer.clientActiveArea.x = this.viewer.clientActiveArea.x -
                    HelperMethods.convertPointToPixel(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
                }
                this.viewer.clientActiveArea.x += line.paragraph.leftIndent;
                this.isOverlapFloatTable = false;
            }
            if (line !== element.line) {
                this.isRTLLayout = false;
            }
        }
        if (element.line !== line && this.viewer instanceof PageLayoutViewer
            && this.viewer.clientActiveArea.height < element.height &&
            this.viewer.clientActiveArea.y !== this.viewer.clientArea.y) {
            this.moveToNextPage(this.viewer, element.line);
        } else if (element.line === line && isNullOrUndefined(element.nextElement)
            && line.paragraph.lastChild === line && !line.isLastLine() && this.viewer.clientActiveArea.height >= 0) {
            this.moveFromNextPage(line);
        }
    }
    private checkAndSplitTabOrLineBreakCharacter(text: string, element: TextElementBox): void {
        let char: string[] = ['\t', '\v', '\f'];
        let index: number = HelperMethods.indexOfAny(text, char) as number;
        if (index > -1) {
            let character: string = text[index];
            if ((character === '\t' && text !== '\t') || (character === '\v' && text !== '\v')
                || (character === '\f' && text !== '\f')) {
                this.splitByLineBreakOrTab(this.viewer, element, index, character);
            }
        }
    }

    private moveFromNextPage(line: LineWidget): void {
        const nextLine: LineWidget = line.nextLine;
        if (nextLine && line.paragraph.childWidgets.indexOf(nextLine) === -1) {
            let splittedParagraph: ParagraphWidget = nextLine.paragraph;
            nextLine.paragraph.childWidgets.splice(nextLine.indexInOwner, 1);
            line.paragraph.childWidgets.push(nextLine);
            nextLine.paragraph = line.paragraph;
            // this.updateLinearIndex(nextLine.paragraph);
            if (splittedParagraph.childWidgets.length === 0) {
                splittedParagraph.destroy();
            } else {
            //     this.updateLinearIndex(splittedParagraph);
            }
        }
    }
    private cutClientWidth(currentElement: ElementBox, isNeedToLayoutShape?: boolean, skipXPositionUpdate?: boolean): boolean {
        if(this.is2013Justification) {
            return false;
        }
        this.clearLineMeasures();
        const line: LineWidget = currentElement.line;
        line.marginTop = 0;
        let width: number = 0;
        for (let i: number = 0; i < line.children.length; i++) {
            const element: ElementBox = line.children[i];
            if (isNeedToLayoutShape && element instanceof ShapeElementBox && element.textWrappingStyle === 'Inline') {
                this.layoutShape(element);
            }
            width += element.width;
            if (currentElement === element) {
                break;
            }
        }
        const splitCurrentWidget: boolean = this.viewer.clientActiveArea.width - width < 0;
        const paragarph: ParagraphWidget = currentElement.line.paragraph;
        const bodyWidget: BlockContainer = paragarph.bodyWidget as BlockContainer;
        if (bodyWidget && bodyWidget.floatingElements.length > 0) {
            this.hasFloatingElement = true;
            if (!skipXPositionUpdate) {
                this.isXPositionUpdated = true;
            }
            return false;
        }
        if (!splitCurrentWidget) {
            this.viewer.cutFromLeft(this.viewer.clientActiveArea.x + width);
            if (currentElement.line.paragraph.paragraphFormat.textAlignment === 'Justify' &&
                currentElement instanceof TextElementBox) {
                this.splitTextElementWordByWord(currentElement as TextElementBox);
            }
            if (isNullOrUndefined(currentElement.nextElement) && this.viewer.clientActiveArea.width > 0
                && !currentElement.line.isLastLine()) {
                this.moveElementFromNextLine(line);
            }
        } else if (currentElement.previousElement) {
            this.cutClientWidth(currentElement.previousElement);
        }
        return splitCurrentWidget;
    }
    private layoutFieldCharacters(element: FieldElementBox): void {
        if (element.fieldType === 0) {
            if (!isNullOrUndefined(element.formFieldData) && this.isInitialLoad) {
                this.checkAndUpdateFieldData(element);
            }
            if (!this.isFieldCode && (!isNullOrUndefined(element.fieldEnd) || element.hasFieldEnd)) {
                if (this.documentHelper.fieldStacks.indexOf(element) === -1) {
                    this.documentHelper.fieldStacks.push(element);
                }
                if (this.isRelayout) {
                    let fieldCode: string = HelperMethods.trimEnd(this.documentHelper.selection.getFieldCode(element));
                    this.isIFfield = HelperMethods.startsWith(fieldCode, 'IF');
                }
                this.isFieldCode = true;
                element.hasFieldEnd = true;
            }
        } else if (this.documentHelper.fieldStacks.length > 0) {
            if (element.fieldType === 2) {
                const field: FieldElementBox = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                if (field.fieldSeparator === element && (!isNullOrUndefined(field.fieldEnd) || field.hasFieldEnd)) {
                    this.isFieldCode = false;
                }
            } else {
                const field: FieldElementBox = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                if (element === field.fieldEnd) {
                    this.documentHelper.fieldStacks.pop();
                    this.isFieldCode = false;
                    this.isIFfield = false;
                }
            }
        }
    }
    private checkAndUpdateFieldData(fieldBegin: FieldElementBox): void {
        if (fieldBegin.hasFieldEnd && !isNullOrUndefined(fieldBegin.fieldEnd)) {
            if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                const seperator: FieldElementBox = new FieldElementBox(2);
                seperator.fieldBegin = fieldBegin;
                seperator.fieldEnd = fieldBegin.fieldEnd;
                seperator.line = fieldBegin.line;
                fieldBegin.line.children.splice(fieldBegin.fieldEnd.indexInOwner, 0, seperator);
                fieldBegin.fieldSeparator = seperator;
                fieldBegin.fieldEnd.fieldSeparator = seperator;
            }
            const previousNode: ElementBox = fieldBegin.fieldEnd.previousNode;
            if (previousNode instanceof FieldElementBox && previousNode.fieldType === 2) {
                const formFieldData: FormField = fieldBegin.formFieldData;
                if (formFieldData instanceof CheckBoxFormField) {
                    const checkBoxTextElement: TextElementBox = new TextElementBox();
                    checkBoxTextElement.skipformFieldLength = true;
                    checkBoxTextElement.line = fieldBegin.line;
                    const index: number = fieldBegin.line.children.indexOf(fieldBegin.fieldEnd);
                    fieldBegin.line.children.splice(index, 0, checkBoxTextElement);
                    checkBoxTextElement.characterFormat.copyFormat(fieldBegin.characterFormat);
                    if (formFieldData.checked) {
                        checkBoxTextElement.text = String.fromCharCode(9745);
                    } else {
                        checkBoxTextElement.text = String.fromCharCode(9744);
                    }
                    this.setCheckBoxFontSize(formFieldData, checkBoxTextElement.characterFormat);
                } else if (formFieldData instanceof DropDownFormField) {
                    const dropDownTextElement: TextElementBox = new TextElementBox();
                    dropDownTextElement.characterFormat.copyFormat(fieldBegin.characterFormat);
                    dropDownTextElement.skipformFieldLength = true;
                    dropDownTextElement.line = fieldBegin.line;
                    if (formFieldData.dropdownItems.length > 0) {
                        dropDownTextElement.text = formFieldData.dropdownItems[formFieldData.selectedIndex];
                    } else {
                        dropDownTextElement.text = this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5);
                    }
                    const index: number = fieldBegin.line.children.indexOf(fieldBegin.fieldEnd);
                    fieldBegin.line.children.splice(index, 0, dropDownTextElement);
                }
            }
        }
    }
    /**
     * Set the checkbox font size
     * @returns {void}
     */
    public setCheckBoxFontSize(formFieldData: CheckBoxFormField, format: WCharacterFormat): void {
        if (formFieldData.sizeType !== 'Auto') {
            format.fontSize = formFieldData.size * CHECK_BOX_FACTOR;
        } else {
            format.fontSize = format.fontSize * CHECK_BOX_FACTOR;
        }
    }
    private layoutEmptyLineWidget(paragraph: ParagraphWidget, isEmptyLine: boolean, line?: LineWidget, isShiftEnter?: boolean): void {
        this.clearLineMeasures();
        const paraFormat: WParagraphFormat = paragraph.paragraphFormat;
        let subWidth: number = 0;
        let whiteSpaceCount: number = 0;
        isShiftEnter = isNullOrUndefined(isShiftEnter) ? false : isShiftEnter;
        let borders: WBorders = paraFormat.borders;
        let canRenderParagraphBorders: BorderRenderInfo = this.documentHelper.canRenderBorder(paragraph);
        //Calculate line height and descent based on formatting defined in paragraph.
        const paragraphMarkSize: TextSizeInfo = this.documentHelper.textHelper.getParagraphMarkSize(paragraph.characterFormat);
        let maxHeight: number = paragraphMarkSize.Height;
        let beforeSpacing: number = 0;
        let lineWidget: LineWidget;
        if (paragraph.childWidgets.length > 0 && !isShiftEnter) {
            this.isUpdateMarginForCurrentLine(line);
            lineWidget = paragraph.childWidgets[0] as LineWidget;
            if (lineWidget.children.length > 0) {
                if ((paraFormat.bidi || this.isContainsRtl(lineWidget))) {
                    this.shiftElementsForRTLLayouting(lineWidget, paraFormat.bidi)
                }
                const isParagraphStart: boolean = lineWidget.isFirstLine();
                const isParagraphEnd: boolean = lineWidget.isLastLine();
                let firstLineIndent: number = 0;
                if (isParagraphStart) {
                    beforeSpacing = this.getBeforeSpacing(paragraph);
                    firstLineIndent = HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
                }
                const textAlignment: TextAlignment = paraFormat.textAlignment;
                if (textAlignment !== 'Left' && this.viewer.textWrap
                    && (!(textAlignment === 'Justify' && isParagraphEnd)
                        || (textAlignment === 'Justify' && paraFormat.bidi))) {
                    const getWidthAndSpace: SubWidthInfo[] = this.getSubWidth(lineWidget, textAlignment === 'Justify', whiteSpaceCount, firstLineIndent, isParagraphEnd);
                    subWidth = getWidthAndSpace[0].subWidth;
                    whiteSpaceCount = getWidthAndSpace[0].spaceCount;
                }
            }
        } else {
            lineWidget = isEmptyLine ? this.addLineWidget(paragraph) : line;
        }
        if (lineWidget.isFirstLine()) {
           beforeSpacing = this.getBeforeSpacing(paragraph);
        }
        if (!isNullOrUndefined(paragraph.containerWidget) && paragraph.bodyWidget.floatingElements.length > 0 &&
            !(paragraph.containerWidget instanceof TextFrame) && !(paragraph.containerWidget instanceof TableCellWidget && paragraph.containerWidget.ownerTable.containerWidget instanceof TextFrame)) {
            let elementBox = new TextElementBox();
            elementBox.line = lineWidget;
            lineWidget.children.push(elementBox);
            elementBox.text = '¶';
            elementBox.characterFormat = paragraph.characterFormat;
            elementBox.width = this.documentHelper.textHelper.getTextSize(elementBox, elementBox.characterFormat);
            this.adjustPosition(elementBox, paragraph.bodyWidget);
            paragraph.x += elementBox.padding.left;
            if (elementBox.padding.left !== 0)
            {
                paragraph.textWrapWidth = true;
            }
            if (isEmptyLine) {
                this.checkInbetweenShapeOverlap(lineWidget);
            }
            lineWidget.children.splice(elementBox.indexInOwner, 1);
        }
        //isNullOrUndefined(this.viewer.currentHeaderFooter) &&
        if (this.viewer instanceof PageLayoutViewer
            && this.viewer.clientActiveArea.height < beforeSpacing + maxHeight
            && this.viewer.clientActiveArea.y !== this.viewer.clientArea.y
            && (!(lineWidget.isFirstLine() && isNullOrUndefined(lineWidget.paragraph.previousWidget))
                || lineWidget.isEndnoteLineWidget()) && !paragraph.isSectionBreak) {
            this.moveToNextPage(this.viewer, lineWidget);
        }
        //Gets line spacing.
        const lineSpacing: number = this.getLineSpacing(paragraph, maxHeight);
        //let maxDescent: number = maxHeight - paragraphMarkSize.BaselineOffset;
        //Calculate the bottom position of current line - max height + line spacing.
        if (!isNaN(this.maxTextHeight)
            && maxHeight < this.maxTextHeight) {
            maxHeight = this.maxTextHeight;
            //maxDescent = maxHeight - this.maxTextBaseline;
        }
        let topMargin: number = 0;
        let bottomMargin: number = 0;
        let leftMargin: number = 0;
        const height: number = maxHeight;
        const lineSpacingType: LineSpacingType = paragraph.paragraphFormat.lineSpacingType;
        if (lineSpacingType === 'Multiple') {
            if (lineSpacing > maxHeight) {
                bottomMargin += lineSpacing - maxHeight;
            } else {
                topMargin += lineSpacing - maxHeight;
            }
        } else if (lineSpacingType === 'Exactly') {
            topMargin += lineSpacing - (topMargin + height + bottomMargin);
        } else if (lineSpacing > topMargin + height + bottomMargin) {
            topMargin += lineSpacing - (topMargin + height + bottomMargin);
        }
        topMargin += beforeSpacing;
        bottomMargin += HelperMethods.convertPointToPixel(this.getAfterSpacing(paragraph));
        if (borders.top.lineStyle != 'None') {
            if (lineWidget.isFirstLine() && !canRenderParagraphBorders.skipTopBorder) {
                topMargin += HelperMethods.convertPointToPixel(borders.top.lineWidth + borders.top.space);
            }
        }
        if (borders.bottom.lineStyle != 'None') {
            if (lineWidget.isLastLine() && !canRenderParagraphBorders.skipBottomBorder) {
                bottomMargin += HelperMethods.convertPointToPixel(borders.bottom.lineWidth + borders.bottom.space);
            }
        }
        let renderedElements: ElementBox[] = lineWidget.renderedElements;
        for (let i: number = 0; i < renderedElements.length; i++) {
            const element: ElementBox = renderedElements[i];
            if (i === 0 && element instanceof ListTextElementBox || (paragraph.paragraphFormat.bidi && renderedElements[renderedElements.length - 1] instanceof ListTextElementBox)) {
                const textAlignment: TextAlignment = paragraph.paragraphFormat.textAlignment;
                if (textAlignment === 'Right') {  //Aligns the text as right justified.
                    leftMargin = subWidth;
                } else if (textAlignment === 'Center') { //Aligns the text as center justified.
                    leftMargin = subWidth / 2;
                }
                element.margin = new Margin(leftMargin, topMargin, 0, bottomMargin);
                element.line = lineWidget;
                lineWidget.height = topMargin + height + bottomMargin;
                break;
            }
        }
        lineWidget.margin = new Margin(0, topMargin, 0, bottomMargin);
        lineWidget.height = topMargin + height + bottomMargin;
        this.adjustPositionBasedOnTopAndBottom(lineWidget);
        if (isNullOrUndefined(paragraph.nextRenderedWidget) && paragraph.isInsideTable
            && paragraph.previousRenderedWidget instanceof TableWidget && paragraph.childWidgets.length == 1) {
            //Special behavior for empty cell mark after nested table, preserved with zero height by default.
            //Empty line is displayed in cell for the last empty paragraph (Cell mark - last paragraph in cell) after a nested table.
            lineWidget.height = 0;
        }
        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + lineWidget.height);
        this.wrapPosition = [];
        //Clears the previous line elements from collection.
    }

    private isUpdateMarginForCurrentLine(line: LineWidget): void {
        let isUpdate: boolean = true;
        if (!isNullOrUndefined(line) && !line.isFirstLine()) {
            for (let i = 0; i < line.children.length; i++) {
                if (!(line.children[i] instanceof EditRangeStartElementBox || line.children[i] instanceof EditRangeEndElementBox)) {
                    isUpdate = false;
                    break;
                }
            }
            if (isUpdate) {
                line.margin = new Margin(0, 0, 0, 0);
            }
        }
    }

    private adjustPositionBasedOnTopAndBottom(lineWidget: LineWidget): void {
        if (!isNullOrUndefined(lineWidget.paragraph.bodyWidget) && !isNullOrUndefined(lineWidget.paragraph.bodyWidget.page.headerWidget)
            && lineWidget.paragraph.bodyWidget.page.headerWidget.floatingElements.length > 0
            && lineWidget.paragraph === lineWidget.paragraph.bodyWidget.childWidgets[0] as ParagraphWidget
            && lineWidget.indexInOwner === 0) {
            //To check whether first para in the page overlaps with shape in Header.
            this.checkInbetweenShapeOverlap(lineWidget, lineWidget.paragraph.bodyWidget.page.headerWidget.floatingElements);
        }
    }

    private layoutListItems(paragraph: ParagraphWidget, isUpdatedList?: boolean): void {
        if (!this.isFieldCode) {
            if (!isNullOrUndefined(paragraph.paragraphFormat)
                && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)
                && !isNullOrUndefined(this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId)) &&
                paragraph.paragraphFormat.listFormat.listLevelNumber >= 0
                && paragraph.paragraphFormat.listFormat.listLevelNumber < 9 && !isUpdatedList) {
                this.clearListElementBox(paragraph);
                this.layoutList(paragraph, this.documentHelper);
            } else if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId === -1) {
                this.clearListElementBox(paragraph);
            }
        }
    }

    private layoutList(paragraph: ParagraphWidget, documentHelper: DocumentHelper): void {
        const list: WList = documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId);
        const listLevelNumber: number = paragraph.paragraphFormat.listFormat.listLevelNumber;
        const currentListLevel: WListLevel = this.getListLevel(list, listLevelNumber);
        if (isNullOrUndefined(currentListLevel) || isNullOrUndefined(currentListLevel.numberFormat)) {
            return;
        }
        let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
        if (isNullOrUndefined(lineWidget)) {
            lineWidget = new LineWidget(paragraph);
            paragraph.childWidgets.push(lineWidget);
        }
        let element: ListTextElementBox = new ListTextElementBox(currentListLevel, false);
        element.line = lineWidget;
        if (currentListLevel.listLevelPattern === 'Bullet') {
            element.text = currentListLevel.numberFormat;
            this.updateListValues(list, listLevelNumber);
        } else {
            element.text = this.getListNumber(paragraph.paragraphFormat.listFormat);
        }
        if(currentListLevel.numberFormat === '') {
            return;
        }
        this.viewer.updateClientWidth(-HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent));
        if (this.documentHelper.isIosDevice || this.documentHelper.isLinuxOS) {
            let text: string = element.text;
            text = text === String.fromCharCode(61623) ? String.fromCharCode(9679) : text === String.fromCharCode(61551) + String.fromCharCode(32) ? String.fromCharCode(9675) : text;
            if (text !== element.text) {
                element.text = text;
            }
        }
        documentHelper.textHelper.updateTextSize(element, paragraph);
        let moveToNextPage: boolean;
        if (this.viewer instanceof PageLayoutViewer
            && this.viewer.clientActiveArea.height < element.height && this.viewer.clientActiveArea.y !== this.viewer.clientArea.y) {
            moveToNextPage = true;
        }
        this.viewer.cutFromLeft(this.viewer.clientActiveArea.x + element.width);
        let previousElement: ElementBox = element;
        //Adds the text element to the line
        lineWidget.children.splice(0, 0, element);
        if (currentListLevel.followCharacter !== 'None') {
            element = new ListTextElementBox(currentListLevel, true);
            if (currentListLevel.followCharacter === 'Tab') {
                element.text = '\t';
                const index: number = lineWidget.children.indexOf(element);
                let tabWidth: number = this.getTabWidth(paragraph, this.viewer, index, lineWidget, element);
                documentHelper.textHelper.updateTextSize(element, paragraph);
                element.width = tabWidth;
            } else {
                element.text = ' ';
                documentHelper.textHelper.updateTextSize(element, paragraph);
            }
            this.viewer.cutFromLeft(this.viewer.clientActiveArea.x + element.width);
            //Adds the tabSpace to the line
            lineWidget.children.splice(1, 0, element);
            element.line = lineWidget;
        }
        if (!isNullOrUndefined(paragraph.containerWidget) && paragraph.bodyWidget.floatingElements.length > 0 &&
            !(previousElement instanceof ShapeElementBox) && !(paragraph.containerWidget instanceof TextFrame)) {
            this.adjustPosition(previousElement, previousElement.line.paragraph.bodyWidget);
            if ((previousElement instanceof ListTextElementBox) && previousElement.padding && previousElement.padding.left > 0 &&
                paragraph.paragraphFormat.firstLineIndent < 0) {
                previousElement.padding.left -= HelperMethods.convertPointToPixel(previousElement.line.paragraph.paragraphFormat.firstLineIndent);
            }
            if (this.isYPositionUpdated) {
                if (this.viewer.clientActiveArea.width > (previousElement.width + element.width)) {
                    this.viewer.clientActiveArea.width -= (previousElement.width + element.width);
                }
                this.isYPositionUpdated = false;
            }
        }
        if (moveToNextPage) {
            this.moveToNextPage(this.viewer, lineWidget, undefined, true);
            this.cutClientWidth(element);
            this.hasFloatingElement = false;
            this.isXPositionUpdated = false;
            return;
        }
        if (currentListLevel.followCharacter !== 'None') {
            this.viewer.updateClientWidth(HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent));
        }
    }

    private addBodyWidget(area: Rect, widget?: BodyWidget): BodyWidget {
        let bodyWidget: BodyWidget;
        if (widget) {
            bodyWidget = widget;
        } else {
            bodyWidget = new BodyWidget();
        }
        bodyWidget.width = area.width;
        bodyWidget.x = area.x;
        bodyWidget.y = area.y;
        // this.addSectionInDictionary(this.viewer, section, bodyWidget);
        return bodyWidget;
    }
    /**
     * @private
     */
    public addListLevels(abstractList: WAbstractList): void {
        for (let i: number = abstractList.levels.length; i < 9; i++) {
            const listLevel: WListLevel = new WListLevel(abstractList as WAbstractList);
            const val: number = i % 3;
            if ((abstractList.levels[0] as WListLevel).listLevelPattern === 'Bullet') {
                listLevel.listLevelPattern = 'Bullet';
                listLevel.numberFormat = val === 0 ? String.fromCharCode(61623) : val === 1 ? String.fromCharCode(61551) + String.fromCharCode(32) : String.fromCharCode(61607);
                listLevel.characterFormat.fontFamily = listLevel.numberFormat === String.fromCharCode(61607) ? 'Wingdings' : 'Symbol';

            } else {
                listLevel.listLevelPattern = this.getListLevelPattern(val);
                listLevel.numberFormat = '%' + (i + 1).toString() + '.';
                listLevel.startAt = 1;
                listLevel.restartLevel = i;
            }
            listLevel.paragraphFormat = new WParagraphFormat(undefined);
            listLevel.paragraphFormat.leftIndent = 48 * (i + 1);
            listLevel.paragraphFormat.firstLineIndent = -24;
            abstractList.levels.push(listLevel);
        }
    }
    private addSplittedLineWidget(lineWidget: LineWidget, elementIndex: number, splittedElementBox?: ElementBox): void {
        let index :number = elementIndex;
        if (this.isWrapText) {
            if (!isNullOrUndefined(splittedElementBox)) {
                lineWidget.children.splice(index + 1, 0, splittedElementBox);
                splittedElementBox.line = lineWidget;
            }
            return;
        }
        let columneBreak : boolean = false;
        const paragraph: ParagraphWidget = lineWidget.paragraph;
        const movedElementBox: ElementBox[] = [];
        const lineIndex: number = paragraph.childWidgets.indexOf(lineWidget);
        if (!isNullOrUndefined(splittedElementBox)) {
            movedElementBox.push(splittedElementBox);
        }
        let newLineWidget: LineWidget = undefined;
        let previousElement :ElementBox = lineWidget.children[index];
        if(previousElement instanceof CommentCharacterElementBox && previousElement.commentType === 0 && index != 0){
            index = index - 1;
        } else if(previousElement.isColumnBreak && isNullOrUndefined(previousElement.nextNode)) {
            columneBreak = true;
        }
        //Move Next element box to temp collection
        for (let i: number = index + 1; i < lineWidget.children.length; i++) {
            movedElementBox.push(lineWidget.children[i]);
        }
        if (movedElementBox.length > 0 || columneBreak) {
            if (lineIndex === paragraph.childWidgets.length - 1) {
                newLineWidget = new LineWidget(paragraph);
            } else {
                newLineWidget = paragraph.childWidgets[lineIndex + 1] as LineWidget;
            }
            for (let j: number = 0; j < movedElementBox.length; j++) {
                movedElementBox[j].line = newLineWidget;
            }
            if (movedElementBox.length > 0) {
                lineWidget.children.splice(index + 1, lineWidget.children.length - 1);
                if (!isNullOrUndefined(lineWidget.layoutedElements) && lineWidget.layoutedElements.length > 0) {
                    lineWidget.layoutedElements.splice(index + 1, lineWidget.layoutedElements.length - 1);
                }
                newLineWidget.children = movedElementBox.concat(newLineWidget.children);
            }
            if (paragraph.childWidgets.indexOf(newLineWidget) === -1) {
                paragraph.childWidgets.splice(lineIndex + 1, 0, newLineWidget);
            }
        }
    }

    private addElementToLine(paragraph: ParagraphWidget, element: ElementBox): void {
        if (!(element instanceof ShapeBase && element.textWrappingStyle !== 'Inline')) {
            if (this.isWrapText) {
                this.isWrapText = false;
                this.viewer.clientActiveArea.width = this.viewer.clientArea.right - this.viewer.clientActiveArea.x;
            }
            this.viewer.cutFromLeft(this.viewer.clientActiveArea.x + element.width);
        }
        if (paragraph.paragraphFormat.textAlignment === 'Justify' && element instanceof TextElementBox) {
            this.splitTextElementWordByWord(element as TextElementBox);
        }
        if (element instanceof ImageElementBox) {
            element.line.skipClipImage = !element.isInlineImage;
        }
    }

    private splitElementForClientArea(paragraph: ParagraphWidget, element: ElementBox): void {
        //const line: LineWidget = element.line;
        if (element.line.children.length > 0) {
            const previousElement: ElementBox = element.previousElement;
            let index: number = element.indexInOwner;
            // if line widget contain only single image element box need to skip this from splitting
            // else move element to next line
            if (element.line.children.length > 1) {
                if (previousElement && this.viewer.clientActiveArea.x !== this.viewer.clientArea.x) {
                    index -= 1;
                }
            }
            this.addSplittedLineWidget(element.line, index);
        }
    }

    private splitByWord(lineWidget: LineWidget, paragraph: ParagraphWidget, elementBox: TextElementBox, text: string, width: number, characterFormat: WCharacterFormat): void {
        let index: number = this.getSplitIndexByWord(this.viewer.clientActiveArea.width, text, width, characterFormat, elementBox.scriptType);
        if (index > 0 && index < elementBox.length) {
            let indexOf: number = lineWidget.children.indexOf(elementBox);
            //const lineIndex: number = paragraph.childWidgets.indexOf(lineWidget);
            const splittedElementBox: TextElementBox = new TextElementBox();
            text = text.substring(index);
            splittedElementBox.text = text;
            if (text[0] === ' ') {
                const prevLength: number = text.length;
                text = HelperMethods.trimStart(text);  //To trim white space at starting of the text.
                index += prevLength - text.length;
            }
            splittedElementBox.characterFormat.copyFormat(elementBox.characterFormat);
            splittedElementBox.width = this.documentHelper.textHelper.getWidth(splittedElementBox.text, characterFormat, splittedElementBox.scriptType); 
            if (splittedElementBox.text[splittedElementBox.text.length - 1] === ' ') {
                splittedElementBox.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(splittedElementBox.text), characterFormat, splittedElementBox.scriptType);
            } else {
                splittedElementBox.trimEndWidth = splittedElementBox.width;
            }
            splittedElementBox.characterRange = elementBox.characterRange;
            splittedElementBox.scriptType = elementBox.scriptType;
            //splittedElementBox.revisions = splittedElementBox.revisions;
            elementBox.text = elementBox.text.substr(0, index);
            if (elementBox.text !== ' ' && HelperMethods.endsWith(elementBox.text) && characterFormat.bidi 
                && elementBox.characterRange === CharacterRangeType.RightToLeft && !this.isWrapText) {
                const textElement: TextElementBox = this.spitTextElementByWhitespace(elementBox, characterFormat);
                indexOf = lineWidget.children.indexOf(textElement);
            }
            elementBox.width = this.documentHelper.textHelper.getWidth(elementBox.text, elementBox.characterFormat, elementBox.scriptType);
            if (elementBox.text[elementBox.text.length - 1] === ' ') {
                elementBox.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(elementBox.text), elementBox.characterFormat, elementBox.scriptType);
            } else {
                elementBox.trimEndWidth = elementBox.width;
            }
            if (elementBox.revisions.length > 0) {
                this.updateRevisionForSplittedElement(elementBox, splittedElementBox, true);
                splittedElementBox.isMarkedForRevision = elementBox.isMarkedForRevision;
            }
            splittedElementBox.height = elementBox.height;
            splittedElementBox.baselineOffset = elementBox.baselineOffset;
            this.splitErrorCollection(elementBox, splittedElementBox);
            this.addSplittedLineWidget(lineWidget, indexOf, splittedElementBox);
            this.addElementToLine(paragraph, elementBox);
            if (elementBox.width === 0) {
                lineWidget.children.splice(indexOf, 1);
            }
        }
    }
    private spitTextElementByWhitespace(textElement: TextElementBox, format: WCharacterFormat): TextElementBox {
        const lineWidget: LineWidget = textElement.line;
        const indexOf: number = lineWidget.children.indexOf(textElement);
        let text: string = textElement.text;
        const elementBox: TextElementBox = new TextElementBox();
        let index = text.length - 1;
        textElement.text = text.substring(0, index);
        elementBox.text = text.substring(index);
        elementBox.characterFormat.copyFormat(textElement.characterFormat);
        elementBox.line = lineWidget;
        elementBox.characterRange = CharacterRangeType.WordSplit;
        elementBox.scriptType = textElement.scriptType;
        elementBox.height = textElement.height;
        elementBox.baselineOffset = textElement.baselineOffset;
        elementBox.width = this.documentHelper.textHelper.getWidth(elementBox.text, format, elementBox.scriptType);
        lineWidget.children.splice(indexOf + 1, 0, elementBox);
        if (textElement.revisions.length > 0) {
            this.updateRevisionForSplittedElement(textElement, elementBox, index > 0, true);
            elementBox.isMarkedForRevision = textElement.isMarkedForRevision;
        }
        return elementBox;
    }

    private splitErrorCollection(elementBox: TextElementBox, splittedBox: TextElementBox): void {
        if (elementBox.errorCollection.length > 0) {
            const errorCollection: ErrorTextElementBox[] = [];
            const ignoreItems: string[] = elementBox.ignoreOnceItems;
            for (let i: number = 0; i < elementBox.errorCollection.length; i++) {
                errorCollection.push(elementBox.errorCollection[i]);
            }
            for (let j: number = 0; j < elementBox.errorCollection.length; j++) {
                const index: number = elementBox.text.indexOf(elementBox.errorCollection[j].text);
                const textElement: ErrorTextElementBox = elementBox.errorCollection[j];
                if (index < 0) {
                    errorCollection.splice(0, 1);
                    splittedBox.errorCollection.push(textElement);
                } else if (splittedBox.text.indexOf(textElement.text) > 0) {
                    splittedBox.errorCollection.push(textElement);
                }
            }
            splittedBox.ignoreOnceItems = ignoreItems;
            elementBox.ignoreOnceItems = [];
            elementBox.errorCollection = errorCollection;

        }
    }

    private splitByCharacter(lineWidget: LineWidget, textElement: TextElementBox, text: string, width: number, characterFormat: WCharacterFormat): void {
        const paragraph: ParagraphWidget = lineWidget.paragraph;
        let atleastSpacing: number = paragraph.paragraphFormat.lineSpacingType === 'AtLeast' ? paragraph.paragraphFormat.afterSpacing : 0;
        let index: number = this.getTextSplitIndexByCharacter(this.viewer.clientArea.width, this.viewer.clientActiveArea.width, text, width, characterFormat, textElement.scriptType);
        // if the index is zero, no need to split text by character. so, we can avoid the empty text element creation.
        if (index === 0 && textElement.previousNode instanceof ImageElementBox && textElement.previousNode.textWrappingType === "Right") {
            return;
        } else if (index === 0 && !isNullOrUndefined(textElement) && textElement.length > 0 && (Math.max(textElement.height, atleastSpacing) <= this.viewer.clientArea.height)
            && this.viewer.clientActiveArea.width === 0 && lineWidget.children.indexOf(textElement) === 0) {
            //Eventhough, there is zero remaining client area width and fit atleast one character of word in a line only if there is no item fitted in same line.
            index = 1;
        }
        let splitWidth: number = 0;
        if (index < textElement.length) {
            splitWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.substring(0, index), characterFormat, textElement.scriptType);
            text = text.substring(index);
        }
        if (splitWidth > this.viewer.clientActiveArea.width && textElement.indexInOwner > 0) {
            this.addSplittedLineWidget(lineWidget, textElement.indexInOwner - 1);
            return;
        }
        const indexOf: number = lineWidget.children.indexOf(textElement);
        if (index < textElement.length) {
            //const lineIndex: number = paragraph.childWidgets.indexOf(lineWidget);
            const splittedElement: TextElementBox = new TextElementBox();
            splittedElement.text = text;
            splittedElement.errorCollection = textElement.errorCollection;
            splittedElement.scriptType = textElement.scriptType;
            textElement.text = textElement.text.substr(0, index);
            splittedElement.characterFormat.copyFormat(textElement.characterFormat);
            splittedElement.width = this.documentHelper.textHelper.getWidth(splittedElement.text, characterFormat, splittedElement.scriptType);
            if (splittedElement.text[splittedElement.text.length - 1] === ' ') {
                splittedElement.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(splittedElement.text), characterFormat, splittedElement.scriptType);
            } else {
                splittedElement.trimEndWidth = splittedElement.width;
            }
            splittedElement.characterRange = textElement.characterRange;
            textElement.width = this.documentHelper.textHelper.getWidth(textElement.text, characterFormat, textElement.scriptType);
            if (textElement.text[textElement.text.length - 1] === ' ') {
                textElement.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(textElement.text), characterFormat, textElement.scriptType);
            } else {
                textElement.trimEndWidth = textElement.width;
            }
            splittedElement.height = textElement.height;
            splittedElement.baselineOffset = textElement.baselineOffset;
            lineWidget.children.splice(textElement.indexInOwner + 1, 0, splittedElement);
            if (textElement.revisions.length > 0) {
                this.updateRevisionForSplittedElement(textElement, splittedElement, index > 0);
                splittedElement.isMarkedForRevision = textElement.isMarkedForRevision;
            }
            this.addElementToLine(paragraph, textElement);
            this.addSplittedLineWidget(lineWidget, indexOf);
            if (textElement.width === 0) {
                lineWidget.children.splice(indexOf, 1);
            }
        } else {
            //Adds the last text element on inline to line elements collection
            this.addSplittedLineWidget(lineWidget, indexOf);
            this.addElementToLine(paragraph, textElement);
        }
    }
    private updateRevisionForSplittedElement(item: TextElementBox, splittedElement: TextElementBox, isSplitted: boolean, isJustify?: boolean): void {
        if (item.revisions.length > 0) {
            for (let i: number = 0; i < item.revisions.length; i++) {
                const currentRevision: Revision = item.revisions[i];
                if (isSplitted) {
                    splittedElement.revisions.push(currentRevision);
                    let rangeIndex: number = currentRevision.range.indexOf(item);
                    if (rangeIndex < 0) {
                        currentRevision.range.push(splittedElement);
                    } else {
                        if (isJustify) {
                            currentRevision.range.splice(rangeIndex, 0, splittedElement);
                        } else {
                            currentRevision.range.splice(rangeIndex + 1, 0, splittedElement);
                        }
                    }
                } else {
                    let rangeIndex: number = currentRevision.range.indexOf(item);
                    currentRevision.range.splice(rangeIndex, 1);
                    currentRevision.range.splice(rangeIndex, 0, splittedElement);
                    splittedElement.revisions.push(currentRevision);
                }
            }
        }
    }

    private splitTextElementWordByWord(textElement: TextElementBox): void {
        const lineWidget: LineWidget = textElement.line;
        let indexOf: number = lineWidget.children.indexOf(textElement);
        let startIndex: number = indexOf;
        let paddingLeft: number = textElement.padding.left;
        textElement.padding.left = 0;
        let text: string = textElement.text;
        let format: WCharacterFormat;
        const characterUptoWs: number = text.trim().indexOf(' ');
        if (characterUptoWs >= 0) {
            lineWidget.children.splice(indexOf, 1);
            format = textElement.characterFormat;
            //const fontSize: number = format.fontSize;
            let index: number = textElement.length - HelperMethods.trimStart(text).length;  //Trim start
            while (index < textElement.length) {
                index = this.getTextIndexAfterSpace(text, index);
                if (index === 0 || index === textElement.length) {
                    break;
                }
                if (index < textElement.length) {
                    const splittedElement: TextElementBox = new TextElementBox();
                    const splittedText: string = text.substring(0, index);
                    text = text.substring(index);
                    if (text.substring(0, 1) === ' ') {
                        // start of the text is trimmed and its length is reduced from text length.
                        index += text.length - HelperMethods.trimStart(text).length;
                    }
                    splittedElement.text = splittedText;
                    splittedElement.characterFormat.copyFormat(textElement.characterFormat);
                    splittedElement.line = lineWidget;
                    splittedElement.height = textElement.height;
                    splittedElement.baselineOffset = textElement.baselineOffset;
                    splittedElement.characterRange = textElement.characterRange;
                    splittedElement.scriptType = textElement.scriptType;
                    lineWidget.children.splice(indexOf, 0, splittedElement);
                    if (textElement.revisions.length > 0) {
                        this.updateRevisionForSplittedElement(textElement, splittedElement, index > 0, true);
                        splittedElement.isMarkedForRevision = textElement.isMarkedForRevision;
                    }
                    if (splittedElement.text !== ' ' && HelperMethods.endsWith(splittedElement.text) && format.bidi && splittedElement.characterRange === CharacterRangeType.RightToLeft) {
                        const elementBox: TextElementBox = this.spitTextElementByWhitespace(splittedElement, format);
                        indexOf = lineWidget.children.indexOf(elementBox);
                    }
                    splittedElement.width = this.documentHelper.textHelper.getWidth(splittedElement.text, format, splittedElement.scriptType);
                    if (splittedElement.text[splittedElement.text.length - 1] === ' ') {
                        splittedElement.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(splittedElement.text), format, splittedElement.scriptType);
                    } else {
                        splittedElement.trimEndWidth = splittedElement.width;
                    }
                    textElement.text = text;
                    textElement.width = this.documentHelper.textHelper.getWidth(textElement.text, textElement.characterFormat, textElement.scriptType);
                    if (textElement.text[textElement.text.length - 1] === ' ') {
                        textElement.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(textElement.text), textElement.characterFormat, textElement.scriptType);
                    } else {
                        textElement.trimEndWidth = textElement.width;
                    }
                    if (textElement.width === 0 && lineWidget.children.indexOf(textElement) !== -1) {
                        lineWidget.children.splice(lineWidget.children.indexOf(textElement), 1);
                    }
                    index = 0;
                    indexOf++;
                }
            }
            textElement.text = text;
            lineWidget.children.splice(indexOf, 0, textElement);
        }
        lineWidget.children[startIndex].padding.left = paddingLeft;
    }
    private isSplitByHyphen(element: TextElementBox, text: string): boolean {
        if (!isNullOrUndefined(element.previousElement)) {
            if (element.previousElement instanceof TextElementBox || element.previousElement instanceof ListTextElementBox) {
                let test: string = (element.previousElement as TextElementBox).text;
                return (text.substring(0, 1) === '-') && (test.substring(test.length - 1, test.length) !== ' ');
            }
        }
        return (text.substring(0, 1) === '-');
    }
    private splitTextForClientArea(lineWidget: LineWidget, element: TextElementBox, text: string, width: number, characterFormat: WCharacterFormat): void {
        const paragraph: ParagraphWidget = lineWidget.paragraph;
        let isSplitByWord: boolean = true;
        let index: number = -1;
        if (!(text.substring(0, 1) === ' ') && !this.isSplitByHyphen(element, text)) {
            let textWidth: number = width;
            let characterUptoWS: number = 0;
            characterUptoWS = HelperMethods.trimEnd(text).indexOf(' ') + 1;
            if (characterUptoWS == 0) {
                characterUptoWS = HelperMethods.trimEnd(text).indexOf('-') + 1;
            }
            index = characterUptoWS;
            //Checks whether text not starts with white space. If starts with white space, no need to check previous text blocks.
            if (index > 0) {
                textWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.slice(0, index), characterFormat, element.scriptType);
            }
            if (this.viewer.clientActiveArea.width < textWidth && !this.documentHelper.textHelper.isUnicodeText(text, element.scriptType)
                && !this.isWordFittedByJustification(element, textWidth)) {
                //Check and split the previous text elements to next line.
                isSplitByWord = this.checkPreviousElement(lineWidget, lineWidget.children.indexOf(element));
                if (isSplitByWord) {
                    //lineWidget = paragraph.childWidgets[paragraph.childWidgets.indexOf(lineWidget) + 1] as LineWidget;
                    //isSplitByWord = textWidth <= this.viewer.clientActiveArea.width;
                    return;
                }
            }
        } else {
            index = 1;
        }
        let isSplitWordByWord: boolean = true;
        if (this.documentHelper.textHelper.isUnicodeText(text, element.scriptType) && element.scriptType === 3 && text.length - 1 === text.indexOf(' ')) {
            isSplitWordByWord = false;
        }
        if (width <= this.viewer.clientActiveArea.width) {
            //Fits the text in current line.
            this.addElementToLine(paragraph, element);
        } else if (isSplitByWord && (index > 0 || (text.indexOf(' ') !== -1 && isSplitWordByWord) || text.indexOf('-') !== -1) ) {
            this.splitByWord(lineWidget, paragraph, element, text, width, characterFormat);
        } else {
            this.splitByCharacter(lineWidget, element, text, width, characterFormat);
        }
    }

    private splitByLineBreakOrTab(viewer: LayoutViewer, span: TextElementBox, index: number, spiltBy: string): void {
        // Splits tab character to separate SpanAdv
        const inlineIndex: number = span.line.children.indexOf(span);
        const value: string = span.text;
        const remainder: string = value.substring(index);
        const newSpan: TabElementBox | TextElementBox = spiltBy === '\t' ? new TabElementBox() : new TextElementBox();
        newSpan.line = span.line;
        this.updateRevisionForSplittedElement(span,newSpan,true);
        newSpan.characterFormat.copyFormat(span.characterFormat);
        newSpan.characterRange = span.characterRange;
        span.line.children.splice(inlineIndex + 1, 0, newSpan);
        span.isWidthUpdated = false;
        if (index > 0 && remainder.length === 1) {
            newSpan.text = value.substring(index);
            span.text = value.substring(0, index);
        } else if (index > 0) {
            newSpan.text = spiltBy;
            const newText: TextElementBox = new TextElementBox();
            newText.line = span.line;
            newText.text = value.substring(index + 1);
            this.updateRevisionForSplittedElement(span,newText,true);
            newText.characterFormat.copyFormat(span.characterFormat);
            newText.characterRange = span.characterRange;
            span.line.children.splice(inlineIndex + 2, 0, newText);
            span.text = value.substring(0, index);
        } else if (remainder !== '') {
            newSpan.text = value.substring(index + 1);
            span.text = spiltBy;
        }
    }
    /* eslint-disable  */
    private moveToNextLine(line: LineWidget, isMultiColumnSplit?: boolean, index?: number): void {
        let paragraph: ParagraphWidget = line.paragraph;
        let paraFormat: WParagraphFormat = paragraph.paragraphFormat;
        let isParagraphStart: boolean = line.isFirstLine();
        let isParagraphEnd: boolean = line.isLastLine();
        let height: number = 0;
        let maxDescent: number = 0;
        let afterSpacing: number = 0;
        let beforeSpacing: number = 0;
        let lineSpacing: number = 0;
        let firstLineIndent: number = 0;
        let borders: WBorders = paraFormat.borders;
        this.updateLineWidget(line);
        height = this.maxTextHeight;
        maxDescent = height - this.maxTextBaseline;
        let pageIndex: number = 0;
        let skip2013Justification: boolean = false;
        let canRenderParagraphBorders: BorderRenderInfo = this.documentHelper.canRenderBorder(paragraph);
        if (paragraph.bodyWidget && !(paragraph.bodyWidget instanceof HeaderFooterWidget)) {
            pageIndex = this.documentHelper.pages.indexOf(paragraph.bodyWidget.page);
        }
        //Updates before spacing at the top of Paragraph first line.
        if (isParagraphStart) {
            beforeSpacing = this.getBeforeSpacing(paragraph, pageIndex);
            firstLineIndent = HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        //Updates after spacing at the bottom of Paragraph last line.
        if (isParagraphEnd) {
            afterSpacing = HelperMethods.convertPointToPixel(this.getAfterSpacing(paragraph));
        }

        if ((paraFormat.bidi || this.isContainsRtl(line))) {
            this.shiftElementsForRTLLayouting(line, paraFormat.bidi)
            // this.reArrangeElementsForRtl(line, paraFormat.bidi);
            this.isRTLLayout = true;
        }

        if (isNaN(this.maxTextHeight)) {
            //Calculate line height and descent based on formatting defined in paragraph.
            let measurement: TextSizeInfo = this.documentHelper.textHelper.measureText('a', paragraph.characterFormat);
            height = measurement.Height;
            maxDescent = height - measurement.BaselineOffset;
        } else {
            height = this.maxTextHeight;
            maxDescent = height - this.maxTextBaseline;
        }
        // Gets line spacing.
        lineSpacing = this.getLineSpacing(paragraph, height);
        if ((line.skipClipImage || paragraph.paragraphFormat.lineSpacing >= 14 || lineSpacing < 0) && paraFormat.lineSpacingType === 'Exactly'
            && lineSpacing < maxDescent + this.maxBaseline) {
            lineSpacing = maxDescent + this.maxBaseline;
        }
        let subWidth: number = 0;
        let whiteSpaceCount: number = 0;
        let getWidthAndSpace: SubWidthInfo[];
        let textAlignment: TextAlignment = paraFormat.textAlignment;
        let totalSpaceCount: number = 0;
        let trimmedSpaceWidth : number = 0;
        // calculates the sub width, for text alignments - Center, Right, Justify.
        // if the element is paragraph end and para bidi is true and text alignment is justify
        // we need to calculate subwidth and add it to the left margin of the element.
        if (textAlignment !== 'Left' && this.viewer.textWrap && (!(textAlignment === 'Justify' && isParagraphEnd)
            || (textAlignment === 'Justify' && paraFormat.bidi) || (this.is2013Justification && isParagraphEnd))) {
            getWidthAndSpace = this.getSubWidth(line, textAlignment === 'Justify', whiteSpaceCount, firstLineIndent, isParagraphEnd);
            subWidth = getWidthAndSpace[0].subWidth;
            whiteSpaceCount = getWidthAndSpace[0].spaceCount;
            totalSpaceCount = getWidthAndSpace[0].totalSpaceCount;
            trimmedSpaceWidth = getWidthAndSpace[0].trimmedSpaceWidth;
            skip2013Justification = line.isEndsWithPageBreak || line.isEndsWithColumnBreak || line.isEndsWithLineBreak || line.paragraph.bidi || this.isRTLLayout;
        }
        if (!skip2013Justification && (getWidthAndSpace && getWidthAndSpace.length === 1) && this.viewer.clientActiveArea.width > 0 &&
            !isParagraphEnd && !this.is2013Justification && textAlignment === 'Justify' && this.documentHelper.compatibilityMode === 'Word2013') {
            let availableWidth: number = this.viewer.clientActiveArea.width;
            let totalSpaceWidth: number = this.getTotalSpaceWidth(line);
            let averageWidthOfSpace: number = totalSpaceWidth / totalSpaceCount;
            let avgAvailableLineWidthForSpace: number = (availableWidth) / totalSpaceCount;
            let diffFactor: number = (avgAvailableLineWidthForSpace / averageWidthOfSpace) * 100;
            let widthForAdjustment: number = 0;
            if (diffFactor <= 33) {
                widthForAdjustment = totalSpaceWidth / 8;
            } else {
                widthForAdjustment = totalSpaceWidth / 4;
            }
            this.viewer.clientActiveArea.x -= widthForAdjustment;
            this.viewer.clientActiveArea.width += widthForAdjustment;
            this.is2013Justification = true;
            if (isMultiColumnSplit) {
                this.splitParagraphForMultiColumn(line, index);
            } else {
                this.moveElementFromNextLine(line);
                this.nextElementToLayout = line.children[line.children.length - 1];
            }
            return;
        } else {
            if (this.is2013Justification && isParagraphEnd) {
                if (subWidth > 0) {
                    subWidth = 0;
                    whiteSpaceCount = 0;
                }
            }
            this.is2013Justification = false;
            this.nextElementToLayout = undefined;
        }
        let addSubWidth: boolean = false;
        let wrapIndex: number = 0;
        let lineSpacingType: LineSpacingType = paraFormat.lineSpacingType;
        let isStarted: boolean = false;
        let children: ElementBox[] = line.renderedElements;
        let maxElementHeight = 0;
        let maxElementBottomMargin = 0;
        let maxElementTopMargin = 0;
        let elementLeft: number = this.viewer.clientArea.x;
        for (let i: number = 0; i < children.length; i++) {
            let topMargin: number = 0;
            let bottomMargin: number = 0;
            let leftMargin: number = 0;
            let elementBox: ElementBox = children[i];
            if (!isNullOrUndefined(getWidthAndSpace) && isStarted && elementBox.padding.left > 0 &&
                (getWidthAndSpace.length > wrapIndex + 1)) {
                let previousWidth: number = subWidth;
                if (textAlignment === "Justify") {
                    previousWidth = subWidth * getWidthAndSpace[wrapIndex].spaceCount;
                } else if (textAlignment === "Center") {
                    previousWidth = subWidth / 2
                }
                elementBox.padding.left = elementBox.padding.left - previousWidth;
                let subWidthInfo: SubWidthInfo = getWidthAndSpace[++wrapIndex];
                subWidth = subWidthInfo.subWidth;
                whiteSpaceCount = subWidthInfo.spaceCount;
            }
            if (elementBox instanceof ShapeBase && elementBox.textWrappingStyle !== 'Inline') {
                continue;
            }
            isStarted = true;
            let alignElements: LineElementInfo = this.alignLineElements(elementBox, topMargin, bottomMargin, maxDescent, addSubWidth, subWidth, textAlignment, whiteSpaceCount, i === children.length - 1);
            if (textAlignment === "Justify" && elementBox instanceof ShapeBase && elementBox.textWrappingStyle === 'Inline' && subWidth !== 0) {
                elementBox.x = elementLeft;
                if (elementBox instanceof ShapeElementBox) {
                    for (let i = 0; i < elementBox.textFrame.childWidgets.length; i++) {
                        const widget: BlockWidget = elementBox.textFrame.childWidgets[i] as BlockWidget;
                        let indent: number = widget.bidi ? widget.rightIndent : widget.leftIndent;
                        widget.x = elementLeft + HelperMethods.convertPointToPixel(indent + elementBox.textFrame.marginLeft);
                    }
                }
            }
            elementLeft += elementBox.width;
            line.maxBaseLine = this.maxBaseline;
            topMargin = alignElements.topMargin;
            bottomMargin = alignElements.bottomMargin;
            addSubWidth = alignElements.addSubWidth;
            whiteSpaceCount = alignElements.whiteSpaceCount;
            //Updates line spacing, paragraph after/ before spacing and aligns the text to base line offset.
            if (lineSpacingType === 'Multiple') {
                if (lineSpacing > height) {
                    bottomMargin += lineSpacing - height;
                } else {
                    topMargin += lineSpacing - height;
                }
            } else if (lineSpacingType === 'Exactly') {
                topMargin += lineSpacing - (topMargin + elementBox.height + bottomMargin);
            } else if (lineSpacing > topMargin + elementBox.height + bottomMargin) {
                topMargin += lineSpacing - (topMargin + elementBox.height + bottomMargin);
            }
            if (pageIndex > 0 && paragraph === paragraph.bodyWidget.childWidgets[0] && this.documentHelper.pages[pageIndex].sectionIndex === this.documentHelper.pages[pageIndex - 1].sectionIndex) {
                topMargin += 0;
            } else {
                topMargin += beforeSpacing;
            }
            if (borders.top.lineStyle != 'None') {
                if (line.isFirstLine() && !canRenderParagraphBorders.skipTopBorder) {
                    topMargin += HelperMethods.convertPointToPixel(borders.top.lineWidth + borders.top.space);
                }
            }
            if (borders.bottom.lineStyle != 'None') {
                if (line.isLastLine() && !canRenderParagraphBorders.skipBottomBorder) {
                    bottomMargin += HelperMethods.convertPointToPixel(borders.bottom.lineWidth + borders.bottom.space);
                }
            }
            bottomMargin += afterSpacing;
            let previousElement: ElementBox = i > 0 ? children[i - 1] as ElementBox: undefined;
            if (i === 0 || (!(elementBox instanceof ShapeBase && elementBox.textWrappingStyle !== 'Inline') &&
                previousElement instanceof ShapeBase &&  previousElement.textWrappingStyle !== 'Inline' && previousElement.indexInOwner < elementBox.indexInOwner)
                || elementBox.padding.left > 0) {
                line.height = topMargin + elementBox.height + bottomMargin;
                if (textAlignment === 'Right' || (textAlignment === 'Justify' && paraFormat.bidi && (isParagraphEnd || trimmedSpaceWidth < 0))) {
                    //Aligns the text as right justified and consider subwidth for bidirectional paragrph with justify.
                    if(trimmedSpaceWidth < 0) {
                        leftMargin = trimmedSpaceWidth;
                    } else {
                        leftMargin = subWidth;
                    }
                } else if (textAlignment === 'Center') {
                    //Aligns the text as center justified.
                    if (subWidth < 0) {
                        leftMargin = subWidth;
                    } else {
                        leftMargin = subWidth / 2;
                    }
                } 
            }
            elementBox.margin = new Margin(leftMargin, topMargin, 0, bottomMargin);
            elementBox.line = line;
            if (maxElementHeight < elementBox.height) {
                maxElementHeight = elementBox.height;
                maxElementBottomMargin = elementBox.margin.bottom;
                maxElementTopMargin = elementBox.margin.top;
            }
            if (elementBox instanceof ShapeElementBox && elementBox.textWrappingStyle === "Inline") {
                if (i !== 0 || elementBox.margin.left > 0) {
                    let elementLeftMargin: number = children[0].margin.left;
                    elementBox.x += elementLeftMargin;
                    for (let i: number = 0; i < elementBox.textFrame.childWidgets.length; i++) {
                        let widget: BlockWidget = elementBox.textFrame.childWidgets[i] as BlockWidget;
                        if (widget instanceof TableWidget) {
                            widget.updateChildWidgetLeft(widget.x + elementLeftMargin);
                        } else {
                            (widget as Widget).x += elementLeftMargin;
                        }
                    }
                }
                this.updateShapeYPosition(elementBox);
            }
        }
        line.margin = new Margin(0, maxElementTopMargin, 0, maxElementBottomMargin);
        this.adjustPositionBasedOnTopAndBottom(line);
        this.checkInbetweenShapeOverlap(line);
        if (!isMultiColumnSplit && line.isLastLine() && line.indexInOwner === 0 && line.paragraph.paragraphFormat.widowControl) {
            let previousSplitWidget: ParagraphWidget = line.paragraph.previousSplitWidget as ParagraphWidget;
            if (!isNullOrUndefined(previousSplitWidget) && !previousSplitWidget.isEndsWithPageBreak && !previousSplitWidget.isEndsWithColumnBreak && previousSplitWidget.indexInOwner !== 0) {
                let startLineIndex: number = previousSplitWidget.childWidgets.length - 1;
                if (previousSplitWidget.childWidgets.length === 2) {
                    startLineIndex = 0;
                }
                this.splitParagraph(previousSplitWidget, startLineIndex, line.paragraph);
                this.updateClientAreaForNextBlock(line, line.paragraph);
            }
        } else if (isMultiColumnSplit) {
            this.splitParagraphForMultiColumn(line, index);
        }
        if (!isMultiColumnSplit) {
            this.viewer.cutFromTop(this.viewer.clientActiveArea.y + line.height);
        }
        this.wrapPosition = [];
    }

    private updateShapeYPosition(elementBox: ShapeElementBox): void {
        if (elementBox.margin.top > 0) {
            elementBox.y += elementBox.margin.top;
            for (let j: number = 0; j < elementBox.textFrame.childWidgets.length; j++) {
                (elementBox.textFrame.childWidgets[j] as Widget).y += elementBox.margin.top;
            }
        }
    }

    public getBodyWidget(section: BodyWidget, isFirstBody: boolean): BodyWidget {
        if (isFirstBody) {
            while (section && section.columnIndex !== 0) {
                section = section.previousRenderedWidget as BodyWidget;
            }
        } else {
            while (section) {
                if (isNullOrUndefined(section.nextRenderedWidget) || section.columnIndex === section.sectionFormat.numberOfColumns - 1 || section.index !== section.nextRenderedWidget.index) {
                    break;
                }
                section = section.nextRenderedWidget as BodyWidget;
            }
        } return section;
    }

    private splitParagraphForMultiColumn(line: LineWidget, index: number): void {
        this.splitParagraph(line.paragraph, index, undefined);
        if ((isNullOrUndefined(line.paragraph.previousRenderedWidget) && index == 0) ||
            (!isNullOrUndefined(line.paragraph.previousRenderedWidget) && (line.paragraph.previousRenderedWidget as ParagraphWidget).bodyWidget.sectionIndex !== line.paragraph.bodyWidget.sectionIndex)) {
            this.moveBlocksToNextPage(line.paragraph as BlockWidget);
        } else {
            this.moveBlocksToNextPage(line.paragraph.previousRenderedWidget as BlockWidget);
        }
        let clientHeight: number = this.viewer.clientActiveArea.height;
        this.viewer.updateClientArea(line.paragraph.bodyWidget, line.paragraph.bodyWidget.page);
        this.viewer.clientActiveArea.y = line.paragraph.bodyWidget.y;
        this.viewer.clientActiveArea.height = clientHeight;
        if (line.paragraph.bodyWidget.sectionFormat.equalWidth || line.paragraph.bodyWidget.sectionFormat.numberOfColumns - 1 === line.paragraph.bodyWidget.columnIndex) {
            let parawidget: ParagraphWidget = line.paragraph;
            this.documentHelper.blockToShift = parawidget;
            this.shiftLayoutedItems(false, true);
        }
    }
    //Checks Inbetween Overlap & Updates Line marginTop
    private checkInbetweenShapeOverlap(line: LineWidget, floatingElements?: (ShapeBase | TableWidget)[]): void {
        if (!(line.paragraph.containerWidget instanceof TextFrame) && line.paragraph.bodyWidget) {
            let overlapShape: ShapeBase;
            let lineY: number = this.getLineY(line);
            let isInsideTable: boolean = line.paragraph.isInsideTable;
            let emptyParaPosition: number = line.paragraph.y;
            let isFloatingElementPresent: boolean = true;
            if (isNullOrUndefined(floatingElements)) {
                isFloatingElementPresent = false;
                floatingElements = line.paragraph.bodyWidget.floatingElements;
            }
            /* eslint:disable */
            floatingElements.sort(function (a, b) { return a.y - b.y; });
            floatingElements.forEach((shape: ShapeBase) => {
                if (isInsideTable && shape.line && !shape.line.paragraph.isInsideTable || isNullOrUndefined(shape.line)) {
                    return
                }
                let lineRect: Rect;
                if (shape.textWrappingStyle === 'TopAndBottom' && shape instanceof ImageElementBox && !line.paragraph.isEmpty()) {
                    lineRect = new Rect(line.paragraph.x, this.viewer.clientActiveArea.y, line.paragraph.width, line.children[0].height);
                } else {
                    lineRect = new Rect(line.paragraph.x, this.viewer.clientActiveArea.y, line.paragraph.width, line.height);
                } 
                let shapeRect: Rect = new Rect(shape.x, shape.y - shape.distanceTop, shape.width, shape.height);
                if (shape.line && this.isRelayout && !this.isRelayoutOverlap && this.viewer.documentHelper.selection.isExistAfter(shape.line.paragraph, line.paragraph)
                    || this.isRelayout && this.isRelayoutOverlap && this.viewer.documentHelper.selection.isExistAfter(shape.line.paragraph, this.endOverlapWidget)) {
                    return;
                }
                let considerShape: boolean = (shape.textWrappingStyle === 'TopAndBottom');
                let updatedFloatPosition: number = ((shape.y + shape.height + shape.distanceBottom) - lineY);
                if (overlapShape && considerShape &&
                    overlapShape.y + overlapShape.height + overlapShape.distanceBottom + line.height > shape.y - shape.distanceTop &&
                    overlapShape.y - overlapShape.distanceTop < shape.y - shape.distanceTop &&
                    shape.y + shape.height + shape.distanceBottom > overlapShape.y + overlapShape.height + overlapShape.distanceBottom) {
                    overlapShape = shape;
                    if (line.paragraph.isEmpty() && isFloatingElementPresent) {
                        line.paragraph.y = emptyParaPosition;
                        line.paragraph.y += updatedFloatPosition;
                    } else {
                        line.marginTop = updatedFloatPosition;
                    }
                } else if (considerShape && !overlapShape && lineRect.isIntersecting(shapeRect)) {
                    overlapShape = shape;
                    if (line.paragraph.isEmpty() && isFloatingElementPresent) {
                        line.paragraph.y += updatedFloatPosition;
                    } else {
                        line.marginTop = updatedFloatPosition;
                    }
                }
            });
            if (overlapShape) {
                this.viewer.cutFromTop(overlapShape.y + overlapShape.height + overlapShape.distanceBottom);
            } else if (this.isRelayoutOverlap) {
                line.marginTop = 0;
            }
        }
    }
    private getLineY(line: LineWidget): number {
        let para: ParagraphWidget = line.paragraph;
        let lineY: number = para.y;
        if (!para.isEmpty()) {
            let lineWidget: LineWidget = para.firstChild as LineWidget;
            while (lineWidget !== line) {
                lineY = lineY + lineWidget.height + lineWidget.marginTop;
                lineWidget = lineWidget.nextLine;
            }
        }
        return lineY;
    }
    private updateLineWidget(line: LineWidget): void {
        let spaceHeight: number = 0;
        let spaceBaseline: number = 0;
        let isContainsImage: boolean = false;
        let isFieldCode: boolean = false;
        for (let i: number = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i];
            if (element instanceof FieldElementBox && element.fieldType === 2) {
                isFieldCode = false;
            }
            if (isFieldCode) {
                continue;
            }
            if (element instanceof FieldElementBox && element.fieldType === 0) {
                isFieldCode = true;
            }
            if (element instanceof ShapeBase && element.textWrappingStyle !== 'Inline') {
                continue;
            }
            if (element instanceof TextElementBox && element.text.replace(/\s+/g, '').length === 0 && element.text !== String.fromCharCode(160)) {
                if (spaceHeight < element.height) {
                    spaceHeight = element.height;
                    spaceBaseline = element.baselineOffset;
                }
                continue;
            }
            if (element instanceof TextElementBox || element instanceof ListTextElementBox) {
                let elementHeight: number = element.height;
                let baselineOffset: number = element.baselineOffset;
                let isCellContentControl: boolean = false;
                //We have increased the checkbox form field font size using a constant factor `CHECK_BOX_FACTOR`
                //To match the MS Word check box rendering size.
                //Due to it line height also get increased. So, handled adjusting height while updating line height.
                if (element instanceof TextElementBox && element.isCheckBoxElement && !isNullOrUndefined(element.previousNode) && element.previousNode instanceof ContentControl && (element.previousNode.contentControlWidgetType === 'Cell' || element.previousNode.contentControlWidgetType === 'Inline')) {
                    isCellContentControl = true;
                }
                if (element instanceof TextElementBox && element.isCheckBoxElement && !isCellContentControl) {
                    elementHeight = elementHeight / CHECK_BOX_FACTOR;
                    baselineOffset = baselineOffset / CHECK_BOX_FACTOR;
                }
                if (this.maxTextHeight < elementHeight) {
                    this.maxTextHeight = elementHeight;
                    this.maxTextBaseline = baselineOffset;
                }
                if (this.maxBaseline < this.maxTextBaseline) {
                    this.maxBaseline = this.maxTextBaseline;
                }
            } else if (this.maxBaseline < element.height) {
                this.maxBaseline = element.height;
                if(element instanceof ImageElementBox) {
                    isContainsImage = true;
                }
            }
        }
        if (this.maxTextHeight === 0 && spaceHeight !== 0) {
            if (isContainsImage) {
                this.maxTextHeight = 0;
                this.maxTextBaseline = 0;
            } else {
                if (line.isLastLine() && this.documentHelper.selection) {
                    let paragraphMarkSize: SizeInfo = this.documentHelper.selection.getParagraphMarkSize(line.paragraph, 0, 0);
                    this.maxTextHeight = paragraphMarkSize.height;
                    this.maxTextBaseline = spaceBaseline;
                } else {
                    this.maxTextHeight = spaceHeight;
                    this.maxTextBaseline = spaceBaseline;
                }
                if (this.maxBaseline < this.maxTextBaseline) {
                    this.maxBaseline = this.maxTextBaseline;
                }
            }
        }
    }
    /**
     * @private
     */
    public reLayoutEndnote(): void {
        const lastPage = this.documentHelper.pages[this.documentHelper.pages.length - 1];
        if (!isNullOrUndefined(lastPage) && !isNullOrUndefined(lastPage.endnoteWidget)) {
            let clientActiveArea: Rect = this.viewer.clientActiveArea.clone();
            const bodyWidget: BodyWidget = this.getBodyWidget(lastPage.bodyWidgets[lastPage.bodyWidgets.length - 1], true);
            this.viewer.updateClientArea(bodyWidget, bodyWidget.page);
            const height: number = this.getNextWidgetHeight(bodyWidget);
            if (height > 0) {
                this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                this.viewer.clientActiveArea.y = height;
            }
            this.layoutfootNote(lastPage.endnoteWidget);
            this.viewer.clientActiveArea = clientActiveArea;
        }
    }
    private moveEndnoteToNextPage(endnote: FootNoteWidget, bodyWidget: BodyWidget, isMoveEntireEndnote?: boolean, currentBodyIndex?: number): void {
        if (isMoveEntireEndnote) {
            let newBodyWidget: BodyWidget = this.createSplitBody(bodyWidget);
            const nextPage: Page = this.viewer.createNewPage(newBodyWidget);
            this.viewer.updateClientArea(newBodyWidget, newBodyWidget.page);
            newBodyWidget.y = bodyWidget.y = this.viewer.clientActiveArea.y;
            for (let i: number = 0; i < endnote.bodyWidgets.length; i++) {
                endnote.bodyWidgets[i].page = nextPage;
                endnote.bodyWidgets[i].containerWidget = endnote;
            }
            endnote.page.endnoteWidget = undefined;
            nextPage.endnoteWidget = endnote;
            endnote.page = nextPage;
        } else {
            let page: Page = bodyWidget.page;
            // if the page doesn't have a endNoteWidget, we create endNote, move the endnote to next page.
            if (isNullOrUndefined(page.endnoteWidget)) {
                let newEndnote: FootNoteWidget = new FootNoteWidget();
                newEndnote.footNoteType = 'Endnote';
                newEndnote.page = page;
                newEndnote.bodyWidgets.push(bodyWidget);
                bodyWidget.containerWidget = newEndnote;
                for (let i: number = currentBodyIndex + 1; i < endnote.bodyWidgets.length; i++) {
                    let currentBodyWidget: BodyWidget = endnote.bodyWidgets[i];
                    endnote.bodyWidgets.splice(i, 1);
                    newEndnote.bodyWidgets.push(currentBodyWidget);
                    currentBodyWidget.containerWidget = newEndnote;
                    currentBodyWidget.page = page;
                    i--;
                }
                page.endnoteWidget = newEndnote;
            }
            // if the page has a endNoteWidget, we move the endnote to next page.
            else {
                if (page.endnoteWidget.bodyWidgets.indexOf(bodyWidget) === -1) {
                    page.endnoteWidget.bodyWidgets.splice(0, 0, bodyWidget);
                    bodyWidget.containerWidget = page.endnoteWidget;
                }
                for (let i: number = endnote.bodyWidgets.length - 1; i > currentBodyIndex; i--) {
                    let currentBodyWidget: BodyWidget = endnote.bodyWidgets[i];
                    page.endnoteWidget.bodyWidgets.unshift(currentBodyWidget);
                    currentBodyWidget.containerWidget = page.endnoteWidget;
                    currentBodyWidget.page = page;
                    endnote.bodyWidgets.splice(i, 1);
                }
            }
        }
    }

    private moveToNextPage(viewer: LayoutViewer, line: LineWidget, isPageBreak?: boolean, isList?:boolean, skipFloat?: boolean): void {
        if (this.isFootNoteLayoutStart) {
            return;
        }
        let paragraphWidget: ParagraphWidget = line.paragraph;
        let startBlock: BlockWidget;
        let startIndex: number = 0;
        let keepLinesTogether: boolean = false;
        let keepWithNext: boolean = false;
        let isEndnote: boolean = false;
        let firstLineIndent: number = 0;
        if (paragraphWidget && !(!isNullOrUndefined(paragraphWidget.containerWidget) && !isNullOrUndefined(paragraphWidget.containerWidget.containerWidget) && paragraphWidget.containerWidget.containerWidget instanceof FootNoteWidget && paragraphWidget.containerWidget.containerWidget.footNoteType === 'Footnote')) {
            let index: number = 0;
            if (paragraphWidget instanceof FootNoteWidget) {
                return;
            }
            if (!isNullOrUndefined(paragraphWidget.containerWidget) && !isNullOrUndefined(paragraphWidget.containerWidget.containerWidget) && paragraphWidget.containerWidget.containerWidget instanceof FootNoteWidget && paragraphWidget.containerWidget.containerWidget.footNoteType === 'Endnote') {
                isEndnote = true;
            }
            if (!isNullOrUndefined(line)) {
                index = paragraphWidget.childWidgets.indexOf(line);
                if (index !== 0) {
                    if (paragraphWidget.paragraphFormat.keepLinesTogether && !isNullOrUndefined(paragraphWidget.previousWidget) && !line.previousLine.isEndsWithColumnBreak) {
                        index = 0;
                        keepLinesTogether = true;
                    } else if (index == 1 && !line.previousLine.isEndsWithPageBreak && !line.previousLine.isEndsWithColumnBreak && paragraphWidget.paragraphFormat.widowControl &&
                        !isNullOrUndefined(paragraphWidget.previousWidget)) {
                        index = 0;
                        keepLinesTogether = true;
                    }
                }
                if (index > 0 || isPageBreak) {
                    paragraphWidget.height = viewer.clientActiveArea.y - paragraphWidget.y;
                }
                if (index === 0 && !paragraphWidget.isEndsWithPageBreak && !paragraphWidget.isEndsWithColumnBreak) {
                    let blockInfo: BlockInfo = this.alignBlockElement(paragraphWidget);
                    if (!isNullOrUndefined(blockInfo.node)) {
                        startBlock = blockInfo.node instanceof TableRowWidget ? this.splitRow(blockInfo.node) : blockInfo.node as BlockWidget;
                        startIndex = startBlock instanceof TableWidget ? 0 : parseInt(blockInfo.position.index, 10);
                        paragraphWidget = startBlock as ParagraphWidget;
                        index = startIndex;
                        keepLinesTogether = false;
                        keepWithNext = true;
                        if (paragraphWidget instanceof ParagraphWidget) {
                            if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule && !paragraphWidget.paragraphFormat.keepWithNext && !isList) {
                                this.viewer.owner.editorModule.updateWholeListItems(paragraphWidget);
                            }
                        } else {
                            if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule && !isList) {
                                this.viewer.owner.editorModule.updateWholeListItems(paragraphWidget);
                            }
                        }
                    }
                }
            }
            /* eslint-disable-next-line max-len */
            if (!isNullOrUndefined(paragraphWidget.bodyWidget) && !isNullOrUndefined(paragraphWidget.bodyWidget.containerWidget) && !(paragraphWidget.bodyWidget.containerWidget instanceof FootNoteWidget) && paragraphWidget.bodyWidget.page.footnoteWidget !== undefined) {
                // this.viewer.updateClientAreaForBlock(paragraphWidget.bodyWidget.page.footnoteWidget.block, true);
                this.layoutfootNote(paragraphWidget.bodyWidget.page.footnoteWidget);
                // this.viewer.updateClientAreaForBlock(paragraphWidget.bodyWidget.page.footnoteWidget.block, false);
            }
            if (this.isMultiColumnSplit) {
                let nextColumn: WColumnFormat = this.viewer.columnLayoutArea.getNextColumnByBodyWidget(paragraphWidget.bodyWidget);
                if (isNullOrUndefined(nextColumn)) {
                    return;
                }
            }
            let prevPage: Page = paragraphWidget.bodyWidget.page;
            if (isPageBreak && index === 0 && !isNullOrUndefined(paragraphWidget.bodyWidget.lastChild) && paragraphWidget === paragraphWidget.bodyWidget.lastChild && this.endOverlapWidget) {
                this.isRelayoutOverlap = false;
            }
            if (isEndnote && isNullOrUndefined(prevPage.nextPage) && paragraphWidget.bodyWidget.index === 0 && paragraphWidget.index === 0 && index === 0) {
                let endnote: FootNoteWidget = paragraphWidget.containerWidget.containerWidget as FootNoteWidget;
                this.moveEndnoteToNextPage(endnote, paragraphWidget.bodyWidget, true);
                return;
            }
            let nextBody: BodyWidget = this.moveBlocksToNextPage(paragraphWidget, index === 0, index, false, isEndnote);
            if (isEndnote) {
                let endnote: FootNoteWidget = paragraphWidget.containerWidget.containerWidget as FootNoteWidget;
                let currentBodyIndex: number = endnote.bodyWidgets.indexOf(paragraphWidget.bodyWidget);
                nextBody.footNoteReference = paragraphWidget.bodyWidget.footNoteReference;
                this.moveEndnoteToNextPage(endnote, nextBody, false, currentBodyIndex);
            }
            if (prevPage !== nextBody.page) {
                this.viewer.updateClientArea(nextBody, nextBody.page);
            }
            this.viewer.updateClientAreaForBlock(paragraphWidget, true);
            if (index > 0) {
                if (line.isLastLine() && isPageBreak) {
                    return;
                }
                let nextParagraph: ParagraphWidget;
                if (nextBody.firstChild instanceof ParagraphWidget && nextBody.firstChild.equals(paragraphWidget)) {
                    nextParagraph = nextBody.firstChild;
                } else {
                    nextParagraph = new ParagraphWidget();
                }
                nextParagraph = this.moveChildsToParagraph(paragraphWidget, index, nextParagraph);
                // this.updateLinearIndex(paragraphWidget);
                // this.updateLinearIndex(nextParagraph);
                nextParagraph.containerWidget = nextBody;
                for (let m = 0; m < nextParagraph.floatingElements.length; m++) {
                    const element: ShapeBase = nextParagraph.floatingElements[m];
                    if (element.line.paragraph.bodyWidget !== paragraphWidget.bodyWidget && element.textWrappingStyle !== 'Inline') {
                        paragraphWidget.bodyWidget.floatingElements.splice(paragraphWidget.bodyWidget.floatingElements.indexOf(element), 1);
                    }
                }
                const footWidget: BodyWidget[] = this.getFootNoteWidgetsOf(nextParagraph);
                this.moveFootNotesToPage(footWidget, paragraphWidget.bodyWidget, nextBody);
                paragraphWidget = nextParagraph;
                this.viewer.clientActiveArea.height -= this.getFootNoteHeight(footWidget);
            } else if (!isPageBreak) {
                paragraphWidget.containerWidget.removeChild(paragraphWidget.indexInOwner);
                if (paragraphWidget instanceof ParagraphWidget && paragraphWidget.floatingElements.length > 0) {
                    this.addRemoveFloatElementsFromBody(paragraphWidget, paragraphWidget.containerWidget as BodyWidget, false);
                }
                if (isEndnote && paragraphWidget.containerWidget.childWidgets.length === 0 && !isNullOrUndefined(paragraphWidget.containerWidget.containerWidget) && paragraphWidget.containerWidget.containerWidget instanceof FootNoteWidget) {
                    let endnote = paragraphWidget.containerWidget.containerWidget;
                    endnote.bodyWidgets.splice(endnote.bodyWidgets.indexOf(paragraphWidget.containerWidget as BodyWidget), 1);
                    nextBody.footNoteReference.bodyWidget = nextBody;
                    if (!isNullOrUndefined(endnote.page.endnoteWidget) && endnote.page.endnoteWidget.bodyWidgets.length === 0) {
                        endnote.page.endnoteWidget = undefined;
                    }
                }
            }
            if (!isPageBreak) {
                if (nextBody.childWidgets.indexOf(paragraphWidget) === -1) {
                    nextBody.childWidgets.splice(0, 0, paragraphWidget);
                    if (paragraphWidget instanceof ParagraphWidget && paragraphWidget.floatingElements.length > 0) {
                        this.addRemoveFloatElementsFromBody(paragraphWidget, nextBody, true);
                    }
                }
                paragraphWidget.containerWidget = nextBody;
                this.viewer.updateClientAreaLocation(paragraphWidget, this.viewer.clientActiveArea);
                if (keepLinesTogether || keepWithNext) {
                    if (paragraphWidget.bodyWidget.page.footnoteWidget) {
                        this.layoutfootNote(paragraphWidget.bodyWidget.page.footnoteWidget);
                    }
                    if (line.paragraph !== paragraphWidget || (paragraphWidget.paragraphFormat.widowControl && this.isImagePresent(paragraphWidget))) {
                        if (paragraphWidget instanceof TableWidget) {
                            this.clearTableWidget(paragraphWidget, true, true, false);
                        }
                        this.layoutBlock(paragraphWidget, 0, true);
                        viewer.updateClientAreaForBlock(paragraphWidget, false);
                    }
                    let lastBlock: ParagraphWidget = line.paragraph;
                    if (keepWithNext) {
                        let nextBlock: BlockWidget = paragraphWidget.nextWidget as BlockWidget;
                        if (!isNullOrUndefined(nextBlock)) {
                            do {
                                viewer.updateClientAreaForBlock(nextBlock, true);
                                if (nextBlock !== lastBlock) {
                                    if (nextBlock instanceof TableWidget) {
                                        this.clearTableWidget(nextBlock, true, true, false);
                                    }
                                    this.layoutBlock(nextBlock, 0, true);
                                    viewer.updateClientAreaForBlock(nextBlock, false);
                                } else {
                                    this.viewer.updateClientAreaLocation(nextBlock, this.viewer.clientActiveArea);
                                    break;
                                }
                                nextBlock = nextBlock.nextWidget as BlockWidget;
                            } while (nextBlock);
                        }
                    }
                    this.updateClientAreaForNextBlock(line, lastBlock);
                }
                if (line.isFirstLine() && line.indexInOwner === 0 && !(line.children[0] instanceof ListTextElementBox) && !skipFloat) {
                    firstLineIndent = -HelperMethods.convertPointToPixel(line.paragraph.paragraphFormat.firstLineIndent);
                    this.viewer.updateClientWidth(firstLineIndent);
                }
            }
        }
        if (!isPageBreak) {
            this.updateShapeBaseLocation(paragraphWidget);
        }
        if (skipFloat) {
            this.viewer.updateClientWidth(firstLineIndent);
        }
        if (this.isRelayoutOverlap && this.endOverlapWidget && (!this.skipRelayoutOverlap || (this.endOverlapWidget instanceof TableWidget && this.endOverlapWidget.wrapTextAround))) {
            let block: BlockWidget = this.endOverlapWidget.previousRenderedWidget as BlockWidget;
            let para: BlockWidget = line.paragraph;
            this.startOverlapWidget = para;
            line = this.endOverlapWidget.childWidgets[0] as LineWidget;
            para = line.paragraph;
            while (para) {
                (para as ParagraphWidget).floatingElements.forEach((shape: ShapeBase) => {
                    if (block.bodyWidget.floatingElements.indexOf(shape) !== -1 && shape.textWrappingStyle !== 'Inline') {
                        block.bodyWidget.floatingElements.splice(block.bodyWidget.floatingElements.indexOf(shape), 1);
                        line.paragraph.bodyWidget.floatingElements.push(shape);
                    }
                });
                para = para !== this.endOverlapWidget ? para.nextWidget as BlockWidget : undefined;
            }
            this.layoutStartEndBlocks(this.startOverlapWidget, this.endOverlapWidget);
            this.startOverlapWidget = undefined;
            this.viewer.clientActiveArea.height = this.viewer.clientActiveArea.bottom - this.endOverlapWidget.y;
            this.viewer.clientActiveArea.y = this.endOverlapWidget.y;
        }
    }
    private isImagePresent(paragraph: ParagraphWidget): boolean {
        for (let i = 0; i < paragraph.childWidgets.length; i++) {
            let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
            for (let j = 0; j < line.children.length; j++) {
                if (line.children[j] instanceof ImageElementBox) {
                    return true;
                }
            }
        }
        return false;
    }
    private updateShapeBaseLocation(paragraphWidget: ParagraphWidget): void {
        if (paragraphWidget instanceof ParagraphWidget &&
            paragraphWidget.floatingElements.length > 0) {
            for (let m: number = 0; m < paragraphWidget.floatingElements.length; m++) {
                let shape: ShapeBase = paragraphWidget.floatingElements[m];
                let position: Point = this.getFloatingItemPoints(shape);
                shape.y = position.y;
                shape.x = position.x;
                if (shape instanceof ShapeElementBox)
                    this.updateChildLocationForCellOrShape(shape.y, shape as ShapeElementBox);
            }
        }
    }
    private moveChildsToParagraph(srcParagraph: ParagraphWidget, childStartIndex: number, nextParagraph: ParagraphWidget): ParagraphWidget {
        nextParagraph = this.addParagraphWidget(this.viewer.clientActiveArea, nextParagraph);
        let insertIndex: number = 0;
        for (let i: number = childStartIndex; i < srcParagraph.childWidgets.length; i++) {
            let lineWidget: LineWidget = srcParagraph.childWidgets[i] as LineWidget;
            lineWidget.paragraph = nextParagraph;
            nextParagraph.childWidgets.splice(insertIndex, 0, lineWidget);
            lineWidget.paragraph = nextParagraph;
            insertIndex++;
        }
        nextParagraph.paragraphFormat = srcParagraph.paragraphFormat;
        nextParagraph.characterFormat = srcParagraph.characterFormat;
        nextParagraph.index = srcParagraph.index;
        srcParagraph.childWidgets.splice(childStartIndex);
        for (let i = 0; i < srcParagraph.floatingElements.length; i++) {
            const element: ShapeBase = srcParagraph.floatingElements[i] as ShapeBase;
            if (element.line.paragraph !== srcParagraph) {
                nextParagraph.floatingElements.push(element);
                srcParagraph.floatingElements.splice(srcParagraph.floatingElements.indexOf(element), 1);
                i--;
            }
        }
        return nextParagraph;
    }
    /**
     * @param {ParagraphWidget} paragarph - the paragraph
     * @param {BodyWidget} body - the bodyWidget
     * @param {boolean} add - to specify add or remove floating elements from body widget.
     */
    private addRemoveFloatElementsFromBody(paragarph: ParagraphWidget, body: BodyWidget, add: boolean): void {
        if (paragarph.floatingElements.length > 0) {
            for (let x: number = 0; x < paragarph.floatingElements.length; x++) {
                if (add) {
                    if (body.floatingElements.indexOf(paragarph.floatingElements[x]) === -1 && paragarph.floatingElements[x].textWrappingStyle !== 'Inline') {
                        body.floatingElements.push(paragarph.floatingElements[x]);
                    }
                } else {
                    if (body.floatingElements.indexOf(paragarph.floatingElements[x]) !== -1) {
                        body.floatingElements.splice(body.floatingElements.indexOf(paragarph.floatingElements[x]), 1);
                    }
                }
            }
        }
    }

    /**
     * Align block based on keep with next and keep lines together property.
     */
    private alignBlockElement(block: ParagraphWidget | TableRowWidget): BlockInfo {
        if (block instanceof ParagraphWidget && (block.isEndsWithPageBreak || block.isEndsWithColumnBreak)) {
            return { node: undefined, position: { index: '' } };
        }
        let startBlock: BlockWidget;
        let startIndex: number = 0;
        // Check previous block has keep with next property.
        let previousBlock: BlockWidget = this.getPreviousBlock(block) as BlockWidget;

        while (previousBlock) {
            if (previousBlock instanceof ParagraphWidget) {
                if (!previousBlock.paragraphFormat.keepWithNext || previousBlock.isEndsWithPageBreak || previousBlock.isEndsWithColumnBreak) {
                    break;
                }
                startBlock = previousBlock;
                if (previousBlock.paragraphFormat.keepLinesTogether) {
                    if (isNullOrUndefined(this.getPreviousBlock(previousBlock))) {
                        startBlock = undefined;
                    } else {
                        startIndex = 0;
                    }
                } else {
                    if (isNullOrUndefined(this.getPreviousBlock(previousBlock))
                        && previousBlock.childWidgets.length === 1) {
                        startBlock = undefined;
                    } else {
                        if (!previousBlock.paragraphFormat.widowControl) {
                            startIndex = (previousBlock.lastChild as LineWidget).indexInOwner;
                            if (startIndex !== 0) {
                                break;
                            }
                        } else {
                            startIndex = (previousBlock.lastChild as LineWidget).indexInOwner - 1;
                            if (startIndex === 1 || startIndex < 0 ) {
                                // Move entire block to next page based on widow control.
                                startIndex = 0;
                            }
                            if (startIndex !== 0) {
                                break;
                            }
                        }
                    }
                }
            } else if (previousBlock instanceof TableRowWidget) {
                let childWidget = previousBlock.childWidgets[0] as TableCellWidget;
                if (childWidget.childWidgets.length > 0) {
                    let firstBlock: ParagraphWidget = this.documentHelper.getFirstParagraphInCell(childWidget as TableCellWidget);
                    if (!firstBlock.paragraphFormat.keepWithNext) {
                        break;
                    }
                    if (firstBlock.paragraphFormat.keepWithNext) {
                        if (isNullOrUndefined(this.getPreviousBlock(previousBlock as BlockWidget))) {
                            startBlock = undefined;
                        } else {
                            startBlock = previousBlock;
                            startIndex = startBlock.indexInOwner;
                        }
                    }
                } else {
                    break;
                }
                // TODO: Table row splitting case.
            }
            previousBlock = this.getPreviousBlock(previousBlock as BlockWidget) as BlockWidget;
        }
        if (!isNullOrUndefined(startBlock) && startBlock instanceof ParagraphWidget && startBlock.indexInOwner === 0 && startBlock.paragraphFormat.keepWithNext && startBlock.paragraphFormat.widowControl) {
            startBlock = block;
        }
        return { node: startBlock, position: { index: startIndex.toString() } };
    }

    private getPreviousBlock(block: BlockWidget): BlockWidget {
        let previousBlock: BlockWidget;
        if (block instanceof ParagraphWidget) {
            previousBlock = block.previousWidget as BlockWidget;
            if (!this.isInitialLoad && isNullOrUndefined(previousBlock) && block.containerWidget instanceof BodyWidget && !isNullOrUndefined(block.containerWidget.previousRenderedWidget) && block.containerWidget.sectionIndex === (block.containerWidget.previousRenderedWidget as BodyWidget).sectionIndex) {
                if (!isNullOrUndefined(block.previousRenderedWidget) && block.previousRenderedWidget instanceof ParagraphWidget) {
                    previousBlock = block.previousRenderedWidget as BlockWidget;
                }
            }
        } else if (block instanceof TableRowWidget) {
            previousBlock = block.previousWidget as TableRowWidget;
            if (isNullOrUndefined(previousBlock)) {
                previousBlock = block.ownerTable.previousWidget as BlockWidget;
            }
        }
        if (previousBlock instanceof TableWidget) {
            previousBlock = previousBlock.lastChild as BlockWidget;
        }
        return previousBlock;
    }

    private splitRow(startRow: TableRowWidget): TableWidget {
        let table: TableWidget = startRow.ownerTable;
        if (startRow.indexInOwner === 0) {
            return table;
        }
        let newTable: TableWidget = this.createTableWidget(table);
        for (let i: number = startRow.indexInOwner; i < table.childWidgets.length;) {
            let rowWidget: TableRowWidget = table.childWidgets.splice(i, 1)[0] as TableRowWidget;
            newTable.childWidgets.push(rowWidget);
            rowWidget.containerWidget = newTable;
            table.height -= rowWidget.height;
            newTable.height += rowWidget.height;
        }
        table.containerWidget.childWidgets.splice(table.indexInOwner + 1, 0, newTable);
        newTable.containerWidget = table.containerWidget;
        return newTable;
    }

    private splitParagraph(paragarph: ParagraphWidget, index: number, nextParagraph?: ParagraphWidget): ParagraphWidget {
        if (index === 0 && isNullOrUndefined(nextParagraph)) {
            return paragarph;
        }
        let isMoveCurrentBlock: boolean = false;
        if (isNullOrUndefined(nextParagraph)) {
            nextParagraph = new ParagraphWidget();
            nextParagraph.containerWidget = paragarph.containerWidget;
            paragarph.containerWidget.childWidgets.splice(paragarph.indexInOwner + 1, 0, nextParagraph);
            nextParagraph.paragraphFormat = paragarph.paragraphFormat;
            nextParagraph.characterFormat = paragarph.characterFormat;
            nextParagraph.index = paragarph.index;
        } else if (index === 0) {
            isMoveCurrentBlock = true;
            let temp: ParagraphWidget = paragarph;
            paragarph = nextParagraph;
            nextParagraph = temp;
        }
        let insertIndex: number = 0;
        for (let i: number = index; i < paragarph.childWidgets.length; i++) {
            let lineWidget: LineWidget = paragarph.childWidgets[i] as LineWidget;
            lineWidget.paragraph = nextParagraph;
            if (isMoveCurrentBlock) {
                nextParagraph.childWidgets.push(lineWidget);
            } else {
                nextParagraph.childWidgets.splice(insertIndex, 0, lineWidget);
            }
            nextParagraph.height += lineWidget.height;
            paragarph.height -= lineWidget.height;
            lineWidget.paragraph = nextParagraph;
            insertIndex++;
        }
        nextParagraph.width = paragarph.width;
        if (isMoveCurrentBlock) {
            nextParagraph.containerWidget.childWidgets.splice(nextParagraph.indexInOwner, 1);
            nextParagraph.y = paragarph.y;
            nextParagraph.x = paragarph.x;
            nextParagraph.containerWidget = paragarph.containerWidget;
            paragarph.containerWidget.childWidgets.unshift(nextParagraph);
        } else {
            paragarph.childWidgets.splice(index);
        }
        if (paragarph.childWidgets.length === 0 || isMoveCurrentBlock) {
            paragarph.containerWidget.childWidgets.splice(paragarph.indexInOwner, 1);
        }
        // this.updateLinearIndex(paragarph);
        // this.updateLinearIndex(nextParagraph);
        return nextParagraph;
    }

    private updateClientPositionForBlock(block: BlockWidget, currentBlock: BlockWidget): void {
        let startBlock: BlockWidget = (block instanceof TableRowWidget) ? block.ownerTable : block;
        let isClientAreaUpdated: boolean = false;
        do {
            if (startBlock instanceof ParagraphWidget) {
                if (currentBlock instanceof ParagraphWidget && currentBlock.equals(startBlock)) {
                    isClientAreaUpdated = true;
                    break;
                }
                this.viewer.updateClientAreaForBlock(startBlock, true);
                this.addParagraphWidget(this.viewer.clientActiveArea, startBlock);
                this.viewer.cutFromTop(this.viewer.clientActiveArea.y + startBlock.height);
                this.viewer.updateClientAreaForBlock(startBlock, false);
            } else if (startBlock instanceof TableWidget) {
                this.viewer.updateClientAreaForBlock(startBlock, true);
                if (this.documentHelper.compatibilityMode !== 'Word2013' && !startBlock.isInsideTable) {
                    this.viewer.clientActiveArea.x = this.viewer.clientActiveArea.x -
                        HelperMethods.convertPointToPixel(((startBlock.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
                }
                this.addTableWidget(this.viewer.clientActiveArea, [startBlock])
                let nextRow: TableRowWidget = startBlock.firstChild as TableRowWidget;
                if (currentBlock instanceof TableRowWidget && startBlock.equals(currentBlock.ownerTable) && !isNullOrUndefined(nextRow)) {
                    do {
                        if (nextRow.equals(currentBlock)) {
                            isClientAreaUpdated = true;
                            break;
                        }
                        this.addTableRowWidget(this.viewer.clientActiveArea, [nextRow]);
                        this.updateChildLocationForRow(this.viewer.clientActiveArea.y, nextRow);
                        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + nextRow.height);
                        startBlock.height += nextRow.height;
                        nextRow = nextRow.nextWidget as TableRowWidget;
                    } while (nextRow);
                } else {
                    this.updateChildLocationForTable(startBlock.y, startBlock);
                    this.viewer.cutFromTop(this.viewer.clientActiveArea.y + startBlock.height);
                    this.viewer.updateClientAreaForBlock(startBlock, false);
                }
            }
            startBlock = startBlock.nextWidget as BlockWidget;
        } while (startBlock && !isClientAreaUpdated);
    }

    private updateClientAreaForNextBlock(line: LineWidget, paragraphWidget: ParagraphWidget): void {
        for (let m: number = 0; m < paragraphWidget.childWidgets.length; m++) {
            let child: LineWidget = paragraphWidget.childWidgets[m] as LineWidget;
            if (line === child) {
                break;
            }
            this.updateShapeBaseLocation(paragraphWidget);
            this.checkInbetweenShapeOverlap(child);
            this.viewer.cutFromTop(this.viewer.clientActiveArea.y + child.height);
        }
    }
    private layoutStartEndBlocks(startBlock: BlockWidget, endBlock: BlockWidget): void {
        let block: BlockWidget = startBlock;
        this.isOverlapFloatTable = true;
        this.viewer.clientActiveArea.height = this.viewer.clientActiveArea.bottom - startBlock.y;
        this.viewer.clientActiveArea.y = startBlock.y;
        let startParagaraph: ParagraphWidget;
        if (startBlock instanceof TableWidget) {
            startParagaraph = this.documentHelper.getFirstParagraphInFirstCell(startBlock as TableWidget);
        } else {
            startParagaraph = startBlock as ParagraphWidget;
        }
        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
            this.viewer.owner.editorModule.updateWholeListItems(startParagaraph);
        }
        while (block) {
            this.viewer.updateClientAreaForBlock(block, true);
            if (block instanceof ParagraphWidget) {
                this.layoutParagraph(block as ParagraphWidget, 0);
            } else {
                this.clearTableWidget(block as TableWidget, true, true, true);
                this.layoutTable(block as TableWidget, 0);
            }
            this.viewer.updateClientAreaForBlock(block, false);
            let isTableHasParaVerticalOrigin: boolean = (!isNullOrUndefined(block.nextWidget) && block.nextWidget instanceof TableWidget && block.nextWidget === endBlock && (block.nextWidget.positioning.verticalOrigin === 'Paragraph'));
            block = block !== endBlock && !isTableHasParaVerticalOrigin ? block.nextWidget as BlockWidget : undefined;
        }
    }

    /* eslint-disable-next-line max-len */
    private alignLineElements(element: ElementBox, topMargin: number, bottomMargin: number, maxDescent: number, addSubWidth: boolean, subWidth: number, textAlignment: TextAlignment, whiteSpaceCount: number, isLastElement: boolean): LineElementInfo {
        if (element.width > 0 && (element instanceof TextElementBox || element instanceof ListTextElementBox)) {
            let textElement: TextElementBox = element instanceof TextElementBox ? element as TextElementBox : undefined;
            //Updates the text to base line offset.
            let baselineOffset: number = element instanceof TextElementBox ? textElement.baselineOffset : (element as ListTextElementBox).baselineOffset;
            topMargin += this.maxBaseline - baselineOffset;
            bottomMargin += maxDescent - (element.height - baselineOffset);
            //Updates the text to base line offset.
            if (!isNullOrUndefined(textElement) && textAlignment === 'Justify' && whiteSpaceCount > 0) {
                //Aligns the text as Justified.
                textElement.isWidthUpdated = false;
                let width: number = textElement.width;
                let text: string = textElement.text;
                if (!addSubWidth) {
                    text = HelperMethods.trimStart(text);  // trim start.
                    addSubWidth = (text.length > 0);
                }
                if (addSubWidth) {
                    let spaceCount: number = text.length - HelperMethods.removeSpace(text).length;
                    if (isLastElement) {
                        spaceCount -= text.length - HelperMethods.trimEnd(text).length;
                    }
                    if (whiteSpaceCount < spaceCount) {
                        width = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text, textElement.characterFormat, textElement.scriptType);
                        spaceCount = whiteSpaceCount;
                    }

                    if (spaceCount > 0) {
                        textElement.width = width + subWidth * spaceCount;
                        whiteSpaceCount -= spaceCount;
                    }
                }
            }
        } else {
            addSubWidth = true;
            //Updates the Image/UIElement to base line offset.
            topMargin += this.maxBaseline - element.height;
            bottomMargin += maxDescent;
        }
        return { 'topMargin': topMargin, 'bottomMargin': bottomMargin, 'addSubWidth': addSubWidth, 'whiteSpaceCount': whiteSpaceCount };
    }

    private updateWidgetToPage(viewer: LayoutViewer, paragraphWidget: ParagraphWidget, skipCellContentHeightCalc?: boolean): void {
        if (paragraphWidget.isInsideTable) {
            let cellWidget: TableCellWidget = paragraphWidget.associatedCell;
            paragraphWidget.height = viewer.clientActiveArea.y - paragraphWidget.y;
            // if (viewer instanceof PageLayoutViewer) {
            if (isNullOrUndefined(paragraphWidget.associatedCell) || isNullOrUndefined(paragraphWidget.associatedCell.ownerRow)
                || isNullOrUndefined(paragraphWidget.associatedCell.ownerRow.rowFormat)) {
                return;
            }
            if (paragraphWidget.associatedCell.ownerRow.rowFormat.heightType === 'Exactly') {
                cellWidget.height = HelperMethods.convertPointToPixel(paragraphWidget.associatedCell.ownerRow.rowFormat.height);
            } else {
                if ([cellWidget].length <= 1 && paragraphWidget.associatedCell.ownerRow.rowFormat.heightType === 'AtLeast' && !skipCellContentHeightCalc) {
                    cellWidget.height = Math.max(HelperMethods.convertPointToPixel(paragraphWidget.associatedCell.ownerRow.rowFormat.height), this.getCellContentHeight(cellWidget, false, paragraphWidget.indexInOwner));
                } else {
                        cellWidget.height = cellWidget.height + paragraphWidget.height;
                }
            }
            // } else {
            //     cellWidget.height = cellWidget.height + paragraphWidget.height;
            // }
            // cellWidget.childWidgets.push(paragraphWidget);
            paragraphWidget.containerWidget = cellWidget;
        } else {
            if (!paragraphWidget.isEndsWithPageBreak && !paragraphWidget.isEndsWithColumnBreak || viewer instanceof WebLayoutViewer) {
                paragraphWidget.height = viewer.clientActiveArea.y - paragraphWidget.y;
            }
            //Adds the paragraph widget to the Header Footer/ Body widget.
            // this.updateWidgetsToBody(paragraphWidget, viewer, paragraphWidget);
            //For canvas no need to render paragraph widget here. In case of div, need to render paragraph here.
            // this.render.renderParagraphWidget((paragraphWidget.containerWidget as BodyWidget).page, paragraphWidget);
        }
        if (this.isRelayoutFootnote && paragraphWidget.bodyWidget instanceof FootNoteWidget) {
            if (!paragraphWidget.isInsideTable) {
                paragraphWidget.containerWidget.height += paragraphWidget.height;
            }
            //this.isRelayoutFootnote = false;
            this.shiftFootnoteChildLocation(paragraphWidget.bodyWidget, this.viewer);
        }
      
        if (paragraphWidget.bodyWidget instanceof HeaderFooterWidget) {
            if (!paragraphWidget.isInsideTable) {
                paragraphWidget.containerWidget.height += paragraphWidget.height;
            }
            if (this.viewer.owner.enableHeaderAndFooter && paragraphWidget.bodyWidget.headerFooterType.indexOf('Footer') !== -1) {
                this.shiftFooterChildLocation(paragraphWidget.bodyWidget, this.viewer);
            }
        }
        if (viewer instanceof WebLayoutViewer && paragraphWidget.containerWidget instanceof BodyWidget) {
            paragraphWidget.containerWidget.height += paragraphWidget.height;
        }
        
    }

    private shiftFooterChildLocation(widget: HeaderFooterWidget, viewer: LayoutViewer): void {
        let pageHeight: number = widget.page.bodyWidgets[0].sectionFormat.pageHeight;
        if (widget.headerFooterType.indexOf('Footer') !== -1) {
            let footerDistance: number = widget.page.bodyWidgets[0].sectionFormat.footerDistance;
            let height: number = HelperMethods.convertPointToPixel(pageHeight - footerDistance);
            let top: number;
            if (widget.y + widget.height > height) {
                top = height - (widget.y + widget.height);
            } else if (widget.y + widget.height < height) {
                top = (widget.y + widget.height) - height;
            }
            if (!isNullOrUndefined(top)) {
                top = height - (widget.y + widget.height);
                this.shiftChildLocation(top, widget);
                viewer.clientActiveArea.y += top;
            }
        }
    }

    private shiftFootnoteChildLocation(widget: FootNoteWidget, viewer: LayoutViewer): void {
        let pageHeight: number = widget.page.bodyWidgets[0].sectionFormat.pageHeight;
        let footerDistance: number = widget.page.bodyWidgets[0].sectionFormat.footerDistance;
        let bottomMargin: number = widget.page.bodyWidgets[0].sectionFormat.bottomMargin;
        let height: number = HelperMethods.convertPointToPixel(pageHeight - bottomMargin);
        let top: number;
        if (widget.y + widget.height > height) {
            top = height - (widget.y + widget.height);
        } else if (widget.y + widget.height < height) {
            top = (widget.y + widget.height) - height;
        }
        if (!isNullOrUndefined(top)) {
            top = height - (widget.y + widget.height);
            this.shiftChildLocation(top, widget);
            viewer.clientActiveArea.y += top;
        }
    }

    private checkPreviousElement(line: LineWidget, index: number): boolean {
        let paragraph: ParagraphWidget = line.paragraph;
        let isSplitByWord: boolean = false;
        let lastTextElement: number = 0;
        for (let i: number = index - 1; i >= 0; i--) {
            let textElement: ElementBox = line.children[i] as ElementBox;
            if (textElement instanceof TextElementBox && textElement.width > 0) {
                let text: string = textElement.text;
                lastTextElement = i;
                if (text.length > 0 && (text[text.length - 1] === ' ' || text[text.length - 1] === '-')) {
                    if (i === index - 1) {
                        this.addSplittedLineWidget(line, index - 1);
                        return true;
                    }
                    isSplitByWord = true;
                    break;
                } else if (text === '\t' || this.documentHelper.textHelper.isUnicodeText(text, textElement.scriptType)) {
                    return false;
                } else if (text.indexOf(' ') >= 0) {
                    isSplitByWord = true;
                    let index: number = text.lastIndexOf(' ') + 1;
                    //Splits the text element by space.
                    let splittedElement: TextElementBox = new TextElementBox();
                    splittedElement.text = text.substr(index);
                    splittedElement.characterFormat.copyFormat(textElement.characterFormat);
                    splittedElement.characterRange = textElement.characterRange;
                    if (textElement.revisions.length > 0) {
                        this.updateRevisionForSplittedElement(textElement, splittedElement, index > 0);
                        splittedElement.isMarkedForRevision = textElement.isMarkedForRevision;
                    }
                    textElement.text = text.substr(0, index);
                    this.documentHelper.textHelper.getTextSize(splittedElement, textElement.characterFormat);
                    textElement.width -= splittedElement.width;
                    if (textElement.text[textElement.text.length - 1] === ' ') {
                        textElement.trimEndWidth = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(textElement.text), textElement.characterFormat, textElement.scriptType);
                    } else {
                        textElement.trimEndWidth = textElement.width;
                    }
                    textElement.height = splittedElement.height;
                    if (textElement.width === 0) {
                        line.children.splice(i, 1);
                        if (!isNullOrUndefined(line.layoutedElements) && line.layoutedElements.length > 0) {
                            line.layoutedElements.splice(i, 1);
                        }
                    }
                    //Adds the text element to the line
                    line.children.splice(i + 1, 0, splittedElement);
                    if (!isNullOrUndefined(line.layoutedElements)) {
                        line.layoutedElements.splice(i + 1, 0, splittedElement);
                    }
                    break;
                }
            } else if (!(textElement instanceof ListTextElementBox || textElement instanceof FieldElementBox
                // to skip field code
                || textElement instanceof TextElementBox && textElement.width === 0 || textElement instanceof CommentCharacterElementBox || textElement instanceof ContentControl)) {
                //Handled for inline images/UIelements.
                lastTextElement = i;
                isSplitByWord = true;
                break;
            }
        }
        if (isSplitByWord) {
            lastTextElement++;
            if (lastTextElement < line.children.length) {
                let splitWidth: number = 0;
                for (let i: number = lastTextElement; i < line.children.length; i++) {
                    splitWidth += line.children[i].width;
                    this.addSplittedLineWidget(line, i - 1);
                    i--;
                }
                let is2013Justification: boolean = paragraph.paragraphFormat.textAlignment === 'Justify' &&
                    this.documentHelper.compatibilityMode === 'Word2013';
                if (!is2013Justification) {
                    this.viewer.updateClientWidth(splitWidth);
                }
            }
        }
        return isSplitByWord;
    }

    public clearListElementBox(paragraph: ParagraphWidget): void {
        if (paragraph.childWidgets.length === 0) {
            return;
        }
        let line: LineWidget = paragraph.childWidgets[0] as LineWidget;
        if (isNullOrUndefined(line.children)) {
            return;
        }
        for (let i: number = line.children.length - 1; i > 0; i--) {
            if (line.children[i] instanceof ListTextElementBox) {
                line.children.splice(i, 1);
            } else {
                break;
            }
        }
        for (let i: number = 0; i < line.children.length; i++) {
            if (line.children[i] instanceof ListTextElementBox) {
                line.children.splice(i, 1);
                i--;
            } else {
                break;
            }
        }
    }
        /**
     * @private
     */
         public clearInvalidList(list: WList): void {
            if (list) {
                if (list.abstractListId === -1 && this.documentHelper.abstractLists.indexOf(list.abstractList) !== -1) {
                    this.documentHelper.abstractLists.splice(this.documentHelper.abstractLists.indexOf(list.abstractList), 1);
                }
                if (list.listId === -1 && this.documentHelper.lists.indexOf(list) !== -1) {
                    this.documentHelper.lists.splice(this.documentHelper.lists.indexOf(list), 1);
                }
            }
        }

    public getListNumber(listFormat: WListFormat, isAutoList?: boolean): string {
        let list: WList = this.documentHelper.getListById(listFormat.listId);
        let levelNumber: number = listFormat.listLevelNumber;
        let listLevel: WListLevel = this.getListLevel(list, listFormat.listLevelNumber);
        let levelOverride: WLevelOverride = !isNullOrUndefined(list.levelOverrides) ? list.levelOverrides[levelNumber] as WLevelOverride : undefined;
        // If LevelOverride exists and have either override list level or StartAtOverride, then only list numbering will be restarted.
        if (!isNullOrUndefined(levelOverride) && this.documentHelper.renderedLevelOverrides.indexOf(list) === -1 && isNullOrUndefined(levelOverride.overrideListLevel)) {
            //Add List Override style
            this.documentHelper.renderedLevelOverrides.push(list);
            let abstractList: WAbstractList = this.documentHelper.getAbstractListById(list.abstractListId);
            if (this.documentHelper.renderedLists.containsKey(abstractList)) {
                let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(abstractList);
                if (levels.containsKey(levelNumber)) {
                    levels.remove(levelNumber);
                    this.ClearSubListLevelValues(list, abstractList, levelNumber);
                }
            }
        }
        if (isNullOrUndefined(isAutoList)) {
            this.updateListValues(list, levelNumber);
        }
        return this.getListText(list, levelNumber, listLevel);
    }

    private ClearSubListLevelValues(list: WList, abstractList: WAbstractList, levelNumber: number): void {
        let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(abstractList);
        let levelNumberTemp: number = levelNumber + 1;
        while (levelNumberTemp < abstractList.levels.length) {
            let listLevel: WListLevel = this.getListLevel(list, levelNumberTemp);
            if (levels.containsKey(levelNumberTemp) && listLevel.restartLevel > levelNumber) {
                levels.remove(levelNumberTemp);
            }
            levelNumberTemp++;
        }
    }

    public getListStartValue(listLevelNumber: number, list: WList): number {
        let levelOverride: WLevelOverride = !isNullOrUndefined(list.levelOverrides) ? list.levelOverrides[listLevelNumber] as WLevelOverride : undefined;
        if (!isNullOrUndefined(levelOverride) && isNullOrUndefined(levelOverride.overrideListLevel)) {
            return levelOverride.startAt;
        }
        let listLevel: WListLevel = this.getListLevel(list, listLevelNumber);
        if (isNullOrUndefined(listLevel)) {
            return 0;
        } else {
            return listLevel.startAt;
        }
    }

    private updateListValues(list: WList, listLevelNumber: number): void {
        let abstractList: WAbstractList = this.documentHelper.getAbstractListById(list.abstractListId);
        let currentListLevel: WListLevel = this.getListLevel(list, listLevelNumber);
        if (!this.documentHelper.renderedLists.containsKey(abstractList)) {
            let startVal: Dictionary<number, number> = new Dictionary<number, number>();
            this.documentHelper.renderedLists.add(abstractList, startVal);
            let listLevel: WListLevel = this.getListLevel(list, listLevelNumber);
            for (let i: number = 0; i <= listLevelNumber; i++) {
                startVal.add(i, this.getListStartValue(i, list));
            }
        } else {
            let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(abstractList);
            if (levels.containsKey(listLevelNumber)) {
                let startAt: number = levels.get(listLevelNumber);
                levels.set(listLevelNumber, startAt + 1);
                let levelNumber: number = listLevelNumber + 1;
                while (levelNumber < this.documentHelper.getAbstractListById(list.abstractListId).levels.length) {
                    let listLevel: WListLevel = this.getListLevel(list, levelNumber);
                    // if (!isNullOrUndefined(listLevel)) {
                    if (levels.containsKey(levelNumber) && (listLevel.restartLevel > listLevelNumber || currentListLevel.listLevelPattern === "Bullet")) {
                        levels.remove(levelNumber);
                        // if (document.renderedListLevels.indexOf(listLevel) > -1) {
                        //     document.renderedListLevels.pop();
                        // }
                    }
                    // }
                    levelNumber++;
                }
            } else {
                let levelNumber: number = listLevelNumber;
                while (!levels.containsKey(levelNumber - 1) && levelNumber > 0) {
                    let listLevel: WListLevel = this.getListLevel(list, levelNumber - 1);
                    // if (!isNullOrUndefined(listLevel)) {
                    levels.add(levelNumber - 1, this.getListStartValue(levelNumber - 1, list));
                    // if (document.renderedListLevels.indexOf(listLevel) !== -1) {
                    //     document.renderedListLevels.push(listLevel);
                    // }
                    // }
                    levelNumber--;
                }
                let startAt: number = this.getListStartValue(listLevelNumber, list);
                levels.add(listLevelNumber, startAt);
            }
        }
    }

    private getListText(listAdv: WList, listLevelNumber: number, currentListLevel: WListLevel): string {
        let listText: string = currentListLevel.numberFormat;
        if (this.documentHelper.renderedLists.containsKey(this.documentHelper.getAbstractListById(listAdv.abstractListId))) {
            let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(this.documentHelper.getAbstractListById(listAdv.abstractListId));
            let keys: number[] = levels.keys;
            for (let i: number = 0; i < keys.length; i++) {
                let levelNumber: number = keys[i];
                let levelKey: string = '%' + (levelNumber + 1).toString();
                // if isLegalStyleNumber boolean is true, consider the currentlistlevel for getting the replace text else use the levels from starting.
                let listLevel: WListLevel = this.getListLevel(listAdv, levelNumber);
                let pattern: ListLevelPattern = i < listLevelNumber ? listLevel.listLevelPattern !== 'LeadingZero' ? 'Arabic' : listLevel.listLevelPattern : undefined;
                if (listText.match(levelKey)) {
                    if (levelNumber > listLevelNumber) {
                        return '';
                    } else if (levels.containsKey(levelNumber) && !isNullOrUndefined(listLevel)) {
                        listText = listText.replace(levelKey, this.getListTextListLevel(listLevel, levels.get(levelNumber), currentListLevel.isLegalStyleNumbering ? pattern : undefined));
                    } else {
                        listText = listText.replace(levelKey, '0');
                    }
                }
            }
        }
        return listText;
    }

    public getAsLetter(number: number): string {
        // if (number <= 0) {
        //     return '';
        // }
        let quotient: number = number / 26;
        let remainder: number = number % 26;
        if (remainder === 0) {
            //If number denotes the factor of 26, then reduce quotient by 1 and set remainder as 26.
            remainder = 26;
            quotient--;
        }
        //Index of A char in the ASCII table.     
        let letter: string = String.fromCharCode(65 - 1 + remainder);
        let listValue: string = '';
        while (quotient >= 0) {
            listValue = listValue + letter.toString();
            quotient--;
        }
        return listValue;
    }

    public getListTextListLevel(listLevel: WListLevel, listValue: number, customPattern?: ListLevelPattern ): string {
        switch (!isNullOrUndefined(customPattern) ? customPattern : listLevel.listLevelPattern) {
            case 'UpRoman':
                return this.getAsRoman(listValue).toUpperCase();
            case 'LowRoman':
                return this.getAsRoman(listValue).toLowerCase();
            case 'UpLetter':
                return this.getAsLetter(listValue).toUpperCase();
            case 'LowLetter':
                return this.getAsLetter(listValue).toLowerCase();
            case 'Arabic':
                return (listValue).toString();
            case 'LeadingZero':
                return this.getAsLeadingZero(listValue);
            case 'Number':
                return (listValue).toString();
            case 'OrdinalText':
                if (listLevel.characterFormat.localeIdAscii === 3082 || this.documentHelper.characterFormat.localeIdAscii === 3082) {
                    return this.getOrdinalTextInSpanish(true, listValue.toString()).toUpperCase();
                } else {
                    return this.getOrdinalText(true, listValue.toString()).toUpperCase();
                }
            case 'Ordinal':
                return this.getAsOrdinal(listValue, listLevel.characterFormat).toString();
            case 'FarEast':
                return (listValue).toString();
            case 'Special':
                return (listValue).toString();
            default:
                return '';
        }
    }
    public getFootEndNote(numberFormat: FootEndNoteNumberFormat, value: number): string {
        switch (numberFormat) {
            case 'UpperCaseRoman':
                return this.getAsRoman(value).toUpperCase();
            case 'LowerCaseRoman':
                return this.getAsRoman(value).toLowerCase();
            case 'UpperCaseLetter':
                return this.getAsLetter(value).toUpperCase();
            case 'LowerCaseLetter':
                return this.getAsLetter(value).toLowerCase();
            default:
                return (value).toString();

        }
    }

    private generateNumber(number: number, magnitude: number, letter: string): string {
        let numberstring: string = '';
        while (number >= magnitude) {
            number -= magnitude;
            numberstring += letter;
            this.value = number;
        }
        return numberstring.toString();
    }

    private getAsLeadingZero(listValue: number): string {
        if (listValue < 10) {
            return '0' + listValue.toString();
        } else {
            return listValue.toString();
        }
    }

    public getAsRoman(number: number): string {
        let retval: string = '';
        this.value = number;
        retval += this.generateNumber(this.value, 1000, 'M');
        retval += this.generateNumber(this.value, 900, 'CM');
        retval += this.generateNumber(this.value, 500, 'D');
        retval += this.generateNumber(this.value, 400, 'CD');
        retval += this.generateNumber(this.value, 100, 'C');
        retval += this.generateNumber(this.value, 90, 'XC');
        retval += this.generateNumber(this.value, 50, 'L');
        retval += this.generateNumber(this.value, 40, 'XL');
        retval += this.generateNumber(this.value, 10, 'X');
        retval += this.generateNumber(this.value, 9, 'IX');
        retval += this.generateNumber(this.value, 5, 'V');
        retval += this.generateNumber(this.value, 4, 'IV');
        retval += this.generateNumber(this.value, 1, 'I');
        return retval.toString();
    }

    private getOrdinalText(ordinalString: boolean, text: string): string {
        //Check whether the text contain alphabet or not
        if (ordinalString) {
            text = text.trim();
            for (let i: number = 0; i < text.length; i++)
            {
                if (/[a-zA-Z]/.test(text.charAt(i))) {
                    ordinalString = false;
                    break;
                }
            }
            //Get ordinal string
            if (ordinalString) {
                text = this.numberToWords(parseInt(text), false);
            }
        }
        return text;
    }
    private numberToWords(number: number, isCardText: boolean): string {
        if (number === 0)
            return "zero";
        let words = '';

        if (Math.floor(number / 1000000) > 0) {
            words += this.numberToWords(Math.floor(number / 1000000), isCardText) + " million ";
            if (!isCardText && number % 10 === 0)
                words += "th ";
            number %= 1000000;
        }

        if (Math.floor(number / 1000) > 0) {
            words += this.numberToWords(Math.floor(number / 1000), isCardText) + " thousand ";
            if (!isCardText && number % 10 === 0)
                words += "th ";
            number %= 1000;
        }

        if (Math.floor(number / 100) > 0) {
            words += this.numberToWords(Math.floor(number / 100), isCardText) + " hundred ";
            if (!isCardText && number % 10 === 0)
                words += "th ";
            number %= 100;
        }

        if (number > 0) {
            if (words !== '' && isCardText)
                words += "and ";
            let unitsValue = null;
            if (isCardText) {
                unitsValue = [
                    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
                    "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
                ];
            } else {
                unitsValue = [
                    "", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth",
                    "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth",
                    "seventeenth", "eighteenth", "nineteenth"
                ];
            }
            const tensValue = [
                "", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty",
                "ninety"
            ];
            const tensValue_ith = [
                "", "tenth", "twentieth", "thirtieth", "fortieth", "fiftieth", "sixtieth", "seventieth",
                "eightieth", "ninetieth"
            ];

            if (number < 20)
                words += unitsValue[number];
            else {
                if (isCardText || number % 10 > 0)
                    words += tensValue[Math.floor(number / 10)];
                if (number % 10 === 0 && !isCardText)
                    words += tensValue_ith[Math.floor(number / 10)];
                else if (number % 10 > 0)
                    words += "-" + unitsValue[number % 10];
            }
        }
        return words;
    }

    private getOrdinalTextInSpanish(ordinalString: boolean, text: string): string {
        //Check whether the text contain alphabet or not
        if (ordinalString) {
            text = text.trim();
            for (let i: number = 0; i < text.length; i++)
            {
                if (/[a-zA-Z]/.test(text.charAt(i))) {
                    ordinalString = false;
                    break;
                }
            }
            //Get ordinal string
            if (ordinalString) {
                text = this.numberToSpanishWords(parseInt(text), false);
            }
        }
        return text;
    }

    private numberToSpanishWords(number: number, isCardText: boolean): string {
        if (number === 0 && isCardText)
            return "cero";

        let words: string = '';

        if (Math.floor(number / 1000) > 0 && number <= 10000) {
            const thousandCardinalValue = [
                "", "mil", "dos mil", "tres mil", "cuatro mil", "cinco mil", "seis mil", "siete mil", "ocho mil",
                "nueve mil", "diez mil"
            ];
            const thousandOrdinalValue = [
                "", "milésimo", "dosmilésimo", "tresmilésimo", "cuatromilésimo", "cincomilésimo", "seismilésimo", "sietemilésimo",
                "ochomilésimo", "nuevemilésimo", "diezmilésimo"
            ];

            if (isCardText)
                words += thousandCardinalValue[Math.floor(number / 1000)];
            else
                words += thousandOrdinalValue[Math.floor(number / 1000)];

            number %= 1000;
        }

        if (Math.floor(number / 100) > 0) {
            if (words !== '')
                words += " ";
            const cardinalHundredsValue = [
                "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos",
                "ochocientos", "novecientos"
            ];
            const ordinalHundredsValue = [
                "", "centésimo", "ducentésimo", "tricentésimo", "cuadringentésimo", "quingentésimo", "sexcentésimo",
                "septingentésimo", "octingentésimo", "noningentésimo"
            ];

            if (isCardText)
                words += cardinalHundredsValue[Math.floor(number / 100)];
            else
                words += ordinalHundredsValue[Math.floor(number / 100)];

            number %= 100;
        }

        if (number > 0 && number < 100) {
            if (words !== '')
                words += " ";
            let unitsValue = null;
            if (isCardText) {
                unitsValue = [
                    "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once",
                    "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
                ];
            } else {
                unitsValue = [
                    "", "primero", "segundo", "tercero", "cuarto", "quinto", "sexto", "séptimo", "octavo",
                    "noveno", "décimo", "undécimo", "duodécimo", "decimotercero", "decimocuarto", "decimoquinto",
                    "decimosexto", "decimoséptimo", "decimoctavo", "decimonoveno"
                ];
            }
            const tensValue = [
                "", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta",
                "noventa"
            ];
            const tensValue_Ordinal = [
                "", "décimo", "vigésimo", "trigésimo", "cuadragésimo", "quincuagésimo", "sexagésimo", "septuagésimo",
                "octogésimo", "nonagésimo"
            ];
            const cardNumberFrom21to29Value = [
                "", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete",
                "veintiocho", "veintinueve"
            ];

            if (number < 20)
                words += unitsValue[number];
            else if (number > 20 && number < 30 && isCardText) {
                words += cardNumberFrom21to29Value[number % 10];
            } else {
                if (isCardText && number % 10 > 0)
                    words += tensValue[Math.floor(number / 10)];
                else if (isCardText && number % 10 === 0)
                    words += tensValue[Math.floor(number / 10)];
                if (number % 10 > 0 && !isCardText)
                    words += tensValue_Ordinal[Math.floor(number / 10)];
                if (number % 10 === 0 && !isCardText)
                    words += tensValue_Ordinal[Math.floor(number / 10)];
                else if (number % 10 > 0)
                    if (isCardText)
                        words += " y " + unitsValue[number % 10];
                    else
                        words += " " + unitsValue[number % 10];
            }
        }
        return words;
    }
    
    private getAsOrdinal(number: number, characterFormat: WCharacterFormat): string {
        switch (characterFormat.localeIdAscii) {
            case 1069:
            case 8218:
            case 5146:
            case 4122:
            case 1050:
            case 1029:
            case 1061:
            case 1035:
            case 3079:
            case 1031:
            case 5127:
            case 4103:
            case 2055:
            case 1038:
            case 1060:
            case 1055:
            case 1044:
            case 2068:
            case 1045:
            case 6170:
            case 2074:
                //Returns ordinal in Czech
                return number.toString() + ".";
            case 2060:
            case 11276:
            case 3084:
            case 9228:
            case 12300:
            case 1036:
            case 15372:
            case 5132:
            case 13324:
            case 6156:
            case 14348:
            case 8204:
            case 10252:
            case 4108:
                //Returns Ordinal in French
                if (number == 1)
                    return number.toString() + "er";
                else
                    return number.toString() + "e";
            case 2067:
            case 1043:
                //Returns Ordinal in Dutch
                return number.toString() + "e";
            case 1032:
                //Returns Ordinal in Greek 
                return number.toString() + "o";
            case 1040:
            case 2064:
                //Returns Ordinal in Italian
                return number.toString() + String.fromCharCode(176);
            case 5130:
            case 7178:
            case 12298:
            case 17418:
            case 4106:
            case 1046:
            case 2070:
            case 11274:
            case 16394:
            case 13322:
            case 9226:
            case 18442:
            case 2058:
            case 19466:
            case 6154:
            case 15370:
            case 10250:
            case 20490:
            case 3082:
            case 1034:
            case 21514:
            case 14346:
            case 8202:
                //Returns Ordinal in Spanish
                return number.toString() + String.fromCharCode(186);
            case 1049:
            case 2073:
                //Returns Ordinal in Russian
                return number.toString() + "-" + String.fromCharCode(1081);
            case 2077:
            case 1053:
                //Returns Ordinal in Swedish
                return this.getOrdinalInSwedish(number);
            case 1027:
                //Returns Ordinal in Catalan
                return this.getOrdinalInCatalan(number);
            case 1030:
                //Returns Ordinal in Danish
                return this.getOrdinalInDanish(number);
            default:
                //Returns Ordinal in English (Default)
                return this.getOrdinalInEnglish(number);
        }
    }

    private getOrdinalInEnglish(number: number): string {
        switch (number % 100) {
            case 11:
            case 12:
            case 13:
                return number.toString() + "th";
        }
        switch (number % 10) {
            case 1:
                return number.toString() + "st";
            case 2:
                return number.toString() + "nd";
            case 3:
                return number.toString() + "rd";
            default:
                return number.toString() + "th";
        }
    }

    private getOrdinalInSwedish(number: number): string {
        if (number == 11 || number == 12) {
            return number.toString() + ":e";
        }
        else if ((number % 10) == 1 || (number % 10) == 2) {
            return number.toString() + ":a";
        }
        else
            return number.toString() + ":e";
    }

    private getOrdinalInCatalan(number: number): string {
        switch (number) {
            case 1:
                return number.toString() + ".";
            case 2:
                return number.toString() + "n";
            case 3:
                return number.toString() + "r";
            case 4:
                return number.toString() + "t";
            case 14:
                return number.toString() + String.fromCharCode(232) + "h";
            default:
                return number.toString() + String.fromCharCode(232);
        }
    }

    private getOrdinalInDanish(number: number): string {
        if (number == 0)
            return number.toString() + "te";
        switch (number % 100) {
            case 0:
                return number.toString() + "ende";
            case 1:
                return number.toString() + "ste";
            case 2:
                return number.toString() + "nden";
            case 3:
                return number.toString() + "dje";
            case 4:
                return number.toString() + "rde";
            case 5:
            case 6:
            case 11:
            case 12:
            case 30:
                return number.toString() + "te";
            default:
                return number.toString() + "nde";
        }
    }

    public getListLevel(list: WList, listLevelNumber: number): WListLevel {
        if (!isNullOrUndefined(list)) {
            let abstractList: WAbstractList = this.documentHelper.getAbstractListById(list.abstractListId);
            if (!isNullOrUndefined(list) && abstractList.levels.length <= listLevelNumber
                && listLevelNumber >= 0 && listLevelNumber < 9) {
                this.addListLevels(abstractList);
            }
            let levelOverrideAdv: WLevelOverride = undefined;
            let level: boolean = false;
            level = (!isNullOrUndefined(list.levelOverrides))
                && !isNullOrUndefined((levelOverrideAdv = this.getOverrideListLevel(list.levelOverrides,listLevelNumber)))
                && (!isNullOrUndefined(levelOverrideAdv.overrideListLevel));
            if (level) {
                if (isNullOrUndefined(levelOverrideAdv.startAt)) {
                    levelOverrideAdv.overrideListLevel.startAt = abstractList.levels[listLevelNumber].startAt;
                }
                return levelOverrideAdv.overrideListLevel;
            } else if (!isNullOrUndefined(abstractList) && listLevelNumber >= 0 && listLevelNumber < abstractList.levels.length) {
                return abstractList.levels[listLevelNumber] as WListLevel;
            }
        }
        return undefined;
    }

    private getOverrideListLevel(levelOverrides: WLevelOverride[], listLevelNumber: number): WLevelOverride {
        for (let i = 0; i < levelOverrides.length; i++) {
            if (levelOverrides[i].levelNumber == listLevelNumber)
                return levelOverrides[i];
        }
        return undefined;
    }
    
    private getTabWidth(paragraph: ParagraphWidget, viewer: LayoutViewer, index: number, lineWidget: LineWidget, element: TabElementBox | ListTextElementBox): number {
        let fPosition: number = 0;
        let isCustomTab: boolean = false;
        let tabs: WTabStop[] = paragraph.paragraphFormat.getUpdatedTabs();
        let isList: boolean = false;
        let sectionFormat: WSectionFormat = paragraph.bodyWidget.sectionFormat;
        let leftMargin: number = HelperMethods.convertPointToPixel(sectionFormat.leftMargin);
        let tabBeforeLeftIndent: boolean = false;
        if (!isNullOrUndefined(paragraph.paragraphFormat.listFormat.listLevel) && !isNullOrUndefined(paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat)) {
            let listFormat: WParagraphFormat = paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat;
            if (paragraph.paragraphFormat.leftIndent !== listFormat.leftIndent) {
                isList = true;
            }
        }
        let clientWidth: number = 0;
        let clientActiveX: number = viewer.clientActiveArea.x;
        let firstLineIndent: number = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent);
        let leftIndent: number = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.leftIndent);
        if (!isNullOrUndefined(element) && lineWidget.isFirstLine()) {
            clientWidth = this.viewer.clientArea.x + firstLineIndent;
            if (isList) {
                clientActiveX = clientActiveX + firstLineIndent;
            }
        } else {
            clientWidth = this.viewer.clientArea.x;
        }
        if (clientActiveX < clientWidth && (this.documentHelper.compatibilityMode !== 'Word2003' || tabs.length === 0)) {
            return viewer.clientArea.x - viewer.clientActiveArea.x;
        }
        let position: number = viewer.clientActiveArea.x -
            (viewer.clientArea.x - HelperMethods.convertPointToPixel(paragraph.paragraphFormat.leftIndent));
        for (let i: number = 0; i < tabs.length; i++) {
            let tabStop: WTabStop = tabs[i];
            let tabStopPosition: number = HelperMethods.convertPointToPixel(tabStop.position);
            if (tabStopPosition < leftIndent) {
                if (parseFloat(position.toFixed(2)) < parseFloat(tabStopPosition.toFixed(2))) {
                    tabBeforeLeftIndent = true;
                } else {
                    tabBeforeLeftIndent = false;
                }
            }
        }
        if (lineWidget.isFirstLine() && leftIndent > 0 && firstLineIndent < 0
            && (element instanceof ListTextElementBox || !tabBeforeLeftIndent)) {
            if ((viewer.clientArea.x - viewer.clientActiveArea.x) > 0) {
                return viewer.clientArea.x - viewer.clientActiveArea.x;
            } else if (tabs.length === 0 && paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listLevel) {
                tabs = paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat.tabs;
            }
        }
        // Calculates tabwidth based on pageleftmargin and defaulttabwidth property
        let defaultTabWidth: number = HelperMethods.convertPointToPixel(this.documentHelper.defaultTabWidth);
        if (tabs.length === 0 && (position > 0 && defaultTabWidth > Math.round(position) && isList ||
            defaultTabWidth === this.defaultTabWidthPixel && defaultTabWidth > Math.round(position) && position > 0)) {
            return defaultTabWidth - position;
        } else {
            let breaked: boolean = false;
            if (tabs.length > 0) {
                for (let i: number = tabs.length - 1; i > -1; i--) {
                    let tabStop: WTabStop = tabs[i];
                    let tabPosition: number = HelperMethods.convertPointToPixel(tabStop.position);
                    if (!(parseFloat(tabPosition.toFixed(2)) > parseFloat(position.toFixed(2)))) {
                        if (i > 0 && (HelperMethods.convertPointToPixel(tabs[i - 1].position) > parseFloat(position.toFixed(2)))) {
                            continue;
                        }
                        if (i != tabs.length - 1) {
                            let tabInfo: TabPositionInfo = this.getJustificationTabWidth(tabs[i + 1], element, lineWidget, paragraph, defaultTabWidth, position, fPosition);
                            defaultTabWidth = tabInfo.defaultTabWidth;
                            fPosition = tabInfo.fPosition;
                            position = tabInfo.position;
                            isCustomTab = true;
                        }
                        breaked = true;
                        break;
                    }
                }
                if (!breaked) {
                    let tabJustification: TabPositionInfo = this.getJustificationTabWidth(tabs[0], element, lineWidget, paragraph, defaultTabWidth, position, fPosition);
                    defaultTabWidth = tabJustification.defaultTabWidth;
                    fPosition = tabJustification.fPosition;
                    position = tabJustification.position;
                    isCustomTab = true;
                }
            }
            if (!isCustomTab) {
                let diff: number = parseFloat(((position * 100) % (defaultTabWidth * 100) / 100).toFixed(2));
                if (diff < 0 && isList) {
                    diff += defaultTabWidth;
                }
                let cnt: number = (position - diff) / defaultTabWidth;
                fPosition = (cnt + 1) * defaultTabWidth;
            }
            if (parseFloat(fPosition.toFixed(1)) === parseFloat(position.toFixed(1))) {
                return defaultTabWidth;
            }
            return (fPosition - position) > 0 ? fPosition - position : defaultTabWidth;
        }
    }

    private getJustificationTabWidth(tab: WTabStop, element: ElementBox, lineWidget: LineWidget, paragraph: ParagraphWidget, defaultTabWidth: number, position: number, fPosition: number): TabPositionInfo {
        let elementWidth: number = element ? this.documentHelper.textHelper.getTextSize(element as TextElementBox, element.characterFormat) : 0;
        if (tab.tabJustification === 'Left' || tab.tabJustification === 'List') {
            fPosition = HelperMethods.convertPointToPixel(tab.position);
            if (element instanceof TabElementBox) {
                element.tabLeader = tab.tabLeader;
                element.tabText = '';
            }
        } else {
            let tabWidth: number = HelperMethods.convertPointToPixel(tab.position) - position;
            let width: number = this.getRightTabWidth(element.indexInOwner + 1, lineWidget, paragraph);
            if (width < tabWidth && tab.tabJustification != 'Decimal') {
                if (tab.tabJustification === 'Right') {
                    defaultTabWidth = tabWidth - width;
                    let rightIndent: number = HelperMethods.convertPointToPixel(paragraph.rightIndent);
                    let areaWidth: number = this.viewer.clientActiveArea.width + rightIndent - defaultTabWidth;
                    this.viewer.clientActiveArea.width += rightIndent;
                    if (areaWidth < 0) {
                        defaultTabWidth += areaWidth - width;
                    } else if (width > areaWidth) {
                        defaultTabWidth -= width - areaWidth;
                    }
                } else {
                    defaultTabWidth = tabWidth - width / 2;
                }
            } else if (tab.tabJustification === 'Center' && (width / 2) < tabWidth) {
                defaultTabWidth = tabWidth - width / 2;
            } else if (tab.tabJustification === 'Decimal') {
                if(!isNullOrUndefined(element.nextElement) && element.nextElement instanceof TextElementBox){
                    let nextElement: TextElementBox = element.nextElement as TextElementBox;
                    if(nextElement.text.indexOf(".") != -1){
                        let index: number = nextElement.text.indexOf(".");
                        let text: string = nextElement.text.substring(0,index);
                        let textWidth: number = this.documentHelper.textHelper.getWidth(text, nextElement.characterFormat, nextElement.scriptType)
                        defaultTabWidth = tabWidth - textWidth;
                    } else if ( width < tabWidth) {
                        defaultTabWidth = tabWidth - width;
                    } else {
                        defaultTabWidth = tabWidth ;
                    }
                } else {
                    defaultTabWidth = tabWidth;
                }
            } else {
                defaultTabWidth = tab.tabJustification === 'Right' ? 0 : elementWidth;
            }
            fPosition = position;
            if (element instanceof TabElementBox) {
                element.tabLeader = tab.tabLeader;
                element.tabText = '';
            }
        }
        return {
            defaultTabWidth: defaultTabWidth,
            fPosition: fPosition,
            position: position
        }
    }

    private getRightTabWidth(index: number, lineWidget: LineWidget, paragraph: ParagraphWidget): number {
        let width: number = 0;
        let isFieldCode: boolean = false;
        let elementBox: ElementBox = lineWidget.children[index];
        while (elementBox) {
            if ((elementBox instanceof FieldElementBox) || (elementBox instanceof BookmarkElementBox) || isFieldCode) {
                if (elementBox instanceof FieldElementBox) {
                    if (elementBox.fieldType === 0) {
                        isFieldCode = true;
                    } else if (elementBox.fieldType === 2) {
                        isFieldCode = false;
                    }
                }
                elementBox.width = 0;
            } else {
                if (elementBox instanceof FieldTextElementBox && !this.isTocField(elementBox.fieldBegin)) {
                    let text: string = this.documentHelper.getFieldResult((elementBox as FieldTextElementBox).fieldBegin, elementBox.paragraph.bodyWidget.page);
                    if (text !== '') {
                        (elementBox as FieldTextElementBox).text = text;
                    }
                }
                if (elementBox instanceof TextElementBox) {
                    this.documentHelper.textHelper.getTextSize(elementBox, elementBox.characterFormat);
                }
            }
            if (elementBox instanceof TextElementBox && (elementBox as TextElementBox).text === '\t') {
                return width;
            } else {
                width = (elementBox instanceof ShapeElementBox && elementBox.textWrappingStyle !== "Inline") ? width : width + elementBox.width;
            }
            elementBox = elementBox.nextNode;
        }
        return width;
    }

    private getSplitIndexByWord(clientActiveWidth: number, text: string, width: number, characterFormat: WCharacterFormat, scriptType: FontScriptType): number {
        let index: number = 0;
        let length: number = text.length;
        while (index < length) {
            let nextIndex: number = this.getTextIndexAfterSpace(text, index);
            if (nextIndex === 0 || nextIndex === length) {
                nextIndex = length - 1;
            }
            let splitWidth: number = width;
            if ((nextIndex < length - 1 || (nextIndex === length - 1 && text[nextIndex - 1] === ' ')) && index !== nextIndex) {
                splitWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.slice(0, nextIndex), characterFormat, scriptType);
            }
            if (splitWidth <= clientActiveWidth) {
                index = nextIndex;
            } else {
                if (index === 0 && text[0] === ' ') {
                    index = this.getTextIndexAfterSpace(text, 0);
                }
                break;
            }
        }
        return index;
    }
    private getTextSplitIndexByCharacter(totalClientWidth: number, clientActiveAreaWidth: number, text: string, width: number, characterFormat: WCharacterFormat, scriptType: FontScriptType): number {
        let length: number = text.length;
        for (let i: number = 0; i < length; i++) {
            let splitWidth: number = width;
            if (i + 1 < length) {
                splitWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.substring(0, i + 1), characterFormat, scriptType);
            }
            if (splitWidth > clientActiveAreaWidth) {
                if (i === 0 && splitWidth > totalClientWidth) {
                    //Handle for cell/section having client width less than a character's width.
                    return (length > 1 && text[1] === ' ') ? this.getTextIndexAfterSpace(text, 1) : 1;
                } else if (text[i] === ' ') {
                    // If the character is space, then split the text from next character.
                    return this.getTextIndexAfterSpace(text, i);
                }
                return i;
            }
        }
        return 0;
    }
    private getSubWidth(lineWidget: LineWidget, justify: boolean, spaceCount: number, firstLineIndent: number, isParagraphEnd: boolean): SubWidthInfo[] {
        let width: number = 0;
        let trimSpace: boolean = true;
        let lineText: string = '';
        let trimmedSpaceWidth: number = 0;
        let isBidi: boolean = lineWidget.paragraph.paragraphFormat.bidi;
        if (this.wrapPosition.length > 0) {
            let subWidths: SubWidthInfo[] = this.getSubWidthBasedOnTextWrap(lineWidget, justify, spaceCount, firstLineIndent, isParagraphEnd);
            if (subWidths.length > 0) {
                return subWidths;
            }
        }
        let renderElementBox: ElementBox[] = lineWidget.renderedElements;
        for (let i: number = renderElementBox.length - 1; i >= 0; i--) {
            let element: ElementBox = renderElementBox[i];
            if (element.width > 0 && element instanceof TextElementBox) {
                let elementText: string = (element as TextElementBox).text;
                lineText = elementText + lineText;
                if (justify && isBidi) {
                    if (elementText === ' ' && i - 1 >= 0 && (renderElementBox[i - 1] as TextElementBox).text === ' ') {
                        trimSpace = true;
                    }
                    else {
                        trimSpace = false;
                    }
                }
                if (trimSpace && (elementText.trim() !== '' || elementText === '\t')) {
                    if (HelperMethods.endsWith(elementText)) {
                        let widthExcludeSpace: number = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(elementText, element.characterFormat, (element as TextElementBox).scriptType);
                        width += widthExcludeSpace;
                        // Trimmed space width can be found by subtracting the actual width and width exclude end space.
                        trimmedSpaceWidth += element.width - widthExcludeSpace;
                    } else {
                        width += element.width;
                    }
                    trimSpace = false;
                } else if (!trimSpace) {
                    width += element.width;
                } else {
                    ////Add the width of the textelement which contains space alone and present at end of the line.
                    trimmedSpaceWidth += element.width;
                }
            } else {
                lineText = 'a' + lineText;
                trimSpace = false;
                if (element instanceof ShapeBase && element.textWrappingStyle !== 'Inline') {
                    continue;
                }
                width += element.width;
            }
            if (!justify) {
                width = Math.round(width);
            } else {
                width = width;
            }
        }
        let totalSpaceCount: number = lineText.length - HelperMethods.removeSpace(lineText).length;
        lineText = lineText.trim();
        spaceCount = lineText.length - HelperMethods.removeSpace(lineText).length;
        let subWidth: number = (this.viewer.clientArea.width - firstLineIndent - width);
        let totalSubWidth: number = (this.viewer.clientArea.width - firstLineIndent - (width + trimmedSpaceWidth));
        if (isBidi && justify) {
            if (totalSubWidth < 0) {
                trimmedSpaceWidth = -trimmedSpaceWidth;
            }
            else {
                subWidth = totalSubWidth;
            }
        }
        if ((subWidth <= 0 && !this.is2013Justification) || (spaceCount === 0 && justify && !isBidi)) {
            spaceCount = 0;
            subWidth = 0;
        } else if (justify) {
            // For justify alignment, element width will be updated based space count value.
            // So when the element is paragraph end, need to set space count to zero.
            if (!isParagraphEnd && spaceCount > 0 || (isParagraphEnd && this.is2013Justification && spaceCount > 0)) {
                subWidth = subWidth / spaceCount;
            } else {
                spaceCount = 0;
            }
        }
        ////Generally, trailing space of line should get trimmed, if alignment type is Right or Left.
        ////But, if right-to-left rendering is enabled and it is last line of paragraph than the trailing space should be preserved.
        ////So, subtracted the trimmedSpaceWidth from subWidth.
        else if (trimmedSpaceWidth > 0 && isBidi && isParagraphEnd) {
            subWidth -= trimmedSpaceWidth;
        }
        // So set sub width to zero to layout the element in left alignment
        // Need to remove is once after implementing subwidth update separatly
        return [{ 'trimmedSpaceWidth':trimmedSpaceWidth, 'subWidth': subWidth, 'spaceCount': spaceCount, 'totalSpaceCount': totalSpaceCount  }];
    }

    private getSubWidthBasedOnTextWrap(lineWidget: LineWidget, justify: boolean, spaceCount: number, firstLineIndent: number, isParagraphEnd: boolean): SubWidthInfo[] {
        let subWidths: SubWidthInfo[] = [];
        let width: number = 0;
        let lineContent: string = '';
        let wrapIndex: number = this.wrapPosition.length - 1;
        let trimSpace: boolean = true;
        for (let z: number = lineWidget.children.length - 1; z >= 0; z--) {
            let elementBox: ElementBox = lineWidget.children[z];
            if (elementBox.width > 0 && elementBox instanceof TextElementBox) {
                let elementText: string = (elementBox as TextElementBox).text;
                lineContent = elementText + lineContent;
                if (trimSpace && (elementText.trim() !== '' || elementText === '\t')) {
                    if (HelperMethods.endsWith(elementText)) {
                        width += this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(elementText, elementBox.characterFormat, elementBox.scriptType);
                    } else {
                        width += elementBox.width;
                    }
                    trimSpace = false;
                } else if (!trimSpace) {
                    width += elementBox.width;
                }
            } else {
                lineContent = 'a' + lineContent;
                trimSpace = false;
                if (!(elementBox instanceof ShapeBase && elementBox.textWrappingStyle !== 'Inline')) {
                    width += elementBox.width;
                }
            }
            if ((elementBox.padding.left > 0 || z === 0) && (wrapIndex >= 0)) {
                let wrapPosition: WrapPosition = this.wrapPosition[wrapIndex--];
                while (wrapPosition.width <= 0 && (wrapIndex >= 0)) {
                    wrapPosition = this.wrapPosition[wrapIndex--];
                }
                let info: SubWidthInfo = this.getSubWidthInfo(lineWidget, wrapPosition.width, width, lineContent, spaceCount, justify, isParagraphEnd);
                if (!isNullOrUndefined(info)) {
                    width = 0;
                    lineContent = '';
                    subWidths.unshift(info);
                }
            }
        }
        return subWidths;
    }
    /* eslint-disable  */
    private isWordFittedByJustification(element: TextElementBox, nextWordWidth: number): boolean {
        let line: LineWidget = element.line;
        let paragraph: ParagraphWidget = line.paragraph;
        let paraFormat: WParagraphFormat = paragraph.paragraphFormat;
        let textAlignment: TextAlignment = paraFormat.textAlignment;
        let isParagraphEnd: boolean = line.isLastLine();
        let firstLineIndent: number = 0;
        if (line.isFirstLine()) {
            firstLineIndent = HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        let availableLineWidth: number = this.viewer.clientActiveArea.width;
        if (nextWordWidth != 0 && availableLineWidth >= nextWordWidth / 2) {
            let whiteSpaceCount: number = 0;
            let widthInfo: SubWidthInfo[];
            let totalSpaceCount: number = 0;
            if (textAlignment !== 'Left' && this.viewer.textWrap && (!(textAlignment === 'Justify' && isParagraphEnd)
                || (textAlignment === 'Justify' && paraFormat.bidi) || (this.is2013Justification && isParagraphEnd))) {
                widthInfo = this.getSubWidth(line, textAlignment === 'Justify', whiteSpaceCount, firstLineIndent, isParagraphEnd);
                whiteSpaceCount = widthInfo[0].spaceCount;
                totalSpaceCount = widthInfo[0].totalSpaceCount;
            }
            if (!isNullOrUndefined(widthInfo) && widthInfo.length == 1 && availableLineWidth > 0
                && textAlignment === 'Justify' && this.documentHelper.compatibilityMode === 'Word2013' && !this.is2013Justification 
                && paraFormat.rightIndent === 0 && paraFormat.leftIndent === 0) {
                let effectiveWidth: number = 0;
                let totalSpaceWidth: number = this.getTotalSpaceWidth(line, totalSpaceCount);
                let normalWidth: number = totalSpaceWidth / totalSpaceCount;
                let justifyWidth: number = (availableLineWidth + totalSpaceWidth) / totalSpaceCount;
                let diffFactor: number = ((justifyWidth - normalWidth) / normalWidth) * 100;

                if (diffFactor <= 33) {
                    effectiveWidth = totalSpaceWidth / 8;
                } else {
                    effectiveWidth = totalSpaceWidth / 4;
                }

                if (availableLineWidth + effectiveWidth >= nextWordWidth) {
                    this.viewer.clientActiveArea.x -= effectiveWidth;
                    this.viewer.clientActiveArea.width += effectiveWidth;
                    this.is2013Justification = true;
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns the total space width in line widget.
     * @param {LineWidget} lineWidget - the line widget 
     * @param {number} count - the space count to be considered.
     * @returns {number} the total space width.
     */
     private getTotalSpaceWidth(lineWidget: LineWidget, count?: number): number {
        let totalSpaceWidth: number = 0;
        let totalSpaceCount: number = 0;
        if (lineWidget) {
            for (let i = 0; i < lineWidget.children.length; i++) {
                let currentWidget: ElementBox = lineWidget.children[i];
                if (currentWidget instanceof TextElementBox) {
                    let spaceCount: number = currentWidget.text.length - HelperMethods.removeSpace(currentWidget.text).length;
                    if (spaceCount > 0) {
                        let spaceWidth: number = this.documentHelper.textHelper.getWidth(' ', currentWidget.characterFormat, currentWidget.scriptType);
                        totalSpaceWidth += spaceCount * spaceWidth;
                        totalSpaceCount += spaceCount;
                    }
                }
                if (!isNullOrUndefined(count) && totalSpaceCount >= count) {
                    break;
                }
            }
        }
        return totalSpaceWidth;
    }
    private getSubWidthInfo(lineWidget: LineWidget, lastWrapPositionWidth: number, width: number, lineContent: string, spaceCount: number, justify: boolean, isParagraphEnd: boolean): SubWidthInfo {
        if (lastWrapPositionWidth > 0) {
            let wrappedSubWidth: number = lastWrapPositionWidth - width;
            lineContent = lineContent.trim();
            spaceCount = lineContent.length - HelperMethods.removeSpace(lineContent).length;
            // TODO: Consider first line indent.
            let totalSubWidth: number = wrappedSubWidth;
            if (totalSubWidth <= 0 || (spaceCount === 0 && justify && !lineWidget.paragraph.paragraphFormat.bidi)) {
                spaceCount = 0;
                totalSubWidth = 0;
            } else if (justify) {
                // For justify alignment, element width will be updated based space count value.
                // So when the element is paragraph end, need to set space count to zero.
                if (!isParagraphEnd && spaceCount > 0) {
                    totalSubWidth = totalSubWidth / spaceCount;
                } else {
                    spaceCount = 0;
                }
            }
            return { 'trimmedSpaceWidth': 0 ,'subWidth': totalSubWidth, 'spaceCount': spaceCount, 'totalSpaceCount': spaceCount };
        }
        return undefined;
    }

    public getBeforeSpacing(paragraph: ParagraphWidget, pageIndex?: number): number {
        let beforeSpacing: number = 0;

        if (!this.documentHelper.dontUseHtmlParagraphAutoSpacing) {
            let previousBlock: BlockWidget = paragraph.previousWidget as BlockWidget;
            if (previousBlock instanceof ParagraphWidget) {
                let afterSpacing: number = this.getAfterSpacing(previousBlock);
                let before: number = paragraph.paragraphFormat.beforeSpacing;
                if (paragraph.paragraphFormat.spaceBeforeAuto) {
                    before = 14;
                }
                if (afterSpacing < before) {
                    beforeSpacing = before - afterSpacing;
                }
            } else if (previousBlock instanceof TableWidget) {
                if (paragraph.paragraphFormat.spaceBeforeAuto) {
                    beforeSpacing = 14;
                } else {
                    beforeSpacing = paragraph.paragraphFormat.beforeSpacing;
                }
            } else {
                if (pageIndex > 0 && paragraph === paragraph.bodyWidget.childWidgets[0]) {
                    if (this.documentHelper.pages[pageIndex].sectionIndex !== this.documentHelper.pages[pageIndex - 1].sectionIndex) {
                        if (paragraph.paragraphFormat.spaceBeforeAuto) {
                            beforeSpacing = 14;
                        } else {
                            beforeSpacing = paragraph.paragraphFormat.beforeSpacing;
                        }
                    }
                } else {
                    if (paragraph.paragraphFormat.spaceBeforeAuto) {
                        beforeSpacing = 0;
                    } else {
                        beforeSpacing = paragraph.paragraphFormat.beforeSpacing;
                    }
                }
            }
        } else {
            beforeSpacing = paragraph.paragraphFormat.beforeSpacing;
        }
        if (this.isSameStyle(paragraph, false)) {
            return 0;
        } else {
            return HelperMethods.convertPointToPixel(beforeSpacing);
        }
    }

    public getAfterSpacing(paragraph: ParagraphWidget): number {
        let afterSpacing: number = paragraph.paragraphFormat.afterSpacing;
        if (!this.documentHelper.dontUseHtmlParagraphAutoSpacing && paragraph.paragraphFormat.spaceAfterAuto) {
            if (isNullOrUndefined(paragraph.nextWidget) && paragraph.isInsideTable) {
                afterSpacing = 0;
            } else {
                afterSpacing = 14;
            }
        }
        if (this.isSameStyle(paragraph, true)) {
            return 0;
        } else {
            return afterSpacing;
        }
    }

    public getLineSpacing(paragraph: ParagraphWidget, maxHeight: number, alterLineSpacing?: boolean): number {
        if (isNullOrUndefined(paragraph.paragraphFormat)) {
            return 0;
        }
        let lineSpacing: number = 0;
        switch (paragraph.paragraphFormat.lineSpacingType) {
            case 'AtLeast':
            case 'Exactly':
                lineSpacing = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.lineSpacing);
                break;
            default:
                lineSpacing = paragraph.paragraphFormat.lineSpacing;
                if (alterLineSpacing) {
                    lineSpacing = lineSpacing - 1;
                }
                lineSpacing = lineSpacing * maxHeight;
                break;
        }
        return lineSpacing;
    }
    private isParagraphFirstLine(paragraph: ParagraphWidget, line: LineWidget): boolean {
        let widget: Widget = paragraph;
        if (isNullOrUndefined(widget.childWidgets) || widget.childWidgets.indexOf(line) === 0) {
            //If the line elements conatins the elements from previous paragraph then need to retun false.
            //Example scenario, Field start and field end in different paragraphs.
            if (line.children.length > 0 && !isNullOrUndefined(paragraph.previousWidget)
                && paragraph.previousWidget instanceof ParagraphWidget) {
                return line.paragraph.index !== paragraph.previousWidget.index;
            }
            return true; //If the line elements count is zero then also need to return true.
        }
        return false;
    }

    private isParagraphLastLine(element: ElementBox): boolean {
        let paragraph: ParagraphWidget = element.line.paragraph;
        let lastLineWidget: LineWidget = paragraph.childWidgets[paragraph.childWidgets.length - 1] as LineWidget;
        let lastInline: ElementBox = lastLineWidget.children[lastLineWidget.children.length - 1];
        if (element === lastInline) {
            return (lastInline instanceof FieldElementBox) || ((!(lastInline instanceof TextElementBox && (lastInline as TextElementBox).text === '\v')));
        }
        return false;
    }

    private getTextIndexAfterSpace(text: string, startIndex: number): number {
        let length: number = text.length;
        let index: number = 0;
        let hyphenIndex: number = 0;
        index = text.indexOf(' ', startIndex) + 1;
        hyphenIndex = text.indexOf('-', startIndex) + 1;
        if(hyphenIndex == 1){
            hyphenIndex = text.indexOf('-', (hyphenIndex + 1)) + 1;
        }
        if(hyphenIndex > 0 && index > 0){
        index = Math.min(index, hyphenIndex);
        } else if(hyphenIndex > 0 && index == 0){
            index = hyphenIndex;
        }
        let nextIndex: number = index;
        if (nextIndex === 0 || nextIndex === length) {
            return nextIndex;
        }
        while (text[nextIndex] === ' ') {
            nextIndex++;
            if (nextIndex === length) {
                break;
            }
        }
        return nextIndex;
    }
    //#region Table
    public moveNextWidgetsToTable(tableWidget: TableWidget[], currentRow: TableRowWidget, moveFromNext: boolean): void {
        let rowIndex: number = currentRow.indexInOwner;
        let currentTable: TableWidget = tableWidget[tableWidget.length - 1];
        if (moveFromNext) {
            rowIndex += 1;
        }
        let nextWidgets: TableRowWidget[] = currentRow.containerWidget.childWidgets.splice(rowIndex) as TableRowWidget[];
        for (let i: number = 0; i < nextWidgets.length; i++) {
            currentTable.childWidgets.push(nextWidgets[i]);
            nextWidgets[i].containerWidget = currentTable;
        }
    }

    private addTableCellWidget(cell: TableCellWidget, area: Rect, maxCellMarginTop: number, maxCellMarginBottom: number): Widget {
        //let tableCellWidget: TableCellWidget = new TableCellWidget(cell);
        let prevColumnIndex: number = 0;
        let cellspace: number = 0;
        let left: number = 0;
        let top: number = maxCellMarginTop;
        let right: number = 0;
        let bottom: number = maxCellMarginBottom;
        if (!isNullOrUndefined(cell.cellFormat)) {
            if (cell.cellFormat.containsMargins()) {
                left = isNullOrUndefined(cell.cellFormat.leftMargin) ? HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.leftMargin) : HelperMethods.convertPointToPixel(cell.cellFormat.leftMargin);
                right = isNullOrUndefined(cell.cellFormat.rightMargin) ? HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.rightMargin) : HelperMethods.convertPointToPixel(cell.cellFormat.rightMargin);
            } else {
                if (cell.columnIndex === 0 && cell.ownerRow.rowFormat.hasValue('leftMargin')) {
                    left = HelperMethods.convertPointToPixel(cell.ownerRow.rowFormat.leftMargin);
                } else {
                    left = HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.leftMargin);
                }
                if (cell.columnIndex === cell.ownerTable.tableHolder.columns.length - 1 &&
                    cell.ownerRow.rowFormat.hasValue('rightMargin')) {
                    right = HelperMethods.convertPointToPixel(cell.ownerRow.rowFormat.rightMargin);
                } else {
                    right = HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.rightMargin);
                }
            }
        }
        cellspace = !isNullOrUndefined(cell.ownerTable) && !isNullOrUndefined(cell.ownerTable.tableFormat) ? HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing) : 0;
        if (cellspace === 0 && cell.ownerTable.isContainInsideTable && !cell.ownerTable.header) {
            const topBorder: WBorder = TableCellWidget.getCellTopBorder(cell);
            if (cell.topMargin === 0 && topBorder.lineWidth === 0.75) {
                top += HelperMethods.convertPointToPixel(0.5);
            }
            const leftBorder: WBorder = TableCellWidget.getCellLeftBorder(cell);
            if (cell.leftMargin <= 0.5 && leftBorder.lineWidth === 0.75) {
                left += HelperMethods.convertPointToPixel(0.8);
            }
        }
        cell.margin = new Margin(left, top, right, bottom);
        let autofit: boolean = cell.ownerTable.tableFormat.allowAutoFit;
        let cellWidth: number = cell.cellFormat.cellWidth;
        if (cell.cellFormat.preferredWidthType === 'Percent' && cell.cellFormat.preferredWidth !== 0 && cellWidth <= 0) {
            let width: number = HelperMethods.convertPointToPixel(cell.ownerTable.getTableClientWidth(cell.ownerTable.getContainerWidth()));
            cellWidth = cell.ownerTable.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, width, cell);
        }
        // if (cellWidth > cell.cellFormat.preferredWidth && cell.cellFormat.preferredWidth !== 0 && cell.cellFormat.preferredWidthType !== 'Percent' && cell.ownerTable.tableFormat.preferredWidthType !== 'Percent' && isNullOrUndefined(cell.ownerTable.positioning) && (!cell.ownerTable.isContainInsideTable) && (!(cell.ownerTable.containerWidget instanceof TableCellWidget))) {
        //     cellWidth = cell.cellFormat.preferredWidth;
        // }
        cell.width = HelperMethods.convertPointToPixel(cellWidth);
        if (!isNullOrUndefined(cell.previousWidget)) {
            prevColumnIndex = (cell.previousWidget as TableCellWidget).columnIndex + (cell.previousWidget as TableCellWidget).cellFormat.columnSpan;
        }
        let prevSpannedCellWidth: number = 0;
        if (prevColumnIndex < cell.columnIndex) {
            prevSpannedCellWidth = HelperMethods.convertPointToPixel(cell.ownerTable.tableHolder.getPreviousSpannedCellWidth(prevColumnIndex, cell.columnIndex));
            if (prevColumnIndex === 0) {
                prevSpannedCellWidth = prevSpannedCellWidth - cellspace / 2;
            }
        }
        cell.x = area.x + prevSpannedCellWidth + cell.margin.left;
        cell.y = area.y + cell.margin.top + cellspace;
        cell.width = cell.width - cell.margin.left - cell.margin.right;
        if (cellspace > 0) {
            cell.x += cellspace;
            if (cell.ownerTable.tableHolder.columns.length === 1) {
                cell.width -= cellspace * 2;
            } else if (cell.columnIndex === 0 || cell.columnIndex === cell.ownerTable.tableHolder.columns.length - 1) {
                cell.width -= ((cellspace * 2) - cellspace / 2);
            } else {
                cell.width -= cellspace;
            }
        }
        let leftBorderWidth: number = HelperMethods.convertPointToPixel(TableCellWidget.getCellLeftBorder(cell).getLineWidth());
        let rightBorderWidth: number = HelperMethods.convertPointToPixel(TableCellWidget.getCellRightBorder(cell).getLineWidth());
        // update the margins values respect to layouting of borders.
        // for normal table cells only left border is rendred. for last cell left and right border is rendred.
        // this border widths are not included in margins.
        let linestyle: boolean = false;
        cell.leftBorderWidth = !cell.ownerTable.isBidiTable ? leftBorderWidth : rightBorderWidth;
        let isLeftStyleNone: boolean = (cell.cellFormat.borders.left.lineStyle === 'None');
        let isRightStyleNone: boolean = (cell.cellFormat.borders.right.lineStyle === 'None');
        cell.x += (!isLeftStyleNone) ? 0 : (cell.leftBorderWidth > 0) ? 0 : cell.leftBorderWidth;
        cell.width -= (!isLeftStyleNone) ? 0 : (cell.leftBorderWidth > 0) ? 0 : cell.leftBorderWidth;
        let lastCell: boolean = !cell.ownerTable.isBidiTable ? cell.cellIndex === cell.ownerRow.childWidgets.length - 1
            : cell.cellIndex === 0;
        if (cellspace > 0 || cell.columnIndex === cell.ownerTable.tableHolder.columns.length - 1 ||
            cell.index === (cell.containerWidget as TableRowWidget).childWidgets.length - 1) {
            cell.rightBorderWidth = !cell.ownerTable.isBidiTable ? rightBorderWidth : leftBorderWidth;
            if (!cell.ownerTable.tableFormat.allowAutoFit) {
                cell.width -= cell.rightBorderWidth;
            }
            if (!this.isInsertTable()) {
                linestyle = this.checkPreviousMargins(cell.ownerTable);
            }
        }
        //Add the border widths to respective margin side.
        //cell.margin.left += (isLeftStyleNone) ? 0 : (cell.leftBorderWidth);
        cell.margin.right += (isRightStyleNone && !linestyle) ? 0 : (cell.rightBorderWidth);
        //cell.ownerWidget = owner;
        return cell;
    }
    private checkPreviousMargins(table: TableWidget): boolean {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[row.childWidgets.length - 1] as TableCellWidget;
                if (cell.cellFormat.borders.right.lineStyle !== 'None') {
                    return true;
                }
            }
        }
        return false;
    }
    private addWidgetToTable(viewer: LayoutViewer, tableCollection: TableWidget[], rowCollection: TableRowWidget[], row: TableRowWidget, footnotes: FootnoteElementBox[], endRowWidget?: TableRowWidget, isInitialLayout?: boolean, startRowIndex?: number, isRepeatRowHeader?: boolean): void {
        //Adds table row widget to owner table widget.
        let tableWidget: TableWidget = tableCollection[0] as TableWidget;
        let index: number = tableWidget.childWidgets.length;
        let prevWidget: TableRowWidget = undefined;
        let rowWidgetIndex: number = rowCollection.indexOf(row);
        let footnoteWidgets: BodyWidget[] = [];
        if (rowWidgetIndex > 0) {
            prevWidget = rowCollection[rowWidgetIndex - 1] as TableRowWidget;
            // Need to update on this further
        } else if (row.previousRenderedWidget instanceof TableRowWidget &&
            row.previousRenderedWidget.ownerTable.equals(row.ownerTable)) {
            // Need to update on this further
            prevWidget = row.previousRenderedWidget as TableRowWidget;
        }
        if (!isNullOrUndefined(prevWidget)) {
            tableWidget = prevWidget.containerWidget as TableWidget;
            // index = tableWidget.childWidgets.length;
            index = tableWidget.childWidgets.indexOf(prevWidget) + 1;
            if (Math.round(row.y) !== Math.round(prevWidget.y + prevWidget.height)) {
                let prevIndex: number = tableCollection.indexOf(tableWidget);
                if (prevIndex + 1 >= tableCollection.length) {
                    //Creates new table widget for splitted rows.
                    this.addTableWidget(viewer.clientActiveArea, tableCollection, true);
                }
                tableWidget = tableCollection[prevIndex + 1] as TableWidget;
                index = tableWidget.childWidgets.length;
            }
            if (rowWidgetIndex > 0) {
                index = 0;
            }
        }
        this.updateRowHeightBySpannedCell(tableWidget, row, index);
        this.updateRowHeightByCellSpacing(tableCollection, row, viewer);
        //Remove widget from previous container after splitteing
        if (row.containerWidget && row.containerWidget !== tableWidget &&
            row.containerWidget.childWidgets.indexOf(row) !== -1) {
            row.containerWidget.childWidgets.splice(row.containerWidget.childWidgets.indexOf(row), 1);
        }
        if (tableWidget.childWidgets.indexOf(row) === -1) {
            tableWidget.childWidgets.splice(index, 0, row);
            if (isRepeatRowHeader) {
                tableWidget.bodyWidget.page.repeatHeaderRowTableWidget = true;
            }
        }
        row.containerWidget = tableWidget;
        if (!row.ownerTable.isInsideTable) {
            if (footnotes.length > 0) {
                if (!isNullOrUndefined(footnotes)) {
                    footnoteWidgets = this.getFootnoteBody(footnotes);
                }
            } else {
                if (!isNullOrUndefined(row)) {
                    for (let i: number = 0; i < row.childWidgets.length; i++) {
                        let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                        for (let j: number = 0; j < cell.childWidgets.length; j++) {
                            let footnoteCollection: BodyWidget[] = this.getFootNoteWidgetsOf(cell.childWidgets[j] as BlockWidget, true);
                            for (let k: number = 0; k < footnoteCollection.length; k++) {
                                footnoteWidgets.splice(footnoteWidgets.length, 0, footnoteCollection[k]);
                            }
                        }
                    }
                }
            }
            if (footnoteWidgets.length > 0 && isNullOrUndefined(footnoteWidgets[0].containerWidget)) {
                this.layoutFootnoteInSplittedRow(row, footnoteWidgets);
            } else if (!isNullOrUndefined(footnoteWidgets) && footnoteWidgets.length > 0 && row.bodyWidget.previousRenderedWidget !== undefined && startRowIndex !== row.bodyWidget.page.index && (footnoteWidgets[0].containerWidget as FootNoteWidget).page.index !== row.bodyWidget.page.index) {
                this.moveFootNotesToPage(footnoteWidgets, (footnoteWidgets[0].containerWidget as FootNoteWidget).page.bodyWidgets[0], row.bodyWidget);
            } else if (footnoteWidgets.length > 0 && !this.isInitialLoad && !isNullOrUndefined(row.bodyWidget.page.footnoteWidget)) {
                this.layoutfootNote(row.bodyWidget.page.footnoteWidget);
            }
            footnotes.length = 0;
        }
        tableWidget.height = tableWidget.height + row.height;
        if (this.viewer instanceof PageLayoutViewer) {
            if (!isNullOrUndefined(tableWidget.containerWidget)
                && tableWidget.containerWidget.childWidgets.indexOf(tableWidget) >= 0 &&
                !(tableWidget.containerWidget instanceof HeaderFooterWidget)) {
                tableWidget.containerWidget.height += row.height;
            }
        }
        this.updateHeightForRowWidget(viewer, false, tableCollection, rowCollection, row, false, endRowWidget, isInitialLayout);
        viewer.cutFromTop(row.y + row.height);
        this.viewer.clientActiveArea.height -= this.getFootNoteHeight(footnoteWidgets);
        if (!row.ownerTable.isInsideTable) {
            this.existFootnoteHeight = 0;
        }
    }
    private layoutFootnoteInSplittedRow(row: TableRowWidget, footnoteWidgets: BodyWidget[]): void {
        if (footnoteWidgets && footnoteWidgets.length > 0) {
            if (isNullOrUndefined(row.ownerTable.bodyWidget.page.footnoteWidget)) {
                this.addEmptyFootNoteToBody(row.ownerTable.bodyWidget);
            }
            let footnoteWidget: FootNoteWidget = row.ownerTable.bodyWidget.page.footnoteWidget;
            if (footnoteWidget) {
                for (let j: number = 0; j < footnoteWidgets.length; j++) {
                    footnoteWidget.bodyWidgets.push(footnoteWidgets[j]);
                    footnoteWidgets[j].containerWidget = footnoteWidget;
                }
                this.layoutfootNote(footnoteWidget);
            }
        }
    }
    private getFootNoteHeight(footnoteWidgets: BodyWidget | BodyWidget[]): number {
        let height: number = 0;
        if (Array.isArray(footnoteWidgets)) {
            for (let i: number = 0; i < footnoteWidgets.length; i++) {
                height += this.getFootnoteHeightInternal(footnoteWidgets[i], i);
            }
        } else {
            height = this.getFootnoteHeightInternal(footnoteWidgets, 0);
        }
        return height;
    }
    private getFootnoteHeightInternal(footnoteWidgets: BodyWidget, index: number): number {
        let height: number = 0;
        for (let i: number = 0; i < footnoteWidgets.childWidgets.length; i++) {
            height += (footnoteWidgets.childWidgets[i] as BlockWidget).height;
            if ((footnoteWidgets.indexInOwner === 0 || (footnoteWidgets.indexInOwner !== -1 && footnoteWidgets.containerWidget
                && this.existFootnoteHeight === 0 && index === 0)) && i === 0) {
                height += footnoteWidgets.containerWidget.margin.top;
            }
        }
        return height;
    }
    public updateRowHeightBySpannedCell(tableWidget: TableWidget, row: TableRowWidget, insertIndex: number): void {
        let rowSpan: number = 1;
        if (tableWidget.childWidgets.length === 0 || insertIndex === 0) {
            this.updateRowHeight(row, row);
            return;
        }
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            rowSpan = (isNullOrUndefined(cellWidget) || isNullOrUndefined(cellWidget.cellFormat)) ? rowSpan : cellWidget.cellFormat.rowSpan;
            this.updateSpannedRowCollection(rowSpan, row, cellWidget);
        }
        if (!isNullOrUndefined(row.ownerTable)) {
            for (let i: number = 0; i < row.ownerTable.spannedRowCollection.length; i++) {
                if (row.ownerTable.spannedRowCollection.keys[i] === row.index) {
                    // Back track to previous table row widgets and update it height if vertical merge ends with this row.
                    for (let j: number = 0; j < insertIndex; j++) {
                        let prevRowWidget: TableRowWidget = tableWidget.childWidgets[j] as TableRowWidget;
                        this.updateRowHeight(prevRowWidget, row);
                    }
                    row.ownerTable.spannedRowCollection.remove(row.ownerTable.spannedRowCollection.keys[i]);
                    break;
                }
            }
        }
    }

    private updateRowHeight(prevRowWidget: TableRowWidget, row: TableRowWidget): void {
        let rowIndex: number = row.index;
        let rowSpan: number = 1;
        for (let i: number = 0; i < prevRowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = prevRowWidget.childWidgets[i] as TableCellWidget;
            rowSpan = (isNullOrUndefined(cellWidget) || isNullOrUndefined(cellWidget.cellFormat)) ? rowSpan : cellWidget.cellFormat.rowSpan;
            //To update Row height- if row has row span value greater than 1, need to add it in spannedRowCollection            
            this.updateSpannedRowCollection(rowSpan, row, cellWidget);
            if (rowIndex - cellWidget.rowIndex === rowSpan - 1) {
                let mergedCellHeight: number = cellWidget.y + cellWidget.height + cellWidget.margin.bottom - row.y;
                if ((row.rowFormat.heightType !== 'Exactly' || (row.rowFormat.heightType === 'Exactly' && row.rowFormat.height > mergedCellHeight)) && row.height < mergedCellHeight) {
                    row.height = mergedCellHeight;
                }
            }
        }
    }
    //if row has row span value greater than 1, need to add it in spannedRowCollection
    private updateSpannedRowCollection(rowSpan: number, row: TableRowWidget, cellWidget: TableCellWidget): void {
        if (rowSpan > 1 && !isNullOrUndefined(row.ownerTable)) {
            //Checks the rowspan is already exist in the list
            if (!row.ownerTable.spannedRowCollection.containsKey(row.index + rowSpan - 1)) {
                row.ownerTable.spannedRowCollection.add(row.index + rowSpan - 1, row.index);
            }
        }
    }
    private updateRowHeightByCellSpacing(tableCollection: TableWidget[], row: TableRowWidget, viewer: LayoutViewer): void {
        if (row.ownerTable.tableFormat.cellSpacing > 0) {
            // In the Case of tableWidget is greater than one and rowWidget is start at the Top Position of the page. 
            // In such case we have update the row height with half of cell spacing.
            // Remaining cases we have to update the entire hight
            if (tableCollection.length > 1 && row.y === viewer.clientArea.y && viewer instanceof PageLayoutViewer) {
                row.height = row.height - HelperMethods.convertPointToPixel(row.ownerTable.tableFormat.cellSpacing) / 2;
            }
        }
    }

    private isRowSpanEnd(row: TableRowWidget, viewer: LayoutViewer): boolean {
        let rowIndex: number = row.index;
        let rowSpan: number = 1;
        for (let i: number = 0; i < this.documentHelper.splittedCellWidgets.length; i++) {
            let splittedCell: TableCellWidget = this.documentHelper.splittedCellWidgets[i];
            rowSpan = (isNullOrUndefined(splittedCell) || isNullOrUndefined(splittedCell.cellFormat)) ? rowSpan : splittedCell.cellFormat.rowSpan;
            if (rowIndex - splittedCell.rowIndex === rowSpan - 1) {
                return true;
            }
        }
        return false;
    }

    public isVerticalMergedCellContinue(row: TableRowWidget): boolean {
        let colIndex: number = 0;
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            if (colIndex < cell.columnIndex) {
                return true;
            }
            colIndex += cell.cellFormat.columnSpan;
        }
        return colIndex < row.ownerTable.tableHolder.columns.length;
    }

    private splitWidgets(tableRowWidget: TableRowWidget, viewer: LayoutViewer, tableCollection: TableWidget[], rowCollection: TableRowWidget[], splittedWidget: TableRowWidget, isLastRow: boolean, footNoteCollection: FootnoteElementBox[], lineIndexInCell?: number, cellIndex?: number, isMultiColumnSplit?: boolean, isRowSpan?: boolean): TableRowWidget {
        if (!(isMultiColumnSplit && lineIndexInCell === 0) && (this.isFirstLineFitForRow(viewer.clientArea.bottom, tableRowWidget) && tableRowWidget.childWidgets.length > 0)) {
            splittedWidget = this.getSplittedWidgetForRow(viewer.clientArea.bottom, tableCollection, rowCollection, tableRowWidget, footNoteCollection, lineIndexInCell, isMultiColumnSplit, undefined, isRowSpan);
            footNoteCollection = [];
            if (this.documentHelper.splittedCellWidgets.length > 0 || splittedWidget !== tableRowWidget) {
                if (isLastRow) {
                    for (let i: number = 0; i < splittedWidget.childWidgets.length; i++) {
                        let cell: TableCellWidget = splittedWidget.childWidgets[i] as TableCellWidget;
                        if (cell.rowIndex !== splittedWidget.index) {
                            splittedWidget.childWidgets.splice(i, 1);
                            i--;
                        }
                    }
                }
                //Adds the splitted widget of a vertical merged cell, to next row widget in the next page.
                this.insertSplittedCellWidgets(viewer, tableCollection, splittedWidget, tableRowWidget.index - 1);
            }
        } else {
            //Adds the splitted widget of a vertical merged cell, to next row widget in the next page.
            this.insertSplittedCellWidgets(viewer, tableCollection, splittedWidget, tableRowWidget.index - 1);
        }
        return splittedWidget;
    }

    private getSplittedWidgetForRow(bottom: number, tableCollection: TableWidget[], rowCollection: TableRowWidget[], tableRowWidget: TableRowWidget, footNoteCollection: FootnoteElementBox[], lineIndexInCell?: number, isMultiColumnSplit?: boolean, count?: number, isRowSpan?: boolean): TableRowWidget {
        let splittedWidget: TableRowWidget = undefined;
        let rowIndex: number = tableRowWidget.index;
        this.isRelayoutneed = false;
        let issplit: boolean = false;
        let cellHeight: number = tableRowWidget.height;
        let previousHeight: number = cellHeight;
        let maximumCellWidgetHeight: number = 0;
        for (let i: number = 0; i < tableRowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = tableRowWidget.childWidgets[i] as TableCellWidget;
            if (i === 0 && cellWidget.childWidgets.length > 0 && cellWidget.columnIndex === 0
                && cellWidget.cellFormat.rowSpan === 1 && this.documentHelper.compatibilityMode === 'Word2013'
                && this.documentHelper.splittedCellWidgets.length === 0) {
                const firstBlock: ParagraphWidget = this.documentHelper.getFirstParagraphInCell(cellWidget as TableCellWidget);
                if (!isNullOrUndefined(firstBlock) && firstBlock.paragraphFormat.keepWithNext && !isNullOrUndefined(this.getPreviousBlock(tableRowWidget))) {
                    return tableRowWidget;
                }
            }
            let splittedCell: TableCellWidget = this.getSplittedWidget(bottom, true, tableCollection, rowCollection, cellWidget, footNoteCollection, lineIndexInCell, isMultiColumnSplit, count);
            if (isMultiColumnSplit && !isNullOrUndefined(splittedCell) && splittedCell.childWidgets.length !== 0 && cellHeight > cellWidget.height) {
                cellHeight = cellWidget.height;
            }
            if (!isNullOrUndefined(footNoteCollection) && footNoteCollection.length > 0) {
                for (let j = 0; j < footNoteCollection.length; j++) {
                    if (footNoteCollection[j].paragraph.containerWidget.indexInOwner === -1) {
                        footNoteCollection.splice(j, 1);
                    }
                }
            }
            if (isNullOrUndefined(splittedCell) && cellWidget === tableRowWidget.childWidgets[tableRowWidget.childWidgets.length - 1] && this.isRowSpanEnd(tableRowWidget, this.viewer) && this.documentHelper.splittedCellWidgets.length > 0 && isRowSpan) {
                splittedWidget = this.getSplittedWidgetForSpannedRow(bottom, tableRowWidget, tableCollection, rowCollection, footNoteCollection);
                splittedCell = undefined;
            }
            if (!isNullOrUndefined(splittedCell)) {
                if (splittedCell === cellWidget) {
                    // if the previous cell Widget is already splitted, in that case need to combine the splitted row widgets to single row widget.
                    if (rowCollection.length > 1) {
                        this.combineSplittedRowWidgets(rowCollection, previousHeight);
                    }
                    //Returns if the whole content of the row does not fit in current page.
                    return tableRowWidget;
                }
                let nestedCellHeight: number = 0;
                if (cellWidget.ownerTable.isInsideTable) {
                    for (let k: number = 0; k < cellWidget.childWidgets.length; k++) {
                        nestedCellHeight += (cellWidget.childWidgets[k] as BlockWidget).height;
                    }
                }
                if (cellWidget.ownerTable.isInsideTable) {
                    if (maximumCellWidgetHeight < nestedCellHeight) {
                        maximumCellWidgetHeight = nestedCellHeight;
                    }
                } else if (cellWidget.height > maximumCellWidgetHeight) {
                    maximumCellWidgetHeight = cellWidget.height;
                }
                if (tableRowWidget.childWidgets.indexOf(splittedCell) !== -1) {
                    tableRowWidget.childWidgets.splice(tableRowWidget.childWidgets.indexOf(splittedCell), 1);
                }
                tableRowWidget.height -= splittedCell.height;
                if (i === 0 || tableRowWidget.height < maximumCellWidgetHeight + cellWidget.margin.top + cellWidget.margin.bottom) {
                    tableRowWidget.height = maximumCellWidgetHeight + cellWidget.margin.top + cellWidget.margin.bottom;
                }
                if (isNullOrUndefined(splittedWidget)) {
                    //Creates new widget, to hold the splitted contents.
                    splittedWidget = new TableRowWidget();
                    splittedWidget.containerWidget = tableRowWidget.containerWidget;
                    splittedWidget.index = tableRowWidget.index;
                    splittedWidget.rowFormat = tableRowWidget.rowFormat;
                    splittedWidget.isRenderBookmarkEnd = tableRowWidget.isRenderBookmarkEnd;
                    this.updateWidgetLocation(tableRowWidget, splittedWidget);
                    // splittedWidget.height = 0;
                    rowCollection.push(splittedWidget);
                }
                let rowSpan: number = 1;
                rowSpan = (isNullOrUndefined(splittedCell) || isNullOrUndefined(splittedCell.cellFormat)) ? rowSpan : splittedCell.cellFormat.rowSpan;
                if (rowIndex - splittedCell.rowIndex === rowSpan - 1
                    && splittedWidget.height < splittedCell.height + splittedCell.margin.top + splittedCell.margin.bottom) {
                    splittedWidget.height = splittedCell.height + splittedCell.margin.top + splittedCell.margin.bottom;
                } else {
                    if (tableRowWidget.rowFormat.heightType === 'Exactly' || (tableRowWidget.rowFormat.heightType === 'AtLeast' &&
                        splittedWidget.height < tableRowWidget.rowFormat.height)) {
                        //Sets the height for row widget if height type is exact or at least.
                        splittedWidget.height = tableRowWidget.rowFormat.height;
                    }
                }
                splittedWidget.childWidgets.push(splittedCell);
                splittedCell.containerWidget = splittedWidget;
                this.isRelayoutneed = true;
                let count: number = i;
                while (count > 0 && !issplit) {
                    let cellWidget: TableCellWidget = tableRowWidget.childWidgets[count - 1] as TableCellWidget;
                     splittedCell= this.getSplittedWidget(bottom, true, tableCollection, rowCollection, cellWidget, footNoteCollection);
                     splittedWidget.childWidgets.splice(0 , 0, splittedCell);
                splittedCell.containerWidget = splittedWidget;
                    count--;
                    
                }
                issplit = true;
            }
        }
        if (isMultiColumnSplit && cellHeight !== previousHeight) {
            for (let i: number = 0; i < tableRowWidget.childWidgets.length; i++) {
                (tableRowWidget.childWidgets[i] as TableCellWidget).height = cellHeight;
            }
            tableRowWidget.height = cellHeight;
        }
        return splittedWidget;
    }

    private combineSplittedRowWidgets(rowCollection: TableRowWidget[], previousRowHeight: number): void {
        let existingRow: TableRowWidget = rowCollection[0];
        for (let i: number = 1; i < rowCollection.length; i++) {
            let row: TableRowWidget = rowCollection[i];
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let existingCell: TableCellWidget = existingRow.childWidgets[j] as TableCellWidget;
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                if (cell.childWidgets.length > 0) {
                    for (let k: number = 0; k < cell.childWidgets.length; k++) {
                        let block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                        if (block instanceof ParagraphWidget) {
                            let existingPara = existingCell.childWidgets[k] as ParagraphWidget;
                            if (existingPara.index === block.index) {
                                let paragraph: ParagraphWidget = block as ParagraphWidget;
                                if (paragraph.childWidgets.length > 0) {
                                    for (let l: number = 0; l < paragraph.childWidgets.length; l++) {
                                        let line: LineWidget = paragraph.childWidgets[l] as LineWidget;
                                        existingPara.childWidgets.push(line);
                                        line.paragraph = existingPara;
                                        existingPara.height += line.height;
                                    }
                                }
                            } else {
                                existingCell.childWidgets.push(block);
                                block.containerWidget = existingCell;
                            }
                            existingCell.height += block.height;
                        } else if (block instanceof TableWidget) {
                            existingCell.childWidgets.push(block);
                            block.containerWidget = existingCell;
                            existingCell.height += block.height;
                        }
                    }
                }
            }
            rowCollection.splice(i, 1);
        }
        existingRow.height = previousRowHeight;
    }

    private getSplittedWidgetForSpannedRow(bottom: number, tableRowWidget: TableRowWidget, tableCollection: TableWidget[], rowCollection: TableRowWidget[], footNoteCollection: FootnoteElementBox[]): TableRowWidget {
        let splittedWidget: TableRowWidget = undefined;
        let splittedCell: TableCellWidget = undefined;
        let issplit: boolean = false;
        let isNeedToInsertNextCell: boolean = false;
        for (let i: number = 0; i < this.documentHelper.splittedCellWidgets.length; i++) {
            splittedCell = this.documentHelper.splittedCellWidgets[i];
            let nextSplittedCell: TableCellWidget = this.documentHelper.splittedCellWidgets[i + 1];
            let nextSplittedCellColumnIndex: number = !isNullOrUndefined(nextSplittedCell) ? nextSplittedCell.columnIndex : 0;
            // splitted cell widget column index
            let previousColumnIndex: number = this.documentHelper.splittedCellWidgets[i].columnIndex;
            let splitCell: TableCellWidget = this.documentHelper.splittedCellWidgets[i];
            // previousColumnIndex value is updated based on the previous row spanned cell widgets.
            while (splitCell && splitCell.cellFormat.rowSpan === this.documentHelper.splittedCellWidgets[i].cellFormat.rowSpan && previousColumnIndex > 0 && !issplit) {
                previousColumnIndex = splitCell.columnIndex;
                let row: TableRowWidget = splitCell.containerWidget as TableRowWidget;
                splitCell = row.getCell(row.rowIndex, previousColumnIndex - 1);
            }

            // splitted cell widget column index
            let nextColumnIndex: number = this.documentHelper.splittedCellWidgets[i].columnIndex;
            splitCell = this.documentHelper.splittedCellWidgets[i];
            // nextColumnIndex value is updated based on the next row spanned cell widgets.
            while (splitCell && splitCell.cellFormat.rowSpan === this.documentHelper.splittedCellWidgets[i].cellFormat.rowSpan && nextColumnIndex < splitCell.containerWidget.childWidgets.length - 1 && (!issplit || isNeedToInsertNextCell)) {
                nextColumnIndex = splitCell.columnIndex;
                let row: TableRowWidget = splitCell.containerWidget as TableRowWidget;
                splitCell = row.getCell(row.rowIndex, nextColumnIndex + 1);
            }
            if (isNullOrUndefined(splittedWidget)) {
                splittedWidget = new TableRowWidget();
                splittedWidget.containerWidget = tableRowWidget.containerWidget;
                splittedWidget.index = tableRowWidget.index;
                splittedWidget.rowFormat = tableRowWidget.rowFormat;
                splittedWidget.isRenderBookmarkEnd = tableRowWidget.isRenderBookmarkEnd;
                this.updateWidgetLocation(tableRowWidget, splittedWidget);
                rowCollection.push(splittedWidget);
            }
            splittedWidget.childWidgets.push(splittedCell);
            splittedCell.containerWidget = splittedWidget;
            this.isRelayoutneed = true;

            // insert cell widgets to left of the splitted cell widget.
            while (previousColumnIndex > 0 && !issplit) {
                let cellWidget: TableCellWidget = tableRowWidget.getCell(tableRowWidget.index, previousColumnIndex - 1);
                if (isNullOrUndefined(cellWidget)) {
                    previousColumnIndex--;
                    continue;
                }
                splittedCell = this.getSplittedWidget(bottom, true, tableCollection, rowCollection, cellWidget, footNoteCollection);
                splittedWidget.childWidgets.splice(0, 0, splittedCell);
                splittedCell.containerWidget = splittedWidget;
                previousColumnIndex--;
            }

            // insert cell widgets to right of the splitted cell widget.
            while (nextColumnIndex < (tableRowWidget.childWidgets[tableRowWidget.childWidgets.length - 1] as TableCellWidget).columnIndex && (!issplit || isNeedToInsertNextCell)) {
                let cellWidget: TableCellWidget = tableRowWidget.getCell(tableRowWidget.index, nextColumnIndex + 1);
                if (isNullOrUndefined(cellWidget)) {
                    nextColumnIndex++;
                    continue;
                }
                // check whether the cellWidget column index is greater than the next splitted cell widget column index.
                // if so, then break the loop and insert the splitted cell widget and remaining cell widgets.
                if (nextSplittedCell && cellWidget.columnIndex > nextSplittedCellColumnIndex) {
                    isNeedToInsertNextCell = true;
                    break;
                }
                splittedCell = this.getSplittedWidget(bottom, true, tableCollection, rowCollection, cellWidget, footNoteCollection);
                splittedWidget.childWidgets.push(splittedCell);
                splittedCell.containerWidget = splittedWidget;
                nextColumnIndex++;
            }
            issplit = true;
        }
        return splittedWidget;
    }
    private getFootNoteHeightInLine(line: LineWidget): number {
        let height: number = 0;
        for (let i: number = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i] as ElementBox;
            if (element instanceof FootnoteElementBox) {
                height += this.getFootNoteHeight(element.bodyWidget);
            }
        }
        return height;
    }
    private getFootnoteFromLine(line: LineWidget, footNoteCollection: FootnoteElementBox[]): void {
        for(let i: number = 0; i < line.children.length; i++) {
            if(line.children[i] instanceof FootnoteElementBox) {
                footNoteCollection.push((line.children[i] as FootnoteElementBox));
            }
        }
    }

    public updateWidgetsToTable(tableWidgets: TableWidget[], rowWidgets: TableRowWidget[], row: TableRowWidget, rearrangeRow: boolean, lineIndexInCell?: number, cellIndex?: number, isMultiColumnSplit?: boolean): void {
        let startRowIndex: number = row.bodyWidget.page.index;
        let rowHeight: number = this.getRowHeight(row, [row]);
        let viewer: LayoutViewer = this.viewer;
        //initializing row properties with default values.
        let isHeader: boolean = row.rowFormat.isHeader;
        let headerRow: TableRowWidget = undefined;
        let isAllowBreakAcrossPages: boolean = row.rowFormat.allowBreakAcrossPages;
        let heightType: HeightType = row.rowFormat.heightType;
        let cellSpacing: number = 0;
        let count: number = 0;
        let tableRowWidget: TableRowWidget = row;
        let moveRowToNextTable: boolean = false;
        let footnoteElements = this.layoutedFootnoteElement;
        let isRepeatRowHeader: boolean = false;
        if(tableRowWidget.bodyWidget.page.footnoteWidget !== undefined) {
            this.footHeight = this.getFootNoteHeight(tableRowWidget.bodyWidget.page.footnoteWidget.bodyWidgets);
            if(this.footnoteHeight === 0) {
                this.footnoteHeight = this.footHeight;
            }
        } else {
            this.footHeight = 0;
        }
        if (row.ownerTable.continueHeader && !isHeader) {
            row.ownerTable.continueHeader = false;
        }
        let isInitialLayout: boolean = row.ownerTable.isInsideTable;
        let isLastRow: boolean = false;
        cellSpacing = (!isNullOrUndefined(row.ownerTable) && !isNullOrUndefined(row.ownerTable.tableFormat)) ? HelperMethods.convertPointToPixel(row.ownerTable.tableFormat.cellSpacing) : 0;
        while (count < rowWidgets.length) {
            count = rowWidgets.length;
            if (this.isRowSpanEnd(row, viewer) && row.rowFormat.heightType === 'Exactly' && this.documentHelper.splittedCellWidgets.length === 1) {
                this.documentHelper.splittedCellWidgets = [];
            }
            if (!isMultiColumnSplit && (row.ownerTable.isInsideTable || (this.documentHelper.splittedCellWidgets.length === 0 && tableRowWidget.y + tableRowWidget.height + cellSpacing + this.footHeight <= viewer.clientArea.bottom))) {
                if (this.isVerticalMergedCellContinue(row) && (tableRowWidget.y === viewer.clientArea.y
                    || tableRowWidget.y === this.viewer.clientArea.y + tableRowWidget.ownerTable.headerHeight)) {
                    this.insertSplittedCellWidgets(viewer, tableWidgets, tableRowWidget, tableRowWidget.index - 1);
                }
                this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements, undefined, isInitialLayout, startRowIndex, isRepeatRowHeader);
                if (!isNullOrUndefined(row.bodyWidget) && row.bodyWidget instanceof BodyWidget && this.documentHelper.splittedCellWidgets.length > 0 && isNullOrUndefined(rowWidgets[rowWidgets.length - 1].nextRow)) {
                    count--;
                    isLastRow = true;
                // If the entire split cell widget does not fit on the current page, we should consider splitting the row again. This is why we check that the next row is not the end of a row span, and we decrease the count value accordingly.
                } else if (!isNullOrUndefined(row.bodyWidget) && row.bodyWidget instanceof BodyWidget && this.documentHelper.splittedCellWidgets.length > 0 && !isNullOrUndefined(rowWidgets[rowWidgets.length - 1].nextRow) && !this.isRowSpanEnd(rowWidgets[rowWidgets.length - 1].nextRow, viewer)) {
                    count--;
                }
                isInitialLayout = false;
            } else {
                footnoteElements = []
                isInitialLayout = false;
                //Split widget for next page
                if (this.documentHelper.splittedCellWidgets.length > 0 && tableRowWidget.y + tableRowWidget.height + this.footHeight <= viewer.clientArea.bottom) {
                    let isRowSpanEnd: boolean = this.isRowSpanEnd(row, viewer);
                    if (!isRowSpanEnd) {
                        if (this.isVerticalMergedCellContinue(row) && (tableRowWidget.y === viewer.clientArea.y
                            || tableRowWidget.y === this.viewer.clientArea.y + tableRowWidget.ownerTable.headerHeight)) {
                            // Bug 918606: If the row is not the end of a row span, we need to skip updating the row height based on the height of the split cell. Therefore, we have added an additional parameter to the method below.
                            this.insertSplittedCellWidgets(viewer, tableWidgets, tableRowWidget, tableRowWidget.index - 1, true);
                            this.updateChildLocationForRow(tableRowWidget.y, tableRowWidget);
                        }
                        this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                        continue;
                    }
                }
                let splittedWidget: TableRowWidget = tableRowWidget;
                let tableWidget: TableWidget = tableWidgets[tableWidgets.length - 1] as TableWidget;
                if (isMultiColumnSplit || rowHeight + tableRowWidget.y + this.footHeight > viewer.clientArea.bottom) {
                    if (!isAllowBreakAcrossPages || (isHeader && row.ownerTable.continueHeader) || (heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) < viewer.clientArea.bottom)) {
                        const isSplitRow: boolean = !isAllowBreakAcrossPages && isNullOrUndefined(tableRowWidget.previousWidget) && tableWidgets.length > 1;
                        if ((heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) < viewer.clientActiveArea.height && (isAllowBreakAcrossPages || isSplitRow)) || (heightType !== 'Exactly' && tableRowWidget.y === viewer.clientArea.y) || (heightType === 'Auto' && isAllowBreakAcrossPages)) {
                            splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow, footnoteElements, lineIndexInCell, cellIndex, isMultiColumnSplit);
                            if (isNullOrUndefined(splittedWidget) && tableRowWidget.y === viewer.clientArea.y) {
                                this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                            } else if (isNullOrUndefined(splittedWidget) && heightType === 'AtLeast' && tableRowWidget.containerWidget.lastChild !== tableRowWidget) {
                                splittedWidget = tableRowWidget;
                            }
                        }
                        // If the row height type is "At Least" and the row height is greater than the height of the client active area, the row will be moved to the next page. Therefore, it is necessary to add the `splittedCellWidget` to the current row.
                        else if (heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) > viewer.clientActiveArea.height && this.documentHelper.splittedCellWidgets.length > 0 && this.isRowSpanEnd(row, viewer)) {
                            this.insertSplittedCellWidgets(viewer, tableWidgets, tableRowWidget, tableRowWidget.index - 1);
                        }
                        // if (heightType === 'AtLeast' && row.ownerTable.spannedRowCollection.keys.length > 0) {
                        //     splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow);
                        // }
                        // if (heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) > viewer.clientActiveArea.height && isAllowBreakAcrossPages && tableRowWidget.ownerTable.tableHolder.columns.length > this.getTotalColumnSpan(tableRowWidget)) {
                        //     tableRowWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow);
                        //     splittedWidget = tableRowWidget;
                        // }
                        if (heightType === 'Exactly' && tableRowWidget.y === viewer.clientArea.y) {
                            this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                            count++;
                        }
                        if (isHeader && row.ownerTable.continueHeader) {
                            row.ownerTable.header = false;
                            row.ownerTable.headerHeight = 0;
                            let pages: Page[] = undefined;
                            if (viewer instanceof PageLayoutViewer) {
                                pages = this.documentHelper.pages;
                            }
                            if (!isNullOrUndefined(pages)) {
                                for (let i: number = 0; i < pages.length; i++) {
                                    if (pages[i].repeatHeaderRowTableWidget && !isNullOrUndefined(pages[i].bodyWidgets[0].firstChild) && !(pages[i].bodyWidgets[0].firstChild instanceof TableWidget && (pages[i].bodyWidgets[0].firstChild as TableWidget).header)) {
                                        pages[i].repeatHeaderRowTableWidget = false;
                                        row.ownerTable.continueHeader = false;
                                    }
                                }
                            }
                        }
                    } else {
                        if ((heightType === 'Auto' || heightType === 'AtLeast') && isAllowBreakAcrossPages) {
                            if (!(HelperMethods.convertPointToPixel(row.rowFormat.height) > viewer.clientArea.bottom) || tableRowWidget.y === viewer.clientArea.y) {
                                splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow, footnoteElements, lineIndexInCell, cellIndex, isMultiColumnSplit);
                                if (isNullOrUndefined(splittedWidget) && tableRowWidget.y === viewer.clientArea.y) {
                                    this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                                }
                            } else if (heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) > viewer.clientArea.bottom && tableRowWidget.ownerTable.wrapTextAround && tableRowWidget.y - HelperMethods.convertPointToPixel(tableRowWidget.ownerTable.positioning.verticalPosition) === viewer.clientArea.y && tableRowWidget.bodyWidget.firstChild === tableRowWidget.ownerTable) {
                                splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow, footnoteElements, lineIndexInCell, cellIndex, isMultiColumnSplit);
                                if (isNullOrUndefined(splittedWidget)) {
                                    this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                                    count++;
                                    continue;
                                }
                            }
                        } else if (heightType === 'Exactly' && tableRowWidget.y === viewer.clientArea.y) {
                            this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                            count++;
                        }
                    }
                } else {
                    let isInsertSplittedWidgets: boolean = false;
                    let headerHeight: number = 0;
                    if (!isNullOrUndefined(tableRowWidget.ownerTable.headerHeight)) {
                        headerHeight = tableRowWidget.ownerTable.headerHeight;
                    }
                    // Splitting handled for the merged cell with allowRowBreakAcross pages. 
                    if (this.isVerticalMergedCellContinue(row) && (isAllowBreakAcrossPages ||
                        (isInsertSplittedWidgets = (tableRowWidget.y === viewer.clientArea.y
                            || tableRowWidget.y === this.viewer.clientArea.y + headerHeight)))) {
                        if (isInsertSplittedWidgets) {
                            this.insertSplittedCellWidgets(viewer, tableWidgets, splittedWidget, tableRowWidget.indexInOwner - 1);
                        } else {
                            splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow, footnoteElements, undefined, undefined, undefined, true);
                            if (isNullOrUndefined(splittedWidget)) {
                                isInsertSplittedWidgets = (tableRowWidget.y === viewer.clientArea.y
                                    || tableRowWidget.y === this.viewer.clientArea.y + headerHeight);
                                if (isInsertSplittedWidgets) {
                                    this.insertSplittedCellWidgets(viewer, tableWidgets, tableRowWidget, tableRowWidget.indexInOwner - 1);
                                    count--;
                                    continue;
                                }
                                if (this.isRowSpanEnd(row, viewer)) {
                                    splittedWidget = tableRowWidget;
                                }
                            }
                        }
                    } else if (isLastRow && !isAllowBreakAcrossPages) {
                        splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow, footnoteElements);
                    } else if (this.isRowSpanEnd(row, viewer) && !isAllowBreakAcrossPages) {
                        if (heightType === 'AtLeast' && row.ownerTable.spannedRowCollection.keys.length > 0)
                            splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow, footnoteElements, lineIndexInCell, cellIndex, isMultiColumnSplit, true);
                        if (isNullOrUndefined(splittedWidget)) {
                            this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                        }
                    }
                }
                //Create New table for splitted widget
                if (!isNullOrUndefined(splittedWidget) && (isNullOrUndefined(this.documentHelper.owner.editorModule) || this.documentHelper.owner.editorModule && !this.documentHelper.owner.editorModule.isTableInsert) && !(splittedWidget.bodyWidget.containerWidget instanceof FootNoteWidget)) {
                    if (splittedWidget !== tableRowWidget) {
                        this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements, tableRowWidget.nextRow, undefined, undefined, isRepeatRowHeader);
                        //Updates the fitted table rows to current page.
                        this.updateWidgetsToPage(tableWidgets, rowWidgets, row.ownerTable, rearrangeRow, tableRowWidget.nextRow);
                        let index: number = tableWidgets.indexOf(tableRowWidget.containerWidget as TableWidget);
                        if (index + 1 >= tableWidgets.length) {
                            //Creates new table widget for splitted rows.
                            this.addTableWidget(viewer.clientActiveArea, tableWidgets, true);
                        }
                        tableRowWidget = splittedWidget;
                    } else {
                        if (row.index > 0) {
                            //Updates the fitted table rows to current page.
                            this.updateWidgetsToPage(tableWidgets, rowWidgets, row.ownerTable, rearrangeRow, row);
                            // Need to update on this further
                            if (row.previousRenderedWidget instanceof TableRowWidget) {
                                // Need to update on this further
                                let prevWidget: TableRowWidget = row.previousRenderedWidget as TableRowWidget;
                                if (HelperMethods.round(tableRowWidget.y, 2) === HelperMethods.round(prevWidget.y + prevWidget.height, 2)) {
                                    let prevIndex: number = tableWidgets.indexOf(prevWidget.containerWidget as TableWidget);
                                    if (prevIndex + 1 >= tableWidgets.length) {
                                        //Creates new table widget for splitted rows.
                                        this.addTableWidget(viewer.clientActiveArea, tableWidgets, true);
                                    }
                                } else {
                                    //Creates new table widget for splitted rows.
                                    this.addTableWidget(viewer.clientActiveArea, tableWidgets, true);
                                }
                            } else {
                                //Creates new table widget for splitted rows.
                                this.addTableWidget(viewer.clientActiveArea, tableWidgets, true);
                            }
                        } else if (heightType === 'Exactly' && rowHeight + tableRowWidget.y + this.footHeight < viewer.clientArea.bottom && tableRowWidget.y >= viewer.clientArea.y) {
                            this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, footnoteElements);
                            count++;
                            continue;
                        }
                        moveRowToNextTable = true;
                        count--;
                    }
                    tableWidget = tableWidgets[tableWidgets.length - 1] as TableWidget;
                    let rowToMove: TableRowWidget = row;
                    let keepNext: boolean = false;
                    let index: number = (row.ownerTable.containerWidget as BodyWidget).index;
                    let isTableFirstRow: boolean = false;
                    let bodyWidget: BodyWidget;
                    let block: BlockWidget
                    if (moveRowToNextTable && tableWidgets.length === 1) {
                        block = tableWidgets[tableWidgets.length - 1];
                    } else {
                        block = tableWidgets[tableWidgets.length - 2];
                    }
                    let removeTable: boolean = true;
                    //Move Next RowWidge to next page
                    if (moveRowToNextTable && rowWidgets.length === 1) {
                        let prev = this.alignBlockElement(row);
                        if (!isNullOrUndefined(prev.node)) {
                            let previousRow: BlockWidget = prev.node as BlockWidget;
                            if (previousRow instanceof TableRowWidget
                                && previousRow.indexInOwner === 0) {
                                if (tableWidgets.length > 1 && tableWidgets[tableWidgets.length - 1].childWidgets.length === 0) {
                                    tableWidgets.pop();
                                    tableWidget = tableWidgets[tableWidgets.length - 1];
                                    tableWidget.height = 0;
                                }
                            } else if (prev.node instanceof ParagraphWidget) {
                                let previousWidget: BlockWidget = this.splitParagraph(prev.node as ParagraphWidget, parseInt(prev.position.index, 10));
                                block = previousWidget as BlockWidget;
                                if (tableWidgets.length > 1 && tableWidgets[tableWidgets.length - 1].childWidgets.length === 0) {
                                    tableWidgets.pop();
                                    tableWidget = tableWidgets[tableWidgets.length - 1];
                                }
                                removeTable = false;
                            }
                            if (previousRow instanceof TableRowWidget) {
                                isTableFirstRow = previousRow.indexInOwner === 0;
                                rowToMove = previousRow as TableRowWidget;
                                if (!rowToMove.ownerTable.equals(row.ownerTable)) {
                                    block = rowToMove.ownerTable;
                                    removeTable = false;
                                }
                            }
                            keepNext = true;
                        }
                    }
                    bodyWidget = this.moveBlocksToNextPage(block instanceof ParagraphWidget ? block.previousWidget as BlockWidget : 
                        (keepNext && isTableFirstRow) ? !isNullOrUndefined(block.previousWidget) ? block.previousWidget as BlockWidget : block as BlockWidget : block as BlockWidget, keepNext, undefined, undefined, undefined, true);

                    let curretTable: TableWidget = tableWidgets[tableWidgets.length - 1];
                    //Move Next RowWidge to next page
                    if (moveRowToNextTable && removeTable) {
                        if (rowToMove.index === 0 && curretTable.containerWidget && curretTable.containerWidget.childWidgets.indexOf(curretTable) !== -1) {
                            curretTable.containerWidget.childWidgets.splice(curretTable.containerWidget.childWidgets.indexOf(curretTable), 1);
                        }
                    }
                    if (removeTable) {
                        if (bodyWidget.childWidgets.indexOf(curretTable) !== -1) {
                            bodyWidget.childWidgets.splice(bodyWidget.childWidgets.indexOf(curretTable), 1);
                        }
                        bodyWidget.childWidgets.unshift(curretTable);
                        this.shiftFloatingItemsFromTable(curretTable, bodyWidget);
                    }
                    curretTable.containerWidget = bodyWidget;
                    if (moveRowToNextTable && rowToMove.index > 0 || rowWidgets.length > 1) {
                        let currentRow: TableRowWidget = !moveRowToNextTable ? rowWidgets[rowWidgets.length - 2] : rowWidgets[rowWidgets.length - 1];
                        if (keepNext) {
                            currentRow = rowToMove;
                        }
                        this.moveNextWidgetsToTable(tableWidgets, currentRow, !moveRowToNextTable);
                        rowToMove = row;
                    }
                    if (keepNext) {
                        this.updateClientPositionForBlock(removeTable ? curretTable : block, row);
                    }
                    moveRowToNextTable = false;
                    let insertHeaderRow = false;
                    let bottom: number = this.documentHelper.viewer.clientArea.bottom - tableRowWidget.bottomBorderWidth - cellSpacing;
                    if (rowToMove.ownerTable.header) {
                        //Checks if the splitted row widget can fit in along with header row.
                        //Based on the result header row is repeated and infinite looping of not fitted state is avoided.
                        splittedWidget.x = splittedWidget.x;
                        splittedWidget.y = this.viewer.clientArea.y + tableWidget.headerHeight;
                        this.updateChildLocationForRow(splittedWidget.y, splittedWidget);
                        insertHeaderRow = this.isFirstLineFitForRow(bottom, splittedWidget);
                    }

                    if (insertHeaderRow && rowToMove.ownerTable.header && !keepNext) {
                        if (viewer instanceof PageLayoutViewer) {
                            bodyWidget.page.repeatHeaderRowTableWidget = true;
                            isRepeatRowHeader = true;
                        }
                        //Updates table widgets location.
                        viewer.updateClientAreaForBlock(rowToMove.ownerTable, true, tableWidgets);
                        //Update splitted row widget location. if header is repeated update the y position of splitted widget to header height.
                        splittedWidget.x = splittedWidget.x;
                        splittedWidget.y = tableWidget.y + rowToMove.ownerTable.headerHeight;
                        // let cellspace: number = viewer instanceof PageLayoutViewer ? cellspacing / 2 : cellspacing;
                        let cellspace: number = cellSpacing / 2;
                        this.updateChildLocationForRow(tableWidget.y + rowToMove.ownerTable.headerHeight - cellspace, splittedWidget, tableWidget.containerWidget as BodyWidget);
                    } else {
                        //Updates table widgets location.
                        viewer.updateClientAreaForBlock(rowToMove.ownerTable, true, tableWidgets);
                        //Update splitted row widget location. if header is repeated update the y position of splitted widget to header height.
                        if (splittedWidget.bodyWidget.sectionFormat.columns.length > 1) {
                            let clientArea: Rect = new Rect(this.viewer.clientArea.x, this.viewer.clientArea.y, this.viewer.clientArea.width, this.viewer.clientArea.height);
                            let clientActiveArea: Rect = new Rect(this.viewer.clientActiveArea.x, this.viewer.clientActiveArea.y, this.viewer.clientActiveArea.width, this.viewer.clientActiveArea.height);
                            splittedWidget.x = this.viewer.clientActiveArea.x;
                            splittedWidget.y = this.viewer.clientActiveArea.y;
                            const topMargin: number = this.getMaxTopCellMargin(splittedWidget);
                            const bottomMargin: number = this.getMaxBottomCellMargin(splittedWidget);
                            for (let i: number = 0; i < splittedWidget.childWidgets.length; i++) {
                                 const cell: TableCellWidget = splittedWidget.childWidgets[i] as TableCellWidget;
                                 cell.height = 0;
                                 this.addTableCellWidget(cell, this.viewer.clientActiveArea, topMargin + splittedWidget.topBorderWidth, bottomMargin + splittedWidget.bottomBorderWidth);
                                 this.viewer.updateClientAreaForCell(cell, true);
                                    for (let j: number = 0; j < cell.childWidgets.length; j++) {
                                        const block: BlockWidget = cell.childWidgets[j] as BlockWidget;
                                        viewer.updateClientAreaForBlock(block, true);
                                        block.containerWidget = cell;
                                        this.layoutBlock(block, 0);
                                        viewer.updateClientAreaForBlock(block, false);
                                    }
                                    this.viewer.updateClientAreaForCell(cell, false);
                            }
                            this.viewer.clientActiveArea = clientActiveArea;
                            this.viewer.clientArea = clientArea;
                        }
                        splittedWidget.x = splittedWidget.x;
                        splittedWidget.y = tableWidget.y;
                        // let cellspace: number = viewer instanceof PageLayoutViewer ? cellspacing / 2 : cellspacing;
                        let cellspace: number = cellSpacing / 2;
                        this.updateChildLocationForRow(tableWidget.y - cellspace, splittedWidget,tableWidget.containerWidget as BodyWidget, true);
                    }
                    if (removeTable && this.shiftedFloatingItemsFromTable.length > 0) {
                        for (let i: number = 0; i < this.shiftedFloatingItemsFromTable.length; i++) {
                            let floatingItem: any = this.shiftedFloatingItemsFromTable[i]
                            let position: Point = this.getFloatingItemPoints(floatingItem);
                            floatingItem.y = position.y;
                            floatingItem.x = position.x;
                            if (floatingItem instanceof ShapeElementBox) {
                                this.updateChildLocationForCellOrShape(floatingItem.y, floatingItem as ShapeElementBox);
                            }
                        }
                        this.shiftedFloatingItemsFromTable = [];
                    }
                }
                isLastRow = false;
            }
            if (isHeader) {
                if (row.ownerTable.continueHeader) {
                    row.ownerTable.header = true;
                    row.ownerTable.headerHeight = rowHeight + row.ownerTable.headerHeight;
                }
                headerRow = this.getHeader(row.ownerTable);
                if (!isNullOrUndefined(headerRow) && row.index === headerRow.index) {
                    let headerHeight: number = this.getHeaderHeight(row.ownerTable, row, rowWidgets);
                    if (headerHeight > row.ownerTable.headerHeight || headerHeight > row.ownerTable.headerHeight) {
                        row.ownerTable.headerHeight = headerHeight;
                    }
                    if (row.ownerTable.headerHeight > viewer.clientArea.height) {
                        row.ownerTable.header = false;
                        row.ownerTable.continueHeader = false;
                        row.ownerTable.headerHeight = 0;
                        let pages: Page[] = this.documentHelper.pages;
                        for (let i: number = 0; i < pages.length; i++) {
                            if (pages[i].repeatHeaderRowTableWidget) {
                                pages[i].repeatHeaderRowTableWidget = false;
                            }
                        }
                    }
                }
            }
            isMultiColumnSplit = false;
            if (tableWidgets.length > 2 && row.ownerTable.header && tableRowWidget.height < viewer.clientActiveArea.bottom &&
                !(viewer as PageLayoutViewer).documentHelper.currentRenderingPage.repeatHeaderRowTableWidget) {
                (viewer as PageLayoutViewer).documentHelper.currentRenderingPage.repeatHeaderRowTableWidget = true;
            }
        }
    }


    public getHeader(table: TableWidget): TableRowWidget {
        let header: TableRowWidget = undefined;
        let flag: boolean = true;
        table = table.getSplitWidgets()[0] as TableWidget;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.isHeader) {
                header = row;
            } else {
                flag = false;
            }
            if (!flag) {
                break;
            }
        }
        return header;
    }

    private getHeaderHeight(ownerTable: TableWidget, row: TableRowWidget, rowCollection: TableRowWidget[]): number {
        let height: number = 0;
        if (row.ownerTable.childWidgets.length > 0 && (ownerTable.childWidgets[0] as TableRowWidget).rowFormat.isHeader) {
            for (let i: number = 0; i < ownerTable.childWidgets.length; i++) {
                const row: TableRowWidget = ownerTable.childWidgets[i] as TableRowWidget;
                if (row.rowFormat.isHeader) {
                    height = height + row.height;
                } else {
                    break;
                }
            }
        }
        return height;
    }
    private getHeaderHeightForSpannedRow(table: TableWidget): number {
        let height: number = 0;
        let rowSpan: number = 1;
        let headerRow: TableRowWidget = this.getHeader(table);
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.isHeader) {
                height = height + row.height;
                if (row == headerRow) {
                    for (let j: number = 0; j < headerRow.childWidgets.length; j++) {
                        let cell: TableCellWidget = headerRow.childWidgets[j] as TableCellWidget;
                        rowSpan = Math.max(rowSpan, cell.cellFormat.rowSpan);
                    }
                    if (rowSpan > 1 && i + rowSpan < table.childWidgets.length) {
                        for (let k: number = 1; k < rowSpan; k++) {
                            let nextRow: TableRowWidget = table.childWidgets[i + k] as TableRowWidget;
                            if (!isNullOrUndefined(nextRow)) {
                                height = height + nextRow.height;
                            }
                        }
                    }
                }
            }
        }
        return height;
    }

    private updateWidgetToRow(cell: TableCellWidget): void {
        //const viewer: LayoutViewer = this.viewer;
        //Adds table cell widget to owner row widget.
        const rowWidget: TableRowWidget = cell.ownerRow as TableRowWidget;
        // let cellLeft: number = rowWidget.x;
        // if (rowWidget.childWidgets.length > 0) {
        //     const lastWidget: TableCellWidget = rowWidget.childWidgets[rowWidget.childWidgets.length - 1] as TableCellWidget;
        //     cellLeft = lastWidget.x + lastWidget.width + lastWidget.margin.right;
        // }
        // rowWidget.childWidgets.push(cell);
        cell.containerWidget = rowWidget;
        //If the row height is set as Atleast then height is set to atleast height for the first cell of the row.
        if (!isNullOrUndefined(cell.ownerRow) && cell.ownerRow.rowFormat.heightType !== 'Exactly' && HelperMethods.convertPointToPixel(cell.ownerRow.rowFormat.height) > 0 && cell.cellIndex === 0) {
            rowWidget.height = rowWidget.height + HelperMethods.convertPointToPixel(cell.ownerRow.rowFormat.height);
        }
        //Add condition not cell merged vertically.
        if (cell.cellFormat.rowSpan === 1) {
            let cellHeight: number;
            if (rowWidget.rowFormat.heightType === 'Exactly') {
                cellHeight = cell.height + cell.margin.bottom;
            } else {
                cellHeight = cell.height + cell.margin.top + cell.margin.bottom;
            }
            if (rowWidget.height - HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing) < cellHeight) {
                rowWidget.height = cellHeight + HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing);
            }
        }
    }

    /* eslint-disable-next-line max-len */
    private updateHeightForRowWidget(viewer: LayoutViewer, isUpdateVerticalPosition: boolean, tableCollection: TableWidget[], rowCollection: TableRowWidget[], rowWidget: TableRowWidget, isLayouted: boolean, endRowWidget?: TableRowWidget, isInitialLayout?: boolean): void {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let cellspacing: number = 0;
            let cellWidget: TableCellWidget = undefined;
            const childWidget: IWidget = rowWidget.childWidgets[i];
            // if (childWidget instanceof TableCellWidget) {
            cellWidget = childWidget as TableCellWidget;
            // }
            let rowSpan: number = 1;
            rowSpan = cellWidget.cellFormat.rowSpan;
            cellspacing = HelperMethods.convertPointToPixel(cellWidget.ownerTable.tableFormat.cellSpacing);
            if (rowSpan > 1) {
                const currentRowWidgetIndex: number = rowWidget.containerWidget.childWidgets.indexOf(rowWidget);
                const rowSpanWidgetEndIndex: number = currentRowWidgetIndex + rowSpan - 1 - (rowWidget.index - cellWidget.rowIndex);
                if (!isInitialLayout && (viewer.clientArea.bottom < cellWidget.y + cellWidget.height + cellWidget.margin.bottom
                    || rowSpanWidgetEndIndex >= currentRowWidgetIndex + 1) && (rowCollection.length === 1
                        || rowCollection.length >= 1 && rowWidget === rowCollection[rowCollection.length - 1])) {
                    let footHeight: number = this.footHeight;
                    this.footHeight = this.existFootnoteHeight = !isNullOrUndefined(rowWidget.bodyWidget.page.footnoteWidget)
                        ? rowWidget.bodyWidget.page.footnoteWidget.height : 0;
                    this.splitSpannedCellWidget(cellWidget, tableCollection, rowCollection, viewer);
                    this.footHeight = this.existFootnoteHeight = footHeight;
                }
                let spanEndRowWidget: TableRowWidget = rowWidget;
                if (rowSpanWidgetEndIndex > 0) {
                    if (rowSpanWidgetEndIndex < rowWidget.containerWidget.childWidgets.length) {
                        const childWidget: IWidget = rowWidget.containerWidget.childWidgets[rowSpanWidgetEndIndex];
                        if (childWidget instanceof TableRowWidget) {
                            spanEndRowWidget = childWidget as TableRowWidget;
                            if (spanEndRowWidget === endRowWidget) {
                                spanEndRowWidget = rowWidget;
                            }
                        }
                    } else {
                        /* eslint-disable-next-line max-len */
                        spanEndRowWidget = rowWidget.containerWidget.childWidgets[rowWidget.containerWidget.childWidgets.length - 1] as TableRowWidget;
                    }
                }
                if (cellWidget.y + cellWidget.height + cellWidget.margin.bottom < spanEndRowWidget.y + spanEndRowWidget.height) {
                    cellWidget.height = spanEndRowWidget.y + spanEndRowWidget.height - spanEndRowWidget.bottomBorderWidth - cellWidget.y - cellWidget.margin.bottom;
                    /* eslint-disable-next-line max-len */
                } else if (isLayouted && spanEndRowWidget && (spanEndRowWidget.y !== 0 && spanEndRowWidget.height !== 0) && cellWidget.y + cellWidget.height + cellWidget.margin.bottom > spanEndRowWidget.y + spanEndRowWidget.height) {
                    if (spanEndRowWidget.rowFormat.heightType !== 'Exactly' || (spanEndRowWidget.rowFormat.heightType === 'Exactly' && spanEndRowWidget.rowFormat.height > cellWidget.y + cellWidget.height + cellWidget.margin.bottom - spanEndRowWidget.y)) {
                        spanEndRowWidget.height = cellWidget.y + cellWidget.height + cellWidget.margin.bottom - spanEndRowWidget.y;
                    } else {
                        cellWidget.height = (spanEndRowWidget.y - cellWidget.y) + spanEndRowWidget.height;
                    }
                    //Update the next rowlayout widget location. Reason for the updation is previous row height is updated when cell height is greater. So already layouted next row location has to be updated again.
                    // if (rowWidget === spanEndRowWidget && rowWidget.nextWidget instanceof TableRowWidget) {
                    //     let nextRow: TableRowWidget = rowWidget.nextWidget as TableRowWidget;
                    //     // Need to update on this further
                    //     // if (viewer.renderedElements.containsKey(nextRow)) {
                    //     //     let nextWidget: TableRowWidget[] = viewer.renderedElements.get(nextRow) as TableRowWidget[];
                    //     //     if (nextWidget.length > 0) {
                    //     //         nextWidget[0].x = nextWidget[0].x;
                    //     //         nextWidget[0].y = rowWidget.y + rowWidget.height;
                    //     //     }
                    //     // }
                    // }
                }
            } else {
                if (cellspacing > 0) {
                    // In the Case of tableWidget is greater than one and rowWidget is start at the Top Position of the page.
                    // In such case we have update the cell height with half of cell spacing.
                    // Remaining cases we have to update the entire hight
                    if (tableCollection.length > 1 && rowWidget.y === viewer.clientArea.y && viewer instanceof PageLayoutViewer) {
                        cellspacing = cellspacing / 2;
                    }
                }
                cellWidget.height = rowWidget.height - cellWidget.margin.top - cellWidget.margin.bottom - cellspacing;
            }
            this.updateHeightForCellWidget(viewer, tableCollection, rowCollection, cellWidget);
            let widget: Widget = rowWidget.containerWidget;
            while (widget.containerWidget instanceof Widget) {
                widget = widget.containerWidget;
            }
            let page: Page = undefined;
            if (widget instanceof BodyWidget) {
                page = (widget as BodyWidget).page;
            }
            /* eslint-disable-next-line max-len */
            if ((viewer instanceof PageLayoutViewer && (viewer as PageLayoutViewer).visiblePages.indexOf(page) !== -1) || isUpdateVerticalPosition) {
                this.updateCellVerticalPosition(cellWidget, false, cellWidget.ownerTable.isInsideTable);
            }
            //Renders the current table row contents, after relayout based on editing.
            // if (viewer instanceof PageLayoutViewer && (viewer as PageLayoutViewer).visiblePages.indexOf(page) !== -1) {
            //     //Added proper undefined condition check for Asynchronous operation.
            //     if (!isNullOrUndefined(rowWidget.tableRow) && !isNullOrUndefined(rowWidget.tableRow.rowFormat)) {
            //         this.viewer.updateScrollBars();
            //         //this.render.renderTableCellWidget(page, cellWidget);
            //     }
            // }
        }
    }

    /* eslint-disable-next-line max-len */
    private updateHeightForCellWidget(viewer: LayoutViewer, tableWidget: TableWidget[], rowCollection: TableRowWidget[], cellWidget: TableCellWidget): void {
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof TableWidget) {
                this.updateHeightForTableWidget(tableWidget, rowCollection, cellWidget.childWidgets[i] as TableWidget);
            }
        }
    }

    public getRowHeight(row: TableRowWidget, rowCollection: TableRowWidget[]): number {
        let height: number = 0;
        if (row.rowFormat.heightType === 'Exactly') {
            height = row.rowFormat.height;
        } else {
            for (let i: number = 0; i < rowCollection.length; i++) {
                if (rowCollection[i] instanceof TableRowWidget) {
                    height = rowCollection[i].height + height;
                }
            }
            height = Math.max(height, row.rowFormat.height);
        }
        return height;
    }

    /* eslint-disable-next-line max-len */
    private splitSpannedCellWidget(cellWidget: TableCellWidget, tableCollection: TableWidget[], rowCollection: TableRowWidget[], viewer: LayoutViewer): void {
        /* eslint-disable-next-line max-len */
        const splittedCell: TableCellWidget = this.getSplittedWidget(viewer.clientArea.bottom, false, tableCollection, rowCollection, cellWidget, undefined, undefined, undefined, undefined, true);
        if (!isNullOrUndefined(splittedCell)) {
            //Adds the splitted contents of a vertical merged cell, in order preserve in next page.
            this.documentHelper.splittedCellWidgets.push(splittedCell);
            splittedCell.isSplittedCell = true;
        }
    }

    /* eslint-disable-next-line max-len */
    private insertSplittedCellWidgets(viewer: LayoutViewer, tableCollection: TableWidget[], rowWidget: TableRowWidget, previousRowIndex: number, isSkipUpdateHeight?: boolean): void {
        if (!isNullOrUndefined(rowWidget)) {
        let left: number = rowWidget.x;
        let tableWidth: number = 0;
        let cellspace: number = 0;
        let linestyle: boolean = false;
        tableWidth = HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableHolder.tableWidth);
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            const cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            let isRightStyleNone: boolean = (cellWidget.cellFormat.borders.right.lineStyle === 'None');
            cellspace = !isNullOrUndefined(cellWidget.ownerTable) && !isNullOrUndefined(cellWidget.ownerTable.tableFormat) ? HelperMethods.convertPointToPixel(cellWidget.ownerTable.tableFormat.cellSpacing) : 0;
            if (Math.round(left) < Math.round(cellWidget.x - cellWidget.margin.left - cellspace)) {
                if (this.insertRowSpannedWidget(rowWidget, viewer, left, i, isSkipUpdateHeight)) {
                    i--;
                    continue;
                }
                // Bug 871725: Empty cell widget must be inserted if the table split into next page.
                if (tableCollection.length === 1 && this.documentHelper.splittedCellWidgets.length === 0) {
                    break;
                }
                const length: number = rowWidget.childWidgets.length;
                this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, i, previousRowIndex);
                if (length < rowWidget.childWidgets.length) {
                    i--;
                    continue;
                }
            }
            left += cellWidget.margin.left + cellWidget.width + cellWidget.margin.right;
            if (cellspace > 0 || cellWidget.columnIndex === cellWidget.ownerTable.tableHolder.columns.length - 1 ||
                cellWidget.index === (cellWidget.containerWidget as TableRowWidget).childWidgets.length - 1) {
                if (!cellWidget.ownerTable.tableFormat.allowAutoFit) {
                    const leftBorderWidth: number = HelperMethods.convertPointToPixel(TableCellWidget.getCellLeftBorder(cellWidget).getLineWidth());
                    const rightBorderWidth: number = HelperMethods.convertPointToPixel(TableCellWidget.getCellRightBorder(cellWidget).getLineWidth());
                    cellWidget.rightBorderWidth = !cellWidget.ownerTable.isBidiTable ? rightBorderWidth : leftBorderWidth;
                    left += cellWidget.rightBorderWidth;
                }
                if (!this.isInsertTable()) {
                    linestyle = this.checkPreviousMargins(cellWidget.ownerTable);
                }
            }
            left -= (isRightStyleNone && !linestyle) ? 0 : (cellWidget.rightBorderWidth);
            if (i === rowWidget.childWidgets.length - 1 && Math.round(left) < Math.round(rowWidget.x + tableWidth)) {
                if (this.insertRowSpannedWidget(rowWidget, viewer, left, i + 1)) {
                    continue;
                }
                this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, i + 1, previousRowIndex);
                continue;
            }
        }
        // Special case: when the child widgets of row is equal to 0 then the splitted widgets in the viewer is added in the table row widgets.
        /* eslint-disable-next-line max-len */
        if ((isNullOrUndefined(rowWidget.childWidgets) || rowWidget.childWidgets.length === 0) && this.documentHelper.splittedCellWidgets.length > 0) {
            for (let j: number = 0; j < this.documentHelper.splittedCellWidgets.length; j++) {
                const widget: TableCellWidget = this.documentHelper.splittedCellWidgets[j] as TableCellWidget;
                if (Math.round(left) <= Math.round(widget.x - widget.margin.left)) {
                    if (this.insertRowSpannedWidget(rowWidget, viewer, left, j)) {
                        j--;
                        continue;
                    }
                    const count: number = rowWidget.childWidgets.length;
                    this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, j, previousRowIndex);
                    if (count < rowWidget.childWidgets.length) {
                        j--;
                        continue;
                    }
                }
                left += widget.margin.left + widget.width + widget.margin.right;
                if (j === rowWidget.childWidgets.length - 1 && Math.round(left) <
                    Math.round(rowWidget.x + tableWidth)) {
                    if (this.insertRowSpannedWidget(rowWidget, viewer, left, j + 1)) {
                        continue;
                    }
                    this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, j + 1, previousRowIndex);
                    continue;
                }
            }
        }
        if (this.documentHelper.splittedCellWidgets.length > 0) {
            this.documentHelper.splittedCellWidgets = [];
        }
    }
    }

    private insertRowSpannedWidget(rowWidget: TableRowWidget, viewer: LayoutViewer, left: number, index: number, isSkipUpdateHeight?: boolean): boolean {
        let cellSpacing: number = 0;
        if (rowWidget.ownerTable.tableFormat.cellSpacing > 0) {
            cellSpacing = HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableFormat.cellSpacing);
        }
        for (let i: number = 0; i < this.documentHelper.splittedCellWidgets.length; i++) {
            const splittedCell: TableCellWidget = this.documentHelper.splittedCellWidgets[i];
            if (Math.round(left) === Math.round(splittedCell.x - splittedCell.margin.left)) {
                rowWidget.childWidgets.splice(index, 0, splittedCell);
                splittedCell.containerWidget = rowWidget;
                if (!isSkipUpdateHeight && splittedCell.height > rowWidget.height) {
                    rowWidget.height = splittedCell.height;
                }
                //If the splitted cell location differs from expected location update the location of row child widgets.
                if (splittedCell.y !== rowWidget.y + splittedCell.margin.top + cellSpacing) {
                    this.updateChildLocationForRow(rowWidget.y, rowWidget);
                }
                this.documentHelper.splittedCellWidgets.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /* eslint-disable-next-line max-len */
    private insertEmptySplittedCellWidget(currentRow: TableRowWidget, tableCollection: TableWidget[], left: number, index: number, previousRowIndex: number): void {
        let tableWidget: TableWidget = tableCollection[tableCollection.length - 1];
        let previousRow: TableRowWidget;
        for (let j: number = tableCollection.length - 1; j >= 0; j--) {
            const table: TableWidget = tableCollection[j];
            for (let z: number = table.childWidgets.length - 1; z >= 0; z--) {
                const row: TableRowWidget = table.childWidgets[z] as TableRowWidget;
                if (row.index === previousRowIndex) {
                    previousRow = row;
                    break;
                }
            }
        }
        if (previousRow) {
            tableWidget = previousRow.ownerTable;
            previousRowIndex = previousRow.indexInOwner;
        }
        for (let i: number = previousRowIndex; i >= 0; i--) {
            const rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            let previousLeft: number = rowWidget.x;
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                let rowSpan: number = 1;
                const cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                const cellspace = !isNullOrUndefined(cellWidget.ownerTable) && !isNullOrUndefined(cellWidget.ownerTable.tableFormat) ? HelperMethods.convertPointToPixel(cellWidget.ownerTable.tableFormat.cellSpacing) : 0;
                if (Math.round(previousLeft) !== Math.round(cellWidget.x - cellWidget.margin.left - cellspace)) {
                    previousLeft = (cellWidget.x - cellWidget.margin.left - cellspace);
                }
                if (Math.round(left) === Math.round(previousLeft)) {
                    rowSpan = (isNullOrUndefined(cellWidget) || isNullOrUndefined(cellWidget.cellFormat)) ? rowSpan :
                        cellWidget.cellFormat.rowSpan;
                    if (rowSpan > 1 && ((rowWidget.firstChild as TableCellWidget).columnIndex === 0)
                        && !this.isColumnExistsInCurrentRow(currentRow, cellWidget.columnIndex)) {
                        if (this.isVerticalMergedCellContinue(currentRow) && currentRow.rowFormat.heightType !== "Exactly" && !isNullOrUndefined(currentRow.previousRenderedWidget) && currentRow.previousRenderedWidget instanceof TableRowWidget && currentRow.previousRenderedWidget.y + currentRow.previousRenderedWidget.height < cellWidget.y + cellWidget.height) {
                            this.isRelayoutneed = true;
                            let splittedCell: TableCellWidget = this.getSplittedWidget(currentRow.previousRenderedWidget.y + currentRow.previousRenderedWidget.height, true, tableCollection, undefined, cellWidget, undefined, undefined, undefined, undefined, true);
                            this.isRelayoutneed = false;
                            currentRow.childWidgets.splice(index, 0, splittedCell);
                            splittedCell.containerWidget = currentRow;
                            this.updateChildLocationForRow(currentRow.y, currentRow);
                            return;
                        }
                        else {
                            //if (!isNullOrUndefined(currentRow.childWidgets[index])) {
                            const emptyCellWidget: TableCellWidget = this.createCellWidget(cellWidget);
                            //if (emptyCellWidget.x < (currentRow.childWidgets[index] as TableCellWidget).x) {
                            currentRow.childWidgets.splice(index, 0, emptyCellWidget);
                            emptyCellWidget.containerWidget = currentRow;
                            this.updateChildLocationForRow(currentRow.y, currentRow);
                            return;
                        }
                        //}
                        //}
                    }
                }
                previousLeft += cellWidget.margin.left + cellWidget.width + cellWidget.margin.right;
            }
        }
    }

    private isColumnExistsInCurrentRow(row: TableRowWidget, columnIndex: number): boolean {
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            const cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            if (cellWidget.columnIndex === columnIndex) {
                return true;
            }
        }
        return false;
    }
    
    /* eslint-disable-next-line max-len */
    private getSplittedWidget(bottom: number, splitMinimalWidget: boolean, tableCollection: TableWidget[], rowCollection: TableRowWidget[], cellWidget: TableCellWidget, footNoteCollection: FootnoteElementBox[], lineIndexInCell?: number, isMultiColumnSplit?: boolean, nestedCount?: number, splitSpannedCellWidget?: boolean): TableCellWidget {
        let splittedWidget: TableCellWidget = undefined;
        let footnoteHeight: number = 0;
        if (isMultiColumnSplit || cellWidget.y + cellWidget.height > bottom - this.footHeight - cellWidget.margin.bottom) {
            let count: number = 0;
            if (cellWidget.ownerTable.isInsideTable) {
                count = nestedCount;
            }
            let isCellSplit: boolean = false;
            for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
                if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                    const paragraphWidget: ParagraphWidget = cellWidget.childWidgets[i] as ParagraphWidget;
                    let splittedPara: ParagraphWidget = paragraphWidget;
                    if (!isCellSplit) {
                        splittedPara = this.getSplittedWidgetForPara(bottom - cellWidget.margin.bottom, paragraphWidget, footNoteCollection, lineIndexInCell, isMultiColumnSplit, count);
                    }
                    if (isMultiColumnSplit) {
                        count = count + paragraphWidget.childWidgets.length;
                    }
                    if (!isNullOrUndefined(splittedPara)) {
                        isCellSplit = true;
                        if (i === 0 && splittedPara === paragraphWidget && !splitSpannedCellWidget) {
                            //Returns if the whole content of the cell does not fit in current page.
                            return cellWidget;
                        }
                        if (cellWidget.childWidgets.indexOf(splittedPara) !== -1) {
                            cellWidget.childWidgets.splice(cellWidget.childWidgets.indexOf(splittedPara), 1);
                            i--;
                        }
                        cellWidget.height -= splittedPara.height;
                        if (isNullOrUndefined(splittedWidget)) {
                            //Creates new widget, to hold the splitted contents.
                            splittedWidget = this.createCellWidget(cellWidget);
                        }
                        splittedWidget.height += splittedPara.height;
                        splittedWidget.childWidgets.push(splittedPara);
                        splittedPara.containerWidget = splittedWidget;
                    }
                } else {
                    const tableWidget: TableWidget = cellWidget.childWidgets[i] as TableWidget;
                    const tableCol: TableWidget[] = [tableWidget];
                    let nextFootHeight: number = 0;
                    if (!isNullOrUndefined(tableWidget.footnoteElement)) {
                        for (let j: number = 0; j < tableWidget.footnoteElement.length; j++) {
                            nextFootHeight += this.getFootNoteHeight(tableWidget.footnoteElement[j].bodyWidget);
                        }
                    }
                    let existFootnoteHeight: number = this.existFootnoteHeight + nextFootHeight;
                    if (!isNullOrUndefined(footNoteCollection)) {
                        for (let j: number = 0; j < footNoteCollection.length; j++) {
                            existFootnoteHeight += this.getFootNoteHeight(footNoteCollection[j].bodyWidget);
                        }
                    }
                    //Check for nested table.
                    if (isMultiColumnSplit || bottom - cellWidget.margin.bottom < tableWidget.y + tableWidget.height + existFootnoteHeight) {
                        const tableHeight: number = tableWidget.height;
                        /* eslint-disable-next-line max-len */
                        let splittedTable: TableWidget;
                        if (isCellSplit) {
                            splittedTable = tableWidget;
                        } else {
                            splittedTable = this.getSplittedWidgetForTable(bottom - cellWidget.margin.bottom, tableCol, tableWidget, footNoteCollection, lineIndexInCell, isMultiColumnSplit, count);
                        }
                        if (isNullOrUndefined(splittedTable) &&
                            !((tableWidget.childWidgets[0] as TableRowWidget).rowFormat.allowBreakAcrossPages)) {
                            splittedTable = tableWidget;
                        }
                        if (!isNullOrUndefined(splittedTable)) {
                            if (i === 0 && splittedTable === tableWidget) {
                                //Returns if the whole table does not fit in current page.
                                return cellWidget;
                            }
                            if (cellWidget.childWidgets.indexOf(splittedTable) !== -1) {
                                cellWidget.childWidgets.splice(cellWidget.childWidgets.indexOf(splittedTable), 1);
                                i--;
                                cellWidget.height -= splittedTable.height;
                            } else {
                                cellWidget.height -= tableHeight - tableWidget.height;
                            }
                            if (isNullOrUndefined(splittedWidget)) {
                                //Creates new widget, to hold the splitted contents.
                                splittedWidget = this.createCellWidget(cellWidget);
                            }
                            splittedWidget.height += splittedTable.height;
                            splittedWidget.childWidgets.push(splittedTable);
                            splittedTable.containerWidget = splittedWidget;
                        }
                    } else if (tableWidget.footnoteElement.length > 0) {
                        for (let j: number = 0; j < tableWidget.footnoteElement.length; j++) {
                            footNoteCollection.push(tableWidget.footnoteElement[j]);
                        }
                    }
                }
            }
        } else {
            this.updateFootHeight(cellWidget, footNoteCollection);
        }
        if (isNullOrUndefined(splittedWidget) && splitMinimalWidget && this.isRelayoutneed) {
            //Creates new widget, to hold the splitted contents.
            splittedWidget = this.createCellWidget(cellWidget);
        }
        return splittedWidget;
    }

    private getNextFootNoteHeight(cell: TableCellWidget, currentPosition: number): number {
        let height: number = 0;
        if (!isNullOrUndefined(cell.ownerTable.footnoteElement) && cell.ownerTable.footnoteElement.length > 0) {
            for (let i: number = cell.indexInOwner + 1; i < cell.ownerRow.childWidgets.length; i++) {
                let currentCell: TableCellWidget = cell.ownerRow.childWidgets[i] as TableCellWidget;
                for (let j: number = 0; j < currentCell.childWidgets.length; j++) {
                    if (currentCell.childWidgets[j] instanceof ParagraphWidget) {
                        height += this.getFootHeightFromPara(currentCell.childWidgets[j] as ParagraphWidget, currentPosition);
                    } else if (currentCell.childWidgets[j] instanceof TableWidget) {
                        let table: TableWidget = currentCell.childWidgets[j] as TableWidget;
                        height += this.getFootHeightFromTable(table, currentPosition);
                    }   
                }
            }
            if (cell.ownerTable.isInsideTable) {
                height += this.getNextFootNoteHeight(cell.ownerTable.containerWidget as TableCellWidget, currentPosition);
            }
        }
        return height;
    }

    private getFootHeightFromTable(table: TableWidget, currentPosition: number): number {
        let height: number = 0;
        for (let k: number = 0; k < table.childWidgets.length; k++) {
            let row: TableRowWidget = table.childWidgets[k] as TableRowWidget;
            for (let m: number = 0; m < row.childWidgets.length; m++) {
                let cell: TableCellWidget = row.childWidgets[m] as TableCellWidget;
                for (let n: number = 0; n < cell.childWidgets.length; n++) {
                    if (cell.childWidgets[n] instanceof ParagraphWidget) {
                        height += this.getFootHeightFromPara(cell.childWidgets[n] as ParagraphWidget, currentPosition);
                    } else if (cell.childWidgets[n] instanceof TableWidget) {
                        height += this.getFootHeightFromTable(cell.childWidgets[n] as TableWidget, currentPosition);
                    }

                }
            }
        }
        return height;
    }

    private getFootHeightFromPara(blockWidget: ParagraphWidget, currentPosition: number): number {
        let height: number = 0;
        for (let k: number = 0; k < blockWidget.childWidgets.length; k++) {
            let lineWidget: LineWidget = blockWidget.childWidgets[k] as LineWidget;
            let footHeight: number = this.getFootNoteHeightInLine(lineWidget);
            if (currentPosition > lineWidget.height + blockWidget.y) {
                height += footHeight;
            }
        }
        return height;
    }

    private updateFootHeight(cellWidget: TableCellWidget, footNoteCollection: FootnoteElementBox[]): void {
        if (!isNullOrUndefined(footNoteCollection)) {
            for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
                if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                    const paragraphWidget: ParagraphWidget = cellWidget.childWidgets[i] as ParagraphWidget;
                    for (let j: number = 0; j < paragraphWidget.childWidgets.length; j++) {
                        this.getFootnoteFromLine(paragraphWidget.childWidgets[j] as LineWidget, footNoteCollection);
                    }
                } else if (cellWidget.childWidgets[i] instanceof TableWidget) {
                    this.updateFootHeightForTable(cellWidget.childWidgets[i] as TableWidget, footNoteCollection);
                }
            }
        }
    }

    private updateFootHeightForTable(table: TableWidget, footNoteCollection: FootnoteElementBox[]): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const rowWidget: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                const cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                this.updateFootHeight(cellWidget, footNoteCollection);
            }
        }
    }

    public getListLevelPattern(value: number): ListLevelPattern {
        switch (value) {
            case 0:
                return 'Arabic';
            case 1:
                return 'LowLetter';
            case 2:
                return 'LowRoman';
            case 3:
                return 'UpLetter';
            case 4:
                return 'UpRoman';
            case 5:
                return 'Ordinal';
            case 6:
                return 'Number';
            case 7:
                return 'OrdinalText';
            case 8:
                return 'LeadingZero';
            case 9:
                return 'Bullet';
            case 10:
                return 'FarEast';
            case 11:
                return 'Special';
            default:
                return 'None';
        }
    }

    private createCellWidget(cell: TableCellWidget): TableCellWidget {
        const cellWidget: TableCellWidget = new TableCellWidget();
        cellWidget.cellFormat = cell.cellFormat;
        cellWidget.index = cell.index;
        cellWidget.rowIndex = cell.rowIndex;
        cellWidget.columnIndex = cell.columnIndex;
        cellWidget.containerWidget = cell.containerWidget;
        this.updateWidgetLocation(cell, cellWidget);
        cellWidget.margin = cell.margin;
        cellWidget.leftBorderWidth = cell.leftBorderWidth;
        cellWidget.rightBorderWidth = cell.rightBorderWidth;
        return cellWidget;
    }

    private createTableWidget(table: TableWidget): TableWidget {
        const newTable: TableWidget = new TableWidget();
        if (table.header) {
            newTable.header = table.header;
            const height: number = this.getHeaderHeightForSpannedRow(table);
            newTable.headerHeight = height > table.headerHeight ? height : table.headerHeight;
        }
        newTable.index = table.index;
        newTable.tableFormat = table.tableFormat;
        newTable.tableHolder = table.tableHolder;
        newTable.footnoteElement = table.footnoteElement;
        newTable.isGridUpdated = table.isGridUpdated;
        newTable.wrapTextAround = table.wrapTextAround;
        newTable.positioning = table.positioning;
        newTable.isContainInsideTable = table.isContainInsideTable;
        newTable.isBidiTable = table.isBidiTable;
        return newTable;
    }
    private getSplittedWidgetForPara(bottom: number, paragraphWidget: ParagraphWidget, footNoteCollection: FootnoteElementBox[], lineIndexInCell?: number, isMultiColumnSplit?: boolean, count?: number): ParagraphWidget {
        let lineBottom: number = paragraphWidget.y;
        let splittedWidget: ParagraphWidget = undefined;
        let moveEntireBlock: boolean = false;
        let isSplitParagraph: boolean = false;
        let lineWidgetHeight: number = 0;
        for (let i: number = 0; i < paragraphWidget.childWidgets.length; i++) {
            let nextFootHeight: number = this.getNextFootNoteHeight(paragraphWidget.containerWidget as TableCellWidget, paragraphWidget.y + lineWidgetHeight);
            let lineWidget: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
            let height: number =  this.getFootNoteHeightInLine(lineWidget);
            height += this.existFootnoteHeight + nextFootHeight;
            if (!isNullOrUndefined(footNoteCollection)) {
                for (let j: number = 0; j < footNoteCollection.length; j++) {
                    height += this.getFootNoteHeight(footNoteCollection[j].bodyWidget);
                }
            }
            let lineHeight: number = 0;
            if (lineWidget.children[0] instanceof ShapeBase) {
                lineHeight = lineWidget.children[0].height;
            }
            else {
                lineHeight = lineWidget.height;
            }
            lineWidgetHeight += lineHeight;
            if ((isMultiColumnSplit && count >= lineIndexInCell) || bottom < lineBottom + height + lineHeight) {
                if (paragraphWidget.paragraphFormat.keepLinesTogether && (paragraphWidget.index !== 0 ||
                    (paragraphWidget.index === 0 && !isNullOrUndefined(paragraphWidget.associatedCell.ownerRow.previousWidget)))) {
                    moveEntireBlock = true;
                    i = 0;
                    lineWidget = paragraphWidget.childWidgets[0] as LineWidget;
                } else if (paragraphWidget.paragraphFormat.widowControl) {
                    if (!isNullOrUndefined(paragraphWidget.associatedCell) && i === 1 && bottom < lineBottom + lineHeight && !isSplitParagraph) {
                        const rowWidget: TableRowWidget = paragraphWidget.associatedCell.ownerRow;
                        const table: TableWidget = rowWidget.containerWidget as TableWidget;
                        const remLineHeight: number = paragraphWidget.height - (paragraphWidget.childWidgets[0] as LineWidget).height;
                        const isFirstitemInPage: boolean = ((table.indexInOwner <= 0 && paragraphWidget.associatedCell.ownerRow.indexInOwner <= 0
                            && (paragraphWidget.indexInOwner <= 0 || remLineHeight > bottom)) || this.documentHelper.compatibilityMode !== 'Word2013') ? true : false;
                        if (!isFirstitemInPage) {
                            return paragraphWidget;
                        } else {
                            isSplitParagraph = true;
                        }
                    }
                    if (i === 1 && !isSplitParagraph) {
                        moveEntireBlock = true;
                        i = 0;
                        lineWidget = paragraphWidget.childWidgets[0] as LineWidget;
                    }
                }
                if (i === 0) {
                    if (lineWidget.paragraph.containerWidget instanceof TableCellWidget && !moveEntireBlock && !isMultiColumnSplit) {
                        // checks first line of the page is exceed the page height
                        if (paragraphWidget.indexInOwner === 0 && lineBottom + lineHeight > bottom &&
                            lineWidget.paragraph.associatedCell.ownerRow.y === this.viewer.clientArea.y) {
                            lineBottom += lineWidget.height;
                            continue;
                        }
                    }
                    splittedWidget = paragraphWidget;
                    break;
                }
                if (paragraphWidget.childWidgets.indexOf(lineWidget) !== -1) {
                    paragraphWidget.childWidgets.splice(paragraphWidget.childWidgets.indexOf(lineWidget), 1);
                    i--;
                }
                paragraphWidget.height -= lineWidget.height;
                if (isNullOrUndefined(splittedWidget)) {
                    //Creates new widget, to hold the splitted contents.
                    splittedWidget = new ParagraphWidget();
                    splittedWidget.characterFormat = paragraphWidget.characterFormat;
                    splittedWidget.paragraphFormat = paragraphWidget.paragraphFormat;
                    splittedWidget.index = paragraphWidget.index;
                    this.updateWidgetLocation(paragraphWidget, splittedWidget);
                    splittedWidget.height = lineWidget.height;
                } else {
                    splittedWidget.height += lineWidget.height;
                }
                splittedWidget.childWidgets.push(lineWidget);
                lineWidget.paragraph = splittedWidget;
            }
            this.getFootnoteFromLine(lineWidget, footNoteCollection);
            lineBottom += lineWidget.height;
            count++;
        }
        // this.updateLinearIndex(splittedWidget);
        return splittedWidget;
    }

    public getSplittedWidgetForTable(bottom: number, tableCollection: TableWidget[], tableWidget: TableWidget, footNoteCollection: FootnoteElementBox[], lineIndexInCell?: number, isMultiColumnSplit?: boolean, count?: number): TableWidget {
        let rowBottom: number = tableWidget.y;
        let splittedWidget: TableWidget = undefined;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = undefined;
            const childWidget: IWidget = tableWidget.childWidgets[i];
            // if (childWidget instanceof TableRowWidget) {
            rowWidget = childWidget as TableRowWidget;
            // }
            const rowHeight: number = rowWidget.height;
            let existFootnoteHeight: number = this.existFootnoteHeight;
            if (bottom > rowBottom + rowHeight + existFootnoteHeight && isNullOrUndefined(splittedWidget)) {
                for (let k: number = 0; k < rowWidget.childWidgets.length; k++) {
                    this.updateFootHeight(rowWidget.childWidgets[k] as TableCellWidget, footNoteCollection);
                }
            }
            if (!isNullOrUndefined(footNoteCollection)) {
                for (let j: number = 0; j < footNoteCollection.length; j++) {
                    existFootnoteHeight += this.getFootNoteHeight(footNoteCollection[j].bodyWidget);
                }
            }
            if (isMultiColumnSplit || bottom < rowBottom + rowHeight + existFootnoteHeight || !isNullOrUndefined(splittedWidget)) {
                //ToDo: Check whether row included in vertical merge or AllowRowSplitbyPage is true, if so split row.
                //Checks if atleast first line fits in the client area.
                let splittedRow: TableRowWidget = undefined;
                let allowRowBreakAcrossPages: boolean = true;
                if (!isNullOrUndefined(rowWidget) && !isNullOrUndefined(rowWidget.rowFormat)) {
                    allowRowBreakAcrossPages = rowWidget.rowFormat.allowBreakAcrossPages;
                }
                if (allowRowBreakAcrossPages) {
                    /* eslint-disable-next-line max-len */
                    splittedRow = (isNullOrUndefined(splittedWidget) && this.isFirstLineFitForRow(bottom, rowWidget)) ? this.getSplittedWidgetForRow(bottom, tableCollection, [rowWidget], rowWidget, footNoteCollection, lineIndexInCell, isMultiColumnSplit, count) : rowWidget;
                } else {
                    if ((isNullOrUndefined(tableWidget.containerWidget.containerWidget.previousWidget)
                        && this.isFirstLineFitForRow(bottom, rowWidget))
                        || (tableWidget.isInsideTable
                            && !((tableWidget.containerWidget.containerWidget as TableRowWidget).rowFormat.allowBreakAcrossPages))) {
                        splittedRow = this.getSplittedWidgetForRow(bottom, tableCollection, [rowWidget], rowWidget, footNoteCollection, lineIndexInCell, isMultiColumnSplit, count);
                    } else if (!isNullOrUndefined(tableWidget.containerWidget.containerWidget.previousWidget)) {
                        splittedRow = rowWidget;
                    }
                }
                if (!isNullOrUndefined(splittedRow)) {
                    if (i === 0 && splittedRow === rowWidget) {
                        //Returns if the whole table does not fit in current page.
                        return tableWidget;
                    }
                    if (tableWidget.childWidgets.indexOf(splittedRow) !== -1) {
                        tableWidget.childWidgets.splice(tableWidget.childWidgets.indexOf(splittedRow), 1);
                        i--;
                        tableWidget.height -= splittedRow.height;
                    } else {
                        tableWidget.height -= rowHeight - rowWidget.height;
                    }
                    if (isNullOrUndefined(splittedWidget)) {
                        //Creates new widget, to hold the splitted contents.
                        splittedWidget = this.createTableWidget(tableWidget);
                        this.updateWidgetLocation(tableWidget, splittedWidget);
                        splittedWidget.height = splittedRow.height;
                    } else {
                        splittedWidget.height += splittedRow.height;
                    }
                    splittedWidget.childWidgets.push(splittedRow);
                    splittedRow.containerWidget = splittedWidget;
                }
            }
            rowBottom += rowWidget.height;
        }
        return splittedWidget;
    }

    private isFirstLineFitForPara(bottom: number, paraWidget: ParagraphWidget): boolean {
        const lineWidget: LineWidget = paraWidget.childWidgets[0] as LineWidget;
        let lineHeight: number = lineWidget.height;
        let height: number = this.getFootNoteHeightInLine(lineWidget);
        height += this.existFootnoteHeight;
        lineHeight += height;
        const cellwidget: TableCellWidget = lineWidget.paragraph.containerWidget as TableCellWidget;
        if (paraWidget.paragraphFormat.keepLinesTogether && Math.floor(cellwidget.containerWidget.y) !== this.viewer.clientArea.y  ) {
            lineHeight = paraWidget.height;
        }
        
        // let document: WordDocument = undefined;
        // if (!isNullOrUndefined(lineWidget.paragraph.currentNode) && !isNullOrUndefined(cellwidget.containerWidget)) {
        //     document = WordDocument.getDocumentOf(lineWidget.paragraph.currentNode);
        // }
        //checks first line of the page is exceed the page height
        if (this.documentHelper.isFirstLineFitInShiftWidgets) {
            /* eslint-disable-next-line max-len */
            if (this.viewer.clientActiveArea.y === this.viewer.clientArea.y && paraWidget.y + lineHeight >= bottom) {
                return true;
            }
        } else if (!cellwidget.ownerTable.isInsideTable && cellwidget.containerWidget.y === this.viewer.clientArea.y 
            && paraWidget.y + lineHeight >= bottom) {
            return true;
        }
        return (paraWidget.y + lineHeight <= bottom);
    }

    public isFirstLineFitForTable(bottom: number, tableWidget: TableWidget): boolean {
        let rowWidget: TableRowWidget = undefined;
        let isFit: boolean = false;
        const childWidget: IWidget = tableWidget.childWidgets[0];
        // if (childWidget instanceof TableRowWidget) {
        rowWidget = childWidget as TableRowWidget;
        // }
        if (!isNullOrUndefined(rowWidget)) {
            isFit = this.isFirstLineFitForRow(bottom, rowWidget);
        }
        return isFit;
    }

    private isFirstLineFitForRow(bottom: number, rowWidget: TableRowWidget): boolean {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            const cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            if (!this.isFirstLineFitForCell(bottom, cellWidget)) {
                return false;
            }
        }
        return true;
    }

    private isFirstLineFitForCell(bottom: number, cellWidget: TableCellWidget): boolean {
        if (cellWidget.childWidgets.length === 0) {
            return true;
        }
        if (cellWidget.childWidgets[0] instanceof ParagraphWidget) {
            const paraWidget: ParagraphWidget = cellWidget.childWidgets[0] as ParagraphWidget;
            return this.isFirstLineFitForPara(bottom - cellWidget.margin.bottom, paraWidget);
        } else {
            const tableWidget: TableWidget = cellWidget.childWidgets[0] as TableWidget;
            return this.isFirstLineFitForTable(bottom - cellWidget.margin.bottom, tableWidget);
        }
    }

    private updateWidgetLocation(widget: Widget, table: Widget): void {
        table.x = widget.x;
        table.y = widget.y;
        table.width = widget.width;
    }

    public updateChildLocationForTable(top: number, tableWidget: TableWidget, bodyWidget?: BodyWidget, updatePosition?: boolean): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            const rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            //rowWidget.x = rowWidget.x;
            rowWidget.y = top;
            this.updateChildLocationForRow(top, rowWidget, bodyWidget, updatePosition);
            top += rowWidget.height;
        }
    }

    public updateChildLocationForRow(top: number, rowWidget: TableRowWidget, bodyWidget?: BodyWidget, updatePosition?: boolean): void {
        let spacing: number = 0;
        if (rowWidget.ownerTable.tableFormat.cellSpacing > 0) {
            spacing = HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableFormat.cellSpacing);
        }
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            const cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            //cellWidget.x = cellWidget.x;
            cellWidget.index = cellWidget.cellIndex;
            cellWidget.y = top + cellWidget.margin.top + spacing;
            this.updateChildLocationForCellOrShape(cellWidget.y, cellWidget, bodyWidget, updatePosition);
        }
    }

    private updateChildLocationForCellOrShape(top: number, widget: TableCellWidget | ShapeElementBox, bodyWidget?:BodyWidget, updatePosition?: boolean, updateShapeYPosition?: boolean): void {
        let container: Widget = widget as Widget;
        if (widget instanceof ShapeElementBox) {
            container = widget.textFrame;
        }
        for (let i: number = 0; i < container.childWidgets.length; i++) {
            let skipHeight: boolean = false;
            if (container.childWidgets[i] instanceof TableWidget && (container.childWidgets[i] as TableWidget).wrapTextAround
                && !isNullOrUndefined(container.childWidgets[i + 1]) && (container.childWidgets[i + 1] as Widget).y > (container.childWidgets[i] as Widget).y
                && (container.childWidgets[i + 1] as Widget).y < ((container.childWidgets[i] as Widget).y + (container.childWidgets[i] as Widget).height)) {
                skipHeight = true;
            }
            if (!isNullOrUndefined((container.childWidgets[i] as ParagraphWidget).floatingElements) && (container.childWidgets[i] as ParagraphWidget).floatingElements.length > 0 && updatePosition) {
                this.viewer.clientActiveArea.height = this.viewer.clientActiveArea.bottom - top;
                this.viewer.clientActiveArea.y = top;
            }
            (container.childWidgets[i] as Widget).x = (container.childWidgets[i] as Widget).x;
            (container.childWidgets[i] as Widget).y = top;
            if (widget instanceof ShapeElementBox && widget.textWrappingStyle == "Inline" && updateShapeYPosition) {
                this.updateShapeYPosition(widget as ShapeElementBox);
            }
            if (!isNullOrUndefined(bodyWidget) && widget instanceof TableCellWidget && container.childWidgets[i] instanceof ParagraphWidget) {
                let paragraph: ParagraphWidget = container.childWidgets[i] as ParagraphWidget;
                let prevBodyWidgetFloatingElements: (TableWidget | ShapeBase)[] = widget.ownerTable.bodyWidget.floatingElements;
                let isRowMovedToNextTable: boolean = false;
                if (widget.ownerTable.bodyWidget === bodyWidget && !isNullOrUndefined(widget.ownerTable.previousSplitWidget)) {
                    prevBodyWidgetFloatingElements = (widget.ownerTable.previousSplitWidget as TableWidget).bodyWidget.floatingElements;
                    isRowMovedToNextTable = true;
                }
                if (paragraph.floatingElements.length > 0) {
                    for (let j = 0; j < paragraph.floatingElements.length; j++) {
                        let element: ShapeBase = paragraph.floatingElements[j];
                        const prevClientActiveAreaX: number = this.viewer.clientActiveArea.x;
                        this.viewer.clientActiveArea.x = element.x;
                        this.layoutShape(element);
                        this.viewer.clientActiveArea.x = prevClientActiveAreaX;
                        if (!isNullOrUndefined(paragraph.firstChild)) {
                            let firstLine: LineWidget = paragraph.childWidgets[0] as LineWidget;
                            for (let k = 0; k < firstLine.children.length; k++) {
                                let elementBox: ElementBox = firstLine.children[k];
                                if (elementBox instanceof ShapeBase && elementBox.textWrappingStyle == 'Inline') {
                                    this.adjustPosition(elementBox, widget.ownerTable.bodyWidget);
                                    top = paragraph.y;
                                }
                            }
                        }
                        if (prevBodyWidgetFloatingElements.indexOf(element) > -1 && element.textWrappingStyle !== 'Inline') {
                            if (!isRowMovedToNextTable) {
                                bodyWidget.floatingElements.push(element);
                                let previousBodyWidget: BodyWidget = bodyWidget.previousSplitWidget as BodyWidget;
                                if (!isNullOrUndefined(previousBodyWidget) && (previousBodyWidget as BodyWidget).floatingElements.indexOf(element) !== -1) {
                                    previousBodyWidget.floatingElements.splice(previousBodyWidget.floatingElements.indexOf(element), 1);
                                }
                            }
                            if (prevBodyWidgetFloatingElements.indexOf(element) !== -1) {
                                prevBodyWidgetFloatingElements.splice(prevBodyWidgetFloatingElements.indexOf(element), 1)
                            }
                        }
                    }
                }
            }
            if (container.childWidgets[i] instanceof TableWidget) {
                this.updateChildLocationForTable(top, (container.childWidgets[i] as TableWidget), bodyWidget, updatePosition);
            }
            if (!skipHeight) {
                top += (container.childWidgets[i] as Widget).height;
            }
        }
    }

    public updateCellVerticalPosition(cellWidget: TableCellWidget, isUpdateToTop: boolean, isInsideTable: boolean): void {
        const containerWidget: Widget = cellWidget.ownerTable.containerWidget;
        if (containerWidget instanceof BlockContainer || containerWidget instanceof TextFrame || isInsideTable) {
            const displacement: number = this.getDisplacement(cellWidget, isUpdateToTop);
            //Update Y position alone for the child widget of cell
            this.updateCellContentVerticalPosition(cellWidget, displacement, isUpdateToTop);
        }
    }

    private updateCellContentVerticalPosition(cellWidget: TableCellWidget, displacement: number, isUpdateToTop: boolean): void {
        if (displacement === 0) {
            return;
        }
        let location: number = cellWidget.y + displacement;
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                const para: ParagraphWidget = cellWidget.childWidgets[i] as ParagraphWidget;
                para.y = location;
                this.updateShapeInsideCell(para, displacement);
            } else {
                this.updateTableWidgetLocation(cellWidget.childWidgets[i] as TableWidget, location, isUpdateToTop);
            }
            location = location + (cellWidget.childWidgets[i] as Widget).height;
        }
    }
    private updateShapeInsideCell(paragraph: ParagraphWidget, displacement: number): void {
        for (let i: number = 0; i < paragraph.floatingElements.length; i++) {
            const floatElement: ShapeBase = paragraph.floatingElements[i];
            floatElement.y += displacement;
            if (floatElement instanceof ShapeElementBox) {
                this.updateChildLocationForCellOrShape(floatElement.y, floatElement);
            }
        }
    }

    private updateTableWidgetLocation(tableWidget: TableWidget, location: number, isUpdateToTop: boolean): number {
        tableWidget.y = location = location + tableWidget.topBorderWidth;
        const cellSpacing: number = 0;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            const rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            rowWidget.y = location;
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                const cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                cellWidget.y = location + cellWidget.margin.top + cellSpacing;
                this.updateCellVerticalPosition(cellWidget, isUpdateToTop, true);
            }
            location = location + rowWidget.height;
        }
        return location;
    }

    private getDisplacement(cellWidget: TableCellWidget, isUpdateToTop: boolean): number {
        //Gets the height of row
        let rowHeight: number = 0;
        const rowWidget: TableRowWidget = cellWidget.containerWidget as TableRowWidget;
        const padding: number = cellWidget.margin.top + cellWidget.margin.bottom;
        if (!isNullOrUndefined(cellWidget.cellFormat) && cellWidget.cellFormat.rowSpan > 1) {
            rowHeight = cellWidget.height;
        } else {
            rowHeight = ((!isNullOrUndefined(rowWidget) ? rowWidget.height : 0) - padding);
        }
        //Gets the height of content within the cell
        const cellContentHeight: number = this.getCellContentHeight(cellWidget, true);
        //Displacement field holds the value which has reduced from rowHeight and cellContentHeight
        let displacement: number = 0;
        if (rowHeight > cellContentHeight && rowHeight <= this.viewer.clientArea.height && !cellWidget.isSplittedCell) {
            displacement = rowHeight - cellContentHeight;
            if (cellWidget.cellFormat.verticalAlignment === 'Center') {
                displacement = displacement / 2;
            } else if ((cellWidget.cellFormat.verticalAlignment === 'Top' || isUpdateToTop)) {
                displacement = 0;
            }
        }
        return displacement;
    }

    private getCellContentHeight(cellWidget: TableCellWidget, isDisplacement: boolean, paraIndex?: number): number {
        if (isNullOrUndefined(cellWidget.childWidgets)) {
            return 0;
        }
        let contentHeight: number = 0;
        const cellY: number = cellWidget.y;
        let withShapeContentHeight: number = 0;
        let withShapeBottom: number = 0;
        let considerShapeHeight: boolean = false;
        let considerAsTop: boolean = false;
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                const para: ParagraphWidget = cellWidget.childWidgets[i] as ParagraphWidget;
                contentHeight += (cellWidget.childWidgets[i] as ParagraphWidget).height;
                if (!isDisplacement && para.floatingElements.length > 0 && paraIndex === para.indexInOwner) {
                    let totalShapeHeight: number = this.getFloatingItemsHeight(para, cellWidget);
                    contentHeight += totalShapeHeight;
                }
                for (let k: number = 0; k < para.floatingElements.length; k++) {
                    considerShapeHeight = true;
                    const floatElement: ShapeBase = para.floatingElements[k];
                    const textWrappingStyle: TextWrappingStyle = floatElement.textWrappingStyle;
                    const shapeBottom: number = floatElement.y + floatElement.height;
                    const paraBottom: number = para.y + para.height;
                    if ((cellY + cellWidget.containerWidget.height) > shapeBottom && shapeBottom > withShapeBottom) {
                        withShapeContentHeight = Math.abs(cellY - shapeBottom);
                        withShapeBottom = shapeBottom;
                        considerAsTop = false;
                    } else if (shapeBottom > paraBottom && para.x + para.width > floatElement.x && shapeBottom > withShapeBottom
                        && textWrappingStyle !== 'InFrontOfText' && textWrappingStyle !== 'Behind'
                        && (this.documentHelper.compatibilityMode === 'Word2013' || para.floatingElements[k].layoutInCell)) {
                        let height: number = (withShapeBottom === 0) ? shapeBottom - paraBottom : shapeBottom - withShapeBottom;
                        contentHeight += height;
                        withShapeBottom = shapeBottom;
                    }
                    else {
                        considerAsTop = true;
                    }
                }
            } else {
                if (this.considerPositionTableHeight(cellWidget, cellWidget.childWidgets[i] as TableWidget)) {
                    contentHeight += (cellWidget.childWidgets[i] as TableWidget).height;
                }
            }
        }
        if ((cellY + contentHeight) > withShapeBottom) {
            considerShapeHeight = false;
        }
        return (isDisplacement && considerShapeHeight) ? withShapeContentHeight :
            (isDisplacement && considerAsTop ? cellWidget.ownerRow.height : contentHeight);
    }
    private getFloatingItemsHeight(paragraph: ParagraphWidget, cellWidget: TableCellWidget): number {
        let withShapeBottom: number = 0;
        let totalShapeHeight: number = 0;
        for (let i: number = 0; i < paragraph.floatingElements.length; i++) {
            const floatElement: ShapeBase = paragraph.floatingElements[i];
            const textWrappingStyle: TextWrappingStyle = floatElement.textWrappingStyle;
            const shapeBottom: number = floatElement.y + floatElement.height;
            const paraBottom: number = paragraph.y + paragraph.height;
            if (shapeBottom < this.viewer.clientArea.bottom && floatElement.y !== paragraph.y && paraBottom > shapeBottom && paragraph.x + paragraph.width > floatElement.x && shapeBottom > withShapeBottom
                && textWrappingStyle !== 'InFrontOfText' && textWrappingStyle !== 'Behind' && textWrappingStyle !== 'Inline'
                && (this.documentHelper.compatibilityMode === 'Word2013' || paragraph.floatingElements[i].layoutInCell)) {
                let height: number = (withShapeBottom === 0) ? shapeBottom - cellWidget.y : shapeBottom - withShapeBottom;
                totalShapeHeight += height;
                withShapeBottom = shapeBottom;
            }
        }
        return totalShapeHeight;
    }
    private considerPositionTableHeight(cellWidget: TableCellWidget, nestedWrapTable: TableWidget): boolean {
        if (nestedWrapTable.isLayouted && nestedWrapTable.wrapTextAround) {
            for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
                let blockWidget: BlockWidget = cellWidget.childWidgets[i] as BlockWidget;
                if (nestedWrapTable !== blockWidget && (blockWidget.y === nestedWrapTable.y 
                    || (blockWidget.y + blockWidget.height) < nestedWrapTable.y)) {
                    return false;
                }
            }
        }
        return true;
    }

    public getTableLeftBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.left)) {
            return borders.left;
        } else {
            const border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }

    public getTableRightBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.right)) {
            return borders.right;
        } else {
            const border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }

    public getTableTopBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.top)) {
            return borders.top;
        } else {
            const border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }

    public getTableBottomBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.bottom)) {
            return borders.bottom;
        } else {
            const border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }

    public getCellDiagonalUpBorder(tableCell: TableCellWidget): WBorder {
        let diagonalUpBorder: WBorder = undefined;
        let cellBorder: WBorders = undefined;
        cellBorder = tableCell.cellFormat.borders;
        diagonalUpBorder = cellBorder.diagonalUp;
        return diagonalUpBorder;
    }

    public getCellDiagonalDownBorder(tableCell: TableCellWidget): WBorder {
        let diagonalDownBorder: WBorder = undefined;
        let cellBorder: WBorders = undefined;
        cellBorder = tableCell.cellFormat.borders;
        diagonalDownBorder = cellBorder.diagonalDown;
        return diagonalDownBorder;
    }

    public getTableWidth(table: TableWidget): number {
        let width: number = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowWidth: number = 0;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                rowWidth += HelperMethods.convertPointToPixel(cell.cellFormat.cellWidth);
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    //#region shifting

    public layoutNextItemsBlock(blockAdv: BlockWidget, viewer: LayoutViewer, isFootnoteReLayout?: boolean, isNextBlockToShift?: boolean): void {
        const sectionIndex: number = blockAdv.bodyWidget.sectionIndex;
        let block: BlockWidget = blockAdv;
        let splittedWidget: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        let nextBlock: BlockWidget = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        if (isNullOrUndefined(nextBlock) || this.documentHelper.blockToShift === block) {
            this.documentHelper.blockToShift = undefined;
        }
        let updateNextBlockList: boolean = true;
        while (nextBlock instanceof BlockWidget && (nextBlock.bodyWidget.sectionIndex === sectionIndex || (nextBlock.bodyWidget.sectionFormat.breakCode === 'NoBreak' && block.bodyWidget.sectionFormat.pageWidth === nextBlock.bodyWidget.sectionFormat.pageWidth && block.bodyWidget.sectionFormat.pageHeight === nextBlock.bodyWidget.sectionFormat.pageHeight))) {
            if (!isNullOrUndefined(isFootnoteReLayout) && isFootnoteReLayout && !nextBlock.isLayouted && this.isInitialLoad) {
                break;
            }
            let currentWidget: Widget = undefined;
            const blocks: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
            currentWidget = blocks[blocks.length - 1];
            // if (viewer.fieldEndParagraph === block) {
            //     //Sets field end paragraph to undefined, inorder to hold reLayouting with this paragraph.
            //     viewer.fieldEndParagraph = undefined;
            // }
            block = nextBlock as BlockWidget;
            if (this.documentHelper.blockToShift === block) {
                this.documentHelper.blockToShift = undefined;
            }
            updateNextBlockList = false;
            let nextWidget: Widget = undefined;
            nextWidget = block.getSplitWidgets()[0] as ParagraphWidget;
            /* eslint-disable-next-line max-len */
            if (this.documentHelper.fieldStacks.length === 0 && !isNullOrUndefined(nextWidget) && currentWidget.containerWidget === nextWidget.containerWidget
                && (HelperMethods.round(nextWidget.y, 2) === HelperMethods.round(currentWidget.y + currentWidget.height, 2))) {
                if (!isNullOrUndefined(this.documentHelper.blockToShift) || this.documentHelper.owner.editorModule.isFootnoteElementRemoved) {
                    this.documentHelper.blockToShift = block;
                } else if ((nextWidget as BlockWidget).bodyWidget) {
                    const floatingElementLength = (nextWidget as BlockWidget).bodyWidget.floatingElements.length;
                    if (floatingElementLength > 0 || (floatingElementLength === 0 && isNullOrUndefined(this.documentHelper.blockToShift)
                        && isNextBlockToShift)) {
                        this.documentHelper.blockToShift = block;
                    }
                }
                break;
            }
            updateNextBlockList = true;
            if ((viewer.owner.isShiftingEnabled && (this.documentHelper.fieldStacks.length === 0 || this.viewer.owner.editorModule.isInsertingTOC)) || (this.isIFfield && !this.checkBlockHasField(block))) {
                this.documentHelper.blockToShift = block;
                break;
            } else if (isNullOrUndefined(this.viewer.owner.editorModule) || !this.viewer.owner.editorModule.isInsertingTOC) {
                block = block.combineWidget(this.viewer) as BlockWidget;
                //let paragraph: ParagraphWidget;
                if (currentWidget.containerWidget !== block.containerWidget) {
                    if (!(currentWidget instanceof ParagraphWidget) ||
                        (currentWidget instanceof ParagraphWidget) && !currentWidget.isEndsWithPageBreak && !currentWidget.isEndsWithColumnBreak && (currentWidget.containerWidget as BodyWidget).page !== (block.containerWidget as BodyWidget).page && !(block.bodyWidget instanceof BodyWidget && block.bodyWidget.sectionFormat.breakCode === 'NoBreak')) {
                        /* eslint-disable-next-line max-len */
                        this.updateContainerWidget(block as Widget, currentWidget.containerWidget as BodyWidget, currentWidget.indexInOwner + 1, false);
                    }
                }
                if (block instanceof TableWidget) {
                    this.clearTableWidget(block as TableWidget, true, true);
                    (block as TableWidget).isGridUpdated = false;
                    //paragraph = this.documentHelper.selection.getFirstParagraphInFirstCell(block as TableWidget);
                } else {
                    //paragraph = block as ParagraphWidget;
                }
                //if ((this.viewer.owner.isDocumentLoaded) && this.viewer.owner.editorModule) {
                //    this.viewer.owner.editorModule.updateWholeListItems(paragraph);
                //}
                viewer.updateClientAreaForBlock(block, true);
                if (this.viewer instanceof WebLayoutViewer || block.bodyWidget instanceof HeaderFooterWidget) {
                    block.containerWidget.height -= block.height;
                }
                this.documentHelper.layout.layoutBlock(block, 0);
                viewer.updateClientAreaForBlock(block, false);
            }
            splittedWidget = nextBlock.getSplitWidgets() as BlockWidget[];
            nextBlock = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        }
        if ((!viewer.owner.isShiftingEnabled || (this.documentHelper.blockToShift !== block)) && !this.isPastingContent) {
            this.viewer.owner.editorModule.updateListItemsTillEnd(block, updateNextBlockList);
        }
    }
    /**
     * Update the client area for the line widget. 
     *
     * @param {LineWidget} startLineWidget LineWidget instance.
     * @private
     */
    public updateClientAreaForLine(startLineWidget: LineWidget): void {
        startLineWidget.marginTop = 0;
        //Clears the line widget starting from current line.
        const top: number = this.documentHelper.selection.getTop(startLineWidget);
        const left: number = this.viewer.clientArea.x;
        this.viewer.cutFromTop(top);
        this.viewer.cutFromLeft(left);
    }

    /**
     * @private
     */
    public isAuto(table: TableWidget): boolean {
        let isAllColumnHasAutoWidthType: boolean = false;
        if (table.tableFormat.preferredWidthType === 'Auto' && table.tableFormat.preferredWidth === 0 && table.tableFormat.allowAutoFit) {
            for (let i = 0; i < table.childWidgets.length; i++) {
                let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                for (let j = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    if (cell.cellFormat.preferredWidthType === 'Auto' && cell.cellFormat.preferredWidth === 0) {
                        isAllColumnHasAutoWidthType = true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }
        if (isAllColumnHasAutoWidthType && table.isInsideTable && table.containerWidget instanceof TableCellWidget) {
            isAllColumnHasAutoWidthType = this.isAuto((table.containerWidget as TableCellWidget).ownerTable);
        }
        return isAllColumnHasAutoWidthType;
    }

    public getParentTable(block: BlockWidget): TableWidget {
        let widget: Widget = block;
        while (widget.containerWidget) {
            if (widget.containerWidget instanceof BlockContainer || widget.containerWidget instanceof TextFrame) {
                return widget as TableWidget;
            }
            widget = widget.containerWidget;
        }
        return undefined;
    }

    /* eslint-disable-next-line max-len */
    public reLayoutParagraph(paragraphWidget: ParagraphWidget, lineIndex: number, elementBoxIndex: number, isBidi?: boolean, isSkip?: boolean): void {
        if (this.isReplaceAll || (this.viewer.owner.editorModule && this.viewer.owner.editorModule.restrictLayout)) {
            return;
        }
        this.isRelayout = true;
        if (paragraphWidget.containerWidget instanceof TextFrame
            && (paragraphWidget.containerWidget.containerShape as ShapeElementBox).textWrappingStyle === 'Inline') {
            lineIndex = paragraphWidget.containerWidget.containerShape.line.indexInOwner;
            paragraphWidget = paragraphWidget.containerWidget.containerShape.paragraph;
        }
        isBidi = isNullOrUndefined(isBidi) ? false : isBidi;
        this.isRelayout = true;
        let isLayouted: boolean = false;
        if (this.documentHelper.blockToShift === paragraphWidget) {
            this.layoutBodyWidgetCollection(paragraphWidget.index, paragraphWidget.containerWidget, paragraphWidget, false);
            this.isBidiReLayout = true;
            isLayouted = true;
        } else {
            if (this.isBidiReLayout) {
                this.isBidiReLayout = false;
            }
        }
        // let isElementMoved: boolean = elementBoxIndex > 0;
        let skipWholeTableLayout: boolean = false;
        if (!isLayouted) {
            if (paragraphWidget.isInsideTable) {
                this.isBidiReLayout = true;
                if (this.documentHelper.owner.editorHistoryModule && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo
                    && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.isEmptySelection) {
                    skipWholeTableLayout = true;
                }
                const parentTable: TableWidget = this.getParentTable(paragraphWidget);
                const container: BlockContainer = parentTable.containerWidget as BlockContainer;
                if (!this.isReplacingAll && skipWholeTableLayout && container instanceof BodyWidget && isNullOrUndefined(container.containerWidget)) {
                    const tableHolderBeforeBuildColumn: WTableHolder = parentTable.tableHolder.clone();
                    const tableWidget: TableWidget = (parentTable.clone()).combineWidget(this.viewer) as TableWidget;
                    let isSameColumnWidth: boolean = true;
                    if (tableWidget.tableFormat.allowAutoFit) {
                        tableWidget.isGridUpdated = false;
                        tableWidget.buildTableColumns();
                        tableWidget.isGridUpdated = true;
                        if (tableHolderBeforeBuildColumn.columns.length === tableWidget.tableHolder.columns.length) {
                            for (let i: number = 0; i < tableWidget.tableHolder.columns.length; i++) {
                                const tableAfterColumnWidth: number = tableWidget.tableHolder.columns[i].preferredWidth;
                                const tableBeforeColumnWidth: number = tableHolderBeforeBuildColumn.columns[i].preferredWidth;
                                if (tableAfterColumnWidth !== tableBeforeColumnWidth) {
                                    isSameColumnWidth = false;
                                    break;
                                }
                            }
                        } else {
                            isSameColumnWidth = false;
                        }
                    }
                    if (isSameColumnWidth) {
                        if (paragraphWidget.associatedCell.ownerTable.footnoteElement && paragraphWidget.associatedCell.ownerTable.footnoteElement.length > 0) {
                            this.clearFootnoteReference(paragraphWidget.associatedCell.ownerTable, true);
                        }
                        this.viewer.updateClientAreaForCell(paragraphWidget.associatedCell, true);
                        this.viewer.updateClientAreaForBlock(paragraphWidget, true);
                        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
                            this.viewer.owner.editorModule.updateWholeListItems(paragraphWidget);
                        }
                        this.layoutParagraph(paragraphWidget, 0);
                        this.viewer.updateClientAreaForBlock(paragraphWidget, false);
                        //Get Top level owner of block
                        const table: TableWidget = this.getParentTable(paragraphWidget);
                        let pageIndexBeforeLayouting: number = 0;
                        if (table.containerWidget instanceof BodyWidget) {
                            const blocks: BlockWidget[] = table.getSplitWidgets() as BlockWidget[];
                            const splittedWidget: BlockWidget = blocks[blocks.length - 1];
                            pageIndexBeforeLayouting = (splittedWidget.containerWidget as BodyWidget).page.index;
                        }
                        //Combine splitted table in to single table
                        const currentTable: TableWidget = table.combineWidget(this.viewer) as TableWidget;
                        const bodyWidget: BodyWidget = (currentTable.containerWidget as BodyWidget);
                        if (this.viewer instanceof WebLayoutViewer) {
                            bodyWidget.height -= currentTable.height;
                        }
                        this.viewer.updateClientArea(bodyWidget, bodyWidget.page);
                        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
                            const block: ParagraphWidget = this.documentHelper.getFirstParagraphInFirstCell(currentTable);
                            this.viewer.owner.editorModule.updateWholeListItems(block);
                        }
                        this.viewer.updateClientAreaForBlock(currentTable, true);
                        //Remove border width
                        currentTable.x -= currentTable.leftBorderWidth;
                        currentTable.y -= currentTable.topBorderWidth;
                        //Update Client area for current position
                        const yPos: number = this.getYPosition(currentTable);
                        this.viewer.cutFromTop(yPos);
                        this.clearTableWidget(currentTable, true, true, false, true, true);
                        this.shiftTableWidget(currentTable, this.viewer);
                        this.viewer.updateClientAreaForBlock(currentTable, false);
                        let pageIndexAfterLayouting: number = 0;
                        if (currentTable.containerWidget instanceof BodyWidget) {
                            const blocks: BlockWidget[] = currentTable.getSplitWidgets() as BlockWidget[];
                            const splittedWidget: BlockWidget = blocks[blocks.length - 1];
                            pageIndexAfterLayouting = (splittedWidget.containerWidget as BodyWidget).page.index;
                        }
                        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule && currentTable.nextRenderedWidget) {
                            this.viewer.owner.editorModule.updateWholeListItems(currentTable.nextRenderedWidget as BlockWidget);
                        }
                        this.layoutNextItemsBlock(currentTable, this.viewer, undefined, pageIndexBeforeLayouting !== pageIndexAfterLayouting);
                    } else if (!this.isReplacingAll) {
                        this.reLayoutTable(paragraphWidget);
                    }
                } else if (!this.isReplacingAll) {
                    this.reLayoutTable(paragraphWidget);
                }
                /* eslint-disable-next-line max-len */
                if (this.isFootnoteContentChanged && (!isNullOrUndefined(paragraphWidget.bodyWidget)) && !isNullOrUndefined(paragraphWidget.bodyWidget.page.footnoteWidget)) {
                    const foot: FootNoteWidget = paragraphWidget.bodyWidget.page.footnoteWidget;
                    this.layoutfootNote(foot);
                }
                this.isBidiReLayout = false;
            } else {
                // this.isRelayout = true;
                this.reLayoutLine(paragraphWidget, lineIndex, isBidi, isSkip, undefined);
            }
        }
        if (paragraphWidget.bodyWidget instanceof HeaderFooterWidget &&
            paragraphWidget.bodyWidget.headerFooterType.indexOf('Footer') !== -1) {
            this.shiftFooterChildLocation(paragraphWidget.bodyWidget, this.viewer);
        }
        // this.updateLinearIndex(paragraphWidget);
    }

    private getParentRow(block: BlockWidget): TableRowWidget {
        return this.getParentCell(block).ownerRow;
    }

    /**
     * @private
     */
    public getParentCell(block: BlockWidget): TableCellWidget {
        let cell: TableCellWidget = block as TableCellWidget;
        while (cell.ownerTable !== null && cell.ownerTable.isInsideTable) {
            cell = cell.ownerTable.associatedCell;
        }
        return cell;
    }

    private reLayoutRow(block: BlockWidget): void {
        if (block instanceof ParagraphWidget) {
            block = block.associatedCell;
        }
        const currentRow: TableRowWidget = this.getParentRow(block).getSplitWidgets()[0] as TableRowWidget;
        if (!isNullOrUndefined(currentRow) && !currentRow.ownerTable.tableFormat.allowAutoFit) {
            const currentTable: TableWidget = currentRow.ownerTable.getSplitWidgets()[0].combineWidget(this.viewer) as TableWidget;
            let startRow: TableRowWidget = currentRow;
            while (this.isVerticalMergedCellContinue(startRow)) {
                const previousRow: TableRowWidget = startRow.previousWidget as TableRowWidget;
                if (isNullOrUndefined(previousRow)) {
                    break;
                }
                startRow = previousRow;
            }
            const bodyWidget: BodyWidget = (currentTable.containerWidget as BodyWidget);
            if (this.viewer instanceof WebLayoutViewer) {
                bodyWidget.height -= currentTable.height;
            }
            if ((this.viewer.owner.enableHeaderAndFooter || block.isInHeaderFooter) && !(bodyWidget instanceof TextFrame)) {
                (block.bodyWidget as HeaderFooterWidget).isEmpty = false;
                bodyWidget.height -= currentTable.height;
                /* eslint-disable-next-line max-len */
                (this.viewer as PageLayoutViewer).updateHeaderFooterClientAreaWithTop(currentTable.bodyWidget.sectionFormat, this.documentHelper.isBlockInHeader(currentTable), bodyWidget.page);
            } else if (bodyWidget instanceof TextFrame) {
                this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true);
            } else {
                this.viewer.updateClientArea(bodyWidget, bodyWidget.page);
            }
            /* eslint-disable-next-line max-len */
            const area: Rect = new Rect(this.viewer.clientArea.x, this.viewer.clientArea.y, this.viewer.clientArea.width, this.viewer.clientArea.height);
            const clientArea: Rect = new Rect(area.x, area.y, area.width, area.height);
            if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
                const block: ParagraphWidget = this.documentHelper.getFirstParagraphInFirstCell(currentTable);
                this.viewer.owner.editorModule.updateWholeListItems(block);
            }
            this.viewer.updateClientAreaForBlock(currentTable, true);
            this.viewer.cutFromTop(startRow.y);
            this.viewer.clientActiveArea.height = Number.POSITIVE_INFINITY;
            //Clear Hieght for all the content
            currentTable.height = 0;
            do {
                this.clearRowWidget(currentRow, true, true, true);
                this.layoutRow([currentTable], currentRow, true);
                if (startRow === currentRow) {
                    break;
                }
                startRow = startRow.nextRow;
            } while (startRow && startRow !== currentRow);
            this.updateChildLocationForTable(currentTable.y, currentTable);
            this.viewer.clientArea = clientArea;
            this.viewer.clientActiveArea = new Rect(clientArea.x, clientArea.y, clientArea.width, clientArea.height);
            this.viewer.updateClientAreaForBlock(currentTable, true);
            currentTable.x -= currentTable.leftBorderWidth;
            currentTable.y -= currentTable.topBorderWidth;
            this.viewer.cutFromTop(currentTable.y);
            this.shiftTableWidget(currentTable, this.viewer, true);
            this.layoutNextItemsBlock(currentTable, this.viewer);
        } else {
            this.currentCell = block as TableCellWidget;
            this.reLayoutTable(block);
            this.currentCell = undefined;
        }
    }

    public reLayoutTable(block: BlockWidget, isFootnoteReLayout?: boolean): void {
        if (this.viewer.owner.editorModule && this.viewer.owner.editorModule.restrictLayout) {
            return;
        }
        //Get Top level owner of block
        const table: TableWidget = this.getParentTable(block);
        if (table.header) {
            let tableCollection: Widget[] = table.getSplitWidgets();
            for (let i = 1; i < tableCollection.length; i++) {
                (tableCollection[i] as TableWidget).bodyWidget.page.repeatHeaderRowTableWidget = false;
            }
        }
        let pageIndexBeforeLayouting: number = 0;
        if (table.containerWidget instanceof BodyWidget) {
            const blocks: BlockWidget[] = table.getSplitWidgets() as BlockWidget[];
            const splittedWidget = blocks[blocks.length - 1];
            pageIndexBeforeLayouting = (splittedWidget.containerWidget as BodyWidget).page.index;
        }
        //Combine splitted table in to single table
        const currentTable: TableWidget = table.combineWidget(this.viewer) as TableWidget;
        const bodyWidget: BodyWidget = (currentTable.containerWidget as BodyWidget);
        if (this.viewer instanceof WebLayoutViewer) {
            bodyWidget.height -= currentTable.height;
        }
        if ((this.viewer.owner.enableHeaderAndFooter || block.isInHeaderFooter) && !(bodyWidget instanceof TextFrame)) {
            (block.bodyWidget as HeaderFooterWidget).isEmpty = false;
            bodyWidget.height -= currentTable.height;
            /* eslint-disable-next-line max-len */
            (this.viewer as PageLayoutViewer).updateHeaderFooterClientAreaWithTop(table.bodyWidget.sectionFormat, this.documentHelper.isBlockInHeader(table), bodyWidget.page);
        } else if (bodyWidget instanceof TextFrame) {
            this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true);
        } else {
            this.viewer.updateClientArea(bodyWidget, bodyWidget.page);
        }
        //Clear Hieght for all the content
        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
            const block: ParagraphWidget = this.documentHelper.getFirstParagraphInFirstCell(currentTable);
            this.viewer.owner.editorModule.updateWholeListItems(block);
        }
        this.viewer.updateClientAreaForBlock(currentTable, true);
        //Remove border width
        currentTable.x -= currentTable.leftBorderWidth;
        currentTable.y -= currentTable.topBorderWidth;
        //Update Client area for current position
        let yPos: number = this.getYPosition(currentTable);
        this.viewer.cutFromTop(yPos);
        this.clearTableWidget(currentTable, true, true, true, true);
        this.isBidiReLayout = true;
        this.layoutBlock(currentTable, 0);
        this.viewer.updateClientAreaForBlock(currentTable, false);
        let pageIndexAfterLayouting: number = 0;
        if (currentTable.containerWidget instanceof BodyWidget) {
            const blocks: BlockWidget[] = currentTable.getSplitWidgets() as BlockWidget[];
            const splittedWidget = blocks[blocks.length - 1];
            pageIndexAfterLayouting = (splittedWidget.containerWidget as BodyWidget).page.index;
        }
        this.layoutNextItemsBlock(currentTable, this.viewer, isFootnoteReLayout, pageIndexBeforeLayouting !== pageIndexAfterLayouting);
    }
    private getYPosition(table: TableWidget): number {
        if (table.wrapTextAround) {
            let prevWidget: Widget = table.previousWidget;
            while (prevWidget) {
                if (prevWidget instanceof ParagraphWidget) {
                    return prevWidget.y + prevWidget.height;
                } else if (prevWidget instanceof TableWidget) {
                    if (prevWidget.wrapTextAround) {
                        prevWidget = prevWidget.previousWidget;
                    } else {
                        return prevWidget.y + prevWidget.height;
                    }
                }
            }
            return this.viewer.clientActiveArea.y;
        }
        return table.y;
    }
    private clearFootnoteReference(table: TableWidget, updateClientHeight: boolean): void {
        if (table.footnoteElement && table.footnoteElement.length > 0) {
            let startPage: Page = table.bodyWidget.page;
            for (let i: number = table.footnoteElement.length - 1; i >= 0; i--) {
                let footnote: FootnoteElementBox = table.footnoteElement[i];
                footnote.isLayout = false;
                let footNoteWidget: FootNoteWidget = footnote.bodyWidget.containerWidget as FootNoteWidget;
                if (footNoteWidget && footNoteWidget.bodyWidgets.indexOf(footnote.bodyWidget) !== -1) {
                    let footnoteHeight: number = this.getFootNoteHeight(footnote.bodyWidget);
                    footNoteWidget.height -= footnoteHeight;
                    footNoteWidget.bodyWidgets.splice(footnote.bodyWidget.indexInOwner, 1);
                    if (updateClientHeight && footNoteWidget.page === startPage) {
                        this.viewer.clientActiveArea.height += footnoteHeight;
                        this.viewer.clientArea.height += footnoteHeight;
                    }
                }
                if (footNoteWidget && footNoteWidget.bodyWidgets.length === 0 && footNoteWidget.page) {
                    footNoteWidget.page.footnoteWidget = undefined;
                }
                footnote.bodyWidget.containerWidget = undefined;
            }
            table.footnoteElement = [];
        }
    }
    /**
     * @private
     */
    public clearTableWidget(table: TableWidget, clearPosition: boolean, clearHeight: boolean, clearGrid?: boolean, updateClientHeight?: boolean, skipToClearPara?: boolean): void {
        table.height = 0;
        if (clearGrid) {
            table.isGridUpdated = false;
        }
        if (clearPosition) {
            table.y = 0;
            table.x = 0;
            if (table.footnoteElement && table.footnoteElement.length > 0) {
                this.clearFootnoteReference(table, updateClientHeight);
            }
        }
        table.leftBorderWidth = 0;
        table.rightBorderWidth = 0;
        table.topBorderWidth = 0;
        table.bottomBorderWidth = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            this.clearRowWidget(row, clearPosition, clearHeight, clearGrid, skipToClearPara);
        }
    }
    /**
     * @private
     */
    public clearRowWidget(row: TableRowWidget, clearPosition: boolean, clearHeight: boolean, clearGrid: boolean, skipToClearPara?: boolean): void {
        row.height = 0;
        if (clearPosition) {
            row.y = 0;
            row.x = 0;
        }
        row.topBorderWidth = 0;
        row.bottomBorderWidth = 0;
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            this.clearCellWidget(cell, clearPosition, clearHeight, clearGrid, skipToClearPara);
        }
    }
    /**
     * @private
     */
    public clearCellWidget(cell: TableCellWidget, clearPosition: boolean, clearHeight: boolean, clearGrid: boolean, skipToClearPara?: boolean): void {
        cell.height = 0;
        if (clearPosition) {
            cell.y = 0;
            cell.x = 0;
        }
        cell.leftBorderWidth = 0;
        cell.rightBorderWidth = 0;
        this.clearBlockWidget(cell.childWidgets, clearPosition, clearHeight, clearGrid, skipToClearPara);
    }
    /**
     * @private
     */
    public clearBlockWidget(blocks: IWidget[], clearPosition: boolean, clearHeight: boolean, clearGrid: boolean, skipToClearPara?: boolean): void {
        for (let i: number = 0; i < blocks.length; i++) {
            const block: BlockWidget = blocks[i] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                if (clearPosition && !skipToClearPara) {
                    block.y = 0;
                    block.x = 0;
                }
                if (clearHeight && !skipToClearPara) {
                    block.height = 0;
                }
            } else {
                this.clearTableWidget(block as TableWidget, clearPosition, clearHeight, clearGrid, undefined, skipToClearPara);
            }
        }
    }

    /* eslint-disable-next-line max-len */
    public layoutBodyWidgetCollection(blockIndex: number, bodyWidget: Widget, block: BlockWidget, shiftNextWidget: boolean, isSkipShifting?: boolean, isSelectionInsideTable?: boolean): void {
        if ((!isNullOrUndefined(block) && block.isFieldCodeBlock)) {
            return;
        }
        if (!isNullOrUndefined(this.documentHelper.owner)
            && this.documentHelper.owner.isLayoutEnabled) {
            if (this.viewer.owner.editorModule && this.viewer.owner.editor.restrictLayout) {
                return;
            }
            if (bodyWidget instanceof BlockContainer || bodyWidget instanceof TextFrame) {
                let curretBlock: BlockWidget = this.checkAndGetBlock(bodyWidget, blockIndex);
                if (bodyWidget instanceof BodyWidget && isNullOrUndefined(curretBlock) && !isNullOrUndefined(bodyWidget.nextRenderedWidget) && (bodyWidget.nextRenderedWidget as BodyWidget).sectionFormat.breakCode === 'NoBreak' ) {
                    curretBlock = bodyWidget.nextRenderedWidget.firstChild as BlockWidget;
                    bodyWidget = bodyWidget.nextRenderedWidget as BodyWidget;
                }
                if (isNullOrUndefined(curretBlock)) {
                    return;
                }
                if (this.viewer instanceof WebLayoutViewer) {
                    curretBlock.containerWidget.height -= curretBlock.height;
                }
                if (bodyWidget instanceof HeaderFooterWidget) {
                    bodyWidget.isEmpty = false;
                    (this.viewer as PageLayoutViewer).updateHeaderFooterClientAreaWithTop(bodyWidget.sectionFormat, bodyWidget.headerFooterType.indexOf('Header') !== -1, bodyWidget.page);
                    curretBlock.containerWidget.height -= curretBlock.height;
                } else if (bodyWidget instanceof TextFrame) {
                    this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true, !shiftNextWidget);

                } else if (!isNullOrUndefined(bodyWidget.containerWidget) && bodyWidget.containerWidget instanceof FootNoteWidget) {
                    this.viewer.updateClientArea(bodyWidget as BodyWidget, (bodyWidget as BodyWidget).page, true);
                    if (bodyWidget.containerWidget.footNoteType === 'Footnote') {
                        this.isRelayoutFootnote = true;
                        this.viewer.clientArea.height = Number.POSITIVE_INFINITY;
                        this.viewer.clientActiveArea.height = Number.POSITIVE_INFINITY;
                        //curretBlock.containerWidget.height -= curretBlock.height;
                        this.viewer.clientActiveArea.y = curretBlock.containerWidget.containerWidget.y;
                    } else {
                        this.viewer.cutFromTop(bodyWidget.containerWidget.y);
                        this.layoutfootNote(bodyWidget.containerWidget);
                        return;
                    }
                    // curretBlock.containerWidget.height -= curretBlock.height;
                } else {
                    if (!isNullOrUndefined((bodyWidget as BodyWidget).page.footnoteWidget)) {
                        if ((bodyWidget as BodyWidget).page.footnoteWidget.footNoteType === 'Footnote') {
                            this.viewer.updateClientArea(bodyWidget as BodyWidget, (bodyWidget as BodyWidget).page, true);
                        } else {
                            this.viewer.updateClientArea(bodyWidget as BodyWidget, (bodyWidget as BodyWidget).page, true);
                        }
                    } else {
                        this.viewer.updateClientArea(bodyWidget as BodyWidget, (bodyWidget as BodyWidget).page, true);
                    }
                    // if (bodyWidget.page.footnoteWidget) {
                    //     this.viewer.clientActiveArea.height -= bodyWidget.page.footnoteWidget.height;
                    //     this.viewer.clientArea.height -= bodyWidget.page.footnoteWidget.height;
                    // }
                }
                let pageIndexBeforeLayout: number = 0;
                let pageIndexAfterLayout: number = 0;
                if (curretBlock.containerWidget instanceof BodyWidget) {
                    const blocks: BlockWidget[] = curretBlock.getSplitWidgets() as BlockWidget[];
                    const splittedWidget = blocks[blocks.length - 1];
                    pageIndexBeforeLayout = (splittedWidget.containerWidget as BodyWidget).page.index;
                }
                if (blockIndex > 0 || (curretBlock.bodyWidget.sectionFormat.breakCode === 'NoBreak' && curretBlock.bodyWidget.index !== 0 && curretBlock === bodyWidget.firstChild)) {
                    curretBlock = curretBlock.combineWidget(this.viewer) as BlockWidget;
                    let prevWidget: Widget = curretBlock.getSplitWidgets()[0].previousRenderedWidget as Widget;
                    if (!isNullOrUndefined(prevWidget) && (prevWidget as TableWidget).wrapTextAround && !isNullOrUndefined(prevWidget.getSplitWidgets()[0].previousRenderedWidget) &&
                        (prevWidget as BlockWidget).bodyWidget.index === (prevWidget.getSplitWidgets()[0].previousRenderedWidget as BlockWidget).bodyWidget.index &&
                        prevWidget.y < (prevWidget.getSplitWidgets()[0].previousRenderedWidget as BlockWidget).y) {
                        prevWidget = prevWidget.getSplitWidgets()[0].previousRenderedWidget as Widget;
                    }
                    while (prevWidget instanceof BlockWidget && prevWidget.isFieldCodeBlock) {
                        prevWidget = prevWidget.getSplitWidgets()[0].previousRenderedWidget;
                    }
                    if (!(isNullOrUndefined(prevWidget) || prevWidget instanceof ParagraphWidget) ||
                        (prevWidget instanceof ParagraphWidget) && !prevWidget.isEndsWithPageBreak && !prevWidget.isEndsWithColumnBreak) {
                        if (isNullOrUndefined(isSkipShifting) && curretBlock.containerWidget !== prevWidget.containerWidget) {
                            /* eslint-disable-next-line max-len */
                            const prevBodyWidget: BodyWidget = curretBlock.containerWidget as BodyWidget;
                            const newBodyWidget: BodyWidget = prevWidget.containerWidget as BodyWidget;
                            const footWidgets: BodyWidget[] = this.getFootNoteWidgetsOf(curretBlock);
                            this.moveFootNotesToPage(footWidgets, prevBodyWidget, newBodyWidget);
                            if (curretBlock.bodyWidget.sectionFormat.breakCode !== 'NoBreak' || (curretBlock.bodyWidget.index === (prevWidget as BlockWidget).bodyWidget.index)) {
                                this.viewer.cutFromTop(prevWidget.y + prevWidget.height);
                                this.updateContainerWidget(curretBlock as Widget, newBodyWidget as BodyWidget, prevWidget.indexInOwner + 1, false);
                            } else if (curretBlock.bodyWidget.sectionIndex !== (prevWidget as BlockWidget).bodyWidget.sectionIndex && (prevWidget as BlockWidget).bodyWidget.sectionFormat.numberOfColumns > 1 && curretBlock.bodyWidget.page === (prevWidget as BlockWidget).bodyWidget.page) {
                                let firstBody: BodyWidget = this.getBodyWidget((prevWidget as BlockWidget).bodyWidget, true);
                                let height: number = this.getNextWidgetHeight(firstBody);
                                this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                                this.viewer.clientActiveArea.y = height;
                                this.viewer.clientArea.y = this.viewer.clientActiveArea.y;
                                this.viewer.clientArea.height = this.viewer.clientActiveArea.height;
                            } else {
                                this.viewer.updateClientArea(curretBlock.bodyWidget, curretBlock.bodyWidget.page, true);
                                this.viewer.cutFromTop(prevWidget.y + prevWidget.height);
                            }
                        } else {
                            if (prevWidget instanceof ParagraphWidget && prevWidget.height <= 0 && this.isMultiColumnDoc) {
                                let prevPara: ParagraphWidget = prevWidget as ParagraphWidget;
                                this.viewer.updateClientAreaForBlock(prevPara, true);
                                this.layoutParagraph(prevPara, 0);
                                this.viewer.updateClientArea(prevPara.bodyWidget, prevPara.bodyWidget.page, true);
                            }
                            this.viewer.cutFromTop(prevWidget.y + prevWidget.height);
                        }
                    } else if (prevWidget instanceof ParagraphWidget && (prevWidget.isEndsWithPageBreak || prevWidget.isEndsWithColumnBreak) &&
                        prevWidget.containerWidget === curretBlock.containerWidget) {
                        this.moveBlocksToNextPage(prevWidget, false);
                    }
                }
                let currentParagraph: ParagraphWidget;
                curretBlock = curretBlock.combineWidget(this.viewer) as BlockWidget;
                if (curretBlock instanceof TableWidget) {
                    this.clearTableWidget(curretBlock as TableWidget, true, true);
                    (curretBlock as TableWidget).isGridUpdated = false;
                    currentParagraph = this.documentHelper.getFirstParagraphInFirstCell(curretBlock as TableWidget);
                } else {
                    currentParagraph = curretBlock as ParagraphWidget;
                }
                if ((this.viewer.owner.isDocumentLoaded) && this.viewer.owner.editorModule) {
                    this.viewer.owner.editorModule.updateWholeListItems(currentParagraph);
                }
                this.viewer.updateClientAreaForBlock(curretBlock, true, undefined, false, true);
                this.isRelayout = true;
                this.documentHelper.layout.layoutBlock(curretBlock, 0);
                this.isRelayout = false;
                this.viewer.updateClientAreaForBlock(curretBlock, false);
                if (!isNullOrUndefined(bodyWidget.containerWidget) && bodyWidget.containerWidget instanceof FootNoteWidget) {
                    if (bodyWidget.containerWidget.footNoteType === 'Footnote') {
                        this.layoutfootNote(bodyWidget.containerWidget);
                    }
                }
                let footnote=bodyWidget as BodyWidget;
                if(bodyWidget.containerWidget == undefined && !(bodyWidget instanceof TextFrame) && footnote.page!=undefined && footnote.page.footnoteWidget!=undefined){
                    if(footnote.page.footnoteWidget.footNoteType === 'Footnote'){
                        this.layoutfootNote(footnote.page.footnoteWidget);
                    }
                }
                if (curretBlock.containerWidget instanceof BodyWidget) {
                    const blocks: BlockWidget[] = curretBlock.getSplitWidgets() as BlockWidget[];
                    const splittedWidget = blocks[blocks.length - 1];
                    pageIndexAfterLayout = (splittedWidget.containerWidget as BodyWidget).page.index;
                }
                if (shiftNextWidget) {
                    this.shiftNextWidgets(curretBlock);
                } else {
                    this.layoutNextItemsBlock(curretBlock, this.viewer, undefined, pageIndexBeforeLayout !== pageIndexAfterLayout);
                }
            } else if (bodyWidget instanceof TableCellWidget && !isSelectionInsideTable) {
                this.reLayoutTable(bodyWidget.ownerTable);
            }
        }
        this.isRelayoutFootnote = false;

    }
    /**
     * @private
     */
    public checkAndGetBlock(containerWidget: Widget, blockIndex: number): BlockWidget {
        if (containerWidget instanceof TextFrame) {
            return containerWidget.childWidgets[blockIndex] as BlockWidget;
        } else {
            const sectionIndex: number = containerWidget.indexInOwner;
            if ((containerWidget as BodyWidget).page.bodyWidgets.length <= 1) {
                while (containerWidget && containerWidget.indexInOwner === sectionIndex) {
                    if (containerWidget.childWidgets.length > 0 && (containerWidget.firstChild as Widget).index <= blockIndex &&
                        (containerWidget.lastChild as Widget).index >= blockIndex) {
                        for (let i: number = 0; i < containerWidget.childWidgets.length; i++) {
                            const block: BlockWidget = containerWidget.childWidgets[i] as BlockWidget;
                            if (block.index === blockIndex) {
                                return block;
                            }
                        }
                    }
                    if (containerWidget instanceof BodyWidget) {
                        containerWidget = containerWidget.nextRenderedWidget as BlockContainer;
                    } else {
                        break;
                    }
                }
            } else {
                while (containerWidget) {
                    if (containerWidget.childWidgets.length > 0) {
                        for (let i: number = 0; i < containerWidget.childWidgets.length; i++) {
                            const block: BlockWidget = containerWidget.childWidgets[i] as BlockWidget;
                            if (block.index === blockIndex) {
                                return block;
                            }
                        }
                    }
                    if (containerWidget instanceof BodyWidget) {
                        containerWidget = containerWidget.nextRenderedWidget as BlockContainer;
                    } else {
                        break;
                    }
                }
            }
        }
        return undefined;
    }
    //#endregion

    //#region Table

    public layoutTable(table: TableWidget, startIndex: number): BlockWidget {
        if (this.isFieldCode && !this.checkTableHasField(table) && !this.isRelayout) {
            table.isFieldCodeBlock = true;
            return table;
        }
        if (!isNullOrUndefined(table.previousWidget) && this.viewer.clientActiveArea.height < 0 && !table.wrapTextAround) {
            this.moveBlocksToNextPage(table.previousWidget as BlockWidget, false);
        }
        table.isBidiTable = table.bidi;
        if (!table.isGridUpdated) {
            table.buildTableColumns();
            table.isGridUpdated = true;
        }
        if (this.documentHelper.compatibilityMode !== 'Word2013' 
                && !table.isInsideTable
                && !isNullOrUndefined(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin)) {
            this.viewer.clientActiveArea.x = this.viewer.clientActiveArea.x -
                HelperMethods.convertPointToPixel(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
        }
        const tableView: TableWidget[] = [table];
        this.addTableWidget(this.viewer.clientActiveArea, tableView);
        this.viewer.updateClientAreaTopOrLeft(table, true);
        let clientActiveAreaForTableWrap: Rect;
        let clientAreaForTableWrap: Rect;
        let wrapDiff: number = 0;
        if (table.wrapTextAround) {
            clientActiveAreaForTableWrap = this.viewer.clientActiveArea.clone();
            clientAreaForTableWrap = this.viewer.clientArea.clone();
            this.updateClientAreaForWrapTable(tableView, table, true, clientActiveAreaForTableWrap, clientAreaForTableWrap);
        } else if (!(table.containerWidget instanceof TextFrame)) {
            this.adjustClientAreaBasedOnTextWrapForTable(table, this.viewer.clientActiveArea);
            if (this.isWrapText) {
                wrapDiff = this.viewer.clientActiveArea.x - this.viewer.clientArea.x;
                this.isWrapText = false;
                table.x = this.viewer.clientActiveArea.x;
            }
        }
        if (table.childWidgets.length > 0) {
            const isHeader: boolean = (table.childWidgets[0] as TableRowWidget).rowFormat.isHeader;
            table.header = isHeader;
            table.continueHeader = isHeader;
            table.headerHeight = 0;
        }
        let row: TableRowWidget = table.childWidgets[startIndex] as TableRowWidget;
        let index: number = tableView.length;
        this.updateFootnoteHeight(table, true);
        while (row) {
            row = this.layoutRow(tableView, row);
            row = row.nextRow as TableRowWidget;
        }
        this.updateFootnoteHeight(table, false);
        if (this.documentHelper.viewer instanceof PageLayoutViewer && table.wrapTextAround && (table.positioning.verticalAlignment === 'Bottom' || table.positioning.verticalAlignment === 'Center' || table.positioning.verticalAlignment === 'Outside')) {
            this.updateTableFloatPoints(table);
            this.updateChildLocationForTable(table.y, table);
        }
        this.updateWidgetsToPage(tableView, [], table, true);
        if (wrapDiff > 0) {
            this.viewer.clientArea.x = this.viewer.clientArea.x - wrapDiff;
        }
        if (table.wrapTextAround) {
            this.updateClientAreaForWrapTable(tableView, table, false, clientActiveAreaForTableWrap, clientAreaForTableWrap);
        }
        tableView[tableView.length - 1].isLayouted = true;
        tableView[tableView.length - 1].isFieldCodeBlock = false;
        if (this.documentHelper.compatibilityMode !== 'Word2013' 
                && !table.isInsideTable 
                && !table.wrapTextAround
                && !isNullOrUndefined(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin)) {
            this.viewer.clientArea.x = this.viewer.clientArea.x + HelperMethods.convertPointToPixel(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
        }
        return tableView[tableView.length - 1];
    }

    private updateFootnoteHeight(block: BlockWidget, isUpdateFootHeight: boolean, getBottom?: boolean): number {
        if ((!this.isInitialLoad || getBottom) && !block.isInsideTable && !isNullOrUndefined(block.bodyWidget) && !isNullOrUndefined(block.bodyWidget.page.footnoteWidget) &&
        block.bodyWidget.page.footnoteWidget.footNoteType === 'Footnote') {
            const page: Page = block.bodyWidget.page;
            const section: BodyWidget = page.bodyWidgets[0];
            const pageHeight: number = HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight);
            let top: number = HelperMethods.convertPointToPixel(section.sectionFormat.topMargin);
            const bottomMargin: number = HelperMethods.convertPointToPixel(section.sectionFormat.bottomMargin);
            let bottom: number = 0.667 + bottomMargin;
            let isEmptyWidget: boolean = false;
            let headerDistance: number = 48;
            let footerDistance: number = 48;
            if (!isNullOrUndefined(section.sectionFormat)) {
                top = HelperMethods.convertPointToPixel(section.sectionFormat.topMargin);
                headerDistance = HelperMethods.convertPointToPixel(section.sectionFormat.headerDistance);
                footerDistance = HelperMethods.convertPointToPixel(section.sectionFormat.footerDistance);
            }
            if (!isNullOrUndefined(page.headerWidget)) {
                isEmptyWidget = page.headerWidget.isEmpty;
                if(top >= 0) {
                    if (!isEmptyWidget || isEmptyWidget && this.documentHelper.owner.enableHeaderAndFooter) {
                        top = Math.min(Math.max(headerDistance + page.headerWidget.height, top), pageHeight / 100 * 40);
                    }
                } else {
                    top = Math.abs(top);
                }
            }
            if (!isNullOrUndefined(page.footerWidget)) {
                isEmptyWidget = page.footerWidget.isEmpty;
                let footnoteHeight: number = !isNullOrUndefined(page.footnoteWidget) ? page.footnoteWidget.height : 0;
                footnoteHeight = Math.min(footnoteHeight, ((pageHeight - top - bottom) / 100 * 90));
                if (bottom >= 0) {
                    if (!isEmptyWidget || isEmptyWidget && this.documentHelper.owner.enableHeaderAndFooter) {
                        bottom = 0.667 + Math.min(pageHeight / 100 * 40, Math.max(footerDistance + page.footerWidget.height, bottomMargin));
                    }
                } else {
                    bottom = Math.abs(bottom);
                }
                if (!getBottom) {
                    bottom += footnoteHeight;
                }
            }
            if (!isNullOrUndefined(page.footnoteWidget)) {
                const footnoteHeight: number = !isNullOrUndefined(page.footnoteWidget) ? page.footnoteWidget.height : 0;
                //bottom += footnoteHeight;
                const height: number = pageHeight - top - bottom;
                if (getBottom) {
                    return height + this.viewer.clientArea.y;
                }
                if (isUpdateFootHeight && height === this.viewer.clientArea.height) {
                    this.viewer.clientArea.height += footnoteHeight;
                } else if (height + footnoteHeight === this.viewer.clientArea.height) {
                    this.viewer.clientArea.height -= footnoteHeight;
                }
            }
        } return 0;
    }
    private updateClientAreaForWrapTable(tables: TableWidget[], table: TableWidget, beforeLayout: boolean, clientActiveAreaForTableWrap: Rect, clientAreaForTableWrap: Rect): void {
        if (beforeLayout) {
            if (table.wrapTextAround) {
                this.updateTableFloatPoints(table);
                let clienactare: Rect = this.viewer.clientActiveArea.clone();
                let rect: Rect = this.adjustClientAreaBasedOnTextWrapForTable(table, this.viewer.clientActiveArea);
                if (clienactare.x !== rect.x) {
                    table.x = this.viewer.clientActiveArea.x;
                }
                if (clienactare.y !== rect.y) {
                    table.y = this.viewer.clientActiveArea.y;
                }
            }
        } else {
            if (table.wrapTextAround && table.bodyWidget) {
                if (tables.length == 1) {
                    if (!isNullOrUndefined(table.previousWidget) || table.isInHeaderFooter || table.isInsideTable) {
                        let clientActiveArea: Rect = clientActiveAreaForTableWrap.clone();
                        let clientArea: Rect = clientAreaForTableWrap.clone();
                        if (table.bodyWidget.lastChild !== tables[tables.length - 1]) {
                            this.viewer.clientActiveArea = clientActiveArea;
                            this.viewer.clientArea = clientArea;
                        }
                        if (!table.isLayouted && clientActiveArea.height < table.height && table.width >= clientActiveArea.width) {
                            this.moveBlocksToNextPage(table.previousWidget as BlockWidget, false);
                        }
                    } else {
                        this.documentHelper.tableLefts.pop();
                        this.viewer.updateClientArea(table.bodyWidget, table.bodyWidget.page);
                    }
                    if (table.bodyWidget.floatingElements.indexOf(table) === -1) {
                        table.bodyWidget.floatingElements.push(table);
                    }
                } else {
                    if (!isNullOrUndefined(table.previousWidget) && !table.isLayouted && clientActiveAreaForTableWrap.height < table.height && table.width >= clientActiveAreaForTableWrap.width) {
                        let splittedTable: TableWidget = table;
                        do {
                            this.moveBlocksToNextPage(splittedTable.previousWidget as BlockWidget, false);
                            splittedTable = splittedTable.nextSplitWidget as TableWidget;
                        } while (splittedTable);
                    }
                    this.documentHelper.tableLefts.pop();
                    this.viewer.updateClientArea(table.bodyWidget, table.bodyWidget.page);
                    for (let z: number = 0; z < tables.length; z++) {
                        let bodyWidget: BlockContainer = tables[z].bodyWidget;
                        if (!isNullOrUndefined(bodyWidget) && bodyWidget.floatingElements.indexOf(tables[z]) === -1) {
                            bodyWidget.floatingElements.push(tables[z]);
                        }
                    }
                    let splittedTable : TableWidget = tables[tables.length - 1];
                    this.viewer.cutFromTop(this.viewer.clientActiveArea.y + splittedTable.height + splittedTable.tableFormat.borders.bottom.lineWidth);
                }
            }
        }
    }

    public addTableWidget(area: Rect, table: TableWidget[], create?: boolean): TableWidget {
        let tableWidget: TableWidget = table[table.length - 1];
        if (create) {
            tableWidget = this.createTableWidget(tableWidget);
            table.push(tableWidget);
        }
        tableWidget.width = area.width;
        tableWidget.x = area.x;
        tableWidget.y = area.y;
        //Update the table height of tableWidget when cell spacing has been defined.
        if (tableWidget.tableFormat.cellSpacing > 0) {
            tableWidget.height = tableWidget.height + HelperMethods.convertPointToPixel(tableWidget.tableFormat.cellSpacing);
            if (!tableWidget.isBidiTable) {
                /* eslint-disable-next-line max-len */
                tableWidget.leftBorderWidth = HelperMethods.convertPointToPixel(this.getTableLeftBorder(tableWidget.tableFormat.borders).getLineWidth());
                /* eslint-disable-next-line max-len */
                tableWidget.rightBorderWidth = HelperMethods.convertPointToPixel(this.getTableRightBorder(tableWidget.tableFormat.borders).getLineWidth());
            } else { // Right to left direction table.
                /* eslint-disable-next-line max-len */
                tableWidget.leftBorderWidth = HelperMethods.convertPointToPixel(this.getTableRightBorder(tableWidget.tableFormat.borders).getLineWidth());
                /* eslint-disable-next-line max-len */
                tableWidget.rightBorderWidth = HelperMethods.convertPointToPixel(this.getTableLeftBorder(tableWidget.tableFormat.borders).getLineWidth());
            }

            /* eslint-disable-next-line max-len */
            tableWidget.topBorderWidth = HelperMethods.convertPointToPixel(this.getTableTopBorder(tableWidget.tableFormat.borders).getLineWidth());
            /* eslint-disable-next-line max-len */
            tableWidget.bottomBorderWidth = HelperMethods.convertPointToPixel(this.getTableBottomBorder(tableWidget.tableFormat.borders).getLineWidth());
            tableWidget.x += tableWidget.leftBorderWidth;
            tableWidget.y += tableWidget.topBorderWidth;
            tableWidget.width -= tableWidget.leftBorderWidth;
            tableWidget.width -= tableWidget.rightBorderWidth;
            tableWidget.height += tableWidget.bottomBorderWidth;
        }
        return tableWidget;
    }

    public updateWidgetsToPage(tables: TableWidget[], rows: TableRowWidget[], table: TableWidget, rearrangeRow:boolean, endRowWidget?: TableRowWidget): void {
        const viewer: LayoutViewer = this.viewer;
        const tableWidget: TableWidget = tables[tables.length - 1] as TableWidget;
        if (!table.isInsideTable) {
            for (let i: number = 0; i < tables.length; i++) {
                this.updateHeightForTableWidget(tables, rows, tables[i], endRowWidget);
            }
            if (tableWidget.childWidgets.length > 0 && tableWidget.y !== (tableWidget.childWidgets[0] as Widget).y) {
                tableWidget.y = (tableWidget.childWidgets[0] as Widget).y;
            }
            // Need to update on this further
            //Adds the table widget to owner cell widget.
            // (viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as TableCellWidget).childWidgets.push(tableWidget);
            // tableWidget.containerWidget = viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as BodyWidget;
            // (viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as TableCellWidget).height = (viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as TableCellWidget).height + tableWidget.height;
        }
        // Shift the widgets for Right to left directed table.
        if (table.isBidiTable && rearrangeRow) {
            for (let i: number = 0; i < tables.length; i++) {
                let layoutedTable: TableWidget = tables[i];
                for (let j: number = 0; j < layoutedTable.childWidgets.length; j++) {
                    let layoutedRow: TableRowWidget = layoutedTable.childWidgets[j] as TableRowWidget;
                    layoutedRow.shiftWidgetForRtlTable();
                }
            }
        }
        if (table.tableFormat.cellSpacing > 0) {
            /* eslint-disable-next-line max-len */
            if (tableWidget.y + tableWidget.height + HelperMethods.convertPointToPixel(table.tableFormat.cellSpacing) > viewer.clientArea.bottom && viewer instanceof WebLayoutViewer) {
                //update the table height when split to next page. Which is equivalent Ms Word Behaviour.
                //In Ms Word if the Table Split to next page the bottom spacing of the table will be half of the current spacing.
                //And the Remaining space will be used in next page top of the table.
                tableWidget.height = tableWidget.height - HelperMethods.convertPointToPixel(table.tableFormat.cellSpacing) / 2;
            }
            //Update the current Y position of current clientactivearea.
            viewer.cutFromTop(tableWidget.y + tableWidget.height);
        }
        if (this.viewer instanceof WebLayoutViewer) {
            table.containerWidget.height += table.height;
        }
        if (table.bodyWidget instanceof HeaderFooterWidget && !table.wrapTextAround) {
            table.containerWidget.height += table.height;
            if (this.viewer.owner.enableHeaderAndFooter && table.bodyWidget.headerFooterType.indexOf('Footer') !== -1) {
                this.shiftFooterChildLocation(table.bodyWidget, this.viewer);
            }
        }
    }

    /* eslint-disable-next-line max-len */
    public updateHeightForTableWidget(tables: TableWidget[], rows: TableRowWidget[], tableWidget: TableWidget, endRowWidget?: TableRowWidget): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            const rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            if (rowWidget === endRowWidget) {
                break;
            }
            this.updateHeightForRowWidget(this.viewer, true, tables, rows, rowWidget, false, endRowWidget);
        }
    }

    //#endregion

    //#region Row

    public layoutRow(tableWidget: TableWidget[], row: TableRowWidget, isRowLayout?: boolean): TableRowWidget {
        let isNestedTable = row.ownerTable.isInsideTable;
        if (!isNestedTable) {
            this.updateExistingFootnoteHeight(row);
        }
        const viewer: LayoutViewer = this.viewer;
        const rowWidgets: TableRowWidget[] = [row];
        this.addTableRowWidget(viewer.clientActiveArea, rowWidgets) as TableRowWidget;
        viewer.updateClientAreaForRow(row, true);
        const topMargin: number = this.getMaxTopCellMargin(row);
        const bottomMargin: number = this.getMaxBottomCellMargin(row);
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            this.layoutCell(cell, topMargin + row.topBorderWidth, bottomMargin + row.bottomBorderWidth);
        }
        viewer.updateClientAreaForRow(row, false);
        const rows: TableRowWidget[] = [row];
        if (!isRowLayout) {
            this.updateWidgetsToTable(tableWidget, rows, row, false);
        }
        if (!isNestedTable) {
            this.layoutedFootnoteElement = [];
        }
        return rows[rows.length - 1];
    }
    private updateExistingFootnoteHeight(row: TableRowWidget): void {
        this.layoutedFootnoteElement = [];
        if (!isNullOrUndefined(row.bodyWidget.page.footnoteWidget) && row.bodyWidget.page.footnoteWidget.bodyWidgets.length !== 0) {
            this.existFootnoteHeight = row.bodyWidget.page.footnoteWidget.height;
        } else {
            this.existFootnoteHeight = 0;
        }
    }
    private isIntersecting(startPosition: number, endPosition: number, adjacentStartPosition: number, adjacentEndPosition: number): boolean {
        return ((HelperMethods.round(adjacentStartPosition, 2) <= HelperMethods.round(startPosition, 2) || HelperMethods.round(adjacentStartPosition, 2) < HelperMethods.round(endPosition, 2))
            && HelperMethods.round(adjacentEndPosition, 2) > HelperMethods.round(startPosition, 2));
    }
    private getAdjacentRowCell(cell: TableCellWidget, cellStartPos: number, cellEndPos: number, rowIndex: number): TableCellWidget[] {
        const adjCells: TableCellWidget[] = [];
        const columnLength: number = cell.ownerTable.tableHolder.columns.length;
        let adjRow: TableRowWidget = cell.ownerTable.childWidgets[rowIndex] as TableRowWidget;
        if (isNullOrUndefined(adjRow)) {
            return adjCells;
        }
        let prevCellEndPos: number = 0;
        let prevCellEndIndex: number = 0;
        let colSpan: number = cell.cellFormat.columnSpan;
        let columnIndex: number = cell.columnIndex;
        if (adjRow.rowFormat.gridBefore > 0) {
            if (adjRow.rowFormat.gridBefore > columnIndex + colSpan) {
                //When previous rows Grid before occupies more than cell width, returns empty collection.
                return adjCells;
            }
            prevCellEndPos = adjRow.rowFormat.beforeWidth;
            prevCellEndIndex = adjRow.rowFormat.gridBefore;
        }
        for (let i: number = 0; i < adjRow.childWidgets.length; i++) {
            const adjCell: TableCellWidget = adjRow.childWidgets[i] as TableCellWidget;
            const adjCellStartPos: number = adjCell.x - adjCell.margin.left;
            const adjCellEndPos: number = adjCell.x + adjCell.width + adjCell.margin.right;
            const adjCellEndIndex = adjCell.columnIndex + adjCell.cellFormat.columnSpan;
            if (i == adjRow.childWidgets.length - 1 ||
                (HelperMethods.round(adjCellStartPos, 2) > HelperMethods.round(prevCellEndPos, 2)
                    && HelperMethods.round(adjCellStartPos, 2) > HelperMethods.round(cellStartPos, 2))) {
                if (i == adjRow.childWidgets.length - 1 && adjRow.rowFormat.gridAfter > 0
                    && adjCellEndIndex + adjRow.rowFormat.gridAfter === columnLength) {
                    //Only grid after present after this adjacent cell, no need to continue next.
                    return adjCells;
                }
                //When there is difference in adjacent cell start position and previous cell end position, there is an vertical merge continued cell.
                //Iterates with the previous end cell column index till adjacent cell's column index to retrieve the vertical merge start cell in that region.
                if (this.isIntersecting(cellStartPos, cellEndPos, prevCellEndPos, adjCellStartPos)) {
                    while (colSpan > 0) {
                        let prevRowAdjCell: TableCellWidget = adjRow.getVerticalMergeStartCell(columnIndex, colSpan);
                        let prevRowAdjCellEndPos: number = 0;
                        if (!isNullOrUndefined(prevRowAdjCell)) {
                            let adjCellColumnSpan: number = prevRowAdjCell.cellFormat.columnSpan;
                            adjCells.push(prevRowAdjCell);
                            prevRowAdjCellEndPos = prevRowAdjCell.x + prevRowAdjCell.width + prevRowAdjCell.margin.right;
                            cellStartPos = prevRowAdjCellEndPos;
                            prevCellEndIndex = prevRowAdjCell.columnIndex + adjCellColumnSpan;
                            colSpan -= prevCellEndIndex - columnIndex;
                            columnIndex = prevCellEndIndex;
                            if (HelperMethods.round(prevRowAdjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2)) {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            if (this.isIntersecting(cellStartPos, cellEndPos, adjCellStartPos, adjCellEndPos)) {
                adjCells.push(adjCell);
                cellStartPos = adjCellEndPos;
                colSpan -= adjCellEndIndex - columnIndex;
                columnIndex = adjCellEndIndex;
            }
            if (HelperMethods.round(adjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2)) {
                //Once Adjacent cell end position reaches the current cell end position, no need to iterate next.
                break;
            }
            prevCellEndPos = adjCellEndPos;
            prevCellEndIndex = adjCellEndIndex;
        }
        return adjCells;
    }

    private addTableRowWidget(area: Rect, row: TableRowWidget[]): Widget {
        const rowWidget: TableRowWidget = row[row.length - 1];
        if ((rowWidget.rowFormat.beforeWidth !== 0 || rowWidget.rowFormat.gridBeforeWidth !== 0) && ((this.documentHelper.alignTablesRowByRow) ? rowWidget.ownerTable.tableFormat.tableAlignment === 'Left' : true)) {
            rowWidget.x += (rowWidget.rowFormat.beforeWidth !== 0) ? rowWidget.rowFormat.beforeWidth : rowWidget.rowFormat.gridBeforeWidth;
        } else {
            rowWidget.x = area.x;
        }
        rowWidget.y = area.y;
        rowWidget.width = area.width;
        let borderWidth: number = 0;
        if (!isNullOrUndefined(rowWidget.ownerTable) && !isNullOrUndefined(rowWidget.ownerTable.tableFormat)
            && rowWidget.ownerTable.tableFormat.cellSpacing > 0) {
            rowWidget.height = rowWidget.height + HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableFormat.cellSpacing);
            //Update the table height with the border width to layout the border when the cell spacing is defined..
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                if (!isNullOrUndefined((rowWidget.childWidgets[j] as TableCellWidget).cellFormat)
                    && !isNullOrUndefined((rowWidget.childWidgets[j] as TableCellWidget).cellFormat.borders)) {
                    /* eslint-disable-next-line max-len */
                    const width: number = (TableCellWidget.getCellBottomBorder(rowWidget.childWidgets[j] as TableCellWidget) as WBorder).getLineWidth();
                    if (width > borderWidth) {
                        borderWidth = width;
                    }
                }
            }
            //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
            rowWidget.bottomBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
            if (rowWidget.index > 0 && !isNullOrUndefined(rowWidget.previousWidget)) {
                const prevRow: TableRowWidget = (rowWidget.previousWidget as TableRowWidget);
                borderWidth = 0;
                for (let i: number = 0; i < prevRow.childWidgets.length; i++) {
                    /* eslint-disable-next-line max-len */
                    if (!isNullOrUndefined((prevRow.childWidgets[i] as TableCellWidget).cellFormat) && !isNullOrUndefined((prevRow.childWidgets[i] as TableCellWidget).cellFormat.borders)) {
                        /* eslint-disable-next-line max-len */
                        const value: number = (TableCellWidget.getCellBottomBorder(prevRow.childWidgets[i] as TableCellWidget) as WBorder).getLineWidth();
                        if (value > borderWidth) {
                            borderWidth = value;
                        }
                    }
                }
                //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
                rowWidget.topBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
            }
        }
        if (!isNullOrUndefined(rowWidget.childWidgets)) {
            for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
                /* eslint-disable-next-line max-len */
                if (!isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat) && !isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat.borders)) {
                    /* eslint-disable-next-line max-len */
                    const topBorderWidth: number = (TableCellWidget.getCellTopBorder(rowWidget.childWidgets[i] as TableCellWidget) as WBorder).getLineWidth();
                    if (topBorderWidth > borderWidth) {
                        borderWidth = topBorderWidth;
                    }
                }
            }
        }
        //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
        rowWidget.topBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
        //Update the table height of tableWidget when cell spacing has been defined.
        /* eslint-disable-next-line max-len */
        if (!isNullOrUndefined(rowWidget.ownerTable) && !isNullOrUndefined(rowWidget.ownerTable.tableFormat) && rowWidget.ownerTable.tableFormat.cellSpacing <= 0 && rowWidget.rowIndex === rowWidget.ownerTable.childWidgets.length - 1) {
            // Update the bottom width for last row .
            for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
                /* eslint-disable-next-line max-len */
                if (!isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat) && !isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat.borders)) {
                    /* eslint-disable-next-line max-len */
                    const bottomBorderWidth: number = (TableCellWidget.getCellBottomBorder(rowWidget.childWidgets[i] as TableCellWidget) as WBorder).getLineWidth();
                    if (bottomBorderWidth > borderWidth) {
                        borderWidth = bottomBorderWidth;
                    }
                }
            }
            //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
            rowWidget.bottomBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
        }
        //tableRowWidget.ownerWidget = owner;
        return rowWidget;
    }

    private getMaxTopCellMargin(row: TableRowWidget): number {
        if (isNullOrUndefined(row.childWidgets)) {
            return 0;
        }
        let value: number = 0;
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            let topMargin: number = 0;
            if (cell.cellFormat.hasValue('topMargin')) {
                topMargin = HelperMethods.convertPointToPixel(cell.cellFormat.topMargin);
            } else if (row.rowFormat.hasValue('topMargin')) {
                topMargin = HelperMethods.convertPointToPixel(row.rowFormat.topMargin);
            } else {
                topMargin = HelperMethods.convertPointToPixel(row.ownerTable.tableFormat.topMargin);
            }
            if (topMargin > value) {
                value = topMargin;
            }
        }
        return value;
    }

    private getMaxBottomCellMargin(row: TableRowWidget): number {
        if (isNullOrUndefined(row.childWidgets)) {
            return 0;
        }
        let value: number = 0;
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            let bottomMargin: number = 0;
            if (cell.cellFormat.hasValue('bottomMargin')) {
                bottomMargin = HelperMethods.convertPointToPixel(cell.cellFormat.bottomMargin);
            } else if (row.rowFormat.hasValue('bottomMargin')) {
                bottomMargin = HelperMethods.convertPointToPixel(row.rowFormat.bottomMargin);
            } else {
                bottomMargin = HelperMethods.convertPointToPixel(row.ownerTable.tableFormat.bottomMargin);
            }
            if (bottomMargin > value) {
                value = bottomMargin;
            }
        }
        return value;
    }
    //#endregion Row

    //#region cell

    private layoutCell(cell: TableCellWidget, maxCellMarginTop: number, maxCellMarginBottom: number): void {
        const viewer: LayoutViewer = this.viewer;
        this.addTableCellWidget(cell, viewer.clientActiveArea, maxCellMarginTop, maxCellMarginBottom) as TableCellWidget;
        this.updateTopBorders(cell);
        viewer.updateClientAreaForCell(cell, true);
        if (cell.childWidgets.length === 0) {
            const paragraphWidget: ParagraphWidget = new ParagraphWidget();
            paragraphWidget.characterFormat = new WCharacterFormat();
            paragraphWidget.paragraphFormat = new WParagraphFormat();
            paragraphWidget.index = 0;
            const lineWidget: LineWidget = new LineWidget(paragraphWidget);
            paragraphWidget.childWidgets.push(lineWidget);
            cell.childWidgets.push(paragraphWidget);
            paragraphWidget.paragraphFormat.borders = new WBorders();
        }
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            const block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            viewer.updateClientAreaForBlock(block, true);
            block.containerWidget = cell;
            this.layoutBlock(block, 0);
            viewer.updateClientAreaForBlock(block, false);
        }
        this.updateWidgetToRow(cell);
        viewer.updateClientAreaForCell(cell, false);
    }
    private isInsertTable(): boolean {
        if (this.documentHelper.owner.editorHistoryModule && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.action === 'InsertTable')
            return true;
        else
            return false;
    }
    private updateTopBorders(cell: TableCellWidget): void {
        cell.updatedTopBorders = [];
        if (cell.ownerTable.tableFormat.cellSpacing === 0) {
            let cellTopBorder: WBorder = cell.cellFormat.borders.top;
            if (!cellTopBorder.isBorderDefined || (cellTopBorder.isBorderDefined
                && cellTopBorder.lineStyle === 'None' && cellTopBorder.lineWidth === 0 &&
                cellTopBorder.hasValue('color'))) {
                cellTopBorder = cell.ownerRow.rowFormat.borders.horizontal;
            }
            if (!cellTopBorder.isBorderDefined) {
                cellTopBorder = cell.ownerRow.ownerTable.tableFormat.borders.horizontal;
            }
            const cellStartPos: number = cell.x - cell.margin.left;
            const cellEndPos: number = cell.x + cell.width + cell.margin.right;
            const adjCells: TableCellWidget[] = this.getAdjacentRowCell(cell, cellStartPos, cellEndPos, cell.ownerRow.indexInOwner - 1);
            for (let j: number = 0; j < adjCells.length; j++) {
                const adjCell: TableCellWidget = adjCells[j];
                let prevCellBottomBorder: WBorder = adjCell.cellFormat.borders.bottom;
                if (!prevCellBottomBorder.isBorderDefined || (prevCellBottomBorder.isBorderDefined
                    && prevCellBottomBorder.lineStyle === 'None' && prevCellBottomBorder.lineWidth === 0 &&
                    prevCellBottomBorder.hasValue('color'))) {
                    prevCellBottomBorder = adjCell.ownerRow.rowFormat.borders.horizontal;
                }
                if (!prevCellBottomBorder.isBorderDefined) {
                    prevCellBottomBorder = adjCell.ownerRow.ownerTable.tableFormat.borders.horizontal;
                }
                let border: WBorder;
                if (cellTopBorder.lineStyle === 'None' || cellTopBorder.lineStyle === 'Cleared') {
                    border = prevCellBottomBorder;
                } else if (prevCellBottomBorder.lineStyle === 'Cleared' || prevCellBottomBorder.lineStyle === 'None') {
                    border = cellTopBorder;
                } else {
                    border = cell.getBorderBasedOnPriority(cellTopBorder, prevCellBottomBorder);
                }
                const adjCellStartPos: number = adjCell.x - adjCell.margin.left;
                const adjCellEndPos: number = adjCell.x + adjCell.width + adjCell.margin.right;
                if (j === 0 && cellStartPos < adjCellStartPos) {
                    cell.updatedTopBorders.push({ border: cellTopBorder, width: (adjCellStartPos - cellStartPos) });
                }
                if (border) {
                    let width: number = 0;
                    /* eslint-disable-next-line max-len */
                    if (HelperMethods.round(adjCellEndPos, 2) === HelperMethods.round(cellEndPos, 2) && HelperMethods.round(adjCellStartPos, 2) === HelperMethods.round(cellStartPos, 2)) {
                        width = cellEndPos - cellStartPos;
                        /* eslint-disable-next-line max-len */
                    } else if (HelperMethods.round(adjCellStartPos, 2) >= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2)) {
                        width = cellEndPos - adjCellStartPos;
                        /* eslint-disable-next-line max-len */
                    } else if (HelperMethods.round(adjCellStartPos, 2) >= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) <= HelperMethods.round(cellEndPos, 2)) {
                        width = adjCellEndPos - adjCellStartPos;
                        /* eslint-disable-next-line max-len */
                    } else if (HelperMethods.round(adjCellStartPos, 2) <= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) <= HelperMethods.round(cellEndPos, 2)) {
                        width = adjCellEndPos - cellStartPos;
                        /* eslint-disable-next-line max-len */
                    } else if (HelperMethods.round(adjCellStartPos, 2) <= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2)) {
                        width = cellEndPos - cellStartPos;
                    } else {
                        width = cellEndPos - cellStartPos;
                    }
                    if (width < 0) {
                        width = 0;
                    }
                    cell.updatedTopBorders.push({ border: border, width: width });
                }
                if (j === (adjCells.length - 1) && cellEndPos > adjCellEndPos) {
                    cell.updatedTopBorders.push({ border: cellTopBorder, width: (cellEndPos - adjCellEndPos) });
                }
            }
        }
    }

    //endregion cell

    //#region Shifting

    public shiftLayoutedItems(reLayout: boolean, isMultiColumnShift?: boolean): void {
        if (isNullOrUndefined(this.documentHelper.blockToShift) || isNullOrUndefined(this.documentHelper.blockToShift.containerWidget) || (this.viewer.owner.editorModule && this.viewer.owner.editorModule.restrictLayout)) {
            this.documentHelper.blockToShift = undefined;
            this.checkAndShiftEndnote();
            if (!reLayout) {
                this.documentHelper.removeEmptyPages();
            }
            return;
        }
        let block: BlockWidget = this.documentHelper.blockToShift;
        let isColumnBreak = this.getColumnBreak(block.bodyWidget);
        if (!isColumnBreak && this.viewer instanceof PageLayoutViewer && !this.isMultiColumnSplit && block === block.bodyWidget.firstChild && !isNullOrUndefined(block.bodyWidget.previousRenderedWidget) && block.bodyWidget.sectionIndex !== (block.bodyWidget.previousRenderedWidget as BodyWidget).sectionIndex && (block.bodyWidget.previousRenderedWidget as BodyWidget).sectionFormat.columns.length > 1) {
            let previousBodyWidget: BodyWidget = block.bodyWidget.previousRenderedWidget as BodyWidget;
            let lastbody = this.getBodyWidget(previousBodyWidget, false);
            if (!isNullOrUndefined(lastbody.nextRenderedWidget) && lastbody.page === (lastbody.nextRenderedWidget as BodyWidget).page) {
                this.splitBodyWidgetBasedOnColumn(previousBodyWidget);
            }
        }
        let isFirstBlock: boolean = false;
        let lastPage: Page = this.documentHelper.pages[this.documentHelper.pages.length - 1];
        let lastSection: BodyWidget = lastPage.bodyWidgets[lastPage.bodyWidgets.length - 1];
        if ((!isColumnBreak || (reLayout && this.isSectionEndsWithColumnBreak(block.bodyWidget))) && this.viewer instanceof PageLayoutViewer && !this.isMultiColumnSplit && block.bodyWidget.sectionFormat.columns.length > 1) {
            // let lastbody: BodyWidget = this.getBodyWidget(block.bodyWidget, false);
            // if (((!isNullOrUndefined(lastbody.nextRenderedWidget) && lastbody.page === (lastbody.nextRenderedWidget as BodyWidget).page) && !(block.bodyWidget.firstChild === block && isNullOrUndefined(block.bodyWidget.previousWidget) && this.viewer.clientActiveArea.height > (block.firstChild as Widget).height))|| (this.documentHelper.endnoteCollection.length > 0 && lastSection === lastbody)) {
                if (block.bodyWidget.columnIndex === 0 && block === block.bodyWidget.firstChild && !isNullOrUndefined(block.previousRenderedWidget) && block.bodyWidget.page === (block.previousRenderedWidget as BlockWidget).bodyWidget.page) {
                    block.bodyWidget.y = this.viewer.clientActiveArea.y;
                }
                isFirstBlock = block === block.bodyWidget.firstChild;
                this.reLayoutMultiColumn(block.bodyWidget, isFirstBlock, block.index);
                if (isNullOrUndefined(this.documentHelper.blockToShift)) {
                    return;
                }
                block = this.documentHelper.blockToShift;
            // }
        }
        const sectionIndex: number = block.bodyWidget.index;
        this.reLayoutOrShiftWidgets(block, this.viewer, isMultiColumnShift);
        let updateNextBlockList: boolean = true;
        // If flow layout, then all sections are in single page. Hence need to update till last block of last section.
        // Todo: For page layout and section break continuous, need to handle the same.
        let splittedWidget: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        let nextBlock: BlockWidget = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        let footnoteCollection: BodyWidget[] = [];
        while (nextBlock instanceof BlockWidget && (nextBlock.bodyWidget.index === sectionIndex || (nextBlock.bodyWidget.sectionFormat.breakCode === 'NoBreak' && block.bodyWidget.sectionFormat.pageWidth === nextBlock.bodyWidget.sectionFormat.pageWidth && block.bodyWidget.sectionFormat.pageHeight === nextBlock.bodyWidget.sectionFormat.pageHeight))) {
            if (isMultiColumnShift && nextBlock.bodyWidget.sectionFormat.columns.length === 0) {
                return;
            }
            isColumnBreak = this.getColumnBreak(nextBlock.bodyWidget);
            if ((!isColumnBreak || (reLayout && this.isSectionEndsWithColumnBreak(nextBlock.bodyWidget))) && this.viewer instanceof PageLayoutViewer && !this.isMultiColumnSplit && nextBlock.bodyWidget.sectionFormat.columns.length > 1) {
                // let lastbody: BodyWidget = this.getBodyWidget(nextBlock.bodyWidget, false);
                // if (((!isNullOrUndefined(lastbody.nextRenderedWidget) && lastbody.page === (lastbody.nextRenderedWidget as BodyWidget).page) && !(nextBlock.bodyWidget.firstChild === nextBlock && isNullOrUndefined(nextBlock.bodyWidget.previousWidget) && this.viewer.clientActiveArea.height > (nextBlock.firstChild as Widget).height))|| (this.documentHelper.endnoteCollection.length > 0 && lastSection === lastbody)) {
                    if (nextBlock.bodyWidget.columnIndex === 0 && nextBlock === nextBlock.bodyWidget.firstChild && !isNullOrUndefined(nextBlock.previousRenderedWidget) && nextBlock.bodyWidget.page === (nextBlock.previousRenderedWidget as BlockWidget).bodyWidget.page) {
                        nextBlock.bodyWidget.y = this.viewer.clientActiveArea.y;
                    }
                    isFirstBlock = nextBlock === nextBlock.bodyWidget.firstChild;
                    this.reLayoutMultiColumn(nextBlock.bodyWidget, isFirstBlock, nextBlock.index);
                    if (isNullOrUndefined(this.documentHelper.blockToShift)) {
                        return;
                    }
                    nextBlock = this.documentHelper.blockToShift;
                // }
            }
            let currentWidget: Widget = undefined;
            let blocks: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
            currentWidget = blocks[blocks.length - 1];
            block = nextBlock as BlockWidget;
            updateNextBlockList = false;
            let nextWidget: Widget = undefined;
            blocks = block.getSplitWidgets() as BlockWidget[];
            if (block instanceof ParagraphWidget) {
                nextWidget = blocks[0] as ParagraphWidget;
            } else {
                if (block instanceof TableWidget) {
                    nextWidget = blocks[0] as TableWidget;
                }
            }
            if (!this.documentHelper.owner.editorModule.isFootnoteElementRemoved && currentWidget.containerWidget === nextWidget.containerWidget
                && (HelperMethods.round(nextWidget.y, 2) === HelperMethods.round(this.viewer.clientActiveArea.y, 2)) &&
                isNullOrUndefined(nextWidget.nextWidget)) {
                break;
            }
            if (!isNullOrUndefined((currentWidget as ParagraphWidget).floatingElements)) {
                //this.shiftLayoutFloatingItems(currentWidget as ParagraphWidget);
            }
            updateNextBlockList = true;
            // Here, we have added this condition to skip the non-layouted blocks during relayouting.
            if (!block.isFieldCodeBlock) {
                this.reLayoutOrShiftWidgets(block, this.viewer, isMultiColumnShift, footnoteCollection);
            }
            if (this.keepWithNext) {
                block = this.documentHelper.blockToShift;
                this.keepWithNext = false;
            }
           
            if (!this.isMultiColumnSplit && isColumnBreak && block.bodyWidget.sectionFormat.numberOfColumns > 1 && block.bodyWidget.nextWidget && block.nextRenderedWidget && block.bodyWidget.index !== (block.nextRenderedWidget as BlockWidget).bodyWidget.index) {
                let clientY: number = this.viewer.clientActiveArea.y;
                let clientHeight: number = this.viewer.clientActiveArea.height;
                this.viewer.updateClientArea(block.bodyWidget.nextWidget as BodyWidget, (block.bodyWidget.nextWidget as BodyWidget).page);
                this.viewer.clientActiveArea.height = clientHeight;
                this.viewer.clientActiveArea.y = clientY;
            }
            if (this.isMultiColumnSplit && block.bodyWidget.sectionFormat.numberOfColumns > 1 && block === block.bodyWidget.lastChild && !isNullOrUndefined(block.bodyWidget.nextRenderedWidget) && block.bodyWidget.sectionIndex !== (block.bodyWidget.nextRenderedWidget as BodyWidget).sectionIndex && block.bodyWidget.page === (block.bodyWidget.nextRenderedWidget as BodyWidget).page) {
                return;
            }
            splittedWidget = block.getSplitWidgets() as BlockWidget[];
            nextBlock = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        }
        if (this.viewer.owner.editorModule) {
            this.viewer.owner.editorModule.updateListItemsTillEnd(block, updateNextBlockList);
        }
        this.documentHelper.blockToShift = undefined;
        const viewer: LayoutViewer = this.viewer;
        if(viewer.owner.editorModule.isFootnoteElementRemoved) {
            const lastPage = this.documentHelper.pages[this.documentHelper.pages.length - 1];
            const lastChild = lastPage.bodyWidgets[lastPage.bodyWidgets.length - 1];
            const endNote = lastPage.endnoteWidget;
            if (!isNullOrUndefined(endNote)) {
                const clientArea: Rect = this.viewer.clientArea.clone();
                const clientActiveArea: Rect = this.viewer.clientActiveArea.clone();
                let y = lastChild.y;
                if (lastChild.childWidgets.length > 0) {
                    let lastPageLastPara = lastChild.childWidgets[lastChild.childWidgets.length - 1] as Widget;
                    y = lastPageLastPara.y + lastPageLastPara.height;
                }
                this.viewer.clientActiveArea.height = this.viewer.clientActiveArea.bottom - y;
                this.viewer.clientActiveArea.x = this.viewer.clientArea.x;
                this.viewer.clientActiveArea.width = this.viewer.clientArea.width;
                this.viewer.clientActiveArea.y = y;
                this.layoutfootNote(endNote);
                this.viewer.clientArea = clientArea;
                this.viewer.clientActiveArea = clientActiveArea;
            }
        }
        // if (viewer instanceof PageLayoutViewer) {
        this.documentHelper.removeEmptyPages();
        this.updateFieldElements(reLayout);
        const firstPage = this.documentHelper.pages[0]
        if(firstPage.bodyWidgets[0].sectionIndex > 0) {
            let page = firstPage;
            do {
                this.documentHelper.layout.layoutHeaderFooter(page.bodyWidgets[0], this.viewer as PageLayoutViewer, page); 
                page = page.nextPage
            } while(page)
            while(firstPage.bodyWidgets[0].sectionIndex > 0) {
                this.documentHelper.owner.editorModule.updateSectionIndex(undefined, firstPage.bodyWidgets[0], false);
            }
        }
        if (!(block.bodyWidget instanceof FootNoteWidget) && !this.isRelayoutFootnote && block.bodyWidget.page.endnoteWidget) {
            this.checkAndShiftEndnote(true);
        }
        if (((!this.documentHelper.owner.enableLockAndEdit && !this.documentHelper.owner.enableHeaderAndFooter) || !reLayout) && !this.isMultiColumnSplit) {
            viewer.updateScrollBars();
        }
        // }
    }
    private isSectionEndsWithColumnBreak(section: BodyWidget): boolean {
        if (!isNullOrUndefined(section) && section.childWidgets.length > 0 && section.lastChild instanceof ParagraphWidget) {
            let paragraph: ParagraphWidget = section.lastChild as ParagraphWidget;
            return paragraph.isEndsWithColumnBreak;
        }
        return false;
    }
    /**
     * @private
     */
    public checkAndShiftEndnote(isRelayout?: boolean): void {
        if (this.documentHelper.owner.selectionModule) {
            let endBlock: BlockWidget = this.documentHelper.owner.selectionModule.end.paragraph;
            if (endBlock.isInsideTable) {
                endBlock = this.getParentTable(endBlock);
            }
            if (endBlock && !endBlock.isInHeaderFooter && !(endBlock.bodyWidget.containerWidget instanceof FootNoteWidget) && (isNullOrUndefined(endBlock.nextRenderedWidget) || isRelayout)) {
                if (!(endBlock.bodyWidget instanceof FootNoteWidget) && !this.isRelayoutFootnote
                    && endBlock.bodyWidget.page.endnoteWidget) {
                    const page: Page = endBlock.bodyWidget.page;
                    let clientActiveArea: Rect = this.viewer.clientActiveArea.clone();
                    const bodyWidget: BodyWidget = this.getBodyWidget(page.bodyWidgets[page.bodyWidgets.length - 1], true);
                    this.viewer.updateClientArea(bodyWidget, bodyWidget.page);
                    const height: number = this.getNextWidgetHeight(bodyWidget);
                    if (height > 0) {
                        this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                        this.viewer.clientActiveArea.y = height;
                    }
                    this.layoutfootNote(page.endnoteWidget);
                    this.viewer.clientActiveArea = clientActiveArea;
                }
            } else if (this.isEndnoteContentChanged && isRelayout && !this.isRelayoutFootnote) {
                this.reLayoutEndnote();
            }
        }
    }

    public updateFieldElements(reLayout?: boolean): void {
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            const fieldBegin: FieldElementBox = this.documentHelper.fields[i];
            if (this.viewer instanceof PageLayoutViewer || (this.viewer instanceof WebLayoutViewer && !(fieldBegin.line.paragraph.containerWidget instanceof TextFrame || fieldBegin.line.paragraph.bodyWidget instanceof HeaderFooterWidget))) {
                if (!isNullOrUndefined(this.documentHelper.selection)) {
                    const fieldCode: string = this.documentHelper.selection.getFieldCode(fieldBegin);
                    const regex: RegExp = /^(?!.*\bhyperlink\b).*\bpage\b.*$/;
                    if (!isNullOrUndefined(fieldCode) && (fieldCode.toLowerCase().match('numpages') || fieldCode.toLowerCase().match('sectionpages') || (regex.test(fieldCode.toLowerCase()) && reLayout)) && !isNullOrUndefined(fieldBegin.fieldSeparator)) {
                        const textElement: FieldTextElementBox = fieldBegin.fieldSeparator.nextNode as FieldTextElementBox;
                        if (!isNullOrUndefined(textElement)) {
                            const prevPageNum: string = textElement.text;
                            const paragraph: ParagraphWidget = fieldBegin.line.paragraph;
                            if (!isNullOrUndefined(paragraph.containerWidget) && (paragraph.containerWidget instanceof BodyWidget) && paragraph.containerWidget.indexInOwner === -1) {
                                continue;
                            }
                            if (!isNullOrUndefined(paragraph.bodyWidget) && !isNullOrUndefined(paragraph.bodyWidget.page) && paragraph.bodyWidget.page.index !== -1) {
                                if (regex.test(fieldCode.toLowerCase())) {
                                    let index: number = paragraph.bodyWidget.page.index + 1;
                                    textElement.text = index.toString();
                                } else {
                                    textElement.text = this.documentHelper.pages.length.toString();
                                }
                                if (prevPageNum !== textElement.text) {
                                    textElement.isWidthUpdated = false;
                                    const lineIndex: number = paragraph.childWidgets.indexOf(fieldBegin.line);
                                    const elementIndex: number = fieldBegin.line.children.indexOf(textElement);
                                    if (paragraph.isInsideTable) {
                                        this.reLayoutParagraph(paragraph, lineIndex, elementIndex);
                                    } else {
                                        this.reLayoutLine(paragraph, lineIndex, false, false, true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    private reLayoutOrShiftWidgets(blockAdv: BlockWidget, viewer: LayoutViewer, isMultiColumnShift?: boolean, footnoteCollection?: BodyWidget[]): void {
        let block: BlockWidget = blockAdv;
        let isRealyoutList: Boolean = false;
        // if (block instanceof ParagraphWidget) {
        //     reLayoutItems = viewer.renderedElements.get(block as ParagraphWidget).length === 0;
        // } else {
        //     reLayoutItems = viewer.renderedElements.get(block as TableWidget).length === 0;
        // }
        if (this.isNeedToRelayout(blockAdv.bodyWidget) || this.isPageBreakInsideContentControl(blockAdv)) {
            if (!this.isMultiColumnSplit) {
                this.updateContainerForTable(block, viewer);
            }
            //Handle layouting the block.
            if (block instanceof TableWidget) {
                block = block.combineWidget(this.viewer) as TableWidget;
                this.clearTableWidget(block as TableWidget, true, true, true);
            }
            viewer.updateClientAreaForBlock(block, true);
            if ((block as TableWidget).wrapTextAround) {
                block.isLayouted = false;
            }
            this.isRelayout = true;
            this.layoutBlock(block, 0);
            this.isRelayout = false;
            viewer.updateClientAreaForBlock(block, false);
            isRealyoutList = true;
        } else {
            //Handled to check client area and shift layouted widget.
            this.shiftWidgetsBlock(block, viewer, footnoteCollection);
        }
        let index: number = this.documentHelper.pages.indexOf(block.bodyWidget.page);
        if (index > 0 && block === block.bodyWidget.childWidgets[0] && block instanceof ParagraphWidget) {
            let val: any = ((block.bodyWidget.childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget).children;
            for (let i: number = 0; i < val.length; i++) {
                let element: ElementBox = val[i];
                if (element.margin.top > 0 && element.margin.top === this.getBeforeSpacing(element.paragraph)) {
                    element.margin.top -= this.getBeforeSpacing(element.paragraph);
                }
            }
        }
        //Updates the list value of the rendered paragraph.
        if (this.viewer.owner.editorModule && !isRealyoutList && !isMultiColumnShift) {
            this.viewer.owner.editorModule.updateRenderedListItems(block);
        }
        if (!this.isRelayoutFootnote && block.bodyWidget.page.footnoteWidget) {
            this.islayoutFootnote = true;
            this.layoutfootNote(block.bodyWidget.page.footnoteWidget);
        }
        // }
    }
    private isNeedToRelayout(bodyWidget: BlockContainer): boolean {
        for (let i: number = 0; i < bodyWidget.floatingElements.length; i++) {
            const floatElement: ShapeBase | TableWidget = bodyWidget.floatingElements[i];
            if (floatElement instanceof TableWidget || (floatElement instanceof ShapeBase &&
                (floatElement.textWrappingStyle === 'Square' || floatElement.textWrappingStyle === 'TopAndBottom'))) {
                return true;
            }
        }
        return false;
    }
    private shiftWidgetsBlock(block: BlockWidget, viewer: LayoutViewer, footnoteCollection?: BodyWidget[]): void {
        if (block instanceof ParagraphWidget) {
            this.shiftWidgetsForPara(block as ParagraphWidget, viewer, footnoteCollection);
        } else if (block instanceof TableWidget) {
            if (!isNullOrUndefined(footnoteCollection) && footnoteCollection.length > 0 && block.previousRenderedWidget && block.previousRenderedWidget.y + block.previousRenderedWidget.height + block.height > this.viewer.clientArea.bottom) {
                footnoteCollection.length = 0;
            }
            this.shiftWidgetsForTable(block as TableWidget, viewer);
        }
    }
    private shiftWidgetsForPara(paragraph: ParagraphWidget, viewer: LayoutViewer, footnoteCollection?: BodyWidget[]): void {
        if (paragraph.height > (viewer.clientArea.height + viewer.clientArea.y) && !this.documentHelper.owner.enableHeaderAndFooter) {
            return;
        }
        const bodywid: BodyWidget = paragraph.bodyWidget;
        const prevBodyObj: BodyWidgetInfo = this.getBodyWidgetOfPreviousBlock(paragraph, 0);
        let prevBodyWidget: BodyWidget = prevBodyObj.bodyWidget;
        let index: number = prevBodyObj.index;
        let prevWidget: ParagraphWidget = undefined;
        let skipFootNoteHeight: boolean = false;
        let isSkip: boolean = true;
        for (let i: number = 0; i < paragraph.getSplitWidgets().length; i++) {
            const widget: ParagraphWidget = paragraph.getSplitWidgets()[i] as ParagraphWidget;
            let firstBody: BodyWidget = this.getBodyWidget(widget.bodyWidget, true);
            if (this.isMultiColumnSplit && widget !== paragraph) {
                continue;
            }
            if (isSkip && !isNullOrUndefined(prevWidget)) {
                const isPageBreak: boolean = prevWidget.lastChild ? (prevWidget.lastChild as LineWidget).isEndsWithPageBreak : false;
                const isColumnBreak: boolean = prevWidget.lastChild ? (prevWidget.lastChild as LineWidget).isEndsWithColumnBreak : false;
                this.shiftToPreviousWidget(widget, viewer, prevWidget, isPageBreak, isColumnBreak);
                this.updateFloatingElementPosition(prevWidget);
                if ((isNullOrUndefined(widget.childWidgets) || widget.childWidgets.length === 0) && !isPageBreak && !isColumnBreak) {
                    i--;
                    continue;
                }
                if (prevBodyWidget !== widget.containerWidget) {
                    prevBodyWidget = widget.containerWidget as BodyWidget;
                    if (isPageBreak && prevWidget !== widget.previousSplitWidget) {
                        viewer.updateClientAreaByWidget(widget);
                    }
                }
                prevWidget = undefined;
            }
           
            let footWidget: BodyWidget[] = [];
            if (!skipFootNoteHeight) {
                footWidget = this.getFootNoteWidgetsOf(widget);
            }
            let footHeight: number = 0;
            let isSplit: boolean = false;
            if (!this.isMultiColumnSplit && !widget.isInsideTable && !isNullOrUndefined(footnoteCollection) && footnoteCollection.length > 0 && this.isFitInClientArea(widget, viewer, footWidget) && widget.previousRenderedWidget && widget.bodyWidget.page === (widget.previousRenderedWidget as BlockWidget).bodyWidget.page) {
                footHeight = this.getFootNoteHeight(footnoteCollection);
                let bottom: number = this.updateFootnoteHeight(widget, false, true);
                if (widget.previousRenderedWidget.y + widget.previousRenderedWidget.height + footHeight + (widget.firstChild as LineWidget).height > bottom && this.viewer.clientArea.bottom <= bottom) {
                    isSplit = true;
                }
            }
            skipFootNoteHeight = false;
            //let isContainsFootnote: boolean = false;
            if ((this.isFitInClientArea(widget, viewer, footWidget) && !isSplit) || (viewer.clientActiveArea.height < (widget.firstChild as LineWidget).height && this.viewer.clientActiveArea.y === this.viewer.clientArea.y)
                || (this.isMultiColumnSplit && widget.bodyWidget.sectionFormat.numberOfColumns - 1 !== widget.bodyWidget.columnIndex)) {
                if (!isNullOrUndefined(footnoteCollection) && !isNullOrUndefined(footWidget) && footWidget.length > 0) {
                    for (let k: number = 0; k < footWidget.length; k++) {
                        footnoteCollection.push(footWidget[k])
                    }
                }
                if (this.keepWithNext) {
                    this.updateClientPositionForBlock(widget.containerWidget.firstChild as BlockWidget, widget);
                    this.keepWithNext = false;
                }
                //Check whether this widget is moved to previous container widget.
                prevWidget = widget;
                viewer.updateClientAreaForBlock(widget, true, undefined, false, true);
                if (widget.isEmpty() && !isNullOrUndefined(widget.paragraphFormat) &&
                    (widget.paragraphFormat.textAlignment === 'Center' || widget.paragraphFormat.textAlignment === 'Right'
                        || (widget.paragraphFormat.textAlignment === 'Justify' && widget.paragraphFormat.bidi))
                    && widget.paragraphFormat.listFormat.listId === -1) {
                    this.updateXPositionForEmptyParagraph(viewer.clientActiveArea, widget);
                } else {
                    widget.x = viewer.clientActiveArea.x;
                }
                viewer.updateClientAreaForBlock(widget, false);
                widget.y = viewer.clientActiveArea.y;
                this.updateFloatingElementPosition(widget);
                viewer.cutFromTop(viewer.clientActiveArea.y + widget.height);
                //Moves the paragraph widget to previous body widget.
                if (!isNullOrUndefined(prevBodyWidget) && prevBodyWidget !== widget.containerWidget && !this.isMultiColumnSplit) {
                    index++;
                    if (!(prevBodyWidget.lastChild as ParagraphWidget).isEndsWithPageBreak && !(prevBodyWidget.lastChild as ParagraphWidget).isEndsWithColumnBreak && !this.isPageBreakInsideContentControl(prevBodyWidget.lastChild as ParagraphWidget)) {
                        this.updateContainerWidget(widget, prevBodyWidget, index, true, footWidget);
                    }
                    if (footWidget.length > 0) {
                        if (prevBodyWidget.page.footnoteWidget) {
                            for (let k: number = 0; k < footWidget.length; k++) {
                                if (prevBodyWidget.page.footnoteWidget.bodyWidgets.indexOf(footWidget[k]) === -1 && widget.bodyWidget.page.index != footWidget[k].page.index) {
                                    prevBodyWidget.page.footnoteWidget.bodyWidgets.push(footWidget[k]);
                                    prevBodyWidget.page.footnoteWidget.height += footWidget[k].height;
                                }
                            }
                        }
                    }
                } else if (widget.containerWidget instanceof BodyWidget && widget.containerWidget.firstChild === widget && widget.previousRenderedWidget && widget.previousRenderedWidget instanceof ParagraphWidget && (widget.previousRenderedWidget.containerWidget as BodyWidget).sectionFormat.breakCode == 'NoBreak' && widget.containerWidget.page.index !== (widget.previousRenderedWidget.containerWidget as BodyWidget).page.index && widget.containerWidget.index !== widget.previousRenderedWidget.containerWidget.index) {
                    let bodyWidget: BodyWidget = widget.previousRenderedWidget.bodyWidget as BodyWidget;
                    let breakCode: string = bodyWidget.sectionFormat.breakCode;
                    if (bodyWidget.sectionFormat.columns.length > 1) {
                        bodyWidget = this.getBodyWidget(bodyWidget, true);
                    }
                    if (!isNullOrUndefined(bodyWidget.previousRenderedWidget) && bodyWidget.sectionFormat.breakCode === 'NoBreak' 
                        && (bodyWidget.previousRenderedWidget as BodyWidget).sectionFormat.breakCode == 'NewPage' 
                        && bodyWidget.page.index === (bodyWidget.previousRenderedWidget as BodyWidget).page.index) {
                        breakCode = (bodyWidget.previousRenderedWidget as BodyWidget).sectionFormat.breakCode;
                    }
                    let bottom: number = HelperMethods.round((this.getNextWidgetHeight(bodyWidget) + widget.height), 2);
                    // Bug 858530: Shift the widgets to previous container widget if the client height is not enough to place this widget.
                    if (!(widget.previousRenderedWidget.containerWidget.lastChild as ParagraphWidget).isEndsWithPageBreak && !(widget.previousRenderedWidget.containerWidget.lastChild as ParagraphWidget).isEndsWithColumnBreak 
                        && bottom <= HelperMethods.round(this.viewer.clientActiveArea.bottom, 2) && breakCode === 'NoBreak') {
                        let page: Page = (widget.previousRenderedWidget as ParagraphWidget).bodyWidget.page;
                        let nextPage: Page = widget.containerWidget.page;
                        for (let j: number = 0; j < nextPage.bodyWidgets.length; j++) {
                            let nextBodyWidget: BodyWidget = nextPage.bodyWidgets[j];
                            nextPage.bodyWidgets.splice(nextPage.bodyWidgets.indexOf(nextBodyWidget), 1);
                            page.bodyWidgets.splice(page.bodyWidgets.length, 0, nextBodyWidget);
                            nextBodyWidget.page = page;
                            j--;
                        }
                        widget.containerWidget.y = this.viewer.clientActiveArea.y;
                        this.documentHelper.removeEmptyPages();
                    }
                }
                if (!this.isInitialLoad && isSkip && widget.bodyWidget.sectionFormat.columns.length > 1 && widget === widget.bodyWidget.firstChild && (!isNullOrUndefined(firstBody.previousWidget)
                    && firstBody.page === (firstBody.previousWidget as BodyWidget).page)) {
                    this.viewer.updateClientArea(widget.bodyWidget, widget.bodyWidget.page);
                    firstBody = this.getBodyWidget(firstBody.previousWidget as BodyWidget, true);
                    let height: number = this.getNextWidgetHeight(firstBody);
                    widget.bodyWidget.y = height;
                    this.viewer.clientActiveArea.height -= height - this.viewer.clientActiveArea.y;
                    this.viewer.clientActiveArea.y = height;
                    isSkip = false;
                    i--;
                }
                if (((widget.isEndsWithPageBreak && !this.isPageBreakInsideField(widget)) || widget.isEndsWithColumnBreak || this.isPageBreakInsideContentControl(widget)) && this.viewer instanceof PageLayoutViewer) {
                    let nextBodyWidget: BodyWidget = this.createOrGetNextBodyWidget(prevBodyWidget, this.viewer);
                    nextBodyWidget = this.moveBlocksToNextPage(widget, true);
                    viewer.updateClientArea(nextBodyWidget, nextBodyWidget.page);
                }
            } else {
                if (!isNullOrUndefined(footnoteCollection)) {
                    footnoteCollection.length = 0;
                }
                const previousBlock: BlockWidget = widget.previousRenderedWidget as BlockWidget;
                let isPageBreak: boolean = false;
                let isColumnBreak: boolean = false;
                if (previousBlock instanceof ParagraphWidget && previousBlock.isEndsWithPageBreak &&
                    this.viewer instanceof PageLayoutViewer) {
                    isPageBreak = true;
                }
                if (previousBlock instanceof ParagraphWidget && previousBlock.isEndsWithColumnBreak &&
                    this.viewer instanceof PageLayoutViewer) {
                    isColumnBreak = true;
                }
                const isSplittedToNewPage: boolean = this.splitWidget(widget, viewer, prevBodyWidget, index + 1, isPageBreak, footWidget, isColumnBreak, isSplit ? footHeight : 0);
                this.updateFloatingElementPosition(widget);
                prevWidget = undefined;
                if (prevBodyWidget !== widget.containerWidget) {
                    prevBodyWidget = widget.containerWidget as BodyWidget;
                    i--;
                    //Paragraph moved to next page and client area get updated with footnote widget height.
                    //So, skip considering footnote height.
                    if (footWidget.length > 0) {
                        skipFootNoteHeight = true;
                    }
                }
                index = prevBodyWidget.childWidgets.indexOf(widget);
                if (isSplittedToNewPage) {
                    prevBodyWidget = (paragraph.getSplitWidgets()[i + 1] as ParagraphWidget).containerWidget as BodyWidget;
                }
            }
        }
        this.skipUpdateContainerWidget = false;
    }

    private updateFloatingElementPosition(widget: ParagraphWidget): void {
        if (widget.floatingElements.length > 0) {
            for (let k: number = 0; k < widget.floatingElements.length; k++) {
                let shape: ShapeBase = widget.floatingElements[k];
                let topMargin: number = 0;
                if (shape instanceof ShapeElementBox && shape.textWrappingStyle === 'Inline') {
                    let lineIndex: number = shape.line.indexInOwner;
                    let lineHeight: number = 0;
                    topMargin = HelperMethods.convertPointToPixel(shape.textFrame.marginTop as number);
                    for (let k: number = 0; k < lineIndex; k++) {
                        if (!isNullOrUndefined(widget.childWidgets[k])) {
                            lineHeight += (widget.childWidgets[k] as LineWidget).height as number;
                        }
                    }
                    shape.y = widget.y + lineHeight;
                }
                else {
                    let position: Point = this.getFloatingItemPoints(shape);
                    shape.y = position.y;
                    shape.x = position.x;
                }
                if (shape instanceof ShapeElementBox) {
                    this.updateChildLocationForCellOrShape(shape.y + topMargin, shape as ShapeElementBox, undefined, false, true);
                }
            }
        }
    }

    private isPageBreakInsideField(widget: ParagraphWidget): boolean {
        let isPageBreakInsideField: boolean = false;
        let isFieldElement: boolean = false;
        let height: number = 0;
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            let line: LineWidget = widget.childWidgets[i] as LineWidget;
            height += line.height;
            for (let j: number = 0; j < line.children.length; j++) {
                let element: ElementBox = line.children[j] as ElementBox;
                if (element instanceof FieldElementBox) {
                    if (element.fieldType === 0) {
                        isFieldElement = true;
                    } else if (element.fieldType === 2 || element.fieldType === 1) {
                        isFieldElement = false;
                    }
                }
                if (!isFieldElement && (element as TextElementBox).text === '\f') {
                    isPageBreakInsideField = false;
                } else {
                    isPageBreakInsideField = true;
                }
            }
        }
        if (isPageBreakInsideField && widget.height === 0) {
            this.viewer.cutFromTop(this.viewer.clientActiveArea.y + height);
        }
        return isPageBreakInsideField;
    }

    private isPageBreakInsideContentControl(widget: BlockWidget): boolean {
        let isPageBreakBlockContentControl: boolean = false;
        if (widget instanceof ParagraphWidget && widget.childWidgets.length > 0) {
            let lastLine: LineWidget = widget.childWidgets[widget.childWidgets.length - 1] as LineWidget;
            if (lastLine.children.length > 0) {
                let lastElement: ElementBox = lastLine.children[lastLine.children.length - 1] as ElementBox;
                if (lastElement instanceof ContentControl && lastElement.contentControlWidgetType === 'Block' &&
                    !isNullOrUndefined(lastElement.previousElement) && lastElement.previousElement instanceof TextElementBox
                    && (lastElement.previousElement as TextElementBox).text === '\f') {
                    isPageBreakBlockContentControl = true;
                }
            }
        }
        return isPageBreakBlockContentControl;
    }
    
    /**
     * @private
     * Get the footnote of the block widget.
     *
     * @param {BlockWidget} widget BlockWidget instance.
     * @returns
     */
    public getFootNotesOfBlock(widget: BlockWidget, footnoteElements?: FootnoteElementBox[]): FootnoteElementBox[] {
        if (isNullOrUndefined(footnoteElements)) {
            footnoteElements = [];
        }
        if (widget.childWidgets.length > 0) {
            for (let j: number = 0; j < this.documentHelper.footnoteCollection.length; j++) {
                if (this.documentHelper.footnoteCollection[j].line.paragraph === widget) {
                    //isContainsFootnote = true;
                    footnoteElements.push(this.documentHelper.footnoteCollection[j]);
                }
            }
        }
        return footnoteElements;
    }
    private getFootNotesWidgetsInLine(line: LineWidget): BodyWidget[] {
        const footnoteElements: FootnoteElementBox[] = [];
        for (let i: number = 0; i < line.children.length; i++) {
            const element: ElementBox = line.children[i];
            if (element instanceof FootnoteElementBox) {
                footnoteElements.push(element);
            }
        }
        return this.getFootNoteWidgetsBy(line.paragraph, footnoteElements);
    }
    private getFootNoteWidgetsBy(widget: BlockWidget, footnoteElements: FootnoteElementBox[]): BodyWidget[] {
        const footWidgets: BodyWidget[] = [];
        if (widget.bodyWidget.page.footnoteWidget) {
            for (let i: number = 0; i < widget.bodyWidget.page.footnoteWidget.bodyWidgets.length; i++) {
                /* eslint-disable-next-line max-len */
                for (let j: number = 0; j < footnoteElements.length; j++) {
                    if ((widget.bodyWidget.page.footnoteWidget.bodyWidgets[i]).footNoteReference === footnoteElements[j]) {
                        footWidgets.push(widget.bodyWidget.page.footnoteWidget.bodyWidgets[i] as BodyWidget);
                    }
                }
            }
        }
        if (footWidgets.length === 0 && (!isNullOrUndefined(widget.previousRenderedWidget) && (widget.previousRenderedWidget as ParagraphWidget).bodyWidget.page.footnoteWidget)) {
            for (let i: number = 0; i < (widget.previousRenderedWidget as ParagraphWidget).bodyWidget.page.footnoteWidget.bodyWidgets.length; i++) {
                /* eslint-disable-next-line */
                for (let j: number = 0; j < footnoteElements.length; j++) {
                    if (((widget.previousRenderedWidget as ParagraphWidget).bodyWidget.page.footnoteWidget.bodyWidgets[i]).footNoteReference === footnoteElements[j]) {
                        footWidgets.push((widget.previousRenderedWidget as ParagraphWidget).bodyWidget.page.footnoteWidget.bodyWidgets[i] as BodyWidget);
                    }
                }
            }
        } else if (!isNullOrUndefined(widget.bodyWidget.previousRenderedWidget) && (widget.bodyWidget.previousRenderedWidget as BodyWidget).page.footnoteWidget) {
            for (let i: number = 0; i < (widget.bodyWidget.previousRenderedWidget as BodyWidget).page.footnoteWidget.bodyWidgets.length; i++) {
                /* eslint-disable-next-line max-len */
                for (let j: number = 0; j < footnoteElements.length; j++) {
                    if (((widget.bodyWidget.previousRenderedWidget as BodyWidget).page.footnoteWidget.bodyWidgets[i]).footNoteReference === footnoteElements[j]) {
                        footWidgets.push((widget.bodyWidget.previousRenderedWidget as BodyWidget).page.footnoteWidget.bodyWidgets[i] as BodyWidget);
                    }
                }
            }
        } else if (!isNullOrUndefined(widget.bodyWidget.nextRenderedWidget) && (widget.bodyWidget.nextRenderedWidget as BodyWidget).page.footnoteWidget) {
            for (let i: number = 0; i < (widget.bodyWidget.nextRenderedWidget as BodyWidget).page.footnoteWidget.bodyWidgets.length; i++) {
                /* eslint-disable-next-line max-len */
                for (let j: number = 0; j < footnoteElements.length; j++) {
                    if (((widget.bodyWidget.nextRenderedWidget as BodyWidget).page.footnoteWidget.bodyWidgets[i]).footNoteReference === footnoteElements[j]) {
                        footWidgets.push((widget.bodyWidget.nextRenderedWidget as BodyWidget).page.footnoteWidget.bodyWidgets[i] as BodyWidget);
                    }
                }
            }
        }
        return footWidgets;
    }
    /**
     * @param widget
     * @private
     */
    public getFootNoteWidgetsOf(widget: BlockWidget, isShifting?: boolean): BodyWidget[] {
        let footnoteWidgets: BodyWidget[] = [];
        let footnoteElements: FootnoteElementBox[] = [];
        if (widget instanceof TableWidget) {
            for (let k: number = 0; k < widget.childWidgets.length; k++) {
                let row: TableRowWidget = widget.childWidgets[k] as TableRowWidget;
                for (let i: number = 0; i < row.childWidgets.length; i++) {
                    let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                    for (let x: number = 0; x < cell.childWidgets.length; x++) {
                        let block: BlockWidget = cell.childWidgets[x] as BlockWidget;
                        if (block instanceof TableWidget) {
                            let footWidgets: BodyWidget[] = this.getFootNoteWidgetsOf(block, isShifting);
                            for (let f: number = 0; f < footWidgets.length; f++) {
                                if (footnoteWidgets.indexOf(footWidgets[f]) === -1) {
                                    footnoteWidgets.push(footWidgets[f]);
                                }
                            }
                        } else {
                            footnoteElements = this.getFootNotesOfBlock(block, footnoteElements);
                        }
                        let blockfootnoteWidgets: BodyWidget[] = this.getFootNoteWidgetsBy(block, footnoteElements);
                        if (isShifting && blockfootnoteWidgets.length === 0) {
                            for (var l = 0; l < footnoteElements.length; l++) {
                                if (footnoteWidgets.indexOf(footnoteElements[l].bodyWidget) === -1) {
                                    footnoteWidgets.push(footnoteElements[l].bodyWidget);
                                }
                            }
                        } else {
                            for (let f: number = 0; f < blockfootnoteWidgets.length; f++) {
                                if (footnoteWidgets.indexOf(blockfootnoteWidgets[f]) === -1) {
                                    footnoteWidgets.push(blockfootnoteWidgets[f]);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            footnoteElements = this.getFootNotesOfBlock(widget);
            if (footnoteElements.length > 0) {
                footnoteWidgets = this.getFootNoteWidgetsBy(widget, footnoteElements);
            }
            if (isShifting && footnoteWidgets.length === 0) {
                for (var k = 0; k < footnoteElements.length; k++) {
                    footnoteWidgets.push(footnoteElements[k].bodyWidget);
                }
            }
        }
        return footnoteWidgets;
    }
    public getFootNodeWidgetsToShiftToPage(paragraph: ParagraphWidget): FootNoteWidgetsInfo {
        const splittedWidgets: Widget[] = paragraph.getSplitWidgets();
        const footNoteWidgets: BodyWidget[] = [];
        const toBodyWidget: BodyWidget = paragraph.containerWidget as BodyWidget;
        let fromBodyWidget: BodyWidget;
        for (let i: number = 0; i < splittedWidgets.length; i++) {
            const footWidgets: BodyWidget[] = this.getFootNoteWidgetsOf(splittedWidgets[i] as BlockWidget);
            for (let j: number = 0; j < footWidgets.length; j++) {
                fromBodyWidget = footWidgets[j].containerWidget as BodyWidget;
                if (toBodyWidget !== fromBodyWidget) {
                    footNoteWidgets.push(footWidgets[j]);
                }
            }
        }
        return { 'footNoteWidgets': footNoteWidgets, 'fromBodyWidget': fromBodyWidget, 'toBodyWidget': toBodyWidget };
    }
    public shiftTableWidget(table: TableWidget, viewer: LayoutViewer, isClearHeight: boolean = false): TableWidget {
        table.isBidiTable = table.bidi;
        if (this.documentHelper.compatibilityMode !== 'Word2013'
            && !table.isInsideTable
            && !isNullOrUndefined(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin)) {
            this.viewer.clientActiveArea.x = this.viewer.clientActiveArea.x - HelperMethods.convertPointToPixel(
                ((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
        }
        const tables: TableWidget[] = [table];
        this.addTableWidget(this.viewer.clientActiveArea, tables);
        this.viewer.updateClientAreaTopOrLeft(table, true);
        let clientActiveAreaForTableWrap: Rect;
        let clientAreaForTableWrap: Rect;
        let wrapDiff: number = 0;
        if (table.wrapTextAround) {
            clientActiveAreaForTableWrap = this.viewer.clientActiveArea.clone();
            clientAreaForTableWrap = this.viewer.clientArea.clone();
            this.updateClientAreaForWrapTable(tables, table, true, clientActiveAreaForTableWrap, clientAreaForTableWrap);
        } else if (!(table.containerWidget instanceof TextFrame)) {
            this.adjustClientAreaBasedOnTextWrapForTable(table, this.viewer.clientActiveArea);
            if (this.isWrapText) {
                wrapDiff = this.viewer.clientActiveArea.x - this.viewer.clientArea.x;
                this.isWrapText = false;
                table.x = this.viewer.clientActiveArea.x;
            }
        }
        if (table.childWidgets.length > 0) {
            const isHeader: boolean = (table.childWidgets[0] as TableRowWidget).rowFormat.isHeader;
            table.header = isHeader;
            table.continueHeader = isHeader;
            table.headerHeight = 0;
        }
        let row: TableRowWidget = table.childWidgets[0] as TableRowWidget;
        this.updateFootnoteHeight(table, true);
        if (this.documentHelper.viewer instanceof PageLayoutViewer && table.wrapTextAround && (table.positioning.verticalAlignment === 'Bottom' || table.positioning.verticalAlignment === 'Center' || table.positioning.verticalAlignment === 'Outside')) {
            this.updateTableFloatPoints(table);
            this.updateChildLocationForTable(table.y, table);
        }
        while (row) {
            row = this.shiftRowWidget(tables, row, isClearHeight);
            row = row.nextRow as TableRowWidget;
        }
        this.updateFootnoteHeight(table, false);
        this.updateWidgetsToPage(tables, [], table, true);
        if (wrapDiff > 0) {
            this.viewer.clientArea.x = this.viewer.clientArea.x - wrapDiff;
        }
        if (table.wrapTextAround) {
            this.updateClientAreaForWrapTable(tables, table, false, clientActiveAreaForTableWrap, clientAreaForTableWrap);
        }
        if (this.documentHelper.compatibilityMode !== 'Word2013'
            && !table.isInsideTable
            && !table.wrapTextAround
            && !isNullOrUndefined(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin)) {
            this.viewer.clientArea.x = this.viewer.clientArea.x + HelperMethods.convertPointToPixel(
                ((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
        }
        return tables[tables.length - 1];
    }

    public shiftRowWidget(tables: TableWidget[], row: TableRowWidget, isClearHeight: boolean = false): TableRowWidget {
        const viewer: LayoutViewer = this.viewer;
        if (isClearHeight) {
            row.height = 0;
        }
        let isNestedTable = row.ownerTable.isInsideTable;
        if (!isNestedTable) {
            this.updateExistingFootnoteHeight(row);
        }
        const rows: TableRowWidget[] = [row];
        this.addTableRowWidget(viewer.clientActiveArea, rows) as TableRowWidget;
        viewer.updateClientAreaForRow(row, true);
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            if (isClearHeight) {
                cell.height = 0;
            }
            /* eslint-disable-next-line max-len */
            this.shiftCellWidget(cell, this.getMaxTopCellMargin(row) + row.topBorderWidth, this.getMaxBottomCellMargin(row) + row.bottomBorderWidth, isClearHeight);
        }
        viewer.updateClientAreaForRow(row, false);
        if (!isNestedTable) {
            let footheight: number = this.footnoteHeight;
            this.updateFootnoteToBody(row, this.layoutedFootnoteElement);
            this.footnoteHeight = footheight;
        }
        this.updateWidgetsToTable(tables, rows, row, false);
        if (!isNestedTable) {
            this.layoutedFootnoteElement = [];
        }
        return rows[rows.length - 1];
    }

    private updateFootnoteToBody(row: TableRowWidget, footnoteElements: FootnoteElementBox[]): void {
        this.layoutFootnoteInSplittedRow(row, this.getFootnoteBody(footnoteElements));
        if (isNullOrUndefined(row.ownerTable.footnoteElement)) {
            row.ownerTable.footnoteElement = [];
        }
        for (let i: number = 0; i < footnoteElements.length; i++) {
            row.ownerTable.footnoteElement.push(footnoteElements[i]);
        }
    }
    private getFootnoteBody(footnoteElements: FootnoteElementBox[]): BodyWidget[] {
        let footnoteWidgets: BodyWidget[] = [];
        for (let i: number = 0; i < footnoteElements.length; i++) {
            footnoteWidgets.push(footnoteElements[i].bodyWidget);
        }
        return footnoteWidgets;
    }

    public shiftCellWidget(cell: TableCellWidget, maxCellMarginTop: number, maxCellMarginBottom: number, isClearHeight: boolean): void {
        if (isNullOrUndefined(isClearHeight)) {
            isClearHeight = false;
        }
        const viewer: LayoutViewer = this.viewer;
        this.addTableCellWidget(cell, viewer.clientActiveArea, maxCellMarginTop, maxCellMarginBottom) as TableCellWidget;
        let clientHeight: number = this.viewer.clientActiveArea.height;
        viewer.updateClientAreaForCell(cell, true);
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            const block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            const skipCellContentHeightCalc: boolean = i !== cell.childWidgets.length - 1;
            viewer.updateClientAreaForBlock(block, true);
            if (block instanceof ParagraphWidget) {
                this.shiftParagraphWidget(block, skipCellContentHeightCalc);
            } else {
                this.shiftTableWidget(block as TableWidget, viewer, isClearHeight);
            }
            viewer.updateClientAreaForBlock(block, false);
        }
        this.updateWidgetToRow(cell);
        viewer.updateClientAreaForCell(cell, false);
        if(!cell.ownerTable.isInsideTable) {
            this.viewer.clientActiveArea.height = clientHeight;
        }
    }

    public shiftParagraphWidget(paragraph: ParagraphWidget, skipCellContentHeightCalc?: boolean): void {
        this.addParagraphWidget(this.viewer.clientActiveArea, paragraph);
        if (paragraph.floatingElements.length > 0) {
            for (let k: number = 0; k < paragraph.floatingElements.length; k++) {
                let shape: ShapeBase = paragraph.floatingElements[k];
                let topMargin: number = 0;
                if (shape instanceof ShapeElementBox && shape.textWrappingStyle === 'Inline') {
                    let lineIndex: number = shape.line.indexInOwner;
                    let lineHeight: number = 0;
                    topMargin = HelperMethods.convertPointToPixel(shape.textFrame.marginTop as number);
                    for (let k: number = 0; k < lineIndex; k++) {
                        lineHeight += (paragraph.childWidgets[k] as LineWidget).height as number;
                    }
                    shape.y = paragraph.y + lineHeight;
                } else {
                    let position: Point = this.getFloatingItemPoints(shape);
                    shape.y = position.y;
                    shape.x = position.x;
                }
                if (shape instanceof ShapeElementBox) {
                    this.updateChildLocationForCellOrShape(shape.y + topMargin, shape as ShapeElementBox);
                }
            }
        }
        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + paragraph.height);
        let footnoteCollection: BodyWidget[] = this.getFootNoteWidgetsOf(paragraph as BlockWidget, true);
        for (let i: number = 0; i < footnoteCollection.length; i++) {
            this.layoutedFootnoteElement.push(footnoteCollection[i].footNoteReference);
        }
        this.footnoteHeight += this.getFootNoteHeight(footnoteCollection);
        this.updateWidgetToPage(this.viewer, paragraph, skipCellContentHeightCalc);
    }

    private updateContainerForTable(block: BlockWidget, viewer: LayoutViewer): void {
        const prevObj: BodyWidgetInfo = this.getBodyWidgetOfPreviousBlock(block, 0);
        const prevBodyWidget: BodyWidget = prevObj.bodyWidget;
        const index: number = prevObj.index;
        const isPageBreak: boolean = !isNullOrUndefined(prevBodyWidget.lastChild) && !isNullOrUndefined(((prevBodyWidget.lastChild as BlockWidget).lastChild as LineWidget)) ?
            ((prevBodyWidget.lastChild as BlockWidget).lastChild as LineWidget).isEndsWithPageBreak: false;
        const isColumnBreak: boolean = !isNullOrUndefined(prevBodyWidget.lastChild) && !isNullOrUndefined(((prevBodyWidget.lastChild as BlockWidget).lastChild as LineWidget)) ?
            ((prevBodyWidget.lastChild as BlockWidget).lastChild as LineWidget).isEndsWithColumnBreak: false;
        if (prevBodyWidget !== block.containerWidget) {
            if (!isPageBreak && !isColumnBreak) {
                this.updateContainerWidget(block, prevBodyWidget as BodyWidget, index + 1, true);
            } else {
                viewer.updateClientArea(block.bodyWidget, block.bodyWidget.page);
            }
        }
        if (block.isInHeaderFooter || this.viewer instanceof WebLayoutViewer) {
            block.containerWidget.height -= block.height;
        }
    }

    private shiftWidgetsForTable(table: TableWidget, viewer: LayoutViewer): void {
        this.updateContainerForTable(table, viewer);
        this.viewer.updateClientAreaForBlock(table, true, undefined, false, true);
        this.updateVerticalPositionToTop(table, true);
        //const isPageLayout: boolean = viewer instanceof PageLayoutViewer;
        const combinedTable: TableWidget = table.combineWidget(this.viewer) as TableWidget;
        this.documentHelper.layout.updateChildLocationForTable(combinedTable.y, combinedTable);
        this.clearTableWidget(combinedTable, true, false, false, true);
        this.shiftTableWidget(combinedTable, this.viewer);
        this.updateVerticalPositionToTop(table, false);
        this.viewer.updateClientAreaForBlock(table, false);
    }
    private updateVerticalPositionToTop(table: TableWidget, isUpdateTop: boolean): void {
        //Iterate the tableWidgets counts
        for (let i: number = 0; i < table.getSplitWidgets().length; i++) {
            const tablewidget: TableWidget = table.getSplitWidgets()[i] as TableWidget;
            //Iterate the tableWidget child items
            for (let j: number = 0; j < tablewidget.childWidgets.length; j++) {
                const rowWidget: TableRowWidget = tablewidget.childWidgets[j] as TableRowWidget;
                //Iterate the RowWidgets child items
                for (let k: number = 0; k < rowWidget.childWidgets.length; k++) {
                    const cellWidget: TableCellWidget = rowWidget.childWidgets[k] as TableCellWidget;
                    //Iterate the RowWidgets child items
                    this.documentHelper.layout.updateCellVerticalPosition(cellWidget, isUpdateTop, false);
                }
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private splitWidget(paragraphWidget: ParagraphWidget, viewer: LayoutViewer, previousBodyWidget: BodyWidget, index: number, isPageBreak: boolean, footWidget?: BodyWidget[], isColumnBreak?: boolean, footHeight?: number): boolean {
        const firstLine: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
        const keepLinesTogether: boolean = (paragraphWidget.paragraphFormat.keepLinesTogether && (this.viewer.clientActiveArea.y !== this.viewer.clientArea.y));
        let maxElementHeight: number = keepLinesTogether ? paragraphWidget.height : this.getMaxElementHeight(firstLine);
        const paragraphView: ParagraphWidget[] = paragraphWidget.getSplitWidgets() as ParagraphWidget[];
        let nextBodyWidget: BodyWidget = paragraphWidget.containerWidget as BodyWidget;
        // Get maximun height based on widow/orphan control.
        maxElementHeight = this.getMaximumLineHeightToSplit(paragraphWidget, maxElementHeight, viewer);
        // TODO: Footnote move on move entire paragraph.
        const footNoteInFirstLine: BodyWidget[] = this.getFootNotesWidgetsInLine(firstLine);
        if (isNullOrUndefined(paragraphWidget.previousWidget) && footNoteInFirstLine.length > 0) {
            for (let i: number = 0; i < footNoteInFirstLine.length; i++) {
                for (let j: number = 0; j < footNoteInFirstLine[i].childWidgets.length; j++) {
                maxElementHeight += (footNoteInFirstLine[i].childWidgets[j] as BlockWidget).height;
                }
            }
            //maxElementHeight += (paragraphWidget.bodyWidget.page.footnoteWidget.childWidgets[0] as ParagraphWidget).height;
        }
        let height: number = 0;
        if (!isNullOrUndefined(footHeight) && footHeight > 0) {
            height = footHeight;
        }
        if (viewer.clientActiveArea.height >= maxElementHeight + height && !isPageBreak && !isColumnBreak) {
            let splittedWidget: ParagraphWidget = undefined;
            const widgetIndex: number = paragraphView.indexOf(paragraphWidget);
            if (widgetIndex < (paragraphView.length - 1)) {
                splittedWidget = paragraphView[widgetIndex + 1] as ParagraphWidget;
                nextBodyWidget = splittedWidget.containerWidget as BodyWidget;
            } else {
                splittedWidget = new ParagraphWidget();
                splittedWidget.index = paragraphWidget.index;
                splittedWidget.characterFormat = paragraphWidget.characterFormat;
                splittedWidget.paragraphFormat = paragraphWidget.paragraphFormat;
                splittedWidget.width = paragraphWidget.width;
                splittedWidget.x = paragraphWidget.x;
                splittedWidget.y = paragraphWidget.y;
                paragraphView.push(splittedWidget);
            }
            if (previousBodyWidget !== paragraphWidget.containerWidget && !this.skipUpdateContainerWidget) {
                this.updateContainerWidget(paragraphWidget, previousBodyWidget, index, true);
            }
            for (let i: number = paragraphWidget.childWidgets.length - 1; i > 0; i--) {
                const line: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
                if (this.isFitInClientArea(paragraphWidget, viewer, undefined)) {
                    if (splittedWidget.childWidgets.length === 1) {
                        this.updateParagraphWidgetInternal(line, splittedWidget, 0);
                        this.skipUpdateContainerWidget = true;
                    }
                    break;
                } else {
                    const line: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
                    //Moves the line widget to next widget.
                    this.updateParagraphWidgetInternal(line, splittedWidget, 0);
                }
            }
            if (isNullOrUndefined(splittedWidget.containerWidget) && splittedWidget.childWidgets.length > 0) {
                const y: number = viewer.clientActiveArea.y;
                // eslint-disable-next-line max-len
                const clientArea: Rect = new Rect(viewer.clientArea.x, viewer.clientArea.y, viewer.clientArea.width, viewer.clientArea.height);
                // eslint-disable-next-line max-len
                const activeArea: Rect = new Rect(viewer.clientActiveArea.x, viewer.clientActiveArea.y, viewer.clientActiveArea.width, viewer.clientActiveArea.height);
                let prevPage: Page = paragraphWidget.bodyWidget.page;
                //Checks whether next node exists, else adds new page.
                nextBodyWidget = this.moveBlocksToNextPage(paragraphWidget,false,-1);
                splittedWidget.containerWidget = nextBodyWidget;
                nextBodyWidget.childWidgets.splice(0, 0, splittedWidget);
                if (prevPage !== nextBodyWidget.page) {
                    nextBodyWidget.height += splittedWidget.height;
                    if (nextBodyWidget != previousBodyWidget) {
                        this.moveFootNotesToPage(footWidget, previousBodyWidget, nextBodyWidget);
                    }
                    if (nextBodyWidget.childWidgets.length === 1 && nextBodyWidget.firstChild instanceof ParagraphWidget &&
                        nextBodyWidget.firstChild.equals(paragraphWidget)) {
                        //paragraphWidget.x = paragraphWidget.x;
                        paragraphWidget.y = y;
                        return true;
                    } else {
                        //Resetting Client area
                        viewer.clientArea = clientArea;
                        viewer.clientActiveArea = activeArea;
                    }
                }
                else {
                    if (paragraphWidget.x !== paragraphWidget.containerWidget.x) {
                        paragraphWidget.x = paragraphWidget.containerWidget.x;
                    }
                    paragraphWidget.y = y;
                    viewer.updateClientArea(nextBodyWidget, nextBodyWidget.page);
                    splittedWidget = this.addParagraphWidget(this.viewer.clientActiveArea, splittedWidget);
                    return true;
                }
            }
        } else {
            let startBlock: BlockWidget;
            let keepWithNext: boolean = false;
            let startIndex: number = 0;
            viewer.columnLayoutArea.setColumns(previousBodyWidget.sectionFormat);
            nextBodyWidget = this.createOrGetNextBodyWidget(previousBodyWidget, this.viewer);
            let blockInfo: BlockInfo = this.alignBlockElement(paragraphWidget);
            if (!this.isInitialLoad && !isNullOrUndefined(blockInfo.node) && !paragraphWidget.isEndsWithPageBreak && !paragraphWidget.isEndsWithColumnBreak && isNullOrUndefined(paragraphWidget.previousSplitWidget)) {
                startBlock = blockInfo.node instanceof TableRowWidget ? this.splitRow(blockInfo.node) : blockInfo.node as BlockWidget;
                if (startBlock.containerWidget instanceof BodyWidget && startBlock.containerWidget.firstChild !== startBlock) {
                    startIndex = startBlock instanceof TableWidget ? 0 : parseInt(blockInfo.position.index, 10);
                    paragraphWidget = startBlock as ParagraphWidget;
                    keepWithNext = true;
                    if (!isNullOrUndefined(paragraphWidget.nextRenderedWidget) && paragraphWidget.nextRenderedWidget instanceof ParagraphWidget) {
                        this.keepWithNext = true;
                        this.documentHelper.blockToShift = paragraphWidget.nextRenderedWidget;
                    }
                }
            }
            if (paragraphWidget.containerWidget !== nextBodyWidget || keepWithNext) {
                let prevPage: Page = paragraphWidget.bodyWidget.page;
                nextBodyWidget = this.moveBlocksToNextPage(paragraphWidget, true);
                if (previousBodyWidget !== nextBodyWidget) {
                    viewer.updateClientArea(nextBodyWidget, nextBodyWidget.page);
                    if (startIndex > 0 && this.keepWithNext) {
                        this.viewer.updateClientAreaForBlock(paragraphWidget, true);
                        let nextParagraph: ParagraphWidget;
                        if (paragraphWidget instanceof TableWidget) {
                            this.addTableWidget(this.viewer.clientActiveArea, [paragraphWidget]);
                        } else if (nextBodyWidget.firstChild instanceof ParagraphWidget && nextBodyWidget.firstChild.equals(paragraphWidget)) {
                            nextParagraph = nextBodyWidget.firstChild;
                        } else {
                            nextParagraph = new ParagraphWidget();
                        }
                        nextParagraph = this.moveChildsToParagraph(paragraphWidget, startIndex, nextParagraph);
                        nextParagraph.containerWidget = nextBodyWidget;
                        for (let m = 0; m < nextParagraph.floatingElements.length; m++) {
                            const element: ShapeBase = nextParagraph.floatingElements[m];
                            if (element.line.paragraph.bodyWidget !== paragraphWidget.bodyWidget && element.textWrappingStyle !== 'Inline') {
                                paragraphWidget.bodyWidget.floatingElements.splice(paragraphWidget.bodyWidget.floatingElements.indexOf(element), 1);
                            }
                        }
                        paragraphWidget = nextParagraph;
                        if (nextBodyWidget.childWidgets.indexOf(paragraphWidget) === -1) {
                            nextBodyWidget.childWidgets.splice(0, 0, paragraphWidget);
                        }
                        this.viewer.updateClientAreaLocation(paragraphWidget, this.viewer.clientActiveArea);
                        this.layoutBlock(paragraphWidget, 0, true);
                        this.viewer.updateClientAreaForBlock(paragraphWidget, false);
                    } else {
                        this.updateContainerWidget(paragraphWidget, nextBodyWidget, 0, true);
                        if (paragraphWidget instanceof TableWidget) {
                            this.addTableWidget(this.viewer.clientActiveArea, [paragraphWidget]);
                        } else {
                            this.addParagraphWidget(this.viewer.clientActiveArea, paragraphWidget);
                        }
                    }
                    this.moveFootNotesToPage(footWidget, previousBodyWidget, nextBodyWidget);
                }
                if (previousBodyWidget.page === nextBodyWidget.page) {
                    if (previousBodyWidget === nextBodyWidget) {
                        viewer.updateClientArea(nextBodyWidget, nextBodyWidget.page);
                        return false;
                    }
                    return true;
                }
            }
        }
        if (previousBodyWidget === paragraphWidget.containerWidget) {
            // if (paragraphWidget.x !== paragraphWidget.containerWidget.x) {
            //     paragraphWidget.x = paragraphWidget.containerWidget.x;
            // }
            paragraphWidget.y = viewer.clientActiveArea.y;
            viewer.cutFromTop(viewer.clientActiveArea.y + paragraphWidget.height);
        } else {
            //Updates client area based on next body widget.
            viewer.updateClientArea(nextBodyWidget, nextBodyWidget.page);
        }
        return false;
    }
    private getMaximumLineHeightToSplit(paragraphWidget: ParagraphWidget, maxElementHeight: number, viewer: LayoutViewer): number {
        if (viewer.clientActiveArea.height >= maxElementHeight && !paragraphWidget.paragraphFormat.keepLinesTogether &&
            paragraphWidget.paragraphFormat.widowControl && !isNullOrUndefined(paragraphWidget.previousWidget) &&
            isNullOrUndefined(paragraphWidget.previousSplitWidget)) {
            let paragraphHeight: number = paragraphWidget.height;
            for (let m: number = paragraphWidget.childWidgets.length - 1; m >= 0; m--) {
                let lastLine: LineWidget = paragraphWidget.childWidgets[m] as LineWidget;
                let lineHeight: number = this.getMaxElementHeight(lastLine);
                if (lastLine.height > lineHeight) {
                    paragraphHeight -= lastLine.height - lineHeight;
                }
                if (viewer.clientActiveArea.height >= paragraphHeight) {
                    // Move entire paragraph to next page, If first line alone not fitted in the client area.
                    if (m === 0) {
                        maxElementHeight = paragraphWidget.height
                    }
                    break;
                }
                paragraphHeight -= (lastLine).height;
            }
        }
        return maxElementHeight;
    }
    /**
     * @private
     * @param footnoteWidgets
     * @param fromBodyWidget
     * @param toBodyWidget
     */
    public moveFootNotesToPage(footnoteWidgets: BodyWidget[], fromBodyWidget: BodyWidget, toBodyWidget: BodyWidget): void {
        if (footnoteWidgets.length > 0 && fromBodyWidget.page.footnoteWidget && fromBodyWidget.page !== toBodyWidget.page) {
            let footNoteIndex: number = -1;
            let footNoteWidget: BodyWidget;
            let insertIndex: number = 0;
            let check: boolean = false;
            for (let k: number = 0; k < footnoteWidgets.length; k++) {
                /* eslint-disable-next-line max-len */
                footNoteWidget = footnoteWidgets[k];
                footNoteIndex = fromBodyWidget.page.footnoteWidget.bodyWidgets.indexOf(footNoteWidget);
                if (footNoteIndex >= 0) {
                    if (toBodyWidget.page.footnoteWidget === undefined) {
                        this.addEmptyFootNoteToBody(toBodyWidget);
                    }
                    for (let i: number = 0; i < toBodyWidget.page.footnoteWidget.bodyWidgets.length; i++) {
                        let body: ElementBox =  (toBodyWidget.page.footnoteWidget.bodyWidgets[i]).footNoteReference;
                        if (body === (footNoteWidget).footNoteReference) {
                            check = true;
                        }
                    }
                    fromBodyWidget.page.footnoteWidget.bodyWidgets.splice(footNoteIndex, 1);
                    if (toBodyWidget.page.footnoteWidget.bodyWidgets.indexOf(footNoteWidget) < 0 && !check) {
                        let childLength: number = toBodyWidget.page.footnoteWidget.bodyWidgets.length;
                        let fromPage: number = this.documentHelper.pages.indexOf(fromBodyWidget.page);
                        let toPage: number = this.documentHelper.pages.indexOf(toBodyWidget.page);
                        footNoteWidget.containerWidget = toBodyWidget.page.footnoteWidget;
                        footNoteWidget.page = toBodyWidget.page;
                        if (fromPage > toPage) {
                            toBodyWidget.page.footnoteWidget.bodyWidgets.push(footNoteWidget);
                            insertIndex++;
                        } else {
                            toBodyWidget.page.footnoteWidget.bodyWidgets.splice(insertIndex++, 0, footNoteWidget);
                        }
                        toBodyWidget.page.footnoteWidget.height += footNoteWidget.height;
                    }
                    fromBodyWidget.page.footnoteWidget.height -= footNoteWidget.height;
                }
            }
            if (fromBodyWidget.page.footnoteWidget && fromBodyWidget.page.footnoteWidget.bodyWidgets.length === 0) {
                fromBodyWidget.page.footnoteWidget = undefined;
            }
            if(fromBodyWidget.page.footnoteWidget !== undefined) {
                this.layoutfootNote(fromBodyWidget.page.footnoteWidget);
            }
            if (toBodyWidget.page.footnoteWidget !== undefined) {
                this.layoutfootNote(toBodyWidget.page.footnoteWidget);
            }
        }
    }
    private addEmptyFootNoteToBody(bodyWidget: BodyWidget): void {
        const footnoteWidget: FootNoteWidget = new FootNoteWidget();
        footnoteWidget.footNoteType = 'Footnote';
        footnoteWidget.page = bodyWidget.page;
        const newParagraph: ParagraphWidget = new ParagraphWidget();
        newParagraph.characterFormat = new WCharacterFormat();
        newParagraph.paragraphFormat = new WParagraphFormat();
        newParagraph.index = 0;
        const lineWidget: LineWidget = new LineWidget(newParagraph);
        newParagraph.childWidgets.push(lineWidget);
        //  footnoteWidget.childWidgets.push(newParagraph);
        footnoteWidget.height = this.documentHelper.textHelper.getParagraphMarkSize(newParagraph.characterFormat).Height;
        footnoteWidget.margin = new Margin(0, footnoteWidget.height, 0, 0);
        bodyWidget.page.footnoteWidget = footnoteWidget;
    }
    private getMaxElementHeight(lineWidget: LineWidget): number {
        let height: number = 0;
        /* eslint-disable-next-line max-len */
        if (lineWidget.children.length === 0 || ((lineWidget.children.length === 1 && lineWidget.children[0] instanceof ListTextElementBox) || (lineWidget.children.length === 2 && lineWidget.children[0] instanceof ListTextElementBox && lineWidget.children[1] instanceof ListTextElementBox))) {
            const topMargin: number = 0;
            const bottomMargin: number = 0;
            height = this.documentHelper.selection.getParagraphMarkSize(lineWidget.paragraph, topMargin, bottomMargin).height;
            height += topMargin;
            if (lineWidget.children.length > 0) {
                const element: ListTextElementBox = lineWidget.children[0] as ListTextElementBox;
                if (height < element.margin.top + element.height) {
                    height = element.margin.top + element.height;
                }
            }
        } else {
            for (let i: number = 0; i < lineWidget.children.length; i++) {
                const element: ElementBox = lineWidget.children[i];
                if (height < element.margin.top + element.height) {
                    height = element.margin.top + element.height;
                }
            }
        }
        return height;
    }
    private createOrGetNextBodyWidget(bodyWidget: BodyWidget, viewer: LayoutViewer): BodyWidget {
        viewer.columnLayoutArea.setColumns(bodyWidget.sectionFormat);
        let nextColumn: WColumnFormat = viewer.columnLayoutArea.getNextColumnByBodyWidget(bodyWidget);
        if (!isNullOrUndefined(nextColumn)) {
            let nextColumnBody: BodyWidget = this.createOrGetNextColumnBody(bodyWidget);
            return nextColumnBody;
        }
        let nextBodyWidget: BodyWidget = undefined;
        let pageIndex: number = 0;
        pageIndex = this.documentHelper.pages.indexOf(bodyWidget.page);
        let page: Page = undefined;
        let index: number = undefined;
        index = bodyWidget.index;

        if (pageIndex === this.documentHelper.pages.length - 1
            || this.documentHelper.pages[pageIndex + 1].sectionIndex !== index) {
            const currentWidget: BodyWidget = new BodyWidget();
            currentWidget.sectionFormat = bodyWidget.sectionFormat;
            currentWidget.index = bodyWidget.index;
            page = viewer.createNewPage(currentWidget);
            if (this.documentHelper.pages[pageIndex + 1].sectionIndex !== index) {
                this.documentHelper.insertPage(pageIndex + 1, page);
            }
            nextBodyWidget = page.bodyWidgets[0];
        } else {
            page = this.documentHelper.pages[pageIndex + 1];
            nextBodyWidget = page.bodyWidgets[0] as BodyWidget;
        }
        return nextBodyWidget;
    }
    private isFitInClientArea(paragraphWidget: ParagraphWidget, viewer: LayoutViewer, blocks?: BodyWidget[]): boolean {
        const lastLine: LineWidget = paragraphWidget.childWidgets[paragraphWidget.childWidgets.length - 1] as LineWidget;
        let height: number = paragraphWidget.height;
        const maxElementHeight: number = this.getMaxElementHeight(lastLine);
        if (lastLine.height > maxElementHeight) {
            height -= lastLine.height - maxElementHeight;
        }
        let footHeight: number = 0;
        if (!isNullOrUndefined(blocks)) {
            if (blocks.length > 0) {
                if (blocks[0].containerWidget instanceof FootNoteWidget) {
                    footHeight = blocks[0].containerWidget.margin.top;
                }
                for (let k: number = 0; k < blocks.length; k++) {
                    for (let l: number = 0; l < blocks[k].childWidgets.length; l++) {
                        footHeight += (blocks[k].childWidgets[l] as BlockWidget).height;
                    }
                }
            }
        }
        return viewer.clientActiveArea.height >= height + footHeight;
    }
    private isLineInFootNote(line: LineWidget, footNotes: FootnoteElementBox[]): boolean {
        for (let i: number = 0; i < footNotes.length; i++) {
            if (footNotes[i].line === line) {
                return true;
            }
        }
        return false;
    }
    /* eslint-disable-next-line max-len */
    private shiftToPreviousWidget(paragraphWidget: ParagraphWidget, viewer: LayoutViewer, previousWidget: ParagraphWidget, isPageBreak: boolean, isColumnBreak: boolean): void {
        const fromBodyWidget: BodyWidget = paragraphWidget.containerWidget as BodyWidget;
        let toBodyWidget: BodyWidget = previousWidget.containerWidget as BodyWidget;
        let footNotes: FootnoteElementBox[] = [];
        let footNoteWidgets: BodyWidget[] = [];
        if (toBodyWidget !== fromBodyWidget) {
            footNotes = this.getFootNotesOfBlock(paragraphWidget);
        }
        for (let i: number = 0; i < paragraphWidget.childWidgets.length; i++) {
            const line: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
            let maxElementHeight: number = this.getMaxElementHeight(line);
            if (this.isLineInFootNote(line, footNotes)) {
                let footWidget: BodyWidget[] = this.getFootNoteWidgetsBy(line.paragraph, footNotes);
                let height: number = 0;
                for (let m: number = 0; m < footWidget.length; m++) {
                    let footContent: BodyWidget = footWidget[m];
                    for (let n: number = 0; n < footContent.childWidgets.length; n++) {
                        height += (footContent.childWidgets[n] as BlockWidget).height;
                    }
                }
                if (footWidget.length > 0 && footWidget[0].containerWidget) {
                    height += footWidget[0].containerWidget.margin.top;
                }
                maxElementHeight += height;
            }
            if (viewer.clientActiveArea.height >= maxElementHeight && !isPageBreak && !isColumnBreak) {
                if (footNotes.length > 0 && this.isLineInFootNote(line, footNotes)) {
                    footNoteWidgets = footNoteWidgets.concat(this.getFootNoteWidgetsBy(line.paragraph, footNotes));
                }
                //Moves the line widget to previous widget.
                this.updateParagraphWidgetInternal(line, previousWidget, previousWidget.childWidgets.length);
                i--;
                viewer.cutFromTop(viewer.clientActiveArea.y + line.height);
                if (isNullOrUndefined(paragraphWidget.childWidgets)) {
                    break;
                }
            } else {
                const bodyWidget: BodyWidget = previousWidget.containerWidget as BodyWidget;
                viewer.updateClientArea(bodyWidget, bodyWidget.page);
                let newBodyWidget: BodyWidget = this.createOrGetNextBodyWidget(bodyWidget, viewer);
                if (paragraphWidget.containerWidget !== newBodyWidget) {
                    newBodyWidget = this.moveBlocksToNextPage(paragraphWidget, true);
                }
                if (bodyWidget !== newBodyWidget) {
                    footNotes = this.getFootNotesOfBlock(paragraphWidget);
                    if (footNotes.length > 0) {
                        footNoteWidgets = footNoteWidgets.concat(this.getFootNoteWidgetsBy(paragraphWidget, footNotes));
                        toBodyWidget = newBodyWidget;
                    }
                    this.updateContainerWidget(paragraphWidget, newBodyWidget, 0, true);
                }
                //Updates client area based on next page.
                viewer.updateClientArea(newBodyWidget, newBodyWidget.page);
                break;
            }
        }
        if (!isNullOrUndefined(footNoteWidgets) && footNoteWidgets.length > 0 && fromBodyWidget.page.footnoteWidget
            && fromBodyWidget != toBodyWidget) {
            this.moveFootNotesToPage(footNoteWidgets, fromBodyWidget, toBodyWidget);
        }
    }
    private updateParagraphWidgetInternal(lineWidget: LineWidget, newParagraphWidget: ParagraphWidget, index: number): void {
        if (!isNullOrUndefined(lineWidget.paragraph)) {
            lineWidget.paragraph.childWidgets.splice(lineWidget.paragraph.childWidgets.indexOf(lineWidget), 1);
            lineWidget.paragraph.height -= lineWidget.height;
            if (!isNullOrUndefined(lineWidget.paragraph.containerWidget)) {
                lineWidget.paragraph.containerWidget.height -= lineWidget.height;
            }
            if (isNullOrUndefined(lineWidget.paragraph.childWidgets) || lineWidget.paragraph.childWidgets.length === 0) {
                lineWidget.paragraph.destroyInternal(this.viewer);
            }
        }
        if (!isNullOrUndefined(lineWidget.paragraph) && lineWidget.paragraph.floatingElements.length > 0) {
            this.shiftFloatingElements(lineWidget, newParagraphWidget);
        }
        newParagraphWidget.childWidgets.splice(index, 0, lineWidget);
        lineWidget.paragraph = newParagraphWidget;
        newParagraphWidget.height += lineWidget.height;
        if (!isNullOrUndefined(newParagraphWidget.containerWidget)) {
            newParagraphWidget.containerWidget.height += lineWidget.height;
        }
    }
    private shiftFloatingElements(lineWidget: LineWidget, newParagraphWidget: ParagraphWidget): void {
        for (let i = 0; i < lineWidget.children.length; i++) {
            if (lineWidget.children[i] instanceof ShapeElementBox && (lineWidget.children[i] as ShapeElementBox).textWrappingStyle === 'Inline') {
                let index: number = lineWidget.paragraph.floatingElements.indexOf(lineWidget.children[i] as ShapeBase);
                if (index >= 0) {
                    lineWidget.paragraph.floatingElements.splice(index, 1);
                    newParagraphWidget.floatingElements.splice(index, 0, lineWidget.children[i] as ShapeBase);
                }
            }
        }
    }
    private shiftNextWidgets(blockAdv: BlockWidget): void {
        let block: BlockWidget = blockAdv;
        while (block.nextWidget instanceof BlockWidget) {
            block = block.nextWidget as BlockWidget;
            if (this.viewer instanceof PageLayoutViewer && !this.isMultiColumnSplit && block.bodyWidget.sectionFormat.columns.length > 1) {
                let lastbody: BodyWidget = this.getBodyWidget(block.bodyWidget, false);
                if ((!isNullOrUndefined(lastbody.nextRenderedWidget) && lastbody.page === (lastbody.nextRenderedWidget as BodyWidget).page)) {
                    this.splitBodyWidgetBasedOnColumn(block.bodyWidget);
                    break;
                }
            }
            this.reLayoutOrShiftWidgets(block, this.viewer);
        }
    }

    public updateContainerWidget(widget: Widget, bodyWidget: BodyWidget, index: number, destroyAndScroll: boolean, footWidget?: BodyWidget[]): void {
        if (widget.containerWidget && widget.containerWidget.containerWidget instanceof FootNoteWidget) {
            return;
        }
        let previousWidget: BodyWidget = widget.containerWidget as BodyWidget;
        if (!isNullOrUndefined(widget.containerWidget)) {
            widget.containerWidget.childWidgets.splice(widget.containerWidget.childWidgets.indexOf(widget), 1);
            widget.containerWidget.height -= bodyWidget.height;
            if ((isNullOrUndefined(widget.containerWidget.childWidgets) || widget.containerWidget.childWidgets.length === 0)
                && widget.containerWidget instanceof BodyWidget && widget.containerWidget !== bodyWidget && destroyAndScroll) {
                const page: Page = widget.containerWidget.page;
                if (this.documentHelper.pages[this.documentHelper.pages.length - 1] === page &&
                    (this.viewer as PageLayoutViewer).visiblePages.indexOf(page) !== -1) {
                    this.documentHelper.scrollToBottom();
                }
                if (isNullOrUndefined(page.endnoteWidget) && (isNullOrUndefined(page.nextPage) || page.nextPage.bodyWidgets[0].index !== widget.containerWidget.index)) {
                    const section: BodyWidget = widget.containerWidget;
                    if (!isNullOrUndefined(section.nextRenderedWidget) && (section.nextRenderedWidget as BodyWidget).sectionFormat.columns.length > 1) {
                        (section.nextRenderedWidget as BodyWidget).columnIndex = section.columnIndex;
                    }
                    widget.containerWidget.destroyInternal(this.viewer);
                }
            }
        }
        bodyWidget.childWidgets.splice(index, 0, widget);
        if (widget instanceof ParagraphWidget && !isNullOrUndefined(widget.floatingElements)) {
            for (let i: number = 0; i < widget.floatingElements.length; i++) {
                const shape: ShapeBase = widget.floatingElements[i];
                if (shape.textWrappingStyle !== 'Inline') {
                    bodyWidget.floatingElements.push(shape);
                    widget.bodyWidget.floatingElements.splice(widget.bodyWidget.floatingElements.indexOf(shape), 1);
                    /* eslint:disable */
                    bodyWidget.floatingElements.sort(function (a: ShapeBase, b: ShapeBase): number { return a.y - b.y; });
                }
            }
        }
        if (widget instanceof TableWidget && widget.wrapTextAround
            && widget.bodyWidget.floatingElements.indexOf(widget) !== -1) {
            widget.bodyWidget.floatingElements.splice(widget.bodyWidget.floatingElements.indexOf(widget), 1);
        }
        bodyWidget.height += bodyWidget.height;
        widget.containerWidget = bodyWidget;
        if(previousWidget && previousWidget.page &&  previousWidget.page.footnoteWidget &&footWidget && footWidget.length > 0){
            this.moveFootNotesToPage(footWidget, previousWidget, bodyWidget);
        }
    }
    private getBodyWidgetOfPreviousBlock(block: BlockWidget, index: number): BodyWidgetInfo {
        index = 0;
        let prevBodyWidget: BodyWidget = undefined;
        const previousBlock: BlockWidget = block.previousRenderedWidget as BlockWidget;
        prevBodyWidget = (previousBlock && previousBlock.containerWidget.equals(block.containerWidget)) ?
            previousBlock.containerWidget as BodyWidget : 
            (block instanceof TableWidget && !isNullOrUndefined(block.containerWidget.previousRenderedWidget) && block.containerWidget.index === block.containerWidget.previousRenderedWidget.index) ? 
                block.containerWidget.previousRenderedWidget as BodyWidget :
                block.containerWidget as BodyWidget;
        index = previousBlock && previousBlock.containerWidget.equals(block.containerWidget) ?
            prevBodyWidget.childWidgets.indexOf(previousBlock) : block.containerWidget.childWidgets.indexOf(block);
        return { bodyWidget: prevBodyWidget, index: index };
    }

    public moveBlocksToNextPage(block: BlockWidget, moveFootnoteFromLastBlock?: boolean, childStartIndex?: number, sectionBreakContinuous?: boolean, isEndnote?: boolean, isTableSplit?: boolean): BodyWidget {
        const body: BodyWidget = block.bodyWidget as BodyWidget;
        this.viewer.columnLayoutArea.setColumns(body.sectionFormat);
        let nextColumn: WColumnFormat = this.viewer.columnLayoutArea.getNextColumnByBodyWidget(block.bodyWidget);
        let nextPage: Page = undefined;
        let nextBody: BodyWidget = undefined;
        if (!isNullOrUndefined(nextColumn) && !(block instanceof ParagraphWidget && (block as ParagraphWidget).isEndsWithPageBreak)) {
            nextBody = this.moveToNextColumnByBodyWidget(block, childStartIndex);
            nextBody.columnIndex = nextColumn.index;
            nextBody.y = block.bodyWidget.y;
            this.viewer.updateClientArea(nextBody, nextBody.page);
            this.viewer.clientActiveArea.height -= nextBody.y - this.viewer.clientActiveArea.y;
            this.viewer.clientActiveArea.y = nextBody.y;
            if (block.bodyWidget.sectionFormat.columns.length > 1) {
                let columnIndex: number = block.bodyWidget.columnIndex;
                let columnWidth: number = block.bodyWidget.x + block.bodyWidget.sectionFormat.columns[columnIndex].width + block.bodyWidget.sectionFormat.columns[columnIndex].space;
                for (let j: number = 0; j < block.bodyWidget.floatingElements.length; j++) {
                    if (block.bodyWidget.floatingElements[j] instanceof ShapeElementBox && columnWidth < block.bodyWidget.floatingElements[j].x + block.bodyWidget.floatingElements[j].width) {
                        nextBody.floatingElements.push(block.bodyWidget.floatingElements[j]);
                    }
                }
            }
        }
        if (isNullOrUndefined(nextBody)) {
            let insertPage: boolean = false;
            const page: Page = body.page;
            const pageIndex: number = page.index + 1;
            if (this.documentHelper.pages.length > pageIndex && !this.isMultiColumnLayout) {
                nextPage = this.documentHelper.pages[pageIndex];
                if (isEndnote && !isNullOrUndefined(nextPage) && !isNullOrUndefined(nextPage.endnoteWidget)) {
                    if (nextPage.endnoteWidget.bodyWidgets[0].index === body.index) {
                        nextBody = nextPage.endnoteWidget.bodyWidgets[0];
                        this.viewer.updateClientArea(nextBody, nextBody.page);
                    } else {
                        nextBody = this.createSplitBody(body);
                        let newEndnote: FootNoteWidget = new FootNoteWidget();
                        newEndnote.footNoteType = 'Endnote';
                        newEndnote.page = nextPage;
                        newEndnote.bodyWidgets.push(nextBody);
                        nextBody.containerWidget = newEndnote;
                        nextBody.page = nextPage;
                        this.viewer.updateClientArea(nextBody, nextBody.page);
                        nextBody.y = this.viewer.clientActiveArea.y;
                    }
                } else if (!isNullOrUndefined(nextPage) && nextPage.bodyWidgets.length !== 0 && body.sectionFormat.pageHeight === nextPage.bodyWidgets[0].sectionFormat.pageHeight && body.sectionFormat.pageWidth === nextPage.bodyWidgets[0].sectionFormat.pageWidth && body.sectionFormat.breakCode === 'NoBreak') {
                    if (nextPage.bodyWidgets[0].index === body.index) {
                        nextBody = nextPage.bodyWidgets[0];
                        this.viewer.updateClientArea(nextBody, nextBody.page);
                    } else {
                        nextBody = this.createSplitBody(body);
                        nextPage.bodyWidgets.splice(0, 0, nextBody);
                        nextBody.page = nextPage;
                        this.viewer.updateClientArea(nextBody, nextBody.page);
                        nextBody.y = this.viewer.clientActiveArea.y;
                    }
                } else if (nextPage.bodyWidgets.length === 0 || !body.equals(nextPage.bodyWidgets[0]) || (body.sectionIndex !== nextPage.bodyWidgets[0].sectionIndex && (body.sectionFormat.breakCode === 'NewPage' || (!body.isWord2010NextColumn && body.sectionFormat.breakCode !== 'NoBreak')))) {
                    nextPage = undefined;
                    insertPage = true;
                } else {
                    nextBody = nextPage.bodyWidgets[0];
                    this.viewer.updateClientArea(nextBody, nextBody.page);
                }
            }
            if (this.isMultiColumnLayout) {
                insertPage = true;
            }
            if (isNullOrUndefined(nextPage)) {
                nextBody = this.createSplitBody(body);
                if ((((this.documentHelper.owner.editorHistoryModule &&
                    this.documentHelper.owner.editorHistoryModule.isRedoing && this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo &&
                    this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.action === 'SectionBreakContinuous')) && block.bodyWidget.sectionFormat.breakCode === 'NoBreak')
                    || sectionBreakContinuous) {
                    //  this.viewer.clientActiveArea.y = block.y + block.height;
                } else if (isEndnote) {
                    let lastBodyWidget: BodyWidget = page.bodyWidgets[body.page.bodyWidgets.length - 1];
                    const newBodyWidget: BodyWidget = this.createSplitBody(lastBodyWidget);
                    nextPage = this.viewer.createNewPage(newBodyWidget, pageIndex);
                    this.viewer.updateClientArea(newBodyWidget, newBodyWidget.page);
                    newBodyWidget.y = nextBody.y = this.viewer.clientActiveArea.y;
                    nextBody.page = nextPage;
                } else {
                    nextPage = this.viewer.createNewPage(nextBody, pageIndex);
                    this.viewer.updateClientArea(nextBody, nextBody.page);
                    nextBody.y = this.viewer.clientActiveArea.y;
                }
                if (insertPage && !isNullOrUndefined(nextPage)) {
                    this.documentHelper.insertPage(pageIndex, nextPage);
                }
                this.clearLineMeasures();
            }
            if (nextPage) {
                do {
                    let lastBody: BodyWidget = body.page.bodyWidgets[body.page.bodyWidgets.length - 1];
                    if (this.isSectionBreakCont || body === lastBody || body.containerWidget instanceof FootNoteWidget) {
                        break;
                    }
                    body.page.bodyWidgets.splice(body.page.bodyWidgets.indexOf(lastBody), 1);
                    nextPage.bodyWidgets.splice(1, 0, lastBody);
                    lastBody.page = nextPage;
                } while (true);
            }
        }
        // eslint-disable  no-constant-condition
        if (this.isTextFormat) {
            let index = body.childWidgets.indexOf(block);
            let child = body.childWidgets.slice(index);
            body.childWidgets.splice(index);
            for (const obj of child) {
                nextBody.childWidgets.push(obj);
                (obj as any).containerWidget = nextBody;
            }
        } else {
            do {
                let lastBlock: BlockWidget;
                if (body.lastChild instanceof FootNoteWidget) {
                    lastBlock = body.lastChild.previousWidget as BlockWidget;
                } else {
                    lastBlock = body.lastChild as BlockWidget;
                }
                if (moveFootnoteFromLastBlock || (isTableSplit && block !== lastBlock && !(lastBlock instanceof TableWidget) && lastBlock.isLayouted)) {
                    const footWidget: BodyWidget[] = this.getFootNoteWidgetsOf(lastBlock);
                    this.moveFootNotesToPage(footWidget, body, nextBody);
                }
                if (block === lastBlock) {
                    break;
                }
                body.childWidgets.splice(body.childWidgets.indexOf(lastBlock), 1);
                nextBody.childWidgets.splice(0, 0, lastBlock);
                if (lastBlock instanceof TableWidget && (body.floatingElements.indexOf(lastBlock) !== -1)) {
                    body.floatingElements.splice(body.floatingElements.indexOf(lastBlock), 1);
                    //nextBody.floatingElements.push(lastBlock);
                }
                if (lastBlock instanceof ParagraphWidget && lastBlock.floatingElements.length > 0) {
                    for (let m: number = 0; m < lastBlock.floatingElements.length; m++) {
                        if (body.floatingElements.indexOf(lastBlock.floatingElements[m]) !== -1 && lastBlock.floatingElements[m].textWrappingStyle !== 'Inline') {
                            body.floatingElements.splice(body.floatingElements.indexOf(lastBlock.floatingElements[m]), 1);
                            nextBody.floatingElements.push(lastBlock.floatingElements[m]);
                        }
                    }
                }
                lastBlock.containerWidget = nextBody;
                nextBody.height += lastBlock.height;
                // eslint-disable-next-line no-constant-condition
            } while (true);
        }
        return nextBody;
    }
    private createSplitBody(body: BodyWidget): BodyWidget {
        const newBody: BodyWidget = this.addBodyWidget(this.viewer.clientActiveArea);
        newBody.sectionFormat = body.sectionFormat;
        newBody.index = body.index;
        return newBody;
    }
    private createOrGetNextColumnBody(fromBody: BodyWidget): BodyWidget {
        let nextColumnBody: BodyWidget;
        if (fromBody.nextRenderedWidget && fromBody.columnIndex + 1 === (fromBody.nextRenderedWidget as BodyWidget).columnIndex) {
            nextColumnBody = fromBody.nextRenderedWidget  as BodyWidget;
        }
        if (isNullOrUndefined(nextColumnBody)) {
            nextColumnBody = new BodyWidget();
            nextColumnBody.sectionFormat = fromBody.sectionFormat;
            nextColumnBody.index = fromBody.index;
            nextColumnBody.page = fromBody.page;
            nextColumnBody.y = fromBody.y;
            if (fromBody.containerWidget instanceof FootNoteWidget) {
                fromBody.containerWidget.bodyWidgets.splice(fromBody.containerWidget.bodyWidgets.indexOf(fromBody) + 1, 0, nextColumnBody);
                nextColumnBody.containerWidget = fromBody.containerWidget;
            }
            else {
                fromBody.page.bodyWidgets.splice(fromBody.page.bodyWidgets.indexOf(fromBody) + 1, 0, nextColumnBody);
            } 
        }
        return nextColumnBody;
    }
    private moveToNextColumnByBodyWidget(block: BlockWidget, childStartIndex: number): BodyWidget {
        let fromBody: BodyWidget = block.containerWidget as BodyWidget;
        let nextColumnBody: BodyWidget = this.createOrGetNextColumnBody(fromBody);
        return nextColumnBody;
    }
    //endregion

    //#region Relayout Parargaph

    /* eslint-disable  */
    public reLayoutLine(paragraph: ParagraphWidget, lineIndex: number, isBidi: boolean, isSkip?: boolean, isSkipList?: boolean): void {
        if (!this.documentHelper.owner.editorModule.isFootnoteElementRemoved) {
            this.isFootnoteContentChanged = false;
        }
        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule && !isSkipList) {
            this.viewer.owner.editorModule.updateWholeListItems(paragraph);
        }
        let lineWidget: LineWidget;
        if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1) {
            lineWidget = paragraph.getSplitWidgets()[0].firstChild as LineWidget;
        } else {
            lineWidget = paragraph.childWidgets[lineIndex] as LineWidget;
        }
        let lineToLayout: LineWidget;
        if (paragraph.containerWidget instanceof BodyWidget && paragraph.containerWidget.sectionFormat.numberOfColumns > 1 && paragraph.containerWidget.sectionFormat.equalWidth) {
            lineToLayout = lineWidget.previousLine;
        }
        if (isNullOrUndefined(lineToLayout)) {
            lineToLayout = lineWidget;
        }
        if (this.allowLayout) {
            lineToLayout.paragraph.splitTextRangeByScriptType(lineToLayout.indexInOwner);
            lineToLayout.paragraph.splitLtrAndRtlText(lineToLayout.indexInOwner);
            lineToLayout.paragraph.combineconsecutiveRTL(lineToLayout.indexInOwner);
        }
        let bodyWidget: BodyWidget = paragraph.containerWidget as BlockContainer;
        bodyWidget.height -= paragraph.height;
        if ((this.viewer.owner.enableHeaderAndFooter || paragraph.isInHeaderFooter) && !(bodyWidget instanceof TextFrame)) {
            (paragraph.bodyWidget as HeaderFooterWidget).isEmpty = false;
            (this.viewer as PageLayoutViewer).updateHeaderFooterClientAreaWithTop(paragraph.bodyWidget.sectionFormat, this.documentHelper.isBlockInHeader(paragraph), bodyWidget.page);
        } else if (bodyWidget instanceof TextFrame) {
            this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true);
            // } else if (bodyWidget instanceof FootNoteWidget) {
            //     this.isRelayoutFootnote = true;
            //     this.viewer.updateClientArea(bodyWidget.sectionFormat, bodyWidget.page);
            //     this.viewer.clientArea.height = Number.POSITIVE_INFINITY;
            //     this.viewer.clientActiveArea.height = Number.POSITIVE_INFINITY;
            //     // curretBlock.containerWidget.height -= curretBlock.height;
            //     this.viewer.clientActiveArea.y = paragraph.containerWidget.y;
        } else {
            this.viewer.updateClientArea(bodyWidget, bodyWidget.page, true);
        }
        this.viewer.updateClientAreaForBlock(paragraph, true);
        let pageIndexBeforeLayout: number = 0;
        if (paragraph.containerWidget instanceof BodyWidget) {
            const blocks: BlockWidget[] = paragraph.getSplitWidgets() as BlockWidget[];
            const splittedWidget = blocks[blocks.length - 1];
            pageIndexBeforeLayout = (splittedWidget.containerWidget as BodyWidget).page.index;
        }
        if (!isNullOrUndefined(paragraph.containerWidget) && !isNullOrUndefined(paragraph.containerWidget.containerWidget) && paragraph.containerWidget.containerWidget instanceof FootNoteWidget) {
            let y: number = paragraph.bodyWidget.containerWidget.y;
            this.viewer.cutFromTop(y);
            this.documentHelper.owner.editorModule.isFootNoteInsert = true;
            this.layoutfootNote(paragraph.containerWidget.containerWidget);
            this.documentHelper.owner.editorModule.isFootNoteInsert = false;
            return;
        } else if (lineToLayout.paragraph.isEmptyInternal(true) && isNullOrUndefined(lineToLayout.paragraph.nextSplitWidget)) {
            this.viewer.cutFromTop(paragraph.y);
            this.layoutParagraph(paragraph, 0);
        } else {
            this.updateClientAreaForLine(lineToLayout);
            this.layoutListItems(lineToLayout.paragraph);
            if (lineToLayout.isFirstLine() && !isNullOrUndefined(paragraph.paragraphFormat)) {
                let firstLineIndent: number = -HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent);
                this.viewer.updateClientWidth(firstLineIndent);
            }
            do {
                lineToLayout = this.layoutLine(lineToLayout, 0);
                paragraph = lineToLayout.paragraph;
                lineToLayout = lineToLayout.nextLine;
            } while (lineToLayout);
            this.updateWidgetToPage(this.viewer, paragraph);
        }
        this.viewer.updateClientAreaForBlock(paragraph, false);
        let pageIndexAfterLayout: number = 0;
        if (paragraph.containerWidget instanceof BodyWidget) {
            const blocks: BlockWidget[] = paragraph.getSplitWidgets() as BlockWidget[];
            const splittedWidget = blocks[blocks.length - 1];
            pageIndexAfterLayout = (splittedWidget.containerWidget as BodyWidget).page.index;
        }
        this.layoutNextItemsBlock(paragraph, this.viewer, undefined, pageIndexBeforeLayout !== pageIndexAfterLayout);
        const prevWidget: BodyWidget = paragraph.getSplitWidgets()[0].previousRenderedWidget as BodyWidget;
        if (!isNullOrUndefined(prevWidget) && !paragraph.isEndsWithPageBreak && !paragraph.isEndsWithColumnBreak && (!(prevWidget instanceof ParagraphWidget) ||
            (prevWidget instanceof ParagraphWidget) && !prevWidget.isEndsWithPageBreak && !prevWidget.isEndsWithColumnBreak)) {
            this.viewer.cutFromTop(paragraph.y + paragraph.height);
            if (paragraph.containerWidget !== prevWidget.containerWidget && !isNullOrUndefined(prevWidget.containerWidget)) {
                /* eslint-disable-next-line max-len */
                let prevBodyWidget: BodyWidget = paragraph.containerWidget as BodyWidget;
                let newBodyWidget: BodyWidget = prevWidget.containerWidget as BodyWidget;
                const footWidgets: BodyWidget[] = this.getFootNoteWidgetsOf(paragraph);
                //this.updateContainerWidget(paragraph as Widget, newBodyWidget, prevWidget.indexInOwner + 1, false);
                if (!isNullOrUndefined(newBodyWidget.page.footnoteWidget)) {
                    this.moveFootNotesToPage(footWidgets, newBodyWidget, prevBodyWidget);
                }
            }
        }
        let page: number = this.documentHelper.pages.length;
        let lastPage: Page = this.documentHelper.pages[page - 1];
        let foot: FootNoteWidget;
        let newBodyWidget: BlockContainer = lastPage.bodyWidgets[lastPage.bodyWidgets.length - 1];
        if ((this.documentHelper.owner.editorModule.isFootnoteElementRemoved || this.isFootnoteContentChanged)
                && !isNullOrUndefined(paragraph.bodyWidget.page.footnoteWidget)) {
            foot = paragraph.bodyWidget.page.footnoteWidget;
            this.layoutfootNote(foot);
        }
        if (!isNullOrUndefined(this.viewer.owner.editorHistoryModule) && this.viewer.owner.editorHistoryModule.isRedoing && !isNullOrUndefined(newBodyWidget.page.endnoteWidget)) {
            this.isEndnoteContentChanged = true;
        }
        if ((this.documentHelper.owner.editorModule.isEndnoteElementRemoved || this.isEndnoteContentChanged)
                && !isNullOrUndefined(newBodyWidget.page.endnoteWidget)) {
            foot = newBodyWidget.page.endnoteWidget;
            const clientArea: Rect = this.viewer.clientArea.clone();
            const clientActiveArea: Rect = this.viewer.clientActiveArea.clone();
            let y: number = newBodyWidget.y;
            if (newBodyWidget.childWidgets.length > 0) {
                const lastPageLastPara: Widget = newBodyWidget.childWidgets[newBodyWidget.childWidgets.length - 1] as Widget;
                y = lastPageLastPara.y + lastPageLastPara.height;
            }
            this.viewer.clientActiveArea.height = this.viewer.clientActiveArea.bottom - y;
            this.viewer.clientActiveArea.x = this.viewer.clientArea.x;
            this.viewer.clientActiveArea.width = this.viewer.clientArea.width;
            this.viewer.clientActiveArea.y = y;
            this.layoutfootNote(foot);
            this.viewer.clientArea = clientArea;
            this.viewer.clientActiveArea = clientActiveArea;
            //this.viewer.updateClientAreaForBlock(foot.block, false);
        }
        if (!isNullOrUndefined(this.viewer.owner.editorHistoryModule) && this.viewer.owner.editorHistoryModule.isRedoing) {
            this.isEndnoteContentChanged = false;
        }
    }
    //#endregion
    //RTL Feature layout start
    public isContainsRtl(lineWidget: LineWidget): boolean {
        if(this.viewer.documentHelper.isSelectionChangedOnMouseMoved && !this.isDocumentContainsRtl){
            return false;
        }
        let isContainsRTL: boolean = false;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            if (lineWidget.children[i] instanceof TextElementBox) {
                isContainsRTL = lineWidget.children[i].characterFormat.bidi || lineWidget.children[i].characterFormat.bdo === 'RTL'
                    || this.documentHelper.textHelper.isRTLText((lineWidget.children[i] as TextElementBox).text);
                if (isContainsRTL) {
                    if(!this.isDocumentContainsRtl) {
                        this.isDocumentContainsRtl = isContainsRTL;
                    }
                    break;
                }
            }
        }
        return isContainsRTL;
    }
    // Re arranges the elements for Right to left layotuing.
    /* eslint-disable  */
    // public reArrangeElementsForRtl(line: LineWidget, isParaBidi: boolean): void {
    //     if (line.children.length === 0) {
    //         return;
    //     }

    //     let lastAddedElementIsRtl: boolean = false;
    //     let lastAddedRtlElementIndex: number = -1;
    //     let tempElements: ElementBox[] = [];

    //     for (let i: number = 0; i < line.children.length; i++) {
    //         let element: ElementBox = line.children[i];
    //         let elementCharacterFormat: WCharacterFormat = undefined;
    //         if (element.characterFormat) {
    //             elementCharacterFormat = element.characterFormat;
    //         }
    //         let isRtl: boolean = false;
    //         let text: string = '';
    //         let containsSpecchrs: boolean = false;
    //         if (element instanceof BookmarkElementBox) {
    //             if (isParaBidi) {
    //                 if (lastAddedElementIsRtl || element.bookmarkType === 0 && element.nextElement
    //                     && element.nextElement.nextElement instanceof TextElementBox
    //                     && this.documentHelper.textHelper.isRTLText(element.nextElement.nextElement.text)
    //                     || element.bookmarkType === 1 && element.nextElement instanceof TextElementBox
    //                     && this.documentHelper.textHelper.isRTLText(element.nextElement.text)) {
    //                     tempElements.splice(0, 0, element);
    //                 } else {
    //                     tempElements.splice(lastAddedElementIsRtl ? lastAddedRtlElementIndex : lastAddedRtlElementIndex + 1, 0, element);
    //                 }
    //                 lastAddedRtlElementIndex = tempElements.indexOf(element);
    //             } else {
    //                 tempElements.push(element);
    //             }
    //             continue;
    //         }

    //         if (element instanceof TextElementBox) {
    //             text = (element as TextElementBox).text;
    //             containsSpecchrs = this.documentHelper.textHelper.containsSpecialCharAlone(text.trim());
    //             if (containsSpecchrs) {
    //                 if (elementCharacterFormat.bidi && isParaBidi) {
    //                     text = HelperMethods.reverseString(text);
    //                     for (let k: number = 0; k < text.length; k++) {
    //                         let ch: string = this.documentHelper.textHelper.inverseCharacter(text.charAt(k));
    //                         text = text.replace(text.charAt(k), ch);
    //                     }
    //                     element.text = text;
    //                 }
    //             }
    //             let textElement: ElementBox = element.nextElement;
    //             if (element instanceof TextElementBox && this.documentHelper.textHelper.containsNumberAlone(element.text.trim())) {
    //                 while (textElement instanceof TextElementBox && textElement.text.trim() !== '' && (this.documentHelper.textHelper.containsNumberAlone(textElement.text.trim()) || this.documentHelper.textHelper.containsSpecialCharAlone(textElement.text.trim()))) {
    //                     element.text = element.text + textElement.text;
    //                     element.line.children.splice(element.line.children.indexOf(textElement), 1);
    //                     textElement = element.nextElement;
    //                 }
    //                 element.width = this.documentHelper.textHelper.getTextSize(element as TextElementBox, element.characterFormat);
    //             }
    //         }
    //         let isRTLText: boolean = false;
    //         // let isNumber: boolean = false;
    //         // The list element box shold be added in the last position in line widget for the RTL paragraph 
    //         // and first in the line widget for LTR paragrph.
    //         if (element instanceof ListTextElementBox) {
    //             isRtl = isParaBidi;
    //         } else { // For Text element box we need to check the character format and unicode of text to detect the RTL text. 
    //             isRTLText = this.documentHelper.textHelper.isRTLText(text);
    //             isRtl = isRTLText || elementCharacterFormat.bidi
    //                 || elementCharacterFormat.bdo === 'RTL';

    //         }
    //         if (element instanceof FieldElementBox || this.isRtlFieldCode) {
    //             if ((element as FieldElementBox).fieldType === 0) {
    //                 this.isRtlFieldCode = true;
    //             } else if ((element as FieldElementBox).fieldType === 1) {
    //                 this.isRtlFieldCode = false;
    //             }
    //             isRtl = false;
    //         }

    //         // If the text element box contains only whitespaces, then need to check the previous and next elements.
    //         if (!isRtl && !isNullOrUndefined(text) && text !== '' && ((text !== '' && text.trim() === '') || containsSpecchrs)) {
    //             let elements: ElementBox[] = line.children;
    //             //Checks whether the langugae is RTL.
    //             if (elementCharacterFormat.bidi) {
    //                 // If the last added element is rtl then current text element box also considered as RTL for WhiteSpaces.
    //                 if (lastAddedElementIsRtl) {
    //                     isRtl = true;
    //                     // Else, Check for next element.
    //                 } else if (i + 1 < line.children.length && line.children[i + 1] instanceof TextElementBox) {
    //                     text = (elements[i + 1] as TextElementBox).text;
    //                     isRtl = this.documentHelper.textHelper.isRTLText(text) || elements[i + 1].characterFormat.bidi
    //                         || elements[i + 1].characterFormat.bdo === 'RTL';
    //                 }// If the last added element is rtl then current text element box also considered as RTL for WhiteSpaces.
    //             } else if (lastAddedElementIsRtl) {
    //                 isRtl = true;
    //             }
    //         }
    //         // Preserve the isRTL value, to reuse it for navigation and selection.
    //         element.isRightToLeft = isRtl;
    //         //Adds the text element to the line
    //         if (isRtl && elementCharacterFormat.bdo !== 'LTR') {
    //             if (lastAddedElementIsRtl) {
    //                 tempElements.splice(lastAddedRtlElementIndex, 0, element);
    //             } else {
    //                 if (!isParaBidi) {
    //                     tempElements.push(element);
    //                 } else {
    //                     tempElements.splice(0, 0, element);
    //                 }
    //                 lastAddedElementIsRtl = true;
    //                 lastAddedRtlElementIndex = tempElements.indexOf(element);
    //             }
    //         } else {
    //             if (lastAddedElementIsRtl && element instanceof ImageElementBox) {
    //                 if (elementCharacterFormat.bidi) {
    //                     tempElements.splice(lastAddedRtlElementIndex + 1, 0, element);
    //                 } else {
    //                     tempElements.splice(lastAddedRtlElementIndex, 0, element);
    //                 }
    //             } else {
    //                 if (!isParaBidi) {
    //                     tempElements.push(element);
    //                 } else {
    //                     if (lastAddedElementIsRtl) {
    //                         tempElements.splice(0, 0, element);
    //                     } else {
    //                         tempElements.splice(lastAddedRtlElementIndex + 1, 0, element);
    //                     }
    //                     lastAddedRtlElementIndex = tempElements.indexOf(element);
    //                 }
    //                 lastAddedElementIsRtl = false;
    //             }
    //         }
    //     }
    //     // Clear the elemnts and reassign the arranged elements.
    //     line.children = [];
    //     line.children = tempElements;
    // }
    private shiftElementsForRTLLayouting(line: LineWidget, paraBidi: boolean): boolean {
        ////Check whether span has bidi value
        let textRangeBidi: boolean = this.hasTextRangeBidi(line);

        if (this.isContainsRTLText(line) || paraBidi || textRangeBidi) {
            ////Splits the child elements of a line by consecutive RTL, LTR text and word breaking characters.
            let characterRangeTypes: CharacterRangeType[] = [];
            let lineElementsBidiValues: boolean[] = [];
            for (let i: number = 0; i < line.children.length; i++) {
                let element: ElementBox = line.children[i];
                if (element instanceof TextElementBox && element.height > 0 && !(element.isPageBreak) && element.text !== '\v') {
                    let textRange: TextElementBox = element as TextElementBox;
                    lineElementsBidiValues.push(textRange.characterFormat.bidi);
                    if (textRange.text == "\t") {
                        characterRangeTypes.push(CharacterRangeType.Tab);
                    } else {
                        characterRangeTypes.push((textRange as TextElementBox).characterRange);
                    }
                    element.isRightToLeft = characterRangeTypes[characterRangeTypes.length - 1] == CharacterRangeType.RightToLeft;
                } else if (element instanceof CommentCharacterElementBox
                    || element instanceof BookmarkElementBox || element instanceof EditRangeStartElementBox
                    || element instanceof EditRangeEndElementBox || element instanceof ContentControl
                    || element instanceof FieldElementBox) {
                    let isStartMark: boolean = this.isStartMarker(element);
                    let isEndMark: boolean = this.isEndMarker(element);
                    if (isStartMark && i < line.children.length - 1) {
                        let nextltWidget: ElementBox = this.getNextValidWidget(i + 1, line);
                        if (!isNullOrUndefined(nextltWidget) && (nextltWidget instanceof TextElementBox)
                            && nextltWidget.height > 0) {
                            let textRange: TextElementBox = nextltWidget;
                            lineElementsBidiValues.push(textRange.characterFormat.bidi);
                            //Since tab-stop in the line changes the reordering, here we consider an tab-stop widget as Tab.
                            if (nextltWidget.text === '\t') {
                                characterRangeTypes.push(CharacterRangeType.Tab);
                            } else {
                                characterRangeTypes.push(textRange.characterRange);
                            }
                        } else {
                            lineElementsBidiValues.push(false);
                            characterRangeTypes.push(CharacterRangeType.LeftToRight);
                        }
                    } else if (!isEndMark && i > 0) {
                        lineElementsBidiValues.push(lineElementsBidiValues[lineElementsBidiValues.length - 1]);
                        characterRangeTypes.push(characterRangeTypes[characterRangeTypes.length - 1]);
                    } else {
                        lineElementsBidiValues.push(false);
                        characterRangeTypes.push(CharacterRangeType.LeftToRight);
                    }
                } else if (element instanceof ListTextElementBox && paraBidi) {
                    lineElementsBidiValues.push(paraBidi);
                    characterRangeTypes.push(CharacterRangeType.RightToLeft);
                } else {
                    lineElementsBidiValues.push(false);
                    characterRangeTypes.push(CharacterRangeType.LeftToRight);
                }
            }

            ////Sets CharacterRangeType of word split characters as (WordSplit | RTL), if word split characters are present between splitted RTL text in the same layouted line.
            ////This code handles for both single and multiple Text Ranges of a line (Special case for ordering elements)
            let rtlStartIndex: number = -1;
            let isPrevLTRText: boolean = undefined;
            for (let i: number = 0; i < characterRangeTypes.length; i++) {
                if (i + 1 < lineElementsBidiValues.length
                    && lineElementsBidiValues[i] != lineElementsBidiValues[i + 1]) {
                    if (rtlStartIndex != -1) {
                        this.updateCharacterRange(line, i, rtlStartIndex, lineElementsBidiValues, characterRangeTypes);
                        rtlStartIndex = -1;
                    }

                    isPrevLTRText = null;
                    continue;
                }

                /// When only one NumberNonReversingCharacter(.:,) is exists in between a two numbers and 
                /// both these number and NumberNonReversingCharacter having a Bidi property,
                /// MS Word consider this NumberNonReversingCharacter(.:,) as Number and re-order it accordingly.
                if (i > 0 && i != characterRangeTypes.length - 1
                    && characterRangeTypes[i] == CharacterRangeType.WordSplit && lineElementsBidiValues[i]
                    && characterRangeTypes[i - 1] == CharacterRangeType.Number && lineElementsBidiValues[i - 1]
                    && characterRangeTypes[i + 1] == CharacterRangeType.Number && lineElementsBidiValues[i + 1]
                    && this.isNumberNonReversingCharacter(line.children[i])) {
                    characterRangeTypes[i] = CharacterRangeType.Number;
                }
                else if (characterRangeTypes[i] == CharacterRangeType.RightToLeft || characterRangeTypes[i] == CharacterRangeType.LeftToRight
                    || characterRangeTypes[i] == CharacterRangeType.Number && rtlStartIndex != -1
                    || (isNullOrUndefined(isPrevLTRText) || !isPrevLTRText) && lineElementsBidiValues[i]) {
                    if (rtlStartIndex == -1 && characterRangeTypes[i] != CharacterRangeType.LeftToRight) {
                        rtlStartIndex = i;
                    } else if (rtlStartIndex == -1) {
                        if (characterRangeTypes[i] == CharacterRangeType.LeftToRight) {
                            isPrevLTRText = true;
                        } else if (characterRangeTypes[i] == CharacterRangeType.RightToLeft) {
                            isPrevLTRText = false;
                        }

                        continue;
                    } else if (characterRangeTypes[i] == CharacterRangeType.LeftToRight) {
                        this.updateCharacterRange(line, i, rtlStartIndex, lineElementsBidiValues, characterRangeTypes);
                        rtlStartIndex = characterRangeTypes[i] == CharacterRangeType.RightToLeft
                            || characterRangeTypes[i] == CharacterRangeType.Number && rtlStartIndex != -1 ? i : -1;
                    }
                }
                if (characterRangeTypes[i] == CharacterRangeType.LeftToRight) {
                    isPrevLTRText = true;
                } else if (characterRangeTypes[i] == CharacterRangeType.RightToLeft) {
                    isPrevLTRText = false;
                }
            }

            if (rtlStartIndex != -1 && rtlStartIndex < characterRangeTypes.length - 1) {
                this.updateCharacterRange(line, characterRangeTypes.length - 1, rtlStartIndex, lineElementsBidiValues, characterRangeTypes);
                rtlStartIndex = -1;
            }

            if (characterRangeTypes.length != line.children.length) {
                ////This exception is thrown to avoid, unhandled exception in RTL/LTR reordering logic.
                throw new Error("Splitted Widget count mismatch while reordering layouted child widgets of a line");
            }

            let reorderedWidgets: ElementBox[] = this.reorderElements(line, characterRangeTypes, lineElementsBidiValues, paraBidi);
            lineElementsBidiValues.length = 0;
            characterRangeTypes.length = 0;

            if (line.children.length > 0) {
                line.layoutedElements = reorderedWidgets;
                //elements.Clear();
                //line.children = reorderedWidgets;
                ////ReCalculate the height and baseline offset once again.
                //UpdateMaxElement();
            }
        }
        return paraBidi;
    }

    private isNumberNonReversingCharacter(element: ElementBox): boolean {
        if (element instanceof TextElementBox) {
            let textRange: TextElementBox = (element as TextElementBox);
            if (textRange.characterFormat.hasValueWithParent('localeIdBidi')) {
                //Only these 10 word split characters (‘/’,‘:’,‘.’,‘,’,‘،’,‘#’,‘$’,‘%’,‘+’,‘-’) are behaving as number non reversing character based on language identifier.
                let ch: number = textRange.text.charCodeAt(0);
                //(‘/’) character is behaves as number non reversing character for some specific language identifiers.
                if ((ch == 47 && !this.isNumberReverseLangForSlash(textRange.characterFormat.localeIdBidi))
                    //(‘#’,‘$’,‘%’,‘+’,‘-’) characters are behaving as number non reversing character for some specific language identifiers.
                    || ((ch == 35 || ch == 36 || ch == 37 || ch == 43 || ch == 45) && !this.isNumberReverseLangForOthers(textRange.characterFormat.localeIdBidi))
                    //(‘,’,‘.’,‘:’,‘،’) characters are behaving as number non reversing character for any language identifier.
                    || (ch == 44 || ch == 46 || ch == 58 || ch == 1548)) {
                    return true;
                }
            } else {
                return TextHelper.isNumberNonReversingCharacter(textRange.text, textRange.characterFormat.bidi);
            }
        }
        return false;
    }

    private isNumberReverseLangForSlash(lang: number): boolean {
        return (this.isNumberReverseLangForOthers(lang) || lang == 6145 || lang == 1164 || lang == 1125 ||
            lang == 1120 || lang == 1123 || lang == 1065 || lang == 2137 ||
            lang == 1114 || lang == 1119 || lang == 1152 || lang == 1056);
    }
    private isNumberReverseLangForOthers(lang: number): boolean {
        return (lang == 14337 || lang == 15361 || lang == 5121 || lang == 3073 || lang == 2049 ||
            lang == 11265 || lang == 13313 || lang == 12289 || lang == 4097 || lang == 8193 ||
            lang == 16385 || lang == 1025 || lang == 10241 || lang == 7169 || lang == 9217);
    }

    private isStartMarker(element: ElementBox): boolean {
        if (element instanceof CommentCharacterElementBox) {
            return element.commentType === 0;
        } else if (element instanceof BookmarkElementBox) {
            return element.bookmarkType === 0;
        } else if (element instanceof EditRangeStartElementBox) {
            return true;
        } else if (element instanceof ContentControl) {
            return element.type === 0;
        } else if (element instanceof FieldElementBox) {
            return element.fieldType === 0;
        }
        return false;
    }
    private isEndMarker(element: ElementBox): boolean {
        if (element instanceof CommentCharacterElementBox) {
            return element.commentType === 1;
        } else if (element instanceof BookmarkElementBox) {
            return element.bookmarkType === 1;
        } else if (element instanceof EditRangeStartElementBox) {
            return true;
        } else if (element instanceof ContentControl) {
            return element.type === 1;
        } else if (element instanceof FieldElementBox) {
            return element.fieldType === 1;
        }
        return false;
    }

    private getNextValidWidget(startIndex: number, layoutedWidgets: LineWidget): ElementBox {
        for (let i: number = startIndex; i < layoutedWidgets.children.length; i++) {
            let element: ElementBox = layoutedWidgets.children[i];
            if (element instanceof CommentCharacterElementBox
                || element instanceof BookmarkElementBox || element instanceof EditRangeStartElementBox
                || element instanceof EditRangeEndElementBox || element instanceof ContentControl
                || element instanceof FieldElementBox) {
                continue;
            } else {
                return element[i];
            }
        }
        return null;
    }

    private hasTextRangeBidi(line: LineWidget): boolean {
        for (let i: number = 0; i < line.children.length; i++) {
            let elementBox: ElementBox = line.children[i];
            if (elementBox instanceof TextElementBox) {
                let textRange: TextElementBox = elementBox as TextElementBox;
                if (textRange.characterFormat.bidi) {
                    return true;
                }
            }
        }
        return false;
    }

    private isContainsRTLText(line: LineWidget): boolean {
        let documentHelper: DocumentHelper = line.paragraph.bodyWidget.page.documentHelper;
        let textHelper: TextHelper = documentHelper.textHelper;
        let isContainsRTL: boolean = false;
        for (let i = 0; i < line.children.length; i++) {
            if (line.children[i] instanceof TextElementBox) {
                isContainsRTL = line.children[i].characterFormat.bidi || line.children[i].characterFormat.bidi == true
                    || textHelper.isRTLText((line.children[i] as TextElementBox).text);
                if (isContainsRTL)
                    break;
            }
        }

        return isContainsRTL;
    }

    private updateCharacterRange(line: LineWidget, i: number, rtlStartIndex: number, lineElementsBidiValues: boolean[], characterRangeTypes: CharacterRangeType[]) {
        let endIndex: number = i;
        if (!lineElementsBidiValues[i]) {
            if (characterRangeTypes[i] === CharacterRangeType.LeftToRight) {
                endIndex--;
            }

            for (let j: number = endIndex; j >= rtlStartIndex; j--) {
                if (characterRangeTypes[j] != CharacterRangeType.WordSplit) {
                    endIndex = j;
                    break;
                }
            }
        }

        for (let j: number = rtlStartIndex; j <= endIndex; j++) {
            if (characterRangeTypes[j] == CharacterRangeType.WordSplit) {
                characterRangeTypes[j] = CharacterRangeType.RightToLeft | CharacterRangeType.WordSplit;
                let previousIndex: number = j - 1;
                let nextIndex: number = j + 1;
                //// Handled a special behavior, When a EastAsia font is "Times New Roman" for text range.
                //// Group of word split character is exist in between a RTL characters, MS Word reverse a corresponding word split characters.
                //// So, that we have reverse the word split characters.
                if (previousIndex >= 0 && nextIndex < characterRangeTypes.length
                    && characterRangeTypes[previousIndex] == CharacterRangeType.RightToLeft
                    && (characterRangeTypes[nextIndex] == CharacterRangeType.RightToLeft || characterRangeTypes[nextIndex] == CharacterRangeType.Number)
                    && line.children[j] instanceof TextElementBox) {
                    let textRange: TextElementBox = line.children[j] as TextElementBox;
                    if (textRange.characterFormat.fontFamilyBidi == "Times New Roman") {
                        let charArray: string[] = textRange.text.split("");
                        let reverseArray: string[] = charArray.reverse();
                        let joinArray: string = reverseArray.join("");
                        textRange.text = joinArray;
                    }
                }
            }
        }
    }

    private reorderElements(line: LineWidget, characterRangeTypes: CharacterRangeType[], listElementsBidiValues: boolean[], paraBidi: boolean): ElementBox[] {
        let insertIndex: number = 0, lastItemIndexWithoutRTLFlag = -1, consecutiveRTLCount = 0, consecutiveNumberCount = 0;
        let reorderedElements: ElementBox[] = [];
        let prevCharType: CharacterRangeType = CharacterRangeType.LeftToRight;
        let prevBidi: boolean = false;
        for (let i = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i];
            let textElement = element as TextElementBox;
            textElement.characterRange = characterRangeTypes[i];

            let isRTLText: boolean = (textElement.characterRange & CharacterRangeType.RightToLeft) == CharacterRangeType.RightToLeft || textElement.characterRange == CharacterRangeType.Number;
            let isBidi: boolean = listElementsBidiValues[i];

            ////If tab-stop is exist with in the line then we have to consider the below behaviours
            if (characterRangeTypes[i] == CharacterRangeType.Tab) {
                if (paraBidi) {
                    ////When para bidi is true, reordering is performed until tab stop position and break the reordering and then again reordering is performed for the remaining contents which exist after the tab-stop. 
                    ////Assume if we have an tab stop in center of the line, then the reordering is performed until the tab stop position and stop and place a tab stop and starts reordering for the remaining contents. 
                    insertIndex = 0;
                    lastItemIndexWithoutRTLFlag = -1;
                    consecutiveRTLCount = 0;
                    prevCharType = CharacterRangeType.LeftToRight;
                    prevBidi = false;
                    reorderedElements.splice(insertIndex, 0, element);
                    continue;
                }
                else if (isBidi) {
                    ////If text range bidi is true for the tab stop widget, MS Word does not consider this tab-stop bidi as LTR Bidi and does not shift it as per our reordering. 
                    ////Instead its consider this widget as non-bidi LTR and do the reordering.
                    isBidi = false;
                }
            }
            if (i > 0 && prevBidi != isBidi) {
                if (paraBidi) {
                    ////If Bidi of paragraph is true, then start inserting widgets from first (index 0).
                    insertIndex = 0;
                    lastItemIndexWithoutRTLFlag = -1;
                    consecutiveRTLCount = 0;
                }
                else {
                    ////If Bidi of paragraph is false, then start inserting widgets from last (reorderedWidgets.Count).
                    lastItemIndexWithoutRTLFlag = reorderedElements.length - 1;
                }

                ////If Bidi for previous and next widget differs, we have to reset consecutive number to 0.
                consecutiveNumberCount = 0;
            }
            if (!isBidi && !isRTLText) {
                if (paraBidi) {
                    if (consecutiveRTLCount > 0 && prevBidi == isBidi) {
                        insertIndex += consecutiveRTLCount;
                    }
                    reorderedElements.splice(insertIndex, 0, element);
                    insertIndex++;
                } else {
                    reorderedElements.push(element);
                    insertIndex = i + 1;
                }
                consecutiveRTLCount = 0;
                lastItemIndexWithoutRTLFlag = paraBidi ? insertIndex - 1 : reorderedElements.length - 1;
            }
            else if (isRTLText || (isBidi && textElement.characterRange == CharacterRangeType.WordSplit
                && (prevCharType == CharacterRangeType.RightToLeft || this.isInsertWordSplitToLeft(characterRangeTypes, listElementsBidiValues, i)))) {
                consecutiveRTLCount++;
                insertIndex = lastItemIndexWithoutRTLFlag + 1;
                if (textElement.characterRange == CharacterRangeType.Number) {
                    if (prevCharType == CharacterRangeType.Number) {
                        ////Moves the insertIndex to the right after the previous consecutive number.
                        insertIndex += consecutiveNumberCount;
                    }

                    ////Increments consecutive number counter, to decide how much position the next number text range (widget) has to be moved and inserted towards right of insertIndex.
                    consecutiveNumberCount++;
                }

                reorderedElements.splice(insertIndex, 0, element);
            }
            else {
                reorderedElements.splice(insertIndex, 0, element);
                insertIndex++;
                consecutiveRTLCount = 0;
            }

            if (textElement.characterRange != CharacterRangeType.Number) {
                ////Resets the consecutive number counter when character range is not a number.
                consecutiveNumberCount = 0;
            }

            if (textElement.characterRange != CharacterRangeType.WordSplit) {
                ////Note: Handled to set only CharacterRangeType.RightToLeft and CharacterRangeType.LeftToRight
                ////For CharacterRangeType.WordSplit | CharacterRangeType.RightToLeft case, the IsInsertWordSplitToLeft method will return true.
                prevCharType = textElement.characterRange;
            }

            prevBidi = isBidi;
        }
        return reorderedElements;
    }

    private isInsertWordSplitToLeft(characterRangeTypes: CharacterRangeType[], lineElementsBidiValues: boolean[], elementIndex: number): boolean {
        for (let i: number = elementIndex + 1; i < characterRangeTypes.length; i++) {
            if ((characterRangeTypes[i] & CharacterRangeType.RightToLeft) == CharacterRangeType.RightToLeft) {
                return true;
            } else if (characterRangeTypes[i] == CharacterRangeType.LeftToRight) {
                if (lineElementsBidiValues[i]) {
                    return false;
                } else {
                    ////If bidi is true for previous LTR and bidi is false for next LTR, then insert Word split to before previous inserted widget.
                    return true;
                }
            }
        }
        return true;
    }

    private shiftLayoutFloatingItems(paragraph: ParagraphWidget): void {
        for (let i: number = 0; i < (paragraph as ParagraphWidget).floatingElements.length; i++) {
            let element: ShapeBase = (paragraph as ParagraphWidget).floatingElements[i];
            let position: Point = this.getFloatingItemPoints(element);
            let height: number = position.y - element.y;
            element.x = position.x;
            element.y = position.y;
            if (element instanceof ShapeElementBox) {
                for (let j: number = 0; j < element.textFrame.childWidgets.length; j++) {
                    let block: BlockWidget = element.textFrame.childWidgets[j] as BlockWidget;
                    if (block instanceof ParagraphWidget) {
                        block.y = block.y + height;
                    } else if (block instanceof TableWidget) {
                        this.shiftChildLocationForTableWidget(block, height);
                    }
                }
            }
        }
    }
    //RTL feature layout end
    private getFloatingItemPoints(floatElement: ShapeBase): Point {
        let paragraph: ParagraphWidget = floatElement.line.paragraph;
        let sectionFormat: WSectionFormat = paragraph.bodyWidget.sectionFormat;
        let indentX: number = 0;
        let indentY: number = 0;
        if (paragraph) {
            let leftMargin: number = HelperMethods.convertPointToPixel(sectionFormat.leftMargin);
            let rightMargin: number = HelperMethods.convertPointToPixel(sectionFormat.rightMargin);
            let topMargin: number = HelperMethods.convertPointToPixel(sectionFormat.topMargin);
            let bottomMargin: number = sectionFormat.bottomMargin > 0 ? HelperMethods.convertPointToPixel(sectionFormat.bottomMargin) : 48;
            let headerDistance: number = HelperMethods.convertPointToPixel(sectionFormat.headerDistance);
            let footerDistance: number = HelperMethods.convertPointToPixel(sectionFormat.footerDistance);
            let pageWidth: number = HelperMethods.convertPointToPixel(sectionFormat.pageWidth);
            let pageHeight: number = HelperMethods.convertPointToPixel(sectionFormat.pageHeight);
            let pageClientWidth: number = pageWidth - (leftMargin + rightMargin);
            let pageClientHeight: number = pageHeight - topMargin - bottomMargin;
            //Need to consider RTL layout.
            if (paragraph.isInHeaderFooter && sectionFormat.topMargin <= 0) {
                topMargin = Math.abs(topMargin) > 0 ? Math.abs(topMargin)
                    : HelperMethods.convertPointToPixel(sectionFormat.headerDistance) + (paragraph.height);
            } else {
                topMargin = topMargin > 0 ? topMargin : 48;
            }
            //Update the top margin as text body y position when text body y position exceeds the top margin. 
            if (!paragraph.isInHeaderFooter && topMargin < this.viewer.clientArea.y) {
                topMargin = this.viewer.clientArea.y;
            }
            let mIsYPositionUpdated: boolean = false;
            let textWrapStyle: TextWrappingStyle = 'InFrontOfText';
            //if (textWrapStyle !== 'Inline') {
            let isLayoutInCell: boolean = false;
            let vertOrigin: VerticalOrigin = floatElement.verticalOrigin;
            let horzOrigin: HorizontalOrigin = floatElement.horizontalOrigin;
            let horzAlignment: HorizontalAlignment = floatElement.horizontalAlignment;
            let vertAlignment: VerticalAlignment = floatElement.verticalAlignment;
            let verticalPercent: number = floatElement.verticalRelativePercent;
            let horizontalPercent: number = floatElement.horizontalRelativePercent;
            let shapeHeight: number = floatElement.height;
            //Need to update size width for Horizontal Line when width exceeds client width.
            // if(shape !== null && shape.IsHorizontalRule && size.Width > m_layoutArea.ClientActiveArea.Width)
            //     size.Width = m_layoutArea.ClientActiveArea.Width;
            let shapeWidth: number = floatElement.width;
            let vertPosition: number = floatElement.verticalPosition;
            let horzPosition: number = floatElement.horizontalPosition;
            let layoutInCell: boolean = floatElement.layoutInCell;
            let heightPercent: number = floatElement.heightRelativePercent;
            let widthPercent:number = floatElement.widthRelativePercent;
            let autoShape: any;
            if (floatElement instanceof ShapeElementBox) {
                autoShape = floatElement.autoShapeType;
            }
            //Word 2013 Layout picture in table cell even layoutInCell property was False.
            if (paragraph.isInsideTable && layoutInCell) {
                isLayoutInCell = true;
                indentY = this.getVerticalPosition(floatElement, vertPosition, vertOrigin, textWrapStyle);
                indentX = this.getHorizontalPosition(floatElement.width, floatElement, horzAlignment, horzOrigin, horzPosition, textWrapStyle, paragraph.associatedCell.cellFormat.cellWidth);
            } else {
                if (this.documentHelper.viewer instanceof WebLayoutViewer) {
                    switch (vertOrigin) {
                        case 'Line':
                            indentY = this.documentHelper.selection.getTop(floatElement.line);
                            break;
                        default:
                            indentY = this.viewer.clientActiveArea.y;
                            break;
                    }
                    switch (horzOrigin) {
                        case 'Character':
                            indentX = this.viewer.clientActiveArea.x;
                            break;
                        default:
                            switch (horzAlignment) {
                                case 'Center':
                                    indentX = (this.viewer.clientArea.width / 2) - (floatElement.width / 2);
                                    break;
                                default:
                                    indentX = this.viewer.clientArea.x;
                                    break;
                            }
                            break;
                    }
                }
                else {
                    if (mIsYPositionUpdated) { /* Upadte the Y Coordinate of floating image when floating image postion is changed based on the wrapping style. */
                        indentY = this.viewer.clientArea.y;
                    } else {
                        switch (vertOrigin) {
                            case 'Page':
                            case 'TopMargin':
                                indentY = vertPosition;
                                switch (vertAlignment) {
                                    case 'Top':
                                        indentY = vertPosition;
                                        break;
                                    case 'Center':
                                        if (vertOrigin === 'TopMargin') {
                                            indentY = (topMargin - shapeHeight) / 2;
                                        } else {
                                            if (heightPercent > 0 && widthPercent > 0) {
                                                indentY = (pageHeight - (pageHeight) * (heightPercent / 100)) / 2;
                                                floatElement.height = (pageHeight) * (heightPercent / 100);
                                            } else {
                                                indentY = (pageHeight - shapeHeight) / 2;
                                            }
                                        }
                                        break;
                                    case 'Outside':
                                    case 'Bottom':
                                        if (vertOrigin === 'Page' && vertAlignment === 'Bottom') {
                                            indentY = pageHeight - shapeHeight;
                                        } else {
                                            if (vertOrigin === 'TopMargin') {
                                                indentY = (topMargin - shapeHeight);
                                            } else if ((paragraph.bodyWidget.page.index + 1) % 2 !== 0) {
                                                indentY = pageHeight - shapeHeight - footerDistance / 2;
                                            } else {
                                                indentY = headerDistance / 2;
                                            }
                                        }
                                        break;
                                    case 'Inside':
                                        if (vertOrigin === 'Page') {
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentY = pageHeight - shapeHeight - footerDistance / 2;
                                            } else {
                                                indentY = headerDistance / 2;
                                            }
                                        } else {
                                            //Need to ensure this behaviour.
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentY = ((topMargin - shapeHeight) / 2 - headerDistance);
                                            }
                                        }
                                        break;
                                    case 'None':
                                        if (Math.abs(verticalPercent) <= 1000) {
                                            indentY = pageHeight * (verticalPercent / 100);
                                        } else {
                                            indentY = vertPosition;
                                        }
                                        break;
                                }
                                break;
                            case 'Line':
                                indentY = vertPosition;
                                switch (vertAlignment) {
                                    case 'Inside':
                                    case 'Top':
                                        //Need to update line widget height instead of client active area.
                                        indentY = this.viewer.clientActiveArea.y;
                                        break;
                                    case 'Center':
                                        indentY = this.viewer.clientActiveArea.y - shapeHeight / 2;
                                        break;
                                    case 'Outside':
                                    case 'Bottom':
                                        indentY = this.viewer.clientActiveArea.y - shapeHeight;
                                        break;
                                    case 'None':
                                        indentY = Math.round(paragraph.y) + vertPosition;
                                        break;
                                }
                                break;
                            case 'BottomMargin':
                                indentY = vertPosition;
                                switch (vertAlignment) {
                                    case 'Inside':
                                    case 'Top':
                                        indentY = (pageHeight - bottomMargin);
                                        break;
                                    case 'Center':
                                        indentY = pageHeight - bottomMargin + ((bottomMargin - shapeHeight) / 2);
                                        break;
                                    case 'Outside':
                                    case 'Bottom':
                                        if (paragraph.bodyWidget.page.index + 1 % 2 !== 0 && vertAlignment === 'Outside') {
                                            indentY = pageHeight - bottomMargin;
                                        } else {
                                            indentY = pageHeight - shapeHeight;
                                        }
                                        break;
                                    case 'None':
                                        indentY = pageHeight - bottomMargin + vertPosition;
                                        break;
                                }
                                break;
                            case 'InsideMargin':
                            case 'OutsideMargin':
                                indentY = vertPosition;
                                switch (vertAlignment) {
                                    case 'Inside':
                                        if (vertOrigin === 'InsideMargin') {
                                            if (vertOrigin === 'InsideMargin' && paragraph.bodyWidget.page.index + 1 % 2 === 0) {
                                                indentY = pageHeight - shapeHeight;
                                            } else {
                                                indentY = 0;
                                            }
                                        } else {
                                            indentY = (paragraph.bodyWidget.page.index + 1) % 2 !== 0 ? pageHeight - bottomMargin : topMargin - shapeHeight;
                                        }
                                        break;
                                    case 'Top':
                                        if (vertOrigin === 'InsideMargin') {
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentY = pageHeight - bottomMargin;
                                            } else {
                                                indentY = 0;
                                            }
                                        } else {
                                            indentY = (paragraph.bodyWidget.page.index + 1) % 2 !== 0 ? pageHeight - bottomMargin : 0;
                                        }
                                        break;
                                    case 'Center':
                                        if (vertOrigin === 'OutsideMargin') {
                                            //Need to ensure this.
                                            indentY = (paragraph.bodyWidget.page.index + 1) % 2 !== 0 ? pageHeight - bottomMargin + (bottomMargin - shapeHeight) / 2 : (topMargin - shapeHeight) / 2;
                                        } else {
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentY = pageHeight - bottomMargin + (bottomMargin - shapeHeight) / 2;
                                            } else {
                                                indentY = (topMargin - shapeHeight) / 2;
                                            }
                                        }
                                        break;
                                    case 'Outside':
                                        if (vertOrigin === 'InsideMargin') {
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentY = (pageHeight - bottomMargin);
                                            } else {
                                                indentY = (topMargin - shapeHeight);
                                            }
                                        } else {
                                            indentY = (paragraph.bodyWidget.page.index + 1) % 2 !== 0 ? topMargin - shapeHeight : pageHeight - bottomMargin;
                                        }
                                        break;
                                    case 'Bottom':
                                        if (vertOrigin === 'OutsideMargin') {
                                            indentY = (paragraph.bodyWidget.page.index + 1) !== 0 ? pageHeight - shapeHeight : topMargin - shapeHeight;
                                        } else {
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentY = pageHeight - shapeHeight;
                                            } else {
                                                indentY = topMargin - shapeHeight;
                                            }
                                        }
                                        break;
                                    case 'None':
                                        break;
                                }
                                break;
                            case 'Paragraph':
                                const space: number = 0;
                                //let prevsibling: BlockWidget = paragraph.previousWidget as BlockWidget;
                                // if (floatElement) {
                                //     //Need to handle DocIO Implementation.
                                //     if (Math.round(paragraph.y) !== Math.round(topMargin) && (prevsibling instanceof ParagraphWidget)
                                //         && ((paragraph.paragraphFormat.beforeSpacing > prevsibling.paragraphFormat.afterSpacing)
                                //             || (prevsibling.paragraphFormat.afterSpacing < 14)
                                //             && !paragraph.paragraphFormat.contextualSpacing)) {
                                //         space = prevsibling.paragraphFormat.afterSpacing;
                                //     }
                                // }

                                // eslint-disable-next-line max-len
                                //Floating item Y position is calculated from paragraph original Y position not from wrapped paragraph Y(ParagraphLayoutInfo.YPosition) position.
                                indentY = Math.round(paragraph.y) + space + vertPosition;
                                break;
                            case 'Margin':
                                //If header distance is more than top margin, then calculate the position of item based on header distance.
                                //As per Microsoft Word behavior, it is need to consider paragraph height along with the distance.
                                if (paragraph.isInHeaderFooter && headerDistance > topMargin) {
                                    //Need to udpate.
                                    indentY = (headerDistance + (paragraph.height)) + vertPosition;
                                } else {
                                    indentY = topMargin + vertPosition;
                                }
                                switch (vertAlignment) {
                                    case 'Top':
                                        indentY = topMargin;
                                        break;
                                    case 'Center':
                                        indentY = topMargin + (pageClientHeight - shapeHeight) / 2;
                                        break;
                                    case 'Outside':
                                    case 'Bottom':
                                        if ((paragraph.bodyWidget.page.index + 1) % 2 !== 0) {
                                            indentY = topMargin + pageClientHeight - shapeHeight;
                                        } else {
                                            indentY = topMargin;
                                        }
                                        break;
                                    case 'Inside':
                                        if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                            indentY = topMargin + pageClientHeight - shapeHeight;
                                        } else {
                                            indentY = topMargin;
                                        }
                                        break;
                                    case 'None':
                                        break;
                                }
                                break;
                            default:
                                //Need to analyze further.
                                indentY = this.viewer.clientArea.y - vertPosition;
                                break;
                        }
                    }
                    // if (horzOrigin !== 'Column' && horzAlignment !== 'None') {
                    //     indentX = this.viewer.clientArea.x;
                    //     //Update the floating item x position to zero when floating item’s width
                    //     //exceeds the page width when floating item and it wrapping style is not equal to  
                    //     // infront of text and behind text and also vertical origin is not equal to paragraph.
                    // } else 
                    if (paragraph && textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'Behind' &&
                        vertOrigin === 'Paragraph' && shapeWidth >= pageWidth) {
                        indentX = 0;
                    } else {
                        switch (horzOrigin) {
                            case 'Page':
                                indentX = horzPosition;
                                switch (horzAlignment) {
                                    case 'Center':
                                        if (isLayoutInCell) {
                                            indentX = (paragraph.associatedCell.cellFormat.cellWidth - shapeWidth) / 2;
                                        } else {
                                            if (heightPercent > 0 && widthPercent > 0) {
                                                indentX = (pageWidth - (pageWidth) * (widthPercent / 100)) / 2;
                                                floatElement.width = (pageWidth) * (widthPercent / 100);
                                            } else {
                                                indentX = (pageWidth - shapeWidth) / 2;
                                            }
                                        }
                                        break;
                                    case 'Left':
                                        indentX = 0;
                                        break;
                                    case 'Outside':
                                    case 'Right':
                                        if (isLayoutInCell) {
                                            indentX = paragraph.associatedCell.cellFormat.cellWidth - shapeWidth;
                                        } else {
                                            indentX = pageWidth - shapeWidth;
                                        }
                                        break;
                                    case 'None':
                                        if (isLayoutInCell) {
                                            indentX = paragraph.associatedCell.x + horzPosition;
                                        } else if (floatElement instanceof ShapeElementBox) {
                                            indentX = horzPosition;
                                            // Shape pItemShape = paraItem as Shape;
                                            // float horRelPercent = pItemShape !== null ? pItemShape.TextFrame.HorizontalRelativePercent
                                            //                       : (paraItem as WTextBox).TextBoxFormat.HorizontalRelativePercent;
                                            // if (Math.Abs(horRelPercent) <= 1000)
                                            //     indentX = pageWidth * (horRelPercent / 100);
                                            // else
                                            //     indentX = pItemShape !== null ? pItemShape.HorizontalPosition
                                            //         : (paraItem as WTextBox).TextBoxFormat.HorizontalPosition;
                                        } else {
                                            indentX = horzPosition;
                                        }
                                        break;
                                }
                                if (indentX < 0 && isLayoutInCell) {
                                    indentX = paragraph.associatedCell.x;
                                }
                                break;
                            case 'Column':
                                let isXPositionUpated : boolean = false;
                                //Update the Xposition while wrapping element exsit in the paragraph
                                if (this.viewer.clientActiveArea.x < paragraph.x) {
                                    // let cellPadings = 0;
                                    // if (paragraph.isInsideTable) {
                                    //     CellLayoutInfo cellLayoutInfo = (ownerPara.GetOwnerEntity() as IWidget).LayoutInfo as CellLayoutInfo;
                                    //     cellPadings = cellLayoutInfo.Paddings.Left + cellLayoutInfo.Paddings.Right;
                                    // }
                                    // float minimumWidthRequired = DEF_MIN_WIDTH_SQUARE;
                                    // if (textWrapStyle === TextWrappingStyle.Tight || textWrapStyle === TextWrappingStyle.Through)
                                    //     minimumWidthRequired = ownerPara.Document.Settings.CompatibilityMode === CompatibilityMode.Word2013 ?
                                    //         DEF_MIN_WIDTH_2013_TIGHTANDTHROW : DEF_MIN_WIDTH_TIGHTANDTHROW;
                                    // minimumWidthRequired -= cellPadings;
                                    // //Re Update the x position to the page left when paragraph starting position not equal to the 
                                    // //column starting and current inline item is x position equal to the column left position.
                                    // if ((ownerPara.IsXpositionUpated && ownerPara.Document.Settings.CompatibilityMode === CompatibilityMode.Word2013)
                                    //     || paragraphLayoutInfo.XPosition > (pageWidth - minimumWidthRequired - rightMargin)
                                    //     || paragraphLayoutInfo.IsXPositionReUpdate)
                                    //     indentX = layouter.ClientLayoutArea.Left + horzPosition;
                                    // else
                                    indentX = paragraph.x + horzPosition;
                                } else {
                                    //Re Update the x position to the page left when word version not equal to 2013 
                                    //and wrapping style not equal to infront of text and behind text. 
                                    if ((textWrapStyle === 'InFrontOfText' || textWrapStyle === 'Behind')) {
                                        if (!(floatElement.paragraph.isInsideTable) && ((autoShape === 'StraightConnector' || autoShape === 'Rectangle') || floatElement instanceof ImageElementBox)) {
                                            isXPositionUpated = true;
                                            indentX = horzPosition + paragraph.bodyWidget.x;
                                        } else {
                                            indentX = paragraph.x + horzPosition;
                                        }
                                    } else {
                                        indentX = this.viewer.clientActiveArea.x + horzPosition;
                                    }
                                }
                                //Update the Wrapping element right position as page right when 
                                //wrapping element right position  exceeds the page right except position 
                                //InFrontOfText and behindText wrapping style.
                                if (textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'Behind'
                                    && Math.round(indentX + shapeWidth) > Math.round(pageWidth) && shapeWidth < pageWidth) {
                                    indentX = (pageWidth - shapeWidth);
                                }
                                if (paragraph.paragraphFormat.leftIndent && !isXPositionUpated){
                                    let leftIndent = HelperMethods.convertPointToPixel(paragraph.leftIndent);
                                    indentX-=leftIndent;
                                }
                                switch (horzAlignment) {
                                    case 'Center':
                                        indentX = this.viewer.clientActiveArea.x + (this.viewer.clientActiveArea.width - shapeWidth) / 2;
                                        break;
                                    case 'Left':
                                        indentX = this.viewer.clientActiveArea.x;
                                        break;
                                    case 'Right':
                                        indentX = this.viewer.clientActiveArea.x + this.viewer.clientActiveArea.width - shapeWidth; //- TextBoxFormat.InternalMargin.Right;
                                        break;
                                    case 'None':
                                        break;
                                }
                                break;
                            case 'Margin':
                                if (paragraph.bodyWidget) {
                                    indentX = leftMargin + horzPosition;
                                    switch (horzAlignment) {
                                        case 'Center':
                                            indentX = leftMargin + (pageClientWidth - shapeWidth) / 2;
                                            break;
                                        case 'Left':
                                            indentX = leftMargin;
                                            break;
                                        case 'Outside':
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 !== 0) {
                                                indentX = leftMargin + pageClientWidth - shapeWidth;
                                            }
                                            break;
                                        case 'Right':
                                            indentX = leftMargin + pageClientWidth - shapeWidth;
                                            break;
                                        case 'Inside':
                                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                                indentX = leftMargin + pageClientWidth - shapeWidth;
                                            }
                                            break;
                                        case 'None':
                                            break;
                                    }
                                } else {
                                    indentX = this.viewer.clientArea.x + horzPosition;
                                }
                                break;
                            case 'Character':
                                if (horzAlignment === 'Right' || horzAlignment === 'Center') {
                                    indentX = this.getLeftMarginHorizPosition(leftMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                } else {
                                    //Need to update this while layouting.**
                                    indentX = this.viewer.clientArea.x + horzPosition;
                                }
                                break;
                            case 'LeftMargin':
                                indentX = this.getLeftMarginHorizPosition(leftMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                break;
                            case 'RightMargin':
                                indentX = this.getRightMarginHorizPosition(pageWidth, rightMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                break;
                            case 'InsideMargin':
                                if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                    indentX = this.getRightMarginHorizPosition(pageWidth, rightMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                } else {
                                    indentX = this.getLeftMarginHorizPosition(leftMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                }
                                break;
                            case 'OutsideMargin':
                                if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                    indentX = this.getLeftMarginHorizPosition(leftMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                } else {
                                    indentX = this.getRightMarginHorizPosition(pageWidth, rightMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                                }
                                break;
                            default:
                                indentX = this.viewer.clientArea.x + horzPosition;
                                break;
                        }
                    }

                    //Update the floating item right position to the page right when floating item 
                    //right position exceeds the page width and it wrapping style is not equal to  
                    // InFrontOfText and behind text and also vertical origin is not equal to paragraph.
                    if (paragraph && textWrapStyle !== 'InFrontOfText'
                        && textWrapStyle !== 'Behind' && vertOrigin === 'Paragraph' && pageWidth < indentX + shapeWidth) {
                        indentX = pageWidth - shapeWidth;
                    }
                }
            }
            if(paragraph && (vertOrigin === 'Paragraph' || vertOrigin === 'Line') && floatElement.textWrappingStyle !== "InFrontOfText" && floatElement.textWrappingStyle !== "Behind") {
                if(this.documentHelper.compatibilityMode === 'Word2013') {
                    if (!paragraph.isInHeaderFooter) {
                        if (indentY + floatElement.height > this.viewer.clientArea.bottom) {
                            indentY = this.viewer.clientArea.bottom - floatElement.height;
                        }
                        if (indentY < sectionFormat.topMargin) {
                            indentY = sectionFormat.topMargin;
                        }
                    }
                }
            }
        }
        //}

        return new Point(indentX, indentY);
    }
    private getLeftMarginHorizPosition(leftMargin: number, horzAlignment: HorizontalAlignment, horzPosition: number, shapeWidth: number, textWrapStyle: TextWrappingStyle): number {
        let indentX: number = horzPosition;
        switch (horzAlignment) {
            case 'Center':
                indentX = (leftMargin - shapeWidth) / 2;
                break;
            case 'Left':
                indentX = 0;
                break;
            case 'Right':
                indentX = leftMargin - shapeWidth;
                break;
            case 'None':
                break;
        }
        if (indentX < 0 && textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'Behind') {
            indentX = 0;
        }
        return indentX;
    }
    private getRightMarginHorizPosition(pageWidth: number, rightMargin: number, horzAlignment: HorizontalAlignment, horzPosition: number, shapeWidth: number, textWrapStyle: TextWrappingStyle): number {
        let xPosition: number = pageWidth - rightMargin;
        let indentX: number = xPosition + horzPosition;
        switch (horzAlignment) {
            case 'Center':
                indentX = xPosition + (rightMargin - shapeWidth) / 2;
                break;
            case 'Left':
                indentX = xPosition;
                break;
            case 'Right':
                indentX = pageWidth - shapeWidth;
                break;
            case 'None':
                break;
        }
        if ((indentX < 0 || indentX + shapeWidth > pageWidth) && textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'Behind') {
            indentX = pageWidth - shapeWidth;
        }
        return indentX;
    }
    private getVerticalPosition(paraItem: ElementBox, vertPosition: number, vertOrigin: VerticalOrigin, textWrapStyle: TextWrappingStyle): number {
        let paragraph: ParagraphWidget = paraItem.line.paragraph;
        //ParagraphLayoutInfo paragraphLayoutInfo = (paragraph as IWidget).LayoutInfo as ParagraphLayoutInfo;
        let shape: ShapeBase = paraItem as ShapeBase;
        //WPicture pic = paraItem as WPicture;
        let indentY: number = 0;
        let topMargin: number = paragraph.associatedCell.y;
        switch (vertOrigin) {
            case 'Page':
            case 'Margin':
            case 'TopMargin':
            case 'InsideMargin':
            case 'BottomMargin':
            case 'OutsideMargin':
                indentY = topMargin + vertPosition;
                break;
            case 'Line':
            case 'Paragraph':
                let space: number = 0;
                // if (shape) {
                //     space = paragraph.paragraphFormat.afterSpacing;
                // }
                indentY = paragraph.y + vertPosition + space;
                if (shape.textWrappingStyle == "Square") {
                    indentY = indentY <= paragraph.associatedCell.y ? paragraph.associatedCell.y : indentY;
                }
                break;
            default:
                indentY = this.viewer.clientActiveArea.y + vertPosition;
                break;
        }
        return indentY;
    }

    private getHorizontalPosition(width: number, paraItem: ElementBox, horzAlignment: HorizontalAlignment, horzOrigin: HorizontalOrigin, horzPosition: number, textWrapStyle: TextWrappingStyle, cellWid: number): number {
        let indentX: number = 0;
        let paragraph: ParagraphWidget = paraItem.line.paragraph;
        // CellLayoutInfo cellLayoutInfo = (paragraph.OwnerTextBody as IWidget).LayoutInfo as CellLayoutInfo;
        // ILayoutSpacingsInfo spacings = cellLayoutInfo as ILayoutSpacingsInfo;
        let cell: TableCellWidget = paragraph.associatedCell;
        let cellWidth: number = cellWid - cell.leftMargin - cell.rightMargin;
        let cellInnerWidth: number = cell.cellFormat.cellWidth;
        let marginLeft: number = cell.x;
        let pageLeft: number = marginLeft - cell.leftMargin;
        switch (horzOrigin) {
            case 'Page':
                {
                    indentX = horzPosition;
                    switch (horzAlignment) {
                        case 'Center':
                            indentX = pageLeft + (cellWidth - width) / 2;
                            break;
                        case 'Left':
                            indentX = pageLeft;
                            break;
                        case 'Right':
                            indentX = pageLeft + (cellWidth - width);
                            break;
                        case 'None':
                            indentX = pageLeft + horzPosition;
                            break;
                    }
                }
                break;
            case 'Column':
            case 'Margin':
                {
                    switch (horzAlignment) {
                        case 'Center':
                            indentX = marginLeft + (cellInnerWidth - width) / 2;
                            break;
                        case 'Left':
                            indentX = marginLeft;
                            break;
                        case 'Right':
                            indentX = marginLeft + (cellInnerWidth - width);
                            break;
                        case 'None':
                            indentX = marginLeft + horzPosition;
                            break;
                    }
                }
                break;
            default:
                {
                    indentX = marginLeft + horzPosition;
                }
                break;
        }
        return indentX;
    }
    private updateTableFloatPoints(table: TableWidget): void {
        if (table.wrapTextAround) {
            let tableTotalWidth: number = table.getTableCellWidth();
            let position: TablePosition = table.positioning;
            let sectionFormat: WSectionFormat = table.bodyWidget.sectionFormat;
            if (this.documentHelper.viewer instanceof WebLayoutViewer) {
                if (position.horizontalOrigin === 'Margin' || position.horizontalOrigin === 'Page' || position.horizontalOrigin === 'Column') {
                    if (position.horizontalAlignment === 'Right' || position.horizontalAlignment === 'Outside') {
                        this.viewer.clientActiveArea.x = this.viewer.clientArea.width - tableTotalWidth;
                    } else {
                        this.viewer.clientActiveArea.x = this.viewer.clientArea.x;
                    }
                }
            } else {
                if (!(table.containerWidget instanceof TextFrame) && !table.isInsideTable) {
                    // Vertical position
                    if (position.verticalOrigin === 'Page') {
                        if (position.verticalAlignment === 'Top') {
                            this.viewer.clientActiveArea.y = 0;
                        } else if (position.verticalAlignment === 'Inside') {
                            this.viewer.clientActiveArea.y = 0;
                        } else if (isNullOrUndefined(position.verticalAlignment) || position.verticalAlignment === 'None') {
                            this.viewer.clientActiveArea.y = HelperMethods.convertPointToPixel(position.verticalPosition);
                        }
                    } else if (position.verticalOrigin === 'Margin') {
                        if (position.verticalAlignment === 'Top') {
                            this.viewer.clientActiveArea.y = HelperMethods.convertPointToPixel(sectionFormat.topMargin);
                        } else if (position.verticalAlignment === 'Inside') {
                            this.viewer.clientActiveArea.y = HelperMethods.convertPointToPixel(sectionFormat.topMargin);
                        } else if (Math.round(position.verticalPosition) != 0 && !isNullOrUndefined(sectionFormat.topMargin)) {
                            this.viewer.clientActiveArea.y = HelperMethods.convertPointToPixel(sectionFormat.topMargin + position.verticalPosition); 
                        } else {
                            this.viewer.clientActiveArea.y = HelperMethods.convertPointToPixel(position.verticalPosition);
                        }
                    } else if (position.verticalOrigin === 'Paragraph') {
                        if (isNullOrUndefined(position.verticalAlignment) || position.verticalAlignment === 'None') {
                            this.viewer.clientActiveArea.y += HelperMethods.convertPointToPixel(position.verticalPosition);
                        }
                    }

                    if (position.horizontalOrigin === 'Page') {
                        if (position.horizontalAlignment === 'Left') {
                            this.viewer.clientActiveArea.x = 0;
                        } else if (position.horizontalAlignment === 'Inside') {
                            // TODO
                            this.viewer.clientActiveArea.x = 0;
                        } else if (position.horizontalAlignment === 'Right') {
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.pageWidth) - tableTotalWidth;
                        } else if (position.horizontalAlignment === 'Outside') {
                            // TODO
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.pageWidth) - tableTotalWidth;
                        } else if (position.horizontalAlignment === 'Center') {
                            this.viewer.clientActiveArea.x = (HelperMethods.convertPointToPixel(sectionFormat.pageWidth) - tableTotalWidth) / 2;
                        }
                    } else if (position.horizontalOrigin === 'Margin' || position.horizontalOrigin === 'Column') {
                        if (position.horizontalAlignment === 'Left') {
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.leftMargin);
                            if (this.documentHelper.compatibilityMode !== 'Word2013' && !table.isInsideTable) {
                                this.viewer.clientActiveArea.x = this.viewer.clientActiveArea.x -
                                    HelperMethods.convertPointToPixel(((table.firstChild as TableRowWidget).firstChild as TableCellWidget).leftMargin);
                            }
                        } else if (position.horizontalAlignment === 'Inside') {
                            // TODO
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.leftMargin);
                        } else if (position.horizontalAlignment === 'Right') {
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.pageWidth)
                                - (HelperMethods.convertPointToPixel(sectionFormat.rightMargin) + tableTotalWidth);
                        } else if (position.horizontalAlignment === 'Outside') {
                            // TODO
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.pageWidth)
                                - (HelperMethods.convertPointToPixel(sectionFormat.rightMargin) + tableTotalWidth);
                        } else if (position.horizontalAlignment === 'Center') {
                            this.viewer.clientActiveArea.x = HelperMethods.convertPointToPixel(sectionFormat.leftMargin) 
                                + (HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.rightMargin - sectionFormat.leftMargin) - tableTotalWidth) / 2;
                        }
                    }

                    if (Math.round(position.horizontalPosition) > 0 || (position.horizontalOrigin === 'Margin' && position.horizontalAlignment === 'Left')) {
                        this.viewer.clientActiveArea.x += HelperMethods.convertPointToPixel(position.horizontalPosition);
                    }
                } else if (table.isInsideTable) {
                    let ownerCell: TableCellWidget = table.containerWidget as TableCellWidget;
                    let cellFormat: WCellFormat = ownerCell.cellFormat;

                    if (position.verticalOrigin === 'Page') {
                        this.viewer.clientActiveArea.y = ownerCell.y;
                        this.viewer.clientActiveArea.y += HelperMethods.convertPointToPixel(position.verticalPosition);
                    } else if (position.verticalOrigin === 'Margin') {
                        this.viewer.clientActiveArea.y += HelperMethods.convertPointToPixel(position.verticalPosition);
                        //Check whether the absolute table vertical position is top relative to the margin
                        if (this.viewer.clientActiveArea.y < ownerCell.y || position.verticalAlignment === 'Top') {
                            this.viewer.clientActiveArea.y = ownerCell.y;
                        }
                    } else {
                        if (this.viewer.clientActiveArea.y + HelperMethods.convertPointToPixel(position.verticalPosition) < ownerCell.y) {
                            this.viewer.clientActiveArea.y = ownerCell.y;
                        } else {
                            this.viewer.clientActiveArea.y += HelperMethods.convertPointToPixel(position.verticalPosition);
                        }
                    }

                    if (position.horizontalOrigin === 'Page') {
                        if (position.horizontalAlignment === 'Left' || position.horizontalAlignment === 'Inside') {
                            this.viewer.clientActiveArea.x = ownerCell.x;
                        } else if (position.horizontalAlignment === 'Right' || position.horizontalAlignment === 'Outside') {
                            this.viewer.clientActiveArea.x = ((ownerCell.x + cellFormat.preferredWidth) - tableTotalWidth);
                        }
                    } else if (position.horizontalOrigin === 'Margin' || position.horizontalOrigin === 'Column') {
                        if (position.horizontalAlignment === 'Left' || position.horizontalAlignment === 'Inside') {
                            this.viewer.clientActiveArea.x = (ownerCell.x + ownerCell.leftMargin);
                        } else if (position.horizontalAlignment === 'Right' || position.horizontalAlignment === 'Outside') {
                            this.viewer.clientActiveArea.x = ((ownerCell.x + cellFormat.preferredWidth)
                                - (tableTotalWidth + ownerCell.rightMargin));
                        }
                    }

                    if (Math.round(position.horizontalPosition) > 0) {
                        this.viewer.clientActiveArea.x = ownerCell.x;
                        if (position.horizontalOrigin === 'Margin') {
                            this.viewer.clientActiveArea.x += ownerCell.leftMargin;
                        }
                        this.viewer.clientActiveArea.x += HelperMethods.convertPointToPixel(position.horizontalPosition);
                    }
                    if (position.horizontalAlignment === 'Center') {
                        this.viewer.clientActiveArea.x = (cellFormat.preferredWidth / 2) - (tableTotalWidth / 2);
                    }
                }
            }
        }
        table.x = this.viewer.clientActiveArea.x;
        table.y = this.viewer.clientActiveArea.y;
    }

    public isTocField(element: FieldElementBox): boolean {
        if (element instanceof FieldElementBox) {
            let nextElement: ElementBox = element.nextNode;
            if (element instanceof FieldElementBox && element.fieldType === 0 && nextElement instanceof TextElementBox
                && nextElement.text.trim().toLowerCase().indexOf('toc') !== -1) {
                return true;
            }
        }
        return false;
    }
    private getTotalColumnSpan(row: TableRowWidget): number {
        let tableRow: TableRowWidget = row;
        let totalColumnSpan: number = 0;
        for (let i: number = 0; i < tableRow.childWidgets.length; i++) {
            totalColumnSpan += (tableRow.childWidgets[i] as TableCellWidget).cellFormat.columnSpan;
        }
        return totalColumnSpan;
    }

    private getMaximumRightCellBorderWidth(table: TableWidget): number {
        let highestBorderSize: number = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let cell: TableCellWidget = row.childWidgets[row.childWidgets.length - 1] as TableCellWidget;
            let cellBorder: number = cell.cellFormat.borders.right.lineWidth;
            if (highestBorderSize < cellBorder) {
                highestBorderSize = cellBorder;
            }
        }
        return highestBorderSize;
    }

    private getDefaultBorderSpacingValue(border: number, isBorderValueZero: boolean, tableHorizontalPosition: HorizontalAlignment): boolean {
        if (border == 0) {
            if (this.documentHelper.compatibilityMode != 'Word2013' && tableHorizontalPosition == 'Center') {
                border = 1.5;
            } else {
                border = 0.75;
            }
            return true;
        }
        return isBorderValueZero;
    }

    private getMinimumWidthRequiredForTable(isBorderValueZero: boolean, tableHorizontalPosition: HorizontalAlignment, border: number): number {
        let minimumWidthRequired: number = 0;
        //To fit the item right side of the Table Microsoft Word 2013 application and other version has different value based on border of the table and alignment of the table.
        if (this.documentHelper.compatibilityMode == 'Word2013') {
            if (tableHorizontalPosition == 'Center') {
                if (isBorderValueZero) {
                    minimumWidthRequired = 18.5 + Math.round(0.75 / 2);
                } else {
                    minimumWidthRequired = 18.5 + Math.round(border / 2);
                }
            } else {
                if (isBorderValueZero) {
                    minimumWidthRequired = 18.5 + 0.75;
                } else {
                    minimumWidthRequired = 18.5 + border;
                }
            }
        } else {
            if (tableHorizontalPosition == 'Center') {
                if (isBorderValueZero) {
                    minimumWidthRequired = 19.25;
                } else {
                    minimumWidthRequired = 18.5 + (border / 2);
                }
            } else {
                if (border == 0.25) {
                    minimumWidthRequired = 18.5;
                } else {
                    minimumWidthRequired = 19.3;
                }
            }
        }
        return HelperMethods.convertPointToPixel(minimumWidthRequired);
    }

    private shiftFloatingItemsFromTable(table: TableWidget, bodyWidget: BodyWidget): void {
        if (table.containerWidget instanceof BodyWidget) {
            for (let i: number = 0; i < table.containerWidget.floatingElements.length; i++) {
                let shape: any = table.containerWidget.floatingElements[i];
                if (!(shape instanceof TableWidget) && shape.paragraph.containerWidget instanceof TableCellWidget
                    && ((shape.paragraph.containerWidget as TableCellWidget).ownerTable.containerWidget as TableCellWidget).ownerTable == table) {
                    bodyWidget.floatingElements.push(table.containerWidget.floatingElements[i]);
                    table.containerWidget.floatingElements.splice(table.containerWidget.floatingElements.indexOf(table.containerWidget.floatingElements[i]), 1)
                    this.shiftedFloatingItemsFromTable.push(shape);
                    i--;
                }
            }
        }
    }
}
