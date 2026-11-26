import {
    isNullOrUndefined, createElement, append, setStyleAttribute, EventHandler, closest
} from '@syncfusion/ej2-base';
import { ResourceDetails, TdData, ActionEventArgs, ResizeEdges } from '../base/interface';
import * as events from '../base/constant';
import { Schedule } from '../base/schedule';
import { GroupModel } from '../models/group-model';
import { FixedRowsSettingsModel } from '../models/fixed-rows-settings-model';
import { ViewBase } from '../renderer/view-base';
import * as cls from '../base/css-constant';
import { getDescendantCount } from '../base/util';

interface FixedOverride {
    value: boolean;
    data: boolean;
}

interface PendingChange {
    args: ActionEventArgs;
}

interface FixedState {
    all: string[];
    roots: string[];
    blocks: Record<string, string[]>;
    depths: Record<string, number>;
}

/**
 * Fixed rows module. Holds the fixed state of the resource rows by resource identity
 * and exposes it to the timeline renderers.
 */
export class FixedRows {
    private parent: Schedule;
    private fixedKeys: string[] = [];
    private rootKeys: string[] = [];
    private blocks: Record<string, string[]> = {};
    private depths: Record<string, number> = {};
    private pathIndex: Record<string, TdData> = {};
    private pathSource: TdData[] = null;
    private isSeeded: boolean = false;

    private details: Record<string, ResourceDetails> = {};
    private pending: PendingChange[] = [];
    private held: Record<string, { row: TdData, fix: boolean }> = {};
    private focusGroupIndex: string = null;
    private overrides: Record<string, FixedOverride> = {};

    constructor(parent: Schedule) {
        this.parent = parent;
        this.parent.on(events.contentReady, this.onContentReady, this);
        this.parent.on(events.interactionEnd, this.releaseHeld, this);
        const source: FixedRows = this.parent.printSource ? this.parent.printSource.fixedRowsModule : null;
        if (source) {
            // A printout keeps the rows the user pinned in the Scheduler it was made from.
            Object.keys(source.overrides).forEach((key: string) => {
                this.overrides[`${key}`] = source.overrides[`${key}`];
            });
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} Returns the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'fixedRows';
    }

    /**
     * Returns the fixed state key of a resource row, built from the collection name and the resource id.
     *
     * @param {TdData} row Accepts the resource row data.
     * @returns {string} Returns the identity key.
     * @private
     */
    public getKey(row: TdData): string {
        const path: string = row.groupOrder && row.groupOrder.length > 0 ? row.groupOrder.join('\u001f') :
            (row.resourceData[row.resource.idField] as string | number).toString();
        return row.resource.name + '\u001f' + path;
    }

    /**
     * Reads the fixed state of the rows from the `fixedField` of the resource data.
     *
     * @param {TdData[]} rows Accepts the resource rows in resource order.
     * @returns {void}
     * @private
     */
    public updateFromData(rows: TdData[]): void {
        const previous: string[] = this.fixedKeys;
        const previousRoots: string[] = this.rootKeys;
        const previousBlocks: Record<string, string[]> = this.blocks;
        const previousDetails: Record<string, ResourceDetails> = this.details;
        this.applyState(this.computeState(rows, this.overrides, true), rows);
        if (this.isSeeded) {
            this.queueChanges(previous, previousRoots, previousBlocks, previousDetails, rows);
        }
        this.isSeeded = true;
    }

    private applyState(state: FixedState, rows: TdData[]): void {
        this.fixedKeys = state.all;
        this.rootKeys = state.roots;
        this.blocks = state.blocks;
        this.depths = state.depths;
        const lookup: Record<string, boolean> = this.toLookup(state.all);
        this.details = {};
        rows.forEach((row: TdData) => {
            const key: string = this.getKey(row);
            if (lookup[`${key}`]) {
                this.details[`${key}`] = { resource: row.resource, resourceData: row.resourceData };
            }
        });
    }

    private toLookup(keys: string[]): Record<string, boolean> {
        const lookup: Record<string, boolean> = {};
        for (const key of keys) {
            lookup[`${key}`] = true;
        }
        return lookup;
    }

    /**
     * Returns the fixed state a row asks for. A pin or unpin made by the user stays in effect until the fixed value
     * of that row changes in the resource data, which then replaces the user choice.
     *
     * @param {TdData} row Accepts the resource row data.
     * @param {Record<string, FixedOverride>} overrides Accepts the user choices.
     * @param {boolean} prune Accepts whether the choices replaced by a data change are dropped.
     * @returns {boolean} Returns true when the row is asked to be fixed.
     */
    private isExplicit(row: TdData, overrides: Record<string, FixedOverride>, prune: boolean): boolean {
        const dataValue: boolean = row.resourceData[row.resource.fixedField] === true;
        const key: string = this.getKey(row);
        const override: FixedOverride = overrides[`${key}`];
        if (override) {
            if (override.data === dataValue) {
                return override.value;
            }
            if (prune) {
                delete overrides[`${key}`];
            }
        }
        return dataValue;
    }

