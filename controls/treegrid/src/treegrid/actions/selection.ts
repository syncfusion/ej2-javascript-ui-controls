import { TreeGrid } from '../base/treegrid';
import { ColumnModel } from '../models/column';
import { isNullOrUndefined, removeClass } from '@syncfusion/ej2-base';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { QueryCellInfoEventArgs, parentsUntil, getObject } from '@syncfusion/ej2-grids';
import { CellSaveEventArgs } from '../base/interface';
import { ITreeData } from '../base/interface';
import * as events from '../base/constant';
import { getParentData, isRemoteData, isCheckboxcolumn } from '../utils';

/**
 * TreeGrid Selection module
 *
 * @hidden
 */
export class Selection {
    private parent: TreeGrid;
    private columnIndex: number;
    private selectedItems: ITreeData[]; // Stores ITreeData objects in order of selection
    // selectedIndexes is now only used internally, getCheckedRowIndexes will compute dynamically
    private selectedIndexes: number[]; // Not used for external return order directly but for internal consistency.
    private filteredList: Object[];
    private searchingRecords: Object[];
    private headerCheckboxFrameEl: HTMLElement = null;
    private checkboxColIndexCache: number = -2;
    private parentSelectionCounters: { [uid: string]: { total: number; checked: number; indeterminate: number; }; } = {};
    private selectedUidMap: Map<string, boolean> = new Map<string, boolean>(); // Quick lookup for whether an item is selected
    private totalSelectableCount: number = 0;
    private headerSelectionState: string = 'uncheck';
    private checkedItemCount: number = 0;

    /**
     * Creates an instance of Selection.
     *
     * @param {TreeGrid} parent - The TreeGrid instance this selection module is associated with.
     */
    constructor(parent: TreeGrid) {
        this.parent = parent;
        this.selectedItems = [];
        this.selectedIndexes = []; // Initialize here
        this.filteredList = [];
        this.searchingRecords = [];
        this.addEventListener();
    }

    /**
     * Gets the module name.
     *
     * @returns {string} The name of the module ('selection').
     */
    private getModuleName(): string { return 'selection'; }

    private visibleUidIndex: { [uid: string]: number } = {};

    /**
     * Builds a map from visible record uniqueID to its visible index.
     * This map is crucial for finding the *current visible index* of a record.
     *
     * @returns {void}
     */
    private buildVisibleUidMap(): void {
        this.visibleUidIndex = {};
        const view: ITreeData[] = this.parent.grid.currentViewData as ITreeData[];
        if (!view) { return; }
        for (let i: number = 0, len: number = view.length; i < len; i++) {
            const rec: ITreeData = view[parseInt(i.toString(), 10)];
            if (rec && rec.uniqueID) {
                this.visibleUidIndex[rec.uniqueID] = i; // Map uid -> visible row index
            }
        }
    }

    /**
     * Adds required event listeners for selection handling.
     *
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on('dataBoundArg', this.headerCheckbox, this);
        this.parent.on('columnCheckbox', this.columnCheckbox, this);
        this.parent.on('updateGridActions', this.updateGridActions, this);
        this.parent.grid.on('colgroup-refresh', this.headerCheckbox, this);
        this.parent.on('checkboxSelection', this.checkboxSelection, this);
    }

    /**
     * Removes previously added event listeners.
     *
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('dataBoundArg', this.headerCheckbox);
        this.parent.off('columnCheckbox', this.columnCheckbox);
        this.parent.grid.off('colgroup-refresh', this.headerCheckbox);
        this.parent.off('checkboxSelection', this.checkboxSelection);
        this.parent.off('updateGridActions', this.updateGridActions);
    }

    /**
     * Destroys the selection module and clears internal caches.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.resetSelectionCaches();
        this.removeEventListener();
    }

    /**
     * Handles checkbox click events from the DOM and dispatches selection logic.
     *
     * @param {Object} args - Event args containing the click target.
     * @returns {void}
     */
    private checkboxSelection(args: Object): void {
        const target: HTMLElement = getObject('target', args);
        const checkWrap: HTMLElement = parentsUntil(target, 'e-checkbox-wrapper') as HTMLElement;
        let checkBox: HTMLInputElement;
        if (checkWrap && checkWrap.querySelectorAll('.e-treecheckselect').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const rowIndex: number[] = [];
            if (this.parent.frozenRows) {
                rowIndex.push(parseInt((target.closest('tr') as HTMLTableRowElement).getAttribute('aria-rowindex'), 10) - 1);
            } else {
                rowIndex.push((target.closest('tr') as HTMLTableRowElement).rowIndex);
            }
            this.selectCheckboxes(rowIndex);
            const newCheckState: boolean = checkBox.nextElementSibling.classList.contains('e-check');
            this.triggerChkChangeEvent(checkBox, newCheckState, target.closest('tr'));
        } else if (checkWrap && checkWrap.querySelectorAll('.e-treeselectall').length > 0 && this.parent.autoCheckHierarchy) {
            const frame: Element = checkWrap.querySelector('.e-frame');
            const currentStateIsUncheck: boolean = !frame.classList.contains('e-check') && !frame.classList.contains('e-stop');
            const targetState: boolean = currentStateIsUncheck; // If currently uncheck, target state is to check all.
            this.headerSelection(targetState);
            checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
            this.triggerChkChangeEvent(checkBox, targetState, target.closest('tr'));
        }
        if (!isNullOrUndefined(this.parent['parentQuery']) && this.parent.selectionSettings.persistSelection
            && this.parent['columnModel'].filter((col: { type: string }) => { return col.type === 'checkbox'; }).length > 0
            && isRemoteData(this.parent)) {
            if (this.parent['parentQuery'].length > 0) {
                this.parent.query.queries.push(...this.parent['parentQuery']);
                this.parent['parentQuery'] = [];
            }
        }
    }

