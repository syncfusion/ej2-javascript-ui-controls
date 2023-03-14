import { TaskFieldsModel } from './../models/task-fields-model.d';
import { PdfFontFamily } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfPageCountField, PdfPageNumberField } from '@syncfusion/ej2-pdf-export';
import { PdfPageTemplateElement, RectangleF, PdfCompositeField, PointF } from '@syncfusion/ej2-pdf-export';
import { PdfVerticalAlignment, PdfTextAlignment, PdfFont, PdfStandardFont } from '@syncfusion/ej2-pdf-export';
import { PdfFontStyle, PdfColor, PdfPen, PdfBrush, PdfSolidBrush, PdfDocument } from '@syncfusion/ej2-pdf-export';
import { PdfTreeGridColumn, PdfTreeGridRow, PdfTreeGridCell, PdfBorders, PdfPaddings } from './pdf-base/index';
import { ColumnModel } from './../models/column';
import { PdfGantt } from './pdf-gantt';
import {
    IGanttData, PdfExportProperties, PdfQueryCellInfoEventArgs,
    ITaskData, IGanttStyle, IConnectorLineObject, PdfGanttCellStyle, ITaskbarStyle, PdfColumnHeaderQueryCellInfoEventArgs,
    PdfQueryTaskbarInfoEventArgs
} from './../base/interface';
import { Gantt } from './../base/gantt';
import { isNullOrUndefined, DateFormatOptions, Internationalization, getValue, extend } from '@syncfusion/ej2-base';
import { getForeignData, ValueFormatter } from '@syncfusion/ej2-grids';
import { pixelToPoint, isScheduledTask } from '../base/utils';
import { Timeline } from '../renderer/timeline';
import { PdfGanttTaskbarCollection } from './pdf-taskbar';
import { PdfGanttPredecessor } from './pdf-connector-line';


/**
 * @hidden
 * `ExportHelper` for `PdfExport` & `ExcelExport`
 */
export class ExportHelper {
    private parent: Gantt;
    private flatData: IGanttData[];
    private exportProps: PdfExportProperties;
    private gantt: PdfGantt;
    private rowIndex: number;
    private colIndex: number;
    private row: PdfTreeGridRow;
    private columns: ColumnModel[];
    private ganttStyle: IGanttStyle;
    private pdfDoc: PdfDocument;
    private exportValueFormatter: ExportValueFormatter;
    private totalColumnWidth: number;
    public constructor(parent: Gantt) {
        this.parent = parent;
    }
    /**
     * @param {IGanttData[]} data .
     * @param {PdfGantt} gantt .
     * @param {PdfExportProperties} props .
     * @returns {void} .
     * @private
     */
    public processGridExport(data: IGanttData[], gantt: PdfGantt, props: PdfExportProperties): void {
        this.flatData = data;
        this.gantt = gantt;
        this.exportValueFormatter = new ExportValueFormatter(this.parent.locale);
        this.exportProps = props;
        this.rowIndex = 0;
        this.colIndex = 0;
        this.columns = this.parent.treeGrid.columns as ColumnModel[];
        this.gantt.treeColumnIndex = this.parent.treeColumnIndex;
        this.gantt.rowHeight = pixelToPoint(this.parent.rowHeight);
        this.gantt.style.cellPadding.left = 0;
        this.gantt.style.cellPadding.right = 0;
        this.ganttStyle = this.gantt.ganttStyle;
        this.gantt.borderColor = this.ganttStyle.chartGridLineColor;
        this.processHeaderContent();
        this.processGanttContent();
        this.processTimeline();
        this.processTaskbar();
        this.processPredecessor();
    }