    /**
     * Builds the fixed blocks. A fixed row takes its whole subtree with it, so a fixed row inside the subtree of a
     * fixed row is part of that block and not a block of its own.
     *
     * @param {TdData[]} rows Accepts all the resource rows in resource order.
     * @param {Record<string, FixedOverride>} overrides Accepts the user choices.
     * @param {boolean} prune Accepts whether the choices replaced by a data change are dropped.
     * @returns {FixedState} Returns the fixed state.
     */
    private computeState(rows: TdData[], overrides: Record<string, FixedOverride>, prune: boolean): FixedState {
        const state: FixedState = { all: [], roots: [], blocks: {}, depths: {} };
        let index: number = 0;
        while (index < rows.length) {
            if (this.isExplicit(rows[parseInt(index.toString(), 10)], overrides, prune)) {
                const end: number = index + getDescendantCount(rows, index);
                const keys: string[] = rows.slice(index, end + 1).map((row: TdData) => this.getKey(row));
                state.roots.push(keys[0]);
                state.blocks[keys[0]] = keys;
                const depth: number = Math.max(rows[parseInt(index.toString(), 10)].groupOrder.length - 1, 0);
                for (const key of keys) {
                    state.depths[`${key}`] = depth;
                }
                state.all = state.all.concat(keys);
                index = end + 1;
            } else {
                index++;
            }
        }
        if (state.roots.length > 0 && state.all.length === rows.length) {
            // At least one row stays in the scrolling region: the last block is not placed.
            const dropped: string[] = state.blocks[state.roots.pop()];
            state.all = state.all.filter((key: string) => dropped.indexOf(key) < 0);
            dropped.forEach((key: string) => {
                delete state.blocks[`${key}`];
                delete state.depths[`${key}`];
            });
        }
        return state;
    }

    private indexOfRow(row: TdData): number {
        const rows: TdData[] = this.parent.resourceBase.lastResourceLevel;
        const key: string = this.getKey(row);
        const direct: TdData = rows[row.groupIndex];
        if (direct && this.getKey(direct) === key) {
            return row.groupIndex;
        }
        return rows.map((item: TdData) => this.getKey(item)).indexOf(key);
    }

    /**
     * Adds the pin state, the ancestor path and the pin actions of a row to the resource header template context.
     *
     * @param {ResourceDetails} data Accepts the template context.
     * @param {TdData} row Accepts the resource row data.
     * @returns {void}
     * @private
     */
    public extendTemplateContext(data: ResourceDetails, row: TdData): void {
        data.canPin = this.canPin(row);
        data.canUnpin = this.canUnpin(row);
        data.path = this.getAncestors(row).map((item: TdData) => item.resourceData[item.resource.textField] as string);
        data.pin = () => this.setFixed(row, true);
        data.unpin = () => this.setFixed(row, false);
    }

    private getAncestors(row: TdData): TdData[] {
        const rows: TdData[] = this.parent.resourceBase.lastResourceLevel;
        if (this.pathSource !== rows) {
            this.pathSource = rows;
            this.pathIndex = {};
            rows.forEach((item: TdData) => {
                this.pathIndex[item.groupOrder.join('\u001f')] = item;
            });
        }
        const ancestors: TdData[] = [];
        const order: string[] = row.groupOrder || [];
        for (let level: number = 1; level < order.length; level++) {
            const ancestor: TdData = this.pathIndex[order.slice(0, level).join('\u001f')];
            if (ancestor) {
                ancestors.push(ancestor);
            }
        }
        return ancestors;
    }

    /**
     * Returns the resource level that is drawn without indent in the fixed region: the level of the block root.
     *
     * @param {TdData} row Accepts the resource row data.
     * @returns {number} Returns the level of the block root, or zero for a row of the scrolling region.
     * @private
     */
    public getIndentBase(row: TdData): number {
        return this.parent.resourceBase.fixedResourceLevel.indexOf(row) < 0 ? 0 : (this.depths[this.getKey(row)] || 0);
    }

    private canUnpin(row: TdData): boolean {
        const isRendered: boolean = this.isActive() && this.parent.resourceBase.fixedResourceLevel.indexOf(row) > -1;
        return isRendered && this.rootKeys.indexOf(this.getKey(row)) > -1;
    }

    private isBusy(): boolean {
        const editor: Schedule['eventWindow'] = this.parent.eventWindow;
        const isEditorOpen: boolean = !!editor && !!editor.dialogObject && !!editor.dialogObject.visible;
        return !!this.parent.uiStateValues.action || isEditorOpen;
    }

    private releaseHeld(): void {
        if (!this.parent || this.parent.isDestroyed || Object.keys(this.held).length === 0) {
            return;
        }
        // The dialog raises `close` before it clears `visible`, so the held pins are applied once it has settled.
        window.setTimeout(() => this.applyHeld(), 0);
    }

