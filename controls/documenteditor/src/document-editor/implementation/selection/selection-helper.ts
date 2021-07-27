import { DocumentEditor } from '../../document-editor';
import {
    Widget, BodyWidget, TableRowWidget, TableWidget,
    LineWidget, ElementBox, TextElementBox, ListTextElementBox, ImageElementBox, Page, ParagraphWidget, TableCellWidget,
    FieldElementBox, BlockWidget, BlockContainer, BookmarkElementBox, DocumentHelper, CommentCharacterElementBox
} from '../index';
import { ElementInfo, IndexInfo, HelperMethods } from '../index';
import { Point } from '../index';
import { LayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Selection } from './selection';
import { HyperlinkType } from '../../index';
import { ShapeBase } from '../viewer';
/* eslint-disable */
/**
 * @private
 */
export class TextPosition {
    /**
     * @private
     */
    public currentWidget: LineWidget;
    /**
     * @private
     */
    public offset: number;
    /**
     * @private
     */
    public owner: DocumentEditor;
    /**
     * @private
     */
    public location: Point = new Point(0, 0);
    private documentHelper: DocumentHelper;
    /**
     * @private
     */
    public isUpdateLocation: boolean = true;
    /**
     * @private
     */
    public get paragraph(): ParagraphWidget {
        return this.currentWidget.paragraph;
    }
    /**
     * @private
     */
    public get isAtParagraphStart(): boolean {
        return this.offset === this.owner.selection.getStartOffset(this.paragraph);
    }
    /**
     * @private
     */
    public get isAtParagraphEnd(): boolean {
        return this.owner.selection.isParagraphLastLine(this.currentWidget)
            && this.offset === this.owner.selection.getLineLength(this.currentWidget);
    }

    /**
     * @private
     */
    public get isCurrentParaBidi(): boolean {
        if (!isNullOrUndefined(this.currentWidget.paragraph)) {
            return this.currentWidget.paragraph.paragraphFormat.bidi;
        }
        return false;
    }
    /**
     * @private
     */
    public get selection(): Selection {
        return this.owner.selection;
    }
    /**
     * Gets the hierarchical position of logical text position in the document
     *
     * @returns {string}
     */
    public get hierarchicalPosition(): string {
        return this.getHierarchicalIndexInternal();
    }

    constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.documentHelper = this.owner.documentHelper;
    }
    private get viewer(): LayoutViewer {
        return this.owner.viewer;
    }

    /**
     * Return clone of current text position
     *
     * @private
     */
    public clone(): TextPosition {
        const textPosition: TextPosition = new TextPosition(this.owner);
        textPosition.currentWidget = this.currentWidget;
        textPosition.offset = this.offset;
        textPosition.location = this.location;
        return textPosition;
    }
    /**
     * @private
     */
    public containsRtlText(widget: LineWidget): boolean {
        for (let i: number = 0; i < widget.children.length; i++) {
            if (widget.children[i].isRightToLeft) {
                return true;
            }
        }
        return false;
    }
    /**
     * Set text position for paragraph and inline
     *
     * @private
     */
    public setPositionForSelection(line: LineWidget, element: ElementBox, index: number, physicalLocation: Point): void {
        //Set the start end position
        let isParagraphEnd: boolean = false;
        if (isNullOrUndefined(element)) {
            this.currentWidget = line;
        } else {
            this.currentWidget = element.line as LineWidget;
            if (element.nextNode instanceof FieldElementBox && index > element.length) {
                isParagraphEnd = this.selection.isLastRenderedInline(element, element.length);
            }
        }
        this.location = physicalLocation;
        if (isParagraphEnd) {
            this.offset = this.selection.getParagraphLength(this.currentWidget.paragraph) + 1;
        } else {
            this.offset = this.currentWidget.getOffset(element, index);
        }
    }
    /**
     * Set text position
     *
     * @private
     */
    public setPositionFromLine(line: LineWidget, offset: number, location?: Point): void {
        this.currentWidget = line;
        this.offset = offset;
        if (location instanceof Point) {
            this.location.copy(location);
        }
    }
    /**
     * Set text position
     *
     * @private
     */
    public setPosition(line: LineWidget, positionAtStart: boolean): void {
        this.currentWidget = line;
        this.offset = positionAtStart ? this.selection.getStartOffset(line.paragraph)
            : (line.paragraph.lastChild as LineWidget).getEndOffset() + 1;
        this.updatePhysicalPosition(true);
    }
    /**
     * Set position for text position
     *
     * @private
     */
    public setPositionInternal(textPosition: TextPosition): void {
        this.currentWidget = textPosition.currentWidget;
        this.offset = textPosition.offset;
        this.location = textPosition.location;
    }
    /**
     * Set position for current index
     *
     * @private
     */
    public setPositionForCurrentIndex(hierarchicalIndex: string): void {
        const index: IndexInfo = { index: hierarchicalIndex };
        const paragraph: LineWidget = this.getParagraphWidget(index);   //ref hierarchicalIndex
        this.offset = parseFloat(index.index as string);
        this.setPositionParagraph(paragraph, this.offset);
    }
    /**
     * Get Page
     *
     */
    public getPage(position: IndexInfo): Page {
        let page: Page;
        let index: number = position.index.indexOf(';');
        let newValue: string = '0';
        if (index >= 0) {
            newValue = position.index.substring(0, index);
            position.index = position.index.substring(index).replace(';', '');
        }
        index = parseInt(newValue, 10);
        page = this.documentHelper.pages[index];
        return page;
    }
    /**
     * @private
     */
    public getParagraphWidget(position: IndexInfo): LineWidget {
        if (isNullOrUndefined(position.index)) {
            return undefined;
        }
        const page: Page = this.getPage(position);
        const child: LineWidget = this.getLineWidget(undefined, position, page);
        return child;
    }
    /**
     * @private
     */
    public getLineWidget(widget: Widget, position: IndexInfo, page?: Page): LineWidget {
        if (isNullOrUndefined(position.index)) {
            return undefined;
        }
        let index: number = position.index.indexOf(';');
        let value: string = '0';
        if (index >= 0) {
            value = position.index.substring(0, index);
            position.index = position.index.substring(index).replace(';', '');
        }
        if (value === 'H' || value === 'F') {
            if (value === 'H') {
                widget = page.headerWidget;
            } else {
                widget = page.footerWidget;
            }
        } else if (value === 'FN' || value === 'EN') {
            if (value === 'FN') {
                widget = page.footnoteWidget;
            } else {
                widget = page.endnoteWidget;
            }
        } else if (!isNullOrUndefined(page)) {
            widget = page.bodyWidgets[0];
        }

        index = parseInt(value, 10);
        if (widget instanceof BlockContainer) {
            index = position.index.indexOf(';');
            value = '0';
            value = position.index.substring(0, index);
            position.index = position.index.substring(index).replace(';', '');
            index = parseInt(value, 10);
        }
        if (widget instanceof TableRowWidget && index >= widget.childWidgets.length) {
            position.index = '0;0';
            index = widget.childWidgets.length - 1;
        }
        if (index >= 0 && index < widget.childWidgets.length) {
            const child: Widget = widget.childWidgets[index] as Widget;
            if (child instanceof LineWidget) {
                if (position.index.indexOf(';') > 0) {
                    position.index = '0';
                }
                return child as LineWidget;
            }
            if (child instanceof Widget) {
                if (position.index.indexOf(';') > 0) {
                    return this.getLineWidget(child, position);
                } else {
                    //If table is shifted to previous text position then return the first paragraph within table.
                    if (child instanceof TableWidget) {
                        return this.getLineWidget(this.selection.getFirstParagraphInFirstCell(child as TableWidget), position);
                    } else if (child instanceof TableRowWidget && position.index.indexOf(';') === -1) {
                        return this.selection.getFirstParagraphInFirstCell(child.ownerTable).childWidgets[0] as LineWidget;
                    }
                    return undefined;
                }
            }
        } else if (widget.nextRenderedWidget instanceof Widget) {
            position.index = '0';
            if (widget.nextRenderedWidget instanceof TableWidget) {
                return this.selection.getFirstParagraphInFirstCell(widget.nextRenderedWidget as TableWidget).firstChild as LineWidget;
            }
            return this.getLineWidget(widget.nextRenderedWidget as ParagraphWidget, position);
        }
        return undefined;
    }

    /**
     * Update physical location of paragraph
     *
     * @private
     */
    public updatePhysicalPosition(moveNextLine: boolean): void {
        if (this.currentWidget && this.owner.isLayoutEnabled && this.isUpdateLocation) {
            this.location = this.selection.getPhysicalPositionInternal(this.currentWidget, this.offset, moveNextLine);
        }
    }
    /**
     * Return true if text position are in same paragraph and offset
     *
     * @private
     */
    public isAtSamePosition(textPosition: TextPosition): boolean {
        return this.currentWidget === textPosition.currentWidget
            && this.offset === textPosition.offset;
    }

    /**
     * Return true if text position is in same paragraph index
     * @private
     */
     public isInSameParagraphIndex(textPosition: TextPosition): boolean {
        if (isNullOrUndefined(textPosition)) {
            throw new Error('textPosition is undefined.');
        }
        return this.paragraph.index === textPosition.paragraph.index;
    }

    /**
     * Return true if text position is in same paragraph
     *
     * @private
     */
    public isInSameParagraph(textPosition: TextPosition): boolean {
        if (isNullOrUndefined(textPosition)) {
            throw new Error('textPosition is undefined.');
        }
        return this.paragraph === textPosition.paragraph;
    }
    /**
     * Return true is current text position exist before given text position
     *
     * @private
     */
    public isExistBefore(textPosition: TextPosition): boolean {
        if (isNullOrUndefined(textPosition)) {
            throw new Error('textPosition is undefined.');
        }
        if (this.currentWidget === textPosition.currentWidget) {
            return this.offset < textPosition.offset;
        }
        const currentParagraph: ParagraphWidget = this.currentWidget.paragraph;
        const paragraph: ParagraphWidget = textPosition.currentWidget.paragraph;
        if (currentParagraph === paragraph) {
            return currentParagraph.childWidgets.indexOf(this.currentWidget) < paragraph.childWidgets.indexOf(textPosition.currentWidget);
        }
        if (currentParagraph.containerWidget === paragraph.containerWidget) {
            if (currentParagraph.isInsideTable) {
                return currentParagraph.associatedCell.childWidgets.indexOf(currentParagraph) <
                    paragraph.associatedCell.childWidgets.indexOf(paragraph);
                //handle after header footer implementation
                // } else if ((this.currentParagraph).owner instanceof WHeaderFooter) {
                //     return ((this.currentParagraph).owner as WHeaderFooter).blocks.indexOf((this.currentParagraph)) <
                //         ((textPosition.currentParagraph).owner as WHeaderFooter).blocks.indexOf((textPosition.currentParagraph));
            } else {
                return (currentParagraph.containerWidget.childWidgets.indexOf(currentParagraph)) <
                    (paragraph.containerWidget.childWidgets.indexOf(paragraph));
            }
        }
        return this.owner.selection.isExistBefore(currentParagraph, paragraph);
    }
    /**
     * Return true is current text position exist after given text position
     *
     * @private
     */
    public isExistAfter(textPosition: TextPosition): boolean {
        if (isNullOrUndefined(textPosition)) {
            throw new Error('textPosition is undefined.');
        }
        if (this.currentWidget === textPosition.currentWidget) {
            return this.offset > textPosition.offset;
        }
        if (this.currentWidget.paragraph === textPosition.currentWidget.paragraph) {
            return this.currentWidget.paragraph.childWidgets.indexOf(this.currentWidget) >
                textPosition.currentWidget.paragraph.childWidgets.indexOf(textPosition.currentWidget);

        }
        const startParagraph: ParagraphWidget = this.currentWidget.paragraph;
        const endParagraph: ParagraphWidget = textPosition.currentWidget.paragraph;
        if (startParagraph.containerWidget instanceof BodyWidget && endParagraph.containerWidget instanceof BodyWidget &&
            startParagraph.containerWidget === endParagraph.containerWidget) {
            if (startParagraph.isInsideTable && endParagraph.isInsideTable) {
                return startParagraph.associatedCell.childWidgets.indexOf(startParagraph) >
                    endParagraph.associatedCell.childWidgets.indexOf(endParagraph);
                // } else if ((this.currentParagraph).owner instanceof WHeaderFooter) {
                //     return ((this.currentParagraph).owner as WHeaderFooter).blocks.indexOf((this.currentParagraph)) >
                //         ((textPosition.currentParagraph).owner as WHeaderFooter).blocks.indexOf((textPosition.currentParagraph));
            } else {
                return (startParagraph.containerWidget.childWidgets.indexOf(startParagraph) >
                    (endParagraph.containerWidget.childWidgets.indexOf(endParagraph)));
            }
        }
        return this.owner.selection.isExistAfter(startParagraph, endParagraph);
    }
    /**
     * Return hierarchical index of current text position
     *
     * @private
     */
    public getHierarchicalIndexInternal(): string {
        return this.getHierarchicalIndex(this.currentWidget as LineWidget, this.offset.toString());
    }
    /**
     * @private
     */
    public getHierarchicalIndex(line: LineWidget, hierarchicalIndex: string): string {
        const node: LineWidget = line;
        if (node) {
            return (node as LineWidget).getHierarchicalIndex(hierarchicalIndex);
        }
        return hierarchicalIndex;
    }
    /**
     * @private
     */
    public setPositionParagraph(line: LineWidget, offsetInLine: number): void {
        this.currentWidget = line;
        this.offset = offsetInLine;
        this.updatePhysicalPosition(true);
    }
    /**
     * @private
     */
    public setPositionForLineWidget(lineWidget: LineWidget, offset: number): void {
        let lineLength: number = this.selection.getLineLength(lineWidget);
        const lineIndex: number = lineWidget.paragraph.childWidgets.indexOf(lineWidget);
        if (lineWidget.isLastLine()) {
            if (!isNullOrUndefined(lineWidget.paragraph.footNoteReference)) {
                lineLength = lineLength + lineWidget.paragraph.footNoteReference.text.length;
            } else {
                lineLength = lineLength + 1;
            }
        }
        if (offset > lineLength) {
            let nextLineWidget: LineWidget;
            if (lineIndex >= lineWidget.paragraph.childWidgets.length - 1) {
                const nextBlock: BlockWidget = this.selection.getNextRenderedBlock(lineWidget.paragraph);
                if (nextBlock && nextBlock.index === lineWidget.paragraph.index) {
                    nextLineWidget = nextBlock.firstChild as LineWidget;
                }
            } else {
                nextLineWidget = lineWidget.paragraph.childWidgets[lineIndex + 1] as LineWidget;
            }
            this.setPositionForLineWidget(nextLineWidget, offset - lineLength);
            return;
        } else if (offset < 0) {
            const prevLine: LineWidget = lineWidget.paragraph.childWidgets[lineIndex - 1] as LineWidget;
            const currentOffSet: number = this.selection.getLineLength(prevLine) + offset;
            this.setPositionForLineWidget(prevLine, currentOffSet);
            return;
        } else {
            this.currentWidget = lineWidget;
            this.offset = offset;
        }
        this.updatePhysicalPosition(true);
    }
    /**
     * move to next text position
     *
     * @private
     */
    public moveNextPosition(isNavigate?: boolean): void {
        if (isNullOrUndefined(isNavigate)) {
            isNavigate = true;
        }
        let inline: ElementBox = this.selection.getNextStartInline(this.currentWidget, this.offset);
        if (inline instanceof FieldElementBox && inline.fieldType === 0 && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
            if (isNavigate) {
                this.moveNextPositionInternal(inline as FieldElementBox);
                this.moveNextPosition();
                return;
            } else {
                const line: LineWidget = (inline as FieldElementBox).fieldEnd.line as LineWidget;
                const fieldEnd: FieldElementBox = (inline as FieldElementBox).fieldEnd;
                const fieldEndOffset: number = line.getOffset(fieldEnd, 1);
                const fieldEndIndex: string = this.getHierarchicalIndex(line, fieldEndOffset.toString());
                if (TextPosition.isForwardSelection(this.selection.end.getHierarchicalIndexInternal(), fieldEndIndex)) {
                    //If field end is after selection end, extend selection end to field end.
                    this.selection.end.moveToInline(inline.fieldEnd, 1);
                    return;
                }
                this.moveToInline((inline as FieldElementBox).fieldEnd, 1);
            }
        }
        const nextOffset: number = this.selection.getNextValidOffset(this.currentWidget, this.offset);
        const lineIndex: number = this.paragraph.childWidgets.indexOf(this.currentWidget);
        let index: number = 0;
        if (nextOffset > this.offset) {
            this.offset = nextOffset;
            const info: ElementInfo = this.currentWidget.getInline(this.offset, index) as ElementInfo;
            inline = info.element;
            index = info.index;
            if (!isNullOrUndefined(inline) && index === inline.length && (inline.nextNode instanceof FieldElementBox
                || inline.nextNode instanceof BookmarkElementBox)) {
                const nextValidInline: ElementBox = this.selection.getNextValidElement((inline.nextNode as FieldElementBox)) as ElementBox;
                //Moves to field end mark or Bookmark end.
                if (nextValidInline instanceof FieldElementBox && nextValidInline.fieldType === 1
                    || nextValidInline instanceof BookmarkElementBox && nextValidInline.bookmarkType === 1) {
                    inline = nextValidInline as FieldElementBox;
                    this.currentWidget = inline.line;
                    this.offset = this.currentWidget.getOffset(inline, this.documentHelper.isFormFillProtectedMode ? 0 : 1);
                }
            }
        } else if (lineIndex + 1 < this.paragraph.childWidgets.length) {
            const nextLineWidget: LineWidget = this.paragraph.childWidgets[lineIndex + 1] as LineWidget;
            if (nextLineWidget) {
                this.currentWidget = nextLineWidget;
                this.offset = this.selection.getStartLineOffset(this.currentWidget);
            }
            const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, index);
            inline = inlineObj.element;
            index = inlineObj.index;
            if (inline instanceof FieldElementBox && inline.fieldType === 0) {
                this.offset++;
            }
        } else {
            this.updateOffsetToNextParagraph(index, false);
        }
        //Gets physical position in current page.
        this.updatePhysicalPosition(true);
    }
    /**
     * Move text position to previous paragraph inside table
     *
     * @private
     */
    public moveToPreviousParagraphInTable(selection: Selection): void {
        let previousParagraph: ParagraphWidget;
        const currentPara: ParagraphWidget = this.currentWidget.paragraph;
        if (currentPara.isInsideTable) {
            previousParagraph = selection.getPreviousSelectionCell(currentPara.associatedCell);
        } else {
            previousParagraph = selection.getPreviousParagraphBlock(currentPara);
        }
        if (isNullOrUndefined(previousParagraph)) {
            return;
        }
        this.currentWidget = previousParagraph.childWidgets[previousParagraph.childWidgets.length - 1] as LineWidget;
        this.offset = this.currentWidget.getEndOffset() + 1;
    }
    private updateOffsetToNextParagraph(indexInInline: number, isHighlight: boolean): void {
        //Moves to owner and get next paragraph.
        let inline: ElementBox;
        let positionAtStart: boolean = false;
        let nextParagraph: ParagraphWidget = undefined;
        const lineIndex: number = this.paragraph.childWidgets.indexOf(this.currentWidget);
        if (!isHighlight) {
            nextParagraph = this.selection.getNextParagraphBlock(this.paragraph) as ParagraphWidget;
        } else if (lineIndex + 1 < this.paragraph.childWidgets.length) {
            const nextLineWidget: LineWidget = this.paragraph.childWidgets[lineIndex + 1] as LineWidget;
            if (nextLineWidget) {
                this.currentWidget = nextLineWidget;
                this.offset = 1;
            }
        } else {
            nextParagraph = this.selection.getNextSelectionBlock(this.paragraph);
            if (!isNullOrUndefined(nextParagraph)) {
                if (nextParagraph.containerWidget instanceof TableCellWidget) {
                    if (this.selection.start.paragraph.isInsideTable) {

                        const containerCell: TableCellWidget = this.selection.getContainerCellOf(this.selection.start.paragraph.associatedCell, nextParagraph.associatedCell);
                        positionAtStart = !containerCell.ownerTable.contains(nextParagraph.associatedCell);
                    } else {
                        positionAtStart = true;
                    }
                }
            }
        }
        if (!isNullOrUndefined(nextParagraph) && nextParagraph.childWidgets.length > 0) {
            if (!positionAtStart) {
                this.currentWidget = nextParagraph.firstChild as LineWidget;
                this.offset = isHighlight ? 1 : this.selection.getStartLineOffset(this.currentWidget);
            } else {
                this.currentWidget = nextParagraph.childWidgets[nextParagraph.childWidgets.length - 1] as LineWidget;
                this.offset = this.selection.getLineLength(this.currentWidget) + 1;
            }
        }
        const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline);
        inline = inlineObj.element;
        indexInInline = inlineObj.index;
        if (inline instanceof FieldElementBox && inline.fieldType === 0) {
            this.offset++;
        }
    }
    private updateOffsetToPrevPosition(index: number, isHighlight: boolean): void {
        let inlineInfo: ElementInfo;
        let inline: ElementBox;
        const lineIndex: number = this.paragraph.childWidgets.indexOf(this.currentWidget);
        const prevOffset: number = this.selection.getPreviousValidOffset(this.currentWidget.paragraph as ParagraphWidget, this.offset);
        if (this.offset > prevOffset) {
            this.offset = prevOffset;
        } else if (lineIndex > 0) {
            const prevLineWidget: LineWidget = this.paragraph.childWidgets[lineIndex - 1] as LineWidget;
            if (prevLineWidget) {
                this.currentWidget = prevLineWidget;
                const endOffset: number = this.currentWidget.getEndOffset();
                this.offset = endOffset > 0 ? endOffset - 1 : endOffset;
            }
        } else {
            //Moves to owner and get previous paragraph.
            let previousParagraph: ParagraphWidget = undefined;
            let positionAtStart: boolean = false;
            if (!isHighlight) {
                previousParagraph = this.selection.getPreviousParagraphBlock(this.paragraph);
            } else {
                previousParagraph = this.selection.getPreviousSelectionBlock(this.paragraph);
                if (!isNullOrUndefined(previousParagraph)) {
                    if (previousParagraph.containerWidget instanceof TableCellWidget) {
                        if (this.selection.start.paragraph.isInsideTable) {

                            const containerCell: TableCellWidget = this.selection.getContainerCellOf(this.selection.start.paragraph.associatedCell, previousParagraph.associatedCell);
                            positionAtStart = !containerCell.ownerTable.contains(previousParagraph.associatedCell);
                        } else {
                            positionAtStart = true;
                        }
                    }
                }
            }
            if (!isNullOrUndefined(previousParagraph)) {
                if (!positionAtStart) {
                    this.currentWidget = previousParagraph.childWidgets[previousParagraph.childWidgets.length - 1] as LineWidget;
                    // line end with page break and updating offset before page break.

                    this.offset = this.currentWidget.isEndsWithPageBreak ? this.currentWidget.getEndOffset() - 1 : this.currentWidget.getEndOffset();
                } else {
                    this.currentWidget = previousParagraph.firstChild as LineWidget;
                    this.offset = this.selection.getStartLineOffset(this.currentWidget);
                }
            }
        }
        index = 0;
        inlineInfo = this.currentWidget.getInline(this.offset, index) as ElementInfo;
        inline = inlineInfo.element;
        index = inlineInfo.index;
        if (inline instanceof FieldElementBox && inline.fieldType === 0) {
            this.offset++;
        }
        if (inline instanceof FieldElementBox) {
            //Checks if field character is part of rendered field, otherwise moves to previous rendered content.
            const previousInline: ElementBox = this.selection.getPreviousValidElement(inline);
            if (!isNullOrUndefined(previousInline)) {
                inline = previousInline;
                this.currentWidget = inline.line;
                this.offset = this.currentWidget.getOffset(inline, inline.length);
                if (inline instanceof FieldElementBox && inline.fieldType === 0) {
                    this.offset--;
                }
            }
        }
        //Gets physical position in current page.
        this.updatePhysicalPosition(true);
    }
    /**
     * Moves the text position to start of the next paragraph.
     */
    public moveToNextParagraphStartInternal(): void {
        const paragraph: ParagraphWidget = this.currentWidget.paragraph;
        if (!isNullOrUndefined(this.selection.getNextParagraphBlock(paragraph))) {

            this.currentWidget = this.selection.getNextParagraphBlock(paragraph).firstChild as LineWidget;
            this.offset = this.selection.getStartOffset(paragraph);
            this.updatePhysicalPosition(true);
        }
    }
    /**
     * Move to previous position
     *
     * @private
     */
    public movePreviousPosition(): void {
        let index: number = 0;
        const inlineInfo: ElementInfo = this.currentWidget.getInline(this.offset, index) as ElementInfo;
        const inline: ElementBox = inlineInfo.element;
        index = inlineInfo.index;
        const lineIndex: number = this.paragraph.childWidgets.indexOf(this.currentWidget);
        if (inline instanceof FieldElementBox && inline.fieldType === 1 && !isNullOrUndefined((inline as FieldElementBox).fieldBegin)
            || inline instanceof BookmarkElementBox && inline.bookmarkType === 1) {
            this.movePreviousPositionInternal(inline as FieldElementBox);
        }
        this.updateOffsetToPrevPosition(index, false);
    }
    /**
     * Move to next position
     *
     * @private
     */
    public moveNextPositionInternal(fieldBegin: FieldElementBox): void {
        let inline: ElementBox;
        if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
            inline = fieldBegin.fieldEnd;
        } else {
            inline = fieldBegin.fieldSeparator;
            this.currentWidget = inline.line;

            if (this.currentWidget === fieldBegin.fieldEnd.line && !this.selection.hasValidInline(this.paragraph, inline, fieldBegin.fieldEnd)) {
                inline = fieldBegin.fieldEnd;
            }
        }
        this.currentWidget = inline.line;
        this.offset = this.currentWidget.getOffset(inline, 1);
    }
    /**
     * Move text position backward
     *
     * @private
     */
    public moveBackward(): void {
        let indexInInline: number = 0;
        const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline) as ElementInfo;
        const inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        if (!this.owner.selection.isEmpty && !isNullOrUndefined(inline)) {
            const nextInline: ElementBox = this.selection.getNextRenderedElementBox(inline, indexInInline);
            if (nextInline instanceof FieldElementBox && (nextInline as FieldElementBox).fieldType === 0) {
                const hierarchicalIndex: string = this.owner.selection.start.getHierarchicalIndexInternal();

                const fieldEndOffset: number = (nextInline as FieldElementBox).fieldEnd.line.getOffset((nextInline as FieldElementBox).fieldEnd, 1);

                const fieldEndIndex: string = this.getHierarchicalIndex((nextInline as FieldElementBox).fieldEnd.line, fieldEndOffset.toString());
                if (!TextPosition.isForwardSelection(fieldEndIndex, hierarchicalIndex)) {
                    //If field end is after selection start, move selection start to field end.

                    this.owner.selection.start.setPositionParagraph((nextInline as FieldElementBox).fieldEnd.line, fieldEndOffset);
                    return;
                }
            }
        }
        if (inline instanceof FieldElementBox && inline.fieldType === 1 && !isNullOrUndefined((inline as FieldElementBox).fieldBegin)) {
            const hierarchicalIndex: string = this.owner.selection.start.getHierarchicalIndexInternal();
            const fieldEndOffset: number = inline.line.getOffset(inline, 1);
            const fieldEndIndex: string = this.getHierarchicalIndex(inline.line, fieldEndOffset.toString());
            if (!TextPosition.isForwardSelection(hierarchicalIndex, fieldEndIndex)) {
                //If field end is after selection start, extend selection end to field begin.

                const fieldBeginOffset: number = (inline as FieldElementBox).fieldBegin.line.getOffset((inline as FieldElementBox).fieldBegin, 0);
                this.currentWidget = (inline as FieldElementBox).fieldBegin.line;
                this.offset = fieldBeginOffset;
                //Updates physical position in current page.
                this.updatePhysicalPosition(true);
                return;
            }
            this.movePreviousPositionInternal(inline as FieldElementBox);
        }
        this.updateOffsetToPrevPosition(indexInInline, true);
    }
    /**
     * Move text position forward
     *
     * @private
     */
    public moveForward(): void {
        let indexInInline: number = 0;
        const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline) as ElementInfo;
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        if (!isNullOrUndefined(inline)) {
            if (!this.owner.selection.isEmpty && indexInInline === inline.length && inline instanceof FieldElementBox
                && (inline as FieldElementBox).fieldType === 1) {
                const hierarchicalIndex: string = this.owner.selection.start.getHierarchicalIndexInternal();

                const fieldBeginOffset: number = (inline as FieldElementBox).fieldBegin.line.getOffset((inline as FieldElementBox).fieldBegin, 0);

                const fieldBeginIndex: string = this.getHierarchicalIndex((inline as FieldElementBox).fieldBegin.line, fieldBeginOffset.toString());
                if (!TextPosition.isForwardSelection(hierarchicalIndex, fieldBeginIndex)) {
                    //If field begin is before selection start, move selection start to field begin.

                    this.owner.selection.start.setPositionParagraph((inline as FieldElementBox).fieldBegin.line, fieldBeginOffset);
                    return;
                }
            }
            inline = this.selection.getNextRenderedElementBox(inline, indexInInline);
        }
        if (inline instanceof FieldElementBox && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
            const selectionStartParagraph: ParagraphWidget = this.owner.selection.start.paragraph as ParagraphWidget;
            let selectionStartIndex: number = 0;

            const selectionStartInlineObj: ElementInfo = selectionStartParagraph.getInline(this.owner.selection.start.offset, selectionStartIndex);
            const selectionStartInline: ElementBox = selectionStartInlineObj.element;
            selectionStartIndex = selectionStartInlineObj.index;
            const nextRenderInline: ElementBox = this.selection.getNextRenderedElementBox(selectionStartInline, selectionStartIndex);
            if (nextRenderInline === inline) {
                this.moveNextPositionInternal(inline as FieldElementBox);
            } else {
                //If selection start is before field begin, extend selection end to field end.
                inline = (inline as FieldElementBox).fieldEnd;
                this.currentWidget = inline.line;
                this.offset = this.currentWidget.getOffset(inline, 1);
                //Updates physical position in current page.
                this.updatePhysicalPosition(true);
                return;
            }
        } else if ((inline instanceof FieldElementBox)
            && ((inline as FieldElementBox).fieldType === 0 || (inline as FieldElementBox).fieldType === 1)) {
            this.currentWidget = inline.line;
            this.offset = this.currentWidget.getOffset(inline, 1);
        }
        indexInInline = 0;
        const nextOffset: number = this.selection.getNextValidOffset(this.currentWidget as LineWidget, this.offset);
        const length: number = this.selection.getLineLength(this.currentWidget);
        const isParagraphEnd: boolean = this.selection.isParagraphLastLine(this.currentWidget);
        if (this.offset < nextOffset) {
            this.offset = nextOffset;
            const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline);
            inline = inlineObj.element;
            indexInInline = inlineObj.index;
            if (!isNullOrUndefined(inline) && indexInInline === inline.length && inline.nextNode instanceof FieldElementBox) {
                const nextValidInline: ElementBox = this.selection.getNextValidElement(inline.nextNode);
                //Moves to field end mark.
                if (nextValidInline instanceof FieldElementBox && (nextValidInline as FieldElementBox).fieldType === 1) {
                    inline = nextValidInline;
                    this.offset = this.currentWidget.getOffset(inline, 1);
                }
            }
        } else if (this.offset === nextOffset && inline instanceof FieldElementBox && inline.fieldType === 1 &&
            inline.previousNode instanceof ImageElementBox) {
            this.offset = nextOffset;
        } else if (this.offset === nextOffset && this.offset < length + 1 && isParagraphEnd) {
            this.offset = length + 1;
        } else {
            this.updateOffsetToNextParagraph(indexInInline, true);
        }
        //Gets physical position in current page.
        this.updatePhysicalPosition(true);
    }
    /**
     * Move to given inline
     *
     * @private
     */
    public moveToInline(inline: ElementBox, index: number): void {
        this.currentWidget = inline.line;
        this.offset = this.currentWidget.getOffset(inline, index);
        //Updates physical position in current page.
        this.updatePhysicalPosition(true);
    }
    /**
     * Return true is start element exist before end element
     *
     * @private
     */
    public static isForwardSelection(start: string, end: string): boolean {
        if (start === end) {
            return true;
        }
        start = start.replace(/C;/g, '');
        end = end.replace(/C;/g, '');
        start = start.replace(/H;/g, '');
        end = end.replace(/H;/g, '');
        start = start.replace(/F;/g, '');
        end = end.replace(/F;/g, '');
        const selectionStart: string[] = start.split(';');
        const selectionEnd: string[] = end.split(';');
        let length: number = selectionStart.length;
        if (length > selectionEnd.length) {
            length = selectionEnd.length - 1;
        }
        for (let i: number = 0; i < length; i++) {
            const startOffset: number = parseFloat(selectionStart[i]);
            const endOffset: number = parseFloat(selectionEnd[i]);
            if (startOffset !== endOffset) {
                return startOffset < endOffset;
            }
        }
        return false;
    }
    /**
     * Move to previous position offset
     *
     * @param fieldEnd
     * @private
     */
    public movePreviousPositionInternal(fieldEnd: FieldElementBox): void {
        let inline: ElementBox;
        if (fieldEnd instanceof FieldElementBox && isNullOrUndefined(fieldEnd.fieldSeparator)) {
            inline = this.selection.getPreviousValidElement(fieldEnd.fieldBegin);
        } else {
            inline = this.selection.getPreviousValidElement(fieldEnd);
        }
        this.currentWidget = inline.line;

        const index: number = inline instanceof FieldElementBox || inline instanceof BookmarkElementBox && inline.bookmarkType === 1 ? 0 : inline.length;
        this.offset = this.currentWidget.getOffset(inline, index);
    }
    /**
     * Moves the text position to start of the word.
     *
     * @param type
     * @private
     */
    public moveToWordStartInternal(type: number): void {
        const endOffset: number = this.currentWidget.getEndOffset();
        const currentPara: ParagraphWidget = this.currentWidget.paragraph;
        const selection: Selection = this.selection;
        if (type === 2 && (this.offset === endOffset || this.offset === endOffset + 1)) {
            return;
        }
        if (this.offset === endOffset + 1) {
            this.offset = endOffset;
        } else if (this.offset === selection.getStartOffset(currentPara) && this.currentWidget === currentPara.childWidgets[0]) {
            const previousParagraph: ParagraphWidget = selection.getPreviousParagraphBlock(currentPara);
            if (isNullOrUndefined(previousParagraph)) {
                return;
            }
            this.currentWidget = previousParagraph.childWidgets[previousParagraph.childWidgets.length - 1] as LineWidget;
            this.offset = this.currentWidget.getEndOffset();
        } else {
            if (this.offset === selection.getStartLineOffset(this.currentWidget)) {
                const lineIndex: number = currentPara.childWidgets.indexOf(this.currentWidget);
                if (lineIndex - 1 >= 0) {
                    this.currentWidget = currentPara.childWidgets[lineIndex - 1] as LineWidget;
                    this.offset = this.currentWidget.getEndOffset();
                }
            }
            const isStarted: boolean = false;
            const endSelection: boolean = false;
            let indexInInline: number = 0;
            const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline) as ElementInfo;
            const inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;

            this.getPreviousWordOffset(inline, selection, indexInInline, type, (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 1), isStarted, endSelection, this);
        }
        if (type === 1) {
            this.calculateOffset();
        }
        this.updatePhysicalPosition(true);
    }

    public getNextWordOffset(inline: ElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        if (inline instanceof TextElementBox) {
            this.getNextWordOffsetSpan(inline as TextElementBox, indexInInline, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (inline instanceof ImageElementBox) {

            this.getNextWordOffsetImage(inline as ImageElementBox, indexInInline, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 0) {

            this.getNextWordOffsetFieldBegin(inline as FieldElementBox, indexInInline, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 2 || inline instanceof BookmarkElementBox) {

            this.getNextWordOffsetFieldSeparator(inline as FieldElementBox, indexInInline, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 1) {

            this.getNextWordOffsetFieldEnd(inline as FieldElementBox, indexInInline, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (inline instanceof CommentCharacterElementBox) {

            this.getNextWordOffsetComment(inline as CommentCharacterElementBox, indexInInline, type, isInField, endSelection, endPosition, excludeSpace);
        }
    }

    public getNextWordOffsetFieldBegin(fieldBegin: FieldElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        const startOffset: number = fieldBegin.line.getOffset(fieldBegin, 0);
        const endOffset: number = startOffset + fieldBegin.length;
        if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
            this.getNextWordOffsetFieldEnd(fieldBegin.fieldEnd, 0, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (type === 0) {

            this.getNextWordOffsetFieldSeparator(fieldBegin.fieldSeparator, 0, type, isInField, endSelection, endPosition, excludeSpace);
        } else if (!isNullOrUndefined(fieldBegin.fieldEnd)) {
            let inline: FieldElementBox = fieldBegin.fieldSeparator;

            if (inline.line.paragraph === fieldBegin.fieldEnd.line.paragraph && !this.selection.hasValidInline(inline.line.paragraph, inline, fieldBegin.fieldEnd)) {
                inline = fieldBegin.fieldEnd;
            }

            this.getNextWordOffset(inline, 0, type, !(endPosition.paragraph === fieldBegin.line.paragraph && endPosition.offset === startOffset), endSelection, endPosition, excludeSpace);

            if (endSelection && !isNullOrUndefined(fieldBegin.fieldSeparator) && (endPosition.paragraph === fieldBegin.line.paragraph) && (endPosition.offset === fieldBegin.fieldSeparator.line.getOffset(fieldBegin.fieldSeparator, fieldBegin.fieldSeparator.length))) {
                endPosition.setPositionParagraph(fieldBegin.line, startOffset);
                return;
            }
            if (!endSelection) {

                endPosition.setPositionParagraph(fieldBegin.fieldEnd.line, fieldBegin.fieldEnd.line.getOffset(fieldBegin.fieldEnd, fieldBegin.fieldEnd.length));
            }
        }
    }

    public getNextWordOffsetImage(image: ImageElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        if (isInField) {
            endPosition.setPositionParagraph(image.line, image.line.getOffset(image, indexInInline));
            endSelection = false;
            return;
        }
        if (indexInInline === 0) {
            const startOffset: number = image.line.getOffset(image, 0);
            endSelection = true;
            if (endPosition.offset === startOffset) {
                if (isNullOrUndefined(image.nextNode)) {
                    endPosition.setPositionParagraph(image.line, startOffset + image.length);
                } else {
                    this.getNextWordOffset(image.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
                }
            } else {
                endPosition.setPositionParagraph(image.line, startOffset);
            }
        } else if (!isNullOrUndefined(image.nextNode)) {
            this.getNextWordOffset(image.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
        }
    }

    private getNextWordOffsetSpan(span: TextElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        if (span.text === '\t' || span.text === '\v') {
            if (isInField) {
                endPosition.setPositionParagraph(span.line, span.line.getOffset(span, indexInInline));
                endSelection = false;
                return;
            }
            if (indexInInline === 0) {
                endSelection = true;
                const startOffset: number = span.line.getOffset(span, 0);
                if (endPosition.offset === startOffset) {
                    endPosition.setPositionParagraph(span.line, startOffset + span.length);
                } else {
                    endPosition.setPositionParagraph(span.line, startOffset);
                }
            } else if (!isNullOrUndefined(span.nextNode)) {
                this.getNextWordOffset(span.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
            }
        } else {
            let wordEndIndex: number = 0;
            if (indexInInline === 0 && endSelection && (HelperMethods.wordSplitCharacters.indexOf(span.text[0]) === -1)) {
                endPosition.setPositionParagraph(span.line, span.line.getOffset(span, indexInInline));
                if (isInField) {
                    return;
                }
            } else if (indexInInline < span.length) {

                const txt: string = indexInInline > 0 && span.text.length - 1 >= indexInInline ? span.text.slice(indexInInline, span.length) : span.text;
                wordEndIndex = HelperMethods.indexOfAny(txt, HelperMethods.wordSplitCharacters);
                if (wordEndIndex === -1 && span.nextNode instanceof CommentCharacterElementBox &&
                    isNullOrUndefined(span.nextNode.nextNode)) {
                    wordEndIndex = span.length;
                }
                if (wordEndIndex !== -1) {
                    if (isInField) {
                        endSelection = false;
                        return;
                    }
                    const offset: number = span.line.getOffset(span, wordEndIndex + indexInInline);

                    if ((excludeSpace || txt[wordEndIndex] !== ' ') && !endSelection && span.line.paragraph === endPosition.paragraph && offset !== endPosition.offset) {
                        endSelection = true;
                        endPosition.setPositionParagraph(span.line, offset);
                        return;
                    }
                    wordEndIndex++;
                    while (wordEndIndex < txt.length && HelperMethods.wordSplitCharacters.indexOf(txt[wordEndIndex]) !== -1) {
                        if (txt[wordEndIndex] !== ' ' && txt[wordEndIndex] !== '　') {
                            break;
                        }
                        wordEndIndex++;
                    }
                    endSelection = true;
                    if (wordEndIndex < txt.length) {

                        endPosition.setPositionParagraph(span.line, span.line.getOffset(span, wordEndIndex + indexInInline));
                    } else if (!isNullOrUndefined(span.nextNode)) {

                        this.getNextWordOffset(span.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
                    } else {

                        endPosition.setPositionParagraph(span.line, span.line.getOffset(span, wordEndIndex + indexInInline));
                    }
                } else if (!isNullOrUndefined(span.nextNode)) {
                    this.getNextWordOffset(span.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
                } else {
                    endPosition.setPositionParagraph(span.line, span.line.getEndOffset());
                }
            } else if (!isNullOrUndefined(span.nextNode)) {
                this.getNextWordOffset(span.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
            }
        }
    }

    private getNextWordOffsetFieldSeparator(fieldSeparator: FieldElementBox | BookmarkElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        if (!isNullOrUndefined(fieldSeparator.nextNode)) {
            this.getNextWordOffset(fieldSeparator.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
        }
    }

    private getNextWordOffsetComment(comment: ElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        if (!isNullOrUndefined(comment.nextNode)) {
            this.getNextWordOffset(comment.nextNode, 0, type, isInField, endSelection, endPosition, excludeSpace);
        }
    }


    private getNextWordOffsetFieldEnd(fieldEnd: FieldElementBox, indexInInline: number, type: number, isInField: boolean, endSelection: boolean, endPosition: TextPosition, excludeSpace: boolean): void {
        const startOffset: number = fieldEnd.line.getOffset(fieldEnd, 0);
        const endOffset: number = startOffset + fieldEnd.length;
        if (endPosition.offset === startOffset) {
            endPosition.setPositionParagraph(fieldEnd.line, endOffset);
            if (isNullOrUndefined(fieldEnd.nextNode)) {
                return;
            }
        }
        if (!isNullOrUndefined(fieldEnd.nextNode)) {
            this.getNextWordOffset(fieldEnd.nextNode, 0, type, false, endSelection, endPosition, excludeSpace);
            if (endPosition.offset === endOffset) {
                endPosition.setPositionParagraph(fieldEnd.line, startOffset);
            }
        } else {
            endPosition.setPositionParagraph(fieldEnd.line, startOffset);
        }
        endSelection = true;
    }


    private getPreviousWordOffset(inline: ElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        if (inline instanceof TextElementBox) {

            this.getPreviousWordOffsetSpan(inline as TextElementBox, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof ImageElementBox) {

            this.getPreviousWordOffsetImage(inline as ImageElementBox, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 0) {

            this.getPreviousWordOffsetFieldBegin(inline as FieldElementBox, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 2) {

            this.getPreviousWordOffsetFieldSeparator(inline as FieldElementBox, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 1) {

            this.getPreviousWordOffsetFieldEnd(inline as FieldElementBox, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof BookmarkElementBox) {
            this.getPreviousWordOffsetBookMark(inline, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof ListTextElementBox && inline.previousNode) {

            this.getPreviousWordOffsetSpan(inline.previousNode as ListTextElementBox, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        } else if (inline instanceof CommentCharacterElementBox) {

            this.getPreviousWordOffsetComment(inline, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
        }
    }

    private getPreviousWordOffsetBookMark(bookmark: BookmarkElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        if (bookmark.previousNode) {
            if (bookmark.previousNode instanceof TextElementBox) {
                const inline: TextElementBox = bookmark.previousNode as TextElementBox;
                if (HelperMethods.lastIndexOfAny(inline.text, HelperMethods.wordSplitCharacters) !== inline.text.length - 1) {
                    this.getPreviousWordOffset(inline, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
                } else {
                    endPosition.setPositionParagraph(bookmark.line, bookmark.line.getOffset(bookmark, 0));
                }
            }

        } else {
            endPosition.setPositionParagraph(bookmark.line, selection.getStartLineOffset(bookmark.line));
        }
    }


    private getPreviousWordOffsetFieldEnd(fieldEnd: FieldElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        const startOffset: number = fieldEnd.line.getOffset(fieldEnd, 0);
        const endOffset: number = startOffset + fieldEnd.length;
        if (isNullOrUndefined(fieldEnd.fieldSeparator)) {
            this.getPreviousWordOffsetFieldBegin(fieldEnd.fieldBegin, selection, 0, type, isInField, isStarted, endSelection, endPosition);
        } else if (type === 0 && !isNullOrUndefined(fieldEnd.previousNode)) {
            const inline: ElementBox = fieldEnd.previousNode;

            this.getPreviousWordOffset(inline, selection, inline.length, type, (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 1), isStarted, endSelection, endPosition);
        } else if (!isNullOrUndefined(fieldEnd.fieldBegin) && type !== 0) {
            let inline: ElementBox = fieldEnd.previousNode;

            if (isNullOrUndefined(inline) || (inline.line.paragraph === fieldEnd.fieldBegin.line.paragraph && !selection.hasValidInline(inline.line.paragraph, inline, fieldEnd.fieldBegin))) {
                inline = fieldEnd.fieldBegin;
            }

            this.getPreviousWordOffset(inline, selection, inline.length, type, !(endPosition.paragraph === fieldEnd.line.paragraph && endPosition.offset === endOffset), isStarted, endSelection, endPosition);
            if (endSelection && endPosition.paragraph === fieldEnd.line.paragraph
                && endPosition.offset === startOffset) {
                endPosition.setPositionParagraph(fieldEnd.line, endOffset);
                return;
            }
            if (!endSelection) {

                endPosition.setPositionParagraph(fieldEnd.fieldBegin.line, fieldEnd.fieldBegin.line.getOffset(fieldEnd.fieldBegin, 0));
            }
        }
    }

    private getPreviousWordOffsetFieldSeparator(fieldSeparator: FieldElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        this.getPreviousWordOffsetFieldBegin(fieldSeparator.fieldBegin, selection, fieldSeparator.fieldBegin.length, type, isInField, isStarted, endSelection, endPosition);
    }
    /* get previous word offset from comment
    * @private
    */

    private getPreviousWordOffsetComment(comment: ElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        if (comment.previousNode) {
            const inline: TextElementBox = comment.previousNode as TextElementBox;
            if (comment.previousNode instanceof TextElementBox
                && HelperMethods.lastIndexOfAny(inline.text, HelperMethods.wordSplitCharacters) !== inline.text.length - 1) {
                this.getPreviousWordOffset(inline, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
            } else {

                this.getPreviousWordOffset(comment.previousNode, selection, comment.previousNode.length, type, isInField, isStarted, endSelection, endPosition);
            }
        } else {
            endPosition.setPositionParagraph(comment.line, selection.getStartLineOffset(comment.line));
        }
    }

    private getPreviousWordOffsetFieldBegin(fieldBegin: FieldElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        const startOffset: number = fieldBegin.line.getOffset(fieldBegin, 0);
        const endOffset: number = startOffset + fieldBegin.length;
        if (endPosition.offset === endOffset) {
            endPosition.setPositionParagraph(fieldBegin.line, startOffset);
        }
        if (!isNullOrUndefined(fieldBegin.previousNode)) {

            this.getPreviousWordOffset(fieldBegin.previousNode, selection, (fieldBegin.previousNode as ElementBox).length, type, false, isStarted, endSelection, endPosition);
            if (endPosition.offset === startOffset) {
                if (type !== 0 && !isNullOrUndefined(fieldBegin.fieldSeparator)) {

                    endPosition.setPositionParagraph(fieldBegin.line, fieldBegin.fieldSeparator.line.getOffset(fieldBegin.fieldSeparator, fieldBegin.fieldSeparator.length));
                }
            }
        } else {
            if (fieldBegin.fieldSeparator) {

                endPosition.setPositionParagraph(fieldBegin.line, fieldBegin.fieldSeparator.line.getOffset(fieldBegin.fieldSeparator, fieldBegin.fieldSeparator.length));
            } else {
                endPosition.setPositionParagraph(fieldBegin.line, selection.getStartLineOffset(fieldBegin.line));
            }
        }
    }

    private getPreviousWordOffsetImage(image: ImageElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        if (isInField) {
            endPosition.setPositionParagraph(image.line, image.line.getOffset(image, indexInInline));
            endSelection = false;
            return;
        }
        if (indexInInline === image.length) {
            const endOffset: number = image.line.getOffset(image, image.length);
            if (endOffset === endPosition.offset) {
                endPosition.setPositionParagraph(image.line, endOffset - image.length);
            } else {
                endPosition.setPositionParagraph(image.line, endOffset);
            }
        } else if (!isNullOrUndefined(image.previousNode)) {

            this.getPreviousWordOffset(image.previousNode, selection, (image.previousNode as ElementBox).length, type, isInField, isStarted, endSelection, endPosition);
        }
    }

    private getPreviousWordOffsetSpan(span: TextElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        if (span.text === '\t' || span.text === '\v') {
            if (isInField) {
                endSelection = false;
                return;
            }
            if (indexInInline === span.length) {
                endSelection = true;
                const endOffset: number = span.line.getOffset(span, span.length);
                if (endOffset === endPosition.offset) {
                    endPosition.setPositionParagraph(span.line, endOffset - span.length);
                } else {
                    endPosition.setPositionParagraph(span.line, endOffset);
                }
            } else if (!isNullOrUndefined(span.previousNode)) {

                this.getPreviousWordOffset(span.previousNode, selection, (span.previousNode as TextElementBox).length, type, isInField, isStarted, endSelection, endPosition);
            }
        } else {
            let wordStartIndex: number = 0;
            if (!isStarted) {
                while (indexInInline > 0 && span.text[indexInInline - 1] === ' ') {
                    indexInInline--;
                }
                endPosition.setPositionParagraph(span.line, span.line.getOffset(span, indexInInline));
            }
            if (indexInInline > 0) {
                isStarted = true;
                if (indexInInline === 0 && endSelection && (HelperMethods.wordSplitCharacters.indexOf(span.text[0])) === -1) {
                    endPosition.setPositionParagraph(span.line, span.line.getOffset(span, indexInInline));
                    endSelection = true;
                    return;
                }

                const txt: string = span.text.length > indexInInline ? span.text.slice(0, indexInInline) : span.text;
                wordStartIndex = HelperMethods.lastIndexOfAny(txt, HelperMethods.wordSplitCharacters);

                if (wordStartIndex === -1 && span.previousElement instanceof CommentCharacterElementBox && isNullOrUndefined(span.previousNode.previousNode)) {
                    wordStartIndex = span.length;
                }
                if (wordStartIndex !== -1) {
                    if (isInField) {
                        endSelection = false;
                        return;
                    }
                    while (wordStartIndex > 0 && endSelection && txt[wordStartIndex] !== ' '
                        && (HelperMethods.wordSplitCharacters.indexOf(txt[wordStartIndex - 1])) !== -1) {
                        wordStartIndex--;
                    }
                    if (txt[wordStartIndex] === ' ' || txt[wordStartIndex] === '　' || !endSelection) {
                        wordStartIndex++;
                    }
                    endSelection = true;
                    if (wordStartIndex > 0) {
                        const offset: number = span.line.getOffset(span, wordStartIndex);
                        if (span.line.paragraph === endPosition.paragraph && offset === endPosition.offset) {

                            this.getPreviousWordOffsetSpan(span, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
                        } else {
                            endPosition.setPositionParagraph(span.line, offset);
                        }
                    } else if (span.previousNode instanceof TextElementBox) {

                        this.getPreviousWordOffset(span.previousNode, selection, (span.previousNode as TextElementBox).length, type, isInField, isStarted, endSelection, endPosition);
                    } else {
                        endPosition.setPositionParagraph(span.line, span.line.getOffset(span, 0));
                    }
                } else {
                    this.setPreviousWordOffset(span, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
                }
            } else {
                this.setPreviousWordOffset(span, selection, indexInInline, type, isInField, isStarted, endSelection, endPosition);
            }
        }
    }


    private setPreviousWordOffset(span: ElementBox, selection: Selection, indexInInline: number, type: number, isInField: boolean, isStarted: boolean, endSelection: boolean, endPosition: TextPosition): void {
        if (span.previousNode instanceof ElementBox && span.line === span.previousNode.line) {

            this.getPreviousWordOffset(span.previousNode, selection, (span.previousNode as ElementBox).length, type, isInField, isStarted, endSelection, endPosition);
        } else {
            endPosition.setPositionParagraph(span.line, selection.getStartLineOffset(span.line));
        }
    }
    /**
     * Validate if text position is in field forward
     *
     * @private
     */
    public validateForwardFieldSelection(currentIndex: string, selectionEndIndex: string): void {
        const textPosition: TextPosition = new TextPosition(this.owner);
        textPosition.setPositionForCurrentIndex(currentIndex);
        textPosition.isUpdateLocation = false;
        let isPositionMoved: boolean = false;
        if (this.selection.start.paragraph !== this.selection.end.paragraph
            || this.selection.start.offset === this.selection.getStartOffset(this.selection.start.paragraph)) {
            // To select Paragraph mark similar to MS WORD
            if (this.selection.end.offset === this.selection.end.currentWidget.getEndOffset()
                && this.selection.isParagraphLastLine(this.selection.end.currentWidget)) {
                this.selection.end.setPositionParagraph(this.selection.end.currentWidget, this.selection.end.offset + 1);
            }
        }
        while (currentIndex !== selectionEndIndex && TextPosition.isForwardSelection(currentIndex, selectionEndIndex)) {
            if (!isPositionMoved) {
                textPosition.moveNextPosition(false);
                const nextIndex: string = textPosition.getHierarchicalIndexInternal();
                //Handled specifically to break infinite looping, if selection ends at last paragraph mark.
                if (currentIndex === nextIndex) {
                    break;
                }
            }
            let indexInInline: number = 0;
            const inlineObj: ElementInfo = textPosition.currentWidget.getInline(textPosition.offset, indexInInline) as ElementInfo;
            let inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            if (!isNullOrUndefined(inline)) {
                const selectionStartIndex: string = this.selection.start.getHierarchicalIndexInternal();
                if (indexInInline === inline.length && inline instanceof FieldElementBox && inline.fieldType === 1) {
                    if (inline.line.getOffset(inline, 0) === this.offset) {
                        return;
                    }
                    const lineWidget: LineWidget = inline.fieldBegin.line as LineWidget;
                    const fieldBeginOffset: number = lineWidget.getOffset(inline.fieldBegin, 0);
                    const fieldBeginIndex: string = this.getHierarchicalIndex(lineWidget, fieldBeginOffset.toString());
                    if (!TextPosition.isForwardSelection(selectionStartIndex, fieldBeginIndex)) {
                        this.selection.start.setPositionParagraph(lineWidget, fieldBeginOffset);
                    }
                }
                const nextInline: ElementBox = this.selection.getNextRenderedElementBox(inline, indexInInline) as ElementBox;
                if (!isNullOrUndefined(nextInline) && nextInline instanceof ElementBox) {
                    inline = nextInline;
                }
            }
            isPositionMoved = (inline instanceof FieldElementBox && inline.fieldType === 0 && !isNullOrUndefined(inline.fieldEnd));
            if (isPositionMoved) {
                if (inline.line.getOffset(inline, 0) === this.offset) {
                    return;
                }
                const fieldEnd: FieldElementBox = (inline as FieldElementBox).fieldEnd;
                const paragraph: ParagraphWidget = fieldEnd.line.paragraph as ParagraphWidget;
                const fieldEndOffset: number = fieldEnd.line.getOffset(fieldEnd, 1);
                const fieldEndIndex: string = this.getHierarchicalIndex(fieldEnd.line, fieldEndOffset.toString());
                if (!TextPosition.isForwardSelection(fieldEndIndex, selectionEndIndex)) {
                    //If selection end is after field begin, extend selection end to field end.
                    this.moveToInline((inline as FieldElementBox).fieldEnd, 1);
                    return;
                }
                textPosition.moveToInline((inline as FieldElementBox).fieldEnd, 1);
            }
            currentIndex = textPosition.getHierarchicalIndexInternal();
        }
    }
    /**
     * Validate if text position is in field backward
     *
     * @private
     */
    public validateBackwardFieldSelection(currentIndex: string, selectionEndIndex: string): void {
        const textPosition: TextPosition = new TextPosition(this.owner);
        textPosition.setPositionForCurrentIndex(currentIndex);
        textPosition.isUpdateLocation = false;
        let isSelectParaMark: boolean = false;
        if ((this.selection.start.paragraph !== this.selection.end.paragraph
            && this.selection.end.offset !== this.selection.getStartOffset(this.selection.start.paragraph)) ||
            (this.documentHelper.isSelectionChangedOnMouseMoved && this.selection.isParagraphFirstLine(this.selection.end.currentWidget)
                && this.selection.end.offset === this.selection.getStartOffset(this.selection.start.paragraph))) {
            isSelectParaMark = true;
        }
        // To select Paragraph mark similar to MS WORD
        if (isSelectParaMark && this.selection.start.offset === this.selection.start.currentWidget.getEndOffset()
            && this.selection.isParagraphLastLine(this.selection.start.currentWidget)) {
            this.selection.start.setPositionParagraph(this.selection.start.currentWidget, this.selection.start.offset + 1);
        }

        let selectionStartIndex: string = this.selection.start.getHierarchicalIndexInternal();
        while (currentIndex !== selectionEndIndex && TextPosition.isForwardSelection(selectionEndIndex, currentIndex)) {
            let indexInInline: number = 0;
            const inlineObj: ElementInfo = textPosition.currentWidget.getInline(textPosition.offset, indexInInline) as ElementInfo;
            const inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            if (!isNullOrUndefined(inline)) {
                const nextInline: ElementBox = this.selection.getNextRenderedElementBox(inline, indexInInline) as ElementBox;
                if (nextInline instanceof FieldElementBox && nextInline.fieldType === 0) {
                    const paragraph: LineWidget = (nextInline as FieldElementBox).fieldEnd.line as LineWidget;
                    const fieldEndOffset: number = paragraph.getOffset((nextInline as FieldElementBox).fieldEnd, 1);
                    const fieldEndIndex: string = this.getHierarchicalIndex(paragraph, fieldEndOffset.toString());
                    if (!TextPosition.isForwardSelection(fieldEndIndex, selectionStartIndex)) {
                        this.selection.start.setPositionParagraph(paragraph, fieldEndOffset);
                        selectionStartIndex = fieldEndIndex;
                    }
                }
            }
            if (inline instanceof FieldElementBox && inline.fieldType === 1 && !isNullOrUndefined((inline as FieldElementBox).fieldBegin)) {
                const line: LineWidget = (inline as FieldElementBox).fieldBegin.line as LineWidget;
                const fieldBegin: FieldElementBox = (inline as FieldElementBox).fieldBegin;
                const fieldBeginOffset: number = line.getOffset(fieldBegin, 0);
                const fieldBeginIndex: string = this.getHierarchicalIndex(line, fieldBeginOffset.toString());
                if (!TextPosition.isForwardSelection(selectionEndIndex, fieldBeginIndex)) {
                    //If field begin is before selection end, extend selection end to field begin.
                    this.moveToInline((inline as FieldElementBox).fieldBegin, 0);
                    return;
                }
                textPosition.moveToInline((inline as FieldElementBox).fieldBegin, 0);
            } else {
                textPosition.movePreviousPosition();
            }
            currentIndex = textPosition.getHierarchicalIndexInternal();
        }
    }
    /**
     * @private
     */
    public paragraphStartInternal(selection: Selection, moveToPreviousParagraph: boolean): void {
        const offset: number = selection.getStartLineOffset(this.currentWidget);
        if (this.offset === offset && moveToPreviousParagraph) {
            const startParagraph: boolean = this.moveToNextParagraphInTableCheck();
            if (startParagraph) {
                this.moveToPreviousParagraphInTable(selection);
            } else if (!isNullOrUndefined(selection.getPreviousParagraphBlock(this.currentWidget.paragraph))) {
                const paragraphValue: ParagraphWidget = selection.getPreviousParagraphBlock(this.currentWidget.paragraph);
                this.currentWidget = paragraphValue.childWidgets[0] as LineWidget;
                this.offset = selection.getStartLineOffset(this.currentWidget);
            }
        } else {
            this.currentWidget = this.currentWidget.paragraph.getSplitWidgets()[0].childWidgets[0] as LineWidget;
            this.offset = offset;
        }
        this.calculateOffset();
    }
    /**
     * @private
     */
    public calculateOffset(): void {
        const selectionStartIndex: string = this.owner.selection.start.getHierarchicalIndexInternal();
        const selectionEndIndex: string = this.getHierarchicalIndexInternal();
        if (selectionStartIndex !== selectionEndIndex) {
            this.validateBackwardFieldSelection(selectionStartIndex, selectionEndIndex);
        }
        this.updatePhysicalPosition(true);
    }
    /**
     * Moves the text position to start of the paragraph.
     *
     * @private
     */
    public moveToParagraphStartInternal(selection: Selection, moveToPreviousParagraph: boolean): void {
        let splittedParagraph: ParagraphWidget = this.currentWidget.paragraph;
        while (splittedParagraph.previousSplitWidget) {
            splittedParagraph = splittedParagraph.previousSplitWidget as ParagraphWidget;
        }
        const startOffset: number = selection.getStartOffset(splittedParagraph);
        if (this.offset === startOffset && moveToPreviousParagraph) {
            const paragraphstart: boolean = this.moveToNextParagraphInTableCheck();
            if (paragraphstart) {
                this.moveToPreviousParagraphInTable(selection);
            } else if (!isNullOrUndefined(selection.getPreviousParagraphBlock(this.paragraph))) {
                this.currentWidget = selection.getPreviousParagraphBlock(this.paragraph).firstChild as LineWidget;
                this.offset = selection.getStartOffset(this.paragraph);
            }
        } else {
            this.currentWidget = splittedParagraph.firstChild as LineWidget;
            this.offset = selection.getStartLineOffset(this.currentWidget);
        }
        const selectionStartIndex: string = this.owner.selection.start.getHierarchicalIndexInternal();
        const selectionEndIndex: string = this.getHierarchicalIndexInternal();
        if (selectionStartIndex !== selectionEndIndex) {
            this.validateBackwardFieldSelection(selectionStartIndex, selectionEndIndex);
        }
        this.updatePhysicalPosition(false);
    }
    /**
     * Moves the text position to end of the paragraph.
     *
     * @private
     */
    public moveToParagraphEndInternal(selection: Selection, moveToNextParagraph: boolean): void {

        let splittedParagraph: ParagraphWidget = this.currentWidget.paragraph;
        while (splittedParagraph.nextSplitWidget) {
            splittedParagraph = splittedParagraph.nextSplitWidget as ParagraphWidget;
        }
        this.currentWidget = splittedParagraph.childWidgets[splittedParagraph.childWidgets.length - 1] as LineWidget;
        const endOffset: number = this.currentWidget.getEndOffset() + 1;
        if (this.offset === endOffset && moveToNextParagraph) {
            const paragraphEnd: boolean = this.moveToNextParagraphInTableCheck();
            if (paragraphEnd) {
                this.moveToNextParagraphInTable();
            } else if (!isNullOrUndefined(selection.getNextParagraphBlock(this.currentWidget.paragraph))) {
                const endParagraph: ParagraphWidget = selection.getNextParagraphBlock(this.currentWidget.paragraph);
                this.currentWidget = endParagraph.childWidgets[endParagraph.childWidgets.length - 1] as LineWidget;
                this.offset = this.currentWidget.getEndOffset() + 1;
            }
        } else {
            this.offset = endOffset;
        }
        this.calculateOffset();
    }
    /**
     * @private
     */
    public moveUp(selection: Selection, left: number): void {
        const paragraph: ParagraphWidget = this.currentWidget.paragraph;
        //Moves text position to start of line.
        this.moveToLineStartInternal(selection, true);
        //Moves previous line starting.
        this.movePreviousPosition();
        let prevLine: LineWidget = undefined;
        const currentParagraph: ParagraphWidget = this.currentWidget.paragraph;
        if (paragraph.isInsideTable && paragraph !== currentParagraph && paragraph.associatedCell !== currentParagraph.associatedCell

            && (!isNullOrUndefined(currentParagraph.associatedCell) && (paragraph.associatedCell.ownerRow === currentParagraph.associatedCell.ownerRow))) {
            const ownerRow: TableRowWidget = currentParagraph.associatedCell.ownerRow;
            if (ownerRow.previousRenderedWidget instanceof TableRowWidget) {

                const cell: TableCellWidget = selection.getFirstCellInRegion(ownerRow.previousRenderedWidget as TableRowWidget, currentParagraph.associatedCell, left, true);
                const lastParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, false);
            } else {
                let prevBlock: BlockWidget = ownerRow.ownerTable.previousRenderedWidget as BlockWidget;
                do {
                    if (prevBlock instanceof TableWidget) {
                        prevBlock = selection.getLastBlockInLastCell((prevBlock as TableWidget));
                    }
                } while (prevBlock instanceof TableWidget);
                if (prevBlock instanceof ParagraphWidget) {
                    this.setPosition((prevBlock as ParagraphWidget).childWidgets[prevBlock.childWidgets.length - 1] as LineWidget, false);
                }
            }
            prevLine = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        } else {
            if (!paragraph.isInsideTable && this.currentWidget.paragraph.isInsideTable) {

                const cell: TableCellWidget = selection.getFirstCellInRegion(this.currentWidget.paragraph.associatedCell.ownerRow, this.currentWidget.paragraph.associatedCell, this.owner.selection.upDownSelectionLength, true);
                const lastParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, false);

            } else if (paragraph.isInsideTable && (!isNullOrUndefined(this.currentWidget.paragraph.associatedCell) && paragraph.associatedCell.ownerRow.previousRenderedWidget !== paragraph.associatedCell.ownerRow.previousSplitWidget &&
                paragraph.associatedCell.ownerRow.previousRenderedWidget === this.currentWidget.paragraph.associatedCell.ownerRow)) {

                const cell: TableCellWidget = selection.getLastCellInRegion(this.currentWidget.paragraph.associatedCell.ownerRow, this.currentWidget.paragraph.associatedCell, this.owner.selection.upDownSelectionLength, true);
                const lastParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, false);
            }
            prevLine = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        }
        //Moves till the Up/Down selection width.
        const top: number = selection.getTop(prevLine);
        // Here, updating the left position when line widget end with page break
        // to update cursor before page break
        if (this.currentWidget.isEndsWithPageBreak && this.offset === this.currentWidget.getEndOffset() - 1) {
            left = this.location.x;
        }
        selection.updateTextPositionWidget(prevLine, new Point(left, top), this, false);
    }
    /**
     * @private
     */
    public moveDown(selection: Selection, left: number): void {
        //Moves text position to end of line.
        const prevParagraph: ParagraphWidget = this.currentWidget.paragraph;
        const currentLine: LineWidget = this.currentWidget;
        this.moveToLineEndInternal(selection, true);
        const length: number = this.selection.getParagraphLength(this.currentWidget.paragraph);
        if (this.offset > length) {
            this.offset = length;
        }
        //Moves next line starting.
        this.moveNextPosition();
        let nextLine: LineWidget = undefined;

        if (prevParagraph.isInsideTable && prevParagraph !== this.currentWidget.paragraph && prevParagraph.associatedCell !== this.currentWidget.paragraph.associatedCell && (!isNullOrUndefined(this.currentWidget.paragraph.associatedCell) && prevParagraph.associatedCell.ownerRow === this.currentWidget.paragraph.associatedCell.ownerRow)) {
            let ownerRow: TableRowWidget = this.currentWidget.paragraph.associatedCell.ownerRow;

            if (prevParagraph.isInsideTable && this.currentWidget.paragraph.isInsideTable && prevParagraph.associatedCell.cellFormat.rowSpan > 1 && prevParagraph.associatedCell.cellFormat.rowSpan + prevParagraph.associatedCell.ownerRow.rowIndex === prevParagraph.associatedCell.ownerTable.childWidgets.length) {
                //If the prevParagraph  owner cell is Verically merged upto the last row, then theposition moved to next column. the position moved to out of the current tabel so owner row is assigned to last row.

                ownerRow = this.currentWidget.paragraph.associatedCell.ownerTable.childWidgets[this.currentWidget.paragraph.associatedCell.ownerTable.childWidgets.length - 1] as TableRowWidget;
            }
            if (ownerRow.nextRenderedWidget instanceof TableRowWidget) {

                const cell: TableCellWidget = this.selection.getLastCellInRegion(ownerRow.nextRenderedWidget as TableRowWidget, this.currentWidget.paragraph.associatedCell, left, false);
                this.setPosition(this.selection.getFirstParagraph(cell).childWidgets[0] as LineWidget, true);
            } else {
                let nextBlock: BlockWidget = this.selection.getNextRenderedBlock(ownerRow.ownerTable);
                do {
                    if (nextBlock instanceof TableWidget) {
                        nextBlock = this.selection.getFirstBlockInFirstCell(nextBlock as TableWidget);
                    }
                } while (nextBlock instanceof TableWidget);
                if (nextBlock instanceof ParagraphWidget) {
                    this.setPosition((nextBlock as ParagraphWidget).childWidgets[0] as LineWidget, true);
                }
            }
            nextLine = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        } else {
            if (!prevParagraph.isInsideTable && this.currentWidget.paragraph.isInsideTable) {

                const cell: TableCellWidget = this.selection.getLastCellInRegion(this.currentWidget.paragraph.associatedCell.ownerRow, this.currentWidget.paragraph.associatedCell, this.owner.selection.upDownSelectionLength, false);
                this.setPosition(this.selection.getFirstParagraph(cell).childWidgets[0] as LineWidget, true);

            } else if (prevParagraph.isInsideTable && (!isNullOrUndefined(this.currentWidget.paragraph.associatedCell) && prevParagraph.associatedCell.ownerRow.nextRenderedWidget !== prevParagraph.associatedCell.ownerRow.nextSplitWidget
                && prevParagraph.associatedCell.ownerRow.nextRenderedWidget === this.currentWidget.paragraph.associatedCell.ownerRow)) {

                const cell: TableCellWidget = selection.getLastCellInRegion(this.currentWidget.paragraph.associatedCell.ownerRow, this.currentWidget.paragraph.associatedCell, this.owner.selection.upDownSelectionLength, true);
                this.setPosition(selection.getFirstParagraph(cell).childWidgets[0] as LineWidget, false);
            }
            nextLine = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        }
        //Moves till the Up/Down selection width.
        const top: number = this.selection.getTop(nextLine);
        if (nextLine !== currentLine) {
            this.selection.updateTextPositionWidget(nextLine, new Point(left, top), this, false);
        }
    }
    /**
     * Moves the text position to start of the line.
     *
     * @private
     */
    public moveToLineStartInternal(selection: Selection, moveToPreviousLine: boolean): void {
        if (this.location.x > this.viewer.clientActiveArea.right) {
            this.offset = this.offset - 1;
        }
        const currentLine: LineWidget = selection.getLineWidgetInternal(this.currentWidget, this.offset, moveToPreviousLine);
        let firstElement: ElementBox;
        const isParaBidi: boolean = this.currentWidget.paragraph.paragraphFormat.bidi;
        if (isParaBidi && currentLine.children.length > 0 && this.containsRtlText(currentLine)) {
            firstElement = currentLine.children[currentLine.children.length - 1];
            if (firstElement instanceof ListTextElementBox) {
                firstElement = undefined;
            }
        } else {
            firstElement = selection.getFirstElementInternal(currentLine);
        }
        this.documentHelper.moveCaretPosition = 1;
        const startOffset: number = selection.getStartOffset(this.currentWidget.paragraph);
        if (isNullOrUndefined(firstElement) && this.offset > startOffset) {
            let index: number = 0;
            const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, index);
            const inline: ElementBox = inlineObj.element;
            index = inlineObj.index;
            if (inline instanceof TextElementBox && (inline as TextElementBox).text !== '\v') {
                this.offset = startOffset;
            }
        } else if (!isNullOrUndefined(firstElement)) {
            let indexInInline: number = 0;
            this.currentWidget = firstElement.line;
            this.offset = this.currentWidget.getOffset(firstElement, indexInInline);

            indexInInline = 0;
            const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline);
            let inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            if (inline instanceof FieldElementBox) {
                //Checks if field character is part of rendered field, otherwise moves to previous rendered content.
                const prevInline: ElementBox = selection.getPreviousValidElement(inline);
                if (!isNullOrUndefined(prevInline)) {
                    inline = prevInline;
                    this.currentWidget = inline.line;
                    this.offset = this.currentWidget.getOffset(inline, inline.length);
                    if (inline instanceof FieldElementBox) {
                        this.offset--;
                    }
                }
            }
        }
        this.updatePhysicalPosition(true);
    }
    /**
     * Check paragraph is inside table
     *
     * @private
     */
    public moveToNextParagraphInTableCheck(): boolean {
        if ((this.selection.start.paragraph.isInsideTable || this.paragraph.isInsideTable)
            && (this.selection.start.paragraph.associatedCell !== this.paragraph.associatedCell
                || this.selection.isCellSelected(this.selection.start.paragraph.associatedCell, this.selection.start, this))) {
            return true;
        }
        return false;
    }
    /**
     * Moves the text position to end of the word.
     *
     * @private
     */
    public moveToWordEndInternal(type: number, excludeSpace: boolean): void {
        // type === 0 -------->CTRL+ARROW Navigation
        // type === 1 -------->CTRL+SHIFT+ARROW Selection
        // type === 2 -------->Double-tap Word Selection
        let incrementValue: number = 0;
        const endOffset: number = this.currentWidget.getEndOffset();
        if (this.selection.isParagraphFirstLine(this.currentWidget)) {
            if (this.currentWidget.children[0] instanceof ListTextElementBox) {
                incrementValue = 1;
            }
            if (this.currentWidget.children[1] instanceof ListTextElementBox) {
                incrementValue = 2;
            }
        }
        if (this.offset + incrementValue === endOffset || this.offset === endOffset + 1) {
            if (this.offset === endOffset && type !== 0) {
                this.setPositionParagraph(this.currentWidget, endOffset + 1);
            } else {
                const nextParagraph: ParagraphWidget = this.selection.getNextParagraphBlock(this.currentWidget.paragraph);
                if (isNullOrUndefined(nextParagraph)) {
                    return;
                }
                this.currentWidget = nextParagraph.childWidgets[0] as LineWidget;
                this.offset = this.selection.getStartLineOffset(this.currentWidget);
                if (type === 1) {

                    const nextWord: boolean = this.moveToNextParagraphInTableCheck();
                    if (nextWord) {
                        this.moveToNextParagraphInTable();
                    } else {
                        this.moveToWordEndInternal(type, excludeSpace);
                    }
                }
            }
        } else {
            let indexInInline: number = 0;
            const endSelection: boolean = false;
            const inlineObj: ElementInfo = this.currentWidget.getInline(this.offset, indexInInline) as ElementInfo;
            const inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            this.getNextWordOffset(inline, indexInInline, type, false, endSelection, this, excludeSpace);
        }
        if (type !== 0) {
            const selectionStartIndex: string = this.owner.selection.start.getHierarchicalIndexInternal();
            const selectionEndIndex: string = this.getHierarchicalIndexInternal();
            if (selectionStartIndex !== selectionEndIndex) {
                this.validateForwardFieldSelection(selectionStartIndex, selectionEndIndex);
            }
        }
        this.updatePhysicalPosition(true);
    }
    /**
     * move text position to next paragraph inside table
     *
     * @private
     */
    public moveToNextParagraphInTable(): void {

        const paragraph: ParagraphWidget = this.currentWidget.paragraph;
        const nextParagraph: ParagraphWidget = (paragraph.isInsideTable) ? this.selection.getNextSelectionCell(paragraph.associatedCell) :
            this.selection.getNextParagraphBlock(paragraph);
        if (isNullOrUndefined(nextParagraph)) {
            return;
        }
        this.currentWidget = nextParagraph.childWidgets[nextParagraph.childWidgets.length - 1] as LineWidget;
        this.offset = this.currentWidget.getEndOffset() + 1;
    }
    /**
     * Moves the text position to start of the previous paragraph.
     *
     */
    public moveToPreviousParagraph(selection: Selection): void {
        const startOffset: number = selection.getStartOffset(this.currentWidget.paragraph);

        if (this.offset === startOffset && !isNullOrUndefined(selection.getPreviousParagraphBlock(this.currentWidget.paragraph))) {
            const previousParagraph: ParagraphWidget = selection.getPreviousParagraphBlock(this.currentWidget.paragraph);
            this.currentWidget = previousParagraph.childWidgets[0] as LineWidget;
            this.offset = selection.getStartOffset(this.currentWidget.paragraph);
        } else {
            this.offset = selection.getStartOffset(this.currentWidget.paragraph);
        }
        this.updatePhysicalPosition(true);
    }
    /**
     * Move to previous line from current position
     *
     * @private
     */
    public moveToPreviousLine(selection: Selection, left: number): void {
        const currentIndex: string = this.getHierarchicalIndexInternal();
        const currentLine: LineWidget = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        //Moves text position to start of line.
        this.moveToLineStartInternal(selection, true);
        if (this.currentWidget.paragraph.isInsideTable) {
            this.moveUpInTable(selection);
        } else {
            this.moveBackward();
        }
        const prevLine: LineWidget = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        const lineStart: number = selection.getLeft(prevLine);
        const lineWidth: number = selection.getWidth(prevLine, true);
        //Moves till the Up/Down selection width.
        if (lineWidth + lineStart >= left && currentLine !== prevLine) {
            const top: number = selection.getTop(prevLine);
            const point: Point = new Point(left, top);
            selection.updateTextPositionWidget(prevLine, point, this, true);
        }

        //Checks if the current position is between field result, then move to field begin.
        const selectionEndIndex: string = this.getHierarchicalIndexInternal();
        this.validateBackwardFieldSelection(currentIndex, selectionEndIndex);
    }
    /**
     * @param {Selection} selection Specifies the selection
     * @param {boolean} moveToNextLine Specifies the move to next line
     * @private
     */
    public moveToLineEndInternal(selection: Selection, moveToNextLine: boolean): void {
        if (this.location.x > this.viewer.clientActiveArea.right) {
            this.offset = this.offset - 1;
        }
        const currentLine: LineWidget = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        const firstElement: ElementBox = selection.getFirstElementInternal(currentLine);
        const isParaBidi: boolean = this.currentWidget.paragraph.paragraphFormat.bidi;
        this.documentHelper.moveCaretPosition = 2;
        if (isNullOrUndefined(firstElement) && this.offset === selection.getStartLineOffset(this.currentWidget)) {
            this.offset = selection.getParagraphLength(this.paragraph) + 1;
            this.updatePhysicalPosition(true);
        } else if (!isNullOrUndefined(firstElement)) {
            let lastElement: ElementBox;
            // As per Microsoft Behavior, when current para is RTL and if line widget contains rtl text or mixed inlines(rtl, normal),
            // then need to consider the last element and to update offset to last element
            if (isParaBidi && this.containsRtlText(currentLine)) {
                const endOffset: number = currentLine.getEndOffset();
                lastElement = currentLine.getInline(endOffset, 0).element;
            } else {
                lastElement = currentLine.children[currentLine.children.length - 1];
                if (lastElement instanceof ListTextElementBox && currentLine.children.length > 2) {
                    lastElement = currentLine.children[currentLine.children.length - 3];
                }
            }
            let index: number = 0;
            index += lastElement instanceof TextElementBox ? (lastElement as TextElementBox).length : 1;
            this.currentWidget = lastElement.line;
            if (index === lastElement.length
                && isNullOrUndefined(lastElement.nextNode) && selection.isParagraphLastLine(this.currentWidget)) {
                const length: number = selection.getLineLength(this.currentWidget);
                this.offset = moveToNextLine ? length + 1 : length;
            } else {
                let inline: ElementBox = lastElement;
                while (!isNullOrUndefined(inline) && inline.length === index && inline.nextNode instanceof FieldElementBox) {
                    const nextInline: ElementBox = selection.getNextValidElement(inline.nextNode as FieldElementBox);
                    if (inline !== nextInline) {
                        inline = nextInline;
                        index = 0;
                    }
                    if (inline instanceof FieldElementBox && inline.fieldType === 0
                        && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
                        const fieldBegin: FieldElementBox = inline as FieldElementBox;
                        if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                            inline = fieldBegin.fieldEnd;
                        } else {
                            inline = fieldBegin.fieldSeparator;
                            this.currentWidget = inline.line;
                            if (this.currentWidget === fieldBegin.fieldEnd.line
                                && !selection.hasValidInline(this.currentWidget.paragraph, inline, fieldBegin.fieldEnd)) {
                                inline = fieldBegin.fieldEnd;
                            }
                        }
                        this.currentWidget = inline.line;
                    }
                    if (inline instanceof FieldElementBox) {
                        index = 1;
                    }
                }
                if (index === inline.length && isNullOrUndefined(inline.nextNode)) {
                    index++;
                }
                if (!moveToNextLine && inline instanceof ElementBox && (inline as TextElementBox).text === '\v') {
                    index--;
                }
                this.offset = this.currentWidget.getOffset(inline, index);
            }
            this.updatePhysicalPosition(moveToNextLine);
        }
    }
    /**
     * Move to next line
     *
     * @param {number} left Specified the left
     * @private
     * @returns {void}
     */
    public moveToNextLine(left: number): void {
        const selection: Selection = this.selection;
        const textPosition: TextPosition = new TextPosition(this.owner);
        textPosition.setPositionInternal(this);
        const currentIndex: string = this.getHierarchicalIndexInternal();
        const currentLine: LineWidget = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        const isAtLineStart: boolean = this.offset === 0 ? true : false;
        //Moves text position to end of line.
        this.moveToLineEndInternal(selection, true);
        const isMoveToLineEnd: boolean = !textPosition.isAtSamePosition(this);
        textPosition.setPositionInternal(this);
        if (this.currentWidget.paragraph.isInsideTable) {
            this.moveDownInTable(selection);
        } else {
            this.moveNextPosition();
            this.moveForward();
        }
        const nextLine: LineWidget = selection.getLineWidgetParagraph(this.offset, this.currentWidget);
        const lineStart: number = selection.getLeft(nextLine);
        const firstElement: ElementBox = selection.getFirstElementInternal(nextLine);

        const firstItemWidth: number = isNullOrUndefined(firstElement) ? selection.getWidth(nextLine, true) : selection.getLeftInternal(nextLine, firstElement, 1) - lineStart;
        //Moves till the Up/Down selection width.
        if (lineStart < left && (firstItemWidth / 2 < left - lineStart)) {
            const top: number = selection.getTop(nextLine);
            const point: Point = new Point(left, top);
            selection.updateTextPositionWidget(nextLine, point, this, true);
            const width: number = selection.getWidth(nextLine, true);
            if (width < left - lineStart) {
                this.moveToLineEndInternal(selection, true);
            }
        } else if (isMoveToLineEnd && this.currentWidget.paragraph.isInsideTable
            && this.currentWidget === this.owner.selection.start.currentWidget) {
            this.setPositionInternal(textPosition);
        } else if (!isMoveToLineEnd) {
            this.moveToLineEndInternal(selection, true);
        }
        //Checks if the current position is between field result, then move to field end.
        const selectionEndIndex: string = this.getHierarchicalIndexInternal();
        this.validateForwardFieldSelection(currentIndex, selectionEndIndex);
    }

    private moveUpInTable(selection: Selection): void {
        let isPositionUpdated: boolean = false;
        const end: TextPosition = this.owner.selection.end;
        const isBackwardSelection: boolean = !this.owner.selection.isEmpty;
        isPositionUpdated = end.paragraph.isInsideTable;
        if (isPositionUpdated) {
            let startCell: TableCellWidget = this.currentWidget.paragraph.associatedCell;
            let endCell: TableCellWidget = end.paragraph.associatedCell;
            const containerCell: TableCellWidget = selection.getContainerCellOf(endCell, startCell);
            isPositionUpdated = containerCell.ownerTable.contains(startCell);
            if (isPositionUpdated) {
                endCell = selection.getSelectedCell(endCell, containerCell);
                startCell = selection.getSelectedCell(startCell, containerCell);

                const isInContainerCell: boolean = selection.containsCell(containerCell, this.currentWidget.paragraph.associatedCell);
                let isContainerCellSelected: boolean = selection.isCellSelected(containerCell, this, end);
                if (!isContainerCellSelected) {

                    isContainerCellSelected = this.currentWidget.paragraph === selection.getFirstParagraph(containerCell) && this.isAtParagraphStart;
                }
                if ((isInContainerCell && isContainerCellSelected
                    || !isInContainerCell) && !isNullOrUndefined(startCell.ownerRow.previousRenderedWidget)) {
                    //Moves to cell in previous row.
                    const row: TableRowWidget = startCell.ownerRow.previousRenderedWidget as TableRowWidget;

                    const cell: TableCellWidget = selection.getFirstCellInRegion(row, containerCell, this.owner.selection.upDownSelectionLength, true);
                    const previousParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                    this.setPosition(previousParagraph.childWidgets[0] as LineWidget, true);
                    return;
                } else if (isInContainerCell && isContainerCellSelected
                    && isNullOrUndefined(startCell.ownerRow.previousRenderedWidget) || !isInContainerCell) {
                    if (isBackwardSelection) {
                        //Moves to first cell of row.
                        startCell = startCell.ownerRow.childWidgets[0] as TableCellWidget;
                        const previousParagraph: ParagraphWidget = selection.getFirstParagraph(startCell);
                        this.setPosition(previousParagraph.childWidgets[0] as LineWidget, true);
                    } else {
                        //Moves to last cell of row.
                        startCell = startCell.ownerRow.childWidgets[startCell.ownerRow.childWidgets.length - 1] as TableCellWidget;
                        const previousParagraph: ParagraphWidget = selection.getLastParagraph(startCell);
                        this.setPosition(previousParagraph.childWidgets[0] as LineWidget, false);
                    }
                }
            }
        }
        if (!isPositionUpdated) {
            //Moves to previous row / previous block.
            let cell: TableCellWidget = selection.getContainerCell(this.currentWidget.paragraph.associatedCell);
            if (isBackwardSelection) {
                //Moves to first cell of row.
                cell = cell.ownerRow.childWidgets[0] as TableCellWidget;
                const previousParagraph: ParagraphWidget = selection.getFirstParagraph(cell);
                this.setPosition(previousParagraph.childWidgets[0] as LineWidget, true);
            } else {
                //Moves to end of row.
                cell = cell.ownerRow.childWidgets[cell.ownerRow.childWidgets.length - 1] as TableCellWidget;
                const previousParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                this.setPosition(previousParagraph.childWidgets[0] as LineWidget, false);
            }
        }
        //Moves to previous row / previous block.
        this.moveBackward();
    }

    private moveDownInTable(selection: Selection): void {
        let isPositionUpdated: boolean = false;
        const isForwardSelection: boolean = this.owner.selection.isEmpty || this.owner.selection.isForward;
        isPositionUpdated = this.owner.selection.start.paragraph.isInsideTable;
        if (isPositionUpdated) {
            let startCell: TableCellWidget = this.owner.selection.start.paragraph.associatedCell;
            let endCell: TableCellWidget = this.currentWidget.paragraph.associatedCell;
            const containerCell: TableCellWidget = selection.getContainerCellOf(startCell, endCell);
            isPositionUpdated = containerCell.ownerTable.contains(endCell);
            if (isPositionUpdated) {
                startCell = selection.getSelectedCell(startCell, containerCell);
                endCell = selection.getSelectedCell(endCell, containerCell);

                const isInContainerCell: boolean = selection.containsCell(containerCell, this.currentWidget.paragraph.associatedCell);
                const isContainerCellSelected: boolean = selection.isCellSelected(containerCell, this.owner.selection.start, this);
                if ((isInContainerCell && isContainerCellSelected
                    || !isInContainerCell) && !isNullOrUndefined(endCell.ownerRow.nextRenderedWidget)) {
                    //Moves to cell in next row.
                    const row: TableRowWidget = endCell.ownerRow.nextRenderedWidget as TableRowWidget;

                    const cell: TableCellWidget = selection.getLastCellInRegion(row, containerCell, this.owner.selection.upDownSelectionLength, false);
                    const lastParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                    this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, false);
                    return;
                } else if (isInContainerCell && isContainerCellSelected
                    && isNullOrUndefined(endCell.ownerRow.nextRenderedWidget) || !isInContainerCell) {
                    if (isForwardSelection) {
                        //Moves to last cell of row.
                        endCell = endCell.ownerRow.childWidgets[endCell.ownerRow.childWidgets.length - 1] as TableCellWidget;
                        const lastParagraph: ParagraphWidget = selection.getLastParagraph(endCell);
                        this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, false);
                    } else {
                        //Moves to first cell of row.
                        endCell = endCell.ownerRow.childWidgets[0] as TableCellWidget;
                        const lastParagraph: ParagraphWidget = selection.getFirstParagraph(endCell);
                        this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, true);
                    }
                }
            }
        }
        if (!isPositionUpdated) {
            //Moves to next row / next block.
            let cell: TableCellWidget = selection.getContainerCell(this.currentWidget.paragraph.associatedCell);
            if (isForwardSelection) {
                //Moves to end of row.
                cell = cell.ownerRow.childWidgets[cell.ownerRow.childWidgets.length - 1] as TableCellWidget;
                const lastParagraph: ParagraphWidget = selection.getLastParagraph(cell);
                this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, false);
            } else if (cell.ownerRow.nextRenderedWidget) {
                //Moves to first cell of row.
                cell = cell.ownerRow.nextRenderedWidget.childWidgets[0] as TableCellWidget;
                const lastParagraph: ParagraphWidget = selection.getFirstParagraph(cell);
                this.setPosition(lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget, true);
            }
        }
        //Moves to next row / next block.
        this.moveForward();
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.offset = undefined;
        this.isUpdateLocation = undefined;
        if (!isNullOrUndefined(this.location)) {
            this.location.destroy();
        }
        this.location = undefined;
        this.currentWidget = undefined;
        this.owner = undefined;
        this.documentHelper = undefined;
    }
}
/**
 * @private
 */
export class SelectionWidgetInfo {
    private leftIn: number = 0;
    private widthIn: number = 0;
    public color: string = '';

    public floatingItems: ShapeBase[];
    /**
     * @private
     */
    public get left(): number {
        return this.leftIn;
    }
    /**
     * @private
     */
    public set left(value: number) {
        this.leftIn = value;
    }
    /**
     * @private
     */
    public get width(): number {
        return this.widthIn;
    }
    /**
     * @private
     */
    public set width(value: number) {
        this.widthIn = value;
    }

    public constructor(left: number, width: number) {
        this.leftIn = left;
        this.widthIn = width;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.widthIn = undefined;
        this.leftIn = undefined;
        this.floatingItems = [];
        this.floatingItems = undefined;
    }
}
/**
 * @private
 */
export class Hyperlink {
    private linkInternal: string = '';
    private localRef: string = '';
    private typeInternal: HyperlinkType;
    private opensNewWindow: boolean = false;
    private isCrossRefField: boolean = false;
    /**
     * Gets navigation link.
     *
     * @returns string
     * @private
     */
    public get navigationLink(): string {
        return this.linkInternal;
    }
    /**
     * Gets the local reference if any.
     *
     * @returns string
     * @private
     */
    public get localReference(): string {
        return this.localRef;
    }
    /**
     * Gets hyper link type.
     *
     * @returns HyperLinkType
     * @private
     */
    public get linkType(): HyperlinkType {
        return this.typeInternal;
    }
    /**
     * @private
     */
    public get isCrossRef(): boolean {
        return this.isCrossRefField;
    }
    constructor(fieldBeginAdv: FieldElementBox, selection: Selection) {
        const fieldCode: string = selection.getFieldCode(fieldBeginAdv);
        const lowercase: string = fieldCode.toLowerCase();
        if (lowercase.substring(0, 9) === 'hyperlink') {
            this.parseFieldValues(fieldCode.substring(9).trim(), true);
        } else if ((lowercase.indexOf('ref ') === 0 && lowercase.match('\\h'))) {
            this.parseFieldValues(fieldCode.substring(4).trim(), false);
            this.isCrossRefField = true;
        }
    }
    private parseFieldValues(value: string, isHyperlink: boolean): void {
        const codes: string[] = value.split(' ');
        let isLocalRef: boolean = false;
        if (isHyperlink) {
            for (let i: number = 0; i < codes.length; i++) {
                let code: string = codes[i];
                if (code.length < 1) {
                    continue;
                }
                if (code === '\\t' || code === '\\l') {
                    isLocalRef = true;
                } else if (code === '\\n') {
                    this.opensNewWindow = true;
                } else {
                    code = this.parseFieldValue(code, code[0] === '\"' ? '\"' : undefined, isHyperlink);
                    if (isLocalRef) {
                        this.localRef = code;
                        isLocalRef = false;
                    } else {
                        this.linkInternal = code;
                    }
                }
            }
        } else {
            this.localRef = codes[0];
        }
        this.setLinkType();
    }
    private parseFieldValue(value: string, endChar: string, isHyperlink?: boolean): string {
        value = isHyperlink ? value.substring(1) : value.substring(0);
        let endIndex: number = endChar ? value.indexOf(endChar) : -1;
        if (endIndex < 0) {
            endIndex = value.length;
        }
        return value.substring(0, endIndex).trim();
    }
    private setLinkType(): void {
        // If only local reference.
        if (isNullOrUndefined(this.linkInternal) || this.linkInternal.length < 1) {
            this.typeInternal = 'Bookmark';
            return;
        }
        // Validates link.
        if (this.linkInternal.substring(0, 4) === ('www.')) {
            this.linkInternal = 'http://' + this.navigationLink;
        } else if (this.linkInternal[0] === '@') {
            this.linkInternal = 'mailto:' + this.navigationLink;
        }
        // Finds proper link type.
        if (this.linkInternal.substring(0, 7) === 'http://'
            || this.linkInternal.substring(0, 8) === 'https://') {
            this.typeInternal = 'WebPage';
        } else if (this.linkInternal.substring(0, 7) === 'mailto:') {
            this.typeInternal = 'Email';
        } else {
            this.typeInternal = 'File';
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        this.linkInternal = undefined;
        this.localRef = undefined;
        this.typeInternal = undefined;
        this.opensNewWindow = undefined;
    }
}
/**
 * @private
 */
export class ImageInfo {
    /**
     * @private
     */
    public width: number = 0;
    /**
     * @private
     */
    public height: number = 0;
    /**
     * Constructor for image format class
     *
     * @param imageContainer - Specifies for image width and height values.
     */
    constructor(imageContainer: ImageElementBox) {
        this.width = imageContainer.width;
        this.height = imageContainer.height;
    }
    /**
     * Dispose the internal objects which are maintained.
     *
     * @private
     */
    public destroy(): void {
        this.width = undefined;
        this.height = undefined;
    }
}