    private processHeaderContent(): void {
        this.rowIndex++;
        this.row = this.gantt.rows.addRow();
        let index: number = 0;
        this.columns.forEach((column: ColumnModel): void => {
            if (this.isColumnVisible(column)) {
                this.processColumnHeader(column, index);
                index++;
            }
        });
    }
    private processColumnHeader(column: ColumnModel, index: number): void {
        this.gantt.columns.add(1);
        const pdfColumn: PdfTreeGridColumn = this.gantt.columns.getColumn(index);
        if (this.parent.treeColumnIndex === index) {
            pdfColumn.isTreeColumn = true;
        }
        const width: string | number = parseInt(column.width as string, 10);
        pdfColumn.width = pixelToPoint(width);
        this.totalColumnWidth += pdfColumn.width;
        pdfColumn.headerText = column.headerText;
        pdfColumn.field = column.field;
        const cell: PdfTreeGridCell = this.row.cells.getCell(index);
        cell.value = column.headerText;
        cell.isHeaderCell = true;
        const treeGridHeaderHeight: number = this.parent.timelineModule.isSingleTier ? 45 : 60;
        this.copyStyles(this.ganttStyle.columnHeader, cell, false);
        this.row.height = pixelToPoint(treeGridHeaderHeight);
        if (column.headerTextAlign) {
            cell.style.format.alignment = PdfTextAlignment[column.headerTextAlign];
        }
        const args: PdfColumnHeaderQueryCellInfoEventArgs = {
            cell: cell,
            style: cell.style,
            value: cell.value,
            column: column
        };
        if (this.parent.pdfColumnHeaderQueryCellInfo) {
            this.parent.trigger('pdfColumnHeaderQueryCellInfo', args);
        }
        cell.value = args.value;
    }

    private isColumnVisible(column: ColumnModel): boolean {
        const visibleColumn: boolean = column.visible || this.exportProps.includeHiddenColumn;
        const templateColumn: boolean = !isNullOrUndefined(column.template) ? false : true;
        return (visibleColumn && templateColumn);
    }

    private processGanttContent(): void {
        if (this.flatData.length === 0) {
            this.renderEmptyGantt();
        } else {
            this.flatData.forEach((data: IGanttData) => {
                this.row = this.gantt.rows.addRow();
                if (data.hasChildRecords) {
                    this.gantt.rows.getRow(this.rowIndex).isParentRow = true;
                    this.processRecordRow(data);
                } else {
                    this.processRecordRow(data);
                }
                this.rowIndex++;
            });
        }
    }
    /**
     * Method for processing the timeline details
     *
     * @returns {void} .
     */
    private processTimeline(): void {
        const timelineSettings: Timeline = this.parent.timelineModule;
        this.gantt.chartHeader.topTierHeight = this.gantt.chartHeader.bottomTierHeight
            = (this.parent.timelineModule.isSingleTier ? 45 : 60 / 2);
        this.gantt.chartHeader.topTierCellWidth = timelineSettings.topTierCellWidth;
        this.gantt.chartHeader.bottomTierCellWidth = timelineSettings.bottomTierCellWidth;
        this.gantt.chartHeader.topTier = extend([], [], timelineSettings.topTierCollection, true) as [];
        this.gantt.chartHeader.bottomTier = extend([], [], timelineSettings.bottomTierCollection, true) as [];
        this.gantt.chartHeader.width = timelineSettings.totalTimelineWidth;
        this.gantt.chartHeader.height = this.gantt.rows.getRow(0).height;
        this.gantt.timelineStartDate = new Date(timelineSettings.timelineStartDate.getTime());
    }
    /**
     * Method for create the predecessor collection for rendering
     *
     * @returns {void} .
     */
    private processPredecessor(): void {
        if (isNullOrUndefined(this.exportProps.showPredecessorLines) || this.exportProps.showPredecessorLines) {
            this.parent.pdfExportModule.isPdfExport = true;
            this.parent.predecessorModule.createConnectorLinesCollection();
            this.parent.updatedConnectorLineCollection.forEach((data: IConnectorLineObject) => {
                const predecessor: PdfGanttPredecessor = this.gantt.predecessor.add();
                predecessor.parentLeft = data.parentLeft;
                predecessor.childLeft = data.childLeft;
                predecessor.parentWidth = data.parentWidth;
                predecessor.childWidth = data.childWidth;
                predecessor.parentIndex = data.parentIndex;
                predecessor.childIndex = data.childIndex;
                predecessor.rowHeight = data.rowHeight;
                predecessor.type = data.type;
                predecessor.milestoneParent = data.milestoneParent;
                predecessor.milestoneChild = data.milestoneChild;
                predecessor.lineWidth = this.parent.connectorLineWidth > 5 ? pixelToPoint(5) : pixelToPoint(this.parent.connectorLineWidth);
                if (data.isCritical) {
                    predecessor.connectorLineColor = this.ganttStyle.criticalConnectorLineColor;
                }
                else {
                    predecessor.connectorLineColor = this.ganttStyle.connectorLineColor;
                }
                predecessor.connectorLineColor = this.ganttStyle.connectorLineColor;
                this.gantt.predecessorCollection.push(predecessor);
            });
            this.parent.pdfExportModule.isPdfExport = false;
        }
    }

