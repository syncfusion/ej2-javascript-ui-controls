import { TaskFieldsModel } from './../models/task-fields-model.d';
import { PdfFontFamily, PdfTextWebLink } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfPageCountField, PdfPageNumberField } from '@syncfusion/ej2-pdf-export';
import { PdfPageTemplateElement, RectangleF, PdfCompositeField, PointF } from '@syncfusion/ej2-pdf-export';
import { PdfVerticalAlignment, PdfTextAlignment, PdfFont, PdfStandardFont, PdfTrueTypeFont } from '@syncfusion/ej2-pdf-export';
import { PdfFontStyle, PdfColor, PdfPen, PdfBrush, PdfSolidBrush, PdfDocument, SizeF, PdfBitmap  } from '@syncfusion/ej2-pdf-export';
import { PdfTreeGridColumn, PdfTreeGridRow, PdfTreeGridCell, PdfBorders, PdfPaddings } from './pdf-base/index';
import { ColumnModel } from './../models/column';
import { PdfPageNumberType, PdfDashStyle, ConstraintType } from '../base/enum';
import { PdfGantt } from './pdf-gantt';
import {
    IGanttData, PdfExportProperties, PdfQueryCellInfoEventArgs,
    ITaskData, IGanttStyle, IConnectorLineObject, PdfGanttCellStyle, ITaskbarStyle, PdfColumnHeaderQueryCellInfoEventArgs,
    PdfQueryTaskbarInfoEventArgs,
    ZoomTimelineSettings, PdfHeader, PdfHeaderFooterContent, ILabel , Image , ITemplateDetails,
    ITaskSegmentStyles
} from './../base/interface';
import { Gantt } from './../base/gantt';
import { isNullOrUndefined, DateFormatOptions, Internationalization, getValue, extend } from '@syncfusion/ej2-base';
import { getForeignData, PdfFooter, ValueFormatter } from '@syncfusion/ej2-grids';
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
    public exportProps: PdfExportProperties;
    private gantt: PdfGantt;
    private rowIndex: number;
    private colIndex: number;
    private row: PdfTreeGridRow;
    private columns: ColumnModel[];
    private ganttStyle: IGanttStyle;
    private pdfDoc: PdfDocument;
    private exportValueFormatter: ExportValueFormatter;
    private totalColumnWidth: number = 0;
    public beforeSinglePageExport: Object = {};
    public baselineHeight: number = 8;
    public baselineTop: number;
    public constructor(parent: Gantt) {
        this.parent = parent;
    }

    public processToFit(): void {
        this.beforeSinglePageExport['zoomingProjectStartDate'] = this.parent.zoomingProjectStartDate;
        this.beforeSinglePageExport['zoomingProjectEndDate'] = this.parent.zoomingProjectEndDate;
        this.beforeSinglePageExport['cloneProjectStartDate'] = this.parent.cloneProjectStartDate;
        this.beforeSinglePageExport['cloneProjectEndDate'] = this.parent.cloneProjectEndDate;
        this.beforeSinglePageExport['customTimelineSettings'] = extend({}, this.parent.timelineModule.customTimelineSettings, null, true);
        this.beforeSinglePageExport['isTimelineRoundOff'] = this.parent.isTimelineRoundOff;
        this.beforeSinglePageExport['topTier'] = this.parent.timelineModule.topTier;
        this.beforeSinglePageExport['topTierCellWidth'] = this.parent.timelineModule.topTierCellWidth;
        this.beforeSinglePageExport['topTierCollection'] = this.parent.timelineModule.topTierCollection;
        this.beforeSinglePageExport['bottomTier'] = this.parent.timelineModule.bottomTier;
        this.beforeSinglePageExport['bottomTierCellWidth'] = this.parent.timelineModule.bottomTierCellWidth;
        this.beforeSinglePageExport['bottomTierCollection'] = this.parent.timelineModule.bottomTierCollection;
        this.beforeSinglePageExport['totalTimelineWidth'] = this.parent.timelineModule.totalTimelineWidth;
        this.beforeSinglePageExport['timelineStartDate'] = this.parent.timelineModule.timelineStartDate;
        this.beforeSinglePageExport['timelineEndDate'] = this.parent.timelineModule.timelineEndDate;
        this.beforeSinglePageExport['timelineRoundOffEndDate'] = this.parent.timelineModule.timelineRoundOffEndDate;
        this.beforeSinglePageExport['perDayWidth'] = this.parent.perDayWidth;
        this.beforeSinglePageExport['updatedConnectorLineCollection'] = extend([], this.parent.updatedConnectorLineCollection, null, true);
        this.parent.timelineModule.isZoomToFit = true;
        this.parent.timelineModule.isZooming = false;
        if (!this.parent.zoomingProjectStartDate) {
            this.parent.zoomingProjectStartDate = this.parent.cloneProjectStartDate;
            this.parent.zoomingProjectEndDate = this.parent.cloneProjectEndDate;
        }
        if (this.parent.zoomingProjectStartDate > this.parent.cloneProjectStartDate) {
            this.parent.cloneProjectStartDate = new Date(this.parent.allowUnscheduledTasks ?
                this.parent.zoomingProjectStartDate : this.parent.cloneProjectStartDate);
        }
        if (isNullOrUndefined(this.parent.projectStartDate) && isNullOrUndefined(this.parent.projectEndDate)) {
            this.parent.dataOperation.calculateProjectDates();
        }
        const timeDifference: number = (this.parent.cloneProjectEndDate.getTime() - this.parent.cloneProjectStartDate.getTime());
        const totalDays: number = (timeDifference / (1000 * 3600 * 24));
        let chartsideWidth: number;
        let gridWidth: number;
        if (this.exportProps.fitToWidthSettings.gridWidth) {
            gridWidth = parseInt(this.exportProps.fitToWidthSettings.gridWidth.split('%')[0], 10);
            gridWidth = gridWidth > 100 ? 100 : gridWidth;
        }
        if (this.exportProps.fitToWidthSettings.chartWidth) {
            chartsideWidth = parseInt(this.exportProps.fitToWidthSettings.chartWidth.split('%')[0], 10);
            chartsideWidth = chartsideWidth > 100 ? 100 : chartsideWidth;
        }
        else {
            if (this.exportProps.fitToWidthSettings.gridWidth) {
                chartsideWidth = 100 - gridWidth;
            }
            else {
                chartsideWidth = 70;
            }
        }
        const pdfwidth: number = (this.parent.pdfExportModule['pdfPageDimensions'].width * chartsideWidth) / 100;
        const chartWidth: number = pdfwidth;
        const perDayWidth: number = chartWidth / totalDays;
        let zoomingLevel: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        let secondValue: ZoomTimelineSettings;
        const zoomingCollections: ZoomTimelineSettings[] = [...this.parent.zoomingLevels];
        const sortedCollectons: ZoomTimelineSettings[] = zoomingCollections.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings) =>
            (!a.perDayWidth && !b.perDayWidth ? 0 : (a.perDayWidth < b.perDayWidth) ? 1 : -1));
        if (perDayWidth === 0) { // return when the Gantt chart is not in viewable state.
            return;
        }
        for (let i: number = 0; i < sortedCollectons.length; i++) {
            firstValue = sortedCollectons[i as number];
            if (i === sortedCollectons.length - 1) {
                zoomingLevel = sortedCollectons[i as number];
                break;
            } else {
                secondValue = sortedCollectons[i + 1];
            }
            if (perDayWidth >= firstValue.perDayWidth) {
                zoomingLevel = sortedCollectons[i as number];
                break;
            }
            if (perDayWidth < firstValue.perDayWidth && perDayWidth > secondValue.perDayWidth) {
                zoomingLevel = sortedCollectons[i + 1];
                break;
            }
        }
        const newTimeline: ZoomTimelineSettings = extend({}, {}, zoomingLevel, true);
        if (isNullOrUndefined(this.parent.projectStartDate)) {
            this.parent.timelineModule['roundOffDateToZoom'](this.parent.cloneProjectStartDate, true, perDayWidth, newTimeline.bottomTier.unit, zoomingLevel);
        }
        if (isNullOrUndefined(this.parent.projectEndDate)) {
            this.parent.timelineModule['roundOffDateToZoom'](this.parent.cloneProjectEndDate, false, perDayWidth, newTimeline.bottomTier.unit, zoomingLevel);
        }
        const numberOfCells: number = this.parent.timelineModule['calculateNumberOfTimelineCells'](newTimeline);
        const scrollHeight: number = this.parent.pdfExportModule['pdfPageDimensions'].height; //17 is horizontal scrollbar width
        const emptySpace: number = scrollHeight <= 0 ? 0 : 17;
        newTimeline.timelineUnitSize = Math.abs((chartWidth - emptySpace)) / numberOfCells;
        this.parent.timelineModule['changeTimelineSettings'](newTimeline);
        this.parent.timelineModule.isZoomToFit = false;
        this.parent.timelineModule.isZooming = false;
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
        this.parent.pdfExportModule.isPdfExport = true;
        if (this.exportProps.fitToWidthSettings && this.exportProps.fitToWidthSettings.isFitToWidth) {
            this.processToFit();
        }
        this.processHeaderContent();
        this.processGanttContent();
        this.processTimeline();
        this.processTaskbar();
        this.processPredecessor();
        this.parent.pdfExportModule.isPdfExport = false;
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
        const colFieldName : string = this.columns[this.parent.treeColumnIndex].field;
        if (colFieldName === column.field) {
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
        if (this.ganttStyle && this.ganttStyle.columnHeader &&
            !isNullOrUndefined(this.ganttStyle.columnHeader.fontBrush)) {
            cell.style.fontBrush = new PdfColor(this.ganttStyle.columnHeader.fontBrush);
        }
        const treeGridHeaderHeight: number = this.parent.timelineModule.isSingleTier ? 45 : 60;
        this.copyStyles(this.ganttStyle.columnHeader, cell, false);
        this.row.height = pixelToPoint(treeGridHeaderHeight);
        if (column.headerTextAlign) {
            cell.style.format.alignment = PdfTextAlignment[column.headerTextAlign];
        }
        const template: ITemplateDetails = {
            image: null,
            value: null,
            fontStyle: { fontBrush: null }
        };
        cell.fontStyle = {
            fontSize: 9
        };
        const args: PdfColumnHeaderQueryCellInfoEventArgs = {
            cell: cell,
            style: cell.style,
            value: cell.value,
            column: column,
            image: null,
            headerTemplate: template
        };
        if (this.parent.pdfColumnHeaderQueryCellInfo) {
            this.parent.trigger('pdfColumnHeaderQueryCellInfo', args);
        }
        if (args.headerTemplate.image && args.headerTemplate.value) {
            args.image = new PdfBitmap(args.headerTemplate.image[0].base64);
            args.image.height = (<{ height?: number }>args.headerTemplate.image[0]).height || args.image.height;
            args.image.width = (<{ width?: number }>args.headerTemplate.image[0]).width || args.image.width;
            cell.image = args.image;
            cell.value = args.headerTemplate.value;
            cell.fontStyle.fontSize = args.headerTemplate.fontStyle.fontSize;
            cell.fontStyle.fontFamily = args.headerTemplate.fontStyle.fontFamily;
            cell.fontStyle.fontBrush = args.headerTemplate.fontStyle.fontColor;
        }
        else {
            cell.value = args.value;
        }
    }

    private isColumnVisible(column: ColumnModel): boolean {
        const visibleColumn: boolean = column.visible || this.exportProps.includeHiddenColumn;
        return (visibleColumn);
    }

    private processGanttContent(): void {
        if (this.flatData.length === 0) {
            this.renderEmptyGantt();
        } else {
            const flatData: IGanttData[] = this.flatData;
            flatData.forEach((data: IGanttData) => {
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
        if (this.parent.enableTimelineVirtualization) {
            this.parent.timelineModule.pdfExportTopTierCollection = [];
            this.parent.timelineModule.pdfExportBottomTierCollection = [];
            this.parent.timelineModule.createTimelineSeries();
        }
        const timelineSettings: Timeline = this.parent.timelineModule;
        this.gantt.chartHeader.topTierHeight = this.gantt.chartHeader.bottomTierHeight
            = (this.parent.timelineModule.isSingleTier ? 45 : 60 / 2);
        this.gantt.chartHeader.topTierCellWidth = timelineSettings.topTierCellWidth;
        this.gantt.chartHeader.bottomTierCellWidth = timelineSettings.bottomTierCellWidth;
        this.gantt.chartHeader.topTier = extend([], [], this.parent.enableTimelineVirtualization ?
            timelineSettings.pdfExportTopTierCollection : timelineSettings.topTierCollection, true) as [];
        this.gantt.chartHeader.bottomTier = extend([], [], this.parent.enableTimelineVirtualization ?
            timelineSettings.pdfExportBottomTierCollection : timelineSettings.bottomTierCollection, true) as [];
        if (this.exportProps && this.exportProps.fitToWidthSettings && this.exportProps.fitToWidthSettings.isFitToWidth &&
            this.parent.enableTimelineVirtualization) {
            const tier: string = timelineSettings.topTier === 'None' ? 'bottomTier' : 'topTier';
            this.gantt.chartHeader.width = timelineSettings['calculateWidthBetweenTwoDate'](tier, timelineSettings.timelineStartDate, timelineSettings.timelineEndDate);
        }
        else {
            this.gantt.chartHeader.width = this.parent.enableTimelineVirtualization ? this.parent.timelineModule.wholeTimelineWidth :
                timelineSettings.totalTimelineWidth;
        }
        this.gantt.chartHeader.height = !isNullOrUndefined(this.gantt.rows.getRow(0).height) ? this.gantt.rows.getRow(0).height : 65;
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
            this.parent.predecessorModule.createConnectorLinesCollection(this.flatData);
            this.parent.updatedConnectorLineCollection.forEach((data: IConnectorLineObject) => {
                const predecessor: PdfGanttPredecessor = this.gantt.predecessor.add();
                predecessor.parentLeft = data.parentLeft;
                predecessor.childLeft = data.childLeft;
                predecessor.parentWidth = data.parentWidth;
                predecessor.childWidth = data.childWidth;
                predecessor.parentIndex = this.findIndexUsingParent(this.flatData, data.parentIndex);
                predecessor.childIndex = this.findIndexUsingParent(this.flatData, data.childIndex);
                predecessor.rowHeight = data.rowHeight;
                predecessor.type = data.type;
                predecessor.milestoneParent = data.milestoneParent;
                predecessor.milestoneChild = data.milestoneChild;
                predecessor.parentEndPoint = data.parentEndPoint;
                predecessor.lineWidth = this.parent.connectorLineWidth > 5 ? pixelToPoint(5) : pixelToPoint(this.parent.connectorLineWidth);
                if (data.isCritical) {
                    predecessor.connectorLineColor = this.ganttStyle.criticalConnectorLineColor;
                }
                else {
                    predecessor.connectorLineColor = this.ganttStyle.connectorLineColor;
                }
                this.gantt.predecessorCollection.push(predecessor);
            });
            this.parent.pdfExportModule.isPdfExport = false;
        }
    }

    public findIndexUsingParent(expandedRecord: IGanttData[], parentIndex: number): number {
        return expandedRecord.findIndex((data: IGanttData) => data.index === parentIndex);
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
        }
        else if (column.field === taskFields.baselineDuration) {
            cell.value = this.parent.getDurationString(ganttProps.baselineDuration, ganttProps.durationUnit);
        } else if (column.field === taskFields.resourceInfo) {
            cell.value = ganttProps.resourceNames;
        } else if (column.field === taskFields.work) {
            cell.value = this.parent.getWorkString(ganttProps.work, ganttProps.workUnit);
        } else {
            cell.value = !isNullOrUndefined(data[column.field]) ? (column.type === 'number' ?  data[column.field] : data[column.field].toString()) : '';
        }
        const cellValueString: string | number = !isNullOrUndefined(cell.value) ? (column.type === 'number'  ? (cell.value as number) : cell.value.toString()) : '';
        const cellValue: string | number = cellValueString;
        const value: string | number = !isNullOrUndefined(cellValue) ? cellValue : '';
        cell.isHeaderCell = false;
        cell.style.padding = new PdfPaddings();
        this.copyStyles(this.ganttStyle.cell, cell, row.isParentRow);
        if (column['index'] !== this.parent.treeColumnIndex) {
            cell.style.format.alignment = PdfTextAlignment[column.textAlign];
        } else {
            cell.style.format.paragraphIndent = cell.row.level * 10;
        }
        const args: PdfQueryCellInfoEventArgs = {
            data: data,
            value: value,
            column: column,
            style: cell.style,
            cell: cell
        };
        args.value = this.exportValueFormatter.formatCellValue(args, this.parent);
        if (this.parent.pdfQueryCellInfo) {
            this.parent.trigger('pdfQueryCellInfo', args);
            if (args.style.backgroundColor) {
                cell.style.backgroundColor = args.style.backgroundColor;
            }
            if (args.style.borderColor) {
                cell.style.borderColor = args.style.borderColor;
            }
            if (args.style.fontBrush) {
                cell.style.fontBrush = args.style.fontBrush;
            }
            if (args.style.fontColor) {
                cell.style.fontColor = args.style.fontColor;
            }
            if (args.style.fontFamily) {
                const font: any = args.style.fontFamily;
                const fontFamily: number = this.getFontFamily(font);
                cell.style.fontFamily = fontFamily;
            }
            else {
                cell.style.fontFamily = this.ganttStyle.fontFamily;
            }
            if (args.style.fontSize) {
                cell.style.fontSize = args.style.fontSize;
            }
            if (args.style.fontStyle) {
                const style: any = args.style.fontStyle;
                const fontStyle: number = this.getFontStyle(style);
                cell.style.fontStyle = fontStyle;
            }
            else {
                cell.style.fontStyle = this.ganttStyle.footer.fontStyle;
            }
            if (args.style.format) {
                cell.style.format = args.style.format;
            }
            if (args.style.padding) {
                cell.style.padding = args.style.padding;
            }
        }
        if (!isNullOrUndefined(args.image) && !isNullOrUndefined(args.image.base64)) {
            const dimension: Object = extend({}, args.image, null, true);
            args.image = new PdfBitmap(args.image.base64) as any;
            args.image.height = dimension['height'] ?  dimension['height'] : (<{ height?: number }>args.image).height;
            args.image.width = dimension['width'] ? dimension['width'] : (<{ width?: number }>args.image).width;
            cell.image = args.image as any;
        }
        cell.value = args.value;
        if (!isNullOrUndefined(args.hyperLink) && (!isNullOrUndefined(args.hyperLink.displayText) ||
        !isNullOrUndefined(args.hyperLink.target))) {
            cell.value = this.setHyperLink(args);
        }
    }
    private setHyperLink(args: PdfQueryCellInfoEventArgs): PdfTextWebLink {
        // create the Text Web Link
        const textLink: PdfTextWebLink = new PdfTextWebLink();
        // set the hyperlink
        textLink.url = args.hyperLink.target;
        // set the link text
        textLink.text = args.hyperLink.displayText || args.hyperLink.target;
        // set the font
        textLink.font = new PdfStandardFont(PdfFontFamily.Helvetica, 9.75);
        // set the brush and pen for the text color
        textLink.brush = new PdfSolidBrush(new PdfColor(51, 102, 187));
        return textLink;
    }
    /**
     * Method for create the taskbar collection for rendering
     *
     * @returns {void} .
     */
    private processTaskbar(): void {
        const flatData: IGanttData[] = this.flatData;
        flatData.forEach((data: IGanttData) => {
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
            }
            // else {
            //     taskbar.unscheduleStarteDate = null;
            //     taskbar.unscheduleEndDate = null;
            // }
            taskbar.startDate = ganttProp.startDate;
            taskbar.endDate = ganttProp.endDate;
            taskbar.height = this.parent.chartRowsModule.taskBarHeight;
            // if (this.parent.renderBaseline) {
            //     let height: number;
            //     if ((taskbar.height + this.baselineHeight) <= this.parent.rowHeight) {
            //         height = taskbar.height;
            //     } else {
            //         height = taskbar.height - (this.baselineHeight + 1);
            //     }
            //     taskbar.height = height;
            // }
            taskbar.indicators = ganttProp.indicators;
            taskbar.autoStartDate = ganttProp.autoStartDate;
            taskbar.autoEndDate = ganttProp.autoEndDate;
            taskbar.isAutoSchedule = ganttProp.isAutoSchedule;
            taskbar.autoWidth = ganttProp.autoWidth;
            taskbar.autoLeft = ganttProp.autoLeft;
            taskbar.segment = ganttProp.segments;
            taskbar.isSpliterTask = (isNullOrUndefined(ganttProp.segments) || ganttProp.segments.length === 0) ? false : true;
            if (taskbar.isSpliterTask) {
                taskbar.segmentCollection = taskbar.segment.map((obj: ITaskData ) => ({ ...obj })); }
            taskbar.baselineTop = this.parent.chartRowsModule.baselineTop;
            taskbar.isMilestone = ganttProp.isMilestone;
            taskbar.baselineStartDate = ganttProp.baselineStartDate;
            taskbar.baselineEndDate = ganttProp.baselineEndDate;
            taskbar.baselineLeft = ganttProp.baselineLeft;
            taskbar.baselineWidth = ganttProp.baselineWidth;
            if (taskbar.baselineLeft < 0) {
                taskbar.baselineWidth = taskbar.baselineWidth + taskbar.baselineLeft;
                taskbar.baselineLeft = 0;
            }
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
            if (!isNullOrUndefined(data[this.parent.labelSettings.taskLabel])) {
                taskbar.taskLabel = data[this.parent.labelSettings.taskLabel].toString();
            }
            const reduceLeft: number = ganttProp.isMilestone ? Math.floor(this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
            const isManualParent: boolean = !(data.hasChildRecords && !data.ganttProperties.isAutoSchedule);
            const baseLeft: number = isManualParent ? ganttProp.left : ganttProp.autoLeft;
            const baseWidth: number = isManualParent ? ganttProp.width : ganttProp.autoWidth;
            taskbar.rightTaskLabel.left = baseLeft + baseWidth + reduceLeft; // right label left value
            taskbar.fontFamily = this.ganttStyle.fontFamily;
            taskbar.progressWidth = ganttProp.progressWidth;
            taskbar.labelColor = new PdfColor(this.ganttStyle.label.fontColor);
            taskbar.progressFontColor = new PdfColor(this.ganttStyle.taskbar.progressFontColor);
            if (taskbar.isParentTask) {
                taskbar.taskColor = new PdfColor(this.ganttStyle.taskbar.parentTaskColor);
                taskbar.taskBorderColor = new PdfColor(this.ganttStyle.taskbar.parentTaskBorderColor);
                taskbar.progressColor = new PdfColor(this.ganttStyle.taskbar.parentProgressColor);
            } else {
                if (data.isCritical) {
                    taskbar.taskColor = new PdfColor(this.ganttStyle.taskbar.criticalTaskColor);
                    taskbar.progressColor = new PdfColor(this.ganttStyle.taskbar.criticalProgressColor);
                    taskbar.taskBorderColor = new PdfColor(this.ganttStyle.taskbar.criticalTaskBorderColor);
                    taskbar.milestoneColor = new PdfColor(this.ganttStyle.taskbar.criticalTaskColor);
                }
                else {
                    taskbar.taskColor = new PdfColor(this.ganttStyle.taskbar.taskColor);
                    taskbar.progressColor = new PdfColor(this.ganttStyle.taskbar.progressColor);
                    taskbar.taskBorderColor = new PdfColor(this.ganttStyle.taskbar.taskBorderColor);
                }
            }
            taskbar.manualParentBorder = new PdfColor(this.ganttStyle.taskbar.manualParentBorder);
            taskbar.manualChildBorder = new PdfColor(this.ganttStyle.taskbar.manualChildBorder);
            taskbar.manuallineColor = new PdfColor(this.ganttStyle.taskbar.manualLineColor);
            taskbar.unscheduledTaskBarColor = new PdfColor(this.ganttStyle.taskbar.unscheduledTaskBarColor);
            taskbar.manualParentBackground = new PdfColor(this.ganttStyle.taskbar.manualParentBackground);
            taskbar.manualParentProgress = new PdfColor(this.ganttStyle.taskbar.manualParentProgress);
            taskbar.manualChildBackground = new PdfColor(this.ganttStyle.taskbar.manualChildBackground);
            taskbar.manualChildProgress = new PdfColor(this.ganttStyle.taskbar.manualChildProgress);
            taskbar.splitLineBackground = new PdfColor(this.ganttStyle.taskbar.splitLineBackground);
            taskbar.baselineColor = new PdfColor(this.ganttStyle.taskbar.baselineColor);
            taskbar.baselineBorderColor = new PdfColor(this.ganttStyle.taskbar.baselineBorderColor);
            taskbar.gridLineColor = new PdfColor(this.ganttStyle.chartGridLineColor);
            const labelTemplateStyle: ILabel = {};
            labelTemplateStyle.leftLabel = { value: null, image: null, fontStyle: { fontBrush: null } };
            labelTemplateStyle.rightLabel = { value: null, image: null, fontStyle: { fontBrush: null } };
            labelTemplateStyle.taskLabel = { value: null, image: null, fontStyle: { fontBrush: null } };
            taskbar.labelSettings = labelTemplateStyle;
            const taskbarTemplate: ITemplateDetails = {
                value: null,
                image: null,
                fontStyle: { fontBrush: null }
            };
            taskbar.taskbarTemplate = taskbarTemplate;
            this.gantt.taskbarCollection.push(taskbar);
            const taskStyle: ITaskbarStyle = {};
            taskStyle.progressFontColor = taskbar.progressFontColor;
            taskStyle.taskColor = taskbar.taskColor;
            taskStyle.taskBorderColor = taskbar.taskBorderColor;
            taskStyle.progressColor = taskbar.progressColor;
            taskStyle.milestoneColor = taskbar.milestoneColor;
            taskStyle.baselineColor = taskbar.baselineColor;
            taskStyle.baselineBorderColor = taskbar.baselineBorderColor;
            taskStyle.unscheduledTaskBarColor = taskbar.unscheduledTaskBarColor;
            taskStyle.manualParentBackground = taskbar.manualParentBackground;
            taskStyle.manualParentBorder = taskbar.manualParentBorder;
            taskStyle.manualParentProgress = taskbar.manualParentProgress;
            taskStyle.manualChildBackground = taskbar.manualChildBackground;
            taskStyle.manualChildProgress = taskbar.manualChildProgress;
            taskStyle.manualLineColor = taskbar.manuallineColor;
            taskStyle.manualChildBorder = taskbar.manualChildBorder;
            taskStyle.manualChildProgress = taskbar.manualChildProgress;
            taskStyle.splitLineBackground = taskbar.splitLineBackground;
            const args: PdfQueryTaskbarInfoEventArgs = {
                taskbar: taskStyle,
                data: data,
                indicators: data.ganttProperties.indicators,
                labelSettings: labelTemplateStyle,
                taskbarTemplate: taskbarTemplate
            };
            if (this.parent.pdfQueryTaskbarInfo) {
                const segmentCollection: ITaskSegmentStyles  [] = [];
                args.taskbar.taskSegmentStyles  = null;
                if (args.data.ganttProperties.segments) {
                    for (let i: number = 0; i < args.data.ganttProperties.segments.length; i++) {
                        const segmentTaskbar: ITaskSegmentStyles   = {
                            taskColor: args.taskbar.taskColor,
                            taskBorderColor: args.taskbar.taskBorderColor,
                            progressColor: args.taskbar.progressColor
                        };
                        segmentCollection.push(segmentTaskbar);
                    }
                    args.taskbar.taskSegmentStyles  = segmentCollection;
                }
                this.parent.trigger('pdfQueryTaskbarInfo', args);
                taskbar.taskSegmentStyles  = args.taskbar.taskSegmentStyles ;
                taskbar.progressFontColor = args.taskbar.progressFontColor;
                taskbar.taskColor = args.taskbar.taskColor;
                taskbar.taskBorderColor = args.taskbar.taskBorderColor;
                taskbar.progressColor = args.taskbar.progressColor;
                taskbar.milestoneColor = args.taskbar.milestoneColor;
                taskbar.baselineColor = args.taskbar.baselineColor;
                taskbar.baselineBorderColor = args.taskbar.baselineBorderColor;
                taskbar.unscheduledTaskBarColor = args.taskbar.unscheduledTaskBarColor;
                taskbar.manualParentBackground = args.taskbar.manualParentBackground;
                taskbar.manualParentProgress = args.taskbar.manualParentProgress;
                taskbar.manualParentBorder = args.taskbar.manualParentBorder;
                taskbar.manualChildBackground = args.taskbar.manualChildBackground;
                taskbar.manualChildProgress = args.taskbar.manualChildProgress;
                taskbar.manuallineColor = args.taskbar.manualLineColor;
                taskbar.manualChildBorder = args.taskbar.manualChildBorder;
                taskbar.manualChildProgress = args.taskbar.manualChildProgress;
                taskbar.splitLineBackground = args.taskbar.splitLineBackground;
                taskbar.indicators = args.indicators;
                taskbar.labelSettings.leftLabel.value = args.labelSettings.leftLabel.value;
                const leftImages: Image[] = args.labelSettings.leftLabel.image;
                taskbar.labelSettings.rightLabel.value = args.labelSettings.rightLabel.value;
                const rightImage: Image[] = args.labelSettings.rightLabel.image;
                if (!isNullOrUndefined(args.labelSettings.taskLabel.value)) {
                    taskbar.taskLabel = args.labelSettings.taskLabel.value;
                }
                if (!isNullOrUndefined(args.labelSettings.leftLabel.image) && Array.isArray(args.labelSettings.leftLabel.image[0].base64)
                    && args.labelSettings.leftLabel.image[0].base64.length > 0) {
                    const baseCount: number = args.labelSettings.leftLabel.image[0].base64.length;
                    taskbar.labelSettings.leftLabel.image = [];
                    for (let i: number = 0; i < baseCount; i++) {
                        // Create separate objects for each element of the base64 array
                        taskbar.labelSettings.leftLabel.image.push({
                            base64: leftImages[0].base64[i as number],
                            width: leftImages[0].width,
                            height: leftImages[0].height
                        });
                    }
                } else if (!isNullOrUndefined(args.labelSettings.leftLabel.image)) {
                    taskbar.labelSettings.leftLabel.image = args.labelSettings.leftLabel.image;
                }
                if (!isNullOrUndefined(args.labelSettings.rightLabel.image) && Array.isArray(args.labelSettings.rightLabel.image[0].base64)
                    && args.labelSettings.rightLabel.image[0].base64.length > 0) {
                    const baseCount: number = args.labelSettings.rightLabel.image[0].base64.length;
                    taskbar.labelSettings.rightLabel.image = [];
                    for (let i: number = 0; i < baseCount; i++) {
                        // Create separate objects for each element of the base64 array
                        taskbar.labelSettings.rightLabel.image.push({
                            base64: rightImage[0].base64[i as number],
                            width: rightImage[0].width,
                            height: rightImage[0].height
                        });
                    }
                } else if (!isNullOrUndefined(args.labelSettings.rightLabel.image)) {
                    taskbar.labelSettings.rightLabel.image = args.labelSettings.rightLabel.image;
                }
                /* eslint-disable-next-line */
                const applyTemplate: any = (target: PdfGanttTaskbarCollection, source: PdfQueryTaskbarInfoEventArgs) => {
                    target.progressFontColor = source.taskbar.progressFontColor;
                    target.taskColor = new PdfColor(source.taskbar.taskColor);
                    target.taskBorderColor = source.taskbar.taskBorderColor;
                    target.progressColor = source.taskbar.progressColor;
                    target.milestoneColor = source.taskbar.milestoneColor;
                    if (!isNullOrUndefined(source.taskbarTemplate.image) && !isNullOrUndefined(source.taskbarTemplate.image[0].base64)) {
                        const width: number = source.taskbarTemplate.image[0].width;
                        const milestoneHeight: number = taskbar.isMilestone ? ((source.taskbarTemplate.image[0].height <
                            (this.parent.chartRowsModule.taskBarHeight * 0.7)) ? source.taskbarTemplate.image[0].height :
                            (this.parent.chartRowsModule.taskBarHeight * 0.7) - 2) : (this.parent.chartRowsModule.taskBarHeight * 0.7) - 2;
                        const taskbarHeight: number = !isNullOrUndefined(source.taskbarTemplate.image[0].height) ?
                            ((source.taskbarTemplate.image[0].height < taskbar.height) ?
                                source.taskbarTemplate.image[0].height : taskbar.height - 2) : taskbar.height - 2;
                        const height: number = taskbar.isMilestone ? milestoneHeight : taskbarHeight;
                        target.taskbarTemplate.image = source.taskbarTemplate.image;
                        target.taskbarTemplate.image[0].width = width;
                        target.taskbarTemplate.image[0].height = height;
                    }
                    if (!isNullOrUndefined(source.taskbarTemplate.value)) {
                        target.taskbarTemplate.value = source.taskbarTemplate.value;
                        target.taskbarTemplate.value = source.taskbarTemplate.value;
                        target.taskbarTemplate.fontStyle.fontColor = source.taskbarTemplate.fontStyle.fontColor;
                        target.taskbarTemplate.fontStyle.fontSize = source.taskbarTemplate.fontStyle.fontSize;
                        target.taskbarTemplate.fontStyle.fontFamily = source.taskbarTemplate.fontStyle.fontFamily;
                        target.taskbarTemplate.fontStyle.fontStyle = source.taskbarTemplate.fontStyle.fontStyle;
                        target.taskbarTemplate.fontStyle.fontBrush = source.taskbarTemplate.fontStyle.fontBrush;
                    }
                };
                if (!args.data.hasChildRecords && args.data.ganttProperties.duration !== 0) {
                    applyTemplate(taskbar, args);
                } else if (args.data.hasChildRecords && args.data.ganttProperties.duration !== 0) {
                    applyTemplate(taskbar, args);
                } else if (args.data.ganttProperties.duration === 0) {
                    applyTemplate(taskbar, args);
                }

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
    private getFontStyle(fontStyle: string): number {
        switch (fontStyle) {
        case 'Strikeout':
            return 8;
        case 'Underline':
            return 4;
        case 'Italic':
            return 2;
        case 'Bold':
            return 1;
        default:
            return 0;
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private getFont(content: any): PdfFont {
        if (content.font) {
            return content.font;
        }
        const defaultFontFamily: PdfFontFamily = this.exportProps.ganttStyle && this.exportProps.ganttStyle.fontFamily ?
            this.exportProps.ganttStyle.fontFamily : PdfFontFamily.TimesRoman;
        const fontSize: number = (!isNullOrUndefined(content.style.fontSize)) ? (content.style.fontSize * 0.75) : 9.75;
        const fontFamily: number = (!isNullOrUndefined(content.style.fontFamily)) ?
            (this.getFontFamily(content.style.fontFamily)) : defaultFontFamily;
        const fontStyle: PdfFontStyle = PdfFontStyle.Regular;
        // if (!isNullOrUndefined(content.style.bold) && content.style.bold) {
        //     fontStyle |= PdfFontStyle.Bold;
        // }

        // if (!isNullOrUndefined(content.style.italic) && content.style.italic) {
        //     fontStyle |= PdfFontStyle.Italic;
        // }

        // if (!isNullOrUndefined(content.style.underline) && content.style.underline) {
        //     fontStyle |= PdfFontStyle.Underline;
        // }

        // if (!isNullOrUndefined(content.style.strikeout) && content.style.strikeout) {
        //     fontStyle |= PdfFontStyle.Strikeout;
        // }
        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    }
    private renderEmptyGantt(): void {
        const row: PdfTreeGridRow = this.gantt.rows.addRow();
        if (row.cells.count === 0) {
            row.cells.add();
        }
        row.cells.getCell(0).isHeaderCell = false;
        row.height = pixelToPoint(this.parent.rowHeight);
        this.copyStyles(this.ganttStyle.columnHeader, row.cells.getCell(0), row.isParentRow);
        const count: number = this.columns.length;
        row.cells.getCell(0).value = this.parent.localeObj.getConstant('emptyRecord');
        this.mergeCells(1, 0, count);
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
        cell.style.format = (<any>Object).assign(new PdfStringFormat(), style.format);
        cell.style.borders = new PdfBorders();
        cell.style.borders.all = new PdfPen(cell.style.borderColor);
        cell.style.padding = new PdfPaddings();
        let padding: number = 0;
        if (cell.isHeaderCell) {
            padding = this.parent.timelineModule.isSingleTier ? 45 / 2 : 60 / 2;
            cell.style.padding.top = (padding - style.fontSize > 0) ? padding - style.fontSize : padding;
        } else {
            padding = this.parent.rowHeight / 2;
            cell.style.padding.top = padding;
        }
        cell.style.padding.bottom = (padding - style.fontSize > 0) ? padding - style.fontSize : 0;
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
        if (this.exportProps && this.exportProps.fitToWidthSettings && this.exportProps.fitToWidthSettings.isFitToWidth) {
            let gridWidth: number;
            if (this.exportProps.fitToWidthSettings.gridWidth) {
                gridWidth = parseInt(this.exportProps.fitToWidthSettings.gridWidth.split('%')[0], 10);
            }
            else {
                if (this.exportProps.fitToWidthSettings.chartWidth) {
                    const chartWidth: number = parseInt(this.exportProps.fitToWidthSettings.chartWidth.split('%')[0], 10);
                    gridWidth = 100 - chartWidth;
                }
                else {
                    gridWidth = 30;
                }
            }
            const pdfwidth: number = (this.parent.pdfExportModule['pdfPageDimensions'].width * gridWidth) / 100;
            const perColumnWidth: number = pdfwidth / this.gantt.columns.columns.length;
            for (let i: number = 0; i < this.gantt.columns.columns.length; i++) {
                this.gantt.columns.getColumn(i as number).width = perColumnWidth;
            }
        }
        /* eslint-disable-next-line */
        const PdfPage: any = this.parent.pdfExportModule.pdfPage;
        if (this.totalColumnWidth > (this.pdfDoc.pageSettings.width - 82) && this.totalColumnWidth < PdfPage.getClientSize().width) {
            this.gantt.style.allowHorizontalOverflow = true;
        } else if ((tWidth / this.columns.length) < widths[treeColumnIndex as number]) {
            this.gantt.columns.getColumn(treeColumnIndex as number).width = widths[treeColumnIndex as number];
        }
        if (this.exportProps.enableFooter || isNullOrUndefined(this.exportProps.enableFooter)) {
            //code for draw the footer content
            const pageSize: SizeF = this.parent.pdfExportModule.getPageSize(this.exportProps.pageSize);
            const bounds: RectangleF = new RectangleF(0, 0, pageSize.width, 35);
            const pen: PdfPen = new PdfPen(this.ganttStyle.footer.borderColor);
            const footer: PdfPageTemplateElement = new PdfPageTemplateElement(bounds);
            const footerBrush: PdfBrush = new PdfSolidBrush(this.ganttStyle.footer.backgroundColor);
            footer.graphics.drawRectangle(pen, footerBrush, 0, 0, pageSize.width, 35);
            /* eslint-disable-next-line */
            let font: PdfTrueTypeFont | PdfStandardFont = new PdfStandardFont(this.ganttStyle.fontFamily, this.ganttStyle.footer.fontSize, this.ganttStyle.footer.fontStyle);
            if (this.ganttStyle.font) {
                font = this.ganttStyle.font;
            }
            const brush: PdfBrush = new PdfSolidBrush(this.ganttStyle.footer.fontColor);
            const pageNumber: PdfPageNumberField = new PdfPageNumberField(font);
            const count: PdfPageCountField = new PdfPageCountField(font, brush);
            const compositeField: PdfCompositeField = new PdfCompositeField(font, brush, 'Page {0}', pageNumber, count);
            compositeField.stringFormat = this.ganttStyle.footer.format;
            compositeField.bounds = bounds;
            compositeField.draw(footer.graphics, new PointF(0, 0));
            pdfDoc.template.bottom = footer;
        }
        /* eslint-disable-next-line */
        const pageSize: any = PdfPage.size;
        const clientSize: SizeF = !isNullOrUndefined(pageSize) ?  pageSize : this.pdfDoc.pageSettings.size;
        // code for draw header content
        if (!isNullOrUndefined(this.exportProps.header)) {
            const headerProp: PdfHeader = this.exportProps.header;
            const position: PointF = new PointF(0, headerProp.fromTop);
            const size: SizeF = new SizeF((clientSize.width * 1.1), ((headerProp && headerProp.height) ? headerProp.height * 0.75 : 50));
            const bounds: RectangleF = new RectangleF(position, size);
            pdfDoc.template.top = this.drawPageTemplate(new PdfPageTemplateElement(bounds), headerProp);

        }
        // code for customization of footer
        if (!this.exportProps.enableFooter && !isNullOrUndefined(this.exportProps.footer)) {
            const footer: PdfFooter = this.exportProps.footer;
            const position: PointF = new PointF(0, ((clientSize.width - 80) - ((footer && footer.fromBottom) ?
                footer.fromBottom * 0.75 : 0)));
            const size: SizeF = new SizeF((clientSize.width * 1.1), ((footer && footer.height) ? footer.height * 0.75 : 50));
            const bounds: RectangleF = new RectangleF(position, size);
            this.pdfDoc.template.bottom = this.drawPageTemplate(new PdfPageTemplateElement(bounds), footer);
        }
    }
    private drawPageTemplate(template: PdfPageTemplateElement, element: PdfHeader): PdfPageTemplateElement {
        for (const content of element.contents) {
            switch (content.type) {
            case 'Text':
                if (content.value === '' || content.value === undefined || content.value === null || typeof content.value !== 'string') {
                    throw new Error('please enter the valid input value in text content...');
                }
                this.drawText(template, content);
                break;
            case 'PageNumber':
                this.drawPageNumber(template, content);
                break;
            case 'Image':
                if (content.src === undefined || content.src === null || content.src === '') {
                    throw new Error('please enter the valid base64 string in image content...');
                }
                this.drawImage(template, content);
                break;
            case 'Line':
                this.drawLine(template, content);
                break;
            default:
                throw new Error('Please set valid content type...');
            }
        }
        return template;
    }
    // code for draw text
    /* eslint-disable-next-line */
    private drawText(pageTemplate: PdfPageTemplateElement, content: any): void {
        let font: PdfFont | PdfTrueTypeFont = this.getFont(content);
        if (this.ganttStyle.font) {
            font = this.ganttStyle.font;
        }
        let brush: PdfSolidBrush = this.getBrushFromContent(content);
        let pen: PdfPen = null;
        if (!isNullOrUndefined(content.style.textPenColor)) {
            const penColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textPenColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        if (brush === null && pen === null) {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        const value: string = content.value.toString();
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const format: PdfStringFormat = new PdfStringFormat();
        if (!isNullOrUndefined(content.style.stringFormat)) {
            format.alignment = content.style.stringFormat.alignment;
        }
        const result: { format: PdfStringFormat, size: SizeF } = this.setContentFormat(content, format);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, result.size.width, result.size.height, result.format);
        } else {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, format);
        }
    }
    // code for draw pagenumber
    /* eslint-disable-next-line */
    private drawPageNumber(documentHeader: PdfPageTemplateElement, content: any): void {
        const font: PdfFont = this.getFont(content);
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style.textBrushColor)) {
            const brushColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        } else {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        const pageNumber: PdfPageNumberField = new PdfPageNumberField(font, brush);
        pageNumber.numberStyle = this.getPageNumberStyle(content.pageNumberType);
        let compositeField: PdfCompositeField;
        let format: string;
        if (!isNullOrUndefined(content.format)) {
            const total: string = '$total';
            const current: string = '$current';
            if ((content.format as string).indexOf(total) !== -1 && (content.format as string).indexOf(current) !== -1) {
                const pageCount: PdfPageCountField = new PdfPageCountField(font);
                pageCount.numberStyle = this.getPageNumberStyle(content.pageNumberType);
                if ((content.format as string).indexOf(total) > (content.format as string).indexOf(current)) {
                    format = (content.format as string).replace(current, '0');
                    format = format.replace(total, '1');
                } else {
                    format = (content.format as string).replace(current, '1');
                    format = format.replace(total, '0');
                }
                compositeField = new PdfCompositeField(font, brush, format, pageNumber, pageCount);
            } else if ((content.format as string).indexOf(current) !== -1 && (content.format as string).indexOf(total) === -1) {
                format = (content.format as string).replace(current, '0');
                compositeField = new PdfCompositeField(font, brush, format, pageNumber);
            } else {
                const pageCount: PdfPageCountField = new PdfPageCountField(font);
                format = (content.format as string).replace(total, '0');
                compositeField = new PdfCompositeField(font, brush, format, pageCount);
            }
        } else {
            format = '{0}';
            compositeField = new PdfCompositeField(font, brush, format, pageNumber);
        }
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const result: { format: PdfStringFormat, size: SizeF } = this.setContentFormat(content, compositeField.stringFormat);
        if (result !== null && !isNullOrUndefined(result.format) && !isNullOrUndefined(result.size)) {
            compositeField.stringFormat = result.format;
            compositeField.bounds = new RectangleF(x, y, result.size.width, result.size.height);
        }
        compositeField.draw(documentHeader.graphics, x, y);
    }
    // code for draw image
    /* eslint-disable-next-line */
    private drawImage(documentHeader: PdfPageTemplateElement, content: any): void {
        const x: number = content.position.x * 0.75;
        const y: number = content.position.y * 0.75;
        const width: number = (!isNullOrUndefined(content.size) && !isNullOrUndefined(content.size.width)) ?
            (content.size.width * 0.50) : undefined;
        const height: number = (!isNullOrUndefined(content.size) && !isNullOrUndefined(content.size.height)) ?
            (content.size.height * 0.75) : undefined;

        const image: PdfBitmap = new PdfBitmap(content.src);
        if (!isNullOrUndefined(width)) {
            documentHeader.graphics.drawImage(image, x, y, width, height);
        } else {
            documentHeader.graphics.drawImage(image, x, y);
        }
    }
    // code for draw line
    /* eslint-disable-next-line */
    private drawLine(documentHeader: PdfPageTemplateElement, content: any): void {
        const x1: number = content.points.x1 * 0.75;
        const y1: number = content.points.y1 * 0.75;
        const x2: number = content.points.x2 * 0.75;
        const y2: number = content.points.y2 * 0.75;
        const pen: PdfPen = this.getPenFromContent(content);
        if (!isNullOrUndefined(content.style)) {
            if (!isNullOrUndefined(content.style.penSize) && typeof content.style.penSize === 'number') {
                pen.width = content.style.penSize * 0.75;
            }
            pen.dashStyle = this.getDashStyle(content.style.dashStyle);
        }
        documentHeader.graphics.drawLine(pen, x1, y1, x2, y2);
    }
    private getPenFromContent(content: PdfHeaderFooterContent): PdfPen {
        let pen: PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        if (!isNullOrUndefined(content.style) && content.style !== null && !isNullOrUndefined(content.style.penColor)) {
            const penColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.penColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        return pen;
    }
    private getDashStyle(dashStyle: PdfDashStyle): number {
        switch (dashStyle) {
        case 'Dash':
            return 1;
        case 'Dot':
            return 2;
        case 'DashDot':
            return 3;
        case 'DashDotDot':
            return 4;
        default:
            return 0;
        }
    }
    private getBrushFromContent(content: PdfHeaderFooterContent): PdfSolidBrush {
        let brush: PdfSolidBrush = null;
        if (!isNullOrUndefined(content.style.textBrushColor)) {
            /* tslint:disable-next-line:max-line-length */
            const brushColor: { r: number, g: number, b: number } = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        }
        return brush;
    }
    private hexToRgb(hex: string): { r: number, g: number, b: number } {
        if (hex === null || hex === '' || hex.length !== 7) {
            throw new Error('please set valid hex value for color...');
        }
        hex = hex.substring(1);
        const bigint: number = parseInt(hex, 16);
        const r: number = (bigint >> 16) & 255;
        const g: number = (bigint >> 8) & 255;
        const b: number = bigint & 255;
        return { r: r, g: g, b: b };
    }
    private setContentFormat(content: PdfHeaderFooterContent, format: PdfStringFormat): { format: PdfStringFormat, size: SizeF } {
        const width: number = (content.size) ? content.size.width * 0.75 : this.pdfDoc.pageSettings.size.width;
        const height: number = (content.size) ? content.size.height * 0.75 : (!isNullOrUndefined(this.exportProps.footer) ?
            this.exportProps.footer.height * 0.50 : 0);
        format = new PdfStringFormat(PdfTextAlignment.Left, PdfVerticalAlignment.Middle);
        if (!isNullOrUndefined(content.style.hAlign)) {
            switch (content.style.hAlign) {
            case 'Right':
                format.alignment = PdfTextAlignment.Right;
                break;
            case 'Center':
                format.alignment = PdfTextAlignment.Center;
                break;
            case 'Justify':
                format.alignment = PdfTextAlignment.Justify;
                break;
            default:
                format.alignment = PdfTextAlignment.Left;
            }
        }
        if (!isNullOrUndefined(content.style.vAlign)) {
            format = this.getVerticalAlignment(content.style.vAlign, format);
        }
        return { format: format, size: new SizeF(width, height) };
    }
    private getPageNumberStyle(pageNumberType: PdfPageNumberType): number {
        switch (pageNumberType) {
        case 'LowerLatin':
            return 2;
        case 'LowerRoman':
            return 3;
        case 'UpperLatin':
            return 4;
        case 'UpperRoman':
            return 5;
        default:
            return 1;
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
    public formatCellValue(args: any, ganttObj?: Gantt): string {
        if (args.isForeignKey) {
            args.value = getValue(args.column.foreignKeyValue, getForeignData(args.column, {}, args.value)[0]);
        }
        if (args.column.type === 'number' && args.column.format !== undefined && args.column.format !== '') {
            return args.value ? this.internationalization.getNumberFormat({ format: args.column.format })(args.value) : '';
        } else if (args.column.type === 'boolean') {
            return args.value ? 'true' : 'false';
        } else if ((args.column.type === 'date' || args.column.type === 'datetime' || args.column.type === 'time') && args.column.format !== undefined && args.value !== '') {
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
                if (args.column.field === ganttObj.taskFields.constraintType) {
                    const constraintKey: string = ConstraintType[args.value as number] as keyof typeof ConstraintType;
                    const localizedText: string = ganttObj.treeGridModule['getLocalizedConstraintTypeText'](constraintKey);
                    args.value = localizedText;
                }
                return (args.value).toString();
            } else {
                return '';
            }
        }
    }
}
