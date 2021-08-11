/* eslint-disable */
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WTabStop, WParagraphFormat } from '../format/paragraph-format';
import { WCellFormat, WTableFormat, WRowFormat, WStyle, WListFormat, WCharacterFormat } from '../format/index';
import { WBorder, WBorders, WShading } from '../format/index';
import { LayoutViewer } from '../index';
import {
    IWidget, LineWidget, ParagraphWidget, BlockContainer, BodyWidget, TextElementBox, Page, ElementBox, FieldElementBox, TableWidget,
    TableRowWidget, TableCellWidget, ImageElementBox, HeaderFooterWidget, HeaderFooters, ContentControl,
    ListTextElementBox, BookmarkElementBox, EditRangeStartElementBox, EditRangeEndElementBox,
    ChartElementBox, ChartDataTable, ChartTitleArea, ChartDataFormat, ChartLayout, ChartArea, ChartLegend, ChartCategoryAxis,
    CommentElementBox, CommentCharacterElementBox, TextFormField, CheckBoxFormField, DropDownFormField, ShapeElementBox,
    ContentControlProperties, FootnoteElementBox, ShapeBase
} from '../viewer/page';
import { BlockWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { TextPosition } from '../selection';
import { DocumentHelper } from '../viewer';
import { WLevelOverride } from '../list';
import { DocumentEditor } from '../../document-editor';
import { Revision } from '../track-changes/track-changes';
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
        this.document = undefined;
        this.endCell = undefined;
        this.startColumnIndex = undefined;
        this.endColumnIndex = undefined;
        this.selectedCommentsId = [];
        this.selectedRevisionId = [];
        this.startBlock = undefined;
        this.endBlock = undefined;
        this.isPartialExport = false;
    }
    /**
     * Serialize the data as Syncfusion document text.
     *
     * @private
     */
    public serialize(): string {
        return JSON.stringify(this.write());
    }
    /**
     * @private
     * @param documentHelper - Specifies document helper instance.
     * @returns {Promise<Blob>}
     */
    public saveAsBlob(documentHelper: DocumentHelper): Promise<Blob> {
        const streamWriter: StreamWriter = new StreamWriter();
        streamWriter.write(this.serialize());
        const blob: Blob = streamWriter.buffer;
        streamWriter.destroy();
        let promise: Promise<Blob>;
        return new Promise((resolve: Function, reject: Function) => {
            resolve(blob);
        });
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
                    editRangeStart[z].editRangeEnd.editRangeId = index;
                }
            }
        }
    }
    /**
     * @private
     */
    /* eslint-disable  */
    public write(line?: LineWidget, startOffset?: number, endLine?: LineWidget, endOffset?: number, writeInlineStyles?: boolean, isExport?: boolean): any {
        if (writeInlineStyles) {
            this.writeInlineStyles = true;
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
            this.document.sections.push(section);

            if (startCell === endCell || isNullOrUndefined(endCell)) {
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
            if ((startCell === endCell && !this.isPartialExport) || isNullOrUndefined(startCell)) {
                let paragraph: any = this.createParagraph(line.paragraph);
                section.blocks.push(paragraph);
                let lastBlock: BlockWidget = line.paragraph;
                nextBlock = this.writeParagraph(line.paragraph, paragraph, section.blocks, line.indexInOwner, startOffset);
                if (this.isPartialExport) {
                    nextBlock = this.getNextBlock(nextBlock, lastBlock);
                    section = this.document.sections[this.document.sections.length - 1];
                }
                while (nextBlock) {
                    lastBlock = nextBlock;
                    nextBlock = this.writeBlock(nextBlock, 0, section.blocks);
                    if (this.isPartialExport && isNullOrUndefined(nextBlock)) {
                        nextBlock = this.getNextBlock(nextBlock, lastBlock);
                        section = this.document.sections[this.document.sections.length - 1];
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
                section.blocks.push(table);
                let lastBlock: BlockWidget = startCell.ownerTable;
                nextBlock = this.writeTable(startCell.ownerTable, table, startCell.ownerRow.indexInOwner, section.blocks);
                if (this.isPartialExport) {
                    nextBlock = this.getNextBlock(nextBlock, lastBlock);
                    section = this.document.sections[this.document.sections.length - 1];
                }
                while (nextBlock) {
                    lastBlock = nextBlock;
                    nextBlock = this.writeBlock(nextBlock, 0, section.blocks);
                    if (this.isPartialExport) {
                        nextBlock = this.getNextBlock(nextBlock, lastBlock);
                        section = this.document.sections[this.document.sections.length - 1];
                    }
                }
            }
        } else {
            this.isExport = true;
            if (this.documentHelper.pages.length > 0) {
                let page: Page = this.documentHelper.pages[0];
                this.writePage(page);
            }
        }
        this.writeStyles(this.documentHelper);
        this.writeLists(this.documentHelper);
        this.writeComments(this.documentHelper);
        this.writeRevisions(this.documentHelper);
        this.writeCustomXml(this.documentHelper);
        this.footnotes(this.documentHelper);
        this.endnotes(this.documentHelper);
        let doc: Document = this.document;
        this.clear();
        return doc;
    }

    private getNextBlock(nextBlock: BlockWidget, lastBlock: BlockWidget): BlockWidget {
        if (isNullOrUndefined(nextBlock) && this.isPartialExport && this.endBlock
            && !this.endBlock.equals(lastBlock)) {
            nextBlock = lastBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
            if (nextBlock && lastBlock.bodyWidget.index !== nextBlock.bodyWidget.index) {
                let section: any = this.createSection(nextBlock.bodyWidget as BlockContainer);
                this.document.sections.push(section);
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
        this.document = {};
        this.document.sections = [];
        this.document.characterFormat = this.writeCharacterFormat(this.documentHelper.characterFormat);
        this.document.paragraphFormat = this.writeParagraphFormat(this.documentHelper.paragraphFormat);
        this.document.defaultTabWidth = this.documentHelper.defaultTabWidth;
        this.document.trackChanges = this.owner.enableTrackChanges;
        this.document.enforcement = this.documentHelper.isDocumentProtected;
        this.document.hashValue = this.documentHelper.hashValue;
        this.document.saltValue = this.documentHelper.saltValue;
        this.document.formatting = this.documentHelper.restrictFormatting;
        this.document.protectionType = this.documentHelper.protectionType;
        this.document.dontUseHTMLParagraphAutoSpacing = this.documentHelper.dontUseHtmlParagraphAutoSpacing;
        this.document.formFieldShading = this.documentHelper.owner.documentEditorSettings.formFieldSettings.applyShading;
        this.document.compatibilityMode = this.documentHelper.compatibilityMode;
    }
    /**
     * @private
     */
    public writePage(page: Page): any {
        if (page.bodyWidgets.length > 0) {
            let nextBlock: BodyWidget = page.bodyWidgets[0];
            do {
                nextBlock = this.writeBodyWidget(nextBlock, 0);
            } while (!isNullOrUndefined(nextBlock));
        }

        return this.document;
    }
    private writeBodyWidget(bodyWidget: BodyWidget, index: number): BodyWidget {
        if (!(bodyWidget instanceof BodyWidget)) {
            return undefined;
        }
        let section: any = this.createSection(bodyWidget);
        this.document.sections.push(section);
        this.writeHeaderFooters(this.documentHelper.headersFooters[bodyWidget.index], section);
        let firstBlock: BlockWidget = bodyWidget.childWidgets[index] as BlockWidget;
        do {
            firstBlock = this.writeBlock(firstBlock as BlockWidget, 0, section.blocks);
        } while (firstBlock);
        let next: BodyWidget = bodyWidget;
        do {
            bodyWidget = next;
            next = next.nextRenderedWidget as BodyWidget;
            if (isNullOrUndefined(next) && !isNullOrUndefined(bodyWidget.page.nextPage) && !isNullOrUndefined(bodyWidget.page.nextPage)) {
                next = bodyWidget.page.nextPage.bodyWidgets[0];
            }
        } while (next instanceof BodyWidget && next.index === bodyWidget.index);
        return next;
    }
    private writeHeaderFooters(hfs: HeaderFooters, section: any): void {
        if (isNullOrUndefined(hfs)) {
            return;
        }
        section.headersFooters.header = this.writeHeaderFooter(hfs[0]);
        section.headersFooters.footer = this.writeHeaderFooter(hfs[1]);
        section.headersFooters.evenHeader = this.writeHeaderFooter(hfs[2]);
        section.headersFooters.evenFooter = this.writeHeaderFooter(hfs[3]);
        section.headersFooters.firstPageHeader = this.writeHeaderFooter(hfs[4]);
        section.headersFooters.firstPageFooter = this.writeHeaderFooter(hfs[5]);
    }
    private writeHeaderFooter(widget: HeaderFooterWidget): any {
        if (isNullOrUndefined(widget) || widget.isEmpty) {
            return undefined;
        }
        let headerFooter: any = {};
        if (widget && widget.childWidgets && widget.childWidgets.length > 0) {
            headerFooter.blocks = [];
            let firstBlock: BlockWidget = widget.firstChild as BlockWidget;
            do {
                firstBlock = this.writeBlock(firstBlock, 0, headerFooter.blocks);
            } while (firstBlock);
        }
        return headerFooter;
    }
    private createSection(bodyWidget: BlockContainer): any {
        let section: any = {};
        section.sectionFormat = {};
        section.sectionFormat.pageWidth = bodyWidget.sectionFormat.pageWidth;
        section.sectionFormat.pageHeight = bodyWidget.sectionFormat.pageHeight;
        section.sectionFormat.leftMargin = bodyWidget.sectionFormat.leftMargin;
        section.sectionFormat.rightMargin = bodyWidget.sectionFormat.rightMargin;
        section.sectionFormat.topMargin = bodyWidget.sectionFormat.topMargin;
        section.sectionFormat.bottomMargin = bodyWidget.sectionFormat.bottomMargin;
        section.sectionFormat.differentFirstPage = bodyWidget.sectionFormat.differentFirstPage;
        section.sectionFormat.differentOddAndEvenPages = bodyWidget.sectionFormat.differentOddAndEvenPages;
        section.sectionFormat.headerDistance = bodyWidget.sectionFormat.headerDistance;
        section.sectionFormat.footerDistance = bodyWidget.sectionFormat.footerDistance;
        section.sectionFormat.bidi = bodyWidget.sectionFormat.bidi;
        if (bodyWidget.sectionFormat.restartPageNumbering) {
            section.sectionFormat.restartPageNumbering = bodyWidget.sectionFormat.restartPageNumbering;
            section.sectionFormat.pageStartingNumber = bodyWidget.sectionFormat.pageStartingNumber;
        }
        if (!isNullOrUndefined(bodyWidget.page.endnoteWidget || bodyWidget.page.footnoteWidget)) {
            section.sectionFormat.endnoteNumberFormat = bodyWidget.sectionFormat.endnoteNumberFormat;
            section.sectionFormat.footNoteNumberFormat = bodyWidget.sectionFormat.footNoteNumberFormat;
            section.sectionFormat.restartIndexForFootnotes = bodyWidget.sectionFormat.restartIndexForFootnotes;
            section.sectionFormat.restartIndexForEndnotes = bodyWidget.sectionFormat.restartIndexForEndnotes;
            section.sectionFormat.initialFootNoteNumber = bodyWidget.sectionFormat.initialFootNoteNumber;
            section.sectionFormat.initialEndNoteNumber = bodyWidget.sectionFormat.initialEndNoteNumber;

        }
        section.blocks = [];
        section.headersFooters = {};
        return section;
    }
    private writeBlock(widget: BlockWidget, index: number, blocks: any): BlockWidget {
        if (!(widget instanceof BlockWidget)) {
            return undefined;
        }
        if (widget instanceof ParagraphWidget) {
            if (widget.hasOwnProperty('contentControlProperties') && widget.contentControlProperties.type !== 'BuildingBlockGallery') {
                let block: any = this.blockContentControl(widget);
                if (!isNullOrUndefined(block) && this.isBlockClosed) {
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
            if (tableWidget.hasOwnProperty('contentControlProperties') && tableWidget.contentControlProperties.type !== 'BuildingBlockGallery') {
                let block: any = this.tableContentControl(tableWidget);
                if (this.isBlockClosed) {
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
            if ((nestedBlocks || (this.blockContent && firstElement instanceof ContentControl && !this.nestedBlockContent && (firstElement as ContentControl).type === 0 && (firstElement as ContentControl).contentControlWidgetType === 'Block'))) {
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
        if (!this.blockContent) {
            return blocks;
        } else if (!this.nestedBlockContent && this.nestedBlockEnabled) {
            this.nestedBlockEnabled = false;
            return blocks;
        }
    }
    private contentControlProperty(contentControlPropertie: ContentControlProperties): any {
        let contentControlProperties: any = {};
        let contentControlListItems: any = [];
        contentControlProperties.lockContentControl = contentControlPropertie.lockContentControl;
        contentControlProperties.lockContents = contentControlPropertie.lockContents;
        contentControlProperties.tag = contentControlPropertie.tag;
        contentControlProperties.color = contentControlPropertie.color;
        contentControlProperties.title = contentControlPropertie.title;
        if (!isNullOrUndefined(contentControlPropertie.appearance)) {
            contentControlProperties.appearance = contentControlPropertie.appearance;
        }
        contentControlProperties.type = contentControlPropertie.type;
        contentControlProperties.hasPlaceHolderText = contentControlPropertie.hasPlaceHolderText;
        contentControlProperties.multiline = contentControlPropertie.multiline;
        contentControlProperties.isTemporary = contentControlPropertie.isTemporary;
        if (!isNullOrUndefined(contentControlPropertie.isChecked)) {
            contentControlProperties.isChecked = contentControlPropertie.isChecked;
        }
        if (!isNullOrUndefined(contentControlPropertie.uncheckedState)) {
            contentControlProperties.uncheckedState = this.tounCheckedState(contentControlPropertie.uncheckedState);
        }
        if (!isNullOrUndefined(contentControlPropertie.checkedState)) {
            contentControlProperties.checkedState = this.toCheckedState(contentControlPropertie.checkedState);
        }
        if (!isNullOrUndefined(contentControlPropertie.dateCalendarType)) {
            contentControlProperties.dateCalendarType = contentControlPropertie.dateCalendarType;
        }
        if (!isNullOrUndefined(contentControlPropertie.dateStorageFormat)) {
            contentControlProperties.dateStorageFormat = contentControlPropertie.dateStorageFormat;
        }
        if (!isNullOrUndefined(contentControlPropertie.dateDisplayLocale)) {
            contentControlProperties.dateDisplayLocale = contentControlPropertie.dateDisplayLocale;
        }
        if (!isNullOrUndefined(contentControlPropertie.dateDisplayFormat)) {
            contentControlProperties.dateDisplayFormat = contentControlPropertie.dateDisplayFormat;
        }
        if (!isNullOrUndefined(contentControlPropertie.xmlMapping)) {
            contentControlProperties.xmlMapping = contentControlPropertie.xmlMapping;
        }
        if (!isNullOrUndefined(contentControlPropertie.characterFormat)) {
            contentControlProperties.characterFormat = this.writeCharacterFormat(contentControlPropertie.characterFormat);
        }
        contentControlProperties.contentControlListItems = contentControlPropertie.contentControlListItems;
        return contentControlProperties;
    }
    private tounCheckedState(state: any): any {
        let unCheckedState: any = {};
        unCheckedState.font = state.font;
        unCheckedState.value = state.value;
        return unCheckedState;
    }
    private toCheckedState(state: any): any {
        let checkedState: any = {};
        checkedState.font = state.font;
        checkedState.value = state.value;
        return checkedState;
    }
    private blockContentControl(widget: ParagraphWidget): any {
        let block: any = {};
        if (widget.childWidgets.length === 0) {
            this.nextBlock = widget.nextWidget;
            return undefined;
        }
        block.blocks = this.writeParagraphs(widget);        
        if (!isNullOrUndefined(block.blocks)) {
            let child: LineWidget = widget.childWidgets[0] as LineWidget;
            let firstChild: ElementBox = child.children[0];
            let secondChild: ElementBox = child.children[1];
            if (firstChild instanceof ListTextElementBox || secondChild instanceof ListTextElementBox) {
                firstChild = child.children[2];
                secondChild = child.children[3];
            }
            if ((firstChild instanceof ContentControl && secondChild instanceof ContentControl && !this.nestedBlockContent) || (this.blockContent && firstChild instanceof ContentControl && !this.nestedBlockContent)) {
                if (!(secondChild instanceof ContentControl)) {
                    block.contentControlProperties = this.contentControlProperty(firstChild.contentControlProperties);
                    return block;
                } else if ((secondChild as ContentControl).contentControlWidgetType === 'Block') {
                    block.contentControlProperties = this.contentControlProperty(secondChild.contentControlProperties);
                } else {
                    block.contentControlProperties = this.contentControlProperty(widget.contentControlProperties);
                }
            } else {
                block.contentControlProperties = this.contentControlProperty(widget.contentControlProperties);
            }
            return block;
        }
    }
    private tableContentControl(tableWidget: TableWidget): any {
        let block: any = {};
        block.blocks = this.tableContentControls(tableWidget);
        if (!isNullOrUndefined(this.nextBlock)) {
            if (tableWidget.contentControlProperties === this.nextBlock.contentControlProperties) {
                return this.blocks = block.blocks;
            }
        }
        block.contentControlProperties = this.contentControlProperty(tableWidget.contentControlProperties);
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
            if (this.writeLines(next, lineIndex, start, paragraph.inlines)) {
                return undefined;
            }
            lineIndex = 0;
            start = 0;
            paragraphWidget = next;
            next = paragraphWidget.nextSplitWidget as ParagraphWidget;
        }
        next = paragraphWidget.nextRenderedWidget as BlockWidget;
        if (isNullOrUndefined(next) && paragraphWidget.containerWidget instanceof BodyWidget &&
            !isNullOrUndefined((paragraphWidget.containerWidget as BodyWidget).page.nextPage) &&
            !isNullOrUndefined((paragraphWidget.containerWidget as BodyWidget).page.nextPage.bodyWidgets)) {
            next = (paragraphWidget.containerWidget as BodyWidget).page.nextPage.bodyWidgets[0].childWidgets[0] as BlockWidget;
        }
        return (next instanceof BlockWidget && paragraphWidget.containerWidget.index === next.containerWidget.index) ? next : undefined;
    }
    private writeInlines(paragraph: ParagraphWidget, line: LineWidget, inlines: any): void {
        this.contentInline = [];
        let lineWidget: LineWidget = line.clone();
        let isformField: boolean = false;
        let bidi: boolean = paragraph.paragraphFormat.bidi;
        if (bidi || this.documentHelper.layout.isContainsRtl(lineWidget)) {
            this.documentHelper.layout.reArrangeElementsForRtl(lineWidget, bidi);
        }
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
                inlines.push(this.writeInlinesFootNote(paragraph, element, line, inlines));
                continue;
            }
            if ((element instanceof ContentControl && !isNullOrUndefined(element.contentControlProperties) && element.contentControlProperties.type !== 'BuildingBlockGallery') || this.startContent || this.blockContent) {
                if (inlines.length > 0) {
                    this.writeInlinesContentControl(element, line, inlines, i);
                }
                continue;
            } else {
                let inline: any = this.writeInline(element);
                if (!isNullOrUndefined(inline)) {
                    inlines.push(inline);
                }
            }
            if (this.isExport && element instanceof FieldElementBox && element.fieldType === 1) {
                isformField = false;
                this.checkboxOrDropdown = false;
            }
        }
    }
    private inlineContentControl(element: ElementBox, nextElement: any, inlines?: any): any {
        let inline: any = {};
        let nestedContentInline: any = [];
        if (!isNullOrUndefined(inlines)) {
            if (this.nestedContent) {
                inlines = inlines[inlines.length - 1].inlines;
                inline = this.inlineContentControls(element, inlines[inlines.length - 1].inlines);
                let nestedContentinline: any = this.nestedContentProperty(nextElement, inlines[inlines.length - 1]);
                if (!isNullOrUndefined(nestedContentinline)) {
                    this.contentInline.push(inline);
                    nestedContentInline = [];
                }
            } else {
                this.inlineContentControls(element, inlines[inlines.length - 1].inlines);
            }
        } else {
            if (this.nestedContent) {
                inline.inlines = this.inlineContentControls(element, undefined, nestedContentInline);
                let nestedContentinline: any = this.nestedContentProperty(nextElement, inline);
                if (!isNullOrUndefined(nestedContentinline) || this.multipleLineContent) {
                    this.contentInline.push(inline);
                    nestedContentInline = [];
                }
            } else {
                inline.inlines = this.inlineContentControls(element, this.contentInline);
            }
        }
        if (!isNullOrUndefined(nextElement)) {
            if (nextElement.type === 1 && !this.nestedContent) {
                if (this.multipleLineContent) {
                    inlines[inlines.length - 1].contentControlProperties = this.contentControlProperty(nextElement.contentControlProperties);
                    this.multipleLineContent = false;
                    return;
                } else {
                    inline.contentControlProperties = this.contentControlProperty(nextElement.contentControlProperties);
                }
                return inline;
            }
        } else if (this.startContent) {
            this.multipleLineContent = true;
            return inline;
        }
    }
    private nestedContentProperty(nextElement: any, inline: any, inlines?: any): any {
        if (!isNullOrUndefined(nextElement)) {
            if (nextElement.type === 1) {
                inline.contentControlProperties = this.contentControlProperty(nextElement.contentControlProperties);
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
        inline.characterFormat = this.writeCharacterFormat(element.characterFormat);
        if (element instanceof FieldElementBox) {
            inline.fieldType = element.fieldType;
            if (element.fieldType === 0) {
                inline.hasFieldEnd = true;
                if (element.formFieldData) {
                    inline.formFieldData = {};
                    inline.formFieldData.name = element.formFieldData.name;
                    inline.formFieldData.enabled = element.formFieldData.enabled;
                    inline.formFieldData.helpText = element.formFieldData.helpText;
                    inline.formFieldData.statusText = element.formFieldData.statusText;
                    if (element.formFieldData instanceof TextFormField) {
                        inline.formFieldData.textInput = {};
                        inline.formFieldData.textInput.type = (element.formFieldData as TextFormField).type;
                        inline.formFieldData.textInput.maxLength = (element.formFieldData as TextFormField).maxLength;
                        inline.formFieldData.textInput.defaultValue = (element.formFieldData as TextFormField).defaultValue;
                        inline.formFieldData.textInput.format = (element.formFieldData as TextFormField).format;
                    } else if (element.formFieldData instanceof CheckBoxFormField) {
                        inline.formFieldData.checkBox = {};
                        this.checkboxOrDropdown = true;
                        inline.formFieldData.checkBox.sizeType = (element.formFieldData as CheckBoxFormField).sizeType;
                        inline.formFieldData.checkBox.size = (element.formFieldData as CheckBoxFormField).size;
                        inline.formFieldData.checkBox.defaultValue = (element.formFieldData as CheckBoxFormField).defaultValue;
                        inline.formFieldData.checkBox.checked = (element.formFieldData as CheckBoxFormField).checked;
                    } else {
                        inline.formFieldData.dropDownList = {};
                        this.checkboxOrDropdown = true;
                        inline.formFieldData.dropDownList.dropDownItems = (element.formFieldData as DropDownFormField).dropdownItems;
                        inline.formFieldData.dropDownList.selectedIndex = (element.formFieldData as DropDownFormField).selectedIndex;
                    }
                }
            }
            if (element.fieldCodeType && element.fieldCodeType !== '') {
                inline.fieldCodeType = element.fieldCodeType;
            }
        } else if (element instanceof ChartElementBox) {
            this.writeChart(element, inline);
        } else if (element instanceof ImageElementBox) {
            inline.imageString = element.imageString;
            inline.metaFileImageString = element.metaFileImageString;
            inline.isMetaFile = element.isMetaFile;
            inline.isCompressed = element.isCompressed;
            inline.width = HelperMethods.convertPixelToPoint(element.width);
            inline.height = HelperMethods.convertPixelToPoint(element.height);
            inline.iscrop = element.isCrop;
            if (element.isCrop) {
                inline.bottom = element.bottom;
                inline.right = element.right;
                inline.left = element.left;
                inline.top = element.top;
                inline.getimagewidth = element.cropWidthScale;
                inline.getimageheight = element.cropHeightScale;
            }
            inline.name = element.name;
            inline.alternativeText = element.alternativeText;
            inline.title = element.title;
            inline.visible = element.visible;
            inline.widthScale = element.widthScale;
            inline.heightScale = element.heightScale;
            inline.verticalPosition = HelperMethods.convertPixelToPoint(element.verticalPosition);
            inline.verticalOrigin = element.verticalOrigin;
            inline.verticalAlignment = element.verticalAlignment;
            inline.horizontalPosition = HelperMethods.convertPixelToPoint(element.horizontalPosition);
            inline.horizontalOrigin = element.horizontalOrigin;
            inline.horizontalAlignment = element.horizontalAlignment;
            inline.allowOverlap = element.allowOverlap;
            inline.textWrappingStyle = element.textWrappingStyle;
            inline.textWrappingType = element.textWrappingType;
            inline.layoutInCell = element.layoutInCell;
            inline.zOrderPosition = element.zOrderPosition;
        } else if (element instanceof BookmarkElementBox) {
            inline.bookmarkType = element.bookmarkType;
            inline.name = element.name;
        } else if (element instanceof TextElementBox) {
            // replacing the no break hyphen character by '-'
            if (element.text.indexOf('\u001e') !== -1) {
                inline.text = element.text.replace(/\u001e/g, '-');
            } else if (element.text.indexOf('\u001f') !== -1) {
                inline.text = element.text.replace(/\u001f/g, '');
            } else if (element.revisions.length !== 0) {
                if (!this.isExport && this.owner.enableTrackChanges && !this.isPartialExport) {
                    this.copyWithTrackChange = true;
                    for (let x: number = 0; x < element.revisions.length; x++) {
                        let revision: Revision = element.revisions[x];
                        if (this.selectedRevisionId.indexOf(revision.revisionID) === -1) {
                            this.selectedRevisionId.push(revision.revisionID);
                        }
                        if (element.revisions[x].revisionType === 'Deletion') {
                            element.revisions.pop();
                        } else if (element.revisions[x].revisionType === 'Insertion') {
                            element.revisions.pop();
                            inline.text = element.text;
                        } else {
                            inline.text = element.text;
                        }
                    }
                } else {
                    inline.text = element.text;
                }
            } else {
                inline.text = element.text;
            }
        } else if (element instanceof EditRangeStartElementBox) {
            inline.user = element.user;
            inline.group = element.group;
            inline.columnFirst = element.columnFirst;
            inline.columnLast = element.columnLast;
            inline.editRangeId = element.editRangeId.toString();
        } else if (element instanceof EditRangeEndElementBox) {
            inline.editableRangeStart = {
                'user': element.editRangeStart.user,
                'group': element.editRangeStart.group,
                'columnFirst': element.editRangeStart.columnFirst,
                'columnLast': element.editRangeStart.columnLast
            };
            inline.editRangeId = element.editRangeId.toString();
        } else if (element instanceof CommentCharacterElementBox) {
            if (!this.isExport && element.commentType === 0) {
                this.selectedCommentsId.push(element.commentId);
            }
            inline.commentCharacterType = element.commentType;
            inline.commentId = element.commentId;
        } else if (element instanceof ShapeElementBox) {
            this.writeShape(element, inline);
        } else {
            inline = undefined;
        }
        if (element.revisions.length > 0) {
            inline.revisionIds = [];
            for (let x: number = 0; x < element.revisions.length; x++) {
                //revisionIdes[x] = element.revisions[x];
                if (this.selectedRevisionId.indexOf(element.revisions[x].revisionID) === -1) {
                    this.selectedRevisionId.push(element.revisions[x].revisionID);
                }
                inline.revisionIds.push(element.revisions[x].revisionID);
                //this.document.revisionIdes.push(inline.revisionIds)
            }
        }
        /*if(element.removedIds.length > 0){
            inline.revisionIds = [];
            for(let x:number = 0;x < element.removedIds.length; x++){
            inline.revisionIds.push(element.removedIds);
            }
        }*/
        return inline;
    }
    private writeShape(element: ShapeElementBox, inline: any): void {
        inline.shapeId = element.shapeId;
        inline.name = element.name;
        inline.alternativeText = element.alternativeText;
        inline.title = element.title;
        inline.visible = element.visible;
        inline.width = HelperMethods.convertPixelToPoint(element.width);
        inline.height = HelperMethods.convertPixelToPoint(element.height);
        inline.widthScale = element.widthScale;
        inline.heightScale = element.heightScale;
        inline.verticalPosition = HelperMethods.convertPixelToPoint(element.verticalPosition);
        inline.verticalOrigin = element.verticalOrigin;
        inline.verticalAlignment = element.verticalAlignment;
        inline.verticalRelativePercent = element.verticalRelativePercent;
        inline.horizontalPosition = HelperMethods.convertPixelToPoint(element.horizontalPosition);
        inline.horizontalOrigin = element.horizontalOrigin;
        inline.horizontalAlignment = element.horizontalAlignment;
        inline.horizontalRelativePercent = element.horizontalRelativePercent;
        inline.zOrderPosition = element.zOrderPosition;
        inline.allowOverlap = element.allowOverlap;
        inline.textWrappingStyle = element.textWrappingStyle;
        inline.textWrappingType = element.textWrappingType;
        inline.distanceBottom = HelperMethods.convertPixelToPoint(element.distanceBottom);
        inline.distanceLeft = HelperMethods.convertPixelToPoint(element.distanceLeft);
        inline.distanceRight = HelperMethods.convertPixelToPoint(element.distanceRight);
        inline.distanceTop = HelperMethods.convertPixelToPoint(element.distanceTop);
        inline.layoutInCell = element.layoutInCell;
        inline.lockAnchor = element.lockAnchor;
        inline.autoShapeType = element.autoShapeType;
        if (element.fillFormat) {
            inline.fillFormat = {};
            inline.fillFormat.color = element.fillFormat.color;
            inline.fillFormat.fill = element.fillFormat.fill;
        }
        if (element.lineFormat) {
            inline.lineFormat = {};
            inline.lineFormat.lineFormatType = element.lineFormat.lineFormatType;
            inline.lineFormat.color = element.lineFormat.color;
            inline.lineFormat.weight = element.lineFormat.weight;
            inline.lineFormat.lineStyle = element.lineFormat.dashStyle;
            inline.lineFormat.line = element.lineFormat.line;
        }
        if (element.textFrame) {
            inline.textFrame = {};
            inline.textFrame.textVerticalAlignment = element.textFrame.textVerticalAlignment;
            inline.textFrame.leftMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginLeft);
            inline.textFrame.rightMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginRight);
            inline.textFrame.topMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginTop);
            inline.textFrame.bottomMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginBottom);
            inline.textFrame.blocks = [];
            for (let j: number = 0; j < element.textFrame.childWidgets.length; j++) {
                let textFrameBlock: BlockWidget = element.textFrame.childWidgets[j] as BlockWidget;
                this.writeBlock(textFrameBlock, 0, inline.textFrame.blocks);
            }
        }
    }
    public writeChart(element: ChartElementBox, inline: any): void {
        inline.chartLegend = {};
        inline.chartTitleArea = {};
        inline.chartArea = {};
        inline.plotArea = {};
        inline.chartCategory = [];
        inline.chartSeries = [];
        inline.chartPrimaryCategoryAxis = {};
        inline.chartPrimaryValueAxis = {};
        this.writeChartTitleArea(element.chartTitleArea, inline.chartTitleArea);
        this.writeChartArea(element.chartArea, inline.chartArea);
        this.writeChartArea(element.chartPlotArea, inline.plotArea);
        this.writeChartCategory(element, inline.chartCategory);
        this.createChartSeries(element, inline.chartSeries);
        this.writeChartLegend(element.chartLegend, inline.chartLegend);
        this.writeChartCategoryAxis(element.chartPrimaryCategoryAxis, inline.chartPrimaryCategoryAxis);
        this.writeChartCategoryAxis(element.chartPrimaryValueAxis, inline.chartPrimaryValueAxis);
        if (element.chartDataTable.showSeriesKeys !== undefined) {
            inline.chartDataTable = {};
            this.writeChartDataTable(element.chartDataTable, inline.chartDataTable);
        }
        inline.chartTitle = element.title;
        inline.chartType = element.type;
        inline.gapWidth = element.chartGapWidth;
        inline.overlap = element.chartOverlap;
        inline.height = HelperMethods.convertPixelToPoint(element.height);
        inline.width = HelperMethods.convertPixelToPoint(element.width);
    }
    private writeChartTitleArea(titleArea: ChartTitleArea, chartTitleArea: any): void {
        chartTitleArea.fontName = titleArea.chartfontName;
        chartTitleArea.fontSize = titleArea.chartFontSize;
        chartTitleArea.layout = {};
        chartTitleArea.dataFormat = this.writeChartDataFormat(titleArea.dataFormat);
        this.writeChartLayout(titleArea.layout, chartTitleArea.layout);
    }
    private writeChartDataFormat(format: ChartDataFormat): any {
        let chartDataFormat: any = {};
        chartDataFormat.fill = {};
        chartDataFormat.line = {};
        chartDataFormat.fill.foreColor = format.fill.color;
        chartDataFormat.fill.rgb = format.fill.rgb;
        chartDataFormat.line.color = format.line.color;
        chartDataFormat.line.rgb = format.line.rgb;
        return chartDataFormat;
    }
    private writeChartLayout(layout: ChartLayout, chartLayout: any): void {
        chartLayout.layoutX = layout.chartLayoutLeft;
        chartLayout.layoutY = layout.chartLayoutTop;
    }
    private writeChartArea(area: ChartArea, chartArea: any): void {
        chartArea.foreColor = area.chartForeColor;
    }
    private writeChartLegend(legend: ChartLegend, chartLegend: any): void {
        chartLegend.position = legend.chartLegendPostion;
        chartLegend.chartTitleArea = {};
        this.writeChartTitleArea(legend.chartTitleArea, chartLegend.chartTitleArea);
    }
    private writeChartCategoryAxis(categoryAxis: ChartCategoryAxis, primaryCategoryAxis: any): void {
        primaryCategoryAxis.chartTitle = categoryAxis.categoryAxisTitle;
        primaryCategoryAxis.chartTitleArea = {};
        this.writeChartTitleArea(categoryAxis.chartTitleArea, primaryCategoryAxis.chartTitleArea);
        primaryCategoryAxis.categoryType = categoryAxis.categoryAxisType;
        primaryCategoryAxis.fontSize = categoryAxis.axisFontSize;
        primaryCategoryAxis.fontName = categoryAxis.axisFontName;
        primaryCategoryAxis.numberFormat = categoryAxis.categoryNumberFormat;
        primaryCategoryAxis.maximumValue = categoryAxis.max;
        primaryCategoryAxis.minimumValue = categoryAxis.min;
        primaryCategoryAxis.majorUnit = categoryAxis.interval;
        primaryCategoryAxis.hasMajorGridLines = categoryAxis.majorGridLines;
        primaryCategoryAxis.hasMinorGridLines = categoryAxis.minorGridLines;
        primaryCategoryAxis.majorTickMark = categoryAxis.majorTick;
        primaryCategoryAxis.minorTickMark = categoryAxis.minorTick;
        primaryCategoryAxis.tickLabelPosition = categoryAxis.tickPosition;
    }
    private writeChartDataTable(chartDataTable: ChartDataTable, dataTable: any): void {
        dataTable.showSeriesKeys = chartDataTable.showSeriesKeys;
        dataTable.hasHorzBorder = chartDataTable.hasHorzBorder;
        dataTable.hasVertBorder = chartDataTable.hasVertBorder;
        dataTable.hasBorders = chartDataTable.hasBorders;
    }
    private writeChartCategory(element: any, chartCategory: any): void {
        let data: any = element.chartCategory;
        chartCategory.chartData = [];
        for (let i: number = 0; i < data.length; i++) {
            let xData: any = data[i];
            let categories: any = this.createChartCategory(xData, element.chartType);
            chartCategory.push(categories);
        }
    }
    private createChartCategory(data: any, type: string): any {
        let chartCategory: any = {};
        chartCategory.chartData = [];
        this.writeChartData(data, chartCategory.chartData, type);
        chartCategory.categoryXName = data.categoryXName;
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
        chartData.yValue = data.yValue;
        if (type === 'Bubble') {
            chartData.size = data.size;
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
        chartSeries.dataPoints = [];
        chartSeries.seriesName = series.seriesName;
        if (isPieType) {
            if (!isNullOrUndefined(series.firstSliceAngle)) {
                chartSeries.firstSliceAngle = series.firstSliceAngle;
            }
            if (type === 'Doughnut') {
                chartSeries.holeSize = series.doughnutHoleSize;
            }
        }
        if (!isNullOrUndefined(series.dataLabels.labelPosition)) {
            let dataLabel: any = this.writeChartDataLabels(series.dataLabels);
            chartSeries.dataLabel = dataLabel;
        }
        if (!isNullOrUndefined(series.seriesFormat.markerStyle)) {
            let seriesFormat: any = {};
            let format: any = series.seriesFormat;
            seriesFormat.markerStyle = format.markerStyle;
            seriesFormat.markerSize = format.numberValue;
            seriesFormat.markerColor = format.markerColor;
            chartSeries.seriesFormat = seriesFormat;
        }
        if (!isNullOrUndefined(errorBarData.type)) {
            errorBar.type = errorBarData.type;
            errorBar.direction = errorBarData.direction;
            errorBar.endStyle = errorBarData.endStyle;
            errorBar.numberValue = errorBarData.numberValue;
            chartSeries.errorBar = errorBarData;
        }
        if (series.trendLines.length > 0) {
            chartSeries.trendLines = [];
            for (let i: number = 0; i < series.trendLines.length; i++) {
                let trendLine: any = this.writeChartTrendLines(series.trendLines[i]);
                chartSeries.trendLines.push(trendLine);
            }
        }
        for (let i: number = 0; i < series.chartDataFormat.length; i++) {
            let format: any = this.writeChartDataFormat(series.chartDataFormat[i]);
            chartSeries.dataPoints.push(format);
        }
        return chartSeries;
    }
    private writeChartDataLabels(dataLabels: any): any {
        let dataLabel: any = {};
        dataLabel.position = dataLabels.position;
        dataLabel.fontName = dataLabels.fontName;
        dataLabel.fontColor = dataLabels.fontColor;
        dataLabel.fontSize = dataLabels.fontSize;
        dataLabel.isLegendKey = dataLabels.isLegendKey;
        dataLabel.isBubbleSize = dataLabels.isBubbleSize;
        dataLabel.isCategoryName = dataLabels.isCategoryName;
        dataLabel.isSeriesName = dataLabels.isSeriesName;
        dataLabel.isValue = dataLabels.isValue;
        dataLabel.isPercentage = dataLabels.isPercentage;
        dataLabel.isLeaderLines = dataLabels.isLeaderLines;
        return dataLabel;
    }
    private writeChartTrendLines(trendLines: any): any {
        let trendLine: any = {};
        trendLine.name = trendLines.trendLineName;
        trendLine.type = trendLines.trendLineType;
        trendLine.forward = trendLines.forwardValue;
        trendLine.backward = trendLines.backwardValue;
        trendLine.intercept = trendLines.interceptValue;
        trendLine.isDisplayEquation = trendLines.isDisplayEquation;
        trendLine.isDisplayRSquared = trendLines.isDisplayRSquared;
        return trendLine;
    }
    private writeLines(paragraph: ParagraphWidget, lineIndex: number, offset: number, inlines: any): boolean {
        let startIndex: number = lineIndex;
        let endParagraph: boolean = this.endLine instanceof LineWidget && this.endLine.paragraph === paragraph;
        let endIndex: number = endParagraph ? this.endLine.indexInOwner : paragraph.childWidgets.length - 1;
        for (let i: number = startIndex; i <= endIndex; i++) {
            let child: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (this.endLine === child || (lineIndex === i && offset !== 0)) {
                this.writeLine(child, (this.startLine !== this.endLine && child !== this.startLine) ? 0 : offset, inlines);
            } else {
                this.writeInlines(paragraph, child, inlines);
            }
        }
        return endParagraph;
    }
    private writeLine(line: LineWidget, offset: number, inlines: any): void {
        this.contentInline = [];
        let isContentStarted: boolean = false;
        let contentControl: boolean = false;
        let isEnd: boolean = line === this.endLine;
        let lineWidget: LineWidget = line.clone();
        let bidi: boolean = line.paragraph.paragraphFormat.bidi;
        if (bidi || this.documentHelper.layout.isContainsRtl(lineWidget)) {
            this.documentHelper.layout.reArrangeElementsForRtl(lineWidget, bidi);
        }
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
            if (element instanceof ContentControl) {
                if (!started) {
                    isContentStarted = element.type === 0 ? true : false;
                }
                contentControl = true;
            }
            if (element instanceof TextElementBox && element.hasOwnProperty('contentControlProperties') && started && !contentControl) {
                isContentStarted = true;
            }
            if (element instanceof ContentControl) {
                if (isContentStarted) {
                    if (element.type === 1) {
                        isContentStarted = false;
                    }
                }
                if (contentControl) {
                    if (element.type === 1) {
                        contentControl = false;
                    }
                }
            }
            ended = isEnd && length >= this.endOffset;
            if (!started || isContentStarted) {
                continue;
            }
            if ((element instanceof ContentControl && !isNullOrUndefined(element.contentControlProperties) && element.contentControlProperties.type !== 'BuildingBlockGallery') || this.startContent || this.blockContent) {
                if (ended) {
                    this.startContent = false;
                    break;
                }
                this.writeInlinesContentControl(element, line, inlines, j);
                continue;
            }
            inline = this.writeInline(element);
            inlines[inlines.length] = inline;
            if (length > offset || ended) {
                if (inline.hasOwnProperty('text')) {
                    let startIndex: number = length - element.length;
                    let indexInInline: number = offset - startIndex;
                    let endIndex: number = ended ? this.endOffset - startIndex : element.length;
                    inline.text = inline.text.substring(indexInInline, endIndex);
                }
                offset = -1;
            }
            if (ended) {
                break;
            }
        }
    }
    private writeInlinesFootNote(paragraph: any, element: any, line: any, inlines: any): any {
        let inline: any = {};
        inline.footnoteType = element.footnoteType;
        inline.characterFormat = {};
        inline.characterFormat = this.writeCharacterFormat(element.characterFormat);
        inline.blocks = [];
        for (let i: number = 0; i < element.blocks.length; i++) {
            this.writeBlock(element.blocks[i], 0, inline.blocks);
        }
        inline.symbolCode = element.symbolCode;
        inline.symbolFontName = element.symbolFontName;
        inline.customMarker = element.customMarker;
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
                inline.inlines = this.contentInline;
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
            if (this.multipleLineContent) {
                this.inlineContentControl(element, lineWidget.children[i + 1], inlines);
                this.contentInline = [];
            } else {
                let contentinline: any = this.inlineContentControl(element, lineWidget.children[i + 1]);
                if (!isNullOrUndefined(contentinline)) {
                    if (this.nestedContent && this.multipleLineContent) {
                        let inline: any = {};
                        inline.inlines = this.contentInline;
                        inlines.push(inline);
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
        if (this.documentHelper.selection && !this.documentHelper.selection.isEmpty && !this.isExport) {
            let endPos: TextPosition = this.documentHelper.selection.end;
            if (!this.documentHelper.selection.isForward) {
                endPos = this.documentHelper.selection.start;
            }
            let lastLine: LineWidget = endPos.paragraph.childWidgets[endPos.paragraph.childWidgets.length - 1] as LineWidget;
            isParaSelected = this.documentHelper.selection.isParagraphLastLine(lastLine) && endPos.currentWidget === lastLine
                && endPos.offset === this.documentHelper.selection.getLineLength(lastLine) + 1;
        } else {
            isParaSelected = true;
        }
        paragraph.paragraphFormat = this.writeParagraphFormat(isParaSelected ? paragraphWidget.paragraphFormat : new WParagraphFormat(paragraphWidget));
        paragraph.characterFormat = this.writeCharacterFormat(isParaSelected ? paragraphWidget.characterFormat : new WCharacterFormat(paragraphWidget));
        paragraph.inlines = [];
        return paragraph;
    }
    /**
     * @private
     */
    public writeCharacterFormat(format: WCharacterFormat, isInline?: boolean): any {
        let characterFormat: any = {};
        HelperMethods.writeCharacterFormat(characterFormat, isInline, format);
        characterFormat.boldBidi = isInline ? format.bold : format.getValue('bold');
        characterFormat.italicBidi = isInline ? format.italic : format.getValue('italic');
        characterFormat.fontSizeBidi = isInline ? format.fontSize : format.getValue('fontSize');
        characterFormat.fontFamilyBidi = isInline ? format.fontFamily : format.getValue('fontFamily');
        if (this.writeInlineStyles && !isInline) {
            characterFormat.inlineFormat = this.writeCharacterFormat(format, true);
        }
        return characterFormat;
    }
    private writeParagraphFormat(format: WParagraphFormat, isInline?: boolean): any {
        let paragraphFormat: any = {};
        paragraphFormat.leftIndent = isInline ? format.leftIndent : format.getValue('leftIndent');
        paragraphFormat.rightIndent = isInline ? format.rightIndent : format.getValue('rightIndent');
        paragraphFormat.firstLineIndent = isInline ? format.firstLineIndent : format.getValue('firstLineIndent');
        paragraphFormat.textAlignment = isInline ? format.textAlignment : format.getValue('textAlignment');
        paragraphFormat.beforeSpacing = isInline ? format.beforeSpacing : format.getValue('beforeSpacing');
        paragraphFormat.afterSpacing = isInline ? format.afterSpacing : format.getValue('afterSpacing');
        paragraphFormat.lineSpacing = isInline ? format.lineSpacing : format.getValue('lineSpacing');
        paragraphFormat.lineSpacingType = isInline ? format.lineSpacingType : format.getValue('lineSpacingType');
        paragraphFormat.styleName = !isNullOrUndefined(format.baseStyle) ? format.baseStyle.name : undefined;
        paragraphFormat.outlineLevel = isInline ? format.outlineLevel : format.getValue('outlineLevel');
        paragraphFormat.listFormat = this.writeListFormat(format.listFormat, isInline);
        paragraphFormat.tabs = this.writeTabs(format.tabs);
        paragraphFormat.bidi = isInline ? format.bidi : format.getValue('bidi');
        paragraphFormat.keepLinesTogether = isInline ? format.keepLinesTogether : format.getValue('keepLinesTogether');
        paragraphFormat.keepWithNext = isInline ? format.keepWithNext : format.getValue('keepWithNext');
        paragraphFormat.contextualSpacing = isInline ? format.contextualSpacing : format.getValue('contextualSpacing');
        if (this.writeInlineStyles && !isInline) {
            paragraphFormat.inlineFormat = this.writeParagraphFormat(format, true);
        }
        return paragraphFormat;
    }
    private writeTabs(tabStops: WTabStop[]): any {
        if (isNullOrUndefined(tabStops) || tabStops.length < 1) {
            return undefined;
        }
        let tabs: any = [];
        for (let i: number = 0; i < tabStops.length; i++) {
            let tabStop: WTabStop = tabStops[i];
            let tab: any = {};
            tab.position = tabStop.position;
            tab.deletePosition = tabStop.deletePosition;
            tab.tabJustification = tabStop.tabJustification;
            tab.tabLeader = tabStop.tabLeader;
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
            listFormat.listId = listIdValue;
            if (this.lists.indexOf(format.listId) < 0) {
                this.lists.push(format.listId);
            }
        }
        let listLevelNumber: Object = format.getValue('listLevelNumber');
        if (!isNullOrUndefined(listLevelNumber)) {
            listFormat.listLevelNumber = listLevelNumber;
        }
        return listFormat;
    }
    private writeTable(tableWidget: TableWidget, table: any, index: number, blocks: any): BlockWidget {
        let widget: IWidget = tableWidget.childWidgets[index];
        if (widget instanceof TableRowWidget) {
            if (this.writeRow(widget, table.rows)) {
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
        if (!(rowWidget instanceof TableRowWidget)) {
            return false;
        }
        let row: any = this.createRow(rowWidget);
        rows.push(row);
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let widget: IWidget = rowWidget.childWidgets[i];
            if (widget instanceof TableCellWidget) {
                if (rowWidget.index === widget.rowIndex
                    && (isNullOrUndefined(this.startColumnIndex) || widget.columnIndex >= this.startColumnIndex)
                    && (isNullOrUndefined(this.endColumnIndex) || widget.columnIndex < this.endColumnIndex)) {
                    if (this.writeCell(widget, row.cells)) {
                        return true;
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
        return this.writeRow(next, rows);
    }
    private writeCell(cellWidget: TableCellWidget, cells: any): boolean {
        let cell: any = this.createCell(cellWidget);
        cells.push(cell);
        let firstBlock: BlockWidget = cellWidget.firstChild as BlockWidget;
        do {
            firstBlock = this.writeBlock(firstBlock as BlockWidget, 0, cell.blocks);
        } while (firstBlock);
        return this.endCell instanceof TableCellWidget ? this.endCell.cellFormat === cellWidget.cellFormat : false;
    }
    private createTable(tableWidget: TableWidget): any {
        let table: any = {};
        table.rows = [];
        table.grid = [];
        for (let i: number = 0; i < tableWidget.tableHolder.columns.length; i++) {
            table.grid[i] = tableWidget.tableHolder.columns[i].preferredWidth;
        }
        table.tableFormat = this.writeTableFormat(tableWidget.tableFormat);
        table.description = tableWidget.description;
        table.title = tableWidget.title;
        table.columnCount = tableWidget.tableHolder.columns.length;
        this.writeTablePositioning(table, tableWidget);
        return table;
    }
    private writeTablePositioning(table: any, tableWidget: TableWidget): void {
        if (tableWidget.wrapTextAround) {
            table.wrapTextAround = tableWidget.wrapTextAround;
            table.positioning = {};
            table.positioning.allowOverlap = tableWidget.positioning.allowOverlap;
            table.positioning.distanceBottom = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceBottom);
            table.positioning.distanceLeft = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceLeft);
            table.positioning.distanceRight = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceRight);
            table.positioning.distanceTop = HelperMethods.convertPixelToPoint(tableWidget.positioning.distanceTop);
            if (!isNullOrUndefined(tableWidget.positioning.verticalAlignment)) {
                table.positioning.verticalAlignment = tableWidget.positioning.verticalAlignment;
            }
            if (!isNullOrUndefined(tableWidget.positioning.verticalOrigin)) {
                table.positioning.verticalOrigin = tableWidget.positioning.verticalOrigin;
            }
            table.positioning.verticalPosition = tableWidget.positioning.verticalPosition;
            if (!isNullOrUndefined(tableWidget.positioning.horizontalAlignment)) {
                table.positioning.horizontalAlignment = tableWidget.positioning.horizontalAlignment;
            }
            if (!isNullOrUndefined(tableWidget.positioning.horizontalOrigin)) {
                table.positioning.horizontalOrigin = tableWidget.positioning.horizontalOrigin;
            }
            table.positioning.horizontalPosition = tableWidget.positioning.horizontalPosition;
        }
    }
    private createRow(rowWidget: TableRowWidget): any {
        let row: any = {};
        row.cells = [];
        row.rowFormat = this.writeRowFormat(rowWidget.rowFormat);
        if (rowWidget.hasOwnProperty('contentControlProperties')) {
            row.contentControlProperties = this.contentControlProperty(rowWidget.contentControlProperties);
        }
        return row;
    }
    private createCell(cellWidget: TableCellWidget): any {
        let cell: any = {};
        cell.blocks = [];
        cell.cellFormat = this.writeCellFormat(cellWidget.cellFormat);
        cell.columnIndex = cellWidget.columnIndex;
        if (cellWidget.hasOwnProperty('contentControlProperties')) {
            cell.contentControlProperties = this.contentControlProperty(cellWidget.contentControlProperties);
        }
        return cell;
    }
    private writeShading(wShading: WShading): any {
        let shading: any = {};
        shading.backgroundColor = wShading.hasValue('backgroundColor') ? wShading.backgroundColor : undefined;
        shading.foregroundColor = wShading.hasValue('foregroundColor') ? wShading.foregroundColor : undefined;
        shading.textureStyle = wShading.hasValue('textureStyle') ? wShading.textureStyle : undefined;
        return shading;
    }
    private writeBorder(wBorder: WBorder): any {
        let border: any = {};
        border.color = wBorder.hasValue('color') ? wBorder.color : undefined;
        border.hasNoneStyle = wBorder.hasValue('hasNoneStyle') ? wBorder.hasNoneStyle : undefined;
        border.lineStyle = wBorder.hasValue('lineStyle') ? wBorder.lineStyle : undefined;
        border.lineWidth = wBorder.hasValue('lineWidth') ? wBorder.lineWidth : undefined;
        border.shadow = wBorder.hasValue('shadow') ? wBorder.shadow : undefined;
        border.space = wBorder.hasValue('space') ? wBorder.space : undefined;
        return border;
    }
    private writeBorders(wBorders: WBorders): any {
        let borders: any = {};
        borders.top = this.writeBorder(wBorders.top);
        borders.left = this.writeBorder(wBorders.left);
        borders.right = this.writeBorder(wBorders.right);
        borders.bottom = this.writeBorder(wBorders.bottom);
        borders.diagonalDown = this.writeBorder(wBorders.diagonalDown);
        borders.diagonalUp = this.writeBorder(wBorders.diagonalUp);
        borders.horizontal = this.writeBorder(wBorders.horizontal);
        borders.vertical = this.writeBorder(wBorders.vertical);
        return borders;
    }
    private writeCellFormat(wCellFormat: WCellFormat): any {
        let cellFormat: any = {};
        cellFormat.borders = this.writeBorders(wCellFormat.borders);
        cellFormat.shading = this.writeShading(wCellFormat.shading);
        cellFormat.topMargin = wCellFormat.hasValue('topMargin') ? wCellFormat.topMargin : undefined;
        cellFormat.rightMargin = wCellFormat.hasValue('rightMargin') ? wCellFormat.rightMargin : undefined;
        cellFormat.leftMargin = wCellFormat.hasValue('leftMargin') ? wCellFormat.leftMargin : undefined;
        cellFormat.bottomMargin = wCellFormat.hasValue('bottomMargin') ? wCellFormat.bottomMargin : undefined;
        cellFormat.preferredWidth = wCellFormat.hasValue('preferredWidth') ? wCellFormat.preferredWidth : undefined;
        cellFormat.preferredWidthType = wCellFormat.hasValue('preferredWidthType') ? wCellFormat.preferredWidthType : undefined;
        cellFormat.cellWidth = wCellFormat.hasValue('cellWidth') ? wCellFormat.cellWidth : undefined;
        cellFormat.columnSpan = wCellFormat.columnSpan;
        cellFormat.rowSpan = wCellFormat.rowSpan;
        cellFormat.verticalAlignment = wCellFormat.hasValue('verticalAlignment') ? wCellFormat.verticalAlignment : undefined;
        return cellFormat;
    }
    private writeRowFormat(wRowFormat: WRowFormat): any {
        let rowFormat: any = {};
        let revisionIds: any = [];
        rowFormat.height = wRowFormat.hasValue('height') ? wRowFormat.height : undefined;
        rowFormat.allowBreakAcrossPages = wRowFormat.hasValue('allowBreakAcrossPages') ? wRowFormat.allowBreakAcrossPages : undefined;
        rowFormat.heightType = wRowFormat.hasValue('heightType') ? wRowFormat.heightType : undefined;
        rowFormat.isHeader = wRowFormat.hasValue('isHeader') ? wRowFormat.isHeader : undefined;
        rowFormat.borders = this.writeBorders(wRowFormat.borders);
        rowFormat.gridBefore = wRowFormat.gridBefore;
        rowFormat.gridBeforeWidth = wRowFormat.hasValue('gridBeforeWidth') ? wRowFormat.gridBeforeWidth : undefined;
        rowFormat.gridBeforeWidthType = wRowFormat.hasValue('gridBeforeWidthType') ? wRowFormat.gridBeforeWidthType : undefined;
        rowFormat.gridAfter = wRowFormat.gridAfter;
        rowFormat.gridAfterWidth = wRowFormat.hasValue('gridAfterWidth') ? wRowFormat.gridAfterWidth : undefined;
        rowFormat.gridAfterWidthType = wRowFormat.hasValue('gridAfterWidthType') ? wRowFormat.gridAfterWidthType : undefined;
        rowFormat.leftMargin = wRowFormat.hasValue('leftMargin') ? wRowFormat.leftMargin : undefined;
        rowFormat.topMargin = wRowFormat.hasValue('topMargin') ? wRowFormat.topMargin : undefined;
        rowFormat.rightMargin = wRowFormat.hasValue('rightMargin') ? wRowFormat.rightMargin : undefined;
        rowFormat.bottomMargin = wRowFormat.hasValue('bottomMargin') ? wRowFormat.bottomMargin : undefined;
        rowFormat.leftIndent = wRowFormat.hasValue('leftIndent') ? wRowFormat.leftIndent : undefined;
        for (let j: number = 0; j < wRowFormat.revisions.length; j++) {
            rowFormat.revisionIds = this.writeRowRevisions(wRowFormat.revisions[j], revisionIds);
        }
        return rowFormat;
    }
    private writeRowRevisions(wrevisions: Revision, revisionIds: any): any {
        if (this.selectedRevisionId.indexOf(wrevisions.revisionID) === -1) {
            this.selectedRevisionId.push(wrevisions.revisionID);
        }
        revisionIds.push(wrevisions.revisionID);
        return revisionIds;
    }
    private writeTableFormat(wTableFormat: WTableFormat): any {
        let tableFormat: any = {};
        tableFormat.borders = this.writeBorders(wTableFormat.borders);
        tableFormat.shading = this.writeShading(wTableFormat.shading);
        tableFormat.cellSpacing = wTableFormat.hasValue('cellSpacing') ? wTableFormat.cellSpacing : undefined;
        tableFormat.leftIndent = wTableFormat.hasValue('leftIndent') ? wTableFormat.leftIndent : undefined;
        tableFormat.tableAlignment = wTableFormat.hasValue('tableAlignment') ? wTableFormat.tableAlignment : undefined;
        tableFormat.topMargin = wTableFormat.hasValue('topMargin') ? wTableFormat.topMargin : undefined;
        tableFormat.rightMargin = wTableFormat.hasValue('rightMargin') ? wTableFormat.rightMargin : undefined;
        tableFormat.leftMargin = wTableFormat.hasValue('leftMargin') ? wTableFormat.leftMargin : undefined;
        tableFormat.bottomMargin = wTableFormat.hasValue('bottomMargin') ? wTableFormat.bottomMargin : undefined;
        tableFormat.preferredWidth = wTableFormat.hasValue('preferredWidth') ? wTableFormat.preferredWidth : undefined;
        tableFormat.preferredWidthType = wTableFormat.hasValue('preferredWidthType') ? wTableFormat.preferredWidthType : undefined;
        tableFormat.bidi = wTableFormat.hasValue('bidi') ? wTableFormat.bidi : undefined;
        tableFormat.allowAutoFit = wTableFormat.hasValue('allowAutoFit') ? wTableFormat.allowAutoFit : undefined;
        return tableFormat;
    }
    private footnotes(documentHelper: DocumentHelper): void {
        for (let i: number = 0; i < documentHelper.footnotes.separator.length; i++) {
            this.seprators(documentHelper);
        }
    }
    private seprators(documentHelper: any): any {
        if (documentHelper.footnotes.separator.length > 0) {
            this.document.footnotes = {};
            this.document.footnotes.separator = [];
            for (let i: number = 0; i < documentHelper.footnotes.separator.length; i++) {
                this.writeBlock(documentHelper.footnotes.separator[i], 0, this.document.footnotes.separator);
            }
        }
        if (documentHelper.footnotes.continuationSeparator.length > 0) {
            this.document.footnotes.continuationSeparator = [];
            for (let i: number = 0; i < documentHelper.footnotes.continuationSeparator.length; i++) {
                this.writeBlock(documentHelper.footnotes.continuationSeparator[i], 0, this.document.footnotes.continuationSeparator);
            }
        }
        if (documentHelper.footnotes.continuationNotice.length > 0) {
            this.document.footnotes.continuationNotice = [];
            for (let i: number = 0; i < documentHelper.footnotes.continuationNotice.length; i++) {
                this.writeBlock(documentHelper.footnotes.continuationNotice[i], 0, this.document.footnotes.continuationNotice);
            }
        }
    }
    private endnotes(documentHelper: DocumentHelper): void {
        for (let i: number = 0; i < this.documentHelper.endnotes.separator.length; i++) {
            this.endnoteSeparator(documentHelper);
        }
    }
    private endnoteSeparator(documentHelper: DocumentHelper): void {
        if (documentHelper.endnotes.separator.length > 0) {
            this.document.endnotes = {};
            this.document.endnotes.separator = [];
            for (let i: number = 0; i < documentHelper.endnotes.separator.length; i++) {
                this.writeBlock(documentHelper.endnotes.separator[i], 0, this.document.endnotes.separator);
            }
        }
        if (documentHelper.endnotes.continuationSeparator.length > 0) {
            this.document.endnotes.continuationSeparator = [];
            for (let i: number = 0; i < documentHelper.endnotes.continuationSeparator.length; i++) {
                this.writeBlock(documentHelper.endnotes.continuationSeparator[i], 0, this.document.endnotes.continuationSeparator);
            }
        }
        if (documentHelper.endnotes.continuationNotice.length > 0) {
            this.document.endnotes.continuationNotice = [];
            for (let i: number = 0; i < documentHelper.endnotes.continuationNotice.length; i++) {
                this.writeBlock(documentHelper.endnotes.continuationNotice[i], 0, this.document.endnotes.continuationNotice);
            }
        }
    }
    private writeStyles(documentHelper: DocumentHelper): void {
        let styles: Object[] = [];
        this.document.styles = [];
        for (let i: number = 0; i < documentHelper.styles.length; i++) {
            this.document.styles.push(this.writeStyle(documentHelper.styles.getItem(i) as WStyle));
        }
    }
    private writeStyle(style: WStyle): any {
        let wStyle: any = {};
        wStyle.name = style.name;
        if (style.type === 'Paragraph') {
            wStyle.type = 'Paragraph';
            wStyle.paragraphFormat = this.writeParagraphFormat((style as any).paragraphFormat);
            wStyle.characterFormat = this.writeCharacterFormat((style as any).characterFormat);
        }
        if (style.type === 'Character') {
            wStyle.type = 'Character';
            wStyle.characterFormat = this.writeCharacterFormat((style as any).characterFormat);
        }
        if (!isNullOrUndefined(style.basedOn)) {
            wStyle.basedOn = style.basedOn.name;
        }
        if (!isNullOrUndefined(style.link)) {
            wStyle.link = style.link.name;
        }
        if (!isNullOrUndefined(style.next)) {
            wStyle.next = style.next.name;
        }
        return wStyle;
    }
    public writeRevisions(documentHelper: DocumentHelper): void {
        this.document.revisions = [];
        for (let i: number = 0; i < documentHelper.owner.revisions.changes.length; i++) {
            if (this.isExport ||
                (!this.isExport && this.selectedRevisionId.indexOf(documentHelper.owner.revisions.changes[i].revisionID) !== -1)) {
                this.document.revisions.push(this.writeRevision(documentHelper.owner.revisions.changes[i]));
            }
        }
    }
    private writeRevision(revisions: Revision): any {
        let revision: any = {};
        revision.author = revisions.author;
        revision.date = revisions.date;
        revision.revisionType = revisions.revisionType;
        revision.revisionId = revisions.revisionID;
        return revision;
    }
    public writeComments(documentHelper: DocumentHelper): void {
        this.document.comments = [];

        for (let i: number = 0; i < documentHelper.comments.length; i++) {
            if (this.isExport ||
                (!this.isExport && this.selectedCommentsId.indexOf(this.documentHelper.comments[i].commentId) !== -1)) {
                this.document.comments.push(this.writeComment(this.documentHelper.comments[i]));
            }
        }
    }
    public writeCustomXml(documentHelper: DocumentHelper): void {
        this.document.customXml = [];
        for (let i: number = 0; i < documentHelper.customXmlData.length; i++) {
            let customXml: any = {};
            let key: string = documentHelper.customXmlData.keys[i];
            customXml.itemID = key;
            let xmlValue: string = this.documentHelper.customXmlData.get(key);
            customXml.xml = xmlValue;
            this.document.customXml.push(customXml);
        }
    }
    private writeComment(comments: CommentElementBox): any {
        let comment: any = {};
        comment.commentId = comments.commentId;
        comment.author = comments.author;
        comment.date = comments.date;
        comment.blocks = [];
        comment.blocks.push(this.commentInlines(comments.text));
        comment.done = comments.isResolved;
        comment.replyComments = [];
        for (let i: number = 0; i < comments.replyComments.length; i++) {
            comment.replyComments.push(this.writeComment(comments.replyComments[i]));
        }
        return comment;
    }
    private commentInlines(ctext: string): any {
        let blocks: any = {};
        blocks.inlines = [{ text: ctext }];
        return blocks;
    }

    private writeLists(documentHelper: DocumentHelper): void {
        let abstractLists: number[] = [];
        this.document.lists = [];
        for (let i: number = 0; i < documentHelper.lists.length; i++) {
            let list: WList = documentHelper.lists[i];
            if (this.lists.indexOf(list.listId) > -1) {
                this.document.lists.push(this.writeList(list));
                if (abstractLists.indexOf(list.abstractListId) < 0) {
                    abstractLists.push(list.abstractListId);
                }
            }
        }
        this.document.abstractLists = [];
        for (let i: number = 0; i < documentHelper.abstractLists.length; i++) {
            let abstractList: WAbstractList = documentHelper.abstractLists[i];
            if (abstractLists.indexOf(abstractList.abstractListId) > -1) {
                this.document.abstractLists.push(this.writeAbstractList(abstractList));
            }
        }
    }
    private writeAbstractList(wAbstractList: WAbstractList): any {
        let abstractList: any = {};
        abstractList.abstractListId = wAbstractList.abstractListId;
        abstractList.levels = [];
        for (let i: number = 0; i < wAbstractList.levels.length; i++) {
            abstractList.levels[i] = this.writeListLevel(wAbstractList.levels[i]);
        }
        return abstractList;
    }
    private writeList(wList: WList): any {
        let list: any = {};
        list.abstractListId = wList.abstractListId;
        list.levelOverrides = [];
        for (let i: number = 0; i < wList.levelOverrides.length; i++) {
            list.levelOverrides.push(this.writeLevelOverrides(wList.levelOverrides[i]));
        }
        list.listId = wList.listId;
        return list;
    }
    private writeLevelOverrides(wlevel: WLevelOverride): any {
        let levelOverrides: any = {};
        levelOverrides.levelNumber = wlevel.levelNumber;
        if (wlevel.overrideListLevel) {
            levelOverrides.overrideListLevel = this.writeListLevel(wlevel.overrideListLevel);
        }
        levelOverrides.startAt = wlevel.startAt;
        return levelOverrides;
    }
    private writeListLevel(wListLevel: WListLevel): any {
        let listLevel: any = {};

        listLevel.characterFormat = this.writeCharacterFormat(wListLevel.characterFormat);
        listLevel.paragraphFormat = this.writeParagraphFormat(wListLevel.paragraphFormat);

        listLevel.followCharacter = wListLevel.followCharacter;
        listLevel.listLevelPattern = wListLevel.listLevelPattern;
        listLevel.numberFormat = wListLevel.numberFormat;
        listLevel.restartLevel = wListLevel.restartLevel;
        listLevel.startAt = wListLevel.startAt;

        return listLevel;
    }
    private getParentBlock(widget: BlockWidget): BlockWidget {
        if (widget.isInsideTable) {
            widget = this.owner.documentHelper.layout.getParentTable(widget);
        }
        return widget;
    }
    /** 
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.lists = undefined;
        this.endLine = undefined;
        this.startLine = undefined;
        this.endOffset = undefined;
        this.documentHelper = undefined;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
}