    /**
     * Triggers the checkboxChange event with the appropriate arguments.
     *
     * @param {HTMLInputElement} checkBox - The checkbox input element that changed.
     * @param {boolean} checkState - The new checked state.
     * @param {HTMLTableRowElement} rowElement - The row element where the change occurred.
     * @returns {void}
     */
    private triggerChkChangeEvent(checkBox: HTMLInputElement, checkState: boolean, rowElement: HTMLTableRowElement): void {
        const data: ITreeData = this.parent.getCurrentViewRecords()[rowElement.rowIndex];
        const args: Object = {
            checked: checkState, target: checkBox, rowElement: rowElement,
            rowData: checkBox.classList.contains('e-treeselectall')
                ? this.parent.getCheckedRecords() : data
        };
        this.parent.trigger(events.checkboxChange, args);
    }

    /**
     * Determines the index of the checkbox column in the header.
     *
     * @returns {number} The index of the checkbox column, or -1 if not found.
     */
    private getCheckboxcolumnIndex(): number {
        if (this.checkboxColIndexCache !== -2) { return this.checkboxColIndexCache; }
        let mappingUid: string; let columnIndex: number = -1; const stackedHeader: string = 'stackedHeader';
        const columnModel: string = 'columnModel';
        const columns: ColumnModel[] = this.parent[`${stackedHeader}`] ? this.parent[`${columnModel}`] : <ColumnModel[]>(this.parent.columns);
        for (let col: number = 0; col < columns.length; col++) {
            if ((<ColumnModel>columns[parseInt(col.toString(), 10)]).showCheckbox) {
                mappingUid = (<ColumnModel>columns[parseInt(col.toString(), 10)]).uid;
                break;
            }
        }
        const headerDivs: NodeListOf<Element> = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv');
        for (let j: number = 0; j < headerDivs.length; j++) {
            const headercell: Element = headerDivs[parseInt(j.toString(), 10)];
            if (headercell.getAttribute('data-mappinguid') === mappingUid) { columnIndex = j; break; }
        }
        this.checkboxColIndexCache = isNullOrUndefined(columnIndex) ? -1 : columnIndex;
        return this.checkboxColIndexCache;
    }

    /**
     * Renders and initializes the header checkbox element.
     *
     * @returns {void}
     */
    private headerCheckbox(): void {
        this.buildVisibleUidMap();
        this.totalSelectableCount = this.countSelectableRecords(this.resolveHeaderSelectionList(true)); // Use all flatData for initial count
        this.columnIndex = this.getCheckboxcolumnIndex();
        if (this.columnIndex > -1) {
            const headerElement: Element = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[this.columnIndex];
            if (headerElement && headerElement.querySelectorAll('.e-treeselectall').length === 0) {
                const value: boolean = false; // Initial state can be false.
                const rowChkBox: Element = this.parent.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox' } });
                const checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
                checkWrap.classList.add('e-hierarchycheckbox');
                checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
                if (!isNullOrUndefined(headerElement)) { headerElement.insertBefore(checkWrap, headerElement.firstChild); }
                this.headerCheckboxFrameEl = checkWrap.querySelector('.e-frame') as HTMLElement; // Assign the frame element
                if (this.parent.autoCheckHierarchy) { this.headerSelection(); } // Update header state based on data
            } else if (headerElement && headerElement.querySelectorAll('.e-treeselectall').length > 0) {
                this.headerCheckboxFrameEl = headerElement.querySelector('.e-frame') as HTMLElement;
                if (this.parent.autoCheckHierarchy) { this.headerSelection(); } // Update status based on current selections
            }
        }
    }


    /**
     * Renders a checkbox element for a column cell.
     *
     * @param {QueryCellInfoEventArgs} args - The QueryCellInfoEventArgs for the cell.
     * @returns {Element} The rendered checkbox wrapper element.
     */
    private renderColumnCheckbox(args: QueryCellInfoEventArgs): Element {
        const rowChkBox: Element = this.parent.createElement('input', { className: 'e-treecheckselect', attrs: { 'type': 'checkbox', 'aria-label': 'checkbox' } });
        const data: ITreeData = <ITreeData>args.data;
        args.cell.classList.add('e-treegridcheckbox');
        args.cell.setAttribute('aria-label', 'checkbox');
        const value: boolean = (data.checkboxState === 'check');
        const checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
        checkWrap.classList.add('e-hierarchycheckbox');
        if (this.parent.allowTextWrap) {
            (<HTMLElement>checkWrap.querySelector('.e-frame')).style.width = '18px';
        }
        if (data.checkboxState === 'indeterminate') {
            const checkbox: HTMLElement = <HTMLElement>checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-stop');
        } else if (data.checkboxState === 'uncheck') {
            const checkbox: HTMLElement = <HTMLElement>checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-uncheck');
        } else if (data.checkboxState === 'check') {
            const checkbox: HTMLElement = <HTMLElement>checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-check');
        }

        checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
        return checkWrap;
    }

