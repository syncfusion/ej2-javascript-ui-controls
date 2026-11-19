import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs, FindMatch, FindChangeEventArgs, FindNavigateEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { Column } from '../models/column';
import { getObject, valueAccessor } from '../base/util';
import { ValueFormatter } from '../services/value-formatter';

/** @hidden */
interface FindOccurrence extends FindMatch {
    rowUid: string;
    page: number;
    data?: Object;
    dataHash?: string;
}

interface FindQuery {
    text: string;
    needle: string;
    caseSensitive: boolean;
}

interface HighlightPart {
    text: string;
    isMatch: boolean;
    isActive: boolean;
}

const MATCH_CLASS: string = 'e-find-match';
const ACTIVE_MATCH_CLASS: string = 'e-find-active-match';
const SKIPPED_CELL_CONTENT: string = '.e-templatecell, .e-checkbox-wrapper, input';

/**
 * Finds and highlights text occurrences in Grid cells without filtering records.
 */
export class Find implements IAction {

    private parent: IGrid;
    private matches: FindOccurrence[] = [];
    private activeIndex: number = -1;
    private lastPublishedState: string = '';
    private changeReason: FindChangeEventArgs['reason'] = 'search';
    private pendingNavigation: FindNavigateEventArgs['action'] = null;
    private rowsRefreshedHandler: (e: NotifyArgs) => void;
    private actionBeginHandler: (e: NotifyArgs) => void;
    private dataBoundHandler: () => void;
    private filteringInProgress: boolean = false;
    private activateFirstMatchOnLoad: boolean = true;
    private pendingPageReveal: boolean = false;
    private cacheValidForQuery: string = '';
    private allDataMatches: FindOccurrence[] = [];
    private allDataCacheDirty: boolean = true;
    private cachedQuery: FindQuery;

    /**
     * Constructor for Find module.
     *
     * @param {IGrid} parent - Grid instance
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * Sets the query and highlights its matches without filtering records.
     *
     * @param {string} searchString - Text to search for
     * @returns {void}
     */
    public find(searchString: string): void {
        const key: string = isNullOrUndefined(searchString) ? '' : String(searchString);
        const isNewKey: boolean = !this.parent.findSettings || this.parent.findSettings.key !== key;
        if (isNewKey && this.parent.findSettings) {
            this.parent.setProperties({ findSettings: { key: key } }, true);
        }
        if (isNewKey) {
            this.activateFirstMatchOnLoad = false;
        }
        this.pendingPageReveal = false;
        this.changeReason = key === '' ? 'clear' : 'search';
        this.pendingNavigation = null;
        this.recomputeMatches();
    }

    /**
     * Moves to the next match, wrapping from the last match to the first.
     *
     * @returns {void}
     */
    public findNext(): void {
        this.navigate(1, 'next');
    }

    /**
     * Moves to the previous match, wrapping from the first match to the last.
     *
     * @returns {void}
     */
    public findPrevious(): void {
        this.navigate(-1, 'previous');
    }

    /**
     * Activates the 1-based match. Invalid values leave the active result unchanged.
     *
     * @param {number} matchNumber - 1-based match number.
     * @returns {void}
     */
    public goToMatch(matchNumber: number): void {
        const isValid: boolean = isFinite(matchNumber) && Math.floor(matchNumber) === matchNumber &&
            matchNumber >= 1 && matchNumber <= this.matches.length;
        if (isValid && this.activeIndex !== matchNumber - 1) {
            this.activateMatch(matchNumber - 1, 'goTo');
        }
    }

    /**
     * Clears only the active marker. Other matches stay highlighted and the query is unchanged.
     *
     * @returns {void}
     */
    public clearActiveMatch(): void {
        if (this.activeIndex === -1) {
            return;
        }
        this.activeIndex = -1;
        this.changeReason = 'navigation';
        this.pendingNavigation = null;
        this.renderHighlights();
        this.publishState();
    }

    /**
     * Clears the query, highlights, count, and active match. Does not change Search, filter, sort, or selection.
     *
     * @returns {void}
     */
    public clearFind(): void {
        this.find('');
    }

    /**
     * Returns the number of occurrences in the supported client-enumerable result set.
     *
     * @returns {number} occurrence count
     */
    public getTotalMatches(): number {
        return this.matches.length;
    }

    /**
     * Returns the active match, or null when none is active.
     *
     * @returns {FindMatch} active match
     */
    public getActiveMatch(): FindMatch {
        return this.activeIndex < 0 ? null : this.toPublicMatch(this.matches[this.activeIndex]);
    }

    /**
     * Converts view row index to absolute row index.
     *
     * @param {number} viewRowIndex - View row index
     * @returns {number} Absolute row index
     * @hidden
     */
    public getAbsoluteRowIndex(viewRowIndex: number): number {
        return viewRowIndex + this.getPageOffset();
    }

