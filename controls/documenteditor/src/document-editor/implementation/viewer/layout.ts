import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import {
    HeaderFooterType, HorizontalAlignment, VerticalAlignment, HorizontalOrigin, HeightType, LineSpacingType, ListLevelPattern,
    TextAlignment, VerticalOrigin, TextWrappingStyle
} from '../../base/types';
import { BodyWidgetInfo, HelperMethods, LineElementInfo, SubWidthInfo, Point } from '../editor/editor-helper';
import { WBorder, WBorders, WCharacterFormat, WListFormat, WParagraphFormat, WTabStop, WSectionFormat } from '../format/index';
import { WAbstractList } from '../list/abstract-list';
import { WLevelOverride } from '../list/level-override';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import {
    BlockContainer, BlockWidget, BodyWidget, BookmarkElementBox, CommentElementBox, EditRangeEndElementBox, EditRangeStartElementBox,
    ElementBox, ErrorTextElementBox, FieldElementBox, FieldTextElementBox, HeaderFooterWidget, ImageElementBox, IWidget, LineWidget,
    ListTextElementBox, Margin, Page, ParagraphWidget, Rect, TabElementBox, TableCellWidget, TableRowWidget,
    TableWidget, TextElementBox, Widget, CheckBoxFormField, DropDownFormField, FormField, ShapeElementBox, TextFrame, ContentControl
} from './page';
import { TextSizeInfo } from './text-helper';
import { DocumentHelper, LayoutViewer, PageLayoutViewer, WebLayoutViewer } from './viewer';
import { Revision } from '../track-changes/track-changes';

/** 
 * @private
 */
export class Layout {
    //private viewer:LayoutViewer;
    private documentHelper: DocumentHelper;
    private value: number;
    /**
     * @private
     */
    public allowLayout: boolean = true;
    /**
     * @private
     */
    public isRelayout: boolean = true;
    public isInitialLoad: boolean = true;
    private fieldBegin: FieldElementBox = undefined;
    private maxTextHeight: number = 0;
    private maxBaseline: number = 0;
    private maxTextBaseline: number = 0;
    private isFieldCode: boolean = false;
    private isRtlFieldCode: boolean = false;
    private isRTLLayout: boolean = false;

    /**
     * @private
     */
    public isBidiReLayout: boolean = false;