    /**
     * Injects the checkbox into a column cell during QueryCellInfo.
     *
     * @param {QueryCellInfoEventArgs} container - The cell event args.
     * @returns {void}
     */
    private columnCheckbox(container: QueryCellInfoEventArgs): void {
        const checkWrap: Element = this.renderColumnCheckbox(container);
        const containerELe: Element = container.cell.querySelector('.e-treecolumn-container');
        if (!isNullOrUndefined(containerELe)) {
            if (!container.cell.querySelector('.e-hierarchycheckbox')) {
                containerELe.insertBefore(checkWrap, containerELe.querySelectorAll('.e-treecell')[0]);
            }
        } else {
            const spanEle: HTMLElement = this.parent.createElement('span', { className: 'e-treecheckbox' });
            const data: string = container.cell.innerHTML;
            container.cell.innerHTML = '';
            spanEle.innerHTML = data;
            const divEle: HTMLElement = this.parent.createElement('div', { className: 'e-treecheckbox-container' });
            divEle.appendChild(checkWrap);
            divEle.appendChild(spanEle);
            container.cell.appendChild(divEle);
        }
    }

    /**
     * Selects or toggles checkboxes for the provided row indexes.
     *
     * @param {number[]} rowIndexes - Array of row indexes to toggle selection for.
     * @returns {void}
     */
    public selectCheckboxes(rowIndexes: number[]): void {
        for (let i: number = 0; i < rowIndexes.length; i++) {
            const viewRec: ITreeData = this.parent.getCurrentViewRecords()[rowIndexes[parseInt(i.toString(), 10)]] as ITreeData;
            const flatRec: ITreeData = getParentData(this.parent, viewRec.uniqueID);
            const nextState: string = (flatRec.checkboxState === 'check') ? 'uncheck' : 'check';
            flatRec.checkboxState = nextState;
            this.traverSelection(flatRec, nextState, false);
        }
    }

    /**
     * Traverses selection for a record and cascades selections to children/parents as necessary.
     *
     * @param {ITreeData} record - The record to process.
     * @param {string} checkboxState - The desired checkbox state ('check'|'uncheck'|'indeterminate').
     * @param {boolean} isChildItem - True if this invocation is for a child during recursion.
     * @returns {void}
     */
    private traverSelection(record: ITreeData, checkboxState: string, isChildItem: boolean): void {
        const previousState: string = record.checkboxState;
        if (!isChildItem) {
            this.buildVisibleUidMap();
        }
        let effectiveChildren: ITreeData[] = Array.isArray(record.childRecords) ? record.childRecords : [];
        if ((!effectiveChildren || effectiveChildren.length === 0) && this.parent.autoCheckHierarchy) {
            effectiveChildren = this.getChildrenFromFlat(record);
        }
        if (this.parent.filterModule && this.parent.filterModule.filteredResult.length > 0
            && effectiveChildren && effectiveChildren.length) {
            effectiveChildren = this.getFilteredChildRecords(effectiveChildren);
        }
        if (!this.parent.autoCheckHierarchy || !effectiveChildren || effectiveChildren.length === 0) {
            this.updateSelectedItems(record, checkboxState);
            if (!isChildItem) {
                if (record.parentItem && this.parent.autoCheckHierarchy) {
                    this.updateParentSelection(record.parentItem as ITreeData);
                }
                this.updateSelectedCollectionsAfterBulk(this.resolveHeaderSelectionList(), '');
                this.refreshVisibleCheckboxes();
                if (this.parent.autoCheckHierarchy) {
                    this.updateHeaderCheckboxState();
                }
            }
            return;
        }
        let childCount: number = 0;
        let checkedCount: number = 0;
        let indeterminateCount: number = 0;
        for (let i: number = 0; i < effectiveChildren.length; i++) {
            const child: ITreeData = effectiveChildren[parseInt(i.toString(), 10)];
            if (!child || child.isSummaryRow) { continue; }
            childCount++;
            this.updateSelectedItems(child, checkboxState, true);
            if (child.hasChildRecords) {
                this.traverSelection(child, checkboxState, true);
            }
            if (child.checkboxState === 'check') {
                checkedCount++;
            } else if (child.checkboxState === 'indeterminate') {
                indeterminateCount++;
            }
        }
        if (record.uniqueID) {
            this.parentSelectionCounters[record.uniqueID] = {
                total: childCount,
                checked: checkedCount,
                indeterminate: indeterminateCount
            };
        }
        const summary: { total: number; checked: number; indeterminate: number; } = this.parentSelectionCounters[record.uniqueID];
        let finalState: string = this.deriveParentState(record, summary);
        if (checkboxState === 'check' && summary.total > 0 && summary.checked === summary.total && summary.indeterminate === 0) {
            finalState = 'check';
        }
        this.updateSelectedItems(record, finalState);
        if (!isChildItem && record.parentItem && this.parent.autoCheckHierarchy) {
            this.updateParentSelection(record.parentItem as ITreeData, previousState, finalState);
        }
        if (!isChildItem) {
            const bulkList: ITreeData[] = this.resolveHeaderSelectionList();
            this.updateSelectedCollectionsAfterBulk(bulkList, ''); // This will rebuild selectedItems & selectedIndexes based on total state
            this.refreshVisibleCheckboxes();
            this.updateHeaderCheckboxState();
        }
    }