    /**
     * Splits cell text into plain and matched fragments so renderers can draw highlights without parsing HTML.
     *
     * @param {string} text - plain text the renderer displays
     * @param {string} field - column field
     * @param {number} occurrenceOffset - number of occurrences in this cell before the returned text
     * @param {number} rowIndex - absolute row index of the cell, when available
     * @returns {HighlightPart[]} text parts
     * @hidden
     */
    public getHighlightParts(text: string, field?: string, occurrenceOffset: number = 0, rowIndex?: number): HighlightPart[] {
        const query: FindQuery = this.getQuery();
        if (!text || !query.text) {
            return [{ text: text || '', isMatch: false, isActive: false }];
        }
        const source: string = query.caseSensitive ? text : text.toLocaleLowerCase();
        const active: FindOccurrence = this.activeIndex < 0 ? null : this.matches[this.activeIndex];
        const isActiveCell: boolean = !isNullOrUndefined(active) && active.field === field &&
            (isNullOrUndefined(rowIndex) || active.rowIndex === rowIndex);
        const parts: HighlightPart[] = [];
        let cursor: number = 0;
        let occurrence: number = 0;
        let at: number = source.indexOf(query.needle, cursor);
        while (at !== -1) {
            if (at > cursor) {
                parts.push({ text: text.substring(cursor, at), isMatch: false, isActive: false });
            }
            const isActive: boolean = isActiveCell && active.occurrenceIndex === occurrenceOffset + occurrence && active.start === at;
            parts.push({ text: text.substring(at, at + query.text.length), isMatch: true, isActive: isActive });
            occurrence++;
            cursor = at + query.text.length;
            at = source.indexOf(query.needle, cursor);
        }
        if (cursor < text.length) {
            parts.push({ text: text.substring(cursor), isMatch: false, isActive: false });
        }
        return parts;
    }

    /**
     * Repaints Find highlights and the toolbar state on the rendered cells.
     *
     * @returns {void}
     * @hidden
     */
    public refreshHighlights(): void {
        this.renderHighlights();
        this.updateToolbarState();
    }

    /**
     * Gets the current search query.
     *
     * @returns {FindQuery} Current query
     */
    private getQuery(): FindQuery {
        const settings: { key?: string, caseSensitive?: boolean } = this.parent.findSettings || {};
        const text: string = settings.key || '';
        const caseSensitive: boolean = !!settings.caseSensitive;
        if (!this.cachedQuery || this.cachedQuery.text !== text || this.cachedQuery.caseSensitive !== caseSensitive) {
            this.cachedQuery = {
                text: text, needle: caseSensitive ? text : text.toLocaleLowerCase(), caseSensitive: caseSensitive
            };
        }
        return this.cachedQuery;
    }

    /**
     * Determines if the grid uses pagination.
     *
     * @returns {boolean} Whether grid uses paging
     */
    private usesPages(): boolean {
        return !!this.parent.allowPaging;
    }

    /**
     * Determines if search is limited to current page only.
     *
     * @returns {boolean} Whether limited to current page
     */
    private isCurrentPageOnly(): boolean {
        return !!(this.parent.findSettings && this.parent.findSettings.currentPageOnly);
    }

    /**
     * Gets the current page offset.
     *
     * @returns {number} Page offset
     */
    private getPageOffset(): number {
        const pageSettings: { currentPage?: number, pageSize?: number } = this.parent.pageSettings || {};
        return this.usesPages() && !this.isCurrentPageOnly() && pageSettings.pageSize ?
            (pageSettings.currentPage - 1) * pageSettings.pageSize : 0;
    }

    /**
     * Converts absolute row index to view row index.
     *
     * @param {number} rowIndex - Absolute row index
     * @returns {number} View row index
     */
    private toViewRowIndex(rowIndex: number): number {
        const pageSize: number = this.parent.pageSettings ? this.parent.pageSettings.pageSize : 0;
        return this.usesPages() && pageSize ? rowIndex % pageSize : rowIndex;
    }

    /**
     * Navigates to next or previous match.
     *
     * @param {number} step - Navigation step (1 or -1)
     * @param {string} action - Navigation action
     * @returns {void}
     */
    private navigate(step: number, action: FindNavigateEventArgs['action']): void {
        const total: number = this.matches.length;
        if (!total) {
            return;
        }
        const next: number = this.activeIndex < 0 ? (step > 0 ? 0 : total - 1) : (this.activeIndex + step + total) % total;
        if (next !== this.activeIndex) {
            this.activateMatch(next, action);
        }
    }

    /**
     * Activates a match at the given index.
     *
     * @param {number} index - Match index
     * @param {string} action - Navigation action
     * @returns {void}
     */
    private activateMatch(index: number, action: FindNavigateEventArgs['action']): void {
        this.pendingNavigation = action;
        this.changeReason = 'navigation';
        this.activeIndex = index;
        const willRenderAsync: boolean = this.revealActiveMatch();
        if (!willRenderAsync) {
            this.renderHighlights();
        }
        this.publishState();
    }

