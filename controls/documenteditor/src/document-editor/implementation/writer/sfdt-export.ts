import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WTabStop, WParagraphFormat } from '../format/paragraph-format';
import { WCellFormat, WTableFormat, WRowFormat, WStyle, WListFormat, WCharacterFormat } from '../format/index';
import { WBorder, WBorders, WShading } from '../format/index';
import { LayoutViewer } from '../index';
import {
    IWidget, LineWidget, ParagraphWidget, BlockContainer, BodyWidget, TextElementBox, Page, ElementBox, FieldElementBox, TableWidget,
    TableRowWidget, TableCellWidget, ImageElementBox, HeaderFooterWidget, HeaderFooters,
    ListTextElementBox, BookmarkElementBox, EditRangeStartElementBox, EditRangeEndElementBox,
    ChartElementBox, ChartDataTable, ChartTitleArea, ChartDataFormat, ChartLayout, ChartArea, ChartLegend, ChartCategoryAxis,
    CommentElementBox, CommentCharacterElementBox, TextFormField, CheckBoxFormField, DropDownFormField, ShapeElementBox
} from '../viewer/page';
import { BlockWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { TextPosition } from '../selection';
import { DocumentHelper } from '../viewer';
import { WLevelOverride } from '../list';
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
    private document: any = undefined;
    private writeInlineStyles: boolean = undefined;
    private editRangeId: number = -1;
    private isExport: boolean = true;
    private documentHelper: DocumentHelper;
    private checkboxOrDropdown: boolean = false;
    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    private getModuleName(): string {
        return 'SfdtExport';
    }
    private clear(): void {
        this.writeInlineStyles = undefined;
        this.endLine = undefined;
        this.lists = undefined;
        this.document = undefined;
        this.endCell = undefined;
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
    public saveAsBlob(documentHelper: DocumentHelper): Promise<Blob> {
        let streamWriter: StreamWriter = new StreamWriter();
        streamWriter.write(this.serialize());
        let blob: Blob = streamWriter.buffer;
        streamWriter.destroy();
        let promise: Promise<Blob>;
        return new Promise((resolve: Function, reject: Function) => {
            resolve(blob);
        });
    }
    private updateEditRangeId(): void {
        let index: number = -1;
        for (let i: number = 0; i < this.documentHelper.editRanges.keys.length; i++) {
            let keys: string[] = this.documentHelper.editRanges.keys;
            for (let j: number = 0; j < keys[i].length; j++) {
                let editRangeStart: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(keys[i]);
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
    // tslint:disable-next-line:max-line-length
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
            if (startCell === endCell || isNullOrUndefined(startCell)) {
                let paragraph: any = this.createParagraph(line.paragraph);
                section.blocks.push(paragraph);
                nextBlock = this.writeParagraph(line.paragraph, paragraph, section.blocks, line.indexInOwner, startOffset);
                while (nextBlock) {
                    nextBlock = this.writeBlock(nextBlock, 0, section.blocks);
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
                nextBlock = this.writeTable(startCell.ownerTable, table, startCell.ownerRow.indexInOwner, section.blocks);
                while (nextBlock) {
                    nextBlock = this.writeBlock(nextBlock, 0, section.blocks);
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
        let doc: Document = this.document;
        this.clear();
        return doc;
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
        this.document.enforcement = this.documentHelper.isDocumentProtected;
        this.document.hashValue = this.documentHelper.hashValue;
        this.document.saltValue = this.documentHelper.saltValue;
        this.document.formatting = this.documentHelper.restrictFormatting;
        this.document.protectionType = this.documentHelper.protectionType;
        this.document.dontUseHTMLParagraphAutoSpacing = this.documentHelper.dontUseHtmlParagraphAutoSpacing;
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
        section.blocks = [];
        section.headersFooters = {};
        return section;
    }
    private writeBlock(widget: BlockWidget, index: number, blocks: any): BlockWidget {
        if (!(widget instanceof BlockWidget)) {
            return undefined;
        }
        if (widget instanceof ParagraphWidget) {
            let paragraph: any = this.createParagraph(widget);
            blocks.push(paragraph);
            return this.writeParagraph(widget, paragraph, blocks);
        } else {
            let tableWidget: TableWidget = widget as TableWidget;
            let table: any = this.createTable(tableWidget);
            blocks.push(table);
            return this.writeTable(tableWidget, table, 0, blocks);
        }
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
        return (next instanceof BlockWidget && paragraphWidget.containerWidget.index === next.containerWidget.index) ? next : undefined;
    }
    private writeInlines(paragraph: ParagraphWidget, line: LineWidget, inlines: any): void {
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
            let inline: any = this.writeInline(element);
            if (!isNullOrUndefined(inline)) {
                inlines.push(inline);
            }
            if (this.isExport && element instanceof FieldElementBox && element.fieldType === 1) {
                isformField = false;
                this.checkboxOrDropdown = false;
            }
        }
    }
    private writeInline(element: ElementBox): any {
        let inline: any = {};
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
                        inline.formFieldData.dropDownList.dropdownItems = (element.formFieldData as DropDownFormField).dropDownItems;
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
            inline.width = HelperMethods.convertPixelToPoint(element.width);
            inline.height = HelperMethods.convertPixelToPoint(element.height);
        } else if (element instanceof BookmarkElementBox) {
            inline.bookmarkType = element.bookmarkType;
            inline.name = element.name;
        } else if (element instanceof TextElementBox) {
            // replacing the no break hyphen character by '-'
            if (element.text.indexOf('\u001e') !== -1) {
                inline.text = element.text.replace('\u001e', '-');
            } else if (element.text.indexOf('\u001f') !== -1) {
                inline.text = element.text.replace('\u001f', '');
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
            inline.commentCharacterType = element.commentType;
            inline.commentId = element.commentId;
        } else if (element instanceof ShapeElementBox) {
            this.writeShape(element, inline);
        } else {
            inline = undefined;
        }
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
        inline.horizontalPosition = HelperMethods.convertPixelToPoint(element.horizontalPosition);
        inline.horizontalOrigin = element.horizontalOrigin;
        inline.horizontalAlignment = element.horizontalAlignment;
        inline.zOrderPosition = element.zOrderPosition;
        inline.allowOverlap = element.allowOverlap;
        inline.layoutInCell = element.layoutInCell;
        inline.lockAnchor = element.lockAnchor;
        inline.autoShapeType = element.autoShapeType;
        if (element.lineFormat) {
            inline.lineFormat = {};
            inline.lineFormat.lineFormatType = element.lineFormat.lineFormatType;
            inline.lineFormat.color = element.lineFormat.color;
            inline.lineFormat.weight = element.lineFormat.weight;
            inline.lineFormat.dashStyle = element.lineFormat.dashStyle;
        }
        if (element.textFrame) {
            inline.textFrame = {};
            inline.textFrame.textVerticalAlignment = element.textFrame.textVerticalAlignment;
            inline.textFrame.marginLeft = HelperMethods.convertPixelToPoint(element.textFrame.marginLeft);
            inline.textFrame.marginRight = HelperMethods.convertPixelToPoint(element.textFrame.marginRight);
            inline.textFrame.marginTop = HelperMethods.convertPixelToPoint(element.textFrame.marginTop);
            inline.textFrame.marginBottom = HelperMethods.convertPixelToPoint(element.textFrame.marginBottom);
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
                this.writeLine(child, offset, inlines);
            } else {
                this.writeInlines(paragraph, child, inlines);
            }
        }
        return endParagraph;
    }
    private writeLine(line: LineWidget, offset: number, inlines: any): void {
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
        // tslint:disable-next-line:max-line-length
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
            if (next && rowWidget.ownerTable.index !== next.ownerTable.index) {
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
        return rowFormat;
    }
    private writeTableFormat(wTableFormat: WTableFormat): any {
        let tableFormat: any = {};
        tableFormat.borders = this.writeBorders(wTableFormat.borders);
        tableFormat.shading = this.writeShading(wTableFormat.shading);
        tableFormat.cellSpacing = wTableFormat.hasValue('cellSpacing') ? wTableFormat.cellSpacing : undefined;
        tableFormat.leftIndent = wTableFormat.hasValue('leftIndent') ? wTableFormat.leftIndent : undefined;
        tableFormat.tableAlignment = wTableFormat.hasValue('tableAlignment"') ? wTableFormat.tableAlignment : undefined;
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
    public writeComments(documentHelper: DocumentHelper): void {
        this.document.comments = [];
        for (let i: number = 0; i < documentHelper.comments.length; i++) {
            this.document.comments.push(this.writeComment(documentHelper.comments[i]));
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
    /** 
     * @private
     */
    public destroy(): void {
        this.lists = undefined;
        this.endLine = undefined;
        this.endOffset = undefined;
        this.documentHelper = undefined;
    }
    /* tslint:enable:no-any */
}