    /**
     * Filters provided child records against the current filter result.
     *
     * @param {ITreeData[]} childRecords - The array of child records to filter.
     * @returns {ITreeData[]} The filtered child records array.
     */
    private getFilteredChildRecords(childRecords: ITreeData[]): ITreeData[] {
        const filteredChildRecords: ITreeData[] = childRecords.filter((e: ITreeData) => {
            return this.parent.filterModule.filteredResult.indexOf(e) > -1;
        });
        return filteredChildRecords;
    }

    /**
     * Derives children for a record from flatData using the parentItem link.
     * Used when childRecords is missing or empty.
     *
     * @param {ITreeData} record - The record for which to find child elements.
     * @returns {ITreeData[]} An array of child records derived from flatData.
     */
    private getChildrenFromFlat(record: ITreeData): ITreeData[] {
        const all: ITreeData[] = (this.parent.flatData) as ITreeData[];
        if (!all || !record) { return []; }
        const pid: string = record.uniqueID as unknown as string;
        const out: ITreeData[] = [];
        for (let i: number = 0; i < all.length; i++) {
            const r: ITreeData = all[parseInt(i.toString(), 10)];
            if (!r || r.isSummaryRow) { continue; }
            const p: ITreeData = r.parentItem as ITreeData;
            if (p && (p.uniqueID as unknown as string) === pid) {
                out.push(r);
            }
        }
        return out;
    }

    /**
     * Updates parent selection by rebuilding summary and applying deltas, then bubbling up if required.
     *
     * @param {ITreeData} parentRecord - The parent record reference.
     * @param {string} [previousChildState] - Previous state of the child that changed.
     * @param {string} [nextChildState] - Next state of the child that changed.
     * @returns {void}
     */
    private updateParentSelection(parentRecord: ITreeData, previousChildState?: string, nextChildState?: string): void {
        const parent: ITreeData = getParentData(this.parent, parentRecord.uniqueID);
        if (!parent) { return; }
        const summary: { total: number; checked: number; indeterminate: number; } = this.buildSelectionSummary(parent);
        if (previousChildState) { this.applySummaryDelta(summary, previousChildState, -1); }
        if (nextChildState) { this.applySummaryDelta(summary, nextChildState, 1); }
        if (parent.uniqueID) {
            this.parentSelectionCounters[parent.uniqueID] = summary;
        }
        const desiredState: string = this.deriveParentState(parent, summary);
        if (parent.checkboxState === desiredState) { return; }
        const parentPrev: string = parent.checkboxState;
        parent.checkboxState = desiredState;
        this.updateSelectedItems(parent, desiredState);
        if (parent.parentItem) {
            this.updateParentSelection(parent.parentItem as ITreeData, parentPrev, desiredState);
        }
    }

    /**
     * Builds a selection summary for a record's children.
     *
     * @param {Object} record - The record whose children should be summarized.
     * @param {boolean} [ignoreFilter] - If true, ignore current filter when computing summary.
     * @returns {{ total: number, checked: number, indeterminate: number }} The computed summary.
     */
    private buildSelectionSummary(record: ITreeData, ignoreFilter?: boolean): { total: number; checked: number; indeterminate: number; } {
        const summary: { total: number; checked: number; indeterminate: number; } = { total: 0, checked: 0, indeterminate: 0 };
        let children: ITreeData[] = [];
        if (record && Array.isArray(record.childRecords) && record.childRecords.length) {
            children = record.childRecords;
        } else {
            children = this.getChildrenFromFlat(record);
        }
        if (!ignoreFilter && this.parent.filterModule && this.parent.filterModule.filteredResult.length > 0) {
            children = this.getFilteredChildRecords(children);
        }
        for (let i: number = 0; i < children.length; i++) {
            const child: ITreeData = children[parseInt(i.toString(), 10)];
            if (!child || child.isSummaryRow) { continue; }
            summary.total++;
            if (child.checkboxState === 'check') { summary.checked++; }
            else if (child.checkboxState === 'indeterminate') { summary.indeterminate++; }
        }
        return summary;
    }

    /**
     * Applies a delta to a selection summary based on a state change.
     *
     * @param {Object} summary - The summary to modify. Object with numeric properties: total, checked, indeterminate.
     * @param {string} state - The state that changed ('check' | 'indeterminate').
     * @param {number} delta - The delta to apply (e.g. +1 or -1).
     * @returns {void}
     */
    private applySummaryDelta(summary: { total: number; checked: number; indeterminate: number; }, state: string, delta: number): void {
        if (state === 'check') { summary.checked = Math.max(0, summary.checked + delta); }
        else if (state === 'indeterminate') { summary.indeterminate = Math.max(0, summary.indeterminate + delta); }
    }

    /**
     * Derives the parent's checkbox state based on children summary counts.
     *
     * @param {ITreeData} record The parent record.
     * @param {{ total: number, checked: number, indeterminate: number }} summary The children summary.
     * @returns {'check'|'indeterminate'|'uncheck'} The derived checkbox state.
     */
    private deriveParentState(record: ITreeData, summary: { total: number; checked: number; indeterminate: number; }): string {
        const total: number = summary.total;
        const checked: number = summary.checked;
        const indeterminate: number = summary.indeterminate;

        if (indeterminate > 0 || (checked > 0 && checked !== total)) { return 'indeterminate'; }
        if (checked === total && total > 0) { return 'check'; }
        return 'uncheck';
    }

