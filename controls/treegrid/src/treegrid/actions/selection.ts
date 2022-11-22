import { TreeGrid } from '../base/treegrid';
import { ColumnModel } from '../models/column';
import { isNullOrUndefined, removeClass } from '@syncfusion/ej2-base';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { QueryCellInfoEventArgs, parentsUntil, getObject } from '@syncfusion/ej2-grids';
import { CellSaveEventArgs } from '../base/interface';
import { ITreeData } from '../base/interface';
import * as events from '../base/constant';
import { getParentData, isRemoteData, isCheckboxcolumn, findChildrenRecords } from '../utils';

/**
 * TreeGrid Selection module
 *
 * @hidden
 */
export class Selection {
    private parent: TreeGrid;
    private columnIndex: number;
    private selectedItems: Object[];
    private selectedIndexes: number[];
    private filteredList: Object[];
    private searchingRecords: Object[];
    /**
     * Constructor for Selection module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent: TreeGrid) {
        this.parent = parent;
        this.selectedItems = [];
        this.selectedIndexes = [];
        this.filteredList = [];
        this.searchingRecords = [];
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Selection module name
     */
    private getModuleName(): string {
        return 'selection';
    }

    public addEventListener(): void {
        this.parent.on('dataBoundArg', this.headerCheckbox, this);
        this.parent.on('columnCheckbox', this.columnCheckbox, this);
        this.parent.on('updateGridActions', this.updateGridActions, this);
        this.parent.grid.on('colgroup-refresh', this.headerCheckbox, this);
        this.parent.on('checkboxSelection', this.checkboxSelection, this);

    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('dataBoundArg', this.headerCheckbox);
        this.parent.off('columnCheckbox', this.columnCheckbox);
        this.parent.grid.off('colgroup-refresh', this.headerCheckbox);
        this.parent.off('checkboxSelection', this.checkboxSelection);
        this.parent.off('updateGridActions', this.updateGridActions);
    }