    /**
     * @private
     */
    public defaultTabWidthPixel: number = 48;

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
            return false;
        }
        if (currentParagraph.paragraphFormat.baseStyle === nextOrPrevSibling.paragraphFormat.baseStyle) {
            return currentParagraph.paragraphFormat.contextualSpacing;
        }
        return false;
    }

    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    /**
     * @private
     */
    public layout(): void {
        // Todo: Need to handle complete document layout(relayout).
        let page: Page = this.documentHelper.pages[0];
        let body: BodyWidget = page.bodyWidgets[0];
    }
    /**
     * Releases un-managed and - optionally - managed resources.
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
        this.isFieldCode = undefined;
    }
    /**
     * Layouts the items
     * @private
     */
    public layoutItems(sections: BodyWidget[], isReLayout: boolean): void {
        let page: Page;
        for (let i: number = 0; i < sections.length; i++) {
            let section: BodyWidget = sections[i] as BodyWidget;
            page = this.viewer.createNewPage(section);
            this.addBodyWidget(this.viewer.clientActiveArea, section);
            if (this.documentHelper.pages.length > 1) {
                let pageIndex: number = 0;
                for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
                    let prevPage: Page = this.documentHelper.pages[i];
                    let prevSectionIndex: number = prevPage.sectionIndex;
                    let index: number = section.index;
                    if (prevSectionIndex > index || prevPage === page) {
                        break;
                    }
                    pageIndex++;
                }
                if (pageIndex < this.documentHelper.pages.length - 1) {
                    this.documentHelper.insertPage(pageIndex, page);
                }
            }
            this.layoutSection(section, 0, this.viewer);
        }
        if (!isReLayout) {
            this.layoutComments(this.documentHelper.comments);
        }
        this.updateFieldElements();
        /* tslint:disable:align */
        setTimeout((): void => {
            if (this.documentHelper) {
                this.documentHelper.isScrollHandler = true;
                if (this.documentHelper.owner.isSpellCheck && this.documentHelper.owner.spellChecker.enableOptimizedSpellCheck) {
                    this.documentHelper.triggerElementsOnLoading = true;
                }
                this.documentHelper.clearContent();
                this.viewer.updateScrollBars();
                this.documentHelper.isScrollHandler = false;
                this.isInitialLoad = false;
            }
        }, 50);
    }
    /**
     * Layouts the comments
     * @param comments
     * @private
     */
    public layoutComments(comments: CommentElementBox[]): void {
        if (!isNullOrUndefined(comments)) {
            this.viewer.owner.commentReviewPane.layoutComments();
        }
    }
    /**
     * Layouts the items
     * @param section
     * @param viewer
     * @private
     */
    public layoutSection(section: BodyWidget, index: number, viewer: LayoutViewer, ownerWidget?: Widget): void {
        let block: BlockWidget = section.firstChild as BlockWidget;
        let nextBlock: BlockWidget;
        do {
            if (block instanceof TableWidget && block.tableFormat.preferredWidthType === 'Auto'
                && !block.tableFormat.allowAutoFit) {
                block.calculateGrid();
            }
            this.viewer.updateClientAreaForBlock(block, true);
            nextBlock = this.layoutBlock(block, index);
            index = 0;
            this.viewer.updateClientAreaForBlock(block, false);
            block = nextBlock;
        } while (block);
    }
    /**
     * Layouts the header footer items
     * @param section 
     * @param viewer 
     * @private
     */
    public layoutHeaderFooter(section: BodyWidget, viewer: PageLayoutViewer, page: Page): void {
        //Header layout
        let headerFooterWidget: HeaderFooterWidget = viewer.getCurrentPageHeaderFooter(section, true);
        if (headerFooterWidget) {
            let header: HeaderFooterWidget = headerFooterWidget.clone();
            header.page = page;
            this.updateRevisionsToHeaderFooter(header, page);
            viewer.updateHFClientArea(section.sectionFormat, true);
            page.headerWidget = this.layoutHeaderFooterItems(viewer, header);
            this.updateHeaderFooterToParent(header);
        }
        //Footer Layout
        headerFooterWidget = viewer.getCurrentPageHeaderFooter(section, false);
        if (headerFooterWidget) {
            let footer: HeaderFooterWidget = headerFooterWidget.clone();
            footer.page = page;
            viewer.updateHFClientArea(section.sectionFormat, false);
            this.updateRevisionsToHeaderFooter(footer, page);
            page.footerWidget = this.layoutHeaderFooterItems(viewer, footer);
            this.updateHeaderFooterToParent(footer);
        }
    }
    /**
     * @private
     */
    public updateHeaderFooterToParent(node: HeaderFooterWidget): HeaderFooterWidget {
        let sectionIndex: number = node.page.sectionIndex;
        let typeIndex: number = (this.viewer as PageLayoutViewer).getHeaderFooter(node.headerFooterType);
        let clone: HeaderFooterWidget = node.clone();
        this.documentHelper.headersFooters[sectionIndex][typeIndex] = clone;
        for (let j: number = 0; j < clone.childWidgets.length; j++) {
            let child: BlockWidget = clone.childWidgets[j] as BlockWidget;
            if (child instanceof TableWidget) {
                this.clearTableWidget(child, false, true);
            }
        }
        return clone;
    }
    /**
     * @private
     */
    /* tslint:disable:no-any */
    public updateRevisionsToHeaderFooter(clone: HeaderFooterWidget, page: Page): any {
        let childWidge: any = clone.childWidgets;
        if (clone instanceof HeaderFooterWidget && childWidge.length > 0) {
            for (let i: number = 0; i < childWidge.length; i++) {
                if (childWidge[i].childWidgets.length > 0) {
                    let lineWidge: any = childWidge[i].childWidgets;
                    for (let j: number = 0; j < lineWidge.length; j++) {
                        let childrens: any = lineWidge[j].children;
                        if (childrens) {
                            for (let k: number = 0; k < childrens.length; k++) {
                                if (childrens[k].removedIds.length > 0) {
                                    let removeId: any = childrens[k].removedIds;
                                    for (let l: number = 0; l < removeId.length; l++) {
                                        let revision: Revision = this.documentHelper.revisionsInternal.get(removeId[l]);
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
    /**
     * @private
     */
    public updateRevisionRange(revision: Revision, page: Page): any {
        for (let i: number = 0; i < revision.range.length; i++) {
            let inline: TextElementBox = (revision.range[i] as TextElementBox);
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
            //tslint:disable:no-conditional-assignment
        } while (firstChild = firstChild.nextWidget as BlockWidget);
    }
    /**
     * @private
     */
    public linkFieldInParagraph(widget: ParagraphWidget): void {
        for (let j: number = 0; j < widget.childWidgets.length; j++) {
            let line: LineWidget = widget.childWidgets[j] as LineWidget;
            for (let i: number = 0; i < line.children.length; i++) {
                let element: ElementBox = line.children[i] as ElementBox;
                if (element instanceof FieldElementBox && (element.fieldType !== 0 || (element.fieldType === 0 &&
                    this.documentHelper.fields.indexOf(element) === -1))) {
                    element.linkFieldCharacter(this.documentHelper);
                }
                if (element instanceof FieldTextElementBox &&
                    element.fieldBegin !== (element.previousElement as FieldElementBox).fieldBegin) {
                    element.fieldBegin = (element.previousElement as FieldElementBox).fieldBegin;
                }
            }
        }
    }
    /**
     * @private
     */
    public linkFieldInTable(widget: TableWidget): void {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            let row: TableRowWidget = widget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                for (let k: number = 0; k < cell.childWidgets.length; k++) {
                    let block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                    if (block instanceof ParagraphWidget) {
                        this.linkFieldInParagraph(block);
                    } else {
                        this.linkFieldInTable(block as TableWidget);
                    }
                }
            }
        }
    }

    /**
     * Layouts the header footer items.
     * @param viewer 
     * @param hfModule    
     * @private  
     */
    public layoutHeaderFooterItems(viewer: LayoutViewer, widget: HeaderFooterWidget): HeaderFooterWidget {
        this.viewer.updateClientAreaLocation(widget, viewer.clientActiveArea);
        if (widget.childWidgets.length === 0) {
            let pargaraph: ParagraphWidget = new ParagraphWidget();
            let line: LineWidget = new LineWidget(pargaraph);
            pargaraph.childWidgets.push(line);
            widget.childWidgets.push(pargaraph);
            pargaraph.containerWidget = widget;
        }
        this.linkFieldInHeaderFooter(widget);
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            let block: BlockWidget = widget.childWidgets[i] as BlockWidget;
            if (block instanceof TableWidget && block.tableFormat.preferredWidthType === 'Auto'
                && !block.tableFormat.allowAutoFit && !block.isGridUpdated) {
                block.calculateGrid();
            }
            viewer.updateClientAreaForBlock(block, true);
            this.layoutBlock(block, 0);
            viewer.updateClientAreaForBlock(block, false);
        }
        let type: HeaderFooterType = widget.headerFooterType;
        if (type === 'OddFooter' || type === 'EvenFooter' || type === 'FirstPageFooter') {
            this.shiftChildLocation(viewer.clientArea.y - viewer.clientActiveArea.y, widget);
        }
        return widget;
    }
    /**
     * Shifts the child location
     * @param shiftTop 
     * @param bodyWidget      
     */
    private shiftChildLocation(shiftTop: number, bodyWidget: HeaderFooterWidget): void {
        let widgetTop: number = bodyWidget.y + shiftTop;
        let footerMaxHeight: number = bodyWidget.page.boundingRectangle.height - (bodyWidget.page.boundingRectangle.height / 100) * 40;
        widgetTop = Math.max(widgetTop, footerMaxHeight);
        shiftTop = widgetTop - bodyWidget.y;
        let childTop: number = bodyWidget.y = widgetTop;
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            let childWidget: IWidget = bodyWidget.childWidgets[i];
            if (childWidget instanceof ParagraphWidget) {
                (childWidget as Widget).x = (childWidget as Widget).x;
                (childWidget as Widget).y = i === 0 ? (childWidget as Widget).y + shiftTop : childTop;
                childTop += childWidget.height;
            } else {
                this.shiftChildLocationForTableWidget(childWidget as TableWidget, shiftTop);
                childTop += (childWidget as Widget).height;
            }
        }
    }
    /**
     * Shifts the child location for table widget.
     * @param tableWidget 
     * @param shiftTop 
     */
    private shiftChildLocationForTableWidget(tableWidget: TableWidget, shiftTop: number): void {
        tableWidget.y = tableWidget.y + shiftTop;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let childWidget: IWidget = tableWidget.childWidgets[i];
            if (childWidget instanceof TableRowWidget) {
                this.shiftChildLocationForTableRowWidget(childWidget as TableRowWidget, shiftTop);
            }
        }
    }
    /**
     * Shifts the child location for table row widget.
     * @param rowWidget 
     * @param shiftTop  
     */
    private shiftChildLocationForTableRowWidget(rowWidget: TableRowWidget, shiftTop: number): void {
        rowWidget.y = rowWidget.y + shiftTop;
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            this.shiftChildLocationForTableCellWidget((rowWidget.childWidgets[i] as TableCellWidget), shiftTop);
        }
    }
    /**
     * Shifts the child location for table cell widget.
     * @param cellWidget 
     * @param shiftTop 
     */
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
    /**
     * Layouts specified block.
     * @param block
     * @private
     */
    public layoutBlock(block: BlockWidget, index: number, moveToLine?: boolean): BlockWidget {
        let nextBlock: BlockWidget;
        if (block instanceof ParagraphWidget) {
            nextBlock = this.layoutParagraph(block, index);
        } else {
            nextBlock = this.layoutTable(block as TableWidget, index);
        }
        return nextBlock.nextRenderedWidget as BlockWidget;
    }
    /**
     * Adds paragraph widget.
     * @param area 
     */
    private addParagraphWidget(area: Rect, paragraphWidget: ParagraphWidget): ParagraphWidget {
        let ownerParaWidget: ParagraphWidget = undefined;
        if (paragraphWidget.isEmpty() && !isNullOrUndefined(paragraphWidget.paragraphFormat) &&
            (paragraphWidget.paragraphFormat.textAlignment === 'Center' || paragraphWidget.paragraphFormat.textAlignment === 'Right') &&
            paragraphWidget.paragraphFormat.listFormat.listId === -1) {
            let top: number = 0;
            let bottom: number = 0;
            let width: number = this.documentHelper.textHelper.getParagraphMarkWidth(paragraphWidget.characterFormat);
            let left: number = area.x;
            if (paragraphWidget.paragraphFormat.textAlignment === 'Center') {
                left += (area.width - width) / 2;
            } else {
                left += area.width - width;
            }
            paragraphWidget.width = width;
            paragraphWidget.x = left;
            paragraphWidget.y = area.y;
        } else {
            paragraphWidget.width = area.width;
            paragraphWidget.x = area.x;
            paragraphWidget.y = area.y;
        }
        return paragraphWidget;
    }
    /**
     * Adds line widget.
     * @param paragraph 
     */
    private addLineWidget(paragraphWidget: ParagraphWidget): LineWidget {
        let line: LineWidget = undefined;
        line = new LineWidget(paragraphWidget);
        line.width = paragraphWidget.width;
        paragraphWidget.childWidgets.push(line);
        line.paragraph = paragraphWidget;
        return line;
    }
    /**
     * @private
     */
    public isFirstElementWithPageBreak(paragraphWidget: ParagraphWidget): boolean {
        let isPageBreak: boolean = false;
        if (this.viewer instanceof PageLayoutViewer) {
            let lineWidget: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
            if (lineWidget) {
                let element: ElementBox = lineWidget.children[0];
                while (element) {
                    if (element instanceof BookmarkElementBox && element.name.indexOf('_') >= 0) {
                        element = element.nextElement;
                        continue;
                    }
                    if (element instanceof TextElementBox && element.text === '\f') {
                        isPageBreak = true;
                    }
                    break;
                }
            }
        }
        return isPageBreak;
    };
    /**
     * Layouts specified paragraph.
     * @private
     * @param paragraph     
     */
    public layoutParagraph(paragraph: ParagraphWidget, lineIndex: number): BlockWidget {
        this.addParagraphWidget(this.viewer.clientActiveArea, paragraph);
        let isListLayout: boolean = true;
        let isFirstElmIsparagraph: boolean = this.isFirstElementWithPageBreak(paragraph);
        if (!isFirstElmIsparagraph) {
            this.layoutListItems(paragraph);
            isListLayout = false;
        }
        if (paragraph.isEmpty()) {
            this.layoutEmptyLineWidget(paragraph, true);
        } else {
            let line: LineWidget = lineIndex < paragraph.childWidgets.length ?
                paragraph.childWidgets[lineIndex] as LineWidget : undefined;
            while (line instanceof LineWidget) {
                if (paragraph !== line.paragraph && line.indexInOwner === 0 && isListLayout) {
                    this.layoutListItems(line.paragraph);
                }
                if (line.isFirstLine() && isNullOrUndefined(this.fieldBegin)) {
                    if (!isNullOrUndefined(paragraph.paragraphFormat)) {
                        // tslint:disable-next-line:max-line-length
                        let firstLineIndent: number = -HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent);
                        this.viewer.updateClientWidth(firstLineIndent);
                    }
                }
                line = this.layoutLine(line, 0);
                paragraph = line.paragraph;
                line = line.nextLine;
            }
        }
        this.updateWidgetToPage(this.viewer, paragraph);
        return paragraph;
    }
    private clearLineMeasures(): void {
        this.maxBaseline = 0;
        this.maxTextBaseline = 0;
        this.maxTextHeight = 0;
    }
    private moveElementFromNextLine(line: LineWidget): void {
        let nextLine: LineWidget = line.nextLine;
        while (nextLine instanceof LineWidget) {
            if (nextLine.children.length > 0) {
                let element: ElementBox = nextLine.children.splice(0, 1)[0];
                line.children.push(element);
                element.line = line;
                break;
            } else {
                if (nextLine.paragraph.childWidgets.length === 1) {
                    nextLine.paragraph.destroy();
                } else {
                    nextLine.destroy();
                }
                nextLine = line.nextLine;
            }
        }
    }
    private layoutLine(line: LineWidget, count: number): LineWidget {
        let paragraph: ParagraphWidget = line.paragraph;
        if (line.children.length === 0) {
            this.moveElementFromNextLine(line);
        }
        let element: ElementBox = line.children[count];
        this.clearLineMeasures();
        while (element instanceof ElementBox) {
            this.layoutElement(element, paragraph);
            line = element.line;
            if (element instanceof TextElementBox) {
                let textElement: TextElementBox = element as TextElementBox;
                if (!isNullOrUndefined(textElement.errorCollection) && textElement.errorCollection.length > 0) {
                    textElement.ischangeDetected = true;
                }
            }
            if (!this.isRTLLayout) {
                element = element.nextElement;
            } else {
                element = undefined;
                this.isRTLLayout = false;
            }
        }
        return line;
    }
    // tslint:disable:max-func-body-length
    private layoutElement(element: ElementBox, paragraph: ParagraphWidget): void {
        let line: LineWidget = element.line;
        let text: string = '';
        let index: number = element.indexInOwner;
        if (element instanceof FieldElementBox) {
            if (element.fieldType === 0) {
                if (this.documentHelper.fields.indexOf(element) === -1) {
                    this.documentHelper.fields.push(element);
                }
                if (!isNullOrUndefined(element.formFieldData) &&
                    this.documentHelper.formFields.indexOf(element) === -1) {
                    this.documentHelper.formFields.push(element);
                }
            }
            this.layoutFieldCharacters(element);
            if (element.line.isLastLine() && isNullOrUndefined(element.nextNode) && !this.isFieldCode) {
                if (element.fieldType !== 2 && isNullOrUndefined(element.fieldSeparator)) {
                    this.layoutEmptyLineWidget(paragraph, false, element.line);
                }
                this.moveToNextLine(line);
            } else if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width > 0 && !element.line.isLastLine()) {
                this.moveElementFromNextLine(line);
            } else if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width === 0) {
                this.moveToNextLine(line);
                if (line.paragraph.lastChild === line && !isNullOrUndefined(line.nextLine) &&
                    this.viewer.clientActiveArea.height >= 0) {
                    this.moveFromNextPage(line);
                }
            }
            return;
        }
        if (element instanceof ListTextElementBox || this.isFieldCode || element instanceof BookmarkElementBox ||
            element instanceof EditRangeEndElementBox || element instanceof EditRangeStartElementBox
            || element instanceof ContentControl) {
            if (element instanceof BookmarkElementBox) {
                if (element.bookmarkType === 0 && !this.documentHelper.bookmarks.containsKey(element.name)) {
                    this.documentHelper.bookmarks.add(element.name, element);
                } else if (element.bookmarkType === 1 && this.documentHelper.bookmarks.containsKey(element.name)) {
                    let bookmrkElement: BookmarkElementBox = this.documentHelper.bookmarks.get(element.name);
                    if (isNullOrUndefined(bookmrkElement.reference)) {
                        bookmrkElement.reference = element;
                        element.reference = bookmrkElement;
                    }
                } else if (element.bookmarkType === 0 && this.documentHelper.bookmarks.containsKey(element.name)) {
                    if (isNullOrUndefined(element.reference)) {
                        this.documentHelper.bookmarks.remove(element.name);
                    }
                }
            }
            if (element instanceof ContentControl && this.documentHelper.contentControlCollection.indexOf(element) === -1) {
                if (element.type === 0) {
                    this.documentHelper.contentControlCollection.push(element);
                } else if (element.type === 1) {
                    for (let i: number = 0; i < this.documentHelper.contentControlCollection.length; i++) {
                        let cCStart: ContentControl = this.documentHelper.contentControlCollection[i];
                        if (element.contentControlProperties === cCStart.contentControlProperties) {
                            element.reference = cCStart;
                            cCStart.reference = element;
                        }
                    }
                }
            }
            if (isNullOrUndefined(element.nextElement) && this.viewer.clientActiveArea.width > 0 && !element.line.isLastLine()) {
                this.moveElementFromNextLine(line);
            }
            if (element.line.isLastLine() && isNullOrUndefined(element.nextElement)) {
                if (this.hasValidElement(line.paragraph)) {
                    this.moveToNextLine(line);
                } else {
                    this.layoutEmptyLineWidget(line.paragraph, false, line, false);
                }
            }
            return;
        }
        let width: number = element.width;
        if (element instanceof FieldTextElementBox) {
            text = this.documentHelper.getFieldResult((element as FieldTextElementBox).fieldBegin, element.paragraph.bodyWidget.page);
            if (text !== '') {
                (element as FieldTextElementBox).text = text;
            } else {
                text = (element as TextElementBox).text;
            }
        } else if (element instanceof TextElementBox) {
            this.checkAndSplitTabOrLineBreakCharacter(element.text, element);
            if (element.text.length > 1 && element.line.paragraph.bidi) {
                let splittedText: string[] = this.splitTextByConsecutiveLtrAndRtl(element);
                this.updateSplittedText(element, splittedText);
            }
            text = element.text;
        }
        // Here field code width and height update need to skipped based on the hidden property.
        if (element instanceof TextElementBox) {
            // if (this.isRelayout) {
            width = this.documentHelper.textHelper.getTextSize(element as TextElementBox, element.characterFormat);
            /*} else {
                width = element.trimEndWidth;
            }*/

            if (element.text === '\t') {
                element.width = this.getTabWidth(paragraph, this.viewer, index, line, element as TabElementBox);
            }
        }
        if (this.viewer instanceof PageLayoutViewer
            && this.viewer.clientActiveArea.height < element.height && this.viewer.clientActiveArea.y !== this.viewer.clientArea.y) {
            this.moveToNextPage(this.viewer, line);
            if (element instanceof FieldTextElementBox) {
                this.updateFieldText(element);
            }
            if (element.previousElement) {
                this.cutClientWidth(element.previousElement);
            }
        }
        if (element instanceof ShapeElementBox) {
            let position: Point = this.getFloatingItemPoints(element);
            element.x = position.x;
            element.y = position.y;
            let clientArea: Rect = new Rect(this.viewer.clientArea.x, this.viewer.clientArea.y, this.viewer.clientArea.width,
                this.viewer.clientArea.height);
            let clientActiveArea: Rect = new Rect(this.viewer.clientActiveArea.x, this.viewer.clientActiveArea.y,
                this.viewer.clientActiveArea.width, this.viewer.clientActiveArea.height);
            let blocks: BlockWidget[] = element.textFrame.childWidgets as BlockWidget[];
            this.viewer.updateClientAreaForTextBoxShape(element, true);
            for (let i: number = 0; i < blocks.length; i++) {
                let block: BlockWidget = blocks[i];
                this.viewer.updateClientAreaForBlock(block, true);
                if (block instanceof TableWidget) {
                    this.clearTableWidget(block, true, true);
                }
                this.layoutBlock(block, 0);
                this.viewer.updateClientAreaForBlock(block, false);
            }
            let bodyWidget: BlockContainer = element.paragraph.bodyWidget;
            if (bodyWidget.floatingElements.indexOf(element) === -1) {
                bodyWidget.floatingElements.push(element);
            }
            if (element.paragraph.floatingElements.indexOf(element) === -1) {
                element.paragraph.floatingElements.push(element);
            }
            this.viewer.clientActiveArea = clientActiveArea;
            this.viewer.clientArea = clientArea;
        }
        if (element instanceof ImageElementBox) {
            // tslint:disable-next-line:max-line-length
            if (element.top !== 0 && !isNullOrUndefined(element.top) || element.bottom !== 0 && !isNullOrUndefined(element.bottom) || element.left !== 0 && !isNullOrUndefined(element.left) || element.right !== 0 && !isNullOrUndefined(element.right)) {
                this.cropPosition(element);
            }
        }
        if (parseFloat(width.toFixed(4)) <= parseFloat(this.viewer.clientActiveArea.width.toFixed(4)) || !this.viewer.textWrap) {
            //Fits the text in current line.
            this.addElementToLine(paragraph, element);
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
                this.addSplittedLineWidget(currentLine, currentLine.children.indexOf(element) - 1);
                this.moveToNextLine(currentLine);
                // Recalculates tab width based on new client active area X position
                element.width = this.getTabWidth(paragraph, this.viewer, index, element.line, element as TabElementBox);
                this.addElementToLine(paragraph, element);
            } else {
                //Splits the text and arrange line by line, till end of text.
                do {
                    line = element.line;
                    this.splitTextForClientArea(line, element, element.text, element.width, element.characterFormat);
                    this.checkLineWidgetWithClientArea(line, element);
                    if (element instanceof FieldTextElementBox) {
                        this.updateFieldText(element);
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
            } while (element.line !== line && this.cutClientWidth(element));
        }
        if (text === '\v' || text === '\f') {
            let elementIndex: number = line.children.indexOf(element);
            if (elementIndex > -1) {
                this.addSplittedLineWidget(line, elementIndex);
            }
        }
        if (element.line.isLastLine() && isNullOrUndefined(element.nextElement) || text === '\v' || text === '\f') {
            this.moveToNextLine(element.line);
            if (text === '\v' && isNullOrUndefined(element.nextNode)) {
                this.layoutEmptyLineWidget(paragraph, true, line, true);
            } else if (text === '\f' && this.viewer instanceof PageLayoutViewer) {
                if (isNullOrUndefined(element.nextNode)) {
                    this.moveToNextPage(this.viewer, element.line, true);
                } else if (!isNullOrUndefined(element.line.nextLine)) {
                    this.moveToNextPage(this.viewer, element.line.nextLine, false);
                }
            }
        }
    }
    /**
     * Return true if paragraph has valid inline
     * @private
     */
    public hasValidElement(paragraph: ParagraphWidget): boolean {
        let line: LineWidget = paragraph.firstChild as LineWidget;
        if (line && !isNullOrUndefined(this.documentHelper.selection)) {
            let elementBox: ElementBox = line.children[0];
            while (elementBox) {
                if (elementBox instanceof FieldElementBox) {
                    elementBox = this.documentHelper.selection.getNextValidElementForField(elementBox);
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
    private updateFieldText(element: ElementBox): void {
        // tslint:disable-next-line:max-line-length
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
    private splitTextByConsecutiveLtrAndRtl(element: TextElementBox): string[] {
        let text: string = element.text;
        let charTypeIndex: number = 0;
        let splittedText: string[] = [];
        let hasRTLCharacter: boolean = false;
        let characterRangeTypes: string[] = [];
        let lastLtrIndex: number = -1;
        let ltrText: string = '';
        let rtlText: string = '';
        let wordSplitChars: string = '';
        let numberText: string = '';
        let isTextBidi: boolean = element.characterFormat.bidi;
        for (let i: number = 0; i < text.length; i++) {
            let currentCharacterType: number = 0;
            let separateEachWordSplitChars: boolean = false;
            // if ((isPrevLTRText.HasValue ? !isPrevLTRText.Value : isTextBidi) && char.IsNumber(text[i]))
            if (isTextBidi && /^[0-9]+$/.test(text[i])) {
                numberText += text[i];
                currentCharacterType = 4;
            } else if (this.documentHelper.textHelper.containsSpecialCharAlone(text.charAt(i))) {
                currentCharacterType = 2;
                if (separateEachWordSplitChars = (isTextBidi || (text.charAt(i) === ' ' && wordSplitChars === ''))) {
                    if (i !== 0 && /^[0-9]+$/.test(text[i - 1]) && text[i] === '.' && text[i + 1] && /^[0-9]+$/.test(text[i + 1])) {
                        numberText += text[i];
                        currentCharacterType = 4;
                    }
                } else {
                    wordSplitChars += text[i];
                }
            } else if (this.documentHelper.textHelper.isRTLText(text.charAt(i))) {
                hasRTLCharacter = true;
                rtlText += text[i];
                currentCharacterType = 1;
            } else {
                ltrText += text[i];
            }
            if (numberText !== '' && currentCharacterType !== 4) {
                splittedText.push(numberText);
                characterRangeTypes.push('Number');
                numberText = '';
            }
            if (rtlText !== '' && currentCharacterType !== 1) {
                splittedText.push(rtlText);
                characterRangeTypes.push('RTL');
                rtlText = '';
            }
            if (ltrText !== '' && currentCharacterType !== 0) {
                splittedText.push(ltrText);
                lastLtrIndex = splittedText.length - 1;
                characterRangeTypes.push('LTR');
                ltrText = '';
            }
            if (wordSplitChars !== '' && (currentCharacterType !== 2 || separateEachWordSplitChars)) {
                splittedText.push(wordSplitChars);
                characterRangeTypes.push('WordSplit');
                wordSplitChars = '';
            }
        }
        if (numberText !== '') {
            splittedText.push(numberText);
            characterRangeTypes.push('Number');
        } else if (rtlText !== '') {
            splittedText.push(rtlText);
            characterRangeTypes.push('RTL');
        } else if (ltrText !== '') {
            splittedText.push(ltrText);
            lastLtrIndex = splittedText.length - 1;
            characterRangeTypes.push('LTR');
        } else if (wordSplitChars !== '') {
            splittedText.push(wordSplitChars);
            characterRangeTypes.push('WordSplit');
        }
        if (hasRTLCharacter) {
            for (let i: number = 1; i < splittedText.length; i++) {
                //Combines the consecutive LTR,RTL,and Number(Number get combined only if it's splitted by non reversing characters (.,:)) 
                //along with single in-between word split character.
                let charType: string = characterRangeTypes[i + charTypeIndex];
                if (charType === 'WordSplit' && splittedText[i].length === 1
                    && i + charTypeIndex + 1 < characterRangeTypes.length
                    && characterRangeTypes[i + charTypeIndex - 1] !== 'WordSplit'
                    && (characterRangeTypes[i + charTypeIndex - 1] !== 'Number'
                        //Else handled to combine consecutive number 
                        //when text bidi is false and middle word split character is not white space.
                        || this.isNumberNonReversingCharacter(splittedText[i], isTextBidi))
                    && characterRangeTypes[i + charTypeIndex - 1] === characterRangeTypes[i + charTypeIndex + 1]) {
                    /* tslint:disable */
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i] + splittedText[i + 1];
                    splittedText.splice(i, 1);
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    i--;
                    /* tslint:enable */
                }
            }
        } else if (lastLtrIndex !== -1) {
            if (isTextBidi) {
                for (let i: number = 1; i < lastLtrIndex; i++) {
                    //Combines the first and last LTR along with all in-between splited text's.
                    let charType: string = characterRangeTypes[i + charTypeIndex];
                    if (charType === 'WordSplit' && i < lastLtrIndex
                        && characterRangeTypes[i + charTypeIndex - 1] === 'LTR') {
                        ltrText = '';
                        for (let j: number = i + 1; j <= lastLtrIndex; j++) {
                            ltrText += splittedText[j];
                            splittedText.splice(j, 1);
                            characterRangeTypes.splice(j + charTypeIndex);
                            j--;
                            lastLtrIndex--;
                        }
                        splittedText[i - 1] = splittedText[i - 1] + splittedText[i] + ltrText;
                        splittedText.splice(i, 1);
                        characterRangeTypes.splice(i + charTypeIndex);
                        i--;
                        lastLtrIndex--;
                    }
                }
            } else {
                //Return the input text if text bidi is false.
                splittedText = [];
                splittedText.push(text);
            }
        } else if (!isTextBidi) {
            //Return the input text if text bidi is false.
            splittedText = [];
            splittedText.push(text);
        }

        if (isTextBidi) {
            for (let i: number = 1; i < splittedText.length; i++) {
                //Combines the consecutive LTR, RTL, and Number(Number get combined only if it's splitted by non reversing characters (.,:)
                //or if it's lang attribute is represent a RTL language)
                //along with single in-between number non reversing word split character.
                let charType: string = characterRangeTypes[i + charTypeIndex];
                if (charType === 'WordSplit' && splittedText[i].length === 1
                    && i + charTypeIndex + 1 < characterRangeTypes.length
                    && characterRangeTypes[i + charTypeIndex - 1] !== 'WordSplit'
                    && (characterRangeTypes[i + charTypeIndex - 1] !== 'Number'
                        || this.isNumberNonReversingCharacter(splittedText[i], isTextBidi))
                    && characterRangeTypes[i + charTypeIndex - 1] === characterRangeTypes[i + charTypeIndex + 1]) {
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i] + splittedText[i + 1];
                    splittedText.splice(i, 1);
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    characterRangeTypes.splice(i + charTypeIndex);
                    i--;
                    // //Combines the Number along with single non-word split characters (% $ #).
                    // else if (charType=='WordSplit'
                    //     && characterRangeTypes[i + charTypeIndex - 1]=='Number') {
                    //     splittedText[i - 1] = splittedText[i - 1] + splittedText[i];
                    //     splittedText.splice(i, 1);
                    //     characterRangeTypes.splice(i + charTypeIndex, 1);
                    //     i--;
                    // }
                    //Combines the consecutive LTR and Number
                } else if (charType === 'LTR'
                    && (characterRangeTypes[i + charTypeIndex - 1] === 'Number'
                        || characterRangeTypes[i + charTypeIndex - 1] === 'LTR')) {
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i];
                    characterRangeTypes[i + charTypeIndex - 1] = 'LTR';
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    i--;
                }
            }
        }
        return splittedText;
    }
    private isNumberNonReversingCharacter(character: string, isTextBidi: boolean): boolean {
        let numberNonReversingCharacters: string = ',.:';
        //(.,:) are the number non-reversing characters.
        if (numberNonReversingCharacters.indexOf(character[0]) !== -1) {
            if (character[0] === '.' ? !isTextBidi : true) {
                return true;
            }
        }
        return false;
    }
    private updateSplittedText(span: TextElementBox, splittedText: string[]): void {
        let text: string = '';
        let inlineIndex: number = span.line.children.indexOf(span);
        if (splittedText.length > 1) {
            for (let j: number = 0; j < splittedText.length; j++) {
                text = splittedText[j];
                if (j > 0) {
                    let newSpan2: TextElementBox = new TextElementBox();
                    newSpan2.line = span.line;
                    newSpan2.characterFormat.copyFormat(span.characterFormat);
                    span.line.children.splice(inlineIndex + j, 0, newSpan2);
                    newSpan2.text = text;
                } else {
                    //Replace the source text range with splitted text.
                    span.text = text;
                }
            }
        }

    }

    /**
     * @private
     */
    public moveFromNextPage(line: LineWidget): void {
        let nextLine: LineWidget = line.nextLine;
        if (nextLine && line.paragraph.childWidgets.indexOf(nextLine) === -1) {
            nextLine.paragraph.childWidgets.splice(nextLine.indexInOwner, 1);
            line.paragraph.childWidgets.push(nextLine);
            nextLine.paragraph = line.paragraph;
        }
    }
    private cutClientWidth(currentElement: ElementBox): boolean {
        this.clearLineMeasures();
        let line: LineWidget = currentElement.line;
        let width: number = 0;
        for (let i: number = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i];
            width += element.width;
            if (currentElement === element) {
                break;
            }
        }
        let splitCurrentWidget: boolean = this.viewer.clientActiveArea.width - width < 0;
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
                this.documentHelper.fieldStacks.push(element);
                this.isFieldCode = true;
                element.hasFieldEnd = true;
            }
        } else if (this.documentHelper.fieldStacks.length > 0) {
            if (element.fieldType === 2) {
                let field: FieldElementBox = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                if (field.fieldSeparator === element && (!isNullOrUndefined(field.fieldEnd) || field.hasFieldEnd)) {
                    this.isFieldCode = false;
                }
            } else {
                let field: FieldElementBox = this.documentHelper.fieldStacks[this.documentHelper.fieldStacks.length - 1];
                if (element === field.fieldEnd) {
                    this.documentHelper.fieldStacks.pop();
                    this.isFieldCode = false;
                }
            }
        }
    }
    private checkAndUpdateFieldData(fieldBegin: FieldElementBox): void {
        if (fieldBegin.hasFieldEnd && !isNullOrUndefined(fieldBegin.fieldEnd)) {
            if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                let seperator: FieldElementBox = new FieldElementBox(2);
                seperator.fieldBegin = fieldBegin;
                seperator.fieldEnd = fieldBegin.fieldEnd;
                seperator.line = fieldBegin.line;
                fieldBegin.line.children.splice(fieldBegin.fieldEnd.indexInOwner, 0, seperator);
                fieldBegin.fieldSeparator = seperator;
                fieldBegin.fieldEnd.fieldSeparator = seperator;
            }
            let previousNode: ElementBox = fieldBegin.fieldEnd.previousNode;
            if (previousNode instanceof FieldElementBox && previousNode.fieldType === 2) {
                let formFieldData: FormField = fieldBegin.formFieldData;
                if (formFieldData instanceof CheckBoxFormField) {
                    let checkBoxTextElement: TextElementBox = new TextElementBox();
                    checkBoxTextElement.characterFormat = fieldBegin.characterFormat.cloneFormat();
                    if (formFieldData.checked) {
                        checkBoxTextElement.text = String.fromCharCode(9745);
                    } else {
                        checkBoxTextElement.text = String.fromCharCode(9744);
                    }
                    if (formFieldData.sizeType !== 'Auto') {
                        checkBoxTextElement.characterFormat.fontSize = formFieldData.size;
                    }
                    checkBoxTextElement.line = fieldBegin.line;
                    let index: number = fieldBegin.line.children.indexOf(fieldBegin.fieldEnd);
                    fieldBegin.line.children.splice(index, 0, checkBoxTextElement);
                } else if (formFieldData instanceof DropDownFormField) {
                    let dropDownTextElement: TextElementBox = new TextElementBox();
                    dropDownTextElement.characterFormat = fieldBegin.characterFormat.cloneFormat();
                    dropDownTextElement.line = fieldBegin.line;
                    if (formFieldData.dropdownItems.length > 0) {
                        dropDownTextElement.text = formFieldData.dropdownItems[formFieldData.selectedIndex];
                    } else {
                        // tslint:disable-next-line:max-line-length
                        dropDownTextElement.text = this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5);
                    }
                    let index: number = fieldBegin.line.children.indexOf(fieldBegin.fieldEnd);
                    fieldBegin.line.children.splice(index, 0, dropDownTextElement);
                }
            }
        }
    }
    /**
     * Layouts empty line widget.
     */
    // tslint:disable-next-line:max-line-length
    private layoutEmptyLineWidget(paragraph: ParagraphWidget, isEmptyLine: boolean, line?: LineWidget, isShiftEnter?: boolean): void {
        let paraFormat: WParagraphFormat = paragraph.paragraphFormat;
        let subWidth: number = 0;
        let whiteSpaceCount: number = 0;
        isShiftEnter = isNullOrUndefined(isShiftEnter) ? false : isShiftEnter;
        //Calculate line height and descent based on formatting defined in paragraph.
        let paragraphMarkSize: TextSizeInfo = this.documentHelper.textHelper.getParagraphMarkSize(paragraph.characterFormat);
        let maxHeight: number = paragraphMarkSize.Height;
        let beforeSpacing: number = this.getBeforeSpacing(paragraph);
        let lineWidget: LineWidget;
        if (paragraph.childWidgets.length > 0 && !isShiftEnter) {
            lineWidget = paragraph.childWidgets[0] as LineWidget;
            if (lineWidget.children.length > 0) {
                if (!this.isBidiReLayout && (paraFormat.bidi || this.isContainsRtl(lineWidget))) {
                    this.reArrangeElementsForRtl(lineWidget, paraFormat.bidi);
                }
                let isParagraphStart: boolean = lineWidget.isFirstLine();
                let isParagraphEnd: boolean = lineWidget.isLastLine();
                let firstLineIndent: number = 0;
                if (isParagraphStart) {
                    beforeSpacing = this.getBeforeSpacing(paragraph);
                    firstLineIndent = HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
                }
                let textAlignment: TextAlignment = paraFormat.textAlignment;
                if (textAlignment !== 'Left' && this.viewer.textWrap
                    && (!(textAlignment === 'Justify' && isParagraphEnd)
                        || (textAlignment === 'Justify' && paraFormat.bidi))) {
                    // tslint:disable-next-line:max-line-length
                    let getWidthAndSpace: SubWidthInfo = this.getSubWidth(lineWidget, textAlignment === 'Justify', whiteSpaceCount, firstLineIndent, isParagraphEnd);
                    subWidth = getWidthAndSpace.subWidth;
                    whiteSpaceCount = getWidthAndSpace.spaceCount;
                }
            }
        } else {
            lineWidget = isEmptyLine ? this.addLineWidget(paragraph) : line;
        }
        //isNullOrUndefined(this.viewer.currentHeaderFooter) && 
        if (this.viewer instanceof PageLayoutViewer
            && this.viewer.clientActiveArea.height < beforeSpacing + maxHeight
            && this.viewer.clientActiveArea.y !== this.viewer.clientArea.y) {
            this.moveToNextPage(this.viewer, lineWidget);
        }
        //Gets line spacing.
        let lineSpacing: number = this.getLineSpacing(paragraph, maxHeight);
        let maxDescent: number = maxHeight - paragraphMarkSize.BaselineOffset;
        //Calculate the bottom position of current line - max height + line spacing.
        if (!isNaN(this.maxTextHeight)
            && maxHeight < this.maxTextHeight) {
            maxHeight = this.maxTextHeight;
            maxDescent = maxHeight - this.maxTextBaseline;
        }
        let topMargin: number = 0;
        let bottomMargin: number = 0;
        let leftMargin: number = 0;
        let height: number = maxHeight;
        let lineSpacingType: LineSpacingType = paragraph.paragraphFormat.lineSpacingType;
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
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let element: ElementBox = lineWidget.children[i];
            if (i === 0 && element instanceof ListTextElementBox) {
                let textAlignment: TextAlignment = paragraph.paragraphFormat.textAlignment;
                if (textAlignment === 'Right') {  //Aligns the text as right justified.
                    leftMargin = subWidth;
                } else if (textAlignment === 'Center') { //Aligns the text as center justified.
                    leftMargin = subWidth / 2;
                }
                element.margin = new Margin(leftMargin, topMargin, 0, bottomMargin);
                element.line = lineWidget;
                lineWidget.height = topMargin + height + bottomMargin;
            }
        }
        lineWidget.height = topMargin + height + bottomMargin;
        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + lineWidget.height);
        //Clears the previous line elements from collection.     
    }
    /**
     * @private
     */
    public layoutListItems(paragraph: ParagraphWidget): void {
        if (!this.isFieldCode) {
            if (!isNullOrUndefined(paragraph.paragraphFormat)
                && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)
                && !isNullOrUndefined(this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId)) &&
                paragraph.paragraphFormat.listFormat.listLevelNumber >= 0
                && paragraph.paragraphFormat.listFormat.listLevelNumber < 9) {
                this.clearListElementBox(paragraph);
                this.layoutList(paragraph, this.documentHelper);
            } else if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId === -1) {
                this.clearListElementBox(paragraph);
            }
        }
    }
    /**
     * Layouts list.
     * @param viewer     
     */
    private layoutList(paragraph: ParagraphWidget, documentHelper: DocumentHelper): void {
        let list: WList = documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId);
        this.viewer.updateClientWidth(-HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent));
        let currentListLevel: WListLevel = this.getListLevel(list, paragraph.paragraphFormat.listFormat.listLevelNumber);
        // if (isNullOrUndefined(currentListLevel)) {
        //     return;
        // }
        let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
        if (isNullOrUndefined(lineWidget)) {
            lineWidget = new LineWidget(paragraph);
            paragraph.childWidgets.push(lineWidget);
        }
        let element: ListTextElementBox = new ListTextElementBox(currentListLevel, false);
        element.line = lineWidget;
        if (currentListLevel.listLevelPattern === 'Bullet') {
            element.text = currentListLevel.numberFormat;
        } else {
            element.text = this.getListNumber(paragraph.paragraphFormat.listFormat);
        }

        if (this.documentHelper.isIosDevice) {
            let text: string = element.text;
            text = text === '\uf0b7' ? '\u25CF' : text === '\uf06f' + '\u0020' ? '\u25CB' : text;
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
        //Adds the text element to the line
        lineWidget.children.splice(0, 0, element);
        if (currentListLevel.followCharacter !== 'None') {
            element = new ListTextElementBox(currentListLevel, true);
            if (currentListLevel.followCharacter === 'Tab') {
                element.text = '\t';
                let index: number = lineWidget.children.indexOf(element);
                element.width = this.getTabWidth(paragraph, this.viewer, index, lineWidget, element);
            } else {
                element.text = ' ';
                documentHelper.textHelper.updateTextSize(element, paragraph);
            }
            this.viewer.cutFromLeft(this.viewer.clientActiveArea.x + element.width);
            //Adds the tabSpace to the line
            lineWidget.children.splice(1, 0, element);
            element.line = lineWidget;
        }
        if (moveToNextPage) {
            this.moveToNextPage(this.viewer, lineWidget);
            this.cutClientWidth(element);
            return;
        }
        if (currentListLevel.followCharacter !== 'None') {
            this.viewer.updateClientWidth(HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent));
        }
    }
    /**
     * Adds body widget.
     * @param area 
     * @param section 
     * @private
     */
    public addBodyWidget(area: Rect, widget?: BodyWidget): BodyWidget {
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
     * Adds list level.
     * @param abstractList 
     */
    private addListLevels(abstractList: WAbstractList): void {
        for (let i: number = abstractList.levels.length; i < 9; i++) {
            let listLevel: WListLevel = new WListLevel(abstractList as WAbstractList);
            let val: number = i % 3;
            if ((abstractList.levels[0] as WListLevel).listLevelPattern === 'Bullet') {
                listLevel.listLevelPattern = 'Bullet';
                listLevel.numberFormat = val === 0 ? '\uf0b7' : val === 1 ? '\uf06f' + '\u0020' : '\uf0a7';
                listLevel.characterFormat.fontFamily = listLevel.numberFormat === '\uf0a7' ? 'Wingdings' : 'Symbol';

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
        let paragraph: ParagraphWidget = lineWidget.paragraph;
        let movedElementBox: ElementBox[] = [];
        let lineIndex: number = paragraph.childWidgets.indexOf(lineWidget);
        if (!isNullOrUndefined(splittedElementBox)) {
            movedElementBox.push(splittedElementBox);
        }
        let newLineWidget: LineWidget = undefined;
        //Move Next element box to temp collection
        for (let i: number = elementIndex + 1; i < lineWidget.children.length; i++) {
            movedElementBox.push(lineWidget.children[i]);
        }
        if (movedElementBox.length > 0) {
            if (lineIndex === paragraph.childWidgets.length - 1) {
                newLineWidget = new LineWidget(paragraph);
            } else {
                newLineWidget = paragraph.childWidgets[lineIndex + 1] as LineWidget;
            }
            for (let j: number = 0; j < movedElementBox.length; j++) {
                movedElementBox[j].line = newLineWidget;
            }
            lineWidget.children.splice(elementIndex + 1, lineWidget.children.length - 1);
            newLineWidget.children = movedElementBox.concat(newLineWidget.children);
            if (paragraph.childWidgets.indexOf(newLineWidget) === -1) {
                paragraph.childWidgets.splice(lineIndex + 1, 0, newLineWidget);
            }
        }
    }
    /**
     * Adds element to line.
     * @param element 
     */
    private addElementToLine(paragraph: ParagraphWidget, element: ElementBox): void {
        if (!(element instanceof ShapeElementBox)) {
            this.viewer.cutFromLeft(this.viewer.clientActiveArea.x + element.width);
        }
        if (paragraph.paragraphFormat.textAlignment === 'Justify' && element instanceof TextElementBox) {
            this.splitTextElementWordByWord(element as TextElementBox);
        }
    }
    /**
     * Splits element for client area.
     * @param element
     */
    private splitElementForClientArea(paragraph: ParagraphWidget, element: ElementBox): void {
        let line: LineWidget = element.line;
        if (element.line.children.length > 0) {
            let previousElement: ElementBox = element.previousElement;
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


    /**
     * Splits by word
     * @param elementBox 
     * @param text 
     * @param width 
     * @param characterFormat 
     */
    // tslint:disable-next-line:max-line-length
    private splitByWord(lineWidget: LineWidget, paragraph: ParagraphWidget, elementBox: TextElementBox, text: string, width: number, characterFormat: WCharacterFormat): void {
        let index: number = this.getSplitIndexByWord(this.viewer.clientActiveArea.width, text, width, characterFormat);
        if (index > 0 && index < elementBox.length) {
            let indexOf: number = lineWidget.children.indexOf(elementBox);
            let lineIndex: number = paragraph.childWidgets.indexOf(lineWidget);
            let splittedElementBox: TextElementBox = new TextElementBox();
            text = text.substring(index);
            splittedElementBox.text = text;
            if (text[0] === ' ') {
                let prevLength: number = text.length;
                text = HelperMethods.trimStart(text);  //To trim white space at starting of the text.
                index += prevLength - text.length;
            }
            splittedElementBox.characterFormat.copyFormat(elementBox.characterFormat);
            splittedElementBox.width = this.documentHelper.textHelper.getWidth(splittedElementBox.text, characterFormat);
            splittedElementBox.trimEndWidth = splittedElementBox.width;
            elementBox.text = elementBox.text.substr(0, index);
            elementBox.width -= splittedElementBox.width;
            elementBox.trimEndWidth = elementBox.width;
            if (elementBox.revisions.length > 0) {
                this.updateRevisionForSpittedElement(elementBox, splittedElementBox, true);
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
    /**
     * Method to include error collection on splitted element
     * @private
     * @param {ElementBox} elementBox 
     * @param {ElementBox} splittedBox 
     */
    public splitErrorCollection(elementBox: TextElementBox, splittedBox: TextElementBox): void {
        if (elementBox.errorCollection.length > 0) {
            let errorCollection: ErrorTextElementBox[] = [];
            let ignoreItems: string[] = elementBox.ignoreOnceItems;
            for (let i: number = 0; i < elementBox.errorCollection.length; i++) {
                errorCollection.push(elementBox.errorCollection[i]);
            }
            for (let j: number = 0; j < elementBox.errorCollection.length; j++) {
                let index: number = elementBox.text.indexOf(elementBox.errorCollection[j].text);
                let textElement: ErrorTextElementBox = elementBox.errorCollection[j];
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
    /**
     * Splits by character.
     * @param textElement 
     * @param text 
     * @param width 
     * @param characterFormat 
     */
    // tslint:disable-next-line:max-line-length
    private splitByCharacter(lineWidget: LineWidget, textElement: TextElementBox, text: string, width: number, characterFormat: WCharacterFormat): void {
        let paragraph: ParagraphWidget = lineWidget.paragraph;
        // tslint:disable-next-line:max-line-length
        let index: number = this.getTextSplitIndexByCharacter(this.viewer.clientArea.width, this.viewer.clientActiveArea.width, text, width, characterFormat);
        let splitWidth: number = 0;
        if (index < textElement.length) {
            splitWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.substring(0, index), characterFormat);
            text = text.substring(index);
        }
        if (splitWidth > this.viewer.clientActiveArea.width && textElement.indexInOwner > 0) {
            this.addSplittedLineWidget(lineWidget, textElement.indexInOwner - 1);
            return;
        }
        let indexOf: number = lineWidget.children.indexOf(textElement);
        if (index < textElement.length) {
            let lineIndex: number = paragraph.childWidgets.indexOf(lineWidget);
            let splittedElement: TextElementBox = new TextElementBox();
            splittedElement.text = text;
            splittedElement.errorCollection = textElement.errorCollection;
            textElement.text = textElement.text.substr(0, index);
            splittedElement.characterFormat.copyFormat(textElement.characterFormat);
            splittedElement.width = this.documentHelper.textHelper.getWidth(splittedElement.text, characterFormat);
            splittedElement.trimEndWidth = splittedElement.width;
            textElement.width -= splittedElement.width;
            textElement.trimEndWidth = textElement.width;
            splittedElement.height = textElement.height;
            splittedElement.baselineOffset = textElement.baselineOffset;
            lineWidget.children.splice(textElement.indexInOwner + 1, 0, splittedElement);
            if (textElement.revisions.length > 0) {
                this.updateRevisionForSpittedElement(textElement, splittedElement, index > 0);
                splittedElement.isMarkedForRevision = textElement.isMarkedForRevision;
            }
            this.addSplittedLineWidget(lineWidget, indexOf);
            this.addElementToLine(paragraph, textElement);
            if (textElement.width === 0) {
                lineWidget.children.splice(indexOf, 1);
            }
        } else {
            //Adds the last text element on inline to line elements collection. 
            this.addSplittedLineWidget(lineWidget, indexOf);
            this.addElementToLine(paragraph, textElement);
        }
    }
    private updateRevisionForSpittedElement(item: TextElementBox, spittedElement: TextElementBox, isSpitted: boolean): void {
        if (item.revisions.length > 0) {
            for (let i: number = 0; i < item.revisions.length; i++) {
                let currentRevision: Revision = item.revisions[i];
                if (isSpitted) {
                    spittedElement.revisions.push(currentRevision);
                    let rangeIndex: number = currentRevision.range.length - 1;
                    if (currentRevision.range[rangeIndex] instanceof WCharacterFormat) {
                        currentRevision.range.splice(rangeIndex, 0, spittedElement);
                    } else {
                        rangeIndex = currentRevision.range.indexOf(item);
                        if (rangeIndex < 0) {
                            currentRevision.range.push(spittedElement);
                        } else {
                            currentRevision.range.splice(rangeIndex + 1, 0, spittedElement);
                        }
                    }
                } else {
                    currentRevision.range.splice(currentRevision.range.length - 1, 1);
                    currentRevision.range.push(spittedElement);
                    spittedElement.revisions.push(currentRevision);
                }
            }
        }
    }
    /**
     * Splits text element word by word.
     * @param textElement     
     */
    private splitTextElementWordByWord(textElement: TextElementBox): void {
        let lineWidget: LineWidget = textElement.line;
        let indexOf: number = lineWidget.children.indexOf(textElement);
        let text: string = textElement.text;
        let format: WCharacterFormat;
        let characterUptoWs: number = text.trim().indexOf(' ');
        if (characterUptoWs >= 0) {
            lineWidget.children.splice(indexOf, 1);
            format = textElement.characterFormat;
            let fontSize: number = format.fontSize;
            let index: number = textElement.length - HelperMethods.trimStart(text).length;  //Trim start
            while (index < textElement.length) {
                index = this.getTextIndexAfterSpace(text, index);
                if (index === 0 || index === textElement.length) {
                    break;
                }
                if (index < textElement.length) {
                    let splittedElement: TextElementBox = new TextElementBox();
                    let splittedText: string = text.substring(0, index);
                    text = text.substring(index);
                    if (text.substring(0, 1) === ' ') {
                        // start of the text is trimmed and its length is reduced from text length.                        
                        index += text.length - HelperMethods.trimStart(text).length;
                    }
                    splittedElement.text = splittedText;
                    splittedElement.characterFormat.copyFormat(textElement.characterFormat);
                    splittedElement.line = lineWidget;
                    splittedElement.width = this.documentHelper.textHelper.getWidth(splittedElement.text, format);
                    splittedElement.trimEndWidth = splittedElement.width;
                    splittedElement.height = textElement.height;
                    splittedElement.baselineOffset = textElement.baselineOffset;
                    lineWidget.children.splice(indexOf, 0, splittedElement);
                    textElement.text = text;
                    textElement.width -= splittedElement.width;
                    textElement.trimEndWidth = textElement.width;
                    if (textElement.width === 0) {
                        lineWidget.children.splice(lineWidget.children.indexOf(textElement), 1);
                    }
                    index = 0;
                    indexOf++;
                }
            }
            textElement.text = text;
            lineWidget.children.splice(indexOf, 0, textElement);
        }
    }
    /**
     * Splits text for client area.
     * @param element 
     * @param text 
     * @param width 
     * @param characterFormat 
     */
    // tslint:disable-next-line:max-line-length
    private splitTextForClientArea(lineWidget: LineWidget, element: TextElementBox, text: string, width: number, characterFormat: WCharacterFormat): void {
        let paragraph: ParagraphWidget = lineWidget.paragraph;
        let isSplitByWord: boolean = true;
        let index: number = -1;
        if (!(text.substring(0, 1) === ' ')) {
            let textWidth: number = width;
            let characterUptoWS: number = 0;
            characterUptoWS = HelperMethods.trimEnd(text).indexOf(' ') + 1;
            index = characterUptoWS;
            //Checks whether text not starts with white space. If starts with white space, no need to check previous text blocks.
            if (index > 0) {
                textWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.slice(0, index), characterFormat);
            }
            if (this.viewer.clientActiveArea.width < textWidth) {
                //Check and split the previous text elements to next line.            
                isSplitByWord = this.checkPreviousElement(lineWidget, lineWidget.children.indexOf(element), characterFormat);
                if (isSplitByWord) {
                    //lineWidget = paragraph.childWidgets[paragraph.childWidgets.indexOf(lineWidget) + 1] as LineWidget;
                    //isSplitByWord = textWidth <= this.viewer.clientActiveArea.width;
                    return;
                }
            }
        } else {
            index = 1;
        }
        if (width <= this.viewer.clientActiveArea.width) {
            //Fits the text in current line.
            this.addElementToLine(paragraph, element);
        } else if (isSplitByWord && (index > 0 || text.indexOf(' ') !== -1)) {
            this.splitByWord(lineWidget, paragraph, element, text, width, characterFormat);
        } else {
            this.splitByCharacter(lineWidget, element, text, width, characterFormat);
        }
    }
    /**
     * Handle tab or line break character splitting
     * @param  {LayoutViewer} viewer
     * @param  {TextElementBox} span
     * @param  {number} index
     * @param  {string} spiltBy
     * @private
     */
    public splitByLineBreakOrTab(viewer: LayoutViewer, span: TextElementBox, index: number, spiltBy: string): void {
        // Splits tab character to separate SpanAdv
        let inlineIndex: number = span.line.children.indexOf(span);
        let value: string = span.text;
        let remainder: string = value.substring(index);
        let newSpan: TabElementBox | TextElementBox = spiltBy === '\t' ? new TabElementBox() : new TextElementBox();
        newSpan.line = span.line;
        newSpan.characterFormat.copyFormat(span.characterFormat);
        span.line.children.splice(inlineIndex + 1, 0, newSpan);
        if (index > 0 && remainder.length === 1) {
            newSpan.text = value.substring(index);
            span.text = value.substring(0, index);
        } else if (index > 0) {
            newSpan.text = spiltBy;
            let newText: TextElementBox = new TextElementBox();
            newText.line = span.line;
            newText.text = value.substring(index + 1);
            newText.characterFormat.copyFormat(span.characterFormat);
            span.line.children.splice(inlineIndex + 2, 0, newText);
            span.text = value.substring(0, index);
        } else if (remainder !== '') {
            newSpan.text = value.substring(index + 1);
            span.text = spiltBy;
        }
    }
    /**
     * Moves to next line.
     */
    // tslint:disable:max-func-body-length    
    private moveToNextLine(line: LineWidget): void {
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
        this.updateLineWidget(line);
        height = this.maxTextHeight;
        maxDescent = height - this.maxTextBaseline;

        //Updates before spacing at the top of Paragraph first line.
        if (isParagraphStart) {
            beforeSpacing = this.getBeforeSpacing(paragraph);
            firstLineIndent = HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        //Updates after spacing at the bottom of Paragraph last line.
        if (isParagraphEnd) {
            afterSpacing = HelperMethods.convertPointToPixel(this.getAfterSpacing(paragraph));
        }

        if (!this.isBidiReLayout && (paraFormat.bidi || this.isContainsRtl(line))) {
            this.reArrangeElementsForRtl(line, paraFormat.bidi);
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
        if (paraFormat.lineSpacingType === 'Exactly'
            && lineSpacing < maxDescent + this.maxBaseline) {
            lineSpacing = maxDescent + this.maxBaseline;
        }
        let subWidth: number = 0;
        let whiteSpaceCount: number = 0;
        let textAlignment: TextAlignment = paraFormat.textAlignment;
        // calculates the sub width, for text alignments - Center, Right, Justify.
        // if the element is paragraph end and para bidi is true and text alignment is justify
        // we need to calculate subwidth and add it to the left margin of the element.
        if (textAlignment !== 'Left' && this.viewer.textWrap && (!(textAlignment === 'Justify' && isParagraphEnd)
            || (textAlignment === 'Justify' && paraFormat.bidi))) {
            // tslint:disable-next-line:max-line-length
            let getWidthAndSpace: SubWidthInfo = this.getSubWidth(line, textAlignment === 'Justify', whiteSpaceCount, firstLineIndent, isParagraphEnd);
            subWidth = getWidthAndSpace.subWidth;
            whiteSpaceCount = getWidthAndSpace.spaceCount;
        }
        let addSubWidth: boolean = false;
        let lineSpacingType: LineSpacingType = paraFormat.lineSpacingType;
        for (let i: number = 0; i < line.children.length; i++) {
            let topMargin: number = 0;
            let bottomMargin: number = 0;
            let leftMargin: number = 0;
            let elementBox: ElementBox = line.children[i];
            if (elementBox instanceof ShapeElementBox) {
                continue;
            }
            // tslint:disable-next-line:max-line-length
            let alignElements: LineElementInfo = this.alignLineElements(elementBox, topMargin, bottomMargin, maxDescent, addSubWidth, subWidth, textAlignment, whiteSpaceCount, i === line.children.length - 1);
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
            topMargin += beforeSpacing;
            bottomMargin += afterSpacing;
            if (i === 0 || (!(elementBox instanceof ShapeElementBox) && elementBox.previousElement instanceof ShapeElementBox)) {
                line.height = topMargin + elementBox.height + bottomMargin;
                if (textAlignment === 'Right' || (textAlignment === 'Justify' && paraFormat.bidi && isParagraphEnd)) {
                    //Aligns the text as right justified and consider subwidth for bidirectional paragrph with justify.
                    leftMargin = subWidth;
                } else if (textAlignment === 'Center') {
                    //Aligns the text as center justified.
                    leftMargin = subWidth / 2;
                }
            }
            elementBox.margin = new Margin(leftMargin, topMargin, 0, bottomMargin);
            elementBox.line = line;
        }
        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + line.height);
    }
    private updateLineWidget(line: LineWidget): void {
        for (let i: number = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i];
            if (element instanceof ShapeElementBox) {
                continue;
            }
            if (element instanceof TextElementBox || element instanceof ListTextElementBox) {
                if (this.maxTextHeight < element.height) {
                    this.maxTextHeight = element.height;
                    this.maxTextBaseline = element.baselineOffset;
                }
                if (this.maxBaseline < this.maxTextBaseline) {
                    this.maxBaseline = this.maxTextBaseline;
                }
            } else if (this.maxBaseline < element.height) {
                this.maxBaseline = element.height;
            }
        }
    }
    /**
     * @param viewer 
     */
    private moveToNextPage(viewer: LayoutViewer, line: LineWidget, isPageBreak?: boolean): void {
        let paragraphWidget: ParagraphWidget = line.paragraph;
        let index: number = 0;
        if (!isNullOrUndefined(line)) {
            index = paragraphWidget.childWidgets.indexOf(line);
            if (index > 0 || isPageBreak) {
                paragraphWidget.height = viewer.clientActiveArea.y - paragraphWidget.y;
            }
        }
        let nextBody: BodyWidget = this.moveBlocksToNextPage(paragraphWidget);
        this.viewer.updateClientArea(nextBody.sectionFormat, nextBody.page);
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
            nextParagraph = this.addParagraphWidget(this.viewer.clientActiveArea, nextParagraph);
            nextParagraph.index = paragraphWidget.index;
            let insertIndex: number = 0;
            for (let i: number = index; i < paragraphWidget.childWidgets.length; i++) {
                let lineWidget: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
                lineWidget.paragraph = nextParagraph;
                nextParagraph.childWidgets.splice(insertIndex, 0, lineWidget);
                lineWidget.paragraph = nextParagraph;
                insertIndex++;
            }
            nextParagraph.paragraphFormat = paragraphWidget.paragraphFormat;
            nextParagraph.characterFormat = paragraphWidget.characterFormat;
            paragraphWidget.childWidgets.splice(index);
            paragraphWidget = nextParagraph;
        } else if (!isPageBreak) {
            paragraphWidget.containerWidget.removeChild(paragraphWidget.indexInOwner);
        }
        if (!isPageBreak) {
            if (nextBody.childWidgets.indexOf(paragraphWidget) === -1) {
                nextBody.childWidgets.splice(0, 0, paragraphWidget);
            }
            paragraphWidget.containerWidget = nextBody;
            this.viewer.updateClientAreaLocation(paragraphWidget, this.viewer.clientActiveArea);
            if (index === 0 && !(line.children[0] instanceof ListTextElementBox)) {
                let firstLineIndent: number = -HelperMethods.convertPointToPixel(paragraphWidget.paragraphFormat.firstLineIndent);
                this.viewer.updateClientWidth(firstLineIndent);
            }
        }
    }
    /**
     * Aligns line elements
     * @param element 
     * @param topMargin 
     * @param bottomMargin 
     * @param maxDescent 
     * @param addSubWidth 
     * @param subWidth 
     * @param textAlignment 
     * @param whiteSpaceCount 
     * @param isLastElement 
     */
    // tslint:disable-next-line:max-line-length
    private alignLineElements(element: ElementBox, topMargin: number, bottomMargin: number, maxDescent: number, addSubWidth: boolean, subWidth: number, textAlignment: TextAlignment, whiteSpaceCount: number, isLastElement: boolean): LineElementInfo {
        if (element.width > 0 && (element instanceof TextElementBox || element instanceof ListTextElementBox)) {
            let textElement: TextElementBox = element instanceof TextElementBox ? element as TextElementBox : undefined;
            //Updates the text to base line offset.
            // tslint:disable-next-line:max-line-length
            let baselineOffset: number = element instanceof TextElementBox ? textElement.baselineOffset : (element as ListTextElementBox).baselineOffset;
            topMargin += this.maxBaseline - baselineOffset;
            bottomMargin += maxDescent - (element.height - baselineOffset);
            //Updates the text to base line offset.
            if (!isNullOrUndefined(textElement) && textAlignment === 'Justify' && whiteSpaceCount > 0) {
                //Aligns the text as Justified.
                let width: number = textElement.width;
                let text: string = textElement.text;
                if (!addSubWidth) {
                    text = HelperMethods.trimStart(text);  // trim start
                    addSubWidth = (text.length > 0);
                }
                if (addSubWidth) {
                    let spaceCount: number = text.length - HelperMethods.removeSpace(text).length;
                    if (isLastElement) {
                        spaceCount -= text.length - HelperMethods.trimEnd(text).length;
                    }
                    if (whiteSpaceCount < spaceCount) {
                        width = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text, textElement.characterFormat);
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
    /**
     * Updates widget to page.
     * @param viewer 
     * @param block 
     * @private
     */
    public updateWidgetToPage(viewer: LayoutViewer, paragraphWidget: ParagraphWidget): void {
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
                // tslint:disable-next-line:max-line-length
                if ([cellWidget].length <= 1 && paragraphWidget.associatedCell.ownerRow.rowFormat.heightType === 'AtLeast') {
                    cellWidget.height = Math.max(HelperMethods.convertPointToPixel(paragraphWidget.associatedCell.ownerRow.rowFormat.height), this.getCellContentHeight(cellWidget));
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
            if (!paragraphWidget.isEndsWithPageBreak || viewer instanceof WebLayoutViewer) {
                paragraphWidget.height = viewer.clientActiveArea.y - paragraphWidget.y;
            }
            //Adds the paragraph widget to the Header Footer/ Body widget.
            // this.updateWidgetsToBody(paragraphWidget, viewer, paragraphWidget);
            //For canvas no need to render paragraph widget here. In case of div, need to render paragraph here.
            // tslint:disable-next-line:max-line-length             
            // this.render.renderParagraphWidget((paragraphWidget.containerWidget as BodyWidget).page, paragraphWidget);
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
    /**
     * @private
     */
    public shiftFooterChildLocation(widget: HeaderFooterWidget, viewer: LayoutViewer): void {
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

    /**
     * Checks previous element.
     * @param characterFormat 
     */
    private checkPreviousElement(line: LineWidget, index: number, characterFormat: WCharacterFormat): boolean {
        let paragraph: ParagraphWidget = line.paragraph;
        let isSplitByWord: boolean = false;
        let lastTextElement: number = 0;
        for (let i: number = index - 1; i >= 0; i--) {
            let textElement: ElementBox = line.children[i] as ElementBox;
            if (textElement instanceof TextElementBox && textElement.width > 0) {
                let text: string = textElement.text;
                lastTextElement = i;
                if (text.length > 0 && text[text.length - 1] === ' ') {
                    if (i === index - 1) {
                        this.addSplittedLineWidget(line, index - 1);
                        return true;
                    }
                    isSplitByWord = true;
                    break;
                } else if (text === '\t') {
                    return false;
                } else if (text.indexOf(' ') >= 0) {
                    isSplitByWord = true;
                    let index: number = text.lastIndexOf(' ') + 1;
                    //Splits the text element by space.
                    let splittedElement: TextElementBox = new TextElementBox();
                    splittedElement.text = text.substr(index);
                    splittedElement.characterFormat.copyFormat(textElement.characterFormat);
                    textElement.text = text.substr(0, index);
                    this.documentHelper.textHelper.getTextSize(splittedElement, characterFormat);
                    textElement.width -= splittedElement.width;
                    textElement.height = splittedElement.height;
                    if (textElement.width === 0) {
                        line.children.splice(i, 1);
                    }
                    //Adds the text element to the line
                    line.children.splice(i + 1, 0, splittedElement);
                    break;
                }
            } else if (!(textElement instanceof ListTextElementBox || textElement instanceof FieldElementBox
                // to skip field code
                || textElement instanceof TextElementBox && textElement.width === 0)) {
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
                this.viewer.updateClientWidth(splitWidth);
            }
        }
        return isSplitByWord;
    }
    /**
     * @private
     */
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
     * Gets list number.
     * @param listFormat 
     * @param document 
     * @private
     */
    public getListNumber(listFormat: WListFormat, isAutoList?: boolean): string {
        let list: WList = this.documentHelper.getListById(listFormat.listId);
        let levelNumber: number = listFormat.listLevelNumber;
        let listLevel: WListLevel = this.getListLevel(list, listFormat.listLevelNumber);
        // tslint:disable-next-line:max-line-length
        let levelOverride: WLevelOverride = !isNullOrUndefined(list.levelOverrides) ? list.levelOverrides[levelNumber] as WLevelOverride : undefined;
        // If LevelOverride exists and have either override list level or StartAtOverride, then only list numbering will be restarted.
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(levelOverride) && this.documentHelper.renderedLevelOverrides.indexOf(levelOverride) === -1 && isNullOrUndefined(levelOverride.overrideListLevel)) {
            //Add List Override style
            this.documentHelper.renderedLevelOverrides.push(levelOverride);
            if (this.documentHelper.renderedLists.containsKey(this.documentHelper.getAbstractListById(list.abstractListId))) {
                // tslint:disable-next-line:max-line-length
                let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(this.documentHelper.getAbstractListById(list.abstractListId));
                if (levels.containsKey(levelNumber)) {
                    levels.remove(levelNumber);
                }
            }
        }
        if (isNullOrUndefined(isAutoList)) {
            this.updateListValues(list, levelNumber);
        }
        return this.getListText(list, levelNumber, listLevel);
    }
    /**
     * Gets list start value
     * @param listLevelNumber 
     * @param list 
     * @private
     */
    public getListStartValue(listLevelNumber: number, list: WList): number {
        // tslint:disable-next-line:max-line-length
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
    /**
     * Updates list values.
     * @param list 
     * @param listLevelNumber 
     * @param document 
     */
    private updateListValues(list: WList, listLevelNumber: number): void {
        if (!this.documentHelper.renderedLists.containsKey(this.documentHelper.getAbstractListById(list.abstractListId))) {
            let startVal: Dictionary<number, number> = new Dictionary<number, number>();
            this.documentHelper.renderedLists.add(this.documentHelper.getAbstractListById(list.abstractListId), startVal);
            let listLevel: WListLevel = this.getListLevel(list, listLevelNumber);
            for (let i: number = 0; i <= listLevelNumber; i++) {
                startVal.add(i, this.getListStartValue(i, list));
            }
        } else {
            // tslint:disable-next-line:max-line-length
            let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(this.documentHelper.getAbstractListById(list.abstractListId));
            if (levels.containsKey(listLevelNumber)) {
                let startAt: number = levels.get(listLevelNumber);
                levels.set(listLevelNumber, startAt + 1);
                let levelNumber: number = listLevelNumber + 1;
                while (levelNumber < this.documentHelper.getAbstractListById(list.abstractListId).levels.length) {
                    let listLevel: WListLevel = this.getListLevel(list, levelNumber);
                    // if (!isNullOrUndefined(listLevel)) {
                    if (levels.containsKey(levelNumber) && listLevel.restartLevel > listLevelNumber) {
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
    /**
     * Gets list text
     * @param listAdv 
     * @param listLevelNumber 
     * @param currentListLevel 
     * @param document 
     */
    private getListText(listAdv: WList, listLevelNumber: number, currentListLevel: WListLevel): string {
        let listText: string = currentListLevel.numberFormat;
        // tslint:disable-next-line:max-line-length
        if (this.documentHelper.renderedLists.containsKey(this.documentHelper.getAbstractListById(listAdv.abstractListId))) {
            let levels: Dictionary<number, number> = this.documentHelper.renderedLists.get(this.documentHelper.getAbstractListById(listAdv.abstractListId));
            let keys: number[] = levels.keys;
            for (let i: number = 0; i < keys.length; i++) {
                let levelNumber: number = keys[i];
                let levelKey: string = '%' + (levelNumber + 1).toString();
                let listLevel: WListLevel = this.getListLevel(listAdv, levelNumber);
                if (listText.match(levelKey)) {
                    if (levelNumber > listLevelNumber) {
                        return '';
                    } else if (levels.containsKey(levelNumber) && !isNullOrUndefined(listLevel)) {
                        listText = listText.replace(levelKey, this.getListTextListLevel(listLevel, levels.get(levelNumber)));
                    } else {
                        listText = listText.replace(levelKey, '0');
                    }
                }
            }
        }
        return listText;
    }
    /**
     * Gets the roman letter.
     * @param number 
     * @private
     */
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
    /**
     * Gets list text using list level pattern.
     * @param listLevel 
     * @param listValue 
     * @private
     */
    public getListTextListLevel(listLevel: WListLevel, listValue: number): string {
        switch (listLevel.listLevelPattern) {
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
                return (listValue).toString();
            case 'Ordinal':
                return (listValue).toString();
            case 'FarEast':
                return (listValue).toString();
            case 'Special':
                return (listValue).toString();
            default:
                return '';
        }
    }
    /**
     * Generate roman number for the specified number.
     * @param number 
     * @param magnitude 
     * @param letter 
     */
    private generateNumber(number: number, magnitude: number, letter: string): string {
        let numberstring: string = '';
        while (number >= magnitude) {
            number -= magnitude;
            numberstring += letter;
            this.value = number;
        }
        return numberstring.toString();
    }
    /**
     * Gets list value prefixed with zero, if less than 10
     * @param listValue 
     */
    private getAsLeadingZero(listValue: number): string {
        if (listValue < 10) {
            return '0' + listValue.toString();
        } else {
            return listValue.toString();
        }
    }
    /**
     * Gets the roman number
     * @param number 
     * @private
     */
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

    /**
     * Gets the list level
     * @param list 
     * @param listLevelNumber 
     * @private
     */
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
                && !isNullOrUndefined(((levelOverrideAdv = list.levelOverrides[listLevelNumber] as WLevelOverride)))
                && (!isNullOrUndefined(levelOverrideAdv.overrideListLevel));
            if (level) {
                return levelOverrideAdv.overrideListLevel;
            } else if (!isNullOrUndefined(abstractList) && listLevelNumber >= 0 && listLevelNumber < abstractList.levels.length) {
                return abstractList.levels[listLevelNumber] as WListLevel;
            }
        }
        return undefined;
    }
    /**
     * Gets tab width
     * @param paragraph 
     * @param viewer 
     */
    // tslint:disable-next-line:max-line-length
    private getTabWidth(paragraph: ParagraphWidget, viewer: LayoutViewer, index: number, lineWidget: LineWidget, element: TabElementBox | ListTextElementBox): number {
        let elementWidth: number = element ? this.documentHelper.textHelper.getTextSize(element as TextElementBox, element.characterFormat) : 0;
        let fPosition: number = 0;
        let isCustomTab: boolean = false;
        let tabs: WTabStop[] = paragraph.paragraphFormat.getUpdatedTabs();
        let isList: boolean = false;
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(paragraph.paragraphFormat.listFormat.listLevel) && !isNullOrUndefined(paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat)) {
            let listFormat: WParagraphFormat = paragraph.paragraphFormat.listFormat.listLevel.paragraphFormat;
            if (paragraph.paragraphFormat.leftIndent !== listFormat.leftIndent) {
                isList = true;
            }
        }
        let clientWidth: number = 0;
        let clientActiveX: number = viewer.clientActiveArea.x;
        let firstLineIndent: number = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent);
        if (!isNullOrUndefined(element) && lineWidget.isFirstLine()) {
            clientWidth = this.viewer.clientArea.x + firstLineIndent;
            clientActiveX = clientActiveX + firstLineIndent;
        } else {
            clientWidth = this.viewer.clientArea.x;
        }
        if (clientActiveX < clientWidth) {
            return viewer.clientArea.x - viewer.clientActiveArea.x;
        }
        // Calculates tabwidth based on pageleftmargin and defaulttabwidth property
        let leftIndent: number = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.leftIndent);
        let position: number = viewer.clientActiveArea.x -
            (viewer.clientArea.x - HelperMethods.convertPointToPixel(paragraph.paragraphFormat.leftIndent));
        let defaultTabWidth: number = HelperMethods.convertPointToPixel(this.documentHelper.defaultTabWidth);
        if (tabs.length === 0) {
            if (position > 0 && defaultTabWidth > position && isList ||
                defaultTabWidth === this.defaultTabWidthPixel && defaultTabWidth > position) {
                return defaultTabWidth - position;
            }
            return defaultTabWidth;
        } else {
            if (tabs.length > 0) {
                for (let i: number = 0; i < tabs.length; i++) {
                    let tabStop: WTabStop = tabs[i];
                    let tabPosition: number = HelperMethods.convertPointToPixel(tabs[i].position);
                    if ((position + elementWidth) < tabPosition) {
                        isCustomTab = true;
                        if (tabStop.tabJustification === 'Left' || tabStop.tabJustification === 'List') {
                            fPosition = tabPosition;
                            if (element instanceof TabElementBox) {
                                element.tabLeader = tabs[i].tabLeader;
                                element.tabText = '';
                            }
                            break;
                        } else {
                            let tabWidth: number = tabPosition - position;
                            let width: number = this.getRightTabWidth(element.indexInOwner + 1, lineWidget, paragraph);
                            if (width < tabWidth) {
                                if (tabStop.tabJustification === 'Right') {
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
                            } else if (tabStop.tabJustification === 'Center' && (width / 2) < tabWidth) {
                                defaultTabWidth = tabWidth - width / 2;
                            } else {
                                defaultTabWidth = tabStop.tabJustification === 'Right' ? 0 : elementWidth;
                            }
                            fPosition = position;
                            if (element instanceof TabElementBox) {
                                element.tabLeader = tabs[i].tabLeader;
                                element.tabText = '';
                            }
                            break;
                        }
                    }
                }
            }
            if (!isCustomTab) {
                let diff: number = ((Math.round(position) * 100) % (Math.round(defaultTabWidth) * 100)) / 100;
                let cnt: number = (Math.round(position) - diff) / Math.round(defaultTabWidth);
                fPosition = (cnt + 1) * defaultTabWidth;
            }
            return (fPosition - position) > 0 ? fPosition - position : defaultTabWidth;
        }
    }
    /**
     * Returns the right tab width
     * @param index - index of starting inline
     * @param lineWidget - current line widget
     * @param paragraph - current paragraph widget
     */
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
                if (elementBox instanceof TextElementBox) {
                    this.documentHelper.textHelper.getTextSize(elementBox, elementBox.characterFormat);
                }
            }
            if (elementBox instanceof TextElementBox && (elementBox as TextElementBox).text === '\t') {
                return width;
            } else {
                width = width + elementBox.width;
            }
            elementBox = elementBox.nextNode;
        }
        return width;
    }

    /**
     * Gets split index by word.
     * @param clientActiveWidth 
     * @param text 
     * @param width 
     * @param characterFormat 
     */
    private getSplitIndexByWord(clientActiveWidth: number, text: string, width: number, characterFormat: WCharacterFormat): number {
        let index: number = 0;
        let length: number = text.length;
        while (index < length) {
            let nextIndex: number = this.getTextIndexAfterSpace(text, index);
            if (nextIndex === 0 || nextIndex === length) {
                nextIndex = length - 1;
            }
            let splitWidth: number = width;
            if ((nextIndex < length - 1 || (nextIndex === length - 1 && text[nextIndex - 1] === ' ')) && index !== nextIndex) {
                splitWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.slice(0, nextIndex), characterFormat);
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
    /**
     * Gets split index by character
     * @param totalClientWidth 
     * @param clientActiveAreaWidth 
     * @param text 
     * @param width 
     * @param characterFormat 
     */
    // tslint:disable-next-line:max-line-length
    private getTextSplitIndexByCharacter(totalClientWidth: number, clientActiveAreaWidth: number, text: string, width: number, characterFormat: WCharacterFormat): number {
        let length: number = text.length;
        for (let i: number = 0; i < length; i++) {
            let splitWidth: number = width;
            if (i + 1 < length) {
                splitWidth = this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(text.substring(0, i + 1), characterFormat);
            }
            if (splitWidth > clientActiveAreaWidth) {
                if (i === 0 && splitWidth > totalClientWidth) {
                    //Handle for cell/section having client width less than a character's width.
                    return (length > 1 && text[1] === ' ') ? this.getTextIndexAfterSpace(text, 1) : 1;
                }
                return i;
            }
        }
        return 0;
    }
    /**
     * Gets sub width.
     * @param justify 
     * @param spaceCount 
     * @param firstLineIndent 
     */
    // tslint:disable-next-line:max-line-length
    private getSubWidth(lineWidget: LineWidget, justify: boolean, spaceCount: number, firstLineIndent: number, isParagraphEnd: boolean): SubWidthInfo {
        let width: number = 0;
        let trimSpace: boolean = true;
        let lineText: string = '';
        for (let i: number = lineWidget.children.length - 1; i >= 0; i--) {
            let element: ElementBox = lineWidget.children[i];
            if (element.width > 0 && element instanceof TextElementBox) {
                let elementText: string = (element as TextElementBox).text;
                lineText = elementText + lineText;
                if (trimSpace && (elementText.trim() !== '' || elementText === '\t')) {
                    if (HelperMethods.endsWith(elementText)) {
                        width += this.documentHelper.textHelper.measureTextExcludingSpaceAtEnd(elementText, element.characterFormat);
                    } else {
                        width += element.width;
                    }
                    trimSpace = false;
                } else if (!trimSpace) {
                    width += element.width;
                }
            } else {
                lineText = 'a' + lineText;
                trimSpace = false;
                width += element.width;
            }
            if (!justify) {
                width = Math.round(width);
            }
        }
        lineText = lineText.trim();
        spaceCount = lineText.length - HelperMethods.removeSpace(lineText).length;
        let subWidth: number = (this.viewer.clientArea.width - firstLineIndent - width);
        if (subWidth <= 0 || (spaceCount === 0 && justify && !lineWidget.paragraph.paragraphFormat.bidi)) {
            spaceCount = 0;
            subWidth = 0;
        } else if (justify) {
            // For justify alignment, element width will be updated based space count value.
            // So when the element is paragraph end, need to set space count to zero.
            if (!isParagraphEnd && spaceCount > 0) {
                subWidth = subWidth / spaceCount;
            } else {
                spaceCount = 0;
            }

        }
        return { 'subWidth': subWidth, 'spaceCount': spaceCount };
    }
    /**
     * Gets before spacing.
     * @param paragraph 
     * @private
     */
    public getBeforeSpacing(paragraph: ParagraphWidget): number {
        let beforeSpacing: number = 0;
        if (paragraph.previousWidget instanceof ParagraphWidget
            && !this.documentHelper.dontUseHtmlParagraphAutoSpacing) {
            let afterSpacing: number = this.getAfterSpacing(paragraph.previousWidget);
            if (afterSpacing < paragraph.paragraphFormat.beforeSpacing) {
                // tslint:disable-next-line:max-line-length
                beforeSpacing = paragraph.paragraphFormat.beforeSpacing - afterSpacing;
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
        if (this.isSameStyle(paragraph, true)) {
            return 0;
        } else {
            return afterSpacing;
        }
    }
    /**
     * Gets line spacing.
     * @param paragraph 
     * @param maxHeight 
     * @private
     */
    public getLineSpacing(paragraph: ParagraphWidget, maxHeight: number): number {
        if (isNullOrUndefined(paragraph.paragraphFormat)) {
            return 0;
        }
        let lineSpacing: number = 0;
        switch (paragraph.paragraphFormat.lineSpacingType) {
            case 'AtLeast':
            case 'Exactly':
                lineSpacing = paragraph.paragraphFormat.lineSpacing;
                break;
            default:
                lineSpacing = paragraph.paragraphFormat.lineSpacing * maxHeight;
                break;
        }
        return lineSpacing;
    }
    /**
     * Checks whether current line is first line in a paragraph.
     * @param paragraph 
     */
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
    /**
     * Checks whether current line is last line in a paragraph.
     * @param paragraph 
     */
    private isParagraphLastLine(element: ElementBox): boolean {
        let paragraph: ParagraphWidget = element.line.paragraph;
        let lastLineWidget: LineWidget = paragraph.childWidgets[paragraph.childWidgets.length - 1] as LineWidget;
        let lastInline: ElementBox = lastLineWidget.children[lastLineWidget.children.length - 1];
        if (element === lastInline) {
            // tslint:disable-next-line:max-line-length            
            return (lastInline instanceof FieldElementBox) || ((!(lastInline instanceof TextElementBox && (lastInline as TextElementBox).text === '\v')));
        }
        return false;
    }

    /**
     * Gets text index after space.
     * @param text 
     * @param startIndex 
     */
    private getTextIndexAfterSpace(text: string, startIndex: number): number {
        let length: number = text.length;
        let index: number = 0;
        index = text.indexOf(' ', startIndex) + 1;
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
    /**
     * @private
     */
    public moveNextWidgetsToTable(tableWidget: TableWidget[], rowWidgets: TableRowWidget[], moveFromNext: boolean): void {
        let currentRow: TableRowWidget = moveFromNext ? rowWidgets[rowWidgets.length - 2] : rowWidgets[rowWidgets.length - 1];
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
    /**
     * Adds table cell widget.
     * @param cell 
     * @param area 
     * @param maxCellMarginTop 
     * @param maxCellMarginBottom 
     */
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
                // tslint:disable-next-line:max-line-length
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
        cell.margin = new Margin(left, top, right, bottom);
        cell.width = HelperMethods.convertPointToPixel(cell.cellFormat.cellWidth);
        if (!isNullOrUndefined(cell.previousWidget)) {
            // tslint:disable-next-line:max-line-length
            prevColumnIndex = (cell.previousWidget as TableCellWidget).columnIndex + (cell.previousWidget as TableCellWidget).cellFormat.columnSpan;
        }
        // tslint:disable-next-line:max-line-length
        cellspace = !isNullOrUndefined(cell.ownerTable) && !isNullOrUndefined(cell.ownerTable.tableFormat) ? HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing) : 0;
        let prevSpannedCellWidth: number = 0;
        if (prevColumnIndex < cell.columnIndex) {
            // tslint:disable-next-line:max-line-length
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
        cell.leftBorderWidth = !cell.ownerTable.isBidiTable ? leftBorderWidth : rightBorderWidth;
        let isLeftStyleNone: boolean = (cell.cellFormat.borders.left.lineStyle === 'None');
        let isRightStyleNone: boolean = (cell.cellFormat.borders.right.lineStyle === 'None');
        cell.x += (!isLeftStyleNone) ? 0 : (cell.leftBorderWidth > 0) ? 0 : cell.leftBorderWidth;
        cell.width -= (!isLeftStyleNone) ? 0 : (cell.leftBorderWidth > 0) ? 0 : cell.leftBorderWidth;
        let lastCell: boolean = !cell.ownerTable.isBidiTable ? cell.cellIndex === cell.ownerRow.childWidgets.length - 1
            : cell.cellIndex === 0;
        if (cellspace > 0 || cell.columnIndex === cell.ownerTable.tableHolder.columns.length - 1 ||
            (cell.columnIndex === (cell.containerWidget as TableRowWidget).childWidgets.length - 1 && cell.cellFormat.columnSpan > 1)) {
            cell.rightBorderWidth = !cell.ownerTable.isBidiTable ? rightBorderWidth : leftBorderWidth;
            if (!cell.ownerTable.tableFormat.allowAutoFit) {
                cell.width -= cell.rightBorderWidth;
            }
        }
        //Add the border widths to respective margin side.
        //cell.margin.left += (isLeftStyleNone) ? 0 : (cell.leftBorderWidth);
        cell.margin.right += (isRightStyleNone) ? 0 : (cell.rightBorderWidth);
        //cell.ownerWidget = owner;
        return cell;
    }
    /**
     * Adds specified row widget to table.
     * @param viewer 
     * @param tableRowWidget 
     * @param row 
     */
    // tslint:disable-next-line:max-line-length
    private addWidgetToTable(viewer: LayoutViewer, tableCollection: TableWidget[], rowCollection: TableRowWidget[], row: TableRowWidget, endRowWidget?: TableRowWidget, isInitialLayout?: boolean): void {
        //Adds table row widget to owner table widget.
        let tableWidget: TableWidget = tableCollection[0] as TableWidget;
        let index: number = tableWidget.childWidgets.length;
        let prevWidget: TableRowWidget = undefined;
        let rowWidgetIndex: number = rowCollection.indexOf(row);
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
        }
        row.containerWidget = tableWidget;
        tableWidget.height = tableWidget.height + row.height;
        // Shift the widgets for Right to left directed table.
        if (tableWidget.isBidiTable) {
            row.shiftWidgetForRtlTable(this.viewer.clientArea, tableWidget, row);
        }
        if (this.viewer instanceof PageLayoutViewer) {
            if (!isNullOrUndefined(tableWidget.containerWidget)
                && tableWidget.containerWidget.childWidgets.indexOf(tableWidget) >= 0 &&
                !(tableWidget.containerWidget instanceof HeaderFooterWidget)) {
                tableWidget.containerWidget.height += row.height;
            }
        }
        this.updateHeightForRowWidget(viewer, false, tableCollection, rowCollection, row, false, endRowWidget, isInitialLayout);
        viewer.cutFromTop(row.y + row.height);
    }
    /**
     * Updates row height by spanned cell.
     * @param tableWidget 
     * @param rowWidget 
     * @param insertIndex 
     * @param row 
     * @private
     */
    public updateRowHeightBySpannedCell(tableWidget: TableWidget, row: TableRowWidget, insertIndex: number): void {
        let rowSpan: number = 1;
        if (tableWidget.childWidgets.length === 0 || insertIndex === 0) {
            this.updateRowHeight(row, row);
            return;
        }
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            // tslint:disable-next-line:max-line-length
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
    /**
     * Updates row height.
     * @param prevRowWidget 
     * @param rowWidget 
     * @param row 
     */
    private updateRowHeight(prevRowWidget: TableRowWidget, row: TableRowWidget): void {
        let rowIndex: number = row.index;
        let rowSpan: number = 1;
        for (let i: number = 0; i < prevRowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = prevRowWidget.childWidgets[i] as TableCellWidget;
            // tslint:disable-next-line:max-line-length
            rowSpan = (isNullOrUndefined(cellWidget) || isNullOrUndefined(cellWidget.cellFormat)) ? rowSpan : cellWidget.cellFormat.rowSpan;
            //To update Row height- if row has row span value greater than 1, need to add it in spannedRowCollection            
            this.updateSpannedRowCollection(rowSpan, row, cellWidget);
            if (rowIndex - cellWidget.rowIndex === rowSpan - 1) {
                let mergedCellHeight: number = cellWidget.y + cellWidget.height + cellWidget.margin.bottom - row.y;
                if (row.height < mergedCellHeight) {
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
    /**
     * Updates row height by cell spacing
     * @param rowWidget 
     * @param viewer 
     * @param row 
     */
    private updateRowHeightByCellSpacing(tableCollection: TableWidget[], row: TableRowWidget, viewer: LayoutViewer): void {
        if (row.ownerTable.tableFormat.cellSpacing > 0) {
            // In the Case of tableWidget is greater than one and rowWidget is start at the Top Position of the page. 
            // In such case we have update the row height with half of cell spacing.
            // Remaining cases we have to update the entire hight
            // tslint:disable-next-line:max-line-length
            if (tableCollection.length > 1 && row.y === viewer.clientArea.y && viewer instanceof PageLayoutViewer) {
                row.height = row.height - HelperMethods.convertPointToPixel(row.ownerTable.tableFormat.cellSpacing) / 2;
            }
        }
    }
    /**
     * Checks whether row span is end.
     * @param row 
     * @param viewer 
     */
    private isRowSpanEnd(row: TableRowWidget, viewer: LayoutViewer): boolean {
        let rowIndex: number = row.index;
        let rowSpan: number = 1;
        for (let i: number = 0; i < this.documentHelper.splittedCellWidgets.length; i++) {
            let splittedCell: TableCellWidget = this.documentHelper.splittedCellWidgets[i];
            // tslint:disable-next-line:max-line-length
            rowSpan = (isNullOrUndefined(splittedCell) || isNullOrUndefined(splittedCell.cellFormat)) ? rowSpan : splittedCell.cellFormat.rowSpan;
            if (rowIndex - splittedCell.rowIndex === rowSpan - 1) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks whether vertical merged cell to continue or not.
     * @param row 
     * @private
     */
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
    /**
     * Splits widgets.
     * @param tableRowWidget 
     * @param viewer 
     * @param splittedWidget 
     * @param row 
     */
    // tslint:disable-next-line:max-line-length
    private splitWidgets(tableRowWidget: TableRowWidget, viewer: LayoutViewer, tableCollection: TableWidget[], rowCollection: TableRowWidget[], splittedWidget: TableRowWidget, isLastRow: boolean): TableRowWidget {
        if (this.isFirstLineFitForRow(viewer.clientArea.bottom, tableRowWidget) && tableRowWidget.childWidgets.length > 0) {
            splittedWidget = this.getSplittedWidgetForRow(viewer.clientArea.bottom, tableCollection, rowCollection, tableRowWidget);
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
    /**
     * Gets splitted widget for row.
     * @param bottom 
     * @param tableRowWidget 
     */
    // tslint:disable-next-line:max-line-length
    private getSplittedWidgetForRow(bottom: number, tableCollection: TableWidget[], rowCollection: TableRowWidget[], tableRowWidget: TableRowWidget): TableRowWidget {
        let splittedWidget: TableRowWidget = undefined;
        let rowIndex: number = tableRowWidget.index;
        for (let i: number = 0; i < tableRowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = tableRowWidget.childWidgets[i] as TableCellWidget;
            let splittedCell: TableCellWidget = this.getSplittedWidget(bottom, true, tableCollection, rowCollection, cellWidget);
            if (!isNullOrUndefined(splittedCell)) {
                if (splittedCell === cellWidget) {
                    //Returns if the whole content of the row does not fit in current page.
                    return tableRowWidget;
                }
                if (tableRowWidget.childWidgets.indexOf(splittedCell) !== -1) {
                    tableRowWidget.childWidgets.splice(tableRowWidget.childWidgets.indexOf(splittedCell), 1);
                }
                if (i === 0 || tableRowWidget.height < cellWidget.height + cellWidget.margin.top + cellWidget.margin.bottom) {
                    tableRowWidget.height = cellWidget.height + cellWidget.margin.top + cellWidget.margin.bottom;
                }
                if (isNullOrUndefined(splittedWidget)) {
                    //Creates new widget, to hold the splitted contents.
                    splittedWidget = new TableRowWidget();
                    splittedWidget.containerWidget = tableRowWidget.containerWidget;
                    splittedWidget.index = tableRowWidget.index;
                    splittedWidget.rowFormat = tableRowWidget.rowFormat;
                    this.updateWidgetLocation(tableRowWidget, splittedWidget);
                    // splittedWidget.height = 0;
                    rowCollection.push(splittedWidget);
                }
                let rowSpan: number = 1;
                // tslint:disable-next-line:max-line-length
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
            }

        }
        return splittedWidget;
    }

    /**
     * Updates widget to table.
     * @param row 
     * @param viewer 
     */
    /* tslint:disable */
    public updateWidgetsToTable(tableWidgets: TableWidget[], rowWidgets: TableRowWidget[], row: TableRowWidget): void {
        let rowHeight: number = this.getRowHeight(row, [row]);
        let viewer: LayoutViewer = this.viewer;
        //initializing row properties with default values.
        let isHeader: boolean = row.rowFormat.isHeader;
        let isAllowBreakAcrossPages: boolean = row.rowFormat.allowBreakAcrossPages;
        let heightType: HeightType = row.rowFormat.heightType;
        let cellSpacing: number = 0;
        let count: number = 0;
        let tableRowWidget: TableRowWidget = row;
        let moveRowToNextTable: boolean = false;
        if (row.ownerTable.continueHeader && !isHeader) {
            row.ownerTable.continueHeader = false;
        }
        let isInitialLayout: boolean = row.ownerTable.isInsideTable;
        let isLastRow: boolean = false;
        cellSpacing = (!isNullOrUndefined(row.ownerTable) && !isNullOrUndefined(row.ownerTable.tableFormat)) ? HelperMethods.convertPointToPixel(row.ownerTable.tableFormat.cellSpacing) : 0;
        while (count < rowWidgets.length) {
            count = rowWidgets.length;
            if (row.ownerTable.isInsideTable || (this.documentHelper.splittedCellWidgets.length === 0 && tableRowWidget.y + tableRowWidget.height + cellSpacing <= viewer.clientArea.bottom)) {
                if (this.isVerticalMergedCellContinue(row) && (tableRowWidget.y === viewer.clientArea.y
                    || tableRowWidget.y === this.viewer.clientArea.y + tableRowWidget.ownerTable.headerHeight)) {
                    this.insertSplittedCellWidgets(viewer, tableWidgets, tableRowWidget, tableRowWidget.index - 1);
                }
                this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, undefined, isInitialLayout);
                if (this.documentHelper.splittedCellWidgets.length > 0 && isNullOrUndefined(rowWidgets[rowWidgets.length - 1].nextRow)) {
                    count--;
                    isLastRow = true;
                }
                isInitialLayout = false;
            } else {
                isInitialLayout = false;
                //Split widget for next page
                if (this.documentHelper.splittedCellWidgets.length > 0 && tableRowWidget.y + tableRowWidget.height <= viewer.clientArea.bottom) {
                    let isRowSpanEnd: boolean = this.isRowSpanEnd(row, viewer);
                    if (!isRowSpanEnd) {
                        if (this.isVerticalMergedCellContinue(row) && (tableRowWidget.y === viewer.clientArea.y
                            || tableRowWidget.y === this.viewer.clientArea.y + tableRowWidget.ownerTable.headerHeight)) {
                            this.insertSplittedCellWidgets(viewer, tableWidgets, tableRowWidget, tableRowWidget.indexInOwner - 1);
                        }
                        this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget);
                        continue;
                    }
                }
                let splittedWidget: TableRowWidget = tableRowWidget;
                let tableWidget: TableWidget = tableWidgets[tableWidgets.length - 1] as TableWidget;
                if (rowHeight + tableRowWidget.y > viewer.clientArea.bottom) {
                    // tslint:disable-next-line:max-line-length
                    if (!isAllowBreakAcrossPages || (isHeader && row.ownerTable.continueHeader) || (heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) < viewer.clientArea.bottom)) {
                        // tslint:disable-next-line:max-line-length
                        if ((heightType === 'AtLeast' && HelperMethods.convertPointToPixel(row.rowFormat.height) < viewer.clientActiveArea.height && isAllowBreakAcrossPages) || (heightType !== 'Exactly' && tableRowWidget.y === viewer.clientArea.y) || (heightType === 'Auto' && isAllowBreakAcrossPages)) {
                            splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow);
                        }
                        if (heightType === 'Exactly' && tableRowWidget.y === viewer.clientArea.y) {
                            this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget);
                            count++;
                        }
                        if (isHeader && row.ownerTable.continueHeader) {
                            row.ownerTable.header = false;
                            row.ownerTable.continueHeader = false;
                            row.ownerTable.headerHeight = 0;
                            let pages: Page[] = undefined;
                            if (viewer instanceof PageLayoutViewer) {
                                pages = this.documentHelper.pages;
                            }
                            if (!isNullOrUndefined(pages)) {
                                for (let i: number = 0; i < pages.length; i++) {
                                    if (pages[i].repeatHeaderRowTableWidget) {
                                        pages[i].repeatHeaderRowTableWidget = false;
                                    }
                                }
                            }
                        }
                    } else {
                        if ((heightType === 'Auto' || heightType === 'AtLeast') && isAllowBreakAcrossPages) {
                            // tslint:disable-next-line:max-line-length
                            if (!(HelperMethods.convertPointToPixel(row.rowFormat.height) > viewer.clientArea.bottom) || tableRowWidget.y === viewer.clientArea.y) {
                                splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow);
                            }
                        } else if (heightType === 'Exactly' && tableRowWidget.y === viewer.clientArea.y) {
                            this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget);
                            count++;
                        }
                    }
                } else {
                    let isInsertSplittedWidgets: boolean = false;
                    // Splitting handled for the merged cell with allowRowBreakAcross pages. 
                    if (this.isVerticalMergedCellContinue(row) && (isAllowBreakAcrossPages ||
                        (isInsertSplittedWidgets = (tableRowWidget.y === viewer.clientArea.y
                            || tableRowWidget.y === this.viewer.clientArea.y + tableRowWidget.ownerTable.headerHeight)))) {
                        if (isInsertSplittedWidgets) {
                            this.insertSplittedCellWidgets(viewer, tableWidgets, splittedWidget, tableRowWidget.indexInOwner - 1);
                        } else {
                            splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow);
                        }
                    } else if (isLastRow && !isAllowBreakAcrossPages) {
                        splittedWidget = this.splitWidgets(tableRowWidget, viewer, tableWidgets, rowWidgets, splittedWidget, isLastRow);
                    }
                }
                //Create New table for splitted widget
                if (!isNullOrUndefined(splittedWidget)) {
                    if (splittedWidget !== tableRowWidget) {
                        this.addWidgetToTable(viewer, tableWidgets, rowWidgets, tableRowWidget, tableRowWidget.nextRow);
                        //Updates the fitted table rows to current page.
                        this.updateWidgetsToPage(tableWidgets, rowWidgets, row.ownerTable, tableRowWidget.nextRow);
                        let index: number = tableWidgets.indexOf(tableRowWidget.containerWidget as TableWidget);
                        if (index + 1 >= tableWidgets.length) {
                            //Creates new table widget for splitted rows.
                            this.addTableWidget(viewer.clientActiveArea, tableWidgets, true);
                        }
                        tableRowWidget = splittedWidget;
                    } else {
                        if (row.index > 0) {
                            //Updates the fitted table rows to current page.
                            this.updateWidgetsToPage(tableWidgets, rowWidgets, row.ownerTable, row);
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
                        }
                        moveRowToNextTable = true;
                        count--;
                    }
                    tableWidget = tableWidgets[tableWidgets.length - 1] as TableWidget;
                    let prevBodyWidget: BodyWidget = undefined;
                    if (tableWidgets.length > 1) {
                        //Get Previous Splitted Widget container
                        prevBodyWidget = (tableWidgets[tableWidgets.length - 2] as TableWidget).containerWidget as BodyWidget;
                    } else {
                        let previousBlock: BlockWidget = row.ownerTable.previousRenderedWidget as BlockWidget;
                        prevBodyWidget = previousBlock.containerWidget as BodyWidget;
                    }

                    let pageIndex: number = 0;
                    if (!isNullOrUndefined(prevBodyWidget)) {
                        pageIndex = this.documentHelper.pages.indexOf(prevBodyWidget.page);
                    }

                    let index: number = (row.ownerTable.containerWidget as BodyWidget).index;
                    let bodyWidget: BodyWidget;
                    let block: BlockWidget
                    if (moveRowToNextTable && tableWidgets.length === 1) {
                        block = tableWidgets[tableWidgets.length - 1];
                    } else {
                        block = tableWidgets[tableWidgets.length - 2];
                    }
                    bodyWidget = this.moveBlocksToNextPage(block);
                    let curretTable: TableWidget = tableWidgets[tableWidgets.length - 1];
                    //Move Next RowWidge to next page
                    if (moveRowToNextTable) {
                        // tslint:disable-next-line:max-line-length
                        if (row.index === 0 && curretTable.containerWidget && curretTable.containerWidget.childWidgets.indexOf(curretTable) !== -1) {
                            curretTable.containerWidget.childWidgets.splice(curretTable.containerWidget.childWidgets.indexOf(curretTable), 1);
                        }
                    }
                    if (bodyWidget.childWidgets.indexOf(curretTable) !== -1) {
                        bodyWidget.childWidgets.splice(bodyWidget.childWidgets.indexOf(curretTable), 1);
                    }
                    bodyWidget.childWidgets.unshift(curretTable);
                    curretTable.containerWidget = bodyWidget;
                    if (moveRowToNextTable && row.index > 0 || rowWidgets.length > 1) {
                        this.moveNextWidgetsToTable(tableWidgets, rowWidgets, !moveRowToNextTable);
                    }
                    moveRowToNextTable = false;
                    if (row.ownerTable.header && tableRowWidget.height < viewer.clientArea.bottom) {
                        if (viewer instanceof PageLayoutViewer) {
                            (viewer as PageLayoutViewer).documentHelper.currentRenderingPage.repeatHeaderRowTableWidget = true;
                        }
                        //Updates table widgets location.
                        viewer.updateClientAreaForBlock(row.ownerTable, true, tableWidgets);
                        // tslint:disable-next-line:max-line-length
                        //Update splitted row widget location. if header is repeated update the y position of splitted widget to header height.
                        splittedWidget.x = splittedWidget.x;
                        splittedWidget.y = tableWidget.y + row.ownerTable.headerHeight;
                        // let cellspace: number = viewer instanceof PageLayoutViewer ? cellspacing / 2 : cellspacing;
                        let cellspace: number = cellSpacing / 2;
                        this.updateChildLocationForRow(tableWidget.y + row.ownerTable.headerHeight - cellspace, splittedWidget);
                    } else {
                        //Updates table widgets location.
                        viewer.updateClientAreaForBlock(row.ownerTable, true, tableWidgets);
                        // tslint:disable-next-line:max-line-length
                        //Update splitted row widget location. if header is repeated update the y position of splitted widget to header height.
                        splittedWidget.x = splittedWidget.x;
                        splittedWidget.y = tableWidget.y;
                        // let cellspace: number = viewer instanceof PageLayoutViewer ? cellspacing / 2 : cellspacing;
                        let cellspace: number = cellSpacing / 2;
                        this.updateChildLocationForRow(tableWidget.y - cellspace, splittedWidget);
                    }
                }
                isLastRow = false;
            }
            if (isHeader && row.ownerTable.continueHeader) {
                row.ownerTable.header = true;
                row.ownerTable.headerHeight = rowHeight + row.ownerTable.headerHeight;
            }
            if (isHeader && !isNullOrUndefined(this.getHeader(row.ownerTable)) && row.index === this.getHeader(row.ownerTable).index) {
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
            if (tableWidgets.length > 2 && row.ownerTable.header && tableRowWidget.height < viewer.clientActiveArea.bottom &&
                !(viewer as PageLayoutViewer).documentHelper.currentRenderingPage.repeatHeaderRowTableWidget) {
                (viewer as PageLayoutViewer).documentHelper.currentRenderingPage.repeatHeaderRowTableWidget = true;
            }
        }
    }

    /* tslint:enable */
    /**
     * Gets header.
     * @param table 
     * @private
     */
    public getHeader(table: TableWidget): TableRowWidget {
        let header: TableRowWidget = undefined;
        let flag: boolean = true;
        table = table.getSplitWidgets()[0] as TableWidget;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
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
    /**
     * Gets header height.
     * @param ownerTable 
     * @param row 
     */
    private getHeaderHeight(ownerTable: TableWidget, row: TableRowWidget, rowCollection: TableRowWidget[]): number {
        let height: number = 0;
        if (row.ownerTable.childWidgets.length > 0 && (ownerTable.childWidgets[0] as TableRowWidget).rowFormat.isHeader) {
            for (let i: number = 0; i < ownerTable.childWidgets.length; i++) {
                let row: TableRowWidget = ownerTable.childWidgets[i] as TableRowWidget;
                if (row.rowFormat.isHeader) {
                    height = height + this.getRowHeight(row, rowCollection);
                } else {
                    break;
                }
            }
        }
        return height;
    }
    /**
     * Updates widgets to row.
     * @param cell 
     */
    private updateWidgetToRow(cell: TableCellWidget): void {
        let viewer: LayoutViewer = this.viewer;
        //Adds table cell widget to owner row widget.
        let rowWidget: TableRowWidget = cell.ownerRow as TableRowWidget;
        let cellLeft: number = rowWidget.x;
        if (rowWidget.childWidgets.length > 0) {
            let lastWidget: TableCellWidget = rowWidget.childWidgets[rowWidget.childWidgets.length - 1] as TableCellWidget;
            cellLeft = lastWidget.x + lastWidget.width + lastWidget.margin.right;
        }
        // rowWidget.childWidgets.push(cell);
        cell.containerWidget = rowWidget;
        //If the row height is set as Atleast then height is set to atleast height for the first cell of the row.
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(cell.ownerRow) && cell.ownerRow.rowFormat.heightType !== 'Exactly' && HelperMethods.convertPointToPixel(cell.ownerRow.rowFormat.height) > 0 && cell.cellIndex === 0) {
            rowWidget.height = rowWidget.height + HelperMethods.convertPointToPixel(cell.ownerRow.rowFormat.height);
        }
        //Add condition not cell merged vertically.
        if (cell.cellFormat.rowSpan === 1) {
            let cellHeight: number = cell.height + cell.margin.top + cell.margin.bottom;
            if (rowWidget.height - HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing) < cellHeight) {
                rowWidget.height = cellHeight + HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing);
            }
        }
    }
    /**
     * Updates height for row widget.
     * @param viewer
     * @param isUpdateVerticalPosition
     * @param rowWidget
     */
    // tslint:disable-next-line:max-line-length
    private updateHeightForRowWidget(viewer: LayoutViewer, isUpdateVerticalPosition: boolean, tableCollection: TableWidget[], rowCollection: TableRowWidget[], rowWidget: TableRowWidget, isLayouted: boolean, endRowWidget?: TableRowWidget, isInitialLayout?: boolean): void {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let cellspacing: number = 0;
            let cellWidget: TableCellWidget = undefined;
            let childWidget: IWidget = rowWidget.childWidgets[i];
            // if (childWidget instanceof TableCellWidget) {
            cellWidget = childWidget as TableCellWidget;
            // }
            let rowSpan: number = 1;
            rowSpan = cellWidget.cellFormat.rowSpan;
            cellspacing = HelperMethods.convertPointToPixel(cellWidget.ownerTable.tableFormat.cellSpacing);
            if (rowSpan > 1) {
                let currentRowWidgetIndex: number = rowWidget.containerWidget.childWidgets.indexOf(rowWidget);
                // tslint:disable-next-line:max-line-length
                let rowSpanWidgetEndIndex: number = currentRowWidgetIndex + rowSpan - 1 - (rowWidget.index - cellWidget.rowIndex);
                if (!isInitialLayout && (viewer.clientArea.bottom < cellWidget.y + cellWidget.height + cellWidget.margin.bottom
                    || rowSpanWidgetEndIndex >= currentRowWidgetIndex + 1) && (rowCollection.length === 1
                        || rowCollection.length >= 1 && rowWidget === rowCollection[rowCollection.length - 1])) {
                    this.splitSpannedCellWidget(cellWidget, tableCollection, rowCollection, viewer);
                }
                let spanEndRowWidget: TableRowWidget = rowWidget;
                if (rowSpanWidgetEndIndex > 0) {
                    if (rowSpanWidgetEndIndex < rowWidget.containerWidget.childWidgets.length) {
                        let childWidget: IWidget = rowWidget.containerWidget.childWidgets[rowSpanWidgetEndIndex];
                        if (childWidget instanceof TableRowWidget) {
                            spanEndRowWidget = childWidget as TableRowWidget;
                            if (spanEndRowWidget === endRowWidget) {
                                spanEndRowWidget = rowWidget;
                            }
                        }
                    } else {
                        // tslint:disable-next-line:max-line-length
                        spanEndRowWidget = rowWidget.containerWidget.childWidgets[rowWidget.containerWidget.childWidgets.length - 1] as TableRowWidget;
                    }
                }
                if (cellWidget.y + cellWidget.height + cellWidget.margin.bottom < spanEndRowWidget.y + spanEndRowWidget.height) {
                    cellWidget.height = spanEndRowWidget.y + spanEndRowWidget.height - cellWidget.y - cellWidget.margin.bottom;
                    // tslint:disable-next-line:max-line-length
                } else if (isLayouted && spanEndRowWidget && (spanEndRowWidget.y !== 0 && spanEndRowWidget.height !== 0) && cellWidget.y + cellWidget.height + cellWidget.margin.bottom > spanEndRowWidget.y + spanEndRowWidget.height) {
                    spanEndRowWidget.height = cellWidget.y + cellWidget.height + cellWidget.margin.bottom - spanEndRowWidget.y;
                    // tslint:disable-next-line:max-line-length
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
                    // tslint:disable-next-line:max-line-length
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
            // tslint:disable-next-line:max-line-length
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
    /**
     * Updates height for cell widget.
     * @param viewer 
     * @param cellWidget 
     */
    // tslint:disable-next-line:max-line-length
    private updateHeightForCellWidget(viewer: LayoutViewer, tableWidget: TableWidget[], rowCollection: TableRowWidget[], cellWidget: TableCellWidget): void {
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof TableWidget) {
                this.updateHeightForTableWidget(tableWidget, rowCollection, cellWidget.childWidgets[i] as TableWidget);
            }
        }
    }
    /**
     * Gets row height.
     * @param row 
     * @private
     */
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
    /**
     * splits spanned cell widget.
     * @param cellWidget 
     * @param viewer 
     */
    // tslint:disable-next-line:max-line-length
    private splitSpannedCellWidget(cellWidget: TableCellWidget, tableCollection: TableWidget[], rowCollection: TableRowWidget[], viewer: LayoutViewer): void {
        let splittedCell: TableCellWidget = this.getSplittedWidget(viewer.clientArea.bottom, false, tableCollection, rowCollection, cellWidget);
        if (!isNullOrUndefined(splittedCell)) {
            //Adds the splitted contents of a vertical merged cell, in order preserve in next page.
            this.documentHelper.splittedCellWidgets.push(splittedCell);
        }
    }
    /**
     * Inserts splitted cell widgets.
     * @param viewer 
     * @param rowWidget 
     */
    // tslint:disable-next-line:max-line-length
    private insertSplittedCellWidgets(viewer: LayoutViewer, tableCollection: TableWidget[], rowWidget: TableRowWidget, previousRowIndex: number): void {
        let left: number = rowWidget.x;
        let tableWidth: number = 0;
        tableWidth = HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableHolder.tableWidth);
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            if (Math.round(left) < Math.round(cellWidget.x - cellWidget.margin.left)) {
                if (this.insertRowSpannedWidget(rowWidget, viewer, left, i)) {
                    i--;
                    continue;
                }
                let length: number = rowWidget.childWidgets.length;
                this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, i, previousRowIndex);
                if (length < rowWidget.childWidgets.length) {
                    i--;
                    continue;
                }
            }
            left += cellWidget.margin.left + cellWidget.width + cellWidget.margin.right;
            if (i === rowWidget.childWidgets.length - 1 && Math.round(left) < Math.round(rowWidget.x + tableWidth)) {
                if (this.insertRowSpannedWidget(rowWidget, viewer, left, i + 1)) {
                    continue;
                }
                this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, i + 1, previousRowIndex);
                continue;
            }
        }
        // tslint:disable-next-line:max-line-length
        // Special case: when the child widgets of row is equal to 0 then the splitted widgets in the viewer is added in the table row widgets. 
        if ((isNullOrUndefined(rowWidget.childWidgets) || rowWidget.childWidgets.length === 0) && this.documentHelper.splittedCellWidgets.length > 0) {
            for (let j: number = 0; j < this.documentHelper.splittedCellWidgets.length; j++) {
                let widget: TableCellWidget = this.documentHelper.splittedCellWidgets[j] as TableCellWidget;
                if (Math.round(left) <= Math.round(widget.x - widget.margin.left)) {
                    if (this.insertRowSpannedWidget(rowWidget, viewer, left, j)) {
                        j--;
                        continue;
                    }
                    let count: number = rowWidget.childWidgets.length;
                    this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, j, previousRowIndex);
                    if (count < rowWidget.childWidgets.length) {
                        j--;
                        continue;
                    }
                }
                left += widget.margin.left + widget.width + widget.margin.right;
                if (j === rowWidget.childWidgets.length - 1 && Math.round(left) <
                    Math.round(rowWidget.x + tableWidth)) {
                    if (this.insertRowSpannedWidget(rowWidget, viewer, left, j + 1)) { continue; }
                    this.insertEmptySplittedCellWidget(rowWidget, tableCollection, left, j + 1, previousRowIndex);
                    continue;
                }
            }
        }
        if (this.documentHelper.splittedCellWidgets.length > 0) {
            this.documentHelper.splittedCellWidgets = [];
        }
    }
    /**
     * Inserts spanned row widget.
     * @param rowWidget 
     * @param viewer 
     * @param left 
     * @param index 
     */
    private insertRowSpannedWidget(rowWidget: TableRowWidget, viewer: LayoutViewer, left: number, index: number): boolean {
        let cellSpacing: number = 0;
        if (rowWidget.ownerTable.tableFormat.cellSpacing > 0) {
            cellSpacing = HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableFormat.cellSpacing);
        }
        for (let i: number = 0; i < this.documentHelper.splittedCellWidgets.length; i++) {
            let splittedCell: TableCellWidget = this.documentHelper.splittedCellWidgets[i];
            if (Math.round(left) === Math.round(splittedCell.x - splittedCell.margin.left)) {
                rowWidget.childWidgets.splice(index, 0, splittedCell);
                splittedCell.containerWidget = rowWidget;
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
    /**
     * Inserts empty splitted cell widgets.
     * @param rowWidget 
     * @param left 
     * @param index 
     */
    // tslint:disable-next-line:max-line-length
    private insertEmptySplittedCellWidget(currentRow: TableRowWidget, tableCollection: TableWidget[], left: number, index: number, previousRowIndex: number): void {
        let tableWidget: TableWidget = tableCollection[tableCollection.length - 1];
        let previousRow: TableRowWidget;
        for (let j: number = tableCollection.length - 1; j >= 0; j--) {
            let table: TableWidget = tableCollection[j];
            for (let z: number = table.childWidgets.length - 1; z >= 0; z--) {
                let row: TableRowWidget = table.childWidgets[z] as TableRowWidget;
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
            let rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            let previousLeft: number = rowWidget.x;
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                let rowSpan: number = 1;
                let cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                if (Math.round(left) === Math.round(previousLeft)) {
                    rowSpan = (isNullOrUndefined(cellWidget) || isNullOrUndefined(cellWidget.cellFormat)) ? rowSpan :
                        cellWidget.cellFormat.rowSpan;
                    if (rowSpan > 1) {
                        let emptyCellWidget: TableCellWidget = this.createCellWidget(cellWidget);
                        currentRow.childWidgets.splice(index, 0, emptyCellWidget);
                        emptyCellWidget.containerWidget = currentRow;
                        this.updateChildLocationForRow(currentRow.y, currentRow);
                        return;
                    }
                }
                previousLeft += cellWidget.margin.left + cellWidget.width + cellWidget.margin.right;
            }
        }
    }
    /**
     * Gets spllited widget.
     * @param bottom 
     * @param splitMinimalWidget 
     * @param cellWidget
     */
    // tslint:disable-next-line:max-line-length
    private getSplittedWidget(bottom: number, splitMinimalWidget: boolean, tableCollection: TableWidget[], rowCollection: TableRowWidget[], cellWidget: TableCellWidget): TableCellWidget {
        let splittedWidget: TableCellWidget = undefined;
        if (cellWidget.y + cellWidget.height > bottom - cellWidget.margin.bottom) {
            for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
                if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                    let paragraphWidget: ParagraphWidget = cellWidget.childWidgets[i] as ParagraphWidget;
                    let splittedPara: ParagraphWidget = this.getSplittedWidgetForPara(bottom - cellWidget.margin.bottom, paragraphWidget);
                    if (!isNullOrUndefined(splittedPara)) {
                        if (i === 0 && splittedPara === paragraphWidget) {
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
                    let tableWidget: TableWidget = cellWidget.childWidgets[i] as TableWidget;
                    let tableCol: TableWidget[] = [tableWidget];
                    //Check for nested table.
                    if (bottom - cellWidget.margin.bottom < tableWidget.y + tableWidget.height) {
                        let tableHeight: number = tableWidget.height;
                        // tslint:disable-next-line:max-line-length
                        let splittedTable: TableWidget = this.getSplittedWidgetForTable(bottom - cellWidget.margin.bottom, tableCol, tableWidget);
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
                    }
                }
            }
        }
        if (isNullOrUndefined(splittedWidget) && splitMinimalWidget) {
            //Creates new widget, to hold the splitted contents.
            splittedWidget = this.createCellWidget(cellWidget);
        }
        return splittedWidget;
    }
    /**
     * Gets list level pattern
     * @param value 
     * @private
     */
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
    /**
     * Creates cell widget.
     * @param cell 
     */
    private createCellWidget(cell: TableCellWidget): TableCellWidget {
        let cellWidget: TableCellWidget = new TableCellWidget();
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
    /**
     * Create Table Widget
     */
    private createTableWidget(table: TableWidget): TableWidget {
        let newTable: TableWidget = new TableWidget();
        if (table.header) {
            newTable.header = table.header;
            newTable.headerHeight = table.headerHeight;
        }
        newTable.index = table.index;
        newTable.tableFormat = table.tableFormat;
        newTable.tableHolder = table.tableHolder;
        newTable.isGridUpdated = table.isGridUpdated;
        return newTable;
    }
    /**
     * Gets splitted widget for paragraph.
     * @param bottom 
     * @param paragraphWidget 
     */
    private getSplittedWidgetForPara(bottom: number, paragraphWidget: ParagraphWidget): ParagraphWidget {
        let lineBottom: number = paragraphWidget.y;
        let splittedWidget: ParagraphWidget = undefined;
        for (let i: number = 0; i < paragraphWidget.childWidgets.length; i++) {
            let lineWidget: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
            if (bottom < lineBottom + lineWidget.height) {
                if (i === 0) {
                    if (lineWidget.paragraph.containerWidget instanceof TableCellWidget) {
                        //checks first line of the page is exceed the page height
                        if (lineWidget.paragraph.containerWidget.y === paragraphWidget.y) {
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
            lineBottom += lineWidget.height;
        }
        return splittedWidget;
    }
    /**
     * Gets splitted table widget.
     * @param bottom 
     * @param tableWidget 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getSplittedWidgetForTable(bottom: number, tableCollection: TableWidget[], tableWidget: TableWidget): TableWidget {
        let rowBottom: number = tableWidget.y;
        let splittedWidget: TableWidget = undefined;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = undefined;
            let childWidget: IWidget = tableWidget.childWidgets[i];
            // if (childWidget instanceof TableRowWidget) {
            rowWidget = childWidget as TableRowWidget;
            // }
            let rowHeight: number = rowWidget.height;
            if (bottom < rowBottom + rowHeight || !isNullOrUndefined(splittedWidget)) {
                //ToDo: Check whether row included in vertical merge or AllowRowSplitbyPage is true, if so split row.
                //Checks if atleast first line fits in the client area.                
                let splittedRow: TableRowWidget = undefined;
                let allowRowBreakAcrossPages: boolean = true;
                if (!isNullOrUndefined(rowWidget) && !isNullOrUndefined(rowWidget.rowFormat)) {
                    allowRowBreakAcrossPages = rowWidget.rowFormat.allowBreakAcrossPages;
                }
                if (allowRowBreakAcrossPages) {
                    // tslint:disable-next-line:max-line-length
                    splittedRow = (isNullOrUndefined(splittedWidget) && this.isFirstLineFitForRow(bottom, rowWidget)) ? this.getSplittedWidgetForRow(bottom, tableCollection, [rowWidget], rowWidget) : rowWidget;
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
    /**
     * Checks whether first line fits for paragraph or not.
     * @param bottom 
     * @param paraWidget 
     */
    private isFirstLineFitForPara(bottom: number, paraWidget: ParagraphWidget): boolean {
        let lineWidget: LineWidget = paraWidget.childWidgets[0] as LineWidget;
        let cellwidget: TableCellWidget = lineWidget.paragraph.containerWidget as TableCellWidget;
        // let document: WordDocument = undefined;
        // if (!isNullOrUndefined(lineWidget.paragraph.currentNode) && !isNullOrUndefined(cellwidget.containerWidget)) {
        //     document = WordDocument.getDocumentOf(lineWidget.paragraph.currentNode);
        // }
        //checks first line of the page is exceed the page height
        if (this.documentHelper.isFirstLineFitInShiftWidgets) {
            if (this.viewer.clientActiveArea.y === this.viewer.clientArea.y && paraWidget.y + lineWidget.height >= bottom) {
                return true;
            }
        } else {
            // For nested tables,
            if (cellwidget.ownerTable.isInsideTable) {
                // Gets the container cell widgets, consider it as client area for the cell widget.
                let containerCellWidget: TableCellWidget = undefined;
                if (cellwidget.containerWidget instanceof TableRowWidget &&
                    cellwidget.containerWidget.containerWidget instanceof TableWidget
                    && cellwidget.containerWidget.containerWidget.containerWidget instanceof TableCellWidget) {
                    containerCellWidget = cellwidget.containerWidget.containerWidget.containerWidget as TableCellWidget;
                }
                if (!isNullOrUndefined(containerCellWidget) && cellwidget.containerWidget.y === containerCellWidget.y
                    && paraWidget.y + lineWidget.height >= bottom) {
                    return true;
                }
            } else if (cellwidget.containerWidget.y === this.viewer.clientArea.y && paraWidget.y + lineWidget.height >= bottom) {
                return true;
            }
        }
        return (paraWidget.y + lineWidget.height <= bottom);
    }
    /**
     * Checks whether first line fits for table or not.
     * @param bottom
     * @param tableWidget
     * @private
     */
    public isFirstLineFitForTable(bottom: number, tableWidget: TableWidget): boolean {
        let rowWidget: TableRowWidget = undefined;
        let isFit: boolean = false;
        let childWidget: IWidget = tableWidget.childWidgets[0];
        // if (childWidget instanceof TableRowWidget) {
        rowWidget = childWidget as TableRowWidget;
        // }
        if (!isNullOrUndefined(rowWidget)) {
            isFit = this.isFirstLineFitForRow(bottom, rowWidget);
        }
        return isFit;
    }
    /**
     * Checks whether first line fits for row or not.
     * @param bottom
     * @param rowWidget
     */
    private isFirstLineFitForRow(bottom: number, rowWidget: TableRowWidget): boolean {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            if (!this.isFirstLineFitForCell(bottom, cellWidget)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks whether first line fits for cell or not.
     * @param bottom
     * @param cellWidget
     */
    private isFirstLineFitForCell(bottom: number, cellWidget: TableCellWidget): boolean {
        if (cellWidget.childWidgets.length === 0) {
            return true;
        }
        if (cellWidget.childWidgets[0] instanceof ParagraphWidget) {
            let paraWidget: ParagraphWidget = cellWidget.childWidgets[0] as ParagraphWidget;
            return this.isFirstLineFitForPara(bottom - cellWidget.margin.bottom, paraWidget);
        } else {
            let tableWidget: TableWidget = cellWidget.childWidgets[0] as TableWidget;
            return this.isFirstLineFitForTable(bottom - cellWidget.margin.bottom, tableWidget);
        }
    }
    /**
     * Updates widget location.
     * @param widget 
     * @param table 
     */
    private updateWidgetLocation(widget: Widget, table: Widget): void {
        table.x = widget.x;
        table.y = widget.y;
        table.width = widget.width;
    }
    /**
     * Updates child location for table.
     * @param top
     * @param tableWidget
     * @private
     */
    public updateChildLocationForTable(top: number, tableWidget: TableWidget): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            rowWidget.x = rowWidget.x;
            rowWidget.y = top;
            this.updateChildLocationForRow(top, rowWidget);
            top += rowWidget.height;
        }
    }
    /**
     * Updates child location for row.
     * @param top
     * @param rowWidget
     * @private
     */
    public updateChildLocationForRow(top: number, rowWidget: TableRowWidget): void {
        let spacing: number = 0;
        if (rowWidget.ownerTable.tableFormat.cellSpacing > 0) {
            spacing = HelperMethods.convertPointToPixel(rowWidget.ownerTable.tableFormat.cellSpacing);
        }
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            cellWidget.x = cellWidget.x;
            cellWidget.y = top + cellWidget.margin.top + spacing;
            this.updateChildLocationForCell(cellWidget.y, cellWidget);
        }
    }
    /**
     * Updates child location for cell.
     * @param top
     * @param cellWidget
     */
    private updateChildLocationForCell(top: number, cellWidget: TableCellWidget): void {
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            (cellWidget.childWidgets[i] as Widget).x = (cellWidget.childWidgets[i] as Widget).x;
            (cellWidget.childWidgets[i] as Widget).y = top;
            if (cellWidget.childWidgets[i] instanceof TableWidget) {
                this.updateChildLocationForTable(top, (cellWidget.childWidgets[i] as TableWidget));
            }
            top += (cellWidget.childWidgets[i] as Widget).height;
        }
    }
    /**
     * Updates cell vertical position.
     * @param cellWidget
     * @param isUpdateToTop
     * @param isInsideTable
     * @private
     */
    public updateCellVerticalPosition(cellWidget: TableCellWidget, isUpdateToTop: boolean, isInsideTable: boolean): void {
        if (cellWidget.ownerTable.containerWidget instanceof BodyWidget || isInsideTable) {
            let displacement: number = this.getDisplacement(cellWidget, isUpdateToTop);
            //Update Y position alone for the child widget of cell
            this.updateCellContentVerticalPosition(cellWidget, displacement, isUpdateToTop);
        }
    }
    /**
     * Updates cell content vertical position.
     * @param cellWidget
     * @param displacement
     * @param isUpdateToTop
     */
    private updateCellContentVerticalPosition(cellWidget: TableCellWidget, displacement: number, isUpdateToTop: boolean): void {
        if (displacement === 0) {
            return;
        }
        let location: number = cellWidget.y + displacement;
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                (cellWidget.childWidgets[i] as ParagraphWidget).y = location;
            } else {
                location = this.updateTableWidgetLocation(cellWidget.childWidgets[i] as TableWidget, location, isUpdateToTop);
            }
            location = location + (cellWidget.childWidgets[i] as Widget).height;
        }
    }
    /**
     * Updates table widget location.
     * @param tableWidget
     * @param location
     * @param isUpdateToTop
     */
    private updateTableWidgetLocation(tableWidget: TableWidget, location: number, isUpdateToTop: boolean): number {
        tableWidget.y = location = location + tableWidget.topBorderWidth;
        let cellSpacing: number = 0;
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            rowWidget.y = location;
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                let cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                cellWidget.y = location + cellWidget.margin.top + cellSpacing;
                this.updateCellVerticalPosition(cellWidget, isUpdateToTop, true);
            }
            location = location + rowWidget.height;
        }
        return location;
    }
    /**
     * Gets displacement.
     * @param cellWidget
     * @param isUpdateToTop
     */
    private getDisplacement(cellWidget: TableCellWidget, isUpdateToTop: boolean): number {
        //Gets the height of row
        let rowHeight: number = 0;
        let rowWidget: TableRowWidget = cellWidget.containerWidget as TableRowWidget;
        let padding: number = cellWidget.margin.top + cellWidget.margin.bottom;
        if (!isNullOrUndefined(cellWidget.cellFormat) && cellWidget.cellFormat.rowSpan > 1) {
            rowHeight = cellWidget.height;
        } else {
            rowHeight = ((!isNullOrUndefined(rowWidget) ? rowWidget.height : 0) - padding);
        }
        //Gets the height of content within the cell
        let cellContentHeight: number = this.getCellContentHeight(cellWidget);
        //Displacement field holds the value which has reduced from rowHeight and cellContentHeight
        let displacement: number = 0;
        if (rowHeight > cellContentHeight) {
            displacement = rowHeight - cellContentHeight;
            if (cellWidget.cellFormat.verticalAlignment === 'Center') {
                displacement = displacement / 2;
            } else if ((cellWidget.cellFormat.verticalAlignment === 'Top' || isUpdateToTop)) {
                displacement = 0;
            }
        }
        return displacement;
    }
    /**
     * Gets cell content height.
     * @param cellWidget
     */
    private getCellContentHeight(cellWidget: TableCellWidget): number {
        if (isNullOrUndefined(cellWidget.childWidgets)) {
            return 0;
        }
        let contentHeight: number = 0;
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                contentHeight += (cellWidget.childWidgets[i] as ParagraphWidget).height;
            } else {
                contentHeight += (cellWidget.childWidgets[i] as TableWidget).height;
            }
        }
        return contentHeight;
    }
    /**
     * Gets table left borders.
     * @param borders
     * @private
     */
    public getTableLeftBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.left)) {
            return borders.left;
        } else {
            let border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }
    /**
     * Gets table right border.
     * @param borders
     * @private
     */
    public getTableRightBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.right)) {
            return borders.right;
        } else {
            let border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }
    /**
     * Get table top border.
     * @param borders
     * @private
     */
    public getTableTopBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.top)) {
            return borders.top;
        } else {
            let border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }
    /**
     * Gets table bottom border.
     * @param borders
     * @private
     */
    public getTableBottomBorder(borders: WBorders): WBorder {
        if (!isNullOrUndefined(borders.bottom)) {
            return borders.bottom;
        } else {
            let border: WBorder = new WBorder(borders);
            border.lineStyle = 'Single';
            border.lineWidth = 0.66;
            return border;
        }
    }
    /**
     * Get diagonal cell up border.
     * @param tableCell
     * @private
     */
    public getCellDiagonalUpBorder(tableCell: TableCellWidget): WBorder {
        let diagonalUpBorder: WBorder = undefined;
        let cellBorder: WBorders = undefined;
        cellBorder = tableCell.cellFormat.borders;
        diagonalUpBorder = cellBorder.diagonalUp;
        return diagonalUpBorder;
    }
    /**
     * Gets diagonal cell down border
     * @param tableCell
     * @private
     */
    public getCellDiagonalDownBorder(tableCell: TableCellWidget): WBorder {
        let diagonalDownBorder: WBorder = undefined;
        let cellBorder: WBorders = undefined;
        cellBorder = tableCell.cellFormat.borders;
        diagonalDownBorder = cellBorder.diagonalDown;
        return diagonalDownBorder;
    }
    /**
     * Gets table width.
     * @param table
     * @private
     */
    public getTableWidth(table: TableWidget): number {
        let width: number = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowWidth: number = 0;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                rowWidth += HelperMethods.convertPointToPixel(cell.cellFormat.cellWidth);
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    //#region shifting
    /**
     * @private
     */
    public layoutNextItemsBlock(blockAdv: BlockWidget, viewer: LayoutViewer): void {
        let sectionIndex: number = blockAdv.bodyWidget.sectionIndex;
        let block: BlockWidget = blockAdv;
        let splittedWidget: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        let nextBlock: BlockWidget = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        if (isNullOrUndefined(nextBlock) || this.documentHelper.blockToShift === block) {
            this.documentHelper.blockToShift = undefined;
        }
        let updateNextBlockList: boolean = true;
        while (nextBlock instanceof BlockWidget && nextBlock.bodyWidget.sectionIndex === sectionIndex) {
            let currentWidget: Widget = undefined;
            let blocks: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
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
            // tslint:disable-next-line:max-line-length
            if (this.documentHelper.fieldStacks.length === 0 && !isNullOrUndefined(nextWidget) && currentWidget.containerWidget === nextWidget.containerWidget
                && (HelperMethods.round(nextWidget.y, 2) === HelperMethods.round(currentWidget.y + currentWidget.height, 2))) {
                if (!isNullOrUndefined(this.documentHelper.blockToShift)) {
                    this.documentHelper.blockToShift = block;
                }
                break;

            }
            updateNextBlockList = true;
            if (viewer.owner.isShiftingEnabled && this.documentHelper.fieldStacks.length === 0) {
                this.documentHelper.blockToShift = block;
                break;
            } else if (isNullOrUndefined(this.viewer.owner.editorModule) || !this.viewer.owner.editorModule.isInsertingTOC) {
                block = block.combineWidget(this.viewer) as BlockWidget;
                let paragraph: ParagraphWidget;
                if (currentWidget.containerWidget !== block.containerWidget) {
                    if (!(currentWidget instanceof ParagraphWidget) ||
                        (currentWidget instanceof ParagraphWidget) && !currentWidget.isEndsWithPageBreak) {
                        // tslint:disable-next-line:max-line-length
                        this.updateContainerWidget(block as Widget, currentWidget.containerWidget as BodyWidget, currentWidget.indexInOwner + 1, false);
                    }
                }
                if (block instanceof TableWidget) {
                    this.clearTableWidget(block as TableWidget, true, true);
                    (block as TableWidget).isGridUpdated = false;
                    paragraph = this.documentHelper.selection.getFirstParagraphInFirstCell(block as TableWidget);
                } else {
                    paragraph = block as ParagraphWidget;
                }
                if ((this.viewer.owner.isDocumentLoaded) && this.viewer.owner.editorModule) {
                    this.viewer.owner.editorModule.updateWholeListItems(paragraph);
                }
                viewer.updateClientAreaForBlock(block, true);
                if (this.viewer instanceof WebLayoutViewer) {
                    block.containerWidget.height -= block.height;
                }
                this.documentHelper.layout.layoutBlock(block, 0);
                viewer.updateClientAreaForBlock(block, false);
            }
            splittedWidget = nextBlock.getSplitWidgets() as BlockWidget[];
            nextBlock = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        }
        if (!viewer.owner.isShiftingEnabled || (this.documentHelper.blockToShift !== block)) {
            this.viewer.owner.editorModule.updateListItemsTillEnd(block, updateNextBlockList);
        }
    }
    /**
     * @private
     */
    public updateClientAreaForLine(paragraph: ParagraphWidget, startLineWidget: LineWidget, elementIndex: number): void {
        //Clears the line widget starting from current line.
        let top: number = this.documentHelper.selection.getTop(startLineWidget);
        let left: number = this.viewer.clientArea.x;
        this.viewer.cutFromTop(top);
        this.viewer.cutFromLeft(left);
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public reLayoutParagraph(paragraphWidget: ParagraphWidget, lineIndex: number, elementBoxIndex: number, isBidi?: boolean, isSkip?: boolean): void {
        isBidi = isNullOrUndefined(isBidi) ? false : isBidi;
        if (this.documentHelper.blockToShift === paragraphWidget) {
            this.layoutBodyWidgetCollection(paragraphWidget.index, paragraphWidget.containerWidget, paragraphWidget, false);
            this.isBidiReLayout = true;
        } else {
            if (this.isBidiReLayout) {
                this.isBidiReLayout = false;
            }
        }
        // let isElementMoved: boolean = elementBoxIndex > 0;
        if (paragraphWidget.isInsideTable) {
            this.isBidiReLayout = true;
            // this.isRelayout = true;
            this.reLayoutTable(paragraphWidget);
            this.isBidiReLayout = false;
        } else {
            // this.isRelayout = true;
            this.reLayoutLine(paragraphWidget, lineIndex, isBidi, isSkip);
        }
        if (paragraphWidget.bodyWidget instanceof HeaderFooterWidget &&
            paragraphWidget.bodyWidget.headerFooterType.indexOf('Footer') !== -1) {
            this.shiftFooterChildLocation(paragraphWidget.bodyWidget, this.viewer);
        }

    }
    /**
     * @private
     */
    public reLayoutTable(block: BlockWidget): void {
        //Get Top level owner of block
        let table: TableWidget = this.getParentTable(block);
        //Combine splitted table in to single table
        let currentTable: TableWidget = table.combineWidget(this.viewer) as TableWidget;
        let bodyWidget: BodyWidget = (currentTable.containerWidget as BodyWidget);
        if (this.viewer instanceof WebLayoutViewer) {
            bodyWidget.height -= currentTable.height;
        }
        if ((this.viewer.owner.enableHeaderAndFooter || block.isInHeaderFooter) && !(bodyWidget instanceof TextFrame)) {
            (block.bodyWidget as HeaderFooterWidget).isEmpty = false;
            bodyWidget.height -= currentTable.height;
            // tslint:disable-next-line:max-line-length
            (this.viewer as PageLayoutViewer).updateHCFClientAreaWithTop(table.bodyWidget.sectionFormat, this.documentHelper.isBlockInHeader(table), bodyWidget.page);
        } else if (bodyWidget instanceof TextFrame) {
            this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true);
        } else {
            this.viewer.updateClientArea(bodyWidget.sectionFormat, bodyWidget.page);
        }
        //Clear Hieght for all the content 
        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
            let block: ParagraphWidget = this.documentHelper.selection.getFirstParagraphInFirstCell(currentTable);
            this.viewer.owner.editorModule.updateWholeListItems(block);
        }
        this.viewer.updateClientAreaForBlock(currentTable, true);
        //Remove border width
        currentTable.x -= currentTable.leftBorderWidth;
        currentTable.y -= currentTable.topBorderWidth;
        //Update Client area for current position
        this.viewer.cutFromTop(currentTable.y);
        this.clearTableWidget(currentTable, true, true, true);
        this.isBidiReLayout = true;
        this.layoutBlock(currentTable, 0, true);
        this.viewer.updateClientAreaForBlock(currentTable, false);
        this.layoutNextItemsBlock(currentTable, this.viewer);
    }
    /**
     * @private
     */
    public clearTableWidget(table: TableWidget, clearPosition: boolean, clearHeight: boolean, clearGrid?: boolean): void {
        table.height = 0;
        if (clearGrid) {
            table.isGridUpdated = false;
        }
        if (clearPosition) {
            table.y = 0;
            table.x = 0;
        }
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            this.clearRowWidget(row, clearPosition, clearHeight, clearGrid);
        }
    }
    /**
     * @private
     */
    public clearRowWidget(row: TableRowWidget, clearPosition: boolean, clearHeight: boolean, clearGrid: boolean): void {
        row.height = 0;
        if (clearPosition) {
            row.y = 0;
            row.x = 0;
        }
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            this.clearCellWidget(cell, clearPosition, clearHeight, clearGrid);
        }
    }
    /**
     * @private
     */
    public clearCellWidget(cell: TableCellWidget, clearPosition: boolean, clearHeight: boolean, clearGrid: boolean): void {
        cell.height = 0;
        if (clearPosition) {
            cell.y = 0;
            cell.x = 0;
        }
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            let block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                if (clearHeight) {
                    block.height = 0;
                }
            } else {
                this.clearTableWidget(block as TableWidget, clearPosition, clearHeight, clearGrid);
            }
        }
    }
    /**
     * @param blockIndex 
     * @param bodyWidget 
     * @param block 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public layoutBodyWidgetCollection(blockIndex: number, bodyWidget: Widget, block: BlockWidget, shiftNextWidget: boolean, isSkipShifting?: boolean): void {
        if (!isNullOrUndefined(this.documentHelper.owner)
            && this.documentHelper.owner.isLayoutEnabled) {
            if (bodyWidget instanceof BlockContainer || bodyWidget instanceof TextFrame) {
                let curretBlock: BlockWidget = this.checkAndGetBlock(bodyWidget, blockIndex);
                if (isNullOrUndefined(curretBlock)) {
                    return;
                }
                if (this.viewer instanceof WebLayoutViewer) {
                    curretBlock.containerWidget.height -= curretBlock.height;
                }
                if (bodyWidget instanceof HeaderFooterWidget) {
                    bodyWidget.isEmpty = false;
                    // tslint:disable-next-line:max-line-length
                    (this.viewer as PageLayoutViewer).updateHCFClientAreaWithTop(bodyWidget.sectionFormat, bodyWidget.headerFooterType.indexOf('Header') !== -1, bodyWidget.page);
                    curretBlock.containerWidget.height -= curretBlock.height;
                } else if (bodyWidget instanceof TextFrame) {
                    this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true);
                } else {
                    this.viewer.updateClientArea((bodyWidget as BodyWidget).sectionFormat, bodyWidget.page);
                }
                if (blockIndex > 0) {
                    let prevWidget: BodyWidget = curretBlock.getSplitWidgets()[0].previousRenderedWidget as BodyWidget;
                    if (!(prevWidget instanceof ParagraphWidget) ||
                        (prevWidget instanceof ParagraphWidget) && !prevWidget.isEndsWithPageBreak) {
                        this.viewer.cutFromTop(prevWidget.y + prevWidget.height);
                        if (isNullOrUndefined(isSkipShifting) && curretBlock.containerWidget !== prevWidget.containerWidget) {
                            // tslint:disable-next-line:max-line-length
                            this.updateContainerWidget(curretBlock as Widget, prevWidget.containerWidget as BodyWidget, prevWidget.indexInOwner + 1, false);
                        }
                    } else if (prevWidget instanceof ParagraphWidget && prevWidget.isEndsWithPageBreak &&
                        prevWidget.containerWidget === curretBlock.containerWidget) {
                        this.moveBlocksToNextPage(prevWidget);
                    }
                }
                let currentParagraph: ParagraphWidget;
                curretBlock = curretBlock.combineWidget(this.viewer) as BlockWidget;
                if (curretBlock instanceof TableWidget) {
                    this.clearTableWidget(curretBlock as TableWidget, true, true);
                    (curretBlock as TableWidget).isGridUpdated = false;
                    currentParagraph = this.documentHelper.selection.getFirstParagraphInFirstCell(curretBlock as TableWidget);
                } else {
                    currentParagraph = curretBlock as ParagraphWidget;
                }
                if ((this.viewer.owner.isDocumentLoaded) && this.viewer.owner.editorModule) {
                    this.viewer.owner.editorModule.updateWholeListItems(currentParagraph);
                }
                this.viewer.updateClientAreaForBlock(curretBlock, true);
                this.documentHelper.layout.layoutBlock(curretBlock, 0, true);
                this.viewer.updateClientAreaForBlock(curretBlock, false);
                if (shiftNextWidget) {
                    this.shiftNextWidgets(curretBlock);
                } else {
                    this.layoutNextItemsBlock(curretBlock, this.viewer);
                }
            } else if (bodyWidget instanceof TableCellWidget) {
                // tslint:disable-next-line:max-line-length
                let table: TableWidget = this.documentHelper.layout.getParentTable(bodyWidget.ownerTable).getSplitWidgets()[0] as TableWidget;
                this.reLayoutTable(bodyWidget.ownerTable);
                this.layoutNextItemsBlock(table, this.viewer);
            }
        }

    }
    private checkAndGetBlock(containerWidget: Widget, blockIndex: number): BlockWidget {
        if (containerWidget instanceof TextFrame) {
            return containerWidget.childWidgets[blockIndex] as BlockWidget;
        } else {
            let sectionIndex: number = containerWidget.index;
            while (containerWidget && containerWidget.index === sectionIndex) {
                if (containerWidget.childWidgets.length > 0 && (containerWidget.firstChild as Widget).index <= blockIndex &&
                    (containerWidget.lastChild as Widget).index >= blockIndex) {
                    for (let i: number = 0; i < containerWidget.childWidgets.length; i++) {
                        let block: BlockWidget = containerWidget.childWidgets[i] as BlockWidget;
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
        return undefined;
    }
    //#endregion

    //#region Table
    /**
     * Layouts table.
     * @param table
     * @private
     */
    public layoutTable(table: TableWidget, startIndex: number): BlockWidget {
        table.isBidiTable = table.bidi;
        if (!table.isGridUpdated) {
            table.buildTableColumns();
            table.isGridUpdated = true;
        }
        let tableView: TableWidget[] = [table];
        this.addTableWidget(this.viewer.clientActiveArea, tableView);
        this.viewer.updateClientAreaTopOrLeft(table, true);
        let isHeader: boolean = (table.childWidgets[0] as TableRowWidget).rowFormat.isHeader;
        if (table.childWidgets.length > 0) {
            table.header = isHeader;
            table.continueHeader = isHeader;
            table.headerHeight = 0;
        }
        let row: TableRowWidget = table.childWidgets[startIndex] as TableRowWidget;
        while (row) {
            row = this.layoutRow(tableView, row);
            row = row.nextRow as TableRowWidget;
        }
        this.updateWidgetsToPage(tableView, [], table);
        return tableView[tableView.length - 1];
    }
    /**
     * Adds table widget.
     * @param area
     * @param table
     * @private
     */
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
                // tslint:disable-next-line:max-line-length
                tableWidget.leftBorderWidth = HelperMethods.convertPointToPixel(this.getTableLeftBorder(tableWidget.tableFormat.borders).getLineWidth());
                tableWidget.rightBorderWidth = HelperMethods.convertPointToPixel(this.getTableRightBorder(tableWidget.tableFormat.borders).getLineWidth());
            } else { // Right to left direction table.
                // tslint:disable-next-line:max-line-length
                tableWidget.leftBorderWidth = HelperMethods.convertPointToPixel(this.getTableRightBorder(tableWidget.tableFormat.borders).getLineWidth());
                tableWidget.rightBorderWidth = HelperMethods.convertPointToPixel(this.getTableLeftBorder(tableWidget.tableFormat.borders).getLineWidth());
            }

            // tslint:disable-next-line:max-line-length
            tableWidget.topBorderWidth = HelperMethods.convertPointToPixel(this.getTableTopBorder(tableWidget.tableFormat.borders).getLineWidth());
            tableWidget.bottomBorderWidth = HelperMethods.convertPointToPixel(this.getTableBottomBorder(tableWidget.tableFormat.borders).getLineWidth());
            tableWidget.x += tableWidget.leftBorderWidth;
            tableWidget.y += tableWidget.topBorderWidth;
            tableWidget.width -= tableWidget.leftBorderWidth;
            tableWidget.width -= tableWidget.rightBorderWidth;
            tableWidget.height += tableWidget.bottomBorderWidth;
        }
        return tableWidget;
    }
    /**
     * Updates widget to page.
     * @param table
     * @private
     */
    public updateWidgetsToPage(tables: TableWidget[], rows: TableRowWidget[], table: TableWidget, endRowWidget?: TableRowWidget): void {
        let viewer: LayoutViewer = this.viewer;
        let tableWidget: TableWidget = tables[tables.length - 1] as TableWidget;
        if (!table.isInsideTable) {
            for (let i: number = 0; i < tables.length; i++) {
                this.updateHeightForTableWidget(tables, rows, tables[i], endRowWidget);
            }
            if (tableWidget.childWidgets.length > 0 && tableWidget.y !== (tableWidget.childWidgets[0] as Widget).y) {
                tableWidget.y = (tableWidget.childWidgets[0] as Widget).y;
            }
            // Need to update on this further
            //Adds the table widget to owner cell widget.
            // tslint:disable-next-line:max-line-length
            // (viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as TableCellWidget).childWidgets.push(tableWidget);
            // tableWidget.containerWidget = viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as BodyWidget;
            // tslint:disable-next-line:max-line-length
            // (viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as TableCellWidget).height = (viewer.renderedElements.get(table.associatedCell)[viewer.renderedElements.get(table.associatedCell).length - 1] as TableCellWidget).height + tableWidget.height;
        }
        if (table.tableFormat.cellSpacing > 0) {
            // tslint:disable-next-line:max-line-length
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
        if (table.bodyWidget instanceof HeaderFooterWidget) {
            table.containerWidget.height += table.height;
            if (this.viewer.owner.enableHeaderAndFooter && table.bodyWidget.headerFooterType.indexOf('Footer') !== -1) {
                this.shiftFooterChildLocation(table.bodyWidget, this.viewer);
            }
        }
    }
    /**
     * Updates height for table widget.
     * @param viewer 
     * @param tableWidget
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public updateHeightForTableWidget(tables: TableWidget[], rows: TableRowWidget[], tableWidget: TableWidget, endRowWidget?: TableRowWidget): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            if (rowWidget === endRowWidget) {
                break;
            }
            this.updateHeightForRowWidget(this.viewer, true, tables, rows, rowWidget, true, endRowWidget);
        }
    }

    //#endregion

    //#region Row
    /**
     * Layouts table row.
     * @param row
     * @private
     */
    public layoutRow(tableWidget: TableWidget[], row: TableRowWidget): TableRowWidget {
        let viewer: LayoutViewer = this.viewer;
        let rowWidgets: TableRowWidget[] = [row];
        let widget: TableRowWidget = this.addTableRowWidget(viewer.clientActiveArea, rowWidgets) as TableRowWidget;
        viewer.updateClientAreaForRow(row, true);
        let topMargin: number = this.getMaxTopCellMargin(row);
        let bottomMargin: number = this.getMaxBottomCellMargin(row);
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            // tslint:disable-next-line:max-line-length
            this.layoutCell(cell, topMargin + row.topBorderWidth, bottomMargin + row.bottomBorderWidth, widget);
        }
        viewer.updateClientAreaForRow(row, false);
        let rows: TableRowWidget[] = [row];
        this.updateWidgetsToTable(tableWidget, rows, row);
        return rows[rows.length - 1];
    }
    // tslint:disable-next-line:max-line-length
    private getAdjacentRowCell(cell: TableCellWidget, cellStartPos: number, cellEndPos: number, rowIndex: number): TableCellWidget[] {
        let adjCells: TableCellWidget[] = [];
        let adjRow: TableRowWidget = cell.ownerRow.ownerTable.childWidgets[rowIndex] as TableRowWidget;
        if (adjRow) {
            for (let i: number = 0; i < adjRow.childWidgets.length; i++) {
                let adjCell: TableCellWidget = adjRow.childWidgets[i] as TableCellWidget;
                let adjCellStartPos: number = adjCell.x;
                let adjCellEndPos: number = adjCellStartPos + adjCell.width;
                // tslint:disable-next-line:max-line-length
                if ((HelperMethods.round(adjCellEndPos, 2) > HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) <= HelperMethods.round(cellEndPos, 2))
                    || (HelperMethods.round(adjCellStartPos, 2) >= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellStartPos, 2) < HelperMethods.round(cellEndPos, 2))
                    // tslint:disable-next-line:max-line-length
                    || (HelperMethods.round(adjCellStartPos, 2) <= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2))) {
                    //Skipped adding the Horizontal merge start cell multiple times.
                    if (adjCells.indexOf(adjCell) === -1) {
                        adjCells.push(adjCell);
                    }
                }
                if (HelperMethods.round(adjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2)) {
                    break;
                }
            }
        }
        return adjCells;
    }
    /**
     * @param area
     * @param row
     */
    private addTableRowWidget(area: Rect, row: TableRowWidget[]): Widget {
        let rowWidget: TableRowWidget = row[row.length - 1];
        // tslint:disable-next-line:max-line-length
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
                    // tslint:disable-next-line:max-line-length
                    let width: number = (TableCellWidget.getCellBottomBorder(rowWidget.childWidgets[j] as TableCellWidget) as WBorder).getLineWidth();
                    if (width > borderWidth) {
                        borderWidth = width;
                    }
                }
            }
            //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
            rowWidget.bottomBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
            if (rowWidget.index > 0 && !isNullOrUndefined(rowWidget.previousWidget)) {
                let prevRow: TableRowWidget = (rowWidget.previousWidget as TableRowWidget);
                borderWidth = 0;
                for (let i: number = 0; i < prevRow.childWidgets.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    if (!isNullOrUndefined((prevRow.childWidgets[i] as TableCellWidget).cellFormat) && !isNullOrUndefined((prevRow.childWidgets[i] as TableCellWidget).cellFormat.borders)) {
                        let value: number = (TableCellWidget.getCellBottomBorder(prevRow.childWidgets[i] as TableCellWidget) as WBorder).getLineWidth();
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
                // tslint:disable-next-line:max-line-length
                if (!isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat) && !isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat.borders)) {
                    let value: number = (TableCellWidget.getCellTopBorder(rowWidget.childWidgets[i] as TableCellWidget) as WBorder).getLineWidth();
                    if (value > borderWidth) {
                        borderWidth = value;
                    }
                }
            }
        }
        //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
        rowWidget.topBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
        //Update the table height of tableWidget when cell spacing has been defined. 
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(rowWidget.ownerTable) && !isNullOrUndefined(rowWidget.ownerTable.tableFormat) && rowWidget.ownerTable.tableFormat.cellSpacing <= 0 && rowWidget.rowIndex === rowWidget.ownerTable.childWidgets.length - 1) {
            // Update the bottom width for last row .
            for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
                // tslint:disable-next-line:max-line-length
                if (!isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat) && !isNullOrUndefined((rowWidget.childWidgets[i] as TableCellWidget).cellFormat.borders)) {
                    let value: number = (TableCellWidget.getCellBottomBorder(rowWidget.childWidgets[i] as TableCellWidget) as WBorder).getLineWidth();
                    if (value > borderWidth) {
                        borderWidth = value;
                    }
                }
            }
            //Maximum border width is calculated and hold it in a variable to add with the padding of the cells.
            rowWidget.bottomBorderWidth = HelperMethods.convertPointToPixel(borderWidth);
        }
        //tableRowWidget.ownerWidget = owner;
        return rowWidget;
    }
    /**
     * Gets maximum top cell margin.
     * @param row 
     * @param topOrBottom 
     */
    private getMaxTopCellMargin(row: TableRowWidget): number {
        if (isNullOrUndefined(row.childWidgets)) {
            return 0;
        }
        let value: number = 0;
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
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
    /**
     * Gets maximum bottom cell margin.
     * @param row 
     * @param topOrBottom 
     */
    private getMaxBottomCellMargin(row: TableRowWidget): number {
        if (isNullOrUndefined(row.childWidgets)) {
            return 0;
        }
        let value: number = 0;
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
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

    /**
     * Layouts cell
     * @param cell 
     * @param maxCellMarginTop 
     * @param maxCellMarginBottom 
     */
    private layoutCell(cell: TableCellWidget, maxCellMarginTop: number, maxCellMarginBottom: number, owner: Widget): void {
        let viewer: LayoutViewer = this.viewer;
        this.addTableCellWidget(cell, viewer.clientActiveArea, maxCellMarginTop, maxCellMarginBottom) as TableCellWidget;
        this.updateTopBorders(cell);
        viewer.updateClientAreaForCell(cell, true);
        if (cell.childWidgets.length === 0) {
            let paragraphWidget: ParagraphWidget = new ParagraphWidget();
            paragraphWidget.characterFormat = new WCharacterFormat();
            paragraphWidget.paragraphFormat = new WParagraphFormat();
            paragraphWidget.index = 0;
            let lineWidget: LineWidget = new LineWidget(paragraphWidget);
            paragraphWidget.childWidgets.push(lineWidget);
            cell.childWidgets.push(paragraphWidget);
        }
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            let block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            viewer.updateClientAreaForBlock(block, true);
            block.containerWidget = cell;
            this.layoutBlock(block, 0);
            viewer.updateClientAreaForBlock(block, false);
        }
        this.updateWidgetToRow(cell);
        viewer.updateClientAreaForCell(cell, false);
    }

    private updateTopBorders(cell: TableCellWidget): void {
        cell.updatedTopBorders = [];
        if (cell.ownerTable.tableFormat.cellSpacing === 0) {
            let cellTopBorder: WBorder = cell.cellFormat.borders.top;
            let cellStartPos: number = cell.x;
            let cellEndPos: number = cell.x + cell.width + cell.margin.left + cell.margin.right;
            let adjCells: TableCellWidget[] = this.getAdjacentRowCell(cell, cell.x, cell.x + cell.width, cell.ownerRow.indexInOwner - 1);
            for (let j: number = 0; j < adjCells.length; j++) {
                let adjCell: TableCellWidget = adjCells[j];
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
                if (border) {
                    let adjCellStartPos: number = adjCell.x;
                    let adjCellEndPos: number = adjCell.x + adjCell.width + adjCell.margin.left + adjCell.margin.right;
                    let width: number = 0;
                    // tslint:disable-next-line:max-line-length
                    if (HelperMethods.round(adjCellEndPos, 2) === HelperMethods.round(cellEndPos, 2) && HelperMethods.round(adjCellStartPos, 2) === HelperMethods.round(cellStartPos, 2)) {
                        width = cellEndPos - cellStartPos;
                        // tslint:disable-next-line:max-line-length
                    } else if (HelperMethods.round(adjCellStartPos, 2) >= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) >= HelperMethods.round(cellEndPos, 2)) {
                        width = cellEndPos - adjCellStartPos;
                        // tslint:disable-next-line:max-line-length
                    } else if (HelperMethods.round(adjCellStartPos, 2) >= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) <= HelperMethods.round(cellEndPos, 2)) {
                        width = adjCellEndPos - adjCellStartPos;
                        // tslint:disable-next-line:max-line-length
                    } else if (HelperMethods.round(adjCellStartPos, 2) <= HelperMethods.round(cellStartPos, 2) && HelperMethods.round(adjCellEndPos, 2) <= HelperMethods.round(cellEndPos, 2)) {
                        width = adjCellEndPos - cellStartPos;
                        // tslint:disable-next-line:max-line-length
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
            }
        }
    }

    //endregion cell

    //#region Shifting
    /**
     * @private
     */
    public shiftLayoutedItems(reLayout: boolean): void {
        if (isNullOrUndefined(this.documentHelper.blockToShift) || isNullOrUndefined(this.documentHelper.blockToShift.containerWidget)) {
            this.documentHelper.blockToShift = undefined;
            return;
        }
        let block: BlockWidget = this.documentHelper.blockToShift;
        let sectionIndex: number = block.bodyWidget.index;
        this.reLayoutOrShiftWidgets(block, this.viewer);
        let updateNextBlockList: boolean = true;
        // If flow layout, then all sections are in single page. Hence need to update till last block of last section.
        // Todo: For page layout and section break continuous, need to handle the same.
        let splittedWidget: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        let nextBlock: BlockWidget = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        while (nextBlock instanceof BlockWidget && nextBlock.bodyWidget.index === sectionIndex) {
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
            if (currentWidget.containerWidget === nextWidget.containerWidget
                && (HelperMethods.round(nextWidget.y, 2) === HelperMethods.round(this.viewer.clientActiveArea.y, 2)) &&
                isNullOrUndefined(nextWidget.nextWidget)) {
                break;
            }
            if (!isNullOrUndefined((currentWidget as ParagraphWidget).floatingElements)) {
                this.shiftLayoutFloatingItems(currentWidget as ParagraphWidget);
            }
            updateNextBlockList = true;
            this.reLayoutOrShiftWidgets(block, this.viewer);
            splittedWidget = block.getSplitWidgets() as BlockWidget[];
            nextBlock = splittedWidget[splittedWidget.length - 1].nextRenderedWidget as BlockWidget;
        }
        if (this.viewer.owner.editorModule) {
            this.viewer.owner.editorModule.updateListItemsTillEnd(block, updateNextBlockList);
        }
        this.documentHelper.blockToShift = undefined;
        let viewer: LayoutViewer = this.viewer;
        // if (viewer instanceof PageLayoutViewer) {
        this.documentHelper.removeEmptyPages();
        this.updateFieldElements();
        if (!this.documentHelper.owner.enableLockAndEdit || !reLayout) {
            viewer.updateScrollBars();
        }
        // }
    }
    /**
     * @private
     */
    public updateFieldElements(): void {
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            let fieldBegin: FieldElementBox = this.documentHelper.fields[i];
            if (!isNullOrUndefined(this.documentHelper.selection)) {
                let fieldCode: string = this.documentHelper.selection.getFieldCode(fieldBegin);
                // tslint:disable-next-line:max-line-length
                if (!isNullOrUndefined(fieldCode) && (fieldCode.toLowerCase().match('numpages') || fieldCode.toLowerCase().match('sectionpages')) && !isNullOrUndefined(fieldBegin.fieldSeparator)) {
                    let textElement: FieldTextElementBox = fieldBegin.fieldSeparator.nextNode as FieldTextElementBox;
                    if (!isNullOrUndefined(textElement)) {
                        let prevPageNum: string = textElement.text;
                        textElement.text = this.documentHelper.pages.length.toString();
                        let paragraph: ParagraphWidget = fieldBegin.line.paragraph;
                        if (!isNullOrUndefined(paragraph.bodyWidget) && !isNullOrUndefined(paragraph.bodyWidget.page)
                            && prevPageNum !== textElement.text) {
                            let lineIndex: number = paragraph.childWidgets.indexOf(fieldBegin.line);
                            let elementIndex: number = fieldBegin.line.children.indexOf(textElement);
                            this.reLayoutParagraph(paragraph, lineIndex, elementIndex);
                        }
                    }
                }
            }
        }
    }
    private reLayoutOrShiftWidgets(blockAdv: BlockWidget, viewer: LayoutViewer): void {
        let reLayoutItems: boolean = false;
        let block: BlockWidget = blockAdv;
        // if (block instanceof ParagraphWidget) {
        //     reLayoutItems = viewer.renderedElements.get(block as ParagraphWidget).length === 0;
        // } else {
        //     reLayoutItems = viewer.renderedElements.get(block as TableWidget).length === 0;
        // }
        // if (reLayoutItems) {
        //     //Handle layouting the block.
        //     viewer.updateClientAreaForBlock(block, true);
        //     this.layoutMod.layoutBlock(block);
        //     viewer.updateClientAreaForBlock(block, false);
        // } else {
        //Handled to check client area and shift layouted widget.
        this.shiftWidgetsBlock(block, viewer);
        //Updates the list value of the rendered paragraph.
        if (this.viewer.owner.editorModule) {
            this.viewer.owner.editorModule.updateRenderedListItems(block);
        }
        // }
    }
    private shiftWidgetsBlock(block: BlockWidget, viewer: LayoutViewer): void {
        if (block instanceof ParagraphWidget) {
            this.shiftWidgetsForPara(block as ParagraphWidget, viewer);
        } else if (block instanceof TableWidget) {
            this.shiftWidgetsForTable(block as TableWidget, viewer);
        }
    }
    private shiftWidgetsForPara(paragraph: ParagraphWidget, viewer: LayoutViewer): void {
        if (paragraph.height > (viewer.clientArea.height + viewer.clientArea.y)) {
            return;
        }
        let prevBodyObj: BodyWidgetInfo = this.getBodyWidgetOfPreviousBlock(paragraph, 0);
        let prevBodyWidget: BodyWidget = prevBodyObj.bodyWidget;
        let index: number = prevBodyObj.index;
        let prevWidget: ParagraphWidget = undefined;
        for (let i: number = 0; i < paragraph.getSplitWidgets().length; i++) {
            let widget: ParagraphWidget = paragraph.getSplitWidgets()[i] as ParagraphWidget;
            if (!isNullOrUndefined(prevWidget)) {
                let isPageBreak: boolean = prevWidget.lastChild ? (prevWidget.lastChild as LineWidget).isEndsWithPageBreak : false;
                this.shiftToPreviousWidget(widget, viewer, prevWidget, isPageBreak);
                if ((isNullOrUndefined(widget.childWidgets) || widget.childWidgets.length === 0) && !isPageBreak) {
                    i--;
                    continue;
                }
                prevWidget = undefined;
                if (prevBodyWidget !== widget.containerWidget) {
                    prevBodyWidget = widget.containerWidget as BodyWidget;
                    if (isPageBreak) {
                        viewer.updateClientAreaByWidget(widget);
                    }
                }
            }
            if (this.isFitInClientArea(widget, viewer)) {
                //Check whether this widget is moved to previous container widget.
                prevWidget = widget;
                widget.y = viewer.clientActiveArea.y;
                viewer.cutFromTop(viewer.clientActiveArea.y + widget.height);
                //Moves the paragraph widget to previous body widget.
                if (!isNullOrUndefined(prevBodyWidget) && prevBodyWidget !== widget.containerWidget) {
                    index++;
                    if (!(prevBodyWidget.lastChild as ParagraphWidget).isEndsWithPageBreak) {
                        this.updateContainerWidget(widget, prevBodyWidget, index, true);
                    }
                }
                if (widget.isEndsWithPageBreak && this.viewer instanceof PageLayoutViewer) {
                    let nextBodyWidget: BodyWidget = this.createOrGetNextBodyWidget(prevBodyWidget, this.viewer);
                    nextBodyWidget = this.moveBlocksToNextPage(widget);
                    viewer.updateClientArea(nextBodyWidget.sectionFormat, nextBodyWidget.page);
                }
            } else {
                let previousBlock: BlockWidget = widget.previousRenderedWidget as BlockWidget;
                let isPageBreak: boolean = false;
                if (previousBlock instanceof ParagraphWidget && previousBlock.isEndsWithPageBreak &&
                    this.viewer instanceof PageLayoutViewer) {
                    isPageBreak = true;
                }
                let isSplittedToNewPage: boolean = this.splitWidget(widget, viewer, prevBodyWidget, index + 1, isPageBreak);
                prevWidget = undefined;
                if (prevBodyWidget !== widget.containerWidget) {
                    prevBodyWidget = widget.containerWidget as BodyWidget;
                    i--;
                }
                index = prevBodyWidget.childWidgets.indexOf(widget);
                if (isSplittedToNewPage) {
                    prevBodyWidget = (paragraph.getSplitWidgets()[i + 1] as ParagraphWidget).containerWidget as BodyWidget;
                }
            }
        }
    }
    /**
     * @private
     */
    public shiftTableWidget(table: TableWidget, viewer: LayoutViewer): TableWidget {
        let tables: TableWidget[] = [table];
        this.addTableWidget(this.viewer.clientActiveArea, tables);
        this.viewer.updateClientAreaTopOrLeft(table, true);
        let row: TableRowWidget = table.childWidgets[0] as TableRowWidget;
        while (row) {
            row = this.shiftRowWidget(tables, row);
            row = row.nextRow as TableRowWidget;
        }
        this.updateWidgetsToPage(tables, [], table);
        return tables[tables.length - 1];
    }
    /**
     * @private
     */
    public shiftRowWidget(tables: TableWidget[], row: TableRowWidget): TableRowWidget {
        let viewer: LayoutViewer = this.viewer;
        let rows: TableRowWidget[] = [row];
        let widget: TableRowWidget = this.addTableRowWidget(viewer.clientActiveArea, rows) as TableRowWidget;
        viewer.updateClientAreaForRow(row, true);
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            // tslint:disable-next-line:max-line-length
            this.shiftCellWidget(cell, this.getMaxTopCellMargin(row) + row.topBorderWidth, this.getMaxBottomCellMargin(row) + row.bottomBorderWidth);
        }
        viewer.updateClientAreaForRow(row, false);
        this.updateWidgetsToTable(tables, rows, row);
        return rows[rows.length - 1];
    }
    /**
     * @private
     */
    public shiftCellWidget(cell: TableCellWidget, maxCellMarginTop: number, maxCellMarginBottom: number): void {
        let viewer: LayoutViewer = this.viewer;
        this.addTableCellWidget(cell, viewer.clientActiveArea, maxCellMarginTop, maxCellMarginBottom) as TableCellWidget;
        viewer.updateClientAreaForCell(cell, true);
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            let block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            viewer.updateClientAreaForBlock(block, true);
            if (block instanceof ParagraphWidget) {
                this.shiftParagraphWidget(block);
            } else {
                this.shiftTableWidget(block as TableWidget, viewer);
            }
            viewer.updateClientAreaForBlock(block, false);
        }
        this.updateWidgetToRow(cell);
        viewer.updateClientAreaForCell(cell, false);
    }
    /**
     * @private
     */
    public shiftParagraphWidget(paragraph: ParagraphWidget): void {
        this.addParagraphWidget(this.viewer.clientActiveArea, paragraph);
        this.viewer.cutFromTop(this.viewer.clientActiveArea.y + paragraph.height);
        if (!isNullOrUndefined((paragraph as ParagraphWidget).floatingElements)) {
            this.shiftLayoutFloatingItems(paragraph as ParagraphWidget);
            // for (let i: number = 0; i < paragraph.floatingElements.length; i++) {
            //     let shape: ShapeElementBox = paragraph.floatingElements[i];
            //     this.layoutElement(shape, paragraph);
            // }
        }
        this.updateWidgetToPage(this.viewer, paragraph);
    }

    private shiftWidgetsForTable(table: TableWidget, viewer: LayoutViewer): void {
        let prevObj: BodyWidgetInfo = this.getBodyWidgetOfPreviousBlock(table, 0);
        let prevBodyWidget: BodyWidget = prevObj.bodyWidget;
        let index: number = prevObj.index;
        let isPageBreak: boolean = ((prevBodyWidget.lastChild as BlockWidget).lastChild as LineWidget).isEndsWithPageBreak;
        if (prevBodyWidget !== table.containerWidget) {
            if (!isPageBreak) {
                this.updateContainerWidget(table, prevBodyWidget as BodyWidget, index + 1, true);
            } else {
                viewer.updateClientArea(table.bodyWidget.sectionFormat, table.bodyWidget.page);
            }
        }
        if (table.isInHeaderFooter || this.viewer instanceof WebLayoutViewer) {
            table.containerWidget.height -= table.height;
        }
        this.viewer.updateClientAreaForBlock(table, true);
        this.updateVerticalPositionToTop(table, true);
        let isPageLayout: boolean = viewer instanceof PageLayoutViewer;
        let combinedTable: TableWidget = table.combineWidget(this.viewer) as TableWidget;
        this.documentHelper.layout.updateChildLocationForTable(combinedTable.y, combinedTable);
        this.clearTableWidget(combinedTable, true, false);
        this.shiftTableWidget(combinedTable, this.viewer);
        this.updateVerticalPositionToTop(table, false);
        this.viewer.updateClientAreaForBlock(table, false);
    }
    private updateVerticalPositionToTop(table: TableWidget, isUpdateTop: boolean): void {
        //Iterate the tableWidgets counts
        for (let i: number = 0; i < table.getSplitWidgets().length; i++) {
            let tablewidget: TableWidget = table.getSplitWidgets()[i] as TableWidget;
            //Iterate the tableWidget child items
            for (let j: number = 0; j < tablewidget.childWidgets.length; j++) {
                let rowWidget: TableRowWidget = tablewidget.childWidgets[j] as TableRowWidget;
                //Iterate the RowWidgets child items
                for (let k: number = 0; k < rowWidget.childWidgets.length; k++) {
                    let cellWidget: TableCellWidget = rowWidget.childWidgets[k] as TableCellWidget;
                    //Iterate the RowWidgets child items
                    this.documentHelper.layout.updateCellVerticalPosition(cellWidget, isUpdateTop, false);
                }
            }
        }
    }
    // tslint:disable-next-line:max-line-length
    private splitWidget(paragraphWidget: ParagraphWidget, viewer: LayoutViewer, previousBodyWidget: BodyWidget, index: number, isPageBreak: boolean): boolean {
        let firstLine: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
        let maxElementHeight: number = this.getMaxElementHeight(firstLine, viewer);
        let paragraphView: ParagraphWidget[] = paragraphWidget.getSplitWidgets() as ParagraphWidget[];
        let nextBodyWidget: BodyWidget = paragraphWidget.containerWidget as BodyWidget;
        if (viewer.clientActiveArea.height >= maxElementHeight && !isPageBreak) {
            let splittedWidget: ParagraphWidget = undefined;
            let widgetIndex: number = paragraphView.indexOf(paragraphWidget);
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
            if (previousBodyWidget !== paragraphWidget.containerWidget) {
                this.updateContainerWidget(paragraphWidget, previousBodyWidget, index, true);
            }
            for (let i: number = paragraphWidget.childWidgets.length - 1; i > 0; i--) {
                if (this.isFitInClientArea(paragraphWidget, viewer)) {
                    break;
                } else {
                    let line: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
                    //Moves the line widget to next widget.
                    this.updateParagraphWidgetInternal(line, splittedWidget, 0);
                }
            }
            if (isNullOrUndefined(splittedWidget.containerWidget) && splittedWidget.childWidgets.length > 0) {
                let y: number = viewer.clientActiveArea.y;
                // tslint:disable-next-line:max-line-length
                let clientArea: Rect = new Rect(viewer.clientArea.x, viewer.clientArea.y, viewer.clientArea.width, viewer.clientArea.height);
                let activeArea: Rect = new Rect(viewer.clientActiveArea.x, viewer.clientActiveArea.y, viewer.clientActiveArea.width, viewer.clientActiveArea.height);
                //Checks whether next node exists, else adds new page.
                nextBodyWidget = this.moveBlocksToNextPage(paragraphWidget);
                // nextBodyWidget = this.createOrGetNextBodyWidget(previousBodyWidget, viewer);
                nextBodyWidget.childWidgets.splice(0, 0, splittedWidget);
                nextBodyWidget.height += splittedWidget.height;
                splittedWidget.containerWidget = nextBodyWidget;
                if (nextBodyWidget.childWidgets.length === 1 && nextBodyWidget.firstChild instanceof ParagraphWidget &&
                    nextBodyWidget.firstChild.equals(paragraphWidget)) {
                    paragraphWidget.x = paragraphWidget.x;
                    paragraphWidget.y = y;
                    return true;
                } else {
                    //Resetting Client area
                    viewer.clientArea = clientArea;
                    viewer.clientActiveArea = activeArea;
                }
            }
        } else {
            nextBodyWidget = this.createOrGetNextBodyWidget(previousBodyWidget, this.viewer);
            if (paragraphWidget.containerWidget !== nextBodyWidget) {
                nextBodyWidget = this.moveBlocksToNextPage(paragraphWidget);
                this.updateContainerWidget(paragraphWidget, nextBodyWidget, 0, true);
            }
        }
        if (previousBodyWidget === paragraphWidget.containerWidget) {
            paragraphWidget.y = viewer.clientActiveArea.y;
            viewer.cutFromTop(viewer.clientActiveArea.y + paragraphWidget.height);
        } else {
            //Updates client area based on next body widget.
            viewer.updateClientArea(nextBodyWidget.sectionFormat, nextBodyWidget.page);
        }
        return false;
    }
    private getMaxElementHeight(lineWidget: LineWidget, viewer: LayoutViewer): number {
        let height: number = 0;
        // tslint:disable-next-line:max-line-length
        if (lineWidget.children.length === 0 || ((lineWidget.children.length === 1 && lineWidget.children[0] instanceof ListTextElementBox) || (lineWidget.children.length === 2 && lineWidget.children[0] instanceof ListTextElementBox && lineWidget.children[1] instanceof ListTextElementBox))) {
            let topMargin: number = 0;
            let bottomMargin: number = 0;
            height = this.documentHelper.selection.getParagraphMarkSize(lineWidget.paragraph, topMargin, bottomMargin).height;
            height += topMargin;
            if (lineWidget.children.length > 0) {
                let element: ListTextElementBox = lineWidget.children[0] as ListTextElementBox;
                if (height < element.margin.top + element.height) {
                    height = element.margin.top + element.height;
                }
            }
        } else {
            for (let i: number = 0; i < lineWidget.children.length; i++) {
                let element: ElementBox = lineWidget.children[i];
                if (height < element.margin.top + element.height) {
                    height = element.margin.top + element.height;
                }
            }
        }
        return height;
    }
    private createOrGetNextBodyWidget(bodyWidget: BodyWidget, viewer: LayoutViewer): BodyWidget {
        let nextBodyWidget: BodyWidget = undefined;
        let pageIndex: number = 0;
        pageIndex = this.documentHelper.pages.indexOf(bodyWidget.page);
        let page: Page = undefined;
        let index: number = undefined;
        index = bodyWidget.index;

        if (pageIndex === this.documentHelper.pages.length - 1
            || this.documentHelper.pages[pageIndex + 1].sectionIndex !== index) {
            let currentWidget: BodyWidget = new BodyWidget();
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
    private isFitInClientArea(paragraphWidget: ParagraphWidget, viewer: LayoutViewer): boolean {
        let lastLine: LineWidget = paragraphWidget.childWidgets[paragraphWidget.childWidgets.length - 1] as LineWidget;
        let height: number = paragraphWidget.height;
        let maxElementHeight: number = this.getMaxElementHeight(lastLine, viewer);
        if (lastLine.height > maxElementHeight) {
            height -= lastLine.height - maxElementHeight;
        }
        return viewer.clientActiveArea.height >= height;
    }
    // tslint:disable-next-line:max-line-length
    private shiftToPreviousWidget(paragraphWidget: ParagraphWidget, viewer: LayoutViewer, previousWidget: ParagraphWidget, isPageBreak: boolean): void {
        for (let i: number = 0; i < paragraphWidget.childWidgets.length; i++) {
            let line: LineWidget = paragraphWidget.childWidgets[i] as LineWidget;
            let maxElementHeight: number = this.getMaxElementHeight(line, viewer);
            if (viewer.clientActiveArea.height >= maxElementHeight && !isPageBreak) {
                //Moves the line widget to previous widget.
                this.updateParagraphWidgetInternal(line, previousWidget, previousWidget.childWidgets.length);
                i--;
                viewer.cutFromTop(viewer.clientActiveArea.y + line.height);
                if (isNullOrUndefined(paragraphWidget.childWidgets)) {
                    break;
                }
            } else {
                let bodyWidget: BodyWidget = previousWidget.containerWidget as BodyWidget;
                let nextBodyWidget: BodyWidget = this.createOrGetNextBodyWidget(bodyWidget, viewer);
                if (paragraphWidget.containerWidget !== nextBodyWidget) {
                    nextBodyWidget = this.moveBlocksToNextPage(paragraphWidget);
                }
                if (bodyWidget !== nextBodyWidget) {
                    this.updateContainerWidget(paragraphWidget, nextBodyWidget, 0, true);
                }
                //Updates client area based on next page.
                viewer.updateClientArea(nextBodyWidget.sectionFormat, nextBodyWidget.page);
                break;
            }
        }
    }
    private updateParagraphWidgetInternal(lineWidget: LineWidget, newParagraphWidget: ParagraphWidget, index: number): void {
        if (!isNullOrUndefined(lineWidget.paragraph)) {
            lineWidget.paragraph.childWidgets.splice(lineWidget.paragraph.childWidgets.indexOf(lineWidget), 1);
            lineWidget.paragraph.height -= lineWidget.height;
            if (!isNullOrUndefined(lineWidget.paragraph.containerWidget)) {
                lineWidget.paragraph.containerWidget.height -= lineWidget.height;
            }
            // tslint:disable-next-line:max-line-length
            if (isNullOrUndefined(lineWidget.paragraph.childWidgets) || lineWidget.paragraph.childWidgets.length === 0) {
                lineWidget.paragraph.destroyInternal(this.viewer);
            }
        }
        newParagraphWidget.childWidgets.splice(index, 0, lineWidget);
        lineWidget.paragraph = newParagraphWidget;
        newParagraphWidget.height += lineWidget.height;
        if (!isNullOrUndefined(newParagraphWidget.containerWidget)) {
            newParagraphWidget.containerWidget.height += lineWidget.height;
        }
    }
    private shiftNextWidgets(blockAdv: BlockWidget): void {
        let block: BlockWidget = blockAdv;
        while (block.nextWidget instanceof BlockWidget) {
            block = block.nextWidget as BlockWidget;
            this.reLayoutOrShiftWidgets(block, this.viewer);
        }

    }
    /**
     * @private
     */
    public updateContainerWidget(widget: Widget, bodyWidget: BodyWidget, index: number, destroyAndScroll: boolean): void {
        if (!isNullOrUndefined(widget.containerWidget)) {
            widget.containerWidget.childWidgets.splice(widget.containerWidget.childWidgets.indexOf(widget), 1);
            widget.containerWidget.height -= bodyWidget.height;
            if ((isNullOrUndefined(widget.containerWidget.childWidgets) || widget.containerWidget.childWidgets.length === 0)
                && widget.containerWidget instanceof BodyWidget && widget.containerWidget !== bodyWidget && destroyAndScroll) {
                let page: Page = widget.containerWidget.page;
                if (this.documentHelper.pages[this.documentHelper.pages.length - 1] === page &&
                    (this.viewer as PageLayoutViewer).visiblePages.indexOf(page) !== -1) {
                    this.documentHelper.scrollToBottom();
                }
                if (isNullOrUndefined(page.nextPage) || page.nextPage.bodyWidgets[0].index !== widget.containerWidget.index) {
                    widget.containerWidget.destroyInternal(this.viewer);
                }
            }
        }
        bodyWidget.childWidgets.splice(index, 0, widget);
        if (widget instanceof ParagraphWidget && !isNullOrUndefined(widget.floatingElements)) {
            for (let i: number = 0; i < widget.floatingElements.length; i++) {
                let shape: ShapeElementBox = widget.floatingElements[i];
                bodyWidget.floatingElements.push(shape);
                widget.bodyWidget.floatingElements.splice(widget.bodyWidget.floatingElements.indexOf(shape), 1);
            }
        }
        bodyWidget.height += bodyWidget.height;
        widget.containerWidget = bodyWidget;
    }
    private getBodyWidgetOfPreviousBlock(block: BlockWidget, index: number): BodyWidgetInfo {
        index = 0;
        let prevBodyWidget: BodyWidget = undefined;
        let previousBlock: BlockWidget = block.previousRenderedWidget as BlockWidget;
        prevBodyWidget = (previousBlock && previousBlock.containerWidget.equals(block.containerWidget)) ?
            previousBlock.containerWidget as BodyWidget : block.containerWidget as BodyWidget;
        index = previousBlock && previousBlock.containerWidget.equals(block.containerWidget) ?
            prevBodyWidget.childWidgets.indexOf(previousBlock) : block.containerWidget.childWidgets.indexOf(block);
        return { bodyWidget: prevBodyWidget, index: index };
    }
    /**
     * @private
     */
    public moveBlocksToNextPage(block: BlockWidget): BodyWidget {
        let body: BodyWidget = block.bodyWidget as BodyWidget;
        let page: Page = body.page;
        let pageIndex: number = page.index + 1;
        let nextPage: Page = undefined;
        let nextBody: BodyWidget = undefined;
        let insertPage: boolean = false;
        if (this.documentHelper.pages.length > pageIndex) {
            nextPage = this.documentHelper.pages[pageIndex];
            if (nextPage.bodyWidgets.length === 0 || !body.equals(nextPage.bodyWidgets[0])) {
                nextPage = undefined;
                insertPage = true;
            } else {
                nextBody = nextPage.bodyWidgets[0];
                this.viewer.updateClientArea(nextBody.sectionFormat, nextBody.page);
            }
        }
        if (isNullOrUndefined(nextPage)) {
            nextBody = this.createSplitBody(body);
            nextPage = this.viewer.createNewPage(nextBody, pageIndex);
            if (insertPage) {
                this.documentHelper.insertPage(pageIndex, nextPage);
            }
        }
        //tslint:disable :no-constant-condition
        do {
            let lastBlock: BlockWidget = body.lastChild as BlockWidget;
            if (block === lastBlock) {
                break;
            }
            body.childWidgets.pop();
            nextBody.childWidgets.splice(0, 0, lastBlock);
            lastBlock.containerWidget = nextBody;
            nextBody.height += lastBlock.height;
        } while (true);
        return nextBody;
    }
    private createSplitBody(body: BodyWidget): BodyWidget {
        let newBody: BodyWidget = this.addBodyWidget(this.viewer.clientActiveArea);
        newBody.sectionFormat = body.sectionFormat;
        newBody.index = body.index;
        return newBody;
    }
    //endregion

    //#region Relayout Parargaph 

    /**
     * Relayout Paragraph from specified line widget
     * @param paragraph Paragraph to reLayout
     * @param lineIndex start line index to reLayout
     * @private
     */
    public reLayoutLine(paragraph: ParagraphWidget, lineIndex: number, isBidi: boolean, isSkip?: boolean): void {
        if (this.viewer.owner.isDocumentLoaded && this.viewer.owner.editorModule) {
            this.viewer.owner.editorModule.updateWholeListItems(paragraph);
        }
        let lineWidget: LineWidget;
        if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1) {
            lineWidget = paragraph.getSplitWidgets()[0].firstChild as LineWidget;
        } else {
            lineWidget = paragraph.childWidgets[lineIndex] as LineWidget;
        }
        if (!this.isBidiReLayout && (paragraph.paragraphFormat.bidi || this.isContainsRtl(lineWidget))) {
            let newLineIndex: number = lineIndex <= 0 ? 0 : lineIndex - 1;
            for (let i: number = newLineIndex; i < paragraph.childWidgets.length; i++) {
                if (isBidi || !(paragraph.paragraphFormat.bidi && this.isContainsRtl(lineWidget)) && !isSkip) {
                    if (i === lineIndex) {
                        continue;
                    }
                }
                this.reArrangeElementsForRtl(paragraph.childWidgets[i] as LineWidget, paragraph.paragraphFormat.bidi);
            }
        }
        let lineToLayout: LineWidget = lineWidget.previousLine;
        if (isNullOrUndefined(lineToLayout)) {
            lineToLayout = lineWidget;
        }
        let currentParagraph: ParagraphWidget = lineToLayout.paragraph;
        let bodyWidget: BodyWidget = paragraph.containerWidget as BlockContainer;
        bodyWidget.height -= paragraph.height;
        if ((this.viewer.owner.enableHeaderAndFooter || paragraph.isInHeaderFooter) && !(bodyWidget instanceof TextFrame)) {
            (paragraph.bodyWidget as HeaderFooterWidget).isEmpty = false;
            // tslint:disable-next-line:max-line-length
            (this.viewer as PageLayoutViewer).updateHCFClientAreaWithTop(paragraph.bodyWidget.sectionFormat, this.documentHelper.isBlockInHeader(paragraph), bodyWidget.page);
        } else if (bodyWidget instanceof TextFrame) {
            this.viewer.updateClientAreaForTextBoxShape(bodyWidget.containerShape as ShapeElementBox, true);
        } else {
            this.viewer.updateClientArea(bodyWidget.sectionFormat, bodyWidget.page);
        }
        this.viewer.updateClientAreaForBlock(paragraph, true);
        if (lineToLayout.paragraph.isEmpty()) {
            this.viewer.cutFromTop(paragraph.y);
            this.layoutParagraph(paragraph, 0);
        } else {
            this.updateClientAreaForLine(lineToLayout.paragraph, lineToLayout, 0);
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
            this.viewer.updateClientAreaForBlock(paragraph, false);
        }
        this.layoutNextItemsBlock(paragraph, this.viewer);
    }
    //#endregion
    //RTL Feature layout start
    public isContainsRtl(lineWidget: LineWidget): boolean {
        let isContainsRTL: boolean = false;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            if (lineWidget.children[i] instanceof TextElementBox) {
                isContainsRTL = lineWidget.children[i].characterFormat.bidi || lineWidget.children[i].characterFormat.bdo === 'RTL'
                    || this.documentHelper.textHelper.isRTLText((lineWidget.children[i] as TextElementBox).text);
                if (isContainsRTL) {
                    break;
                }
            }
        }
        return isContainsRTL;
    }
    // Re arranges the elements for Right to left layotuing.
    // tslint:disable:max-func-body-length    
    public reArrangeElementsForRtl(line: LineWidget, isParaBidi: boolean): void {
        if (line.children.length === 0) {
            return;
        }

        let lastAddedElementIsRtl: boolean = false;
        let lastAddedRtlElementIndex: number = -1;
        let tempElements: ElementBox[] = [];

        for (let i: number = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i];
            let elementCharacterFormat: WCharacterFormat = undefined;
            if (element.characterFormat) {
                elementCharacterFormat = element.characterFormat;
            }
            let isRtl: boolean = false;
            let text: string = '';
            let containsSpecchrs: boolean = false;
            if (element instanceof BookmarkElementBox) {
                if (isParaBidi) {
                    if (lastAddedElementIsRtl || element.bookmarkType === 0 && element.nextElement
                        && element.nextElement.nextElement instanceof TextElementBox
                        && this.documentHelper.textHelper.isRTLText(element.nextElement.nextElement.text)
                        || element.bookmarkType === 1 && element.nextElement instanceof TextElementBox
                        && this.documentHelper.textHelper.isRTLText(element.nextElement.text)) {
                        tempElements.splice(0, 0, element);
                    } else {
                        tempElements.splice(lastAddedElementIsRtl ? lastAddedRtlElementIndex : lastAddedRtlElementIndex + 1, 0, element);
                    }
                    lastAddedRtlElementIndex = tempElements.indexOf(element);
                } else {
                    tempElements.push(element);
                }
                continue;
            }

            if (element instanceof TextElementBox) {
                text = (element as TextElementBox).text;
                containsSpecchrs = this.documentHelper.textHelper.containsSpecialCharAlone(text.trim());
                if (containsSpecchrs) {
                    if (elementCharacterFormat.bidi && isParaBidi) {
                        text = HelperMethods.ReverseString(text);
                        for (let k: number = 0; k < text.length; k++) {
                            let ch: string = this.documentHelper.textHelper.inverseCharacter(text.charAt(k));
                            text = text.replace(text.charAt(k), ch);
                        }
                        element.text = text;
                    }
                }

            }
            let isRTLText: boolean = false;
            // let isNumber: boolean = false;
            // The list element box shold be added in the last position in line widget for the RTL paragraph 
            // and first in the line widget for LTR paragrph.
            if (element instanceof ListTextElementBox) {
                isRtl = isParaBidi;
            } else { // For Text element box we need to check the character format and unicode of text to detect the RTL text. 
                isRTLText = this.documentHelper.textHelper.isRTLText(text);
                isRtl = isRTLText || elementCharacterFormat.bidi
                    || elementCharacterFormat.bdo === 'RTL';

            }
            if (element instanceof FieldElementBox || this.isRtlFieldCode) {
                if ((element as FieldElementBox).fieldType === 0) {
                    this.isRtlFieldCode = true;
                } else if ((element as FieldElementBox).fieldType === 1) {
                    this.isRtlFieldCode = false;
                }
                isRtl = false;
            }

            // If the text element box contains only whitespaces, then need to check the previous and next elements.
            if (!isRtl && !isNullOrUndefined(text) && text !== '' && ((text !== '' && text.trim() === '') || containsSpecchrs)) {
                let elements: ElementBox[] = line.children;
                //Checks whether the langugae is RTL.
                if (elementCharacterFormat.bidi) {
                    // If the last added element is rtl then current text element box also considered as RTL for WhiteSpaces.
                    if (lastAddedElementIsRtl) {
                        isRtl = true;
                        // Else, Check for next element.
                    } else if (i + 1 < line.children.length && line.children[i + 1] instanceof TextElementBox) {
                        text = (elements[i + 1] as TextElementBox).text;
                        isRtl = this.documentHelper.textHelper.isRTLText(text) || elements[i + 1].characterFormat.bidi
                            || elements[i + 1].characterFormat.bdo === 'RTL';
                    }// If the last added element is rtl then current text element box also considered as RTL for WhiteSpaces.
                } else if (lastAddedElementIsRtl) {
                    isRtl = true;
                }
            }
            // Preserve the isRTL value, to reuse it for navigation and selection.
            element.isRightToLeft = isRtl;
            //Adds the text element to the line
            if (isRtl && elementCharacterFormat.bdo !== 'LTR') {
                if (lastAddedElementIsRtl) {
                    tempElements.splice(lastAddedRtlElementIndex, 0, element);
                } else {
                    if (!isParaBidi) {
                        tempElements.push(element);
                    } else {
                        tempElements.splice(0, 0, element);
                    }
                    lastAddedElementIsRtl = true;
                    lastAddedRtlElementIndex = tempElements.indexOf(element);
                }
            } else {
                if (lastAddedElementIsRtl && element instanceof ImageElementBox) {
                    if (elementCharacterFormat.bidi) {
                        tempElements.splice(lastAddedRtlElementIndex + 1, 0, element);
                    } else {
                        tempElements.splice(lastAddedRtlElementIndex, 0, element);
                    }
                } else {
                    if (!isParaBidi) {
                        tempElements.push(element);
                    } else {
                        if (lastAddedElementIsRtl) {
                            tempElements.splice(0, 0, element);
                        } else {
                            tempElements.splice(lastAddedRtlElementIndex + 1, 0, element);
                        }
                        lastAddedRtlElementIndex = tempElements.indexOf(element);
                    }
                    lastAddedElementIsRtl = false;
                }
            }
        }
        // Clear the elemnts and reassign the arranged elements.
        line.children = [];
        line.children = tempElements;
    }
    private shiftLayoutFloatingItems(paragraph: ParagraphWidget): void {
        for (let i: number = 0; i < (paragraph as ParagraphWidget).floatingElements.length; i++) {
            let element: ShapeElementBox = (paragraph as ParagraphWidget).floatingElements[i];
            let position: Point = this.getFloatingItemPoints(element);
            let height: number = position.y - element.y;
            element.x = position.x;
            element.y = position.y;
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
    //RTL feature layout end
    private getFloatingItemPoints(floatElement: ShapeElementBox): Point {
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
            let shapeHeight: number = floatElement.height;
            //Need to update size width for Horizontal Line when width exceeds client width.
            // if(shape !== null && shape.IsHorizontalRule && size.Width > m_layoutArea.ClientActiveArea.Width)
            //     size.Width = m_layoutArea.ClientActiveArea.Width;
            let shapeWidth: number = floatElement.width;
            let vertPosition: number = floatElement.verticalPosition;
            let horzPosition: number = floatElement.horizontalPosition;
            let layoutInCell: boolean = floatElement.layoutInCell;
            //Word 2013 Layout picture in table cell even layoutInCell property was False.
            if (paragraph.isInsideTable && layoutInCell) {
                isLayoutInCell = true;
                indentY = this.getVerticalPosition(floatElement, vertPosition, vertOrigin, textWrapStyle);
                // tslint:disable-next-line:max-line-length
                indentX = this.getHorizontalPosition(floatElement.width, floatElement, horzAlignment, horzOrigin, horzPosition, textWrapStyle, paragraph.associatedCell.cellFormat.cellWidth);
            } else {
                // tslint:disable-next-line:max-line-length
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
                                        indentY = (pageHeight - shapeHeight) / 2;
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
                                    // Special case for Shape and Textbox.
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
                                        // tslint:disable-next-line:max-line-length
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
                                        // tslint:disable-next-line:max-line-length
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
                                        // tslint:disable-next-line:max-line-length
                                        indentY = (paragraph.bodyWidget.page.index + 1) % 2 !== 0 ? topMargin - shapeHeight : pageHeight - bottomMargin;
                                    }
                                    break;
                                case 'Bottom':
                                    if (vertOrigin === 'OutsideMargin') {
                                        // tslint:disable-next-line:max-line-length
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
                            let space: number = 0;
                            let prevsibling: BlockWidget = paragraph.previousWidget as BlockWidget;
                            if (floatElement) {
                                //Need to handle DocIO Implementation.
                                if (Math.round(paragraph.y) !== Math.round(topMargin) && (prevsibling instanceof ParagraphWidget)
                                    && ((paragraph.paragraphFormat.beforeSpacing > prevsibling.paragraphFormat.afterSpacing)
                                        || (prevsibling.paragraphFormat.afterSpacing < 14)
                                        && !paragraph.paragraphFormat.contextualSpacing)) {
                                    space = prevsibling.paragraphFormat.afterSpacing;
                                }
                            }
                            // tslint:disable-next-line:max-line-length
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
                if (paragraph && textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'BehindText' &&
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
                                        indentX = (pageWidth - shapeWidth) / 2;
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
                                // tslint:disable-next-line:max-line-length
                                // if ((ownerPara.IsXpositionUpated && ownerPara.Document.Settings.CompatibilityMode === CompatibilityMode.Word2013)
                                //     || paragraphLayoutInfo.XPosition > (pageWidth - minimumWidthRequired - rightMargin)
                                //     || paragraphLayoutInfo.IsXPositionReUpdate)
                                //     indentX = layouter.ClientLayoutArea.Left + horzPosition;
                                // else
                                indentX = paragraph.x + horzPosition;
                            } else {
                                //Re Update the x position to the page left when word version not equal to 2013 
                                //and wrapping style not equal to infront of text and behind text. 
                                if ((textWrapStyle === 'InFrontOfText' || textWrapStyle === 'BehindText')) {
                                    indentX = paragraph.x + horzPosition;
                                } else {
                                    indentX = this.viewer.clientActiveArea.x + horzPosition;
                                }
                            }
                            //Update the Wrapping element right position as page right when 
                            //wrapping element right position  exceeds the page right except position 
                            //InFrontOfText and behindText wrapping style.
                            if (textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'BehindText'
                                && Math.round(indentX + shapeWidth) > Math.round(pageWidth) && shapeWidth < pageWidth) {
                                indentX = (pageWidth - shapeWidth);
                            }
                            switch (horzAlignment) {
                                case 'Center':
                                    indentX = this.viewer.clientActiveArea.x + (this.viewer.clientActiveArea.width - shapeWidth) / 2;
                                    break;
                                case 'Left':
                                    indentX = this.viewer.clientActiveArea.x;
                                    break;
                                case 'Right':
                                    // tslint:disable-next-line:max-line-length
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
                                // tslint:disable-next-line:max-line-length
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
                            // tslint:disable-next-line:max-line-length
                            indentX = this.getRightMarginHorizPosition(pageWidth, rightMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                            break;
                        case 'InsideMargin':
                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                // tslint:disable-next-line:max-line-length
                                indentX = this.getRightMarginHorizPosition(pageWidth, rightMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                            } else {
                                // tslint:disable-next-line:max-line-length
                                indentX = this.getLeftMarginHorizPosition(leftMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                            }
                            break;
                        case 'OutsideMargin':
                            if ((paragraph.bodyWidget.page.index + 1) % 2 === 0) {
                                // tslint:disable-next-line:max-line-length
                                indentX = this.getLeftMarginHorizPosition(leftMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                            } else {
                                // tslint:disable-next-line:max-line-length
                                indentX = this.getRightMarginHorizPosition(pageWidth, rightMargin, horzAlignment, horzPosition, shapeWidth, textWrapStyle);
                            }
                            break;
                        default:
                            indentX = this.viewer.clientArea.x + horzPosition;
                            break;
                    }
                    //Update the floating item right position to the page right when floating item 
                    //right position exceeds the page width and it wrapping style is not equal to  
                    // InFrontOfText and behind text and also vertical origin is not equal to paragraph.
                    if (paragraph && textWrapStyle !== 'InFrontOfText'
                        && textWrapStyle !== 'BehindText' && vertOrigin === 'Paragraph' && pageWidth < indentX + shapeWidth) {
                        indentX = pageWidth - shapeWidth;
                    }
                }
            }
            //}
        }
        return new Point(indentX, indentY);
    }
    // tslint:disable-next-line:max-line-length
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
        if (indentX < 0 && textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'BehindText') {
            indentX = 0;
        }
        return indentX;
    }
    // tslint:disable-next-line:max-line-length
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
        if ((indentX < 0 || indentX + shapeWidth > pageWidth) && textWrapStyle !== 'InFrontOfText' && textWrapStyle !== 'BehindText') {
            indentX = pageWidth - shapeWidth;
        }
        return indentX;
    }
    // tslint:disable-next-line:max-line-length
    private getVerticalPosition(paraItem: ElementBox, vertPosition: number, vertOrigin: VerticalOrigin, textWrapStyle: TextWrappingStyle): number {
        let paragraph: ParagraphWidget = paraItem.line.paragraph;
        //ParagraphLayoutInfo paragraphLayoutInfo = (paragraph as IWidget).LayoutInfo as ParagraphLayoutInfo;
        let shape: ShapeElementBox = paraItem as ShapeElementBox;
        //WPicture pic = paraItem as WPicture;
        let indentY: number = 0;
        let topMargin: number = paragraph.associatedCell.topMargin;
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
                if (shape) {
                    space = paragraph.paragraphFormat.afterSpacing;
                }
                indentY = paragraph.y + vertPosition + space;
                break;
            default:
                indentY = this.viewer.clientActiveArea.y + vertPosition;
                break;
        }
        return indentY;
    }
    /// <summary>
    /// Get Horizontal position of the picture
    /// </summary>
    /// <param name="picture"></param>
    /// <returns></returns>
    // tslint:disable-next-line:max-line-length
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
    private cropPosition(element: ImageElementBox): void {
        let right: number = 0;
        let bottom: number = 0;
        let image: ImageElementBox = element;
        image.isCrop = true;
        if (image.left !== 0) {
            image.x = (image.left * image.widthScale) / 100;
        }
        if (image.top !== 0) {
            image.y = (image.top * image.heightScale) / 100;
        }
        if (image.right !== 0) {
            right = (image.right * image.widthScale) / 100;
        }
        if (image.bottom !== 0) {
            bottom = (image.bottom * image.heightScale) / 100;
        }
        image.cropWidth = (image.widthScale - (image.x + right));
        image.cropHeight = (image.heightScale - (image.y + bottom));
    }
}