    /**
     * Recomputes all matches for the current query.
     *
     * @param {boolean} clearActiveOnMissing - Whether to clear active match if not found
     * @returns {void}
     */
    private recomputeMatches(clearActiveOnMissing: boolean = false): void {
        const previous: FindOccurrence = this.activeIndex < 0 ? null : this.matches[this.activeIndex];
        const query: FindQuery = this.getQuery();
        this.matches = [];
        this.activeIndex = -1;
        if (query.text) {
            if (this.parent.enableVirtualization) {
                this.collectAllDataMatches(this.parent, query, previous, clearActiveOnMissing);
            } else {
                this.collectMatches(this.parent, query);
                this.finalizeMatches(previous, clearActiveOnMissing);
            }
        } else {
            this.clearMatchesAndState();
            this.finalizeMatches(previous, clearActiveOnMissing);
        }
    }

    /**
     * Clears matches and internal state.
     *
     * @returns {void}
     */
    private clearMatchesAndState(): void {
        this.matches = [];
        this.cacheValidForQuery = '';
        this.allDataMatches = [];
    }

    /**
     * Finalizes matches after collection.
     *
     * @param {FindOccurrence} previous - Previous active match
     * @param {boolean} clearActiveOnMissing - Whether to clear active match if not found
     * @returns {void}
     */
    private finalizeMatches(previous: FindOccurrence, clearActiveOnMissing: boolean = false): void {
        this.restoreActiveMatch(previous, clearActiveOnMissing);
        this.renderHighlights();
        this.publishState();
    }

    /**
     * Collects and caches matches across the full local dataset.
     *
     * @param {IGrid} grid - Grid instance
     * @param {FindQuery} query - Search query
     * @param {FindOccurrence} previous - Previous active match
     * @param {boolean} clearActiveOnMissing - Whether to clear active match if not found
     * @returns {void}
     */
    private collectAllDataMatches(grid: IGrid, query: FindQuery, previous: FindOccurrence, clearActiveOnMissing: boolean): void {
        const queryKey: string = query.text + '|' + (query.caseSensitive ? '1' : '0');
        if (!this.allDataCacheDirty && this.cacheValidForQuery === queryKey) {
            this.matches = [...this.allDataMatches];
            this.finalizeMatches(previous, clearActiveOnMissing);
            return;
        }
        const allData: Object[] = this.getAllGridData(grid);
        const columns: Column[] = this.getSearchableColumns(grid);
        const pageSize: number = (grid.pageSettings && grid.pageSettings.pageSize) || 10;
        const primaryKey: string = grid.getPrimaryKeyFieldNames()[0];
        for (let i: number = 0; i < allData.length; i++) {
            const record: Object = allData[i as number];
            if (!record || (record as { isDataRow?: boolean }).isDataRow === false) {
                continue;
            }
            const page: number = this.usesPages() ? Math.floor(i / pageSize) + 1 : 1;
            const rowUid: string = this.getRowKey(record, i, primaryKey);
            const hasPrimaryKey: boolean = !!primaryKey &&
                !isNullOrUndefined((record as { [key: string]: Object })[primaryKey as string]);
            let dataHash: string;
            for (let c: number = 0; c < columns.length; c++) {
                const text: string = this.getCellSearchText(grid, columns[c as number], record);
                dataHash = this.addCellMatches(text, query, {
                    rowIndex: i,
                    field: columns[c as number].field,
                    rowUid: rowUid,
                    page: page,
                    data: record,
                    dataHash: dataHash
                }, !hasPrimaryKey);
            }
        }
        this.allDataMatches = [...this.matches];
        this.cacheValidForQuery = queryKey;
        this.allDataCacheDirty = false;
        this.finalizeMatches(previous, clearActiveOnMissing);
    }

