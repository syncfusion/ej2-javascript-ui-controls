import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { WAbstractList } from '../list/abstract-list';
import { WLevelOverride } from '../list/level-override';
import { WCharacterFormat, WListFormat, WParagraphFormat, WCellFormat, WTableFormat, WSectionFormat, WRowFormat } from '../format/index';
import { WBorder, WBorders, WShading, WCharacterStyle, WParagraphStyle, WStyles, WStyle, WTabStop } from '../format/index';
import { LayoutViewer } from './viewer';
import {
    Widget, LineWidget, ParagraphWidget, ImageElementBox, BodyWidget, TextElementBox, TableCellWidget,
    TableRowWidget, TableWidget, FieldElementBox, BlockWidget, HeaderFooterWidget, HeaderFooters,
    BookmarkElementBox, FieldTextElementBox, TabElementBox
} from './page';
import { HelperMethods } from '../editor/editor-helper';
/** 
 * @private
 */
export class SfdtReader {
    /* tslint:disable:no-any */
    private viewer: LayoutViewer = undefined;
    private fieldSeparator: FieldElementBox;
    private get isPasting(): boolean {
        return this.viewer && this.viewer.owner.isPastingContent;
    }
    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
    }
    /**
     * @private
     * @param json 
     */
    public convertJsonToDocument(json: string): BodyWidget[] {
        let sections: BodyWidget[] = [];
        let jsonObject: any = JSON.parse(json);
        this.parseCharacterFormat(jsonObject.characterFormat, this.viewer.characterFormat);
        this.parseParagraphFormat(jsonObject.paragraphFormat, this.viewer.paragraphFormat);
        if (!isNullOrUndefined(jsonObject.background)) {
            this.viewer.backgroundColor = this.getColor(jsonObject.background.color);
        }
        if (!isNullOrUndefined(jsonObject.abstractLists)) {
            this.parseAbstractList(jsonObject, this.viewer.abstractLists);
        }
        if (!isNullOrUndefined(jsonObject.lists)) {
            this.parseList(jsonObject, this.viewer.lists);
        }
        if (!isNullOrUndefined(jsonObject.styles)) {
            this.parseStyles(jsonObject, this.viewer.styles);
        }
        if (!isNullOrUndefined(jsonObject.sections)) {
            this.parseSections(jsonObject.sections, sections);
        }
        return sections;
    }
    private parseStyles(data: any, styles: WStyles): void {
        for (let i: number = 0; i < data.styles.length; i++) {
            if (isNullOrUndefined(this.viewer.styles.findByName(data.styles[i].name))) {
                this.parseStyle(data, data.styles[i], styles);
            }
        }
    }
    public parseStyle(data: any, style: any, styles: WStyles): void {
        let wStyle: any;
        if (!isNullOrUndefined(style.type)) {
            if (style.type === 'Paragraph') {
                wStyle = new WParagraphStyle();
                wStyle.type = 'Paragraph';
            }
            if (style.type === 'Character') {
                wStyle = new WCharacterStyle();
                wStyle.type = 'Character';
            }
            if (!isNullOrUndefined(style.name)) {
                wStyle.name = style.name;
            }
            styles.push(wStyle);
            if (!isNullOrUndefined(style.basedOn)) {
                let basedOn: Object = styles.findByName(style.basedOn);
                if (!isNullOrUndefined(basedOn)) {
                    if ((basedOn as WStyle).type === wStyle.type) {
                        wStyle.basedOn = basedOn;
                    }
                } else {
                    let basedStyle: any = this.getStyle(style.basedOn, data);
                    let styleString: any;
                    if (!isNullOrUndefined(basedStyle) && basedStyle.type === wStyle.type) {
                        styleString = basedStyle;
                    } else {
                        if (wStyle.type === 'Paragraph') {
                            styleString = JSON.parse('{"type":"Paragraph","name":"Normal","next":"Normal"}');
                        } else {
                            styleString = JSON.parse('{"type": "Character","name": "Default Paragraph Font"}');
                        }
                    }
                    this.parseStyle(data, styleString, styles);
                    wStyle.basedOn = styles.findByName(styleString.name);
                }
            }
            if (!isNullOrUndefined(style.link)) {
                let link: Object = styles.findByName(style.link);
                let linkStyle: any = this.getStyle(style.link, data);
                let styleString: any;
                if (isNullOrUndefined(link)) {
                    if (isNullOrUndefined(linkStyle)) {
                        //Construct the CharacterStyle string
                        let charaStyle: any = {};
                        charaStyle.characterFormat = style.characterFormat;
                        charaStyle.name = style.name + ' Char';
                        charaStyle.type = 'Character';
                        //TODO: Implement basedOn
                        charaStyle.basedOn = style.basedOn === 'Normal' ? 'Default Paragraph Font' : (style.basedOn + ' Char');
                        styleString = charaStyle;
                    } else {
                        styleString = linkStyle;
                    }
                    this.parseStyle(data, styleString, styles);
                    wStyle.link = isNullOrUndefined(styles.findByName(styleString.name)) ? style.link : styles.findByName(styleString.name);
                } else {
                    wStyle.link = link;
                }

            }
            if (!isNullOrUndefined(style.characterFormat)) {
                this.parseCharacterFormat(style.characterFormat, wStyle.characterFormat);
            }
            if (!isNullOrUndefined(style.paragraphFormat)) {
                this.parseParagraphFormat(style.paragraphFormat, wStyle.paragraphFormat);
            }
            if (!isNullOrUndefined(style.next)) {
                if (style.next === style.name) {
                    wStyle.next = wStyle;
                } else {
                    let next: Object = styles.findByName(style.next);
                    if (!isNullOrUndefined(next) && (next as WStyle).type === wStyle.type) {
                        wStyle.next = next;
                    } else {
                        let nextStyleString: any = this.getStyle(style.next, data);
                        if (!isNullOrUndefined(nextStyleString)) {
                            this.parseStyle(data, nextStyleString, styles);
                            wStyle.next = styles.findByName(nextStyleString.name);
                        } else {
                            wStyle.next = wStyle;
                        }
                    }
                }
            }
        }
    }
    private getStyle(name: string, data: any): any {
        for (let i: number = 0; i < data.styles.length; i++) {
            if (data.styles[i].name === name) {
                return data.styles[i];
            }
        }
        return undefined;
    }
    private parseAbstractList(data: any, abstractLists: WAbstractList[]): void {
        for (let i: number = 0; i < data.abstractLists.length; i++) {
            let abstractList: WAbstractList = new WAbstractList();
            let abstract: any = data.abstractLists[i];
            abstractLists.push(abstractList);
            if (!isNullOrUndefined(abstract)) {
                if (!isNullOrUndefined(abstract.abstractListId)) {
                    abstractList.abstractListId = abstract.abstractListId;
                }
                if (!isNullOrUndefined(abstract.levels)) {
                    for (let j: number = 0; j < abstract.levels.length; j++) {
                        let level: any = abstract.levels[j];
                        if (!isNullOrUndefined(level)) {
                            let listLevel: WListLevel = this.parseListLevel(level, abstractList);
                            abstractList.levels.push(listLevel);
                        }
                    }
                }
            }
        }
    }
    private parseListLevel(data: any, owner: any): WListLevel {
        let listLevel: WListLevel = new WListLevel(owner);
        if (data.listLevelPattern === 'Bullet') {
            listLevel.listLevelPattern = 'Bullet';
            listLevel.numberFormat = !isNullOrUndefined(data.numberFormat) ? data.numberFormat : '';
        } else {
            listLevel.listLevelPattern = data.listLevelPattern;
            listLevel.startAt = data.startAt;
            listLevel.numberFormat = !isNullOrUndefined(data.numberFormat) ? data.numberFormat : '';
            if (data.restartLevel >= 0) {
                listLevel.restartLevel = data.restartLevel;
            } else {
                listLevel.restartLevel = data.levelNumber;
            }
        }
        listLevel.followCharacter = data.followCharacter;
        this.parseCharacterFormat(data.characterFormat, listLevel.characterFormat);
        this.parseParagraphFormat(data.paragraphFormat, listLevel.paragraphFormat);
        return listLevel;
    }
    private parseList(data: any, listCollection: WList[]): void {
        for (let i: number = 0; i < data.lists.length; i++) {
            let list: WList = new WList();
            let lists: any = data.lists[i];
            if (!isNullOrUndefined(lists.abstractListId)) {
                list.abstractListId = lists.abstractListId;
                list.abstractList = this.viewer.getAbstractListById(lists.abstractListId);
            }
            listCollection.push(list);
            if (!isNullOrUndefined(lists.listId)) {
                list.listId = lists.listId;
            }
            if (lists.hasOwnProperty('levelOverrides')) {
                this.parseLevelOverride(lists.levelOverrides, list);
            }
        }
    }
    private parseLevelOverride(data: any, list: WList): void {
        if (isNullOrUndefined(data)) {
            return;
        }
        for (let i: number = 0; i < data.length; i++) {
            let levelOverrides: WLevelOverride = new WLevelOverride();
            let levelOverride: any = data[i];
            levelOverrides.startAt = levelOverride.startAt;
            levelOverrides.levelNumber = levelOverride.levelNumber;
            if (!isNullOrUndefined(levelOverride.overrideListLevel)) {
                levelOverrides.overrideListLevel = this.parseListLevel(levelOverride.overrideListLevel, levelOverrides);
            }
            list.levelOverrides.push(levelOverrides);
        }
    }
    private parseSections(data: any, sections: BodyWidget[]): void {
        for (let i: number = 0; i < data.length; i++) {
            let section: BodyWidget = new BodyWidget();
            section.sectionFormat = new WSectionFormat(section);
            section.index = i;
            let item: any = data[i];
            if (!isNullOrUndefined(item.sectionFormat)) {
                this.parseSectionFormat(item.sectionFormat, section.sectionFormat);
            }
            if (isNullOrUndefined(item.headersFooters)) {
                item.headersFooters = {};
            }
            this.viewer.headersFooters.push(this.parseHeaderFooter(item.headersFooters, this.viewer.headersFooters));
            this.parseTextBody(item.blocks, section);
            for (let i: number = 0; i < section.childWidgets.length; i++) {
                (section.childWidgets[i] as BlockWidget).containerWidget = section;
            }
            sections.push(section);
        }
    }
    /**
     * @private
     */
    public parseHeaderFooter(data: any, headersFooters: any): HeaderFooters {
        let hfs: HeaderFooters = {};
        if (!isNullOrUndefined(data.header)) {
            let oddHeader: HeaderFooterWidget = new HeaderFooterWidget('OddHeader');
            hfs[0] = oddHeader;
            this.parseTextBody(data.header.blocks, oddHeader);
        }
        if (!isNullOrUndefined(data.footer)) {
            let oddFooter: HeaderFooterWidget = new HeaderFooterWidget('OddFooter');
            hfs[1] = oddFooter;
            this.parseTextBody(data.footer.blocks, oddFooter);
        }
        if (!isNullOrUndefined(data.evenHeader)) {
            let evenHeader: HeaderFooterWidget = new HeaderFooterWidget('EvenHeader');
            hfs[2] = evenHeader;
            this.parseTextBody(data.evenHeader.blocks, evenHeader);
        }
        if (!isNullOrUndefined(data.evenFooter)) {
            let evenFooter: HeaderFooterWidget = new HeaderFooterWidget('EvenFooter');
            hfs[3] = evenFooter;
            this.parseTextBody(data.evenFooter.blocks, evenFooter);
        }
        if (!isNullOrUndefined(data.firstPageHeader)) {
            let firstPageHeader: HeaderFooterWidget = new HeaderFooterWidget('FirstPageHeader');
            hfs[4] = firstPageHeader;
            this.parseTextBody(data.firstPageHeader.blocks, firstPageHeader);
        }
        if (!isNullOrUndefined(data.firstPageFooter)) {
            let firstPageFooter: HeaderFooterWidget = new HeaderFooterWidget('FirstPageFooter');
            hfs[5] = firstPageFooter;
            this.parseTextBody(data.firstPageFooter.blocks, firstPageFooter);
        }
        return hfs;
    }
    private parseTextBody(data: any, section: Widget): void {
        this.parseBody(data, section.childWidgets as BlockWidget[], section);
    }
    public parseBody(data: any, blocks: BlockWidget[], container?: Widget): void {
        if (!isNullOrUndefined(data)) {
            for (let i: number = 0; i < data.length; i++) {
                let block: any = data[i];
                if (block.hasOwnProperty('inlines')) {
                    let writeInlineFormat: boolean = false;
                    //writeInlineFormat = this.isPasting && i === data.length - 1;
                    let paragraph: ParagraphWidget = new ParagraphWidget();
                    paragraph.characterFormat = new WCharacterFormat(paragraph);
                    paragraph.paragraphFormat = new WParagraphFormat(paragraph);
                    this.parseCharacterFormat(block.characterFormat, paragraph.characterFormat);
                    this.parseParagraphFormat(block.paragraphFormat, paragraph.paragraphFormat);
                    let styleObj: Object;
                    if (!isNullOrUndefined(block.paragraphFormat) && !isNullOrUndefined(block.paragraphFormat.styleName)) {
                        styleObj = this.viewer.styles.findByName(block.paragraphFormat.styleName, 'Paragraph');
                        if (!isNullOrUndefined(styleObj)) {
                            paragraph.paragraphFormat.ApplyStyle(styleObj as WStyle);
                        }
                    }
                    if (block.inlines.length > 0) {
                        this.parseParagraph(block.inlines, paragraph, writeInlineFormat);
                    }
                    blocks.push(paragraph);
                    paragraph.index = i;
                    paragraph.containerWidget = container;
                } else if (block.hasOwnProperty('rows')) {
                    this.parseTable(block, blocks, i, container);
                }
            }
        }
    }
    private parseTable(block: any, blocks: BlockWidget[], index: number, section: Widget): void {
        let table: TableWidget = new TableWidget();
        table.index = index;
        table.tableFormat = new WTableFormat(table);
        if (!isNullOrUndefined(block.tableFormat)) {
            this.parseTableFormat(block.tableFormat, table.tableFormat);
        }
        table.title = block.title;
        table.description = block.description;
        for (let i: number = 0; i < block.rows.length; i++) {
            let row: TableRowWidget = new TableRowWidget();
            row.rowFormat = new WRowFormat(row);
            let tableRow: any = block.rows[i];
            if (tableRow.hasOwnProperty('rowFormat')) {
                this.parseRowFormat(tableRow.rowFormat, row.rowFormat);
                this.parseRowGridValues(tableRow, row.rowFormat);
                this.parseRowGridValues(tableRow.rowFormat, row.rowFormat);
                row.index = i;
                for (let j: number = 0; j < block.rows[i].cells.length; j++) {
                    let cell: TableCellWidget = new TableCellWidget();
                    cell.cellFormat = new WCellFormat(cell);
                    row.childWidgets.push(cell);
                    cell.containerWidget = row;
                    cell.index = j;
                    cell.rowIndex = i;
                    if (block.rows[i].cells[j].hasOwnProperty('cellFormat')) {
                        this.parseCellFormat(block.rows[i].cells[j].cellFormat, cell.cellFormat);
                    }
                    this.parseTextBody(block.rows[i].cells[j].blocks, cell);
                }
            }
            table.childWidgets.push(row);
            row.containerWidget = table;
        }
        table.containerWidget = section;
        blocks.push(table);
        table.isGridUpdated = false;
    }
    private parseRowGridValues(data: any, rowFormat: WRowFormat): void {
        if (!isNullOrUndefined(data.gridBefore)) {
            rowFormat.gridBefore = data.gridBefore;
        }
        if (!isNullOrUndefined(data.gridBeforeWidth)) {
            rowFormat.gridBeforeWidth = data.gridBeforeWidth;
        }
        if (!isNullOrUndefined(data.gridBeforeWidthType)) {
            rowFormat.gridBeforeWidthType = data.gridBeforeWidthType;
        }
        if (!isNullOrUndefined(data.gridAfter)) {
            rowFormat.gridAfter = data.gridAfter;
        }
        if (!isNullOrUndefined(data.gridAfterWidth)) {
            rowFormat.gridAfterWidth = data.gridAfterWidth;
        }
        if (!isNullOrUndefined(data.gridAfterWidthType)) {
            rowFormat.gridAfterWidthType = data.gridAfterWidthType;
        }
    }
    private parseParagraph(data: any, paragraph: ParagraphWidget, writeInlineFormat?: boolean): void {
        let lineWidget: LineWidget = new LineWidget(paragraph);
        for (let i: number = 0; i < data.length; i++) {
            let inline: any = data[i];
            if (inline.hasOwnProperty('text')) {
                let textElement: FieldTextElementBox | TextElementBox | TabElementBox = undefined;
                if (this.viewer.isPageField) {
                    textElement = new FieldTextElementBox();
                    (textElement as FieldTextElementBox).fieldBegin = this.viewer.fieldStacks[this.viewer.fieldStacks.length - 1];
                } else if (inline.text === '\t') {
                    textElement = new TabElementBox();

                } else {
                    textElement = new TextElementBox();
                }
                textElement.characterFormat = new WCharacterFormat(textElement);
                this.parseCharacterFormat(inline.characterFormat, textElement.characterFormat, writeInlineFormat);
                /*�tslint:disable-next-line:max-line-length */
                if (!isNullOrUndefined(inline.characterFormat) && !isNullOrUndefined(inline.characterFormat.styleName)) {
                    let charStyle: Object = this.viewer.styles.findByName(inline.characterFormat.styleName, 'Character');
                    textElement.characterFormat.ApplyStyle(charStyle as WStyle);
                }
                textElement.text = inline.text;
                textElement.line = lineWidget;
                lineWidget.children.push(textElement);
            } else if (inline.hasOwnProperty('imageString')) {
                let image: ImageElementBox = new ImageElementBox(data[i].isInlineImage);
                image.isMetaFile = data[i].isMetaFile;
                image.characterFormat = new WCharacterFormat(image);
                image.line = lineWidget;
                lineWidget.children.push(image);
                image.imageString = inline.imageString;
                image.width = HelperMethods.convertPointToPixel(inline.width);
                image.height = HelperMethods.convertPointToPixel(inline.height);
                this.parseCharacterFormat(inline.characterFormat, image.characterFormat);
            } else if (inline.hasOwnProperty('hasFieldEnd') || (inline.hasOwnProperty('fieldType') && inline.fieldType === 0)) {
                let fieldBegin: FieldElementBox = new FieldElementBox(0);
                fieldBegin.hasFieldEnd = inline.hasFieldEnd;
                this.viewer.fieldStacks.push(fieldBegin);
                fieldBegin.line = lineWidget;
                this.viewer.fields.push(fieldBegin);
                lineWidget.children.push(fieldBegin);
            } else if (inline.hasOwnProperty('fieldType')) {
                let field: FieldElementBox = undefined;
                if (inline.fieldType === 2) {
                    field = new FieldElementBox(2);
                    this.fieldSeparator = field;
                    if (this.viewer.fieldStacks.length > 0) {
                        field.fieldBegin = this.viewer.fieldStacks[this.viewer.fieldStacks.length - 1];
                        field.fieldBegin.fieldSeparator = field;
                        //finds the whether the field is page filed or not
                        let lineWidgetCount: number = lineWidget.children.length;
                        if (lineWidgetCount >= 2 && (lineWidget.children[lineWidgetCount - 2] instanceof FieldElementBox)
                            && (lineWidget.children[lineWidgetCount - 2] as FieldElementBox).hasFieldEnd
                            && (lineWidget.children[lineWidgetCount - 1] instanceof TextElementBox)) {
                            let fieldElementText: string = (lineWidget.children[lineWidgetCount - 1] as TextElementBox).text;
                            if (fieldElementText.match('PAGE')) {
                                this.viewer.isPageField = true;
                            }
                        }
                    }
                } else if (inline.fieldType === 1) {
                    field = new FieldElementBox(1);
                    //For Field End Updated begin and separator.                                      
                    if (this.viewer.fieldStacks.length > 0) {
                        field.fieldBegin = this.viewer.fieldStacks[this.viewer.fieldStacks.length - 1];
                        field.fieldBegin.fieldEnd = field;
                    }
                    if (!isNullOrUndefined(field.fieldBegin) && field.fieldBegin.fieldSeparator) {
                        field.fieldSeparator = field.fieldBegin.fieldSeparator;
                        field.fieldBegin.fieldSeparator.fieldEnd = field;
                    }
                    //After setting all the property clear the field values
                    this.viewer.fieldStacks.splice(this.viewer.fieldStacks.length - 1, 1);
                    this.fieldSeparator = undefined;
                    this.viewer.isPageField = false;
                    this.viewer.fieldCollection.push(field.fieldBegin);
                }
                field.line = lineWidget;
                lineWidget.children.push(field);
            } else if (inline.hasOwnProperty('bookmarkType')) {
                let bookmark: BookmarkElementBox = undefined;
                bookmark = new BookmarkElementBox(inline.bookmarkType);
                bookmark.name = inline.name;
                lineWidget.children.push(bookmark);
                bookmark.line = lineWidget;
                if (inline.bookmarkType === 0) {
                    this.viewer.bookmarks.add(bookmark.name, bookmark);
                } else if (inline.bookmarkType === 1) {
                    if (this.viewer.bookmarks.containsKey(bookmark.name)) {
                        let bookmarkStart: BookmarkElementBox = this.viewer.bookmarks.get(bookmark.name);
                        bookmarkStart.reference = bookmark;
                        bookmark.reference = bookmarkStart;
                    }
                }
            }
        }
        paragraph.childWidgets.push(lineWidget);
    }
    private parseTableFormat(sourceFormat: any, tableFormat: WTableFormat): void {
        this.parseBorders(sourceFormat.borders, tableFormat.borders);
        if (!isNullOrUndefined(sourceFormat.cellSpacing)) {
            tableFormat.cellSpacing = sourceFormat.cellSpacing;
        }
        if (!isNullOrUndefined(sourceFormat.leftMargin)) {
            tableFormat.leftMargin = sourceFormat.leftMargin;
        }
        if (!isNullOrUndefined(sourceFormat.topMargin)) {
            tableFormat.topMargin = sourceFormat.topMargin;
        }
        if (!isNullOrUndefined(sourceFormat.rightMargin)) {
            tableFormat.rightMargin = sourceFormat.rightMargin;
        }
        if (!isNullOrUndefined(sourceFormat.bottomMargin)) {
            tableFormat.bottomMargin = sourceFormat.bottomMargin;
        }
        if (!isNullOrUndefined(sourceFormat.leftIndent)) {
            tableFormat.leftIndent = sourceFormat.leftIndent;
        }
        this.parseShading(sourceFormat.shading, tableFormat.shading);
        if (!isNullOrUndefined(sourceFormat.tableAlignment)) {
            tableFormat.tableAlignment = sourceFormat.tableAlignment;
        }
        if (!isNullOrUndefined(sourceFormat.preferredWidth)) {
            tableFormat.preferredWidth = sourceFormat.preferredWidth;
        }
        if (!isNullOrUndefined(sourceFormat.preferredWidthType)) {
            tableFormat.preferredWidthType = sourceFormat.preferredWidthType;
        }
    }
    private parseCellFormat(sourceFormat: any, cellFormat: WCellFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            this.parseBorders(sourceFormat.borders, cellFormat.borders);
            if (!sourceFormat.isSamePaddingAsTable) {
                //    cellFormat.ClearMargins();
                //else
                this.parseCellMargin(sourceFormat, cellFormat);
            }
            if (!isNullOrUndefined(sourceFormat.cellWidth)) {
                cellFormat.cellWidth = sourceFormat.cellWidth;
            }
            if (!isNullOrUndefined(sourceFormat.columnSpan)) {
                cellFormat.columnSpan = sourceFormat.columnSpan;
            }
            if (!isNullOrUndefined(sourceFormat.rowSpan)) {
                cellFormat.rowSpan = sourceFormat.rowSpan;
            }
            this.parseShading(sourceFormat.shading, cellFormat.shading);
            if (!isNullOrUndefined(sourceFormat.verticalAlignment)) {
                cellFormat.verticalAlignment = sourceFormat.verticalAlignment;
            }
            if (!isNullOrUndefined(sourceFormat.preferredWidthType)) {
                cellFormat.preferredWidthType = sourceFormat.preferredWidthType;
            }
            if (!isNullOrUndefined(sourceFormat.preferredWidth)) {
                cellFormat.preferredWidth = sourceFormat.preferredWidth;
            }
        }
    }
    private parseCellMargin(sourceFormat: any, cellFormat: WCellFormat): void {
        if (!isNullOrUndefined(sourceFormat.leftMargin)) {
            cellFormat.leftMargin = sourceFormat.leftMargin;
        }
        if (!isNullOrUndefined(sourceFormat.rightMargin)) {
            cellFormat.rightMargin = sourceFormat.rightMargin;
        }
        if (!isNullOrUndefined(sourceFormat.topMargin)) {
            cellFormat.topMargin = sourceFormat.topMargin;
        }
        if (!isNullOrUndefined(sourceFormat.bottomMargin)) {
            cellFormat.bottomMargin = sourceFormat.bottomMargin;
        }
    }
    private parseRowFormat(sourceFormat: any, rowFormat: WRowFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (!isNullOrUndefined(sourceFormat.allowBreakAcrossPages)) {
                rowFormat.allowBreakAcrossPages = sourceFormat.allowBreakAcrossPages;
            }
            if (!isNullOrUndefined(sourceFormat.isHeader)) {
                rowFormat.isHeader = sourceFormat.isHeader;
            }
            if (!isNullOrUndefined(sourceFormat.heightType)) {
                rowFormat.heightType = sourceFormat.heightType;
            }
            if (!isNullOrUndefined(sourceFormat.height)) {
                rowFormat.height = sourceFormat.height;
            }
            this.parseBorders(sourceFormat.borders, rowFormat.borders);
        }
    }
    private parseBorders(sourceBorders: any, destBorder: WBorders): void {
        if (!isNullOrUndefined(sourceBorders)) {
            this.parseBorder(sourceBorders.left, destBorder.left);
            this.parseBorder(sourceBorders.right, destBorder.right);
            this.parseBorder(sourceBorders.top, destBorder.top);
            this.parseBorder(sourceBorders.bottom, destBorder.bottom);
            this.parseBorder(sourceBorders.vertical, destBorder.vertical);
            this.parseBorder(sourceBorders.horizontal, destBorder.horizontal);
            this.parseBorder(sourceBorders.diagonalDown, destBorder.diagonalDown);
            this.parseBorder(sourceBorders.diagonalUp, destBorder.diagonalUp);
        }
    }
    private parseBorder(sourceBorder: any, destBorder: WBorder): void {
        if (!isNullOrUndefined(sourceBorder)) {
            if (!isNullOrUndefined(sourceBorder.color)) {
                destBorder.color = this.getColor(sourceBorder.color);
            }
            if (!isNullOrUndefined(sourceBorder.lineStyle)) {
                destBorder.lineStyle = sourceBorder.lineStyle;
            }
            if (!isNullOrUndefined(sourceBorder.lineWidth)) {
                destBorder.lineWidth = sourceBorder.lineWidth;
            }
            if (!isNullOrUndefined(sourceBorder.hasNoneStyle)) {
                destBorder.hasNoneStyle = sourceBorder.hasNoneStyle;
            }
        }
    }
    private parseShading(sourceShading: any, destShading: WShading): void {
        if (!isNullOrUndefined(sourceShading)) {
            if (!isNullOrUndefined(sourceShading.backgroundColor)) {
                destShading.backgroundColor = this.getColor(sourceShading.backgroundColor);
            }
            if (!isNullOrUndefined(sourceShading.foregroundColor)) {
                destShading.foregroundColor = this.getColor(sourceShading.foregroundColor);
            }
            if (!isNullOrUndefined(sourceShading.texture) || !isNullOrUndefined(sourceShading.textureStyle)) {
                destShading.textureStyle = !isNullOrUndefined(sourceShading.texture) ? sourceShading.texture : sourceShading.textureStyle;
            }
        }
    }
    private parseCharacterFormat(sourceFormat: any, characterFormat: WCharacterFormat, writeInlineFormat?: boolean): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (writeInlineFormat && sourceFormat.hasOwnProperty('inlineFormat')) {
                this.parseCharacterFormat(sourceFormat.inlineFormat, characterFormat);
                return;
            }
            if (!isNullOrUndefined(sourceFormat.baselineAlignment)) {
                characterFormat.baselineAlignment = sourceFormat.baselineAlignment;
            }
            if (!isNullOrUndefined(sourceFormat.underline)) {
                characterFormat.underline = sourceFormat.underline;
            }
            if (!isNullOrUndefined(sourceFormat.strikethrough)) {
                characterFormat.strikethrough = sourceFormat.strikethrough;
            }
            if (!isNullOrUndefined(sourceFormat.fontSize)) {
                characterFormat.fontSize = sourceFormat.fontSize;
            }
            if (!isNullOrUndefined(sourceFormat.fontFamily)) {
                characterFormat.fontFamily = sourceFormat.fontFamily;
            }
            if (!isNullOrUndefined(sourceFormat.bold)) {
                characterFormat.bold = sourceFormat.bold;
            }
            if (!isNullOrUndefined(sourceFormat.italic)) {
                characterFormat.italic = sourceFormat.italic;
            }
            if (!isNullOrUndefined(sourceFormat.highlightColor)) {
                characterFormat.highlightColor = sourceFormat.highlightColor;
            }
            if (!isNullOrUndefined(sourceFormat.fontColor)) {
                characterFormat.fontColor = this.getColor(sourceFormat.fontColor);
            }
        }
    }
    private getColor(color: string): string {
        let convertColor: string = color;
        return convertColor || '#ffffff';
    }
    private parseParagraphFormat(sourceFormat: any, paragraphFormat: WParagraphFormat): void {
        if (!isNullOrUndefined(sourceFormat)) {
            if (!isNullOrUndefined(sourceFormat.leftIndent)) {
                paragraphFormat.leftIndent = sourceFormat.leftIndent;
            }
            if (!isNullOrUndefined(sourceFormat.rightIndent)) {
                paragraphFormat.rightIndent = sourceFormat.rightIndent;
            }
            if (!isNullOrUndefined(sourceFormat.firstLineIndent)) {
                paragraphFormat.firstLineIndent = sourceFormat.firstLineIndent;
            }
            if (!isNullOrUndefined(sourceFormat.afterSpacing)) {
                paragraphFormat.afterSpacing = sourceFormat.afterSpacing;
            }
            if (!isNullOrUndefined(sourceFormat.beforeSpacing)) {
                paragraphFormat.beforeSpacing = sourceFormat.beforeSpacing;
            }
            if (!isNullOrUndefined(sourceFormat.lineSpacing)) {
                paragraphFormat.lineSpacing = sourceFormat.lineSpacing;
            }
            if (!isNullOrUndefined(sourceFormat.lineSpacingType)) {
                paragraphFormat.lineSpacingType = sourceFormat.lineSpacingType;
            }
            if (!isNullOrUndefined(sourceFormat.textAlignment)) {
                paragraphFormat.textAlignment = sourceFormat.textAlignment;
            }
            if (!isNullOrUndefined(sourceFormat.outlineLevel)) {
                paragraphFormat.outlineLevel = sourceFormat.outlineLevel;
            }
            paragraphFormat.listFormat = new WListFormat();
            if (sourceFormat.hasOwnProperty('listFormat')) {
                this.parseListFormat(sourceFormat, paragraphFormat.listFormat);
            }
            if (sourceFormat.hasOwnProperty('tabs')) {
                this.parseTabStop(sourceFormat.tabs, paragraphFormat.tabs);
            }
        }
    }
    private parseListFormat(block: any, listFormat: WListFormat): void {
        if (!isNullOrUndefined(block.listFormat)) {
            if (!isNullOrUndefined(block.listFormat.listId)) {
                listFormat.listId = block.listFormat.listId;
                listFormat.list = this.viewer.getListById(block.listFormat.listId);
            }
            if (!isNullOrUndefined(block.listFormat.listLevelNumber)) {
                listFormat.listLevelNumber = block.listFormat.listLevelNumber;
            }
        }
    }
    private parseSectionFormat(data: any, sectionFormat: WSectionFormat): void {
        if (!isNullOrUndefined(data.pageWidth)) {
            sectionFormat.pageWidth = data.pageWidth;
        }
        if (!isNullOrUndefined(data.pageHeight)) {
            sectionFormat.pageHeight = data.pageHeight;
        }
        if (!isNullOrUndefined(data.leftMargin)) {
            sectionFormat.leftMargin = data.leftMargin;
        }
        if (!isNullOrUndefined(data.topMargin)) {
            sectionFormat.topMargin = data.topMargin;
        }
        if (!isNullOrUndefined(data.rightMargin)) {
            sectionFormat.rightMargin = data.rightMargin;
        }
        if (!isNullOrUndefined(data.bottomMargin)) {
            sectionFormat.bottomMargin = data.bottomMargin;
        }
        if (!isNullOrUndefined(data.headerDistance)) {
            sectionFormat.headerDistance = data.headerDistance;
        }
        if (!isNullOrUndefined(data.footerDistance)) {
            sectionFormat.footerDistance = data.footerDistance;
        }
        if (!isNullOrUndefined(data.differentFirstPage)) {
            sectionFormat.differentFirstPage = data.differentFirstPage;
        }
        if (!isNullOrUndefined(data.differentOddAndEvenPages)) {
            sectionFormat.differentOddAndEvenPages = data.differentOddAndEvenPages;
        }
    }

    private parseTabStop(wTabs: any, tabs: WTabStop[]): void {
        for (let i: number = 0; i < wTabs.length; i++) {
            let tabStop: WTabStop = new WTabStop();
            tabStop.position = wTabs[i].position;
            tabStop.tabLeader = wTabs[i].tabLeader;
            tabStop.deletePosition = wTabs[i].deletePosition;
            tabStop.tabJustification = wTabs[i].tabJustification;
            tabs.push(tabStop);
        }
    }
}