    /**
     * Handles header checkbox (select all / clear all) behavior.
     *
     * @param {boolean} [checkAll] - Optional explicit flag to check or uncheck all.
     * @returns {void}
     */
    private headerSelection(checkAll?: boolean): void {
        if (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0) {
            const filterResult: Object[] = this.parent.filterModule.filteredResult;
            if (this.filteredList.length === 0){
                this.filteredList = filterResult;
            }
            if (this.parent.grid.searchSettings.key.length) {
                this.searchingRecords = filterResult;
            }
            else {
                if (this.filteredList !== filterResult && !this.parent.grid.searchSettings.key.length) {
                    this.filteredList = filterResult;
                    this.searchingRecords = [];
                }
            }
        }
        if (this.searchingRecords.length > 0 && !isNullOrUndefined(checkAll)) {
            this.filteredList = this.searchingRecords;
        } else if (this.filteredList.length > 0 && !this.parent.filterSettings.columns.length
            && !this.parent.grid.searchSettings.key.length) {
            this.filteredList = [];
        }
        const records: ITreeData[] = this.resolveHeaderSelectionList(true);
        if (!isNullOrUndefined(checkAll)) {
            this.resetSelectionCaches();
            const targetState: string = checkAll ? 'check' : 'uncheck';
            this.headerSelectionState = targetState;
            this.processHeaderSelection(records, targetState);
            this.finalizeParentsAfterBulk(records);
            this.updateSelectedCollectionsAfterBulk(records, '');
            this.refreshVisibleCheckboxes();
            this.updateHeaderCheckboxState();
            return;
        }
        this.totalSelectableCount = this.countSelectableRecords(records);
        this.updateHeaderCheckboxState();
    }

    /**
     * Finalizes parent states after a bulk header operation (e.g., Select All).
     * This ensures parent states (checked/indeterminate) are correct after cascades.
     *
     * @param {ITreeData[]} records - The records that were processed in the bulk operation.
     * @returns {void}
     */
    private finalizeParentsAfterBulk(records: ITreeData[]): void {
        const all: ITreeData[] = records;
        for (let i: number = 0; i < all.length; i++) {
            const rec: ITreeData = all[parseInt(i.toString(), 10)];
            if (!rec || !rec.hasChildRecords) { continue; }
            const summary: { total: number; checked: number; indeterminate: number; } = this.buildSelectionSummary(rec, true);
            this.parentSelectionCounters[rec.uniqueID] = summary;
            let finalState: string = this.deriveParentState(rec, summary);
            if (this.headerSelectionState === 'check' &&
                summary.total > 0 && summary.checked === summary.total && summary.indeterminate === 0) {
                finalState = 'check';
            }
            else if (this.headerSelectionState === 'uncheck') {
                finalState = 'uncheck';
            }
            if (rec.checkboxState !== finalState) {
                this.updateSelectedItems(rec, finalState);
            }
        }
    }

    /**
     * Processes header selection for each record, setting their state silently in the data model.
     * Called during bulk operations like "select all".
     *
     * @param {ITreeData[]} records - The records to process.
     * @param {string} targetState - The target state to set on each record.
     * @returns {void}
     */
    private processHeaderSelection(records: ITreeData[], targetState: string): void {
        for (let i: number = 0; i < records.length; i++) {
            const record: ITreeData = records[parseInt(i.toString(), 10)];
            if (!record) { continue; }
            const previousState: string = record.checkboxState;
            if (previousState === targetState) { continue; }
            record.checkboxState = targetState;
            this.updateSelectedItems(record, targetState, true);
        }
    }

    /**
     * Rebuilds `selectedItems`, `selectedUidMap`, and `selectedIndexes` based on the current data states in the model.
     * This method is called after bulk operations (like headerSelection, grid actions, etc.) to synchronize internal collections.
     * It ensures `selectedItems` retains original selection order *as much as possible* for currently checked items
     * and `selectedIndexes` reflects their *current visible order*.
     *
     * @param {ITreeData[]} records - The records that were processed (or the full data set if re-evaluating everything).
     * @param {string} requestType - The data action type such as filtering, searching, refresh,etc.
     * @returns {void}
     */
    private updateSelectedCollectionsAfterBulk(records: ITreeData[], requestType: string): void {
        const hasFilter : boolean = !!(this.parent.filterModule && this.parent.filterModule.filteredResult &&
                                        this.parent.filterModule.filteredResult.length);
        const hasSearch : boolean = !!(this.parent.grid && this.parent.grid.searchSettings &&
                                        this.parent.grid.searchSettings.key && this.parent.grid.searchSettings.key.length);
        const isFilterOrSearch : boolean = hasFilter || hasSearch || requestType === 'refresh' || requestType === 'searching';
        const currentlySelectedItemsInOrder: ITreeData[] = isFilterOrSearch ? records : this.selectedItems.slice();
        const newSelectedItems: ITreeData[] = [];
        const newSelectedUidMap: Map<string, boolean> = new Map<string, boolean>();
        const newSelectedIndexes: number[] = [];
        for (const item of currentlySelectedItemsInOrder) {
            if (item.hasChildRecords && isFilterOrSearch && item.level === 0 && this.parent.autoCheckHierarchy) {
                this.updateParentSelection(item);
            }
            if (item.uniqueID && item.checkboxState === 'check') {
                newSelectedItems.push(item);
                newSelectedUidMap.set(item.uniqueID, true);
            }
        }
        if (!isFilterOrSearch) {
            const allFlatData: ITreeData[] = this.parent.flatData as ITreeData[];
            if (allFlatData) {
                for (const record of allFlatData) {
                    if (!record || record.isSummaryRow) { continue; }

                    if (record.uniqueID && record.checkboxState === 'check' && !newSelectedUidMap.has(record.uniqueID)) {
                        newSelectedItems.push(record);
                        newSelectedUidMap.set(record.uniqueID, true);
                    }
                }
            }
        }
        this.selectedItems = newSelectedItems;
        this.selectedUidMap = newSelectedUidMap;
        this.buildVisibleUidMap();
        for (const item of this.selectedItems) {
            const visibleIdx: number = this.visibleUidIndex[item.uniqueID as string];
            if (visibleIdx !== undefined) {
                newSelectedIndexes.push(visibleIdx);
            }
        }
        this.selectedIndexes = newSelectedIndexes;
        this.checkedItemCount = this.selectedItems.length;
        this.totalSelectableCount =
         this.countSelectableRecords(records);
    }

