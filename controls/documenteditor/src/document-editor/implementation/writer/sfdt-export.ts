import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WTabStop, WParagraphFormat } from '../format/paragraph-format';
import { WCellFormat, WTableFormat, WRowFormat, WStyle, WListFormat, WCharacterFormat } from '../format/index';
import { WBorder, WBorders, WShading } from '../format/index';
import { LayoutViewer } from '../index';
import {
    IWidget, LineWidget, ParagraphWidget, BlockContainer, BodyWidget, TextElementBox, Page, ElementBox, FieldElementBox,
    TableWidget, TableRowWidget, TableCellWidget, ImageElementBox, HeaderFooterWidget, HeaderFooters, ListTextElementBox, BookmarkElementBox
} from '../viewer/page';
import { BlockWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
/**
 * Exports the document to Sfdt format.
 */
export class SfdtExport {
    /* tslint:disable:no-any */
    private endLine: LineWidget = undefined;
    private endOffset: number = undefined;
    private endCell: TableCellWidget = undefined;
    private startColumnIndex: number = undefined;
    private endColumnIndex: number = undefined;
    private lists: number[] = undefined;
    private viewer: LayoutViewer = undefined;
    private document: any = undefined;
    private writeInlineStyles: boolean = undefined;
    /** 
     * @private
     */
    constructor(owner: LayoutViewer) {
        this.viewer = owner;
    }
    private getModuleName(): string {
        return 'SfdtExport';
    }
    private clear(): void {
        this.writeInlineStyles = undefined;
        this.endLine = undefined;
        this.lists = undefined;
        this.document = undefined;
    }
    /**
     * Serialize the data as Syncfusion document text.
     * @private
     */
    public serialize(): string {
        return JSON.stringify(this.write());
    }
    /**
     * @private
     */
    public saveAsBlob(viewer: LayoutViewer): Promise<Blob> {
        let streamWriter: StreamWriter = new StreamWriter();
        streamWriter.write(this.serialize());
        let blob: Blob = streamWriter.buffer;
        streamWriter.destroy();
        let promise: Promise<Blob>;
        return new Promise((resolve: Function, reject: Function) => {
            resolve(blob);
        });
    }
    // tslint:disable-next-line:max-line-length
    /** 
     * @private
     */
    public write(line?: LineWidget, startOffset?: number, endLine?: LineWidget, endOffset?: number, writeInlineStyles?: boolean): any {
        if (writeInlineStyles) {
            this.writeInlineStyles = true;
        }
        this.lists = [];
        this.document = {};
        this.document.sections = [];
        this.document.characterFormat = this.writeCharacterFormat(this.viewer.characterFormat);
        this.document.paragraphFormat = this.writeParagraphFormat(this.viewer.paragraphFormat);
        if (line instanceof LineWidget && endLine instanceof LineWidget) {
            // For selection
            let startPara: ParagraphWidget = line.paragraph;
            let endPara: ParagraphWidget = endLine.paragraph;

            let startCell: TableCellWidget = startPara.associatedCell;
            let endCell: TableCellWidget = endPara.associatedCell;
            // Creates section
            let bodyWidget: BlockContainer = startPara.bodyWidget as BlockContainer;
            let section: any = this.createSection(line.paragraph.bodyWidget as BlockContainer);
            this.document.sections.push(section);

            if (startCell === endCell || isNullOrUndefined(endCell)) {
                this.endLine = endLine;
                this.endOffset = endOffset;
            } else {
                // Todo: Handle nested table cases
                if (startCell instanceof TableCellWidget) {
                    let startTable: TableWidget = startCell.getContainerTable();
                    let endTable: TableWidget = endCell.getContainerTable();
                    if (startTable.tableFormat === endTable.tableFormat) {
                        this.endCell = endCell;
                        this.endColumnIndex = this.endCell.columnIndex + this.endCell.cellFormat.columnSpan;
                        this.startColumnIndex = startCell.columnIndex;
                    }
                } else {
                    this.endCell = endCell;
                }
            }
            if (startCell === endCell || isNullOrUndefined(startCell)) {
                let paragraph: any = this.createParagraph(line.paragraph);
                section.blocks.push(paragraph);
                if (!this.writeParagraph(line.paragraph, paragraph, section.blocks, line.indexInOwner, startOffset)) {
                    // Todo:continue in next section
                }
            } else {
                let table: any = this.createTable(startCell.ownerTable);
                section.blocks.push(table);
                this.writeTable(startCell.ownerTable, table, startCell.ownerRow.indexInOwner, section.blocks);
            }
        } else {
            if (this.viewer.pages.length > 0) {
                let page: Page = this.viewer.pages[0];
                if (page.bodyWidgets.length > 0) {
                    this.writeBodyWidget(page.bodyWidgets[0], 0);
                }
            }
        }
        this.writeStyles(this.viewer);
        this.writeLists(this.viewer);
        let doc: Document = this.document;
        this.clear();
        return doc;
    }
    private writeBodyWidget(bodyWidget: BodyWidget, index: number): boolean {
        if (!(bodyWidget instanceof BodyWidget)) {
            return true;
        }
        let section: any = this.createSection(bodyWidget);
        this.document.sections.push(section);
        this.writeHeaderFooters(this.viewer.headersFooters[bodyWidget.index], section);
        if (this.writeBlock(bodyWidget.childWidgets[index] as BlockWidget, 0, section.blocks)) {
            return true;
        }
        let next: BodyWidget = bodyWidget;
        do {
            bodyWidget = next;
            next = next.nextRenderedWidget as BodyWidget;
        } while (next instanceof BodyWidget && next.index === bodyWidget.index);
        return this.writeBodyWidget(next, index);
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
        if (isNullOrUndefined(widget)) {
            return undefined;
        }
        let headerFooter: any = {};
        if (widget && widget.childWidgets && widget.childWidgets.length > 0) {
            headerFooter.blocks = [];
            this.writeBlock(widget.firstChild as BlockWidget, 0, headerFooter.blocks);
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
        section.blocks = [];
        section.headersFooters = {};
        return section;
    }
    private writeBlock(widget: BlockWidget, index: number, blocks: any): boolean {
        if (!(widget instanceof BlockWidget)) {
            return true;
        }
        if (widget instanceof ParagraphWidget) {
            let paragraph: any = this.createParagraph(widget);
            blocks.push(paragraph);
            if (this.writeParagraph(widget, paragraph, blocks)) {
                return true;
            }
        } else {
            let tableWidget: TableWidget = widget as TableWidget;
            let table: any = this.createTable(tableWidget);
            blocks.push(table);
            if (this.writeTable(tableWidget, table, 0, blocks)) {
                return true;
            }
        }
        return false;
    }
    private writeNextBlock(widget: BlockWidget, blocks: any): boolean {
        let next: BlockWidget = widget.nextRenderedWidget as BlockWidget;
        if (next instanceof BlockWidget && next.containerWidget.index === widget.containerWidget.index) {
            return this.writeBlock(widget.nextRenderedWidget as BlockWidget, 0, blocks);
        }
        return false;
    }
    private writeParagraph(paragraphWidget: ParagraphWidget, paragraph: any, blocks: any, lineIndex?: number, start?: number): boolean {
        if (isNullOrUndefined(lineIndex)) {
            lineIndex = 0;
        }
        if (isNullOrUndefined(start)) {
            start = 0;
        }
        let next: ParagraphWidget = paragraphWidget;
        while (next instanceof ParagraphWidget) {
            if (this.writeLines(next, lineIndex, start, paragraph.inlines)) {
                return true;
            }
            lineIndex = 0;
            start = 0;
            paragraphWidget = next;
            next = paragraphWidget.nextSplitWidget as ParagraphWidget;
        }
        return this.writeNextBlock(paragraphWidget, blocks);
    }
    private writeInlines(line: LineWidget, inlines: any): void {
        for (let i: number = 0; i < line.children.length; i++) {
            let element: ElementBox = line.children[i];
            if (element instanceof ListTextElementBox) {
                continue;
            }
            let inline: any = this.writeInline(element);
            if (!isNullOrUndefined(inline)) {
                inlines.push(inline);
            }
        }
    }
    private writeInline(element: ElementBox): any {
        let inline: any = {};
        inline.characterFormat = this.writeCharacterFormat(element.characterFormat);
        if (element instanceof FieldElementBox) {
            inline.fieldType = element.fieldType;
        } else if (element instanceof ImageElementBox) {
            inline.imageString = element.imageString;
            inline.width = HelperMethods.convertPixelToPoint(element.width);
            inline.height = HelperMethods.convertPixelToPoint(element.height);
        } else if (element instanceof BookmarkElementBox) {
            inline.bookmarkType = element.bookmarkType;
            inline.name = element.name;
        } else if (element instanceof TextElementBox) {
            inline.text = element.text;
        } else {
            inline = undefined;
        }
        return inline;
    }
    private writeLines(paragraph: ParagraphWidget, lineIndex: number, offset: number, inlines: any): boolean {
        let startIndex: number = lineIndex;
        let endParagraph: boolean = this.endLine instanceof LineWidget && this.endLine.paragraph === paragraph;
        let endIndex: number = endParagraph ? this.endLine.indexInOwner : paragraph.childWidgets.length - 1;
        for (let i: number = startIndex; i <= endIndex; i++) {
            let child: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (this.endLine === child || (lineIndex === i && offset !== 0)) {
                this.writeLine(child, offset, inlines);
            } else {
                this.writeInlines(child, inlines);
            }
        }
        return endParagraph;
    }
    private writeLine(line: LineWidget, offset: number, inlines: any): void {
        let isEnd: boolean = line === this.endLine;
        let started: boolean = false;
        let ended: boolean = false;
        let length: number = 0;
        for (let j: number = 0; j < line.children.length; j++) {
            let element: ElementBox = line.children[j];
            if (element instanceof ListTextElementBox) {
                continue;
            }
            let inline: any = undefined;
            length += element.length;
            started = length > offset;
            ended = isEnd && length >= this.endOffset;
            if (!started) {
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
    private createParagraph(paragraphWidget: ParagraphWidget): any {
        let paragraph: any = {};
        paragraph.paragraphFormat = this.writeParagraphFormat(paragraphWidget.paragraphFormat);
        paragraph.characterFormat = this.writeCharacterFormat(paragraphWidget.characterFormat);
        paragraph.inlines = [];
        return paragraph;
    }
    /**
     * @private
     */
    public writeCharacterFormat(format: WCharacterFormat, isInline?: boolean): any {
        let characterFormat: any = {};
        HelperMethods.writeCharacterFormat(characterFormat, isInline, format);
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
        if (!isNullOrUndefined(listIdValue) && listIdValue > -1) {
            listFormat.listId = listIdValue;
            listFormat.listLevelNumber = format.getValue('listLevelNumber');
            if (this.lists.indexOf(format.listId) < 0) {
                this.lists.push(format.listId);
            }
        }
        return listFormat;
    }
    private writeTable(tableWidget: TableWidget, table: any, index: number, blocks: any): boolean {
        let widget: IWidget = tableWidget.childWidgets[index];
        if (widget instanceof TableRowWidget) {
            if (this.writeRow(widget, table.rows)) {
                return true;
            }
        }
        let next: TableWidget = tableWidget;
        do {
            tableWidget = next as TableWidget;
            next = tableWidget.nextSplitWidget as TableWidget;
        } while (next instanceof BlockWidget);
        return this.writeNextBlock(tableWidget, blocks);
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
        } while (next instanceof TableRowWidget && next.index === rowWidget.index);
        return this.writeRow(next, rows);
    }
    private writeCell(cellWidget: TableCellWidget, cells: any): boolean {
        let cell: any = this.createCell(cellWidget);
        cells.push(cell);
        if (this.writeBlock(cellWidget.firstChild as BlockWidget, 0, cell.blocks)) {
            return true;
        }
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
        return table;
    }
    private createRow(rowWidget: TableRowWidget): any {
        let row: any = {};
        row.cells = [];
        row.rowFormat = this.writeRowFormat(rowWidget.rowFormat);
        return row;
    }
    private createCell(cellWidget: TableCellWidget): any {
        let cell: any = {};
        cell.blocks = [];
        cell.cellFormat = this.writeCellFormat(cellWidget.cellFormat);
        cell.columnIndex = cellWidget.columnIndex;
        return cell;
    }
    private writeShading(wShading: WShading): any {
        let shading: any = {};
        shading.backgroundColor = wShading.backgroundColor;
        shading.foregroundColor = wShading.foregroundColor;
        shading.textureStyle = wShading.textureStyle;
        return shading;
    }
    private writeBorder(wBorder: WBorder): any {
        let border: any = {};
        border.color = wBorder.color;
        border.hasNoneStyle = wBorder.hasNoneStyle;
        border.lineStyle = wBorder.lineStyle;
        border.lineWidth = wBorder.lineWidth;
        border.shadow = wBorder.shadow;
        border.space = wBorder.space;
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
        cellFormat.topMargin = wCellFormat.topMargin;
        cellFormat.rightMargin = wCellFormat.rightMargin;
        cellFormat.leftMargin = wCellFormat.leftMargin;
        cellFormat.bottomMargin = wCellFormat.bottomMargin;
        cellFormat.preferredWidth = wCellFormat.preferredWidth;
        cellFormat.preferredWidthType = wCellFormat.preferredWidthType;
        cellFormat.cellWidth = wCellFormat.cellWidth;
        cellFormat.columnSpan = wCellFormat.columnSpan;
        cellFormat.rowSpan = wCellFormat.rowSpan;
        cellFormat.verticalAlignment = wCellFormat.verticalAlignment;
        return cellFormat;
    }
    private writeRowFormat(wRowFormat: WRowFormat): any {
        let rowFormat: any = {};
        rowFormat.height = wRowFormat.height;
        rowFormat.allowBreakAcrossPages = wRowFormat.allowBreakAcrossPages;
        rowFormat.heightType = wRowFormat.heightType;
        rowFormat.isHeader = wRowFormat.isHeader;
        rowFormat.borders = this.writeBorders(wRowFormat.borders);
        rowFormat.gridBefore = wRowFormat.gridBefore;
        rowFormat.gridBeforeWidth = wRowFormat.gridBeforeWidth;
        rowFormat.gridBeforeWidthType = wRowFormat.gridBeforeWidthType;
        rowFormat.gridAfter = wRowFormat.gridAfter;
        rowFormat.gridAfterWidth = wRowFormat.gridAfterWidth;
        rowFormat.gridAfterWidthType = wRowFormat.gridAfterWidthType;
        return rowFormat;
    }
    private writeTableFormat(wTableFormat: WTableFormat): any {
        let tableFormat: any = {};
        tableFormat.borders = this.writeBorders(wTableFormat.borders);
        tableFormat.shading = this.writeShading(wTableFormat.shading);
        tableFormat.cellSpacing = wTableFormat.cellSpacing;
        tableFormat.leftIndent = wTableFormat.leftIndent;
        tableFormat.tableAlignment = wTableFormat.tableAlignment;
        tableFormat.topMargin = wTableFormat.topMargin;
        tableFormat.rightMargin = wTableFormat.rightMargin;
        tableFormat.leftMargin = wTableFormat.leftMargin;
        tableFormat.bottomMargin = wTableFormat.bottomMargin;
        tableFormat.preferredWidth = wTableFormat.preferredWidth;
        tableFormat.preferredWidthType = wTableFormat.preferredWidthType;
        return tableFormat;
    }
    private writeStyles(viewer: LayoutViewer): void {
        let styles: Object[] = [];
        this.document.styles = [];
        for (let i: number = 0; i < viewer.styles.length; i++) {
            this.document.styles.push(this.writeStyle(viewer.styles.getItem(i) as WStyle));
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
    private writeLists(viewer: LayoutViewer): void {
        let abstractLists: number[] = [];
        this.document.lists = [];
        for (let i: number = 0; i < viewer.lists.length; i++) {
            let list: WList = viewer.lists[i];
            if (this.lists.indexOf(list.listId) > -1) {
                this.document.lists.push(this.writeList(list));
                if (abstractLists.indexOf(list.abstractListId) < 0) {
                    abstractLists.push(list.abstractListId);
                }
            }
        }
        this.document.abstractLists = [];
        for (let i: number = 0; i < viewer.abstractLists.length; i++) {
            let abstractList: WAbstractList = viewer.abstractLists[i];
            if (this.lists.indexOf(abstractList.abstractListId) > -1) {
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
        //list.levelOverrides = wList.levelOverrides;
        list.listId = wList.listId;
        return list;
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
    /** 
     * @private
     */
    public destroy(): void {
        this.lists = undefined;
        this.endLine = undefined;
        this.endOffset = undefined;
        this.viewer = undefined;
    }
    /* tslint:enable:no-any */
}