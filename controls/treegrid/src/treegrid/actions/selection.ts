import { TreeGrid } from '../base/treegrid';
import { ColumnModel } from '../models/column';
import { isNullOrUndefined, removeClass, isBlazor } from '@syncfusion/ej2-base';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { QueryCellInfoEventArgs, parentsUntil, getObject } from '@syncfusion/ej2-grids';
import { CellSaveEventArgs } from '../base/interface';
import { ITreeData } from '../base/interface';
import * as events from '../base/constant';
import { getParentData } from '../utils';

/**
 * TreeGrid Selection module
 * @hidden
 */
export class Selection {
    private parent: TreeGrid;
    private columnIndex: number;
    private selectedItems: Object[];
    private selectedIndexes: number[];
    /**
     * Constructor for Selection module
     */
    constructor(parent: TreeGrid) {
      this.parent = parent;
      this.selectedItems = [];
      this.selectedIndexes = [];
      this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
      return 'selection';
    }

    public addEventListener(): void {
      this.parent.on('dataBoundArg', this.headerCheckbox, this);
      this.parent.on('columnCheckbox', this.columnCheckbox, this);
      this.parent.on('updateGridActions', this.updateGridActions, this);
      this.parent.on('checkboxSelection', this.checkboxSelection, this);

    }

    public removeEventListener(): void {
      if (this.parent.isDestroyed) { return; }
      this.parent.off('dataBoundArg', this.headerCheckbox);
      this.parent.off('columnCheckbox', this.columnCheckbox);
      this.parent.off('checkboxSelection', this.checkboxSelection);
      this.parent.off('updateGridActions', this.updateGridActions);
    }

  /**
   * To destroy the Selection 
   * @return {void}
   * @hidden
   */
  public destroy(): void {
    this.removeEventListener();
  }

  private checkboxSelection(args: Object): void {
    let target: HTMLElement = getObject('target', args);
    let checkWrap: HTMLElement = parentsUntil(target, 'e-checkbox-wrapper') as HTMLElement;
    let checkBox: HTMLInputElement;
    if (checkWrap && checkWrap.querySelectorAll('.e-treecheckselect').length > 0) {
      checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
      let rowIndex: number[]; rowIndex = [];
      rowIndex.push(+target.closest('tr').getAttribute('aria-rowindex'));
      this.selectCheckboxes(rowIndex);
      this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'), target.closest('tr'));
    } else if (checkWrap && checkWrap.querySelectorAll('.e-treeselectall').length > 0 && this.parent.autoCheckHierarchy) {
      let checkBoxvalue: boolean = !checkWrap.querySelector('.e-frame').classList.contains('e-check')
        && !checkWrap.querySelector('.e-frame').classList.contains('e-stop');
      this.headerSelection(checkBoxvalue);
      checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
      this.triggerChkChangeEvent(checkBox, checkBoxvalue, target.closest('tr'));

    }
  }

  private triggerChkChangeEvent(checkBox: HTMLInputElement, checkState: boolean, rowElement: HTMLTableRowElement): void {
    let data: ITreeData = this.parent.getCurrentViewRecords()[rowElement.rowIndex];
    let args: Object = { checked: checkState, target: checkBox, rowElement: rowElement,
      rowData: checkBox.classList.contains('e-treeselectall')
      ? this.parent.getCheckedRecords() : data };
    this.parent.trigger(events.checkboxChange, args);
  }

  private getCheckboxcolumnIndex(): number {
    let mappingUid: string; let columnIndex: number;
    let columns: ColumnModel[] = <ColumnModel[]>(this.parent.columns);
    for (let col: number = 0; col < columns.length; col++) {
      if ((<ColumnModel>columns[col]).showCheckbox) {
        mappingUid = (<ColumnModel>this.parent.columns[col]).uid;
      }
    }
    let headerCelllength: number = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv').length;
    for (let j: number = 0; j < headerCelllength; j++) {
      let headercell: Element = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[j];
      if (headercell.getAttribute('e-mappinguid') === mappingUid) {
        columnIndex = j;
      }
    }
    return columnIndex;
  }

