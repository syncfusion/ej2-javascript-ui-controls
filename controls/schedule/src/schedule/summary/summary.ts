import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { createElement, EventHandler, remove, isNullOrUndefined, closest, formatUnit, setStyleAttribute, addClass } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { ViewBase } from '../renderer/view-base';
import { RenderSummaryCellEventArgs, SummaryCellClickEventArgs, SummaryVisibleHours, TdData, TimeSlotData, CallbackFunction } from '../base/interface';
import { SummaryRenderType, SummaryRenderMode, SummaryRowCellUnit } from '../base/type';
import { SummaryRowModel, SummaryColumnModel, GroupSummaryModel, ViewsModel } from '../models/models';
import { GroupSummaryModule } from './group-summary';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/** @private */
interface SummaryCellInfo {
    element: HTMLElement;
    renderType: SummaryRenderType;
    startTime?: Date;
    endTime?: Date;
    shownDates?: Date[];
    groupIndex?: number;
    resourceData?: Record<string, any>;
    rows?: TdData[];
    colSpan?: number;
    // Vertical views: the intervals the cell covers (a slot on every shown date, a weekday of the month), the content rows it
    // aligns with and the kind of events it counts.
    ranges?: Date[][];
    rowStart?: number;
    rowCount?: number;
    kind?: 'AllDay' | 'Slot';
}

/** @private */
export interface RowCellRange {
    start: Date;
    end: Date;
    colSpan: number;
    dates: Date[];
    ranges?: Date[][];
    groupIndex?: number;
    resourceData?: Record<string, any>;
    rows?: TdData[];
}

const SUPPORTED_VIEWS: string[] = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'TimelineYear'];
const VERTICAL_VIEWS: string[] = ['Day', 'Week', 'WorkWeek', 'Month'];
const ALLOWED_UNITS: Record<string, SummaryRowCellUnit[]> = {
    TimelineDay: ['Slot', 'Hour', 'Date'],
    TimelineWeek: ['Slot', 'Hour', 'Date', 'Week'],
    TimelineWorkWeek: ['Slot', 'Hour', 'Date', 'Week'],
    TimelineMonth: ['Slot', 'Hour', 'Date', 'Week', 'Month'],
    TimelineYear: ['Month', 'Year']
};
const DEFAULT_COLUMN_WIDTH: number = 100;
const MIN_LANE_HEIGHT: number = 4;
// Colours, borders, padding and weight come from the theme (ej2-theme-studio schedule styles); only the row height stays here.
const CELL_STYLE: string = 'height: 2.5em;';

/**
 * `Summary` is the single injectable module of the summary features: it renders the summary row, the summary column, their label cells and the grand total of the timeline views.
 * The Scheduler owns the placement, the time range and the resource scope of each cell, and the application owns the value.
 *
 * @private
 */