    /**
     * Returns local data for matching, including rows outside the rendered viewport.
     *
     * @param {IGrid} grid - Grid instance
     * @returns {Object[]} Array of data records
     */
    private getAllGridData(grid: IGrid): Object[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataModule: any = grid.getDataModule();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataManager: any = dataModule.dataManager;
        const source: { json?: Object[] } = dataManager.dataSource as { json?: Object[] };
        if (source && Array.isArray(source.json) && source.json.length) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const query: any = dataModule.generateQuery(true, true);
                return dataManager.executeLocal(query);
            } catch (error) {
                return source.json;
            }
        }
        return grid.getCurrentViewRecords();
    }

    /**
     * Collects matches from visible records.
     *
     * @param {IGrid} grid - Grid instance
     * @param {FindQuery} query - Search query
     * @returns {void}
     */
    private collectMatches(grid: IGrid, query: FindQuery): void {
        const columns: Column[] = this.getSearchableColumns(grid);
        const searchableRecords: { records: Object[], pageOffset: number } = this.getSearchableRecords(grid);
        const records: Object[] = searchableRecords.records;
        const pageOffset: number = searchableRecords.pageOffset;
        const pageSize: number = grid.pageSettings && grid.pageSettings.pageSize ? grid.pageSettings.pageSize : records.length;
        const splitsPages: boolean = this.usesPages() && !this.isCurrentPageOnly();
        const primaryKey: string = grid.getPrimaryKeyFieldNames()[0];
        for (let i: number = 0; i < records.length; i++) {
            const record: Object = records[i as number];
            if (!record || (record as { isDataRow?: boolean }).isDataRow === false) {
                continue;
            }
            const rowIndex: number = pageOffset + i;
            const page: number = splitsPages ? Math.floor(rowIndex / pageSize) + 1 : grid.pageSettings.currentPage;
            const rowUid: string = this.getRowKey(record, rowIndex, primaryKey);
            const hasPrimaryKey: boolean = !!primaryKey &&
                !isNullOrUndefined((record as { [key: string]: Object })[primaryKey as string]);
            let dataHash: string;
            for (let c: number = 0; c < columns.length; c++) {
                const text: string = this.getCellSearchText(grid, columns[c as number], record);
                dataHash = this.addCellMatches(text, query, {
                    rowIndex: rowIndex, field: columns[c as number].field, rowUid: rowUid,
                    page: page, data: record, dataHash: dataHash
                }, !hasPrimaryKey);
            }
        }
    }

    /**
     * Gets searchable columns.
     *
     * @param {IGrid} grid - Grid instance
     * @returns {Column[]} Array of searchable columns
     */
    private getSearchableColumns(grid: IGrid): Column[] {
        return grid.getColumns().filter((column: Column) => !isNullOrUndefined(column.field) && column.allowSearching !== false);
    }

    /**
     * Gets filtered and sorted records, falling back to the current view.
     *
     * @param {IGrid} grid - Grid instance
     * @returns {{ records: Object[], pageOffset: number }} Records and page offset
     */
    private getSearchableRecords(grid: IGrid): { records: Object[], pageOffset: number } {
        const view: Object[] = grid.getCurrentViewRecords();
        if (grid.parentDetails || this.isCurrentPageOnly()) {
            return { records: view, pageOffset: 0 };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataModule: any = grid.getDataModule();
        const source: { json?: Object[] } = dataModule.dataManager.dataSource as { json?: Object[] };
        const hasLocalData: boolean = !!(source && Array.isArray(source.json) && source.json.length);
        if (hasLocalData && !grid.groupSettings.enableLazyLoading) {
            return { records: dataModule.dataManager.executeLocal(dataModule.generateQuery(true, true)), pageOffset: 0 };
        }
        return { records: view, pageOffset: this.getPageOffset() };
    }

    /**
     * Gets searchable text from a cell.
     *
     * @param {IGrid} grid - Grid instance
     * @param {Column} column - Column definition
     * @param {Object} record - Row data record
     * @returns {string} Cell search text
     */
    private getCellSearchText(grid: IGrid, column: Column, record: Object): string {
        const value: Object = getObject(column.field, record);
        try {
            const formattedValue: string = this.formatCellValue(grid, column, value);
            return formattedValue || null;
        } catch (error) {
            grid.trigger(events.actionFailure, { error: error as Error, field: column.field, rowData: record });
            throw error;
        }
    }

    /**
     * Formats a cell value using grid formatters and accessors.
     *
     * @param {IGrid} grid - Grid instance
     * @param {Column} column - Column definition
     * @param {Object} value - Cell value
     * @returns {string} Formatted cell value
     */
    private formatCellValue(grid: IGrid, column: Column, value: Object): string {
        if (isNullOrUndefined(value)) {
            return '';
        }
        const accessor: Function | string = column.valueAccessor as Function | string;
        if (accessor && accessor !== valueAccessor) {
            const accessorFn: Object = typeof accessor === 'string' ? getObject(accessor, grid) : accessor;
            if (typeof accessorFn === 'function') {
                return String(accessorFn(column.field, { [column.field]: value }, column));
            }
        }
        const formatter: ValueFormatter = (grid as IGrid & { valueFormatterService?: ValueFormatter }).valueFormatterService;
        if (formatter && column.getFormatter) {
            try {
                const result: string | Object = formatter.toView(value as number | Date, column.getFormatter());
                if (!isNullOrUndefined(result)) {
                    return String(result);
                }
            } catch (e) {
                // Fallback if custom accessor throws an error
            }
        }
        return String(value);
    }

    /**
     * Adds cell matches to the matches array.
     *
     * @param {string} text - Cell text content
     * @param {FindQuery} query - Search query
     * @param {Partial<FindOccurrence>} seed - Match seed object
     * @param {boolean} includeDataHash - Whether to include data hash
     * @returns {string} Data hash
     */
    private addCellMatches(text: string, query: FindQuery, seed: Partial<FindOccurrence>, includeDataHash: boolean): string {
        if (!text) {
            return seed.dataHash;
        }
        const source: string = query.caseSensitive ? text : text.toLocaleLowerCase();
        let at: number = source.indexOf(query.needle);
        if (at === -1) {
            return seed.dataHash;
        }
        const dataHash: string = includeDataHash && isNullOrUndefined(seed.dataHash) ? this.hashRecord(seed.data) : seed.dataHash;
        let occurrence: number = 0;
        while (at !== -1) {
            this.matches.push({
                matchNumber: this.matches.length + 1, totalMatches: 0, rowIndex: seed.rowIndex, field: seed.field,
                occurrenceIndex: occurrence++, start: at, length: query.text.length,
                rowUid: seed.rowUid, page: seed.page,
                data: seed.data, dataHash: dataHash
            });
            at = source.indexOf(query.needle, at + query.text.length);
        }
        return dataHash;
    }

    /**
     * Restores the previous active match or activates the first available match.
     *
     * @param {FindOccurrence} previous - Previous active match
     * @param {boolean} clearActiveOnMissing - Whether to clear active match if not found
     * @returns {void}
     */
    private restoreActiveMatch(previous: FindOccurrence, clearActiveOnMissing: boolean): void {
        if (!this.matches.length) {
            this.activeIndex = -1;
        } else if (this.activateFirstMatchOnLoad) {
            this.activateFirstMatchOnLoad = false;
            this.activeIndex = 0;
            this.pendingNavigation = null;
            this.revealActiveMatch();
        } else if (this.changeReason === 'search' || !previous) {
            this.activeIndex = -1;
        } else {
            const sameOccurrence: (match: FindOccurrence) => boolean = (match: FindOccurrence): boolean =>
                match.field === previous.field && match.occurrenceIndex === previous.occurrenceIndex;
            let same: number = previous.data ?
                this.matches.findIndex((match: FindOccurrence) => match.data === previous.data && sameOccurrence(match)) : -1;
            if (same === -1 && previous.dataHash) {
                same = this.matches.findIndex((match: FindOccurrence) => match.dataHash === previous.dataHash &&
                    sameOccurrence(match));
            }
            if (same === -1 && !clearActiveOnMissing) {
                same = this.matches.findIndex((match: FindOccurrence) => match.rowUid === previous.rowUid &&
                    sameOccurrence(match));
            }
            if (same !== -1) {
                this.activeIndex = same;
            } else if (clearActiveOnMissing) {
                this.activeIndex = -1;
            } else {
                const following: number = this.matches.findIndex((match: FindOccurrence) =>
                    match.rowUid > previous.rowUid || (match.rowUid === previous.rowUid && match.field >= previous.field));
                this.activeIndex = following !== -1 ? following : this.matches.length - 1;
            }
        }
    }

    /**
     * Gets the unique key for a row.
     *
     * @param {Object} record - Row data record
     * @param {number} index - Row index
     * @param {string} primaryKey - Primary key field name
     * @returns {string} Row key
     */
    private getRowKey(record: Object, index: number, primaryKey: string): string {
        const keyValue: Object = primaryKey ? (record as { [key: string]: Object })[primaryKey as string] : null;
        return isNullOrUndefined(keyValue) ? 'r' + index : String(keyValue);
    }

    /**
     * Creates a hash of a record for identification.
     *
     * @param {Object} record - Row data record
     * @returns {string} Record hash
     */
    private hashRecord(record: Object): string {
        if (!record) {
            return '';
        }
        const keys: string[] = Object.keys(record).sort();
        const hashParts: string[] = [];
        for (const key of keys) {
            // eslint-disable-next-line security/detect-object-injection
            const value: Object = (record as { [key: string]: Object })[key];
            hashParts.push(key + ':' + (isNullOrUndefined(value) ? 'null' : String(value)));
        }
        return hashParts.join('|');
    }

    /**
     * Reveals the active match and indicates whether rendering is asynchronous.
     *
     * @returns {boolean} Whether rendering is asynchronous
     */
    private revealActiveMatch(): boolean {
        const match: FindOccurrence = this.matches[this.activeIndex];
        const needsPageChange: boolean = !!match && this.usesPages() && !!this.parent.pagerModule && !this.isCurrentPageOnly() &&
            !!match.page && this.parent.pageSettings.currentPage !== match.page;
        if (needsPageChange) {
            this.pendingPageReveal = true;
            this.parent.goToPage(match.page);
            return true;
        } else {
            return this.scrollActiveIntoView();
        }
    }

    /**
     * Gets the rendered cell element for a match.
     *
     * @param {FindOccurrence} match - Match to find cell for
     * @returns {Element} Cell element or null
     */
    private getRenderedMatchCell(match: FindOccurrence): Element {
        const rows: Element[] = this.parent.getDataRows ? this.parent.getDataRows() : [];
        const viewRowIndex: number = match.rowIndex - this.getPageOffset();
        const columnIndex: number = this.parent.getColumnIndexByField(match.field);
        for (let i: number = 0; i < rows.length; i++) {
            const cell: Element = rows[i as number].querySelector('.e-rowcell[data-index]');
            if (cell && parseInt(cell.getAttribute('data-index'), 10) === viewRowIndex) {
                return this.parent.getCellFromIndex(i, columnIndex);
            }
        }
        return null;
    }

    /**
     * Scrolls to the active match; returns whether rendering is asynchronous.
     *
     * @returns {boolean} Whether rendering is asynchronous
     */
    private scrollActiveIntoView(): boolean {
        const match: FindOccurrence = this.activeIndex < 0 ? null : this.matches[this.activeIndex];
        if (!match) {
            return false;
        }
        const isVirtual: boolean = !!this.parent.enableVirtualization;
        const cell: Element = isVirtual ? this.getRenderedMatchCell(match) :
            this.parent.getCellFromIndex(this.toViewRowIndex(match.rowIndex), this.parent.getColumnIndexByField(match.field));
        if (!cell && isVirtual) {
            this.scrollToRevealMatch(match);
            return true;
        }
        this.scrollCellIntoView(cell);
        return false;
    }

    /**
     * Scrolls to a virtualized match outside the rendered rows.
     *
     * @param {FindOccurrence} match - Match to reveal
     * @returns {void}
     */
    private scrollToRevealMatch(match: FindOccurrence): void {
        const content: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        if (!content) {
            return;
        }
        if (this.parent.enableVirtualization) {
            this.scrollToRowIndexVirtual(this.toViewRowIndex(match.rowIndex), content);
        }
    }

    /**
     * Scrolls a virtualized row into view.
     *
     * @param {number} rowIndex - Row index to scroll to
     * @param {HTMLElement} content - Content element
     * @returns {void}
     */
    private scrollToRowIndexVirtual(rowIndex: number, content: HTMLElement): void {
        if (!this.parent.getRowHeight) {
            return;
        }
        const rowHeight: number = this.parent.getRowHeight();
        const viewportHeight: number = content.clientHeight;
        const targetScroll: number = Math.max(0, (rowIndex * rowHeight) - (viewportHeight * 0.3));
        const maxScroll: number = Math.max(0, content.scrollHeight - viewportHeight);
        const finalScroll: number = Math.min(targetScroll, maxScroll);
        content.scrollTop = finalScroll;
        const grid: IGrid & { refreshLayout?: () => void } = this.parent as IGrid & { refreshLayout?: () => void };
        if (typeof grid.refreshLayout === 'function') {
            grid.refreshLayout();
        }
    }

    /**
     * Scrolls a cell into view.
     *
     * @param {Element} cell - Cell element
     * @returns {void}
     */
    private scrollCellIntoView(cell: Element): void {
        if (cell && typeof (cell as HTMLElement).scrollIntoView === 'function') {
            (cell as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }

    /**
     * Clears all highlight markup from the grid.
     *
     * @returns {void}
     */
    private clearHighlights(): void {
        const marked: NodeListOf<Element> = this.parent.element.querySelectorAll('.' + MATCH_CLASS + ', .' + ACTIVE_MATCH_CLASS);
        for (let i: number = 0; i < marked.length; i++) {
            const node: Element = marked[i as number];
            const container: Node = node.parentNode;
            if (container) {
                container.replaceChild(document.createTextNode(node.textContent), node);
                container.normalize();
            }
        }
    }

    /**
     * Renders highlights for all matches in the grid.
     *
     * @returns {void}
     */
    private renderHighlights(): void {
        const root: HTMLElement = this.parent.element;
        if (!root || !this.getQuery().text || !this.matches.length) {
            this.clearHighlights();
            return;
        }
        this.clearHighlights();
        this.renderMainGridHighlights(root);
        this.updateToolbarState();
    }

    /**
     * Renders highlights for all cells in the main grid.
     *
     * @param {HTMLElement} root - Grid root element
     * @returns {void}
     */
    private renderMainGridHighlights(root: HTMLElement): void {
        const rowOffset: number = this.getPageOffset();
        const cells: NodeListOf<Element> = root.querySelectorAll('.e-rowcell');
        const cellCount: number = cells.length;
        for (let i: number = 0; i < cellCount; i++) {
            const cell: Element = cells[i as number];
            if (!cell.closest('.e-childgrid')) {
                this.renderCellHighlight(cell as HTMLElement, this.parent, rowOffset);
            }
        }
    }

    /**
     * Renders highlight markup for a cell.
     *
     * @param {HTMLElement} cell - Cell element
     * @param {IGrid} grid - Grid instance
     * @param {number} rowOffset - Row offset for pagination
     * @returns {void}
     */
    private renderCellHighlight(cell: HTMLElement, grid: IGrid, rowOffset: number): void {
        const column: Column = grid.getColumns()[parseInt(cell.getAttribute('aria-colindex'), 10) - 1];
        const viewRowIndex: number = parseInt(cell.getAttribute('data-index'), 10);
        const text: string = cell.textContent;
        if (!this.isCellHighlightable(column, text, viewRowIndex, cell)) {
            return;
        }
        const parts: HighlightPart[] = this.getHighlightParts(text, column.field, 0, viewRowIndex + rowOffset);
        if (parts.length < 2 && !parts[0].isMatch) {
            return;
        }
        this.replaceWithHighlights(cell, parts);
    }

    /**
     * Determines if a cell can be highlighted.
     *
     * @param {Column} column - Column definition
     * @param {string} text - Cell text
     * @param {number} viewRowIndex - View row index
     * @param {HTMLElement} cell - Cell element
     * @returns {boolean} Whether cell is highlightable
     */
    private isCellHighlightable(column: Column, text: string, viewRowIndex: number, cell: HTMLElement): boolean {
        return !(!column || !text || isNaN(viewRowIndex) || column.template || cell.querySelector(SKIPPED_CELL_CONTENT));
    }

    /**
     * Replaces cell content with highlighted parts.
     *
     * @param {HTMLElement} cell - Cell element
     * @param {HighlightPart[]} parts - Highlight parts
     * @returns {void}
     */
    private replaceWithHighlights(cell: HTMLElement, parts: HighlightPart[]): void {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
        parts.forEach((part: HighlightPart) => {
            if (!part.isMatch) {
                cell.appendChild(document.createTextNode(part.text));
            } else {
                const span: HTMLElement = document.createElement('span');
                span.className = part.isActive ? ACTIVE_MATCH_CLASS : MATCH_CLASS;
                span.appendChild(document.createTextNode(part.text));
                cell.appendChild(span);
            }
        });
    }

    /**
     * Publishes find state change events.
     *
     * @returns {void}
     */
    private publishState(): void {
        const total: number = this.matches.length;
        this.matches.forEach((match: FindOccurrence, index: number) => {
            match.matchNumber = index + 1;
            match.totalMatches = total;
        });
        const active: FindMatch = this.getActiveMatch();
        const searchText: string = this.getQuery().text;
        const state: string = searchText + '|' + total + '|' +
            (active ? active.matchNumber + ':' + active.field + ':' + active.rowIndex + ':' + active.occurrenceIndex : '-');
        this.updateToolbarState();
        if (state !== this.lastPublishedState) {
            this.lastPublishedState = state;
            this.parent.trigger(events.findChange, {
                searchText: searchText, totalMatches: total, activeMatch: active, reason: this.changeReason
            } as FindChangeEventArgs);
            if (this.pendingNavigation && active) {
                this.parent.trigger(events.findNavigate, {
                    action: this.pendingNavigation, matchNumber: active.matchNumber, totalMatches: total, activeMatch: active
                } as FindNavigateEventArgs);
            }
        }
        this.pendingNavigation = null;
    }

    /**
     * Converts internal FindOccurrence to public FindMatch object.
     *
     * @param {FindOccurrence} match - Internal match occurrence
     * @returns {FindMatch} Public match object
     */
    private toPublicMatch(match: FindOccurrence): FindMatch {
        return {
            matchNumber: match.matchNumber, totalMatches: this.matches.length, rowIndex: match.rowIndex, field: match.field,
            occurrenceIndex: match.occurrenceIndex, start: match.start, length: match.length
        };
    }

    /**
     * Updates the toolbar counter and button states.
     *
     * @returns {void}
     */
    private updateToolbarState(): void {
        const element: HTMLElement = this.parent.element;
        const counter: HTMLElement = element ? element.querySelector('.e-find-count') as HTMLElement : null;
        if (!counter) {
            return;
        }
        const total: number = this.matches.length;
        const hasQuery: boolean = !!this.getQuery().text;
        const navEnabled: boolean = hasQuery && total > 0;
        counter.textContent = (total && this.activeIndex >= 0 ? this.activeIndex + 1 : 0) + '/' + total;
        counter.style.cursor = 'default';
        this.updateControlState('.e-find-clear', hasQuery);
        this.updateControlState('.e-find-prev', navEnabled);
        this.updateControlState('.e-find-next', navEnabled);
    }

    /**
     * Updates the state of a control element.
     *
     * @param {string} selector - CSS selector for the control
     * @param {boolean} enabled - Whether the control should be enabled
     * @returns {void}
     */
    private updateControlState(selector: string, enabled: boolean): void {
        const element: HTMLElement = this.parent.element;
        const control: HTMLElement = element ? element.querySelector(selector) as HTMLElement : null;
        if (!control) {
            return;
        }
        if (enabled) {
            control.classList.remove('e-disabled');
        } else {
            control.classList.add('e-disabled');
        }
        control.setAttribute('aria-disabled', String(!enabled));
        control.style.cursor = enabled ? 'pointer' : 'default';
    }

    /**
     * Handles the data bound event.
     *
     * @returns {void}
     */
    private onDataBound(): void {
        if (this.filteringInProgress) {
            return;
        }
        if (!this.getQuery().text) {
            this.renderHighlights();
            return;
        }
        this.changeReason = 'data';
        this.recomputeMatches();
        if (this.pendingPageReveal) {
            this.pendingPageReveal = false;
            this.scrollActiveIntoView();
        }
    }

    /**
     * Handles the rows refreshed event.
     *
     * @param {NotifyArgs} e - Event arguments
     * @returns {void}
     */
    private onRowsRefreshed(e: NotifyArgs): void {
        const isFiltering: boolean = !!e && e.requestType === 'filtering';
        if (!this.shouldRecomputeOnRowsRefreshed(e)) {
            if (isFiltering) {
                this.filteringInProgress = false;
            }
            return;
        }
        this.allDataCacheDirty = true;
        this.changeReason = 'data';
        this.recomputeMatches(isFiltering);
        if (isFiltering) {
            this.filteringInProgress = false;
        }
    }

    /**
     * Handles filtering begin event.
     *
     * @param {NotifyArgs} e - Event arguments
     * @returns {void}
     */
    private handleFilteringBegin(e: NotifyArgs): void {
        if (e && e.requestType === 'filtering') {
            this.filteringInProgress = true;
        }
    }

    /**
     * Handles filtering cancel event.
     *
     * @param {NotifyArgs} e - Event arguments
     * @returns {void}
     */
    private handleFilteringCancel(e: NotifyArgs): void {
        if (e && e.requestType === 'filtering') {
            this.filteringInProgress = false;
        }
    }

    /**
     * Determines if matches should be recomputed on rows refreshed.
     *
     * @param {NotifyArgs} e - Event arguments
     * @returns {boolean} Whether to recompute matches
     */
    private shouldRecomputeOnRowsRefreshed(e: NotifyArgs): boolean {
        return !!e && (e.requestType === 'filtering' || e.requestType === 'refresh' || e.requestType === 'sorting' ||
            e.requestType === 'save' || e.requestType === 'delete' || e.requestType === 'add' || e.requestType === 'reorder') &&
            !!this.getQuery().text;
    }

    /**
     * Handles property changed event.
     *
     * @param {Object} e - Event arguments
     * @returns {void}
     */
    private onPropertyChanged(e: NotifyArgs & { module?: string, properties?: Object }): void {
        if (!e || e.module !== 'find') {
            return;
        }
        const key: string = e.properties ? (e.properties as { key?: string }).key : null;
        if (!isNullOrUndefined(key) && key !== this.parent.findSettings.key) {
            this.find(key);
        } else {
            this.changeReason = 'options';
            this.recomputeMatches();
        }
    }

    /**
     * Adds event listeners for grid events.
     *
     * @returns {void}
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.dataBoundHandler = this.onDataBound.bind(this);
        this.actionBeginHandler = this.handleFilteringBegin.bind(this);
        this.rowsRefreshedHandler = this.onRowsRefreshed.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginHandler);
        this.parent.addEventListener(events.dataBound, this.dataBoundHandler);
        this.parent.addEventListener(events.actionComplete, this.rowsRefreshedHandler);
        this.parent.on(events.cancelBegin, this.handleFilteringCancel, this);
        this.parent.on(events.contentReady, this.onContentReady.bind(this));
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
    }

    /**
     * Handles content ready event.
     *
     * @returns {void}
     */
    private onContentReady(): void {
        if (this.filteringInProgress) {
            return;
        }
        this.renderHighlights();
    }

    /**
     * Removes event listeners for grid events.
     *
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.removeEventListener(events.actionBegin, this.actionBeginHandler);
        this.parent.removeEventListener(events.dataBound, this.dataBoundHandler);
        this.parent.removeEventListener(events.actionComplete, this.rowsRefreshedHandler);
        this.parent.off(events.cancelBegin, this.handleFilteringCancel);
        this.parent.off(events.contentReady, this.onContentReady);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
    }

    /**
     * Gets the module name.
     *
     * @returns {string} Module name
     * @private
     */
    protected getModuleName(): string {
        return 'find';
    }

    /**
     * Destroys the Find module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.element) {
            this.clearHighlights();
        }
        this.matches = [];
        this.activeIndex = -1;
        this.removeEventListener();
    }
}