    /**
     * Refreshes visible checkbox DOM elements to reflect the current data state.
     * This method exclusively updates the UI representation of checkboxes.
     *
     * @returns {void}
     */
    private refreshVisibleCheckboxes(): void {
        this.buildVisibleUidMap();
        const data: ITreeData[] = this.parent.getCurrentViewRecords();
        const uidMap: Record<string, ITreeData> =
            (this.parent as unknown as { uniqueIDCollection?: Record<string, ITreeData> }).uniqueIDCollection;
        for (let i: number = 0; data && i < data.length; i++) {
            const viewRec: ITreeData = data[parseInt(i.toString(), 10)] as ITreeData;
            if (!viewRec) { continue; }
            const uid: string | number = (viewRec as ITreeData).uniqueID;
            const srcRec: ITreeData = (uidMap && uid != null) ? (uidMap[String(uid)] as ITreeData) : viewRec;
            const state: string = (srcRec && (srcRec as ITreeData).checkboxState) ? (srcRec as ITreeData).checkboxState as string : 'uncheck';
            let rowEl: HTMLElement = null;
            const rowUid: string = (viewRec as any).uid as unknown as string;
            if (rowUid) {
                rowEl = this.parent.grid.getRowElementByUID(rowUid) as HTMLElement;
            }
            if (!rowEl) {
                const rows: HTMLTableRowElement[] = this.parent.getRows();
                rowEl = rows && rows[parseInt(i.toString(), 10)] as HTMLElement;
                if ((this.parent.frozenRows || this.parent.getFrozenColumns()) && !rowEl) {
                    const movableRows: Element[] = this.parent.getDataRows();
                    rowEl = movableRows && movableRows[parseInt(i.toString(), 10)] as HTMLElement;
                }
            }
            if (rowEl) {
                const frame: HTMLElement = rowEl.querySelector('.e-hierarchycheckbox .e-frame') as HTMLElement;
                if (frame) {
                    removeClass([frame], ['e-check', 'e-stop', 'e-uncheck']);
                    frame.classList.add(state === 'indeterminate' ? 'e-stop' : ('e-' + state));

                    const input: HTMLElement = rowEl.querySelector('.e-treecheckselect') as HTMLElement;
                    if (input) {
                        input.setAttribute('aria-checked', state === 'check' ? 'true' :
                            (state === 'uncheck' ? 'false' : 'mixed'));
                    }
                }
            }
        }
    }

    /**
     * Resets internal selection caches to their initial state.
     * This is usually called before a bulk selection operation (like "select all").
     *
     * @returns {void}
     */
    public resetSelectionCaches(): void {
        this.parentSelectionCounters = {};
        this.selectedUidMap = new Map<string, boolean>();
        this.selectedItems = [];
        this.selectedIndexes = [];
        this.totalSelectableCount = 0;
        this.headerSelectionState = 'uncheck';
        this.checkedItemCount = 0;
    }

    /**
     * Counts selectable (non-summary) records in the provided array.
     *
     * @param {ITreeData[]} records - The records to count.
     * @returns {number} The number of selectable records.
     */
    private countSelectableRecords(records: ITreeData[]): number {
        let count: number = 0;
        if (!records) { return count; }
        for (let i: number = 0; i < records.length; i++) {
            const rec: ITreeData = records[parseInt(i.toString(), 10)];
            if (rec && !rec.isSummaryRow) { count++; }
        }
        return count;
    }