export class Summary {
    private parent: Schedule;
    private cells: SummaryCellInfo[] = [];
    private rowWrap: HTMLElement = null;
    private columnWrap: HTMLElement = null;
    private rowLabelCell: SummaryCellInfo = null;
    private columnLabelCell: SummaryCellInfo = null;
    private totalCell: SummaryCellInfo = null;
    private summaryTr: HTMLElement = null;
    private columnHeaderTd: HTMLElement = null;
    private columnTd: HTMLElement = null;
    private alignFrame: number = 0;
    private frame: number = 0;
    private index: Record<number, Record<string, any>[]> = {};
    private templates: Record<string, CallbackFunction> = {};
    private lastRowHeight: number = 0;
    private lastColumnWidth: number = DEFAULT_COLUMN_WIDTH;
    private unitOverride: { unit: SummaryRowCellUnit } = null;
    /** @private */
    public groupModule: GroupSummaryModule = null;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.updateGroupSummary();
        this.parent.on(events.contentReady, this.onContentReady, this);
        this.parent.on(events.scrollUiUpdate, this.onScrollUiUpdate, this);
        this.parent.on(events.eventsLoaded, this.requestRefresh, this);
    }

    /**
     * Creates the internal group summary helper when the group summary is enabled in the Scheduler or in any view,
     * and removes it when it is not.
     *
     * @returns {void}
     * @private
     */
    public updateGroupSummary(): void {
        const enabled: (options: GroupSummaryModel) => boolean = (options: GroupSummaryModel) => !!(options && options.enable);
        const required: boolean = enabled(this.parent.groupSummary) ||
            (this.parent.viewCollections || []).some((view: ViewsModel) => enabled(view.groupSummary));
        if (required && !this.groupModule) {
            this.groupModule = new GroupSummaryModule(this.parent);
        } else if (!required && this.groupModule) {
            this.groupModule.destroy();
            this.groupModule = null;
        }
    }

    /**
     * Applies a run-time change of the `groupSummary` property: creates or removes the helper and rebuilds the rows.
     *
     * @returns {void}
     * @private
     */
    public onGroupSummaryChanged(): void {
        const existed: boolean = !!this.groupModule;
        this.updateGroupSummary();
        if (this.groupModule) {
            this.groupModule.refresh();
        } else if (existed) {
            this.parent.refreshEvents(false);
        }
    }

    private onContentReady(): void {
        const enabled: boolean = this.rowEnabled || this.columnEnabled;
        const rendered: boolean = !!(this.summaryTr || this.columnTd);
        const connected: boolean = rendered && [this.columnHeaderTd, this.columnTd, this.summaryTr].every((e: HTMLElement) =>
            !e || this.parent.activeView.element.contains(e));
        if (enabled && !connected) {
            this.renderLayout();
        } else if (!enabled && rendered) {
            this.removeLayout();
        }
    }

    private onScrollUiUpdate(): void {
        if (this.parent && !this.parent.isDestroyed && (this.summaryTr || this.columnTd)) {
            this.setHeight((this.parent.activeView as unknown as ViewBase).getContentAreaElement());
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} Returns the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'summary';
    }

    /**
     * Returns whether the summary is rendered in the active view of the Scheduler.
     *
     * @returns {boolean} Returns true when the active view supports the summary.
     * @private
     */
    public isSupported(): boolean {
        const options: Schedule['activeViewOptions'] = this.parent.activeViewOptions;
        if (!this.parent.activeView || !options || this.parent.uiStateValues.isGroupAdaptive) {
            return false;
        }
        if (VERTICAL_VIEWS.indexOf(options.option) > -1) {
            // Adaptive layout and virtual scrolling are not supported in the vertical views.
            return !this.parent.isAdaptive && !options.allowVirtualScrolling;
        }
        return SUPPORTED_VIEWS.indexOf(options.option) > -1 && (options.option !== 'TimelineYear' || this.isYearWithResourceRows());
    }

    private isVertical(): boolean {
        return VERTICAL_VIEWS.indexOf(this.parent.activeViewOptions.option) > -1;
    }

    private isMonth(): boolean {
        return this.parent.activeViewOptions.option === 'Month';
    }

    // TimelineYear only has resources as rows (months across) when it is grouped by resources in the 'Vertical' orientation.
    private isYearWithResourceRows(): boolean {
        const options: Schedule['activeViewOptions'] = this.parent.activeViewOptions;
        return options.orientation === 'Vertical' && options.group.resources.length > 0;
    }

    private isYear(): boolean {
        return this.parent.activeViewOptions.option === 'TimelineYear';
    }

    private getYearMonths(): Date[] {
        const year: number = this.parent.selectedDate.getFullYear();
        return (this.parent.activeView as unknown as { getMonths: () => number[] }).getMonths()
            .map((month: number) => new Date(year, month, 1));
    }

    private get rowOptions(): SummaryRowModel {
        return this.parent.activeViewOptions.summaryRow;
    }

    private get columnOptions(): SummaryColumnModel {
        return this.parent.activeViewOptions.summaryColumn;
    }

    private get rowEnabled(): boolean {
        return this.isSupported() && !!this.rowOptions.enable;
    }

    private get columnEnabled(): boolean {
        return this.isSupported() && !!this.columnOptions.enable;
    }

    /**
     * Returns the height of the summary row, so that the content area leaves room for it.
     *
     * @returns {number} Returns the height of the summary row in pixels.
     * @private
     */
    public getRowHeight(): number {
        return this.summaryTr ? this.summaryTr.offsetHeight : 0;
    }

    /**
     * Renders the layout of the summary: the header and the cells of the column, the summary row and the grand total.
     * The cells are blank and the `Initial` mode of the `renderSummaryCell` event is triggered for every element.
     *
     * @returns {void}
     * @private
     */
    public renderLayout(): void {
        this.removeLayout();
        if (!this.rowEnabled && !this.columnEnabled) {
            return;
        }
        const view: HTMLElement = this.parent.activeView.element;
        const headerWrap: Element = view.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS);
        const contentWrap: Element = view.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        this.parseTemplates();
        const headerTr: HTMLElement = closest(headerWrap, 'tr') as HTMLElement;
        const contentTr: HTMLElement = closest(contentWrap, 'tr') as HTMLElement;
        const hasResourceColumn: boolean = !!view.querySelector('.' + (this.isVertical() ? cls.LEFT_INDENT_CLASS : cls.RESOURCE_COLUMN_WRAP_CLASS));
        const rows: TdData[] = this.getRows();
        const ranges: RowCellRange[] = this.rowEnabled ? this.getRowRanges() : [];
        if (this.columnEnabled) {
            this.createColumnHeader();
            headerTr.appendChild(this.columnHeaderTd);
            this.columnTd = createElement('td', { styles: 'width: ' + formatUnit(this.lastColumnWidth) });
            this.columnWrap = createElement('div', {
                className: cls.SUMMARY_COLUMN_CLASS + ' ' + cls.SUMMARY_WRAP_CLASS,
                styles: 'overflow: hidden; position: relative;'
            });
            this.columnWrap.appendChild(this.createColumnTable(rows));
            this.columnTd.appendChild(this.columnWrap);
            contentTr.appendChild(this.columnTd);
        }
        if (this.rowEnabled) {
            this.summaryTr = createElement('tr', { className: cls.SUMMARY_WRAP_CLASS + '-line' });
            if (hasResourceColumn) {
                const labelTd: HTMLElement = createElement('td', {
                    className: cls.SUMMARY_ROW_HEADER_CLASS, attrs: { role: 'rowheader' }, styles: CELL_STYLE
                });
                this.summaryTr.appendChild(labelTd);
                this.rowLabelCell = { element: labelTd, renderType: 'SummaryRowLabel' };
            }
            const rowTd: HTMLElement = createElement('td');
            this.rowWrap = createElement('div', {
                className: cls.SUMMARY_ROW_CLASS + ' ' + cls.SUMMARY_WRAP_CLASS, styles: 'overflow: hidden; position: relative;'
            });
            this.rowWrap.appendChild(this.createRowTable(ranges));
            rowTd.appendChild(this.rowWrap);
            this.summaryTr.appendChild(rowTd);
            if (this.columnEnabled) {
                const totalTd: HTMLElement = createElement('td', {
                    className: cls.SUMMARY_GRAND_TOTAL_CLASS, attrs: { role: 'gridcell', 'aria-readonly': 'true', tabindex: '-1' },
                    styles: CELL_STYLE
                });
                this.summaryTr.appendChild(totalTd);
                this.totalCell = { element: totalTd, renderType: 'SummaryTotal' };
            }
            contentTr.parentElement.appendChild(this.summaryTr);
        }
        this.getSummaryElements().forEach((element: HTMLElement) => {
            EventHandler.add(element, 'click', this.onClick, this);
            EventHandler.add(element, 'keydown', this.onKeyDown, this);
        });
        this.applyIndexes();
        this.raiseAll('Initial');
    }

    // The header of the column is one label cell. In Day, Week and WorkWeek it also holds the cell of the all-day row below the label.
    private createColumnHeader(): void {
        const label: HTMLElement = createElement('td', {
            className: cls.SUMMARY_COLUMN_HEADER_CLASS, attrs: { role: 'columnheader' }, styles: CELL_STYLE
        });
        this.columnLabelCell = { element: label, renderType: 'SummaryColumnLabel' };
        if (!this.isVertical() || this.isMonth()) {
            this.columnHeaderTd = label;
        } else {
            this.columnHeaderTd = createElement('td');
            const table: HTMLElement = createElement('table', { className: cls.SCHEDULE_TABLE_CLASS, attrs: { role: 'presentation' } });
            const body: HTMLElement = createElement('tbody');
            const labelTr: HTMLElement = createElement('tr');
            labelTr.appendChild(label);
            const allDayTr: HTMLElement = createElement('tr', { attrs: { role: 'row' } });
            body.appendChild(labelTr);
            body.appendChild(allDayTr);
            table.appendChild(body);
            this.columnHeaderTd.appendChild(table);
            this.createCell({
                element: null, renderType: 'SummaryColumn', kind: 'AllDay', startTime: this.getFirstDate(), endTime: this.getLastEnd(),
                shownDates: this.getRenderDates(), ranges: [[this.getFirstDate(), this.getLastEnd()]], rowStart: -1, rowCount: 0
            }, allDayTr);
            this.updateAllDayLane();
        }
        this.columnHeaderTd.style.width = formatUnit(this.lastColumnWidth);
    }

    private getSummaryElements(): HTMLElement[] {
        return [this.rowWrap, this.columnWrap, this.rowLabelCell && this.rowLabelCell.element,
            this.columnHeaderTd, this.totalCell && this.totalCell.element].filter((e: HTMLElement) => !!e);
    }

    private removeLayout(): void {
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
        this.getSummaryElements().forEach((element: HTMLElement) => {
            EventHandler.remove(element, 'click', this.onClick);
            EventHandler.remove(element, 'keydown', this.onKeyDown);
        });
        [this.columnHeaderTd, this.columnTd, this.summaryTr].forEach((element: HTMLElement) => {
            if (element) {
                remove(element);
            }
        });
        this.parent.resetTemplates(this.getTemplateNames());
        this.cells = [];
        this.rowWrap = this.columnWrap = this.summaryTr = this.columnHeaderTd = this.columnTd = null;
        this.rowLabelCell = this.columnLabelCell = this.totalCell = null;
        this.lastRowHeight = 0;
    }

    private getTemplateNames(): string[] {
        return ['summaryRowTemplate', 'summaryRowLabelTemplate', 'summaryRowTotalTemplate', 'summaryColumnTemplate',
            'summaryColumnLabelTemplate'];
    }

    private parseTemplates(): void {
        const row: SummaryRowModel = this.rowOptions;
        const column: SummaryColumnModel = this.columnOptions;
        this.templates = {
            SummaryRow: this.parent.templateParser(row.template),
            SummaryRowLabel: this.parent.templateParser(row.labelTemplate),
            SummaryTotal: this.parent.templateParser(row.totalTemplate),
            SummaryColumn: this.parent.templateParser(column.template),
            SummaryColumnLabel: this.parent.templateParser(column.labelTemplate)
        };
    }

    private getTemplateName(type: SummaryRenderType): string {
        const names: Record<string, string> = {
            SummaryRow: 'summaryRowTemplate', SummaryRowLabel: 'summaryRowLabelTemplate', SummaryTotal: 'summaryRowTotalTemplate',
            SummaryColumn: 'summaryColumnTemplate', SummaryColumnLabel: 'summaryColumnLabelTemplate'
        };
        return names[`${type}`];
    }

    private createTable(): HTMLElement {
        const table: HTMLElement = createElement('table', {
            className: cls.SCHEDULE_TABLE_CLASS, attrs: { role: 'grid', 'aria-readonly': 'true' }
        });
        table.setAttribute('aria-label', this.parent.localeObj.getConstant('summary'));
        const tbody: HTMLElement = createElement('tbody', { attrs: { role: 'rowgroup' } });
        table.appendChild(tbody);
        return table;
    }

    private createCell(info: SummaryCellInfo, tr: HTMLElement): void {
        const td: HTMLElement = createElement('td', {
            className: cls.SUMMARY_CELL_CLASS, attrs: { role: 'gridcell', 'aria-readonly': 'true', tabindex: '-1' },
            styles: CELL_STYLE
        });
        if (info.colSpan > 1) {
            td.setAttribute('colspan', info.colSpan.toString());
        }
        info.element = td;
        tr.appendChild(td);
        this.cells.push(info);
    }

    // The column cell of a group summary parent is a plain spacer: no value, no event, not focusable.
    private makeEmptyColumnCell(info: SummaryCellInfo): void {
        info.rows = [];
        info.colSpan = -1;
        ['role', 'tabindex', 'aria-readonly'].forEach((name: string) => info.element.removeAttribute(name));
        addClass([info.element], cls.GROUP_SUMMARY_COLUMN_CELL_CLASS);
    }

    private createRowTable(ranges: RowCellRange[]): HTMLElement {
        const table: HTMLElement = this.createTable();
        const tr: HTMLElement = createElement('tr', { attrs: { role: 'row' } });
        table.querySelector('tbody').appendChild(tr);
        for (const range of ranges) {
            this.createCell({
                element: null, renderType: 'SummaryRow', startTime: range.start, endTime: range.end, shownDates: range.dates,
                colSpan: range.colSpan, ranges: range.ranges, groupIndex: range.groupIndex, resourceData: range.resourceData,
                rows: range.rows
            }, tr);
        }
        return table;
    }

    private createColumnTable(rows: TdData[]): HTMLElement {
        const table: HTMLElement = this.createTable();
        const tbody: Element = table.querySelector('tbody');
        if (this.isVertical()) {
            this.getVerticalColumnRanges().forEach((info: SummaryCellInfo) => {
                const tr: HTMLElement = createElement('tr', { attrs: { role: 'row' } });
                tbody.appendChild(tr);
                this.createCell(info, tr);
            });
            return table;
        }
        const hidden: boolean[] = this.getHiddenRows(rows);
        const grouped: boolean = this.isGrouped();
        const list: TdData[] = grouped ? rows : [null];
        list.forEach((row: TdData, i: number) => {
            const tr: HTMLElement = createElement('tr', { attrs: { role: 'row' } });
            if (grouped && hidden[parseInt(i.toString(), 10)]) {
                addClass([tr], cls.HIDDEN_CLASS);
            }
            tbody.appendChild(tr);
            this.createCell({
                element: null, renderType: 'SummaryColumn', rows: grouped ? [row] : [],
                groupIndex: grouped ? row.groupIndex : undefined, resourceData: grouped ? row.resourceData : undefined,
                startTime: this.getFirstDate(), endTime: this.getLastEnd(), shownDates: this.getRenderDates()
            }, tr);
            if (grouped && hidden[parseInt(i.toString(), 10)]) {
                this.cells[this.cells.length - 1].rows = [];
                this.cells[this.cells.length - 1].colSpan = -1;
            }
            if (grouped && this.isGroupRow(row)) {
                this.makeEmptyColumnCell(this.cells[this.cells.length - 1]);
            }
        });
        return table;
    }

    // A group summary parent takes no part in the summary row, the summary column and the grand total.
    private isGroupRow(row: TdData): boolean {
        return !!this.groupModule && this.groupModule.isGroupRow(row);
    }

    private isGrouped(): boolean {
        return this.parent.activeViewOptions.group.resources.length > 0 && !!this.parent.resourceBase &&
            !this.parent.uiStateValues.isGroupAdaptive;
    }

    private getRows(): TdData[] {
        return this.isGrouped() ? this.parent.resourceBase.renderedResources : [];
    }

    private getHiddenRows(rows: TdData[]): boolean[] {
        const hidden: boolean[] = rows.map(() => false);
        if (this.parent.resourceBase && this.parent.resourceBase.resourceCollection.length > 1 && !this.parent.virtualScrollModule) {
            for (let i: number = 0; i < rows.length; i++) {
                const data: Record<string, any> = rows[parseInt(i.toString(), 10)].resourceData;
                const expandedField: string = rows[parseInt(i.toString(), 10)].resource.expandedField;
                if (data.ClassName === cls.RESOURCE_PARENT_CLASS && !data[`${expandedField}`] && !isNullOrUndefined(data[`${expandedField}`])) {
                    const count: number = util.getDescendantCount(rows, i);
                    for (let j: number = 1; j <= count; j++) {
                        hidden[i + j] = true;
                    }
                }
            }
        }
        return hidden;
    }

    private getRenderDates(): Date[] {
        if (this.isYear()) {
            const dates: Date[] = [];
            for (const month of this.getYearMonths()) {
                dates.push(...this.getMonthDates(month));
            }
            return dates;
        }
        return (this.parent.activeView as unknown as { renderDates: Date[] }).renderDates.slice();
    }

    private getMonthDates(month: Date): Date[] {
        const dates: Date[] = [];
        for (let day: number = 1; new Date(month.getFullYear(), month.getMonth(), day).getMonth() === month.getMonth(); day++) {
            dates.push(new Date(month.getFullYear(), month.getMonth(), day));
        }
        return dates;
    }

    private getFirstDate(): Date {
        return util.resetTime(new Date(+this.getRenderDates()[0]));
    }

    private getLastEnd(): Date {
        const dates: Date[] = this.getRenderDates();
        return util.addDays(util.resetTime(new Date(+dates[dates.length - 1])), 1);
    }

    private getSlotMinutes(): number {
        if (this.parent.activeViewOptions.option === 'TimelineMonth') {
            return 0;
        }
        return this.parent.getEffectiveSlotMinutes() || 0;
    }

    private resolveUnit(): SummaryRowCellUnit {
        const option: string = this.parent.activeViewOptions.option;
        const requested: SummaryRowCellUnit = this.unitOverride ? this.unitOverride.unit : this.rowOptions.cellUnit;
        const slot: number = this.getSlotMinutes();
        if (option === 'TimelineYear') {
            return requested === 'Year' ? 'Year' : 'Month';
        }
        const defaultUnit: SummaryRowCellUnit = option === 'TimelineDay' && slot > 0 && slot <= 60 && 60 % slot === 0 ? 'Hour' : 'Date';
        if (!requested || ALLOWED_UNITS[`${option}`].indexOf(requested) < 0) {
            return defaultUnit;
        }
        if (requested === 'Slot' || requested === 'Hour') {
            if (slot === 0) {
                return requested === 'Slot' ? 'Date' : defaultUnit;
            }
            if (requested === 'Hour' && (slot > 60 || 60 % slot !== 0)) {
                return defaultUnit;
            }
        }
        return requested;
    }

    private getColumnCount(): number {
        const table: Element = this.parent.activeView.element.querySelector('.' + cls.CONTENT_TABLE_CLASS);
        return table.querySelectorAll('colgroup col').length;
    }

    private getYearRanges(): RowCellRange[] {
        const months: Date[] = this.getYearMonths();
        const monthRanges: RowCellRange[] = months.map((month: Date) => ({
            start: month, end: new Date(month.getFullYear(), month.getMonth() + 1, 1), colSpan: 1, dates: this.getMonthDates(month)
        }));
        if (this.resolveUnit() === 'Year') {
            return [{
                start: monthRanges[0].start, end: monthRanges[monthRanges.length - 1].end, colSpan: monthRanges.length,
                dates: this.getRenderDates()
            }];
        }
        return monthRanges;
    }

    private getVerticalRowRanges(): RowCellRange[] {
        const view: { colLevels: TdData[][] } = this.parent.activeView as unknown as { colLevels: TdData[][] };
        const columns: TdData[] = view.colLevels[view.colLevels.length - 1];
        const rows: TdData[] = this.getRows();
        const all: Date[] = this.getRenderDates();
        const startOf: (d: Date) => Date = (d: Date) => util.resetTime(new Date(+d));
        return columns.map((column: TdData) => {
            const row: TdData = this.isGrouped() ? rows.filter((r: TdData) => r.groupIndex === column.groupIndex)[0] : undefined;
            // Month: a weekday cell covers every rendered date of that weekday. Day, Week and WorkWeek: the date of the column.
            const dates: Date[] = this.isMonth() ? all.filter((d: Date) => d.getDay() === column.date.getDay()) : [startOf(column.date)];
            const ranges: Date[][] = dates.map((d: Date) => [startOf(d), util.addDays(startOf(d), 1)]);
            return {
                start: ranges[0][0], end: ranges[ranges.length - 1][1], colSpan: 1, dates: dates, ranges: ranges,
                groupIndex: row ? row.groupIndex : undefined, resourceData: row ? row.resourceData : undefined,
                rows: row ? [row] : undefined
            };
        });
    }

    // Day, Week and WorkWeek: a cell per slot (or major slot) on every shown date. Month: a cell per week row.
    private getVerticalColumnRanges(): SummaryCellInfo[] {
        const all: Date[] = this.getRenderDates();
        const infos: SummaryCellInfo[] = [];
        const perWeek: number = Math.round(all.length / Math.max(this.getContentRowCount(), 1));
        const make: (ranges: Date[][], rowStart: number, rowCount: number) => SummaryCellInfo =
            (ranges: Date[][], rowStart: number, rowCount: number) => ({
                element: null, renderType: 'SummaryColumn', kind: this.isMonth() ? undefined : 'Slot', startTime: ranges[0][0], endTime: ranges[0][1],
                shownDates: this.isMonth() ? all.slice(rowStart * perWeek, (rowStart + 1) * perWeek) : all,
                ranges: ranges, rowStart: rowStart, rowCount: rowCount
            });
        if (this.isMonth()) {
            const weeks: number = this.getContentRowCount();
            for (let week: number = 0; week < weeks; week++) {
                const dates: Date[] = all.slice(week * perWeek, (week + 1) * perWeek);
                const start: Date = util.resetTime(new Date(+dates[0]));
                infos.push(make([[start, util.addDays(util.resetTime(new Date(+dates[dates.length - 1])), 1)]], week, 1));
            }
            return infos;
        }
        const slots: TimeSlotData[] = (this.parent.activeView as unknown as { getTimeSlotRows: () => TimeSlotData[] }).getTimeSlotRows();
        const scale: Schedule['activeViewOptions']['timeScale'] = this.parent.activeViewOptions.timeScale;
        const slotMs: number = scale.interval * util.MS_PER_MINUTE / scale.slotCount;
        const step: number = this.columnOptions.cellUnit === 'MajorSlot' ? scale.slotCount : 1;
        for (let i: number = 0; i < slots.length; i += step) {
            const count: number = Math.min(step, slots.length - i);
            const time: Date = slots[parseInt(i.toString(), 10)].date;
            const ranges: Date[][] = all.map((d: Date) => {
                const start: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), time.getHours(), time.getMinutes());
                return [start, new Date(start.getTime() + slotMs * count)];
            });
            infos.push(make(ranges, i, count));
        }
        return infos;
    }

    // The rows of the content table itself; the event wrappers in its thead hold tables of their own.
    private getContentRows(): HTMLElement[] {
        const table: HTMLTableElement = this.parent.activeView.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLTableElement;
        return table ? [].slice.call(table.tBodies[0].rows) : [];
    }

    private getContentRowCount(): number {
        return this.getContentRows().length;
    }

    private getRowRanges(): RowCellRange[] {
        if (this.isVertical()) {
            return this.getVerticalRowRanges();
        }
        if (this.isYear()) {
            return this.getYearRanges();
        }
        const dates: Date[] = this.getRenderDates();
        const perDate: number = Math.max(Math.round(this.getColumnCount() / dates.length), 1);
        const unit: SummaryRowCellUnit = this.resolveUnit();
        const ranges: RowCellRange[] = [];
        const slot: number = this.getSlotMinutes();
        const first: number = this.parent.activeViewOptions.firstDayOfWeek;
        type KeyFn = (d: Date) => string;
        type BoundsFn = (d: Date) => Date[];
        const groupBy: (key: KeyFn, bounds: BoundsFn) => void = (key: KeyFn, bounds: BoundsFn) => {
            let current: RowCellRange = null;
            let currentKey: string = null;
            for (const date of dates) {
                const k: string = key(date);
                if (k !== currentKey) {
                    const b: Date[] = bounds(date);
                    current = { start: b[0], end: b[1], colSpan: 0, dates: [] };
                    currentKey = k;
                    ranges.push(current);
                }
                current.colSpan += perDate;
                current.dates.push(date);
            }
        };
        const startOf: (d: Date) => Date = (d: Date) => util.resetTime(new Date(+d));
        if (unit === 'Date' || (unit === 'Slot' && slot === 0)) {
            groupBy((d: Date) => startOf(d).getTime().toString(), (d: Date) => [startOf(d), util.addDays(startOf(d), 1)]);
        } else if (unit === 'Week') {
            groupBy((d: Date) => util.getWeekFirstDate(startOf(d), first).getTime().toString(), (d: Date) => {
                const s: Date = util.getWeekFirstDate(startOf(d), first);
                return [s, util.addDays(s, 7)];
            });
        } else if (unit === 'Month') {
            groupBy((d: Date) => d.getFullYear() + '-' + d.getMonth(), (d: Date) => [
                new Date(d.getFullYear(), d.getMonth(), 1), new Date(d.getFullYear(), d.getMonth() + 1, 1)]);
        } else {
            const minutes: number = unit === 'Hour' ? 60 : slot;
            const slotsPerCell: number = minutes / slot;
            const view: { colLevels: TdData[][] } = this.parent.activeView as unknown as { colLevels: TdData[][] };
            const last: TdData[] = view.colLevels[view.colLevels.length - 1];
            for (let i: number = 0; i < last.length; i += slotsPerCell) {
                const start: Date = new Date(+last[parseInt(i.toString(), 10)].date);
                ranges.push({
                    start: start, end: new Date(start.getTime() + minutes * 60000), colSpan: slotsPerCell, dates: [startOf(start)]
                });
            }
        }
        return ranges;
    }

    /**
     * Returns the cell ranges of a timeline row for the given cell unit, with the same fall-backs as the summary row.
     *
     * @param {SummaryRowCellUnit} unit Accepts the requested cell unit.
     * @returns {RowCellRange[]} Returns the ranges.
     * @private
     */
    public getUnitRanges(unit: SummaryRowCellUnit): RowCellRange[] {
        this.unitOverride = { unit: unit };
        try {
            return this.getRowRanges();
        } finally {
            this.unitOverride = null;
        }
    }

    private getVisibleHours(): SummaryVisibleHours {
        return { startHour: this.parent.activeViewOptions.startHour, endHour: this.parent.activeViewOptions.endHour };
    }

    /**
     * Rebuilds the column cells for the resource rows that the virtual scroll rendered and refreshes the summary on the next frame.
     *
     * @returns {void}
     * @private
     */
    public onVirtualRowsChanged(): void {
        this.requestRefresh();
    }

    private requestRefresh(): void {
        if (this.frame || (!this.summaryTr && !this.columnTd)) {
            return;
        }
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.refresh();
        });
    }

    /**
     * Refreshes the summary cells: the previous element of each cell is replaced by a fresh one and the
     * `Refresh` mode of the `renderSummaryCell` event is triggered for every element.
     *
     * @param {HTMLElement} element Accepts the optional element of a single cell to refresh.
     * @returns {void}
     * @private
     */
    public refresh(element?: Element): void {
        if (!this.isSupported() || (!this.summaryTr && !this.columnTd)) {
            return;
        }
        if (element) {
            const info: SummaryCellInfo = this.findInfo(element);
            if (info) {
                this.buildIndex();
                this.raise(info, 'Refresh');
                this.applySizes();
            }
            return;
        }
        this.rebuildForCurrentRows();
        const laneChanged: boolean = this.isVertical() && this.updateAllDayLane();
        this.applyIndexes();
        this.buildIndex();
        this.parent.resetTemplates(this.getTemplateNames());
        this.raiseAll('Refresh');
        this.applySizes();
        if (laneChanged) {
            this.parent.notify(events.scrollUiUpdate, { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() });
        }
    }

    private rebuildForCurrentRows(): void {
        if (!this.columnTd || this.isVertical()) {
            return;
        }
        const rows: TdData[] = this.getRows();
        const existingGroups: number[] = this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryColumn')
            .map((c: SummaryCellInfo) => c.groupIndex);
        const grouped: boolean = this.isGrouped();
        const existing: SummaryCellInfo[] = this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryColumn');
        const sameRows: boolean = existingGroups.length === rows.length &&
            rows.every((row: TdData, i: number) => row.groupIndex === existingGroups[parseInt(i.toString(), 10)] &&
                existing[parseInt(i.toString(), 10)].element.classList.contains(cls.GROUP_SUMMARY_COLUMN_CELL_CLASS) ===
                this.isGroupRow(row));
        if (!grouped || !sameRows) {
            this.cells = this.cells.filter((c: SummaryCellInfo) => c.renderType !== 'SummaryColumn');
            EventHandler.remove(this.columnWrap, 'click', this.onClick);
            EventHandler.remove(this.columnWrap, 'keydown', this.onKeyDown);
            this.columnWrap.innerHTML = '';
            this.columnWrap.appendChild(this.createColumnTable(rows));
            EventHandler.add(this.columnWrap, 'click', this.onClick, this);
            EventHandler.add(this.columnWrap, 'keydown', this.onKeyDown, this);
            return;
        }
        const hidden: boolean[] = this.getHiddenRows(rows);
        const trs: HTMLElement[] = [].slice.call(this.columnWrap.querySelectorAll('tr'));
        const infos: SummaryCellInfo[] = this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryColumn');
        trs.forEach((tr: HTMLElement, i: number) => {
            tr.classList[hidden[parseInt(i.toString(), 10)] ? 'add' : 'remove'](cls.HIDDEN_CLASS);
            const skipped: boolean = hidden[parseInt(i.toString(), 10)] || this.isGroupRow(rows[parseInt(i.toString(), 10)]);
            infos[parseInt(i.toString(), 10)].rows = skipped ? [] : [rows[parseInt(i.toString(), 10)]];
            infos[parseInt(i.toString(), 10)].colSpan = skipped ? -1 : 1;
            infos[parseInt(i.toString(), 10)].startTime = this.getFirstDate();
            infos[parseInt(i.toString(), 10)].endTime = this.getLastEnd();
            infos[parseInt(i.toString(), 10)].shownDates = this.getRenderDates();
        });
    }

    private buildIndex(): void {
        this.index = {};
        const fields: Schedule['eventFields'] = this.parent.eventFields;
        const all: Record<string, any>[] = this.parent.eventsProcessed;
        const sort: (list: Record<string, any>[]) => Record<string, any>[] = (list: Record<string, any>[]) =>
            list.slice().sort((a: Record<string, any>, b: Record<string, any>) =>
                (a[fields.startTime] as Date).getTime() - (b[fields.startTime] as Date).getTime());
        if (!this.isGrouped()) {
            this.index[-1] = sort(all);
            return;
        }
        for (const row of this.getRows()) {
            this.index[row.groupIndex] = sort(this.parent.eventBase.filterEventsByResource(row, all));
        }
    }

    private getVisibleRows(): TdData[] {
        if (!this.isGrouped()) {
            return [null];
        }
        const rows: TdData[] = this.getRows();
        const hidden: boolean[] = this.getHiddenRows(rows);
        return rows.filter((row: TdData, i: number) => !hidden[parseInt(i.toString(), 10)] && !this.isGroupRow(row));
    }

    private getInfoEvents(info: SummaryCellInfo): Record<string, any>[] {
        const ranges: Date[][] = info.ranges || [[info.startTime, info.endTime]];
        return this.getEvents(this.getScopeRows(info), ranges[0][0], ranges[ranges.length - 1][1], info.ranges, info.kind);
    }

    private getEvents(rows: TdData[], start: Date, end: Date, ranges?: Date[][], kind?: 'AllDay' | 'Slot'): Record<string, any>[] {
        const fields: Schedule['eventFields'] = this.parent.eventFields;
        const result: Record<string, any>[] = [];
        const seen: Record<string, any>[] = [];
        for (const row of rows) {
            const list: Record<string, any>[] = this.index[row ? row.groupIndex : -1];
            for (const item of list) {
                const s: Date = item[fields.startTime] as Date;
                const e: Date = item[fields.endTime] as Date;
                if (s.getTime() >= end.getTime()) {
                    break;
                }
                const intersects: boolean = e.getTime() > start.getTime() ||
                    (e.getTime() === s.getTime() && s.getTime() >= start.getTime());
                const inRanges: boolean = !ranges || ranges.length < 2 || ranges.some((r: Date[]) => s.getTime() < r[1].getTime() &&
                    (e.getTime() > r[0].getTime() || (e.getTime() === s.getTime() && s.getTime() >= r[0].getTime())));
                const inKind: boolean = !kind || this.parent.eventBase.isAllDayAppointment(item) === (kind === 'AllDay');
                if (intersects && inRanges && inKind && seen.indexOf(item) < 0) {
                    seen.push(item);
                    result.push(item);
                }
            }
        }
        return result;
    }

    private getScopeRows(info: SummaryCellInfo): TdData[] {
        if (this.isVertical()) {
            // A row cell belongs to the resource of its column; a column cell and the total cover every visible resource.
            return info.renderType === 'SummaryRow' ? (this.isGrouped() ? info.rows : [null]) : this.getVisibleRows();
        }
        if (info.renderType === 'SummaryColumn') {
            return this.isGrouped() ? info.rows : [null];
        }
        return this.getVisibleRows();
    }

    private raiseAll(mode: SummaryRenderMode): void {
        const order: SummaryCellInfo[] = [];
        [this.rowLabelCell, this.columnLabelCell].forEach((info: SummaryCellInfo) => { if (info) { order.push(info); } });
        order.push(...this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryRow'));
        order.push(...this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryColumn'));
        if (this.totalCell) {
            this.totalCell.startTime = this.getFirstDate();
            this.totalCell.endTime = this.getLastEnd();
            this.totalCell.shownDates = this.getRenderDates();
            order.push(this.totalCell);
        }
        for (const info of order) {
            if (info.renderType === 'SummaryColumn' && info.colSpan === -1) {
                continue;
            }
            this.raise(info, mode);
        }
    }

    private isLabel(type: SummaryRenderType): boolean {
        return type === 'SummaryRowLabel' || type === 'SummaryColumnLabel';
    }

    private raise(info: SummaryCellInfo, mode: SummaryRenderMode): void {
        if (mode === 'Refresh') {
            // The element is emptied in place, so the application always receives a clean element and the references
            // and the click handlers of the Scheduler stay valid.
            while (info.element.firstChild) {
                info.element.removeChild(info.element.firstChild);
            }
            info.element.removeAttribute('aria-label');
        }
        const label: boolean = this.isLabel(info.renderType);
        const args: RenderSummaryCellEventArgs = {
            mode: mode, renderType: info.renderType, element: info.element,
            text: label ? this.parent.localeObj.getConstant('summary') : ''
        };
        if (!label) {
            args.startTime = info.startTime;
            args.endTime = info.endTime;
            args.visibleHours = this.getVisibleHours();
            args.shownDates = info.shownDates;
            args.groupIndex = info.groupIndex;
            args.resourceData = info.resourceData;
            args.eventData = mode === 'Refresh' ? this.getInfoEvents(info) : [];
        }
        const template: CallbackFunction = this.templates[info.renderType];
        if (template) {
            const context: Record<string, any> = {};
            if (!label) {
                ['mode', 'renderType', 'startTime', 'endTime', 'visibleHours', 'shownDates', 'groupIndex', 'resourceData', 'eventData']
                    .forEach((key: string) => { context[`${key}`] = (args as Record<string, any>)[`${key}`]; });
            }
            const name: string = this.getTemplateName(info.renderType);
            const id: string = this.parent.element.id + '_' + name;
            const nodes: HTMLElement[] = [].slice.call(
                template(context, this.parent, name, id, false, undefined, undefined, this.parent.root));
            nodes.forEach((node: HTMLElement) => info.element.appendChild(node));
        }
        try {
            this.parent.trigger(events.renderSummaryCell, args);
        } catch (error) {
            // A throwing handler leaves its own cell blank and must not stop the other cells.
            console.warn('Scheduler: the renderSummaryCell handler threw an error.', error);
            return;
        }
        if (!template && args.text) {
            info.element.insertBefore(document.createTextNode(args.text), info.element.firstChild);
        }
        this.setAccessibleName(info, args);
    }

    private setAccessibleName(info: SummaryCellInfo, args: RenderSummaryCellEventArgs): void {
        if (this.isLabel(info.renderType) || args.mode === 'Initial') {
            return;
        }
        const parts: string[] = [];
        parts.push(this.parent.globalize.formatDate(info.startTime, { type: 'dateTime', skeleton: 'short' }) + ' - ' +
            this.parent.globalize.formatDate(info.endTime, { type: 'dateTime', skeleton: 'short' }));
        if (info.resourceData) {
            parts.push(String(info.resourceData[info.rows[0].resource.textField]));
        }
        parts.push(info.element.textContent);
        info.element.setAttribute('aria-label', parts.join(', '));
    }

    private applySizes(): void {
        const content: HTMLElement = (this.parent.activeView as unknown as ViewBase).getContentAreaElement();
        let changed: boolean = false;
        if (this.columnTd) {
            const cells: HTMLElement[] = [this.columnHeaderTd, this.totalCell && this.totalCell.element].concat(
                [].slice.call(this.columnWrap.querySelectorAll('.' + cls.SUMMARY_CELL_CLASS))).filter((e: HTMLElement) => !!e);
            const width: number = Math.max(DEFAULT_COLUMN_WIDTH, ...cells.map((e: HTMLElement) => e.scrollWidth));
            if (width !== this.lastColumnWidth) {
                this.lastColumnWidth = width;
                this.columnHeaderTd.style.width = formatUnit(width);
                this.columnTd.style.width = formatUnit(width);
                changed = true;
            }
        }
        const rowChanged: boolean = !!this.summaryTr && this.getRowHeight() !== this.lastRowHeight;
        changed = changed || rowChanged;
        this.lastRowHeight = this.getRowHeight();
        if (changed) {
            this.parent.notify(events.scrollUiUpdate, { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() });
            if (rowChanged && this.isMonth()) {
                // The Month events were laid out against the cell height before the summary row took its room; lay them out again.
                this.parent.refreshEvents(false);
            }
        } else {
            this.setHeight(content);
        }
        this.alignFrame = requestAnimationFrame(() => {
            this.alignFrame = 0;
            if (this.parent && !this.parent.isDestroyed && (this.summaryTr || this.columnTd)) {
                this.setHeight((this.parent.activeView as unknown as ViewBase).getContentAreaElement());
            }
        });
    }

    /**
     * Aligns the summary column rows, the summary row cells and the scroll bar room with the content area.
     *
     * @param {HTMLElement} content Accepts the scrollable content element.
     * @returns {void}
     * @private
     */
    public setHeight(content: HTMLElement): void {
        const contentTable: HTMLElement = this.parent.activeView.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        if (!contentTable) {
            return;
        }
        if (this.columnWrap) {
            setStyleAttribute(this.columnWrap, { 'height': formatUnit(content.clientHeight) });
            const contentRows: HTMLElement[] = this.getContentRows();
            const rows: HTMLElement[] = [].slice.call(this.columnWrap.querySelectorAll('tr'));
            const slotInfos: SummaryCellInfo[] = this.isVertical() ? this.getColumnCells().filter((c: SummaryCellInfo) => c.kind !== 'AllDay') : [];
            rows.forEach((tr: HTMLElement, i: number) => {
                if (this.isVertical()) {
                    const info: SummaryCellInfo = slotInfos[parseInt(i.toString(), 10)];
                    const covered: HTMLElement[] = contentRows.slice(info.rowStart, info.rowStart + info.rowCount);
                    (tr.firstElementChild as HTMLElement).style.height = formatUnit(
                        covered.reduce((sum: number, r: HTMLElement) => sum + r.offsetHeight, 0));
                    return;
                }
                const source: HTMLElement = contentRows[parseInt(i.toString(), 10)];
                if (source && !tr.classList.contains(cls.HIDDEN_CLASS)) {
                    (tr.firstElementChild as HTMLElement).style.height = formatUnit(source.offsetHeight);
                }
            });
            this.alignVerticalHeader();
            const columnTable: HTMLElement = this.columnWrap.querySelector('table') as HTMLElement;
            columnTable.style.transform = (contentTable.style.transform || '');
            this.columnWrap.scrollTop = content.scrollTop;
        }
        if (this.rowWrap) {
            const bar: number = content.offsetWidth - content.clientWidth;
            this.rowWrap.style.width = bar > 0 ? 'calc(100% - ' + formatUnit(bar) + ')' : '';
            const table: HTMLElement = this.rowWrap.querySelector('table') as HTMLElement;
            const sample: HTMLElement = contentTable.querySelector('tbody tr:not(.' + cls.HIDDEN_CLASS + ')') as HTMLElement;
            if (sample) {
                table.style.width = formatUnit(contentTable.offsetWidth);
                let colgroup: Element = table.querySelector('colgroup');
                if (colgroup) {
                    remove(colgroup);
                }
                colgroup = createElement('colgroup');
                [].slice.call(sample.children).forEach((cell: HTMLElement) => {
                    colgroup.appendChild(createElement('col', { styles: 'width: ' + formatUnit(cell.offsetWidth) }));
                });
                table.insertBefore(colgroup, table.firstChild);
            }
            this.rowWrap.scrollLeft = content.scrollLeft;
        }
    }

    // The all-day lane of the column exists only while the rendered dates hold an all-day event; otherwise it would leave a gap
    // between the date header and the first cell. Returns true when the lane was shown or hidden.
    private updateAllDayLane(): boolean {
        const info: SummaryCellInfo = this.getColumnCells().filter((c: SummaryCellInfo) => c.kind === 'AllDay')[0];
        if (!info) {
            return false;
        }
        const fields: Schedule['eventFields'] = this.parent.eventFields;
        const first: number = this.getFirstDate().getTime();
        const last: number = this.getLastEnd().getTime();
        const wanted: boolean = (this.parent.eventsProcessed || []).some((item: Record<string, any>) =>
            (item[fields.startTime] as Date).getTime() < last && (item[fields.endTime] as Date).getTime() > first &&
            this.parent.eventBase.isAllDayAppointment(item));
        const shown: boolean = info.colSpan !== -1;
        if (wanted === shown) {
            return false;
        }
        info.colSpan = wanted ? 1 : -1;
        (info.element.parentElement as HTMLElement).style.display = wanted ? '' : 'none';
        if (!wanted) {
            info.element.style.height = '';
            info.element.removeAttribute('aria-label');
            while (info.element.firstChild) {
                info.element.removeChild(info.element.firstChild);
            }
        }
        return true;
    }

    // The label sits level with the date header rows and the all-day cell level with the all-day row.
    private alignVerticalHeader(): void {
        const allDay: HTMLElement = this.parent.activeView.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement;
        const info: SummaryCellInfo = this.getColumnCells().filter((c: SummaryCellInfo) => c.kind === 'AllDay')[0];
        if (!this.isVertical() || this.isMonth() || !allDay || !info) {
            return;
        }
        const header: HTMLElement = closest(allDay, 'table') as HTMLElement;
        // A collapsed all-day row (an all-day event of no rendered resource) is thinner than the text of the cell: hide the lane
        // so that the column header never grows taller than the date header.
        const visible: boolean = info.colSpan !== -1 && allDay.offsetHeight > MIN_LANE_HEIGHT;
        (info.element.parentElement as HTMLElement).style.display = visible ? '' : 'none';
        const lane: number = visible ? allDay.offsetHeight : 0;
        if (lane) {
            info.element.style.height = formatUnit(lane);
        }
        this.columnLabelCell.element.style.height = formatUnit(header.offsetHeight - lane);
    }

    /**
     * Keeps the summary row and the summary column in step with the scroll position of the content area.
     *
     * @param {HTMLElement} target Accepts the scrolled content element.
     * @returns {void}
     * @private
     */
    public syncScroll(target: HTMLElement): void {
        if (this.rowWrap) {
            this.rowWrap.scrollLeft = target.scrollLeft;
        }
        if (this.columnWrap) {
            this.columnWrap.scrollTop = target.scrollTop;
        }
    }

    private findInfo(element: Element): SummaryCellInfo {
        const all: SummaryCellInfo[] = this.cells.concat([this.rowLabelCell, this.columnLabelCell, this.totalCell]);
        for (const info of all) {
            if (info && info.element && (info.element === element || info.element.contains(element))) {
                return info;
            }
        }
        return null;
    }

    /**
     * Returns the render type, the range and the scope of a summary element.
     *
     * @param {Element} element Accepts the summary element.
     * @returns {RenderSummaryCellEventArgs} Returns the details, or null for an element that is not a summary element.
     * @private
     */
    public getDetails(element: Element): RenderSummaryCellEventArgs {
        const info: SummaryCellInfo = element ? this.findInfo(element) : null;
        if (!info) {
            return null;
        }
        const label: boolean = this.isLabel(info.renderType);
        this.buildIndex();
        return {
            mode: 'Refresh', renderType: info.renderType, element: info.element, text: info.element.textContent,
            startTime: label ? undefined : info.startTime, endTime: label ? undefined : info.endTime,
            visibleHours: label ? undefined : this.getVisibleHours(), shownDates: label ? undefined : info.shownDates,
            groupIndex: info.groupIndex, resourceData: info.resourceData,
            eventData: label ? undefined : this.getInfoEvents(info)
        };
    }

    private applyIndexes(): void {
        let column: number = 1;
        this.getRowCells().forEach((info: SummaryCellInfo) => {
            info.element.setAttribute('aria-colindex', column.toString());
            column += info.colSpan;
        });
        let row: number = 1;
        this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryColumn').forEach((info: SummaryCellInfo) => {
            if (info.colSpan === -1) {
                info.element.removeAttribute('aria-rowindex');
            } else {
                info.element.setAttribute('aria-rowindex', row.toString());
                row++;
            }
        });
    }

    private getRowCells(): SummaryCellInfo[] {
        return this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryRow');
    }

    private getColumnCells(): SummaryCellInfo[] {
        return this.cells.filter((c: SummaryCellInfo) => c.renderType === 'SummaryColumn');
    }

    private focusCell(element: HTMLElement): void {
        this.getSummaryElements().forEach((wrap: HTMLElement) => {
            [].slice.call(wrap.querySelectorAll('[tabindex]')).concat(wrap.hasAttribute('tabindex') ? [wrap] : [])
                .forEach((cell: HTMLElement) => cell.setAttribute('tabindex', '-1'));
        });
        element.setAttribute('tabindex', '0');
        element.focus();
    }

    private focusWorkCell(cell: HTMLElement): void {
        this.parent.keyboardInteractionModule.selectCells(false, cell as HTMLTableCellElement);
        if (document.activeElement !== cell) {
            cell.focus();
        }
    }

    private isLastRenderedRow(): boolean {
        const base: Schedule['resourceBase'] = this.parent.resourceBase;
        if (!this.parent.virtualScrollModule || !base || !this.isGrouped()) {
            return true;
        }
        const rendered: TdData[] = base.renderedResources;
        const expanded: TdData[] = base.expandedResources;
        return rendered.length > 0 && rendered[rendered.length - 1].groupIndex === expanded[expanded.length - 1].groupIndex;
    }

    /**
     * Moves the focus with the arrow keys between the work cells and the summary cells and inside the summary cells.
     *
     * @param {KeyboardEventArgs} e Accepts the arrow key event.
     * @returns {boolean} Returns true when the key was handled by the summary.
     * @private
     */
    public processKey(e: KeyboardEventArgs): boolean {
        if (!this.isSupported() || (!this.summaryTr && !this.columnTd) || this.parent.element.querySelector('.' + cls.POPUP_OPEN)) {
            return false;
        }
        const names: Record<string, string> = { downArrow: 'Down', upArrow: 'Up', leftArrow: 'Left', rightArrow: 'Right' };
        const key: string = names[e.action];
        const target: HTMLElement = e.target as HTMLElement;
        if (!key || !target) {
            return false;
        }
        const rtl: boolean = this.parent.enableRtl;
        const trailing: string = rtl ? 'Left' : 'Right';
        const rowCells: SummaryCellInfo[] = this.getRowCells();
        const allDayCell: SummaryCellInfo = this.getColumnCells().filter((c: SummaryCellInfo) => c.kind === 'AllDay' && c.colSpan !== -1)[0];
        const allColumns: SummaryCellInfo[] = this.getColumnCells().filter((c: SummaryCellInfo) => c.kind !== 'AllDay');
        const columns: SummaryCellInfo[] = allColumns.filter((c: SummaryCellInfo) => c.colSpan !== -1);
        // A slot cell of the vertical views can cover several content rows (major slot).
        const columnAt: (r: number) => SummaryCellInfo = (r: number) => this.isVertical() ?
            allColumns.filter((c: SummaryCellInfo) => r >= c.rowStart && r < c.rowStart + c.rowCount)[0] :
            allColumns[parseInt(r.toString(), 10)];
        const contentTable: HTMLElement = this.parent.activeView.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        const contentRows: HTMLElement[] = contentTable ? this.getContentRows() : [];
        const lastRow: number = columns.length && !this.isVertical() ?
            allColumns.indexOf(columns[columns.length - 1]) : contentRows.length - 1;
        const starts: number[] = [];
        let offset: number = 0;
        rowCells.forEach((info: SummaryCellInfo) => { starts.push(offset); offset += info.colSpan; });
        const done: (element: HTMLElement) => boolean = (element: HTMLElement) => {
            e.preventDefault();
            if (element) {
                this.focusCell(element);
            }
            return true;
        };
        const doneWork: (cell: HTMLElement) => boolean = (cell: HTMLElement) => {
            e.preventDefault();
            this.focusWorkCell(cell);
            return true;
        };
        if (target.classList.contains(cls.WORK_CELLS_CLASS) && !target.classList.contains(cls.SUMMARY_CELL_CLASS)) {
            const tr: HTMLElement = target.parentElement;
            const r: number = contentRows.indexOf(tr);
            const c: number = (target as HTMLTableCellElement).cellIndex;
            if (r < 0) {
                return false;
            }
            if (key === 'Down' && rowCells.length && r === lastRow && this.isLastRenderedRow()) {
                const i: number = starts.reduce((found: number, start: number, n: number) => start <= c ? n : found, 0);
                this.parent.removeSelectedClass();
                return done(rowCells[parseInt(i.toString(), 10)].element);
            }
            const atEdge: boolean = c === (rtl ? 0 : tr.children.length - 1);
            if (key === trailing && atEdge && allColumns.length && columnAt(r) && columnAt(r).colSpan !== -1) {
                this.parent.removeSelectedClass();
                return done(columnAt(r).element);
            }
            return false;
        }
        const info: SummaryCellInfo = this.findInfo(target);
        if (!info || this.isLabel(info.renderType)) {
            return false;
        }
        if (info.kind === 'AllDay') {
            return done(key === 'Down' && columns.length ? columns[0].element : null);
        }
        if (info.renderType === 'SummaryRow') {
            const i: number = rowCells.indexOf(info);
            if (key === 'Up') {
                const tr: HTMLElement = contentRows[parseInt(lastRow.toString(), 10)];
                return tr ? doneWork(tr.children[starts[parseInt(i.toString(), 10)]] as HTMLElement) : done(null);
            }
            if (key === 'Left' || key === 'Right') {
                const next: number = i + (key === trailing ? 1 : -1);
                if (next >= 0 && next < rowCells.length) {
                    return done(rowCells[parseInt(next.toString(), 10)].element);
                }
                return done(next >= rowCells.length && this.totalCell ? this.totalCell.element : null);
            }
            return done(null);
        }
        if (info.renderType === 'SummaryColumn') {
            const i: number = columns.indexOf(info);
            if (key === 'Up' || key === 'Down') {
                const next: number = i + (key === 'Down' ? 1 : -1);
                if (next < 0 && allDayCell) {
                    return done(allDayCell.element);
                }
                if (next >= 0 && next < columns.length) {
                    return done(columns[parseInt(next.toString(), 10)].element);
                }
                return done(next >= columns.length && this.totalCell ? this.totalCell.element : null);
            }
            if (key === (rtl ? 'Right' : 'Left')) {
                const tr: HTMLElement = contentRows[this.isVertical() ? info.rowStart : allColumns.indexOf(info)];
                return tr ? doneWork((rtl ? tr.firstElementChild : tr.lastElementChild) as HTMLElement) : done(null);
            }
            return done(null);
        }
        if (key === 'Up' && columns.length) {
            return done(columns[columns.length - 1].element);
        }
        if (key === (rtl ? 'Right' : 'Left') && rowCells.length) {
            return done(rowCells[rowCells.length - 1].element);
        }
        return done(null);
    }

    private onClick(e: MouseEvent): void {
        this.raiseClick(e);
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            this.raiseClick(e);
        }
    }

    private raiseClick(e: MouseEvent | KeyboardEvent): void {
        const info: SummaryCellInfo = this.findInfo(e.target as Element);
        if (!info) {
            return;
        }
        const details: RenderSummaryCellEventArgs = this.getDetails(info.element);
        const args: SummaryCellClickEventArgs = {
            renderType: info.renderType, element: info.element, startTime: details.startTime, endTime: details.endTime,
            groupIndex: info.groupIndex, resourceData: info.resourceData, eventData: details.eventData, event: e, cancel: false
        };
        this.parent.trigger(events.summaryCellClick, args);
    }

    /**
     * Removes the summary elements and the event handlers.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.groupModule) {
            this.groupModule.destroy();
            this.groupModule = null;
        }
        if (this.parent) {
            this.parent.off(events.contentReady, this.onContentReady);
            this.parent.off(events.scrollUiUpdate, this.onScrollUiUpdate);
            this.parent.off(events.eventsLoaded, this.requestRefresh);
            if (!this.parent.isDestroyed) {
                this.removeLayout();
            }
        }
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
        if (this.alignFrame) {
            cancelAnimationFrame(this.alignFrame);
            this.alignFrame = 0;
        }
        this.cells = [];
        this.templates = {};
        this.index = {};
        this.parent = null;
    }
}
