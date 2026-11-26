import { createElement, addClass, removeClass, remove, setStyleAttribute, EventHandler, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { GroupSummaryModel } from '../models/models';
import { TdData, RenderSummaryCellEventArgs, SummaryCellClickEventArgs, CallbackFunction } from '../base/interface';
import { SummaryRenderMode } from '../base/type';
import { RowCellRange } from './summary';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

const SUPPORTED_VIEWS: string[] = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'TimelineYear'];

/** @private */
interface GroupCellInfo {
    element: HTMLElement;
    startTime: Date;
    endTime: Date;
    shownDates: Date[];
    row: TdData;
}

const TEMPLATE_NAME: string = 'groupSummaryTemplate';

/**
 * Group summary: the parent resource row of one level becomes the summary of its group (timeline views).
 *
 * Internal helper owned by the injectable `Summary` module; it is not injected on its own.
 *
 * @private
 */
export class GroupSummaryModule {
    private parent: Schedule;
    // The work cells that were replaced by the group summary cells, so they can be put back when the level moves or the feature is turned off.
    private saved: { row: HTMLElement; cells: HTMLElement[] }[] = [];
    private cells: GroupCellInfo[] = [];
    private scope: Record<number, Record<string, any>[]> = {};
    private template: CallbackFunction = null;
    private frame: number = 0;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.parent.on(events.contentReady, this.build, this);
        this.parent.on(events.eventsLoaded, this.requestRefresh, this);
        EventHandler.add(this.parent.element, 'click', this.onClick, this);
        EventHandler.add(this.parent.element, 'keydown', this.onKeyDown, this);
    }

    /**
     * Returns the group summary options of the active view.
     *
     * @returns {GroupSummaryModel} Returns the options.
     * @private
     */
    public get options(): GroupSummaryModel {
        return this.parent.activeViewOptions ? this.parent.activeViewOptions.groupSummary : null;
    }

    /**
     * Returns whether the group summary applies to the active view: an enabled option, a supported timeline view,
     * a hierarchy of two or more resource levels and no group adaptive layout.
     *
     * @returns {boolean} Returns true when the group summary is active.
     * @private
     */
    public isActive(): boolean {
        const options: Schedule['activeViewOptions'] = this.parent.activeViewOptions;
        const base: Schedule['resourceBase'] = this.parent.resourceBase;
        return !!(this.parent.activeView && options && options.groupSummary && options.groupSummary.enable &&
            SUPPORTED_VIEWS.indexOf(options.option) > -1 && !this.parent.uiStateValues.isGroupAdaptive &&
            options.group.resources.length > 0 && base && base.resourceCollection.length > 1 &&
            (options.option !== 'TimelineYear' || options.orientation === 'Vertical'));
    }

    /**
     * Returns the level indexes of the group summary parent rows, or an empty list when the group summary is not active.
     * The `resources` names select the levels. When it is not set or empty, every level except the last one is used.
     * Unknown names and the last level are ignored.
     *
     * @returns {number[]} Returns the level indexes.
     * @private
     */
    public getLevels(): number[] {
        if (!this.isActive()) {
            return [];
        }
        const names: string[] = this.parent.resourceBase.resourceCollection.map((resource: { name?: string }) => resource.name);
        const requested: string[] = this.options.resources;
        const levels: number[] = [];
        for (let index: number = 0; index < names.length - 1; index++) {
            if (!requested || requested.length === 0 || requested.indexOf(names[parseInt(index.toString(), 10)]) > -1) {
                levels.push(index);
            }
        }
        return levels;
    }

    /**
     * Returns the first content row that holds work cells. The first row of the content table is a group summary row when the
     * top-most parent is the group summary level, and its merged cells cannot be addressed by a work cell index.
     *
     * @returns {HTMLTableRowElement} Returns the row.
     * @private
     */
    public getFirstWorkRow(): HTMLTableRowElement {
        const rows: HTMLTableRowElement[] = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
        return rows.filter((row: HTMLTableRowElement) => !row.classList.contains(cls.GROUP_SUMMARY_ROW_CLASS))[0] || rows[0];
    }

    /**
     * Returns whether the element is, or is inside, a group summary cell.
     *
     * @param {Element} target Accepts the element.
     * @returns {boolean} Returns true for a group summary cell.
     * @private
     */
    public isGroupTarget(target: Element): boolean {
        return !!target && !!closest(target, '.' + cls.GROUP_SUMMARY_CELL_CLASS);
    }

    /**
     * Returns whether the resource group index belongs to a group summary parent row.
     *
     * @param {number} groupIndex Accepts the group index.
     * @returns {boolean} Returns true for a group summary parent row.
     * @private
     */
    public isGroupIndex(groupIndex: number): boolean {
        return this.cells.some((info: GroupCellInfo) => info.row.groupIndex === groupIndex);
    }

    /**
     * Moves the focus with the arrow keys into, out of and across the group summary cells.
     *
     * @param {KeyboardEventArgs} e Accepts the arrow key event.
     * @returns {boolean} Returns true when the key was handled.
     * @private
     */
    public processKey(e: KeyboardEventArgs): boolean {
        if (this.cells.length === 0 || this.parent.element.querySelector('.' + cls.POPUP_OPEN)) {
            return false;
        }
        const names: Record<string, string> = { downArrow: 'Down', upArrow: 'Up', leftArrow: 'Left', rightArrow: 'Right' };
        const key: string = names[e.action];
        const target: HTMLElement = e.target as HTMLElement;
        if (!key || !target) {
            return false;
        }
        const rtl: boolean = this.parent.enableRtl;
        const tr: HTMLTableRowElement = closest(target, 'tr') as HTMLTableRowElement;
        const rows: HTMLTableRowElement[] =
            this.getContentRows().filter((row: HTMLTableRowElement) => !row.classList.contains(cls.HIDDEN_CLASS));
        const at: number = rows.indexOf(tr);
        if (at < 0) {
            return false;
        }
        const isGroupCell: boolean = target.classList.contains(cls.GROUP_SUMMARY_CELL_CLASS);
        const starts: (row: HTMLTableRowElement) => number[] = (row: HTMLTableRowElement) => {
            let offset: number = 0;
            return [].slice.call(row.cells).map((cell: HTMLTableCellElement) => {
                const start: number = offset;
                offset += cell.colSpan || 1;
                return start;
            });
        };
        const cellAt: (row: HTMLTableRowElement, column: number) => HTMLElement = (row: HTMLTableRowElement, column: number) => {
            const list: number[] = starts(row);
            let found: number = 0;
            list.forEach((start: number, i: number) => { if (start <= column) { found = i; } });
            return row.cells[parseInt(found.toString(), 10)] as HTMLElement;
        };
        const index: number = (target as HTMLTableCellElement).cellIndex;
        const column: number = isGroupCell ? starts(tr)[parseInt(index.toString(), 10)] : index;
        if (!isGroupCell && key !== 'Up' && key !== 'Down') {
            return false;
        }
        if (isGroupCell && (key === 'Left' || key === 'Right')) {
            const next: number = (target as HTMLTableCellElement).cellIndex + ((key === 'Right') !== rtl ? 1 : -1);
            e.preventDefault();
            if (next >= 0 && next < tr.cells.length) {
                this.focusCell(tr.cells[parseInt(next.toString(), 10)] as HTMLElement);
            }
            return true;
        }
        const neighbour: HTMLTableRowElement = rows[at + (key === 'Down' ? 1 : -1)];
        if (!neighbour) {
            if (isGroupCell) {
                e.preventDefault();
                return true;
            }
            return false;
        }
        const destination: HTMLElement = cellAt(neighbour, column);
        if (neighbour.classList.contains(cls.GROUP_SUMMARY_ROW_CLASS)) {
            e.preventDefault();
            this.parent.removeSelectedClass();
            this.focusCell(destination);
            return true;
        }
        if (isGroupCell) {
            e.preventDefault();
            this.parent.keyboardInteractionModule.selectCells(false, destination as HTMLTableCellElement);
            return true;
        }
        return false;
    }

    private focusCell(element: HTMLElement): void {
        this.cells.forEach((info: GroupCellInfo) => info.element.setAttribute('tabindex', '-1'));
        element.setAttribute('tabindex', '0');
        element.focus();
    }

    /**
     * Returns whether the given resource row is a group summary parent row.
     *
     * @param {TdData} row Accepts the resource row data.
     * @returns {boolean} Returns true for a group summary parent row.
     * @private
     */
    public isGroupRow(row: TdData): boolean {
        return !!row && this.getLevels().indexOf(this.getRowLevel(row)) > -1;
    }

    // The rendered rows carry the resource of their level, so the level is the position of that resource in the grouped resources.
    private getRowLevel(row: TdData): number {
        const name: string = row.resource ? row.resource.name : null;
        return this.parent.resourceBase.resourceCollection.map((resource: { name?: string }) => resource.name).indexOf(name);
    }

    /**
     * Puts the work cells back and builds the group summary rows again, then renders the events of the restored rows.
     *
     * @returns {void}
     * @private
     */
    public refresh(): void {
        this.restore();
        this.build();
        this.parent.refreshEvents(false);
    }

    private requestRefresh(): void {
        if (this.frame || this.cells.length === 0) {
            return;
        }
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            if (this.parent && !this.parent.isDestroyed) {
                this.refreshCells();
            }
        });
    }

    /**
     * Refreshes the group summary cells: the `renderSummaryCell` event is triggered in the `Refresh` mode for the given cell,
     * or for every group summary cell when no element is passed.
     *
     * @param {Element} element Accepts the optional element of a single cell.
     * @returns {boolean} Returns true when the element is a group summary cell, or when no element is passed.
     * @private
     */
    public refreshCells(element?: Element): boolean {
        if (element && !this.findInfo(element)) {
            return false;
        }
        if (this.getLevels().length === 0) {
            return !element;
        }
        this.buildScope();
        this.parseTemplate();
        this.parent.resetTemplates([TEMPLATE_NAME]);
        const list: GroupCellInfo[] = element ? [this.findInfo(element)] : this.cells;
        list.forEach((info: GroupCellInfo) => this.raise(info, 'Refresh'));
        this.syncHeights();
        return true;
    }

    private parseTemplate(): void {
        this.template = this.parent.templateParser(this.options.template);
    }

    private findInfo(element: Element): GroupCellInfo {
        for (const info of this.cells) {
            if (info.element === element || info.element.contains(element)) {
                return info;
            }
        }
        return null;
    }

    // The rows below the parent in the resource tree, at every depth, whether expanded, collapsed or outside the rendered window.
    private getDescendants(row: TdData): TdData[] {
        const order: string[] = row.groupOrder;
        return this.parent.resourceBase.lastResourceLevel.filter((candidate: TdData) => candidate !== row &&
            !!candidate.groupOrder && candidate.groupOrder.length > order.length &&
            order.every((id: string, level: number) => candidate.groupOrder[parseInt(level.toString(), 10)] === id));
    }

    // One sorted, de-duplicated list of the descendants' events per group summary parent. The parent's own events are not in it.
    private buildScope(): void {
        const fields: Schedule['eventFields'] = this.parent.eventFields;
        const all: Record<string, any>[] = this.parent.eventsProcessed;
        this.scope = {};
        const done: Record<number, boolean> = {};
        for (const info of this.cells) {
            const key: number = info.row.groupIndex;
            if (done[parseInt(key.toString(), 10)]) {
                continue;
            }
            done[parseInt(key.toString(), 10)] = true;
            const unique: Set<Record<string, any>> = new Set<Record<string, any>>();
            this.getDescendants(info.row).forEach((child: TdData) => {
                this.parent.eventBase.filterEventsByResource(child, all).forEach((item: Record<string, any>) => unique.add(item));
            });
            const list: Record<string, any>[] = [];
            unique.forEach((item: Record<string, any>) => list.push(item));
            list.sort((a: Record<string, any>, b: Record<string, any>) =>
                (a[fields.startTime] as Date).getTime() - (b[fields.startTime] as Date).getTime());
            this.scope[parseInt(key.toString(), 10)] = list;
        }
    }

    private getEvents(info: GroupCellInfo): Record<string, any>[] {
        const fields: Schedule['eventFields'] = this.parent.eventFields;
        const start: number = info.startTime.getTime();
        const end: number = info.endTime.getTime();
        const result: Record<string, any>[] = [];
        for (const item of this.scope[info.row.groupIndex] || []) {
            const s: number = (item[fields.startTime] as Date).getTime();
            const e: number = (item[fields.endTime] as Date).getTime();
            if (s >= end) {
                break;
            }
            if (e > start || (e === s && s >= start)) {
                result.push(item);
            }
        }
        return result;
    }

    private getDetailsOf(info: GroupCellInfo, mode: SummaryRenderMode): RenderSummaryCellEventArgs {
        const row: TdData = info.row;
        const expandedField: string = row.resource.expandedField;
        const children: Record<string, any>[] = this.getDescendants(row).map((child: TdData) => child.resourceData);
        return {
            mode: mode, renderType: 'GroupSummary', element: info.element, text: '',
            startTime: info.startTime, endTime: info.endTime,
            visibleHours: { startHour: this.parent.activeViewOptions.startHour, endHour: this.parent.activeViewOptions.endHour },
            shownDates: info.shownDates, groupIndex: row.groupIndex, resourceData: row.resourceData,
            eventData: mode === 'Refresh' ? this.getEvents(info) : [],
            groupLevel: this.getRowLevel(row), resourceName: row.resource.name,
            isCollapsed: !row.resourceData[`${expandedField}`] && !isNullOrUndefined(row.resourceData[`${expandedField}`]),
            childResourceData: children
        };
    }

    private raise(info: GroupCellInfo, mode: SummaryRenderMode): void {
        if (mode === 'Refresh') {
            // The element is emptied in place, so the application receives a clean element and the click handling stays valid.
            while (info.element.firstChild) {
                info.element.removeChild(info.element.firstChild);
            }
            info.element.removeAttribute('aria-label');
        }
        const args: RenderSummaryCellEventArgs = this.getDetailsOf(info, mode);
        if (this.template) {
            const context: Record<string, any> = {};
            Object.keys(args).forEach((key: string) => {
                if (key !== 'element' && key !== 'text') {
                    context[`${key}`] = (args as Record<string, any>)[`${key}`];
                }
            });
            const id: string = this.parent.element.id + '_' + TEMPLATE_NAME;
            const nodes: HTMLElement[] = [].slice.call(
                this.template(context, this.parent, TEMPLATE_NAME, id, false, undefined, undefined, this.parent.root));
            nodes.forEach((node: HTMLElement) => info.element.appendChild(node));
        }
        try {
            this.parent.trigger(events.renderSummaryCell, args);
        } catch (error) {
            // A throwing handler leaves its own cell blank and must not stop the other cells.
            console.warn('Scheduler: the renderSummaryCell handler threw an error.', error);
            return;
        }
        if (!this.template && args.text) {
            info.element.insertBefore(document.createTextNode(args.text), info.element.firstChild);
        }
        if (mode === 'Refresh') {
            const parts: string[] = [this.parent.localeObj.getConstant('summary'), String(args.resourceData[info.row.resource.textField])];
            parts.push(this.parent.globalize.formatDate(info.startTime, { type: 'dateTime', skeleton: 'short' }) + ' - ' +
                this.parent.globalize.formatDate(info.endTime, { type: 'dateTime', skeleton: 'short' }));
            parts.push(info.element.textContent);
            info.element.setAttribute('aria-label', parts.join(', '));
        }
    }

    /**
     * Returns the render type, the range and the scope of a group summary element.
     *
     * @param {Element} element Accepts the element.
     * @returns {RenderSummaryCellEventArgs} Returns the details, or null for an element that is not a group summary cell.
     * @private
     */
    public getDetails(element: Element): RenderSummaryCellEventArgs {
        const info: GroupCellInfo = element ? this.findInfo(element) : null;
        if (!info) {
            return null;
        }
        this.buildScope();
        const args: RenderSummaryCellEventArgs = this.getDetailsOf(info, 'Refresh');
        args.text = info.element.textContent;
        return args;
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
        const target: Element = closest(e.target as Element, '.' + cls.GROUP_SUMMARY_CELL_CLASS);
        const info: GroupCellInfo = target ? this.findInfo(target) : null;
        if (!info) {
            return;
        }
        const details: RenderSummaryCellEventArgs = this.getDetails(info.element);
        const args: SummaryCellClickEventArgs = {
            renderType: 'GroupSummary', element: info.element, startTime: details.startTime, endTime: details.endTime,
            groupIndex: details.groupIndex, resourceData: details.resourceData, eventData: details.eventData, event: e, cancel: false,
            groupLevel: details.groupLevel, resourceName: details.resourceName, isCollapsed: details.isCollapsed,
            childResourceData: details.childResourceData
        };
        this.parent.trigger(events.summaryCellClick, args);
    }

    private getContentRows(): HTMLTableRowElement[] {
        const table: HTMLTableElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLTableElement;
        return table ? [].slice.call(table.tBodies[0].rows) : [];
    }

    private getResourceRows(): HTMLTableRowElement[] {
        return [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_COLUMN_TABLE_CLASS + ' tbody tr'));
    }

    private getGroupIndex(row: HTMLElement): number {
        return parseInt(row.firstElementChild ? row.firstElementChild.getAttribute('data-group-index') : '', 10);
    }

    private getCellUnit(): GroupSummaryModel['cellUnit'] {
        return this.options.cellUnit;
    }

    /**
     * Replaces the work cells of every group summary parent row with the group summary cells, one per cell unit.
     * It is safe to call repeatedly: rows that are already built are left as they are.
     *
     * @returns {void}
     * @private
     */
    public build(): void {
        const levels: number[] = this.getLevels();
        if (levels.length === 0 || !this.parent.summaryModule) {
            return;
        }
        this.saved = this.saved.filter((item: { row: HTMLElement }) => this.parent.element.contains(item.row));
        this.cells = this.cells.filter((info: GroupCellInfo) => this.parent.element.contains(info.element));
        const ranges: RowCellRange[] = this.parent.summaryModule.getUnitRanges(this.getCellUnit());
        const parents: Record<number, TdData> = {};
        for (const row of this.parent.resourceBase.renderedResources) {
            if (levels.indexOf(this.getRowLevel(row)) > -1) {
                parents[row.groupIndex] = row;
            }
        }
        const resourceRows: HTMLTableRowElement[] = this.getResourceRows();
        const built: HTMLElement[] = [];
        const created: GroupCellInfo[] = [];
        for (const row of this.getContentRows()) {
            const groupIndex: number = this.getGroupIndex(row);
            const data: TdData = parents[parseInt(groupIndex.toString(), 10)];
            if (!data || row.classList.contains(cls.GROUP_SUMMARY_ROW_CLASS)) {
                continue;
            }
            const cells: HTMLElement[] = [].slice.call(row.cells);
            const spanned: number = ranges.reduce((total: number, range: RowCellRange) => total + range.colSpan, 0);
            if (spanned !== cells.length) {
                continue;
            }
            this.saved.push({ row: row, cells: cells });
            cells.forEach((cell: HTMLElement) => remove(cell));
            addClass([row], cls.GROUP_SUMMARY_ROW_CLASS);
            row.setAttribute('aria-label', this.parent.localeObj.getConstant('summary') + ', ' +
                String(data.resourceData[data.resource.textField]));
            let column: number = 1;
            for (const range of ranges) {
                const td: HTMLElement = createElement('td', {
                    className: cls.SUMMARY_CELL_CLASS + ' ' + cls.GROUP_SUMMARY_CELL_CLASS,
                    attrs: {
                        role: 'gridcell', 'aria-readonly': 'true', tabindex: '-1', 'data-group-index': groupIndex.toString(),
                        'aria-colindex': column.toString()
                    }
                });
                column += range.colSpan;
                if (range.colSpan > 1) {
                    td.setAttribute('colspan', range.colSpan.toString());
                }
                row.appendChild(td);
                const info: GroupCellInfo = { element: td, startTime: range.start, endTime: range.end, shownDates: range.dates, row: data };
                this.cells.push(info);
                created.push(info);
            }
            const resourceRow: HTMLTableRowElement =
                resourceRows.filter((r: HTMLTableRowElement) => this.getGroupIndex(r) === groupIndex)[0];
            if (resourceRow) {
                addClass([resourceRow], cls.GROUP_SUMMARY_ROW_CLASS);
                built.push(resourceRow);
            }
            built.push(row);
        }
        if (built.length > 0) {
            this.parseTemplate();
            created.forEach((info: GroupCellInfo) => this.raise(info, 'Initial'));
            this.syncHeights();
        }
    }

    /**
     * Makes the content row and the resource row of every group summary parent as tall as the tallest group summary cell,
     * with the normal resource row height as the minimum.
     *
     * @returns {void}
     * @private
     */
    public syncHeights(): void {
        const resourceRows: HTMLTableRowElement[] = this.getResourceRows();
        const items: { cells: HTMLElement[]; resourceCell: HTMLElement }[] = [];
        for (const row of this.getContentRows()) {
            if (!row.classList.contains(cls.GROUP_SUMMARY_ROW_CLASS)) {
                continue;
            }
            const groupIndex: number = this.getGroupIndex(row);
            const resourceRow: HTMLElement = resourceRows.filter((r: HTMLTableRowElement) => this.getGroupIndex(r) === groupIndex)[0];
            items.push({
                cells: [].slice.call(row.cells),
                resourceCell: resourceRow ? resourceRow.firstElementChild as HTMLElement : null
            });
        }
        // Every row is cleared before any row is measured, so the result does not depend on the heights of an earlier pass.
        items.forEach((item: { cells: HTMLElement[]; resourceCell: HTMLElement }) => {
            item.cells.forEach((cell: HTMLElement) => setStyleAttribute(cell, { height: '' }));
            if (item.resourceCell) {
                setStyleAttribute(item.resourceCell, { height: '' });
            }
        });
        const natural: number = items.length > 0 ? this.getNaturalRowHeight() : 0;
        items.forEach((item: { cells: HTMLElement[]; resourceCell: HTMLElement }) => {
            // A table cell reports its stretched box, so the content is measured with a range.
            const needed: number = Math.max(0, ...item.cells.map((cell: HTMLElement) => {
                const range: Range = document.createRange();
                range.selectNodeContents(cell);
                const style: CSSStyleDeclaration = getComputedStyle(cell);
                return Math.ceil(range.getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
            }));
            // The content table shares its spare height by natural row height, so the row gets the natural height of a work row (the
            // minimum) or the height of its tallest cell, never the stretched height, which would squeeze the rows below it.
            const height: number = Math.max(needed, natural);
            const apply: (cell: HTMLElement) => void = (cell: HTMLElement) => {
                const style: CSSStyleDeclaration = getComputedStyle(cell);
                const box: number = style.boxSizing === 'border-box' ? 0 : parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
                    parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
                setStyleAttribute(cell, { height: Math.max(0, height - box) + 'px' });
            };
            item.cells.forEach(apply);
            if (item.resourceCell) {
                apply(item.resourceCell);
            }
        });
    }

    // The height a plain work row has before the table shares its spare height, read from a probe cell of the content table.
    private getNaturalRowHeight(): number {
        const table: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        const probe: HTMLElement = createElement('table', {
            className: table.className,
            innerHTML: '<tbody><tr><td class="' + cls.WORK_CELLS_CLASS + '"></td></tr></tbody>'
        });
        setStyleAttribute(probe, { position: 'absolute', visibility: 'hidden', width: 'auto', height: 'auto' });
        table.parentElement.appendChild(probe);
        const height: number = (probe.querySelector('td') as HTMLElement).offsetHeight;
        remove(probe);
        return height;
    }

    private restore(): void {
        this.cells = [];
        for (const item of this.saved) {
            [].slice.call((item.row as HTMLTableRowElement).cells).forEach((cell: HTMLElement) => remove(cell));
            item.cells.forEach((cell: HTMLElement) => item.row.appendChild(cell));
            removeClass([item.row], cls.GROUP_SUMMARY_ROW_CLASS);
            const groupIndex: number = this.getGroupIndex(item.row);
            this.getResourceRows().filter((r: HTMLTableRowElement) => this.getGroupIndex(r) === groupIndex).forEach((r: HTMLElement) => {
                removeClass([r], cls.GROUP_SUMMARY_ROW_CLASS);
                setStyleAttribute(r.firstElementChild as HTMLElement, { height: '' });
            });
        }
        this.saved = [];
    }

    /**
     * Destroys the module and puts the work cells back.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.parent && this.parent.activeView && this.parent.element && !this.parent.isDestroyed) {
            this.restore();
        }
        if (this.parent) {
            this.parent.off(events.contentReady, this.build);
            this.parent.off(events.eventsLoaded, this.requestRefresh);
            EventHandler.remove(this.parent.element, 'click', this.onClick);
            EventHandler.remove(this.parent.element, 'keydown', this.onKeyDown);
        }
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
        this.cells = [];
        this.scope = {};
        this.saved = [];
        this.parent = null;
    }
}