    /**
     * To destroy the Selection
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    private checkboxSelection(args: Object): void {
        const target: HTMLElement = getObject('target', args);
        const checkWrap: HTMLElement = parentsUntil(target, 'e-checkbox-wrapper') as HTMLElement;
        let checkBox: HTMLInputElement;
        if (checkWrap && checkWrap.querySelectorAll('.e-treecheckselect').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const rowIndex: number[] = [];
            rowIndex.push((target.closest('tr') as HTMLTableRowElement).rowIndex);
            this.selectCheckboxes(rowIndex);
            this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'), target.closest('tr'));
        } else if (checkWrap && checkWrap.querySelectorAll('.e-treeselectall').length > 0 && this.parent.autoCheckHierarchy) {
            const checkBoxvalue: boolean = !checkWrap.querySelector('.e-frame').classList.contains('e-check')
        && !checkWrap.querySelector('.e-frame').classList.contains('e-stop');
            this.headerSelection(checkBoxvalue);
            checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
            this.triggerChkChangeEvent(checkBox, checkBoxvalue, target.closest('tr'));

        }
    }

    private triggerChkChangeEvent(checkBox: HTMLInputElement, checkState: boolean, rowElement: HTMLTableRowElement): void {
        const data: ITreeData = this.parent.getCurrentViewRecords()[rowElement.rowIndex];
        const args: Object = { checked: checkState, target: checkBox, rowElement: rowElement,
            rowData: checkBox.classList.contains('e-treeselectall')
                ? this.parent.getCheckedRecords() : data };
        this.parent.trigger(events.checkboxChange, args);
    }

    private getCheckboxcolumnIndex(): number {
        let mappingUid: string; let columnIndex: number; const stackedHeader: string = 'stackedHeader';
        const columnModel: string = 'columnModel';
        const columns: ColumnModel[] = this.parent[stackedHeader] ? this.parent[columnModel] :  <ColumnModel[]>(this.parent.columns);
        for (let col: number = 0; col < columns.length; col++) {
            if ((<ColumnModel>columns[col]).showCheckbox) {
                mappingUid = (<ColumnModel>columns[col]).uid;
            }
        }
        const headerCelllength: number = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv').length;
        for (let j: number = 0; j < headerCelllength; j++) {
            const headercell: Element = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[j];
            if (headercell.getAttribute('e-mappinguid') === mappingUid) {
                columnIndex = j;
            }
        }
        return columnIndex;
    }

    private headerCheckbox(): void {
        this.columnIndex = this.getCheckboxcolumnIndex();
        if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length === 0) {
            const headerElement: Element = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[this.columnIndex];
            const value: boolean = false;
            const rowChkBox: Element = this.parent.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox'}});
            const checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
            checkWrap.classList.add('e-hierarchycheckbox');
            checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
            if (!isNullOrUndefined(headerElement)) {
                headerElement.insertBefore(checkWrap, headerElement.firstChild);
            }
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        } else if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length > 0) {
            const checkWrap: Element = this.parent.getHeaderContent().querySelectorAll('.e-checkbox-wrapper')[0];
            const checkBoxvalue: boolean = checkWrap.querySelector('.e-frame').classList.contains('e-check');
            if (this.parent.autoCheckHierarchy && checkBoxvalue) {
                this.headerSelection(checkBoxvalue);
            }
        }
    }

    private renderColumnCheckbox(args: QueryCellInfoEventArgs): Element {
        const rowChkBox: Element = this.parent.createElement('input', { className: 'e-treecheckselect', attrs: { 'type': 'checkbox', 'aria-label': 'checkbox' }});
        const data: ITreeData = <ITreeData>args.data;
        args.cell.classList.add('e-treegridcheckbox');
        args.cell.setAttribute('aria-label', 'checkbox');
        const value: boolean = (isNullOrUndefined(data.checkboxState) || data.checkboxState === 'uncheck') ? false : true;
        const checkWrap: Element = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
        checkWrap.classList.add('e-hierarchycheckbox');
        if (this.parent.allowTextWrap) {
            (<HTMLElement>checkWrap.querySelector('.e-frame')).style.width = '18px';
        }
        if (data.checkboxState === 'indeterminate') {
            const checkbox: HTMLElement = <HTMLElement>checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-stop');
        }
        checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
        return checkWrap;
    }

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

    public selectCheckboxes(rowIndexes: number[]): void {
        for (let i: number = 0; i < rowIndexes.length; i++) {
            let record: ITreeData = this.parent.getCurrentViewRecords()[rowIndexes[i]];
            const flatRecord: ITreeData = getParentData(this.parent, record.uniqueID);
            record = flatRecord;
            const checkboxState: string = (record.checkboxState === 'uncheck') ? 'check' : 'uncheck';
            record.checkboxState = checkboxState;
            const keys: string[] = Object.keys(record);
            for (let j: number = 0; j < keys.length; j++) {
                if (Object.prototype.hasOwnProperty.call(flatRecord, keys[j])) {
                    flatRecord[keys[j]] = record[keys[j]];
                }
            }
            this.traverSelection(record, checkboxState, false);
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        }
    }

    private traverSelection(record: ITreeData, checkboxState: string, ischildItem: boolean): void {
        let length: number = 0;
        this.updateSelectedItems(record, checkboxState);
        if (!ischildItem && record.parentItem && this.parent.autoCheckHierarchy) {
            this.updateParentSelection(record.parentItem);
        }
        if (record.childRecords && this.parent.autoCheckHierarchy) {
            let childRecords: ITreeData[] = record.childRecords;
            if (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
                childRecords = this.getFilteredChildRecords(childRecords);
            }
            length = childRecords.length;
            for (let count: number = 0; count < length; count++) {
                if (!childRecords[count].isSummaryRow) {
                    if (childRecords[count].hasChildRecords) {
                        this.traverSelection(childRecords[count], checkboxState, true);
                    } else {
                        this.updateSelectedItems(childRecords[count], checkboxState);
                    }
                }
            }
        }
    }

    private getFilteredChildRecords(childRecords: ITreeData[]): ITreeData[] {
        const filteredChildRecords: ITreeData[] = childRecords.filter((e: ITreeData) => {
            return this.parent.filterModule.filteredResult.indexOf(e) > -1;
        });
        return filteredChildRecords;
    }

    private updateParentSelection(parentRecord: ITreeData): void {
        let length: number = 0; let childRecords: ITreeData[] = [];
        const record: ITreeData = getParentData(this.parent, parentRecord.uniqueID);
        if (record && record.childRecords) {
            childRecords = record.childRecords;
        }
        if (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
            childRecords = this.getFilteredChildRecords(childRecords);
        }
        length = childRecords && childRecords.length;
        let indeter: number = 0; let checkChildRecords: number = 0;
        if (!isNullOrUndefined(record)) {
            for (let i: number = 0; i < childRecords.length; i++) {
                const currentRecord: ITreeData = getParentData(this.parent, childRecords[i].uniqueID);
                const checkBoxRecord: ITreeData = currentRecord;
                if (!isNullOrUndefined(checkBoxRecord)) {
                    if (checkBoxRecord.checkboxState === 'indeterminate') {
                        indeter++;
                    } else if (checkBoxRecord.checkboxState === 'check') {
                        checkChildRecords++;
                    }
                }
            }
            if (indeter > 0 || (checkChildRecords > 0 && checkChildRecords !== length)) {
                record.checkboxState = 'indeterminate';
            }
            else if (checkChildRecords === 0 && (!record.hasFilteredChildRecords || isNullOrUndefined(record.hasFilteredChildRecords)) && !isNullOrUndefined(this.parent['dataResults']['actionArgs']) &&
            (this.parent['dataResults']['actionArgs'].requestType === 'searching' || this.parent['dataResults']['actionArgs'].requestType === 'filtering') && record.checkboxState === 'check') {
                record.checkboxState = 'check';
            }
            else if ((checkChildRecords === 0 && indeter === 0) || (checkChildRecords === 0 && record.hasFilteredChildRecords && !isNullOrUndefined(this.parent['dataResults']['actionArgs']) &&
            (this.parent['dataResults']['actionArgs'].requestType === 'searching' || this.parent['dataResults']['actionArgs'].requestType === 'filtering') && record.checkboxState === 'check' )) {
                record.checkboxState = 'uncheck';
            } else {
                record.checkboxState = 'check';
            }
            this.updateSelectedItems(record, record.checkboxState);
            if (record.parentItem) {
                this.updateParentSelection(record.parentItem);
            }
        }
    }

    private headerSelection(checkAll?: boolean): void {
        let index: number = -1; let length: number = 0;
        //This property used to maintain the check state of the currentview data after clear filtering
        let multiFilterCheckState: boolean = false;
        if (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0) {
            const filterResult: Object[] = this.parent.filterModule.filteredResult;
            if (this.filteredList.length === 0){
                this.filteredList = filterResult;
            }
            if (this.parent.grid.searchSettings.key.length) {
                this.searchingRecords = filterResult;
            }
            else{
                if (this.filteredList !== filterResult) {
                    this.filteredList = filterResult;
                    multiFilterCheckState = true;
                }
                else {
                    multiFilterCheckState = false;
                }
            }
        }
        if (this.filteredList.length > 0){
            if (!this.parent.filterSettings.columns.length && this.filteredList.length && !this.parent.grid.searchSettings.key.length) {
                this.filteredList = [];
            }
            if (this.searchingRecords.length && !isNullOrUndefined(checkAll)) {
                this.filteredList = this.searchingRecords;
            }
        }
        let data: ITreeData[];
        if (this.parent.filterModule.filteredResult.length === 0 && this.parent.getCurrentViewRecords().length === 0 &&
        this.parent.filterSettings.columns.length > 0) {
            data = this.filteredList;
        }
        else {
            data = (!isNullOrUndefined(this.parent.filterModule) &&
            (this.filteredList.length > 0)) ? this.filteredList : this.parent.flatData;
        }
        data = isRemoteData(this.parent) ? this.parent.getCurrentViewRecords() : data;
        if (!isNullOrUndefined(checkAll)) {
            for (let i: number = 0; i < data.length; i++) {
                if (checkAll) {
                    if (data[i].checkboxState === 'check') {
                        continue;
                    }
                    if (multiFilterCheckState) {
                        continue;
                    }
                    data[i].checkboxState = 'check';
                    this.updateSelectedItems(data[i], data[i].checkboxState);
                } else {
                    index = this.selectedItems.indexOf(data[i]);
                    if (index > -1) {
                        data[i].checkboxState = 'uncheck';
                        this.updateSelectedItems(data[i], data[i].checkboxState);
                        if (this.parent.autoCheckHierarchy) {
                            this.updateParentSelection(data[i]);
                        }
                    }
                }
            }
        }
        if (checkAll === false && this.parent.enableVirtualization) {
            this.selectedItems = [];
            this.selectedIndexes = [];
            data.filter((rec: ITreeData) => {
                rec.checkboxState = 'uncheck';
                this.updateSelectedItems(rec, rec.checkboxState);
            });
        }
        length = this.selectedItems.length;
        const checkbox: HTMLElement = <HTMLElement>this.parent.getHeaderContent().querySelectorAll('.e-frame')[0];
        if (length > 0 && data.length > 0) {
            if (length !== data.length && !checkAll) {
                removeClass([checkbox], ['e-check']);
                checkbox.classList.add('e-stop');
            } else {
                removeClass([checkbox], ['e-stop']);
                checkbox.classList.add('e-check');
            }
        } else {
            removeClass([checkbox], ['e-check', 'e-stop']);
        }
    }

    private updateSelectedItems(currentRecord: ITreeData, checkState: string): void {
        const record: ITreeData[] = this.parent.getCurrentViewRecords().filter((e: ITreeData) => {
            return e.uniqueID === currentRecord.uniqueID;
        });
        let checkedRecord: ITreeData;
        const recordIndex: number = this.parent.getCurrentViewRecords().indexOf(record[0]);
        const checkboxRecord: ITreeData = getParentData(this.parent, currentRecord.uniqueID);
        const tr: HTMLElement = this.parent.getRows()[recordIndex];
        let checkbox: HTMLElement;
        if (recordIndex > -1) {           
            let movableTr: Element;
            if (this.parent.frozenRows || this.parent.getFrozenColumns()) {
                movableTr = this.parent.getMovableDataRows()[recordIndex];
            }
            checkbox = <HTMLElement>tr.querySelectorAll('.e-frame')[0] ? <HTMLElement>tr.querySelectorAll('.e-frame')[0]
                : <HTMLElement>movableTr.querySelectorAll('.e-frame')[0];
            if (!isNullOrUndefined(checkbox)) {
                removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            }
        }
        checkedRecord =  checkboxRecord;
        if (isNullOrUndefined(checkedRecord)) {
            checkedRecord = currentRecord;
        }
        checkedRecord.checkboxState = checkState;
        if (checkState === 'check' && isNullOrUndefined(currentRecord.isSummaryRow)) {
            if (recordIndex !== -1 && this.selectedIndexes.indexOf(recordIndex) === -1) {
                this.selectedIndexes.push(recordIndex);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && (recordIndex !== -1 &&
            (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0))) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && this.parent.enableVirtualization && (
                (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0))) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length === 0)) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && isNullOrUndefined(this.parent.filterModule)) {
                this.selectedItems.push(checkedRecord);
            }
        } else if ((checkState === 'uncheck' || checkState === 'indeterminate') && isNullOrUndefined(currentRecord.isSummaryRow)) {
            const index: number = this.selectedItems.indexOf(checkedRecord);
            if (index !== -1) {
                this.selectedItems.splice(index, 1);
            }
            if (this.selectedIndexes.indexOf(recordIndex) !== -1) {
                const checkedIndex: number = this.selectedIndexes.indexOf(recordIndex);
                this.selectedIndexes.splice(checkedIndex, 1);
            }
        }
        const checkBoxclass: string = checkState ===  'indeterminate' ? 'e-stop' : 'e-' + checkState;
        if (recordIndex > -1) {
            if (!isNullOrUndefined(checkbox)) {
                checkbox.classList.add(checkBoxclass);
                let chkstate: string = checkState == 'check' ? 'checked' : checkState == 'uncheck' ? 'unchecked' : 'mixed';
                tr.querySelector('.e-treecheckselect').setAttribute("aria-checked", checkState == 'check' ? 'true' : checkState == 'uncheck' ? 'false' : 'mixed');
                tr.querySelector('.e-frame').setAttribute("title", "checkbox" + chkstate);
            }
        }
    }

    private updateGridActions(args: CellSaveEventArgs): void {
        const requestType: string = args.requestType; let childData: ITreeData[]; let childLength: number;
        if (isCheckboxcolumn(this.parent)) {
            if (this.parent.autoCheckHierarchy) {
                if ((requestType === 'sorting' || requestType === 'paging')) {
                    const rows: Element[] = this.parent.grid.getRows();
                    childData = this.parent.getCurrentViewRecords();
                    childLength = childData.length;
                    this.selectedIndexes = [];
                    for (let i: number = 0; i < childLength; i++) {
                        if (!rows[i].classList.contains('e-summaryrow')) {
                            this.updateSelectedItems(childData[i], childData[i].checkboxState);
                        }
                    }
                } else if (requestType === 'delete' || args.action === 'add') {
                    let updatedData: ITreeData[] = [];
                    if (requestType === 'delete') {
                        updatedData = <ITreeData[]>args.data;
                    } else {
                        updatedData.push(args.data);
                    }
                    for (let i: number = 0; i < updatedData.length; i++) {
                        if (requestType === 'delete') {
                            const index: number = this.parent.flatData.indexOf(updatedData[i]);
                            const checkedIndex: number = this.selectedIndexes.indexOf(index);
                            this.selectedIndexes.splice(checkedIndex, 1);
                            this.updateSelectedItems(updatedData[i], 'uncheck');
                        }
                        if (!isNullOrUndefined(updatedData[i].parentItem)) {
                            this.updateParentSelection(updatedData[i].parentItem);
                        }
                    }
                } else if (args.requestType === 'add' && this.parent.autoCheckHierarchy) {
                    (<ITreeData>args.data).checkboxState = 'uncheck';
                } else if (requestType === 'filtering' || requestType === 'searching' || requestType === 'refresh'
                     && !isRemoteData(this.parent)) {
                    this.selectedItems = []; this.selectedIndexes = [];
                    childData = (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0) ?
                        this.parent.getCurrentViewRecords() : this.parent.flatData;
                    childData.forEach((record: ITreeData) => {
                        if (this.parent.enableVirtualization) {
                            if (record.hasChildRecords && record.childRecords.length > 0) {
                                this.updateParentSelection(record);
                            } else {
                                this.updateSelectedItems(record, record.checkboxState);
                            }
                            let child: ITreeData[] = findChildrenRecords(record);
                            child = this.getFilteredChildRecords (child);
                            for (let i: number = 0; i < child.length; i++) {
                                if (child[i].hasChildRecords) {
                                    this.updateParentSelection(child[i]);
                                } else if (!(child[i].hasChildRecords) && !isNullOrUndefined(child[i])) {
                                    this.updateSelectedItems(child[i], child[i].checkboxState);
                                }
                            }
                        }
                        else {
                            if (record.hasChildRecords) {
                                this.updateParentSelection(record);
                            } else {
                                this.updateSelectedItems(record, record.checkboxState);
                            }
                        }
                    });
                    this.headerSelection();
                }
            }
        }
    }

    public getCheckedrecords(): Object[] {
        return this.selectedItems;
    }

    public getCheckedRowIndexes(): number[] {
        return this.selectedIndexes;
    }
}