    /**
     * Resolves the list of records used for header selection operations (e.g., for `select all`).
     *
     * @param {boolean} [includeAll] - If true and data is local, returns flatData (all records for full dataset actions).
     * @returns {ITreeData[]} The array of records to consider for header operations.
     */
    private resolveHeaderSelectionList(includeAll?: boolean): ITreeData[] {
        let dataToProcess: ITreeData[] = [];
        if (!isRemoteData(this.parent)) {
            const hasFilter: boolean = !!(
                this.parent.filterModule &&
                this.parent.filterModule.filteredResult &&
                this.parent.filterModule.filteredResult.length
            );
            const hasSearch: boolean = !!(
                this.parent.grid &&
                this.parent.grid.searchSettings &&
                this.parent.grid.searchSettings.key &&
                this.parent.grid.searchSettings.key.length
            );
            if (includeAll) {
                if (hasFilter) {
                    dataToProcess = (this.filteredList as ITreeData[]) && (this.filteredList as ITreeData[]).length
                        ? (this.filteredList as ITreeData[])
                        : (this.parent.filterModule.filteredResult as ITreeData[]);
                } else if (hasSearch && this.searchingRecords && this.searchingRecords.length) {
                    dataToProcess = this.searchingRecords as ITreeData[];
                } else {
                    dataToProcess = this.parent.flatData as ITreeData[];
                }
            } else {
                if (hasFilter) {
                    dataToProcess = (this.filteredList as ITreeData[]) && (this.filteredList as ITreeData[]).length
                        ? (this.filteredList as ITreeData[])
                        : (this.parent.filterModule.filteredResult as ITreeData[]);
                } else if (hasSearch && this.searchingRecords && this.searchingRecords.length) {
                    dataToProcess = this.searchingRecords as ITreeData[];
                } else {
                    dataToProcess = this.parent.flatData as ITreeData[];
                }
            }
        } else {
            dataToProcess = this.parent.getCurrentViewRecords();
        }
        return dataToProcess;
    }

    /**
     * Updates the header checkbox state (checked/indeterminate/unchecked) based on current selections.
     *
     * @returns {void}
     */
    private updateHeaderCheckboxState(): void {
        const frame: HTMLElement = this.headerCheckboxFrameEl;
        if (!frame) { return; }
        const recordsForHeaderLogic: ITreeData[] = this.resolveHeaderSelectionList(true);
        this.totalSelectableCount = this.countSelectableRecords(recordsForHeaderLogic);
        let checkedCountForHeaderLogic: number = 0;
        for (const record of recordsForHeaderLogic) {
            if (record && !record.isSummaryRow && record.checkboxState === 'check') {
                checkedCountForHeaderLogic++;
            }
        }
        removeClass([frame], ['e-check', 'e-stop', 'e-uncheck']);
        if (this.totalSelectableCount === 0) {
            frame.classList.add('e-uncheck');
        } else if (checkedCountForHeaderLogic === 0) {
            frame.classList.add('e-uncheck');
        } else if (checkedCountForHeaderLogic === this.totalSelectableCount) {
            frame.classList.add('e-check');
        } else {
            frame.classList.add('e-stop');
        }
    }

    /**
     * Updates selection arrays (selectedItems, selectedUidMap, selectedIndexes) and visible DOM for a single record.
     * This is the core method for managing the state of a single checkbox.
     *
     * @param {ITreeData} currentRecord - The record to update.
     * @param {string} checkState - The new checkbox state ('check' | 'uncheck' | 'indeterminate').
     * @param {boolean} [silent] - If true, update is silent (only updates data model, no collection management or DOM update).
     * @returns {void}
     */
    private updateSelectedItems(currentRecord: ITreeData, checkState: string, silent?: boolean): void {
        this.buildVisibleUidMap();
        const uid: string | number = (currentRecord as ITreeData).uniqueID;
        const uidMap: Record<string, ITreeData> =
            (this.parent as unknown as { uniqueIDCollection?: Record<string, ITreeData> }).uniqueIDCollection;
        const checkboxRecord: ITreeData = (uidMap && uid != null) ? (uidMap[String(uid)] ?
            (uidMap[String(uid)] as ITreeData) : currentRecord) : currentRecord;
        const isSummary: boolean = currentRecord.isSummaryRow === true;
        const previousState: string = (checkboxRecord as ITreeData).checkboxState;
        const currentVisibleIndex: number | undefined = this.visibleUidIndex[String(uid)];
        (checkboxRecord as ITreeData).checkboxState = checkState;
        if (silent) { return; }
        if (!isSummary && previousState !== checkState) {
            if (checkState === 'check') {
                this.checkedItemCount++;
                if (!this.selectedUidMap.has(String(uid))) {
                    if (checkboxRecord.uniqueID) { this.selectedUidMap.set(String(checkboxRecord.uniqueID), true); }
                    this.selectedItems.push(checkboxRecord);
                    if (currentVisibleIndex !== undefined && this.selectedIndexes.indexOf(currentVisibleIndex) === -1) {
                        this.selectedIndexes.push(currentVisibleIndex);
                    }
                }
            } else if (previousState === 'check' || previousState === 'indeterminate') {
                if (this.checkedItemCount > 0) { this.checkedItemCount--; }
                if (checkboxRecord && checkboxRecord.uniqueID && this.selectedUidMap.has(String(checkboxRecord.uniqueID))) {
                    this.selectedUidMap.delete(String(checkboxRecord.uniqueID));
                    const itemIdx: number = this.selectedItems.indexOf(checkboxRecord);
                    if (itemIdx !== -1) { this.selectedItems.splice(itemIdx, 1); }
                    if (currentVisibleIndex !== undefined) {
                        const indexInSelectedIndexes: number = this.selectedIndexes.indexOf(currentVisibleIndex);
                        if (indexInSelectedIndexes > -1) {
                            this.selectedIndexes.splice(indexInSelectedIndexes, 1);
                        }
                    }
                }
            }
        }
        let rowEl: HTMLElement = null;
        const rowUid: string = (currentRecord as any).uid as unknown as string;
        if (rowUid) {
            rowEl = this.parent.grid.getRowElementByUID(rowUid) as HTMLElement;
        }
        if (!rowEl) {
            const recordVisibleIndex: number = currentVisibleIndex !== undefined ? currentVisibleIndex : (typeof this.visibleUidIndex[String(uid)] === 'number' ? this.visibleUidIndex[String(uid)] : -1);
            if (recordVisibleIndex > -1) {
                rowEl = this.parent.getRows()[parseInt(recordVisibleIndex.toString(), 10)] as HTMLElement;
                if (!rowEl && (this.parent.frozenRows || this.parent.getFrozenColumns())) {
                    rowEl = this.parent.getDataRows()[parseInt(recordVisibleIndex.toString(), 10)] as HTMLElement;
                }
            }
        }
        if (rowEl) {
            const frame: HTMLElement = rowEl.querySelector('.e-hierarchycheckbox .e-frame') as HTMLElement;
            if (frame) {
                removeClass([frame], ['e-check', 'e-stop', 'e-uncheck']);
                frame.classList.add(checkState === 'indeterminate' ? 'e-stop' : ('e-' + checkState));
            }
            const input: HTMLElement = rowEl.querySelector('.e-treecheckselect') as HTMLElement;
            if (input) {
                input.setAttribute('aria-checked', checkState === 'check' ? 'true' :
                    (checkState === 'uncheck' ? 'false' : 'mixed'));
            }
        }
    }