    private headerCheckbox(): void {
      this.columnIndex = this.getCheckboxcolumnIndex();
      if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length === 0) {
        let headerElement: Element = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[this.columnIndex];
        let checkWrap: Element;
        let value: boolean = false;
        let rowChkBox: Element = this.parent.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox'}});
        checkWrap = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
        checkWrap.classList.add('e-hierarchycheckbox');
        (<HTMLElement>checkWrap.querySelector('.e-frame')).style.width = '18px';
        checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
        if (!isNullOrUndefined(headerElement)) {
          headerElement.insertBefore(checkWrap, headerElement.firstChild);
        }
        this.headerSelection();
      }
    }

    private renderColumnCheckbox(args: QueryCellInfoEventArgs): Element {
      let checkWrap: Element;
      let rowChkBox: Element = this.parent.createElement('input', { className: 'e-treecheckselect', attrs: { 'type': 'checkbox'}});
      let data: ITreeData = <ITreeData>args.data;
      args.cell.classList.add('e-treegridcheckbox');
      args.cell.setAttribute('aria-label', 'checkbox');
      let value: boolean = (isNullOrUndefined(data.checkboxState) || data.checkboxState === 'uncheck') ? false : true;
      checkWrap = createCheckBox(this.parent.createElement, false, { checked: value as boolean, label: ' ' });
      checkWrap.classList.add('e-hierarchycheckbox');
      (<HTMLElement>checkWrap.querySelector('.e-frame')).style.width = '18px';
      if (data.checkboxState === 'indeterminate') {
        let checkbox: HTMLElement = <HTMLElement>checkWrap.querySelectorAll('.e-frame')[0];
        removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
        checkWrap.querySelector('.e-frame').classList.add('e-stop');
      }
      checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
      return checkWrap;
    }

    private columnCheckbox(container: QueryCellInfoEventArgs): void {
      let checkWrap: Element = this.renderColumnCheckbox(container);
      let containerELe: Element = container.cell.querySelector('.e-treecolumn-container');
      if (!isNullOrUndefined(containerELe)) {
        containerELe.insertBefore(checkWrap, containerELe.querySelectorAll('.e-treecell')[0]);
      } else {
        let spanEle: HTMLElement = checkWrap.querySelector('.e-label');
        let data: string = container.cell.innerHTML;
        container.cell.innerHTML = '';
        spanEle.innerHTML = data;
        container.cell.appendChild(checkWrap);
      }
    }

    public selectCheckboxes(rowIndexes: number[]): void {
      for (let i: number = 0; i < rowIndexes.length; i++) {
        let record: ITreeData = this.parent.getCurrentViewRecords()[rowIndexes[i]];
        let checkboxState: string = (record.checkboxState === 'uncheck') ? 'check' : 'uncheck';
        record.checkboxState = checkboxState;
        let keys: string[] = Object.keys(record);
        let data: ITreeData = getParentData(this.parent, record.uniqueID);
        for (let j: number = 0; j < keys.length; j++) {
          if (data.hasOwnProperty(keys[j])) {
            data[keys[j]] = record[keys[j]];
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
          if (childRecords[count].hasChildRecords) {
            this.traverSelection(childRecords[count], checkboxState, true);
          } else {
            this.updateSelectedItems(childRecords[count], checkboxState);
          }
        }
      }
    }

    private getFilteredChildRecords(childRecords: ITreeData[]): ITreeData[] {
      let filteredChildRecords: ITreeData[] = childRecords.filter((e: ITreeData) => {
        return this.parent.filterModule.filteredResult.indexOf(e) > -1;
      });
      return filteredChildRecords;
    }

    private updateParentSelection(parentRecord: ITreeData): void {
      let length: number = 0; let childRecords: ITreeData[] = [];
      let record: ITreeData = getParentData(this.parent, parentRecord.uniqueID);
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
          let childRecord: ITreeData[] = this.parent.getCurrentViewRecords().filter((e: ITreeData) => {
            return e.uniqueID === childRecords[i].uniqueID;
          });
          let checkBoxRecord: ITreeData = isBlazor() ? childRecord[0] : childRecords[i];
          if (checkBoxRecord.checkboxState === 'indeterminate') {
            indeter++;
          } else if (checkBoxRecord.checkboxState === 'check') {
            checkChildRecords++;
          }
        }
        if (indeter > 0 || (checkChildRecords > 0 && checkChildRecords !== length)) {
          record.checkboxState = 'indeterminate';
        } else if (checkChildRecords === 0 && indeter === 0) {
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
      let data: ITreeData[] = (!isNullOrUndefined(this.parent.filterModule) &&
          this.parent.filterModule.filteredResult.length > 0) ? this.parent.filterModule.filteredResult :
        this.parent.flatData;
      if (!isNullOrUndefined(checkAll)) {
        for (let i: number = 0; i < data.length; i++) {
          if (checkAll) {
            if (data[i].checkboxState === 'check') {
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
      length = this.selectedItems.length;
      let checkbox: HTMLElement = <HTMLElement>this.parent.getHeaderContent().querySelectorAll('.e-frame')[0];
      if (length > 0 && data.length > 0) {
        if (length !== data.length) {
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

    private updateSelectedItems(currentRecord: ITreeData, checkState: string, filter?: boolean): void {
      let record: ITreeData[] = this.parent.getCurrentViewRecords().filter((e: ITreeData) => {
        return e.uniqueID === currentRecord.uniqueID;
      });
      let recordIndex: number = this.parent.getCurrentViewRecords().indexOf(record[0]);
      let checkboxRecord: ITreeData = isBlazor() ? record[0] : currentRecord;
      let checkbox: HTMLElement;
      if (recordIndex > -1) {
        let tr: HTMLElement = this.parent.getRows()[recordIndex];
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
      checkboxRecord.checkboxState = checkState;
      if (checkState === 'check' && isNullOrUndefined(currentRecord.isSummaryRow)) {
        if (recordIndex !== -1 && this.selectedIndexes.indexOf(recordIndex) === -1) {
          this.selectedIndexes.push(recordIndex);
        }
        if (this.selectedItems.indexOf(checkboxRecord) === -1 && (recordIndex !== -1 &&
          (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0))) {
          this.selectedItems.push(checkboxRecord);
        }
        if (this.selectedItems.indexOf(checkboxRecord) === -1 && (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length === 0)) {
          this.selectedItems.push(checkboxRecord);
        }
        if (this.selectedItems.indexOf(checkboxRecord) === -1 && isNullOrUndefined(this.parent.filterModule)) {
          this.selectedItems.push(checkboxRecord);
        }
      } else if ((checkState === 'uncheck' || checkState === 'indeterminate') && isNullOrUndefined(currentRecord.isSummaryRow)) {
        let index: number = this.selectedItems.indexOf(checkboxRecord);
        if (index !== -1) {
            this.selectedItems.splice(index, 1);
        }
        if (this.selectedIndexes.indexOf(recordIndex) !== -1) {
          let checkedIndex: number = this.selectedIndexes.indexOf(recordIndex);
          this.selectedIndexes.splice(checkedIndex, 1);
        }
      }
      let checkBoxclass: string = checkState ===  'indeterminate' ? 'e-stop' : 'e-' + checkState;
      if (recordIndex > -1) {
        if (!isNullOrUndefined(checkbox)) {
          checkbox.classList.add(checkBoxclass);
        }
      }
    }

    private updateGridActions(args: CellSaveEventArgs): void {
      let requestType: string = args.requestType; let childData: ITreeData[]; let childLength: number;
      if (this.parent.autoCheckHierarchy) {
        if ((requestType === 'sorting' || requestType === 'paging')) {
          childData = this.parent.getCurrentViewRecords();
          childLength = childData.length;
          this.selectedIndexes = [];
          for (let i: number = 0; i < childLength; i++) {
            this.updateSelectedItems(childData[i], childData[i].checkboxState, true);
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
              let index: number = this.parent.flatData.indexOf(updatedData[i]);
              let checkedIndex: number = this.selectedIndexes.indexOf(index);
              this.selectedIndexes.splice(checkedIndex, 1);
              this.updateSelectedItems(updatedData[i], 'uncheck');
            }
            if (!isNullOrUndefined(updatedData[i].parentItem)) {
              this.updateParentSelection(updatedData[i].parentItem);
            }
          }
        } else if (args.requestType === 'add' && this.parent.autoCheckHierarchy) {
          (<ITreeData>args.data).checkboxState = 'uncheck';
        } else if (requestType === 'filtering' || requestType === 'searching' || requestType === 'refresh') {
          this.selectedItems = []; this.selectedIndexes = [];
          childData = (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0) ?
            this.parent.getCurrentViewRecords() : this.parent.flatData;
          childData.forEach((record: ITreeData) => {
            if (record.hasChildRecords) {
              this.updateParentSelection(record);
            } else {
              this.updateSelectedItems(record, record.checkboxState);
            }
          });
          this.headerSelection();
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