    private processRecordRow(data: IGanttData): void {
        this.colIndex = 0;
        this.row.level = data.level;
        this.columns.forEach((column: ColumnModel): void => {
            if (this.isColumnVisible(column)) {
                this.processRecordCell(data, column, this.row);
                this.colIndex++;
            }
        });
    }

    private processRecordCell(data: IGanttData, column: ColumnModel, row: PdfTreeGridRow): void {
        const cell: PdfTreeGridCell = row.cells.getCell(this.colIndex);
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const ganttProps: ITaskData = data.ganttProperties;
        if (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') {
            cell.value = data[column.field];
        } else if (column.field === taskFields.duration) {
            cell.value = this.parent.getDurationString(ganttProps.duration, ganttProps.durationUnit);
        } else if (column.field === taskFields.resourceInfo) {
            cell.value = ganttProps.resourceNames;
        } else if (column.field === taskFields.work) {
            cell.value = this.parent.getWorkString(ganttProps.work, ganttProps.workUnit);
        } else {
            cell.value = !isNullOrUndefined(data[column.field]) ? data[column.field].toString() : '';
        }
        cell.isHeaderCell = false;
        cell.style.padding = new PdfPaddings();
        this.copyStyles(this.ganttStyle.cell, cell, row.isParentRow);
        if (this.colIndex !== this.parent.treeColumnIndex) {
            cell.style.format.alignment = PdfTextAlignment[column.textAlign];
        } else {
            cell.style.format.paragraphIndent = cell.row.level * 10;
        }
            const args: PdfQueryCellInfoEventArgs = {
                data: data,
                value: cell.value,
                column: column,
                style: cell.style,
                cell: cell
            };
            args.value = this.exportValueFormatter.formatCellValue(args);
            if (this.parent.pdfQueryCellInfo) {
                this.parent.trigger('pdfQueryCellInfo', args);
            }
            cell.value = args.value;
    }
    /**
     * Method for create the taskbar collection for rendering
     *
     * @returns {void} .
     */
    private processTaskbar(): void {
        this.flatData.forEach((data: IGanttData) => {
            const taskbar: PdfGanttTaskbarCollection = this.gantt.taskbar.add();
            const ganttProp: ITaskData = data.ganttProperties;
            taskbar.left = ganttProp.left;
            taskbar.width = ganttProp.width;
            if (taskbar.left < 0) {
                taskbar.width = taskbar.width + taskbar.left;
                taskbar.left = 0;
            }
            taskbar.progress = ganttProp.progress;
            taskbar.isScheduledTask = isScheduledTask(ganttProp);
            if (isScheduledTask) {
                if (isNullOrUndefined(ganttProp.endDate) && isNullOrUndefined(ganttProp.duration)) {
                    taskbar.unscheduledTaskBy = 'startDate';
                } else if (isNullOrUndefined(ganttProp.startDate) && isNullOrUndefined(ganttProp.duration)) {
                    taskbar.unscheduledTaskBy = 'endDate';
                } else {
                    taskbar.unscheduledTaskBy = 'duration';
                    taskbar.unscheduleStarteDate = this.parent.dateValidationModule.getValidStartDate(data.ganttProperties);
                    taskbar.unscheduleEndDate = this.parent.dateValidationModule.getValidEndDate(data.ganttProperties);
                }
            } else {
                taskbar.unscheduleStarteDate = null;
                taskbar.unscheduleEndDate = null;
            }
            taskbar.startDate = ganttProp.startDate;
            taskbar.endDate = ganttProp.endDate;
            taskbar.height = this.parent.chartRowsModule.taskBarHeight;
            taskbar.isMilestone = ganttProp.isMilestone;
            taskbar.milestoneColor = new PdfColor(this.ganttStyle.taskbar.milestoneColor);
            taskbar.isParentTask = data.hasChildRecords;
            if (ganttProp.isMilestone) {
                taskbar.height = ganttProp.width;
            }
            if (data[this.parent.labelSettings.leftLabel]) {
                taskbar.leftTaskLabel.value = data[this.parent.labelSettings.leftLabel].toString();
            }
            if (data[this.parent.labelSettings.rightLabel]) {
                taskbar.rightTaskLabel.value = data[this.parent.labelSettings.rightLabel].toString();
            }
            if (data[this.parent.labelSettings.taskLabel]) {
                taskbar.taskLabel = data[this.parent.labelSettings.taskLabel].toString();
            }
            const reduceLeft: number = ganttProp.isMilestone ? Math.floor(this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
            taskbar.rightTaskLabel.left = ganttProp.left + ganttProp.width + reduceLeft; // right label left value
            taskbar.fontFamily = this.ganttStyle.fontFamily;
            taskbar.progressWidth = ganttProp.progressWidth;
            taskbar.labelColor = new PdfColor(this.ganttStyle.label.fontColor);
            taskbar.progressFontColor = new PdfColor(this.ganttStyle.taskbar.progressFontColor);
            if (taskbar.isParentTask) {
                taskbar.taskColor = new PdfColor(this.ganttStyle.taskbar.parentTaskColor);
                taskbar.taskBorderColor = new PdfColor(this.ganttStyle.taskbar.parentTaskBorderColor);
                taskbar.progressColor = new PdfColor(this.ganttStyle.taskbar.parentProgressColor);
            } else {
                if(data.isCritical) {
                    taskbar.taskColor = new PdfColor(this.ganttStyle.taskbar.criticalTaskColor);
                    taskbar.progressColor = new PdfColor(this.ganttStyle.taskbar.criticalProgressColor);
                    taskbar.taskBorderColor = new PdfColor(this.ganttStyle.taskbar.criticalTaskBorderColor);
                }
                else {
                    taskbar.taskColor = new PdfColor(this.ganttStyle.taskbar.taskColor);
                    taskbar.progressColor = new PdfColor(this.ganttStyle.taskbar.progressColor);
                    taskbar.taskBorderColor = new PdfColor(this.ganttStyle.taskbar.taskBorderColor);
                }
            }
            taskbar.gridLineColor = new PdfColor(this.ganttStyle.chartGridLineColor);
            this.gantt.taskbarCollection.push(taskbar);
            const taskStyle: ITaskbarStyle   = {};
            taskStyle.progressFontColor = taskbar.progressFontColor;
            taskStyle.taskColor = taskbar.taskColor;
            taskStyle.taskBorderColor = taskbar.taskBorderColor;
            taskStyle.progressColor = taskbar.progressColor;
            taskStyle.milestoneColor = taskbar.milestoneColor;
            const args: PdfQueryTaskbarInfoEventArgs = {
                taskbar: taskStyle,
                data: data
            };
            if (this.parent.pdfQueryTaskbarInfo) {
                this.parent.trigger('pdfQueryTaskbarInfo', args);
                taskbar.progressFontColor = args.taskbar.progressFontColor;
                taskbar.taskColor = args.taskbar.taskColor;
                taskbar.taskBorderColor = args.taskbar.taskBorderColor;
                taskbar.progressColor = args.taskbar.progressColor;
                taskbar.milestoneColor = args.taskbar.milestoneColor;
            }
        });
    }
    /**
     * set text alignment of each columns in exporting grid
     *
     * @param {string} textAlign .
     * @param {PdfStringFormat} format .
     * @returns {PdfStringFormat} .
     * @private
     */
    private getHorizontalAlignment(textAlign: string, format?: PdfStringFormat): PdfStringFormat {
        if (format === undefined) {
            format = new PdfStringFormat();
        }
        switch (textAlign) {
        case 'Right':
            format.alignment = PdfTextAlignment.Right;
            break;
        case 'Center':
            format.alignment = PdfTextAlignment.Center;
            break;
        case 'Justify':
            format.alignment = PdfTextAlignment.Justify;
            break;
        case 'Left':
            format.alignment = PdfTextAlignment.Left;
            break;
        }
        return format;
    }
    /**
     * set vertical alignment of each columns in exporting grid
     *
     * @param {string} verticalAlign .
     * @param {PdfStringFormat} format .
     * @param {string} textAlign .
     * @returns {PdfStringFormat} .
     * @private
     */
    private getVerticalAlignment(verticalAlign: string, format?: PdfStringFormat, textAlign?: string): PdfStringFormat {
        if (format === undefined) {
            format = new PdfStringFormat();
            format = this.getHorizontalAlignment(textAlign, format);
        }
        switch (verticalAlign) {
        case 'Bottom':
            format.lineAlignment = PdfVerticalAlignment.Bottom;
            break;
        case 'Middle':
            format.lineAlignment = PdfVerticalAlignment.Middle;
            break;
        case 'Top':
            format.lineAlignment = PdfVerticalAlignment.Top;
            break;
        }
        return format;
    }

    private getFontFamily(fontFamily: string): number {
        switch (fontFamily) {
        case 'TimesRoman':
            return 2;
        case 'Courier':
            return 1;
        case 'Symbol':
            return 3;
        case 'ZapfDingbats':
            return 4;
        default:
            return 0;
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private getFont(content: any): PdfFont {
        if (content.font) {
            return content.font;
        }
        const fontSize: number = (!isNullOrUndefined(content.style.fontSize)) ? (content.style.fontSize * 0.75) : 9.75;

        const fontFamily: number = (!isNullOrUndefined(content.style.fontFamily)) ?
            (this.getFontFamily(content.style.fontFamily)) : PdfFontFamily.TimesRoman;

        let fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(content.style.bold) && content.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }

        if (!isNullOrUndefined(content.style.italic) && content.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }

        if (!isNullOrUndefined(content.style.underline) && content.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }

        if (!isNullOrUndefined(content.style.strikeout) && content.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }

        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    }
    private renderEmptyGantt(): void {
        const row: PdfTreeGridRow = this.gantt.rows.addRow();
        row.cells.getCell(0).isHeaderCell = false;
        row.height = pixelToPoint(this.parent.rowHeight);
        this.copyStyles(this.ganttStyle.columnHeader, row.cells.getCell(0), row.isParentRow);
        const count: number = this.columns.length;
        this.mergeCells(0, 0, count);
    }
    private mergeCells(rowIndex: number, colIndex: number, lastColIndex: number): void {
        this.gantt.rows.getRow(rowIndex).cells.getCell(colIndex).columnSpan = lastColIndex;
    }
    /* eslint-disable-next-line */
    private copyStyles(style: PdfGanttCellStyle, cell: PdfTreeGridCell, isParentRow: boolean): void {
        cell.style.fontColor = new PdfColor(style.fontColor);
        cell.style.backgroundColor = new PdfColor(style.backgroundColor);
        cell.style.borderColor = new PdfColor(style.borderColor);
        cell.style.fontSize = style.fontSize;
        cell.style.fontStyle = style.fontStyle;
        /* eslint-disable-next-line */
        cell.style.format  = (<any>Object).assign(new PdfStringFormat(), style.format);
        cell.style.borders = new PdfBorders();
        cell.style.borders.all = new PdfPen(cell.style.borderColor);
        cell.style.padding = new PdfPaddings();
        let padding: number = 0;
        if (cell.isHeaderCell) {
            padding = this.parent.timelineModule.isSingleTier ? 45 / 2 : 60 / 2;
        } else {
            padding = this.parent.rowHeight / 2;
        }
        cell.style.padding.top = padding - style.fontSize;
        cell.style.padding.bottom = padding - style.fontSize;
        cell.style.padding.left = 10;
        cell.style.padding.right = 10;
        if (style.padding) {
            cell.style.padding = style.padding;
        }
        if (style.borders) {
            cell.style.borders = style.borders;
        }
    }

    /**
     * @param {PdfDocument} pdfDoc .
     * @returns {void} .
     * @private
     */
    public initializePdf(pdfDoc: PdfDocument): void {
        this.pdfDoc = pdfDoc;
        const widths: number[] = [];
        const treeColumnIndex: number = 0;
        const tWidth: number = (this.pdfDoc.pageSettings.width - 82);
        if (this.totalColumnWidth > (this.pdfDoc.pageSettings.width - 82)) {
            this.gantt.style.allowHorizontalOverflow = true;
        } else if ((tWidth / this.columns.length) < widths[treeColumnIndex as number]) {
            this.gantt.columns.getColumn(treeColumnIndex as number).width = widths[treeColumnIndex as number];
        }
        if (this.exportProps.enableFooter || isNullOrUndefined(this.exportProps.enableFooter)) {
            //code for draw the footer content
            const bounds: RectangleF = new RectangleF(0, 0, pdfDoc.pageSettings.width, 35);
            const pen: PdfPen = new PdfPen(this.ganttStyle.chartGridLineColor);
            const footer: PdfPageTemplateElement = new PdfPageTemplateElement(bounds);
            const footerBrush: PdfBrush = new PdfSolidBrush(this.ganttStyle.footer.backgroundColor);
            footer.graphics.drawRectangle(pen, footerBrush, 0, 0, pdfDoc.pageSettings.width, 35);
            /* eslint-disable-next-line */
            const font: PdfFont = new PdfStandardFont(this.ganttStyle.fontFamily, this.ganttStyle.footer.fontSize, this.ganttStyle.footer.fontStyle);
            const brush: PdfBrush = new PdfSolidBrush(this.ganttStyle.footer.fontColor);
            const pageNumber: PdfPageNumberField = new PdfPageNumberField(font);
            const count: PdfPageCountField = new PdfPageCountField(font, brush);
            const compositeField: PdfCompositeField = new PdfCompositeField(font, brush, 'Page {0}', pageNumber, count);
            compositeField.stringFormat = this.ganttStyle.footer.format;
            compositeField.bounds = bounds;
            compositeField.draw(footer.graphics, new PointF(0, 0));
            pdfDoc.template.bottom = footer;
        }
    }
}
/**
 * @hidden
 * `ExportValueFormatter` for `PdfExport` & `ExcelExport`
 */
export class ExportValueFormatter {
    private internationalization: Internationalization;
    private valueFormatter: ValueFormatter;
    public constructor(culture: string) {
        this.valueFormatter = new ValueFormatter(culture);
        this.internationalization = new Internationalization(culture);
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private returnFormattedValue(args: any, customFormat: DateFormatOptions): string {
        if (!isNullOrUndefined(args.value) && args.value) {
            return this.valueFormatter.getFormatFunction(customFormat)(args.value);
        } else {
            return '';
        }
    }
    /**
     * @private
     */
    /* eslint-disable-next-line  */
    public formatCellValue(args: any): string {
        if (args.isForeignKey) {
            args.value = getValue(args.column.foreignKeyValue, getForeignData(args.column, {}, args.value)[0]);
        }
        if (args.column.type === 'number' && args.column.format !== undefined && args.column.format !== '') {
            return args.value ? this.internationalization.getNumberFormat({ format: args.column.format })(args.value) : '';
        } else if (args.column.type === 'boolean') {
            return args.value ? 'true' : 'false';
        } else if ((args.column.type === 'date' || args.column.type === 'datetime' || args.column.type === 'time') && args.column.format !== undefined) {
            if (typeof args.value === 'string') {
                args.value = new Date(args.value);
            }
            if (typeof args.column.format === 'string') {
                let format: DateFormatOptions;
                if (args.column.type === 'date') {
                    format = { type: 'date', format: args.column.format };
                } else if (args.column.type === 'time') {
                    format = { type: 'time', format: args.column.format };
                } else {
                    format = { type: 'dateTime', format: args.column.format };
                }
                return this.returnFormattedValue(args, format);
            } else {
                if (args.column.format instanceof Object && args.column.format.type === undefined) {
                    return (args.value.toString());
                } else {
                    let customFormat: DateFormatOptions;
                    if (args.column.type === 'date') {
                        /* eslint-disable-next-line max-len */
                        customFormat = { type: args.column.format.type, format: args.column.format.format, skeleton: args.column.format.skeleton };
                    } else if (args.column.type === 'time') {
                        customFormat = { type: 'time', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    } else {
                        customFormat = { type: 'dateTime', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    return this.returnFormattedValue(args, customFormat);
                }
            }
        } else {
            if ((!isNullOrUndefined(args.column.type) && !isNullOrUndefined(args.value)) || !isNullOrUndefined(args.value)) {
                return (args.value).toString();
            } else {
                return '';
            }
        }
    }
}