    /**
     * Handles various grid actions and updates selection state accordingly.
     * This method ensures that selection state is maintained and UI is refreshed after grid operations.
     *
     * @param {CellSaveEventArgs} args - Action arguments containing requestType and data.
     * @returns {void}
     */
    private updateGridActions(args: CellSaveEventArgs): void {
        const requestType: string = args.requestType;
        if (isCheckboxcolumn(this.parent)) {
            if (this.parent.autoCheckHierarchy) {
                if ((requestType === 'sorting' || requestType === 'paging')) {
                    this.updateSelectedCollectionsAfterBulk(this.resolveHeaderSelectionList(), '');
                    this.refreshVisibleCheckboxes();
                    this.updateHeaderCheckboxState();
                } else if (requestType === 'delete' || args.action === 'add') {
                    let updatedData: ITreeData[] = [];
                    if (requestType === 'delete') {
                        updatedData = <ITreeData[]>args.data;
                    } else {
                        updatedData.push(args.data);
                    }
                    for (let i: number = 0; i < updatedData.length; i++) {
                        if (requestType === 'delete') {
                            this.updateSelectedItems(updatedData[parseInt(i.toString(), 10)], 'uncheck', false);
                        }
                        if (!isNullOrUndefined(updatedData[parseInt(i.toString(), 10)].parentItem)) {
                            this.updateParentSelection(updatedData[parseInt(i.toString(), 10)].parentItem as ITreeData);
                        }
                    }
                    this.updateSelectedCollectionsAfterBulk(this.resolveHeaderSelectionList(true), '');
                    this.refreshVisibleCheckboxes();
                    if (this.parent.autoCheckHierarchy) {
                        this.updateHeaderCheckboxState();
                    }
                } else if (args.requestType === 'add' && this.parent.autoCheckHierarchy) {
                    (<ITreeData>args.data).checkboxState = 'uncheck';
                } else if (requestType === 'filtering' || requestType === 'searching' || requestType === 'refresh') {
                    this.updateSelectedCollectionsAfterBulk(this.resolveHeaderSelectionList(), requestType);
                    this.refreshVisibleCheckboxes();
                    if (this.parent.autoCheckHierarchy) {
                        this.updateHeaderCheckboxState();
                    }
                }
            }
            else {
                if ((requestType === 'filtering' || requestType === 'searching' || requestType === 'refresh' ||
                    requestType === 'sorting' || requestType === 'paging' || requestType === 'expanding' ||
                    requestType === 'expand' || requestType === 'collapsing' || requestType === 'collapse') && !isRemoteData(this.parent)) {
                    if (!(isCheckboxcolumn(this.parent) && (requestType === 'refresh' && this.parent['isVirtualExpandCollapse']))) {
                        this.selectedItems = [];
                        this.selectedUidMap = new Map<string, boolean>();
                        this.selectedIndexes = [];
                    }
                    if (requestType === 'filtering' || requestType === 'searching' || requestType === 'sorting') {
                        this.headerSelection(false);
                    }
                    this.refreshVisibleCheckboxes();
                    if (this.parent.autoCheckHierarchy) {
                        this.updateHeaderCheckboxState();
                    }
                }
            }
        }
    }

    /**
     * Retrieves checked record objects.
     * This array maintains the `ITreeData` objects in the order they were selected.
     *
     * @returns {ITreeData[]} Array of checked records.
     */
    public getCheckedrecords(): ITreeData[] { return this.selectedItems; }

    /**
     * Retrieves visible indexes of checked rows in the current view, in the order they were selected.
     * This method dynamically generates the list of visible indexes by iterating through `selectedItems`
     * (which preserves selection order) and finding their *current* visible index.
     *
     * @returns {number[]} Array of checked row indexes in selection order.
     */
    public getCheckedRowIndexes(): number[] {
        this.buildVisibleUidMap();
        const orderedVisibleIndexes: number[] = [];
        for (const selectedItem of this.selectedItems) {
            const uid: string = selectedItem.uniqueID;
            if (uid !== undefined && this.visibleUidIndex[uid as string] !== undefined) {
                orderedVisibleIndexes.push(this.visibleUidIndex[uid as string]);
            }
        }
        return orderedVisibleIndexes;
    }
}