    private applyHeld(): void {
        if (this.isBusy() || !this.parent || this.parent.isDestroyed) {
            return;
        }
        const queue: { row: TdData, fix: boolean }[] = Object.keys(this.held).map((key: string) => this.held[`${key}`]);
        this.held = {};
        queue.forEach((item: { row: TdData, fix: boolean }) => {
            const current: TdData = this.parent.resourceBase.lastResourceLevel.filter((row: TdData) =>
                this.getKey(row) === this.getKey(item.row))[0];
            if (current) {
                this.setFixed(current, item.fix);
            }
        });
    }

    private canPin(row: TdData): boolean {
        if (!this.isSeeded || !this.isActive() || this.isFixed(row)) {
            return false;
        }
        const rows: TdData[] = this.parent.resourceBase.lastResourceLevel;
        const index: number = this.indexOfRow(row);
        if (index < 0) {
            return false;
        }
        const fixed: Record<string, boolean> = this.toLookup(this.fixedKeys);
        const added: number = rows.slice(index, index + getDescendantCount(rows, index) + 1)
            .filter((item: TdData) => !fixed[this.getKey(item)]).length;
        return rows.length - this.fixedKeys.length - added > 0;
    }

    /**
     * Pins or unpins a block on behalf of the user. It raises `actionBegin` (cancellable) before and `actionComplete`
     * after the layout reflects the change.
     *
     * @param {TdData} row Accepts the resource row data.
     * @param {boolean} fix Accepts true to pin and false to unpin the row with its subtree.
     * @returns {void}
     * @private
     */
    public setFixed(row: TdData, fix: boolean): void {
        if (!this.parent || this.parent.isDestroyed || !this.isActive()) {
            return;
        }
        if (this.isBusy()) {
            this.held[this.getKey(row)] = { row: row, fix: fix };
            return;
        }
        const rows: TdData[] = this.parent.resourceBase.lastResourceLevel;
        const index: number = this.indexOfRow(row);
        const key: string = this.getKey(row);
        const target: TdData = rows[parseInt(index.toString(), 10)];
        if (index < 0 || (fix && !this.canPin(target)) || (!fix && !this.canUnpin(target))) {
            return;
        }
        const block: TdData[] = rows.slice(index, index + getDescendantCount(rows, index) + 1);
        const nextOverrides: Record<string, FixedOverride> = {};
        Object.keys(this.overrides).forEach((item: string) => {
            nextOverrides[`${item}`] = this.overrides[`${item}`];
        });
        const dataValue: (item: TdData) => boolean = (item: TdData) => item.resourceData[item.resource.fixedField] === true;
        if (fix) {
            nextOverrides[`${key}`] = { value: true, data: dataValue(block[0]) };
            block.slice(1).forEach((item: TdData) => delete nextOverrides[this.getKey(item)]);
        } else {
            block.forEach((item: TdData) => {
                nextOverrides[this.getKey(item)] = { value: false, data: dataValue(item) };
            });
        }
        const nextState: FixedState = this.computeState(rows, nextOverrides, false);
        const previous: string[] = this.fixedKeys;
        const byKey: Record<string, TdData> = {};
        rows.forEach((item: TdData) => {
            byKey[this.getKey(item)] = item;
        });
        const toDetails: (keys: string[]) => ResourceDetails[] = (keys: string[]) => keys.map((item: string) =>
            ({ resource: byKey[`${item}`].resource, resourceData: byKey[`${item}`].resourceData }));
        const blockKeys: string[] = block.map((item: TdData) => this.getKey(item));
        const args: ActionEventArgs = {
            requestType: fix ? 'resourceFix' : 'resourceUnfix', cancel: false, isUserInitiated: true, cause: 'user',
            fixedResources: toDetails(blockKeys), fixedIndex: fix ? nextState.all.indexOf(blockKeys[0]) : previous.indexOf(blockKeys[0]),
            previousFixedResources: toDetails(previous), currentFixedResources: toDetails(nextState.all)
        };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (actionArgs.cancel || !this.parent || this.parent.isDestroyed) {
                return;
            }
            const active: Element = document.activeElement;
            const header: Element = active && this.parent.element.contains(active) ? closest(active, '.' + cls.RESOURCE_CELLS_CLASS) : null;
            this.focusGroupIndex = header ? header.getAttribute('data-group-index') : null;
            this.overrides = nextOverrides;
            this.applyState(nextState, rows);
            this.pending.push({
                args: {
                    requestType: fix ? 'resourceFixed' : 'resourceUnfixed', cancel: false, isUserInitiated: true, cause: 'user',
                    fixedResources: args.fixedResources, fixedIndex: args.fixedIndex,
                    previousFixedResources: args.previousFixedResources, currentFixedResources: args.currentFixedResources
                }
            });
            this.parent.activeCellsData = null;
            this.parent.uiStateValues.isPreventDataFetch = true;
            this.parent.initializeView(this.parent.currentView);
        });
    }

    private queueChanges(previous: string[], previousRoots: string[], previousBlocks: Record<string, string[]>,
                         previousDetails: Record<string, ResourceDetails>, rows: TdData[]): void {
        const current: Record<string, boolean> = this.toLookup(this.fixedKeys);
        const before: Record<string, boolean> = this.toLookup(previous);
        const unfixed: string[] = previousRoots.filter((key: string) => !current[`${key}`]);
        const fixed: string[] = this.rootKeys.filter((key: string) => !before[`${key}`]);
        if (unfixed.length === 0 && fixed.length === 0) {
            return;
        }
        const order: string[] = rows.map((row: TdData) => this.getKey(row));
        let working: string[] = previous.slice();
        const toDetails: (keys: string[]) => ResourceDetails[] = (keys: string[]) =>
            keys.map((key: string) => this.details[`${key}`] || previousDetails[`${key}`]);
        const queue: (type: string, block: string[], index: number, earlier: string[]) => void =
            (type: string, block: string[], index: number, earlier: string[]) => {
                this.pending.push({
                    args: {
                        requestType: type, cancel: false, isUserInitiated: false, cause: 'dataRefresh',
                        fixedResources: toDetails(block), fixedIndex: index,
                        previousFixedResources: toDetails(earlier), currentFixedResources: toDetails(working)
                    }
                });
            };
        for (const key of unfixed) {
            const earlier: string[] = working.slice();
            const block: string[] = previousBlocks[`${key}`];
            const index: number = working.indexOf(key);
            working = working.filter((item: string) => block.indexOf(item) < 0);
            queue('resourceUnfixed', block, index, earlier);
        }
        for (const key of fixed) {
            const earlier: string[] = working.slice();
            const block: string[] = this.blocks[`${key}`];
            working = working.concat(block).sort((a: string, b: string) => order.indexOf(a) - order.indexOf(b));
            queue('resourceFixed', block, working.indexOf(key), earlier);
        }
    }

    private onContentReady(): void {
        if (!this.parent || this.parent.isDestroyed) {
            return;
        }
        this.updateAria();
        this.restoreFocus();
        this.triggerPending();
    }

    private triggerPending(): void {
        if (this.pending.length === 0) {
            return;
        }
        const queue: PendingChange[] = this.pending;
        this.pending = [];
        for (const change of queue) {
            this.parent.trigger(events.actionComplete, change.args);
        }
    }

    /**
     * Gives the rows their logical position, the fixed rows first, and the fixed region its group role.
     *
     * @returns {void}
     */
    private updateAria(): void {
        const element: HTMLElement = this.parent.element;
        const fixedTable: HTMLElement = element.querySelector('.' + cls.FIXED_CONTENT_TABLE_CLASS) as HTMLElement;
        if (!fixedTable || this.parent.virtualScrollModule) {
            return;
        }
        const rows: (selector: string) => HTMLElement[] = (selector: string) => [].slice.call(element.querySelectorAll(selector));
        const visible: (selector: string) => HTMLElement[] = (selector: string) =>
            rows(selector).filter((row: HTMLElement) => !row.classList.contains(cls.HIDDEN_CLASS));
        const fixedCount: number = visible('.' + cls.FIXED_CONTENT_TABLE_CLASS + ' tbody tr').length;
        const scrolling: HTMLElement[] = visible('.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.CONTENT_TABLE_CLASS + ' tbody tr');
        const strip: HTMLElement = element.querySelector('.' + cls.FIXED_STRIP_CLASS) as HTMLElement;
        const stripCount: number = strip ? 1 : 0;
        const total: string = (fixedCount + stripCount + scrolling.length).toString();
        if (strip) {
            strip.setAttribute('aria-rowindex', (fixedCount + 1).toString());
        }
        const numberRows: (list: HTMLElement[], offset: number) => void = (list: HTMLElement[], offset: number) => {
            list.forEach((row: HTMLElement, index: number) => row.setAttribute('aria-rowindex', (offset + index + 1).toString()));
        };
        numberRows(visible('.' + cls.FIXED_RESOURCE_WRAP_CLASS + ' tbody tr'), 0);
        numberRows(visible('.' + cls.FIXED_CONTENT_TABLE_CLASS + ' tbody tr'), 0);
        numberRows(visible('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' tbody tr'), fixedCount + stripCount);
        numberRows(scrolling, fixedCount + stripCount);
        fixedTable.setAttribute('aria-rowcount', total);
        const scrollingTable: Element = element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.CONTENT_TABLE_CLASS);
        if (scrollingTable) {
            scrollingTable.setAttribute('aria-rowcount', total);
        }
    }

    private restoreFocus(): void {
        if (this.focusGroupIndex === null) {
            return;
        }
        const header: HTMLElement = this.parent.element.querySelector(
            '.' + cls.RESOURCE_CELLS_CLASS + '[data-group-index="' + this.focusGroupIndex + '"]') as HTMLElement;
        this.focusGroupIndex = null;
        if (header) {
            header.focus();
        }
    }

    /**
     * Returns the rows of the fixed region that are not hidden, in order.
     *
     * @returns {HTMLElement[]} Returns the work cell rows of the fixed region.
     * @private
     */
    public getTableRows(): HTMLElement[] {
        return this.parent.element ? [].slice.call(this.parent.element.querySelectorAll(
            '.' + cls.FIXED_CONTENT_TABLE_CLASS + ' tbody tr:not(.' + cls.HIDDEN_CLASS + ')')) : [];
    }

    /**
     * Moves the selection to the first fixed row, or to the last row of the scrolling region, in the column of the
     * given cell.
     *
     * @param {boolean} isEnd Accepts true for the last scrolling row and false for the first fixed row.
     * @param {HTMLElement} from Accepts the cell the key was pressed on.
     * @returns {boolean} Returns true when the key was handled.
     * @private
     */
    public focusEdge(isEnd: boolean, from: HTMLElement): boolean {
        const fixedRows: HTMLElement[] = this.getTableRows();
        if (fixedRows.length === 0) {
            return false;
        }
        const scrollingRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(
            '.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.CONTENT_TABLE_CLASS + ' tbody tr:not(.' + cls.HIDDEN_CLASS + ')'));
        const row: HTMLElement = isEnd ? scrollingRows[scrollingRows.length - 1] : fixedRows[0];
        const column: number = from && from.classList.contains(cls.WORK_CELLS_CLASS) ? (from as HTMLTableCellElement).cellIndex : 0;
        const cell: HTMLTableCellElement = row ? (row as HTMLTableRowElement).cells[parseInt(column.toString(), 10)] : null;
        if (cell) {
            this.parent.selectCell(cell);
        }
        return !!cell;
    }

    /**
     * Chooses the region a drag or resize scrolls vertically. Over the fixed region the scrolling region never
     * scrolls; the fixed region scrolls by its own edges, and only when it overflows. Horizontal scrolling always
     * moves both regions through the scrolling region.
     *
     * @param {number} pageY Accepts the vertical pointer position.
     * @param {number} pageX Accepts the horizontal pointer position.
     * @param {ResizeEdges} edges Accepts the edges found for the scrolling region, which are corrected here.
     * @returns {HTMLElement} Returns the fixed region element when the pointer is over it, otherwise null.
     * @private
     */
    public adjustScrollEdges(pageY: number, pageX: number, edges: ResizeEdges): HTMLElement {
        const fixedWrap: HTMLElement = this.getRegionElement(cls.FIXED_CONTENT_WRAP_CLASS);
        if (!fixedWrap) {
            return null;
        }
        const rect: ClientRect = fixedWrap.getBoundingClientRect();
        const left: number = rect.left + window.pageXOffset;
        const top: number = rect.top + window.pageYOffset;
        const bottom: number = rect.bottom + window.pageYOffset;
        if (pageY < top || pageY > bottom || pageX < left || pageX > rect.right + window.pageXOffset) {
            return null;
        }
        const distance: number = 30;
        const overflows: boolean = fixedWrap.scrollHeight > fixedWrap.clientHeight;
        edges.top = overflows && pageY < top + distance;
        edges.bottom = overflows && pageY > bottom - distance;
        return fixedWrap;
    }

    /**
     * Checks whether the resource row is fixed.
     *
     * @param {TdData} row Accepts the resource row data.
     * @returns {boolean} Returns true when the row is fixed.
     * @private
     */
    public isFixed(row: TdData): boolean {
        return this.fixedKeys.indexOf(this.getKey(row)) > -1;
    }

    /**
     * Checks whether the fixed region has layout effect in the active view.
     * The region is laid out in the Timeline Day, Week, Work Week and Month views, and in the vertical orientation of
     * the Timeline Year view (resources are rows there), with any number of resource levels.
     *
     * @returns {boolean} Returns true when the active view lays out the fixed region.
     * @private
     */
    public isActive(): boolean {
        if (isNullOrUndefined(this.parent.activeView)) {
            return false;
        }
        const options: Schedule['activeViewOptions'] = this.parent.activeViewOptions;
        const settings: FixedRowsSettingsModel = options.group.fixedRows;
        const isRowLayout: boolean = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'].indexOf(options.option) > -1 ||
            (options.option === 'TimelineYear' && options.orientation === 'Vertical');
        return isRowLayout && options.group.resources.length > 0 && !isNullOrUndefined(settings) && settings.enable === true &&
            !this.parent.uiStateValues.isGroupAdaptive;
    }

    /**
     * Returns the rows that are placed in the fixed region, in resource order. At least one row always stays in the
     * scrolling region.
     *
     * @param {TdData[]} rows Accepts all the resource rows in resource order.
     * @returns {TdData[]} Returns the fixed rows.
     * @private
     */
    public getFixedRows(rows: TdData[]): TdData[] {
        if (!this.isSeeded || !this.isActive()) {
            return [];
        }
        return rows.filter((row: TdData) => this.isFixed(row));
    }

    /**
     * Renders the fixed region and the separator before the given content row of the outer table.
     *
     * @param {Element} contentRow Accepts the row of the outer table that holds the scrolling region.
     * @returns {void}
     * @private
     */
    public renderRegion(contentRow: Element): void {
        const resourceBase: Schedule['resourceBase'] = this.parent.resourceBase;
        const fixedRows: TdData[] = resourceBase.fixedResourceLevel;
        if (fixedRows.length === 0 || !this.isActive()) {
            return;
        }
        const view: ViewBase = this.parent.activeView as unknown as ViewBase;
        const scrollingRows: TdData[] = resourceBase.renderedResources;
        resourceBase.renderedResources = fixedRows;
        const fixedRow: Element = createElement('tr', { className: cls.FIXED_WRAP_CLASS });
        try {
            const resourceTd: Element = createElement('td');
            const resourceWrap: HTMLElement = createElement('div', { className: cls.FIXED_RESOURCE_WRAP_CLASS });
            const resourceTable: Element = view.createTableLayout();
            append(resourceBase.getContentRows(fixedRows), resourceTable.querySelector('tbody'));
            [].slice.call(resourceTable.querySelectorAll('.' + cls.RESOURCE_CELLS_CLASS)).forEach((cell: HTMLElement) => {
                cell.setAttribute('tabindex', '-1');
            });
            resourceWrap.appendChild(resourceTable);
            resourceTd.appendChild(resourceWrap);
            fixedRow.appendChild(resourceTd);
            const contentTd: Element = createElement('td');
            const contentWrap: HTMLElement = createElement('div', { className: cls.FIXED_CONTENT_WRAP_CLASS });
            const contentTable: Element = view.createTableLayout(cls.FIXED_CONTENT_TABLE_CLASS);
            view.createColGroup(contentTable, view.colLevels && view.colLevels[view.colLevels.length - 1]);
            append(view.getContentRows(), contentTable.querySelector('tbody'));
            this.wireCellEvents(contentTable.querySelector('tbody'));
            contentWrap.appendChild(contentTable);
            const eventTable: HTMLElement = view.createEventTable(fixedRows.length) as HTMLElement;
            eventTable.classList.remove(cls.EVENT_TABLE_CLASS);
            eventTable.classList.add(cls.FIXED_EVENT_TABLE_CLASS);
            contentWrap.appendChild(eventTable);
            EventHandler.add(contentWrap, 'scroll', this.onFixedScroll, this);
            EventHandler.add(contentWrap, 'wheel', this.onFixedWheel, this);
            contentTd.appendChild(contentWrap);
            fixedRow.appendChild(contentTd);
            const groupLabel: string = this.parent.localeObj.getConstant('pinnedResources');
            [resourceTable, contentTable].forEach((table: Element) => {
                table.querySelector('tbody').setAttribute('role', 'rowgroup');
                table.querySelector('tbody').setAttribute('aria-label', groupLabel);
            });
            resourceBase.hideResourceRows(resourceTable.querySelector('tbody'), fixedRows);
            resourceBase.hideResourceRows(contentTable.querySelector('tbody'), fixedRows);
            resourceBase.hideResourceRows(eventTable, fixedRows);
        } finally {
            resourceBase.renderedResources = scrollingRows;
        }
        const tbody: Element = contentRow.parentElement;
        tbody.insertBefore(fixedRow, contentRow);
        const settings: FixedRowsSettingsModel = this.parent.activeViewOptions.group.fixedRows;
        if (isNullOrUndefined(settings) || settings.showSeparator !== false) {
            tbody.insertBefore(this.createSeparator(settings, fixedRows), contentRow);
        }
    }

    /**
     * Builds the separator between the regions: the plain separator, or the strip when a template is set.
     *
     * @param {FixedRowsSettingsModel} settings Accepts the fixed rows settings of the active view.
     * @param {TdData[]} fixedRows Accepts the rows of the fixed region.
     * @returns {Element} Returns the separator row.
     */
    private createSeparator(settings: FixedRowsSettingsModel, fixedRows: TdData[]): Element {
        const separatorRow: Element = createElement('tr', { className: cls.FIXED_SEPARATOR_CLASS });
        const context: Record<string, unknown> = { fixedResources: this.getFixedResources(), count: fixedRows.length };
        const single: string | Function = settings ? settings.separatorTemplate : null;
        const panel: string | Function = settings ? settings.separatorPanelTemplate : null;
        const time: string | Function = settings ? settings.separatorTimeTemplate : null;
        if (single) {
            separatorRow.classList.add(cls.FIXED_STRIP_CLASS);
            const cell: HTMLElement = createElement('td', { attrs: { colspan: '2', 'role': 'gridcell' } });
            this.renderStripPart(cell, single, 'separatorTemplate', context);
            separatorRow.appendChild(cell);
        } else if (panel || time) {
            separatorRow.classList.add(cls.FIXED_STRIP_CLASS);
            const panelCell: HTMLElement = createElement('td', { attrs: { 'role': 'rowheader' } });
            const timeCell: HTMLElement = createElement('td', { attrs: { 'role': 'gridcell' } });
            const timeWrap: HTMLElement = createElement('div', { className: cls.FIXED_STRIP_TIME_WRAP_CLASS });
            this.renderStripPart(panelCell, panel, 'separatorPanelTemplate', context);
            this.renderStripPart(timeWrap, time, 'separatorTimeTemplate', context);
            timeCell.appendChild(timeWrap);
            separatorRow.appendChild(panelCell);
            separatorRow.appendChild(timeCell);
        } else {
            const cell: HTMLElement = createElement('td', { attrs: { colspan: '2' } });
            separatorRow.setAttribute('aria-hidden', 'true');
            separatorRow.appendChild(cell);
        }
        if (separatorRow.classList.contains(cls.FIXED_STRIP_CLASS)) {
            separatorRow.setAttribute('role', 'row');
            separatorRow.setAttribute('aria-label', this.parent.localeObj.getConstant('pinnedSummary'));
            if (this.parent.isPrinting) {
                separatorRow.setAttribute('inert', '');
            }
        }
        return separatorRow;
    }

    /**
     * Renders one template into a strip cell.
     *
     * @param {HTMLElement} element Accepts the cell that receives the template output.
     * @param {string | Function} template Accepts the template.
     * @param {string} name Accepts the template name.
     * @param {Record<string, unknown>} context Accepts the template context.
     * @returns {void}
     */
    private renderStripPart(element: HTMLElement, template: string | Function, name: string, context: Record<string, unknown>): void {
        if (!template) {
            return;
        }
        const nodes: HTMLElement[] = [].slice.call(this.parent.templateParser(template)(
            context, this.parent, name, this.parent.element.id + '_' + name, false, undefined, undefined, this.parent.root));
        append(nodes, element);
    }

    /**
     * Wires the work cell events of the fixed region. The Timeline Year view wires every cell while it builds the rows.
     * The other timeline views, Timeline Month included, wire the body of the scrolling table once, which the fixed
     * table does not share.
     *
     * @param {Element} tBody Accepts the body of the fixed content table.
     * @returns {void}
     */
    private wireCellEvents(tBody: Element): void {
        if (this.parent.activeViewOptions.option === 'TimelineYear') {
            return;
        }
        const action: Schedule['workCellAction'] = this.parent.workCellAction;
        EventHandler.add(tBody, 'mousedown', action.cellMouseDown, action);
        EventHandler.add(tBody, 'click', action.cellClick, action);
        if (!this.parent.isAdaptive) {
            EventHandler.add(tBody, 'dblclick', action.cellDblClick, action);
        }
    }

    private getRegionElement(className: string): HTMLElement {
        return this.parent && this.parent.element ? this.parent.element.querySelector('.' + className) as HTMLElement : null;
    }

    private onFixedScroll(e: Event): void {
        const resourceWrap: HTMLElement = this.getRegionElement(cls.FIXED_RESOURCE_WRAP_CLASS);
        if (resourceWrap) {
            resourceWrap.scrollTop = (e.target as HTMLElement).scrollTop;
        }
    }

    private onFixedWheel(e: WheelEvent): void {
        const contentWrap: HTMLElement = this.getRegionElement(cls.CONTENT_WRAP_CLASS);
        if (contentWrap && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            contentWrap.scrollLeft += e.deltaX;
            e.preventDefault();
        }
    }

    /**
     * Moves the fixed region to the horizontal scroll position of the scrolling region.
     *
     * @param {HTMLElement} target Accepts the scrolling region element.
     * @returns {void}
     * @private
     */
    public syncScroll(target: HTMLElement): void {
        const fixedContent: HTMLElement = this.getRegionElement(cls.FIXED_CONTENT_WRAP_CLASS);
        if (fixedContent) {
            fixedContent.scrollLeft = target.scrollLeft;
        }
        const stripTime: HTMLElement = this.getRegionElement(cls.FIXED_STRIP_TIME_WRAP_CLASS);
        if (stripTime) {
            stripTime.scrollLeft = target.scrollLeft;
        }
    }

    /**
     * Sizes the fixed region and returns the height that is left for the scrolling region. The fixed region is as high
     * as its rows, up to half of the area below the headers, and always leaves one row for the scrolling region.
     *
     * @param {number} height Accepts the height of the area below the headers.
     * @returns {number} Returns the height available for the scrolling region.
     * @private
     */
    public adjustHeight(height: number): number {
        const resourceWrap: HTMLElement = this.getRegionElement(cls.FIXED_RESOURCE_WRAP_CLASS);
        const contentWrap: HTMLElement = this.getRegionElement(cls.FIXED_CONTENT_WRAP_CLASS);
        if (!resourceWrap || !contentWrap) {
            return height;
        }
        const separator: HTMLElement = this.getRegionElement(cls.FIXED_SEPARATOR_CLASS);
        const separatorHeight: number = separator ? separator.offsetHeight : 0;
        const rowHeight: number = (contentWrap.querySelector('td') as HTMLElement).offsetHeight;
        const natural: number = (contentWrap.firstElementChild as HTMLElement).offsetHeight;
        const limit: number = Math.min(Math.floor(height / 2) - separatorHeight, height - separatorHeight - rowHeight);
        const fixedHeight: number = Math.max(Math.min(natural, limit), 0);
        setStyleAttribute(resourceWrap, { 'height': fixedHeight + 'px' });
        setStyleAttribute(contentWrap, { 'height': fixedHeight + 'px' });
        return height - fixedHeight - separatorHeight;
    }

    /**
     * Returns the event containers of both regions, indexed by the group index of their resource row, so that the
     * event renderer finds the container of a row independent of the region it is in.
     *
     * @param {Element} element Accepts the view element.
     * @param {string} containerClass Accepts the class name of the event containers.
     * @returns {HTMLElement[]} Returns the containers, indexed by group index.
     * @private
     */
    public getEventContainers(element: Element, containerClass: string): HTMLElement[] {
        const containers: HTMLElement[] = [].slice.call(element.querySelectorAll('.' + containerClass));
        if (!element.querySelector('.' + cls.FIXED_WRAP_CLASS)) {
            return containers;
        }
        const indexed: HTMLElement[] = [];
        for (const container of containers) {
            indexed[parseInt(container.getAttribute('data-group-index'), 10)] = container;
        }
        return indexed;
    }

    /**
     * Draws the current time indicator line in the fixed region, so that it is continuous with the line of the
     * scrolling region.
     *
     * @param {HTMLElement} line Accepts the line element that was drawn in the scrolling region.
     * @param {boolean} onTop Accepts whether the line is drawn on top of the events.
     * @returns {void}
     * @private
     */
    public addTimeIndicator(line: HTMLElement, onTop: boolean): void {
        const contentWrap: HTMLElement = this.getRegionElement(cls.FIXED_CONTENT_WRAP_CLASS);
        if (!contentWrap) {
            return;
        }
        const fixedLine: HTMLElement = line.cloneNode(true) as HTMLElement;
        fixedLine.style.height = (contentWrap.firstElementChild as HTMLElement).offsetHeight + 'px';
        const eventWrap: Element = contentWrap.querySelector('.' + cls.FIXED_EVENT_TABLE_CLASS);
        if (!onTop && eventWrap) {
            contentWrap.insertBefore(fixedLine, eventWrap);
        } else {
            contentWrap.appendChild(fixedLine);
        }
    }

    /**
     * Sets the column widths of the fixed content table from the scrolling content table, so that both regions
     * share one time axis.
     *
     * @returns {void}
     * @private
     */
    public syncColumns(): void {
        const fixedTable: HTMLElement = this.parent.element.querySelector('.' + cls.FIXED_CONTENT_TABLE_CLASS) as HTMLElement;
        const scrollTable: HTMLElement =
            this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        if (!fixedTable || !scrollTable) {
            return;
        }
        const cells: HTMLElement[] = [].slice.call(scrollTable.querySelector('tbody tr').children);
        const cols: HTMLElement[] = [].slice.call(fixedTable.querySelectorAll('col'));
        cols.forEach((col: HTMLElement, index: number) => {
            if (cells[parseInt(index.toString(), 10)]) {
                col.style.width = cells[parseInt(index.toString(), 10)].getBoundingClientRect().width + 'px';
            }
        });
        fixedTable.style.width = scrollTable.getBoundingClientRect().width + 'px';
    }

    /**
     * Returns the fixed resources in the region order.
     *
     * @returns {ResourceDetails[]} Returns the fixed resources.
     * @private
     */
    public getFixedResources(): ResourceDetails[] {
        return this.getFixedRows(this.parent.resourceBase.lastResourceLevel)
            .map((row: TdData, index: number) => ({
                resource: row.resource, resourceData: row.resourceData, isFixed: true, fixedIndex: index
            } as ResourceDetails));
    }

    /**
     * Destroys the fixed rows module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.parent && !this.parent.isDestroyed) {
            this.parent.resetTemplates(['separatorTemplate', 'separatorPanelTemplate', 'separatorTimeTemplate']);
        }
        const contentWrap: HTMLElement = this.parent && this.parent.element ? this.getRegionElement(cls.FIXED_CONTENT_WRAP_CLASS) : null;
        if (contentWrap) {
            EventHandler.remove(contentWrap, 'scroll', this.onFixedScroll);
            EventHandler.remove(contentWrap, 'wheel', this.onFixedWheel);
        }
        const tBody: Element = this.parent && this.parent.element ?
            this.parent.element.querySelector('.' + cls.FIXED_CONTENT_TABLE_CLASS + ' tbody') : null;
        if (tBody) {
            EventHandler.remove(tBody, 'mousedown', this.parent.workCellAction.cellMouseDown);
            EventHandler.remove(tBody, 'click', this.parent.workCellAction.cellClick);
            EventHandler.remove(tBody, 'dblclick', this.parent.workCellAction.cellDblClick);
        }
        if (this.parent && !this.parent.isDestroyed) {
            this.parent.off(events.contentReady, this.onContentReady);
            this.parent.off(events.interactionEnd, this.releaseHeld);
        }
        this.held = {};
        this.fixedKeys = [];
        this.rootKeys = [];
        this.blocks = {};
        this.depths = {};
        this.pathIndex = {};
        this.pathSource = null;
        this.details = {};
        this.overrides = {};
        this.pending = [];
        this.parent = null;
    }
}
