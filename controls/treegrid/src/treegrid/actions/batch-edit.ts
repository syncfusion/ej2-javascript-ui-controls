import { ITreeData } from '../base/interface';
import { isNullOrUndefined, extend, setValue, getValue, merge } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base';
import * as events from '../base/constant';
import { DataManager } from '@syncfusion/ej2-data';
import { findChildrenRecords, getParentData, extendArray } from '../utils';
import { BeforeBatchSaveArgs, BeforeBatchDeleteArgs, getUid, CellSaveArgs } from '@syncfusion/ej2-grids';
import { BatchAddArgs, BeforeBatchAddArgs, SaveEventArgs } from '@syncfusion/ej2-grids';
import { updateParentRow, editAction } from './crud-actions';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';

/**
 * `BatchEdit` module is used to handle batch editing actions.
 * @hidden
 */
export class BatchEdit {
    private parent: TreeGrid;
    private isSelfReference: boolean;
    private addRowRecord: ITreeData;
    private batchChildCount: number = 0;
    private addedRecords: string = 'addedRecords';
    private deletedRecords: string = 'deletedRecords';
    private matrix: Object[];
    private batchRecords: Object[];
    private currentViewRecords: Object[];
    private batchAddedRecords: Object[] = [];
    private batchDeletedRecords: Object[] = [];
    private batchIndex: number;
    private batchAddRowRecord: Object[] = [];
    private isAdd: boolean;
    private newBatchRowAdded: boolean;
    private selectedIndex: number;
    private addRowIndex: number;

    constructor(parent: TreeGrid) {
      this.parent = parent;
      this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
      this.batchRecords = [];
      this.currentViewRecords = [];
      this.isAdd = false;
      this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on(events.cellSaved, this.cellSaved, this);
        this.parent.on(events.batchAdd, this.batchAdd, this);
        this.parent.on(events.beforeBatchAdd, this.beforeBatchAdd, this);
        this.parent.on(events.batchSave, this.batchSave, this);
        this.parent.on(events.beforeBatchDelete, this.beforeBatchDelete, this);
        this.parent.on(events.beforeBatchSave, this.beforeBatchSave, this);
        this.parent.on('batchPageAction', this.batchPageAction, this);
        this.parent.on('batchCancelAction', this.batchCancelAction, this);
    }
      /**
       * @hidden
       */
      public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.cellSaved, this.cellSaved);
        this.parent.off(events.batchAdd, this.batchAdd);
        this.parent.off(events.batchSave, this.batchSave);
        this.parent.off(events.beforeBatchAdd, this.beforeBatchAdd);
        this.parent.off(events.beforeBatchDelete, this.beforeBatchDelete);
        this.parent.off(events.beforeBatchSave, this.beforeBatchSave);
        this.parent.off('batchPageAction', this.batchPageAction);
        this.parent.off('batchCancelAction', this.batchCancelAction);
      }
      /**
       * To destroy the editModule 
       * @return {void}
       * @hidden
       */
      public destroy(): void {
        this.removeEventListener();
      }
      /**
       * @hidden
       */
      public getBatchRecords(): Object[] {
        return this.batchRecords;
      }
      /**
       * @hidden
       */
      public getAddRowIndex(): number {
        return this.addRowIndex;
      }
      /**
       * @hidden
       */
      public getSelectedIndex(): number {
        return this.selectedIndex;
      }
      /**
       * @hidden
       */
      public getBatchChildCount(): number {
        return this.batchChildCount;
      }
      private batchPageAction(): void {
        let data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
          this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        let primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let index: number;
        if (!isNullOrUndefined(this.batchAddedRecords) && this.batchAddedRecords.length) {
          for (let i: number = 0; i < this.batchAddedRecords.length; i++) {
            index = data.map((e: Object) => { return e[primaryKey]; }).indexOf(this.batchAddedRecords[i][primaryKey]);
            data.splice(index, 1);
          }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.batchDeletedRecords = this.currentViewRecords = [];
      }
      private cellSaved(args: CellSaveArgs): void {
        let actualCellIndex: number = (<HTMLTableCellElement>args.cell).cellIndex;
        let frozenCols: number = this.parent.frozenColumns || this.parent.getFrozenColumns();
        if (frozenCols && args.columnObject.index > frozenCols) {
          actualCellIndex = actualCellIndex + frozenCols;
        }
        if (actualCellIndex === this.parent.treeColumnIndex) {
          this.parent.renderModule.cellRender({ data: args.rowData, cell: args.cell,
            column: this.parent.grid.getColumnByIndex((<HTMLTableCellElement>args.cell).cellIndex)
          });
        }
        if (this.isAdd && this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.newRowPosition !== 'Bottom') {
            let data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
                                     this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            let added: ITreeData; let level: string = 'level'; let expanded: string = 'expanded';
            let primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0]; let currentDataIndex: number;
            let parentRecord: ITreeData; let indexvalue: number; let index: string = 'index';
            let parentItem: string = 'parentItem'; let uniqueID: string = 'uniqueID';
            parentRecord = this.selectedIndex > -1 ?  this.batchRecords[this.addRowIndex][parentItem] : null;
            let idMapping: Object; let parentUniqueID: string; let parentIdMapping: string;
            let rowObjectIndex: number = this.parent.editSettings.newRowPosition === 'Top' || this.selectedIndex === -1 ? 0 :
                                         this.parent.editSettings.newRowPosition === 'Above' ? this.addRowIndex
                                         : this.addRowIndex + 1;
            rowObjectIndex = this.getActualRowObjectIndex(rowObjectIndex);
            if (this.newBatchRowAdded) {
              if (this.batchRecords.length) {
                idMapping = this.batchRecords[this.addRowIndex][this.parent.idMapping];
                parentIdMapping = this.batchRecords[this.addRowIndex][this.parent.parentIdMapping];
                if (this.batchRecords[this.addRowIndex][parentItem]) {
                    parentUniqueID = this.batchRecords[this.addRowIndex][parentItem][uniqueID];
                }
              }
              this.batchAddedRecords = extendArray(this.batchAddedRecords);
              this.batchAddRowRecord = extendArray(this.batchAddRowRecord);
              this.batchAddRowRecord.push(this.batchRecords[this.addRowIndex]);
              added = this.parent.grid.getRowsObject()[rowObjectIndex].changes;
              added.uniqueID = getUid(this.parent.element.id + '_data_');
              setValue('uniqueIDCollection.' +  added.uniqueID , added, this.parent);
              if (!added.hasOwnProperty('level')) {
                  this.batchIndex = this.selectedIndex === -1 ? 0 : this.batchIndex;
                  if (this.parent.editSettings.newRowPosition === 'Child') {
                      added.primaryParent = parentRecord;
                      if (this.selectedIndex > -1) {
                          added.parentItem = extend({}, this.batchRecords[this.addRowIndex]);
                          added.parentUniqueID = added.parentItem.uniqueID;
                          delete added.parentItem.childRecords; delete added.parentItem[this.parent.childMapping];
                          added.level = added.parentItem.level + 1; added.index =  this.batchIndex;
                          let childRecordCount: number = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                          let record: ITreeData = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                          record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                          currentDataIndex = data.map((e: Object) => { return e[primaryKey]; }).indexOf(record[primaryKey]);
                          if (this.isSelfReference) {
                              added[this.parent.parentIdMapping] = idMapping;
                          }
                          updateParentRow(primaryKey, added.parentItem, 'add', this.parent, this.isSelfReference, added);
                      }
                  } else if ((this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below')
                                && !isNullOrUndefined(this.batchRecords[this.addRowIndex])) {
                    added.level = this.batchRecords[this.addRowIndex][level];
                    if (added.level && this.selectedIndex > -1) {
                      added.parentItem = parentRecord; added.parentUniqueID = parentUniqueID;
                      delete added.parentItem.childRecords; delete added.parentItem[this.parent.childMapping];
                    }
                    added.index = this.parent.editSettings.newRowPosition === 'Below' ? this.batchIndex : this.batchIndex - 1;
                    if (this.parent.editSettings.newRowPosition === 'Below' && this.selectedIndex > -1) {
                            let childRecordCount: number = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                            let record: ITreeData = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                            record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                            currentDataIndex = data.map((e: Object) => { return e[primaryKey]; }).indexOf(record[primaryKey]);
                    }
                    if (this.parent.editSettings.newRowPosition === 'Above' && this.selectedIndex > -1) {
                            let record: ITreeData = this.batchRecords[this.addRowIndex];
                            currentDataIndex = data.map((e: Object) => { return e[primaryKey]; }).indexOf(record[primaryKey]);
                    }
                    if (this.isSelfReference) {
                        added[this.parent.parentIdMapping]  = parentIdMapping;
                    }
                  }
                  added.index = added.index === -1 ? 0 : added.index;
                  added.hasChildRecords = false; added.childRecords = [];
                  this.batchRecords.splice(added.index, 0, added);
                  this.currentViewRecords.splice(added.index, 0, added);
                  if (currentDataIndex) {
                      indexvalue = currentDataIndex;
                  } else { indexvalue = added.index; }
                  if (this.parent.editSettings.newRowPosition !== 'Above') {
                    indexvalue = added.index === 0 ? indexvalue : indexvalue + 1;
                  }
                  data.splice(indexvalue, 0, added);
                  this.batchAddedRecords.push(added);
              }
              this.parent.grid.getRowsObject()[rowObjectIndex].data = added;
              this.newBatchRowAdded = false;
            }
            if (this.parent.frozenColumns || this.parent.getFrozenColumns()
                && this.parent.grid.getRowsObject()[rowObjectIndex].edit === 'add') {
              merge(this.currentViewRecords[rowObjectIndex], this.parent.grid.getRowsObject()[rowObjectIndex].changes);
            }
          }
      }

      private beforeBatchAdd(e: BeforeBatchAddArgs): void {
        let isTabLastRow: string = 'isTabLastRow';
        if (this.parent.editSettings.mode === 'Cell' && this.parent.editModule[isTabLastRow]) {
          e.cancel = true;
          this.parent.editModule[isTabLastRow] = false;
          return;
        }
        this.selectedIndex = this.parent.grid.selectedRowIndex;
        this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
        this.addRowRecord = this.parent.getSelectedRecords()[0];
      }

      private batchAdd(e: BatchAddArgs): void {
        if (this.parent.editSettings.newRowPosition !== 'Bottom') {
        this.isAdd = true; this.newBatchRowAdded = true; let actualIndex: number = 0;
        if (!this.batchRecords.length) {
             this.batchAddedRecords = [];
             this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
             this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        }
        if (this.parent.editSettings.newRowPosition !== 'Top') {
          let records: Object[] = this.parent.grid.getCurrentViewRecords();
          if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
              || this.parent.getBatchChanges()[this.deletedRecords].length)) {
              records = this.batchRecords;
          }
          this.updateChildCount(records);
          this.parent.notify(events.beginAdd, {});
          this.batchChildCount = 0;
        }
        this.updateRowIndex();
        // update focus module, need to refix this once grid source modified.
        let focusModule: FocusStrategy = getValue('focusModule', this.parent.grid);
        let table: Element = this.parent.getContentTable();
        if (this.parent.getBatchChanges()[this.deletedRecords].length && this.parent.editSettings.newRowPosition === 'Above') {
            actualIndex = (e.row as HTMLTableRowElement).rowIndex;
            focusModule.getContent().matrix.matrix = this.matrix as number[][];
        } else {
            actualIndex = (table.getElementsByClassName('e-batchrow')[0] as HTMLTableRowElement).rowIndex;
            // if (this.parent.frozenRows || this.parent.frozenColumns) {
            //   actualIndex = this.batchIndex;
            // }
        }
        focusModule.getContent().matrix.current = [actualIndex, focusModule.getContent().matrix.current[1]];
        }
      }
      private beforeBatchDelete(e: BeforeBatchDeleteArgs): void {
        if (!this.batchRecords.length) {
          this.batchRecords  = extendArray(this.parent.grid.getCurrentViewRecords());
          this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        }
        let focusModule: FocusStrategy = getValue('focusModule', this.parent.grid);
        this.matrix = focusModule.getContent().matrix.matrix;
        this.parent = this.parent; let row: Element[] = []; let records: ITreeData[];
        let data: ITreeData; let primarykey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        data = this.parent.grid.getSelectedRecords()[this.parent.grid.getSelectedRecords().length - 1];
        let childs: ITreeData[] = findChildrenRecords(data);
        if (childs.length) {
          for (let i: number = 0; i < childs.length; i++) {
                let index: number = this.parent.grid.getRowIndexByPrimaryKey(childs[i][primarykey]);
                row.push(this.parent.grid.getRows()[index] as Element);
                if (this.parent.frozenRows || this.parent.frozenColumns || this.parent.getFrozenColumns()) {
                  row.push(this.parent.grid.getMovableRows()[index] as Element);
                }
          }
        }
        if (!isNullOrUndefined(data.parentItem)) {
              let parentItem: ITreeData = getParentData(this.parent, data.parentItem.uniqueID);
              if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                  let childIndex: number = parentItem.childRecords.indexOf(data);
                  parentItem.childRecords.splice(childIndex, 1);
              }
              this.batchDeletedRecords = extendArray(this.batchDeletedRecords);
              this.batchDeletedRecords.push(data);
        }
        childs.push(data);
        records = childs;
        for (let i: number = 0; i < records.length; i++) {
            let indexvalue: number = this.batchRecords.map((e: Object) => { return e[primarykey]; }).indexOf(records[i][primarykey]);
            if (indexvalue !== -1) {
              this.batchRecords.splice(indexvalue , 1);
            }
        }
        for (let i: number = 0; i < row.length; i++) {
            if (!isNullOrUndefined(row[i])) {
              this.parent.grid.selectionModule.selectedRecords.push(row[i]);
        }
      }
    }
      private updateRowIndex(): void {
        let rows: Element[] = this.parent.grid.getDataRows();
        for (let i: number = 0 ; i < rows.length; i++) {
          rows[i].setAttribute('aria-rowindex', i.toString());
        }
        if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
          let mRows: Element[] = this.parent.grid.getMovableDataRows();
          for (let i: number = 0 ; i < mRows.length; i++) {
            mRows[i].setAttribute('aria-rowindex', i.toString());
          }
        }
      }
      private updateChildCount(records: Object[]): void {
        let primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let addedRecords: string = 'addedRecords'; let deletedRecords: string = 'deletedRecords';
        let parentItem: string = this.parent.editSettings.newRowPosition === 'Child' ? 'primaryParent' : 'parentItem';
        for (let i: number = 0; i < this.parent.getBatchChanges()[addedRecords].length; i++ ) {
            if (!isNullOrUndefined(this.parent.getBatchChanges()[addedRecords][i][parentItem])) {
                if (this.parent.getBatchChanges()[addedRecords][i][parentItem][primaryKey] === records[this.addRowIndex][primaryKey]) {
                    this.batchChildCount = this.batchChildCount + 1;
                }
            }
        }
      }

    private beforeBatchSave(e: BeforeBatchSaveArgs): void {
         let changeRecords: string = 'changedRecords'; let deleterecords: string = 'deletedRecords';
         let changedRecords: ITreeData[] = e.batchChanges[changeRecords];
         if (e.batchChanges[changeRecords].length) {
              let columnName: string;
              for (let i: number = 0; i < changedRecords.length; i++) {
                    editAction({ value: <ITreeData>changedRecords[i], action: 'edit' }, this.parent,
                               this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName);
              }
         }
         if (e.batchChanges[deleterecords].length) {
              let deletedRecords: ITreeData[] = e.batchChanges[deleterecords];
              let record: ITreeData[] = deletedRecords;
              for (let i: number = 0; i < record.length; i++) {
                   this.deleteUniqueID(record[i].uniqueID);
                   let childs: ITreeData[] = findChildrenRecords(record[i]);
                   for (let c: number = 0; c < childs.length; c++) {
                       this.deleteUniqueID(childs[c].uniqueID);
                   }
                   e.batchChanges[deleterecords] = [...e.batchChanges[deleterecords], ...childs];
              }
          }
         this.isAdd = false;
    }
      private deleteUniqueID( value: string) : void {
        let idFilter: string = 'uniqueIDFilterCollection';
        delete this.parent[idFilter][value];
        let id: string = 'uniqueIDCollection';
        delete this.parent[id][value];
      }

  private batchCancelAction() : void {
    let targetElement: string = 'targetElement'; let index: number; let parentItem: string = 'parentItem';
    let indexvalue: string = 'index';
    let currentViewRecords: Object[] = this.parent.grid.getCurrentViewRecords(); let childRecords: string = 'childRecords';
    let data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
      this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
    let primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
    if (!isNullOrUndefined(this.parent[targetElement])) {
      let row: HTMLTableRowElement = this.parent[targetElement].closest('tr');
      this.parent.collapseRow(row);
      this.parent[targetElement] = null;
    }
    if (!isNullOrUndefined(this.batchAddedRecords)) {
      for (let i: number = 0; i < this.batchAddedRecords.length; i++) {
        index = data.map((e: Object) => { return e[primaryKey]; }).indexOf(this.batchAddedRecords[i][primaryKey]);
        data.splice(index, 1);
        if (this.parent.editSettings.newRowPosition === 'Child') {
          index = currentViewRecords.map((e: Object) => { return e[primaryKey]; })
                  .indexOf(this.batchAddedRecords[i][parentItem] ? this.batchAddedRecords[i][parentItem][primaryKey]
                   : this.batchAddedRecords[i][primaryKey]);
          if (!isNullOrUndefined(currentViewRecords[index])) {
            let children: Object[] = currentViewRecords[index][childRecords];
            for (let j: number = 0; children && j < children.length; j++) {
              if (children[j][primaryKey] === this.batchAddedRecords[i][primaryKey]) {
                currentViewRecords[index][childRecords].splice(j, 1);
              }
            }
          }
        }
      }
    }
    if (!isNullOrUndefined(this.batchDeletedRecords)) {
      for (let i: number = 0; i < this.batchDeletedRecords.length; i++) {
        if (!isNullOrUndefined(this.batchDeletedRecords[i][parentItem])) {
          index = currentViewRecords.map((e: Object) => { return e[primaryKey]; })
                  .indexOf(this.batchDeletedRecords[i][parentItem][primaryKey]);
          let positionIndex: number = this.batchDeletedRecords[i][indexvalue] === 0 ? this.batchDeletedRecords[i][indexvalue] :
                                      this.batchDeletedRecords[i][indexvalue] - 1;
          if (!isNullOrUndefined(currentViewRecords[index])) {
            currentViewRecords[index][childRecords].splice(positionIndex, 0, this.batchDeletedRecords[i]);
          }
        }
      }
    }
    this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.currentViewRecords = [];
    this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords()); this.batchIndex = 0;
    this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
    this.batchDeletedRecords = [];
    this.parent.grid.renderModule.refresh();
  }

private batchSave(args: SaveEventArgs): void {
  if (this.parent.editSettings.mode === 'Batch') {
    let i: number; let batchChanges: Object = this.parent.getBatchChanges(); let deletedRecords: string = 'deletedRecords';
    let addedRecords: string = 'addedRecords'; let index: string = 'index'; let uniqueID: string = 'uniqueID';
    let data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
                                    this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
    let currentViewRecords: Object[] = this.parent.grid.getCurrentViewRecords();
    let primarykey: string = this.parent.grid.getPrimaryKeyFieldNames()[0]; let level: string = 'level';
    let addRecords: ITreeData[] = batchChanges[addedRecords]; let parentItem: string = 'parentItem';
    let selectedIndex: number; let addRowIndex: number; let columnName: string;
    let addRowRecord: ITreeData; let childRecords: string = 'childRecords';
    if (addRecords.length > 1 && this.parent.editSettings.newRowPosition !== 'Bottom') {
        addRecords.reverse();
    }
    if (this.parent.editSettings.newRowPosition !== 'Bottom') {
        data.splice(data.length - addRecords.length, addRecords.length);
        if (!this.parent.allowPaging ) {
             if (currentViewRecords.length > addRecords.length) {
              currentViewRecords.splice(currentViewRecords.length - addRecords.length, addRecords.length);
             }
        } else {
          let totalRecords: Object[] = extendArray(data);
          let startIndex: number = totalRecords.map((e: Object) => { return e[primarykey]; })
                                   .indexOf(currentViewRecords[0][primarykey]);
          let endIndex: number = startIndex + this.parent.grid.pageSettings.pageSize;
          currentViewRecords = totalRecords.splice(startIndex, endIndex);
        }
    }
    for (i = 0; i < addRecords.length; i++) {
        let taskData: ITreeData = extend({}, addRecords[i]);
        delete taskData.parentItem; delete taskData.uniqueID; delete taskData.index; delete taskData.level;
        delete taskData.hasChildRecords; delete taskData.childRecords; delete taskData.parentUniqueID;
        if (!isNullOrUndefined(taskData.primaryParent)) {
            delete taskData.primaryParent;
        }
        addRecords[i].taskData = taskData;
        addRowRecord = this.batchAddRowRecord[i];
        if (isNullOrUndefined(addRowRecord)) {
            addRowRecord = this.batchAddRowRecord[i - 1];
        }
        if (this.isSelfReference) {
          if (!isNullOrUndefined(addRecords[i].parentItem)) {
               updateParentRow(primarykey, addRecords[i].parentItem, 'add', this.parent, this.isSelfReference, addRecords[i]);
          }
        }
        if (!isNullOrUndefined(addRowRecord)) {
            addRowIndex = addRowRecord.index;
        }
        if (this.parent.editSettings.newRowPosition !== 'Top' && this.parent.editSettings.newRowPosition !== 'Bottom') {
             if (isNullOrUndefined(addRecords[i].parentItem) && this.selectedIndex === -1) {
               selectedIndex = -1;
               addRowRecord = null;
             }
        }
        editAction({ value: addRecords[i], action: 'add' }, this.parent,
                   this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
        selectedIndex = null;
        if (this.parent.editSettings.newRowPosition === 'Child' && !isNullOrUndefined(addRecords[i][parentItem])) {
          let indexValue: number = currentViewRecords.map((e: Object) => { return e[primarykey]; })
                  .indexOf(addRecords[i][parentItem][primarykey]);
          let children: Object[] = currentViewRecords[indexValue][childRecords];
          for (let j: number = 0; j < children.length; j++) {
            if (children[j][primarykey] === addRecords[i][primarykey]) {
              currentViewRecords[indexValue][childRecords].splice(j, 1);
            }
          }
        }
    }
    if (batchChanges[deletedRecords].length) {
      for (i = 0; i < batchChanges[deletedRecords].length; i++) {
          editAction({ value: batchChanges[deletedRecords][i], action: 'delete' }, this.parent,
                     this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
      }
    }
    this.parent.parentData = [];
    for (let i: number = 0; i < data.length; i++) {
          data[i][index] = i;
          setValue('uniqueIDCollection.' + data[i][uniqueID] + '.index', i, this.parent);
          if (!data[i][level]) {
              this.parent.parentData.push(data[i]);
          }
    }
  }
  this.batchAddRowRecord = this.batchAddedRecords = this.batchRecords =  this.batchDeletedRecords = this.currentViewRecords = [];
}

private getActualRowObjectIndex(index: number): number {
  let rows: Element[] =  this.parent.grid.getDataRows();
  if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                && this.selectedIndex > -1) {
            if (!isNullOrUndefined(this.batchRecords[this.addRowIndex]) && (this.batchRecords[this.addRowIndex] as ITreeData).expanded) {
                if (this.parent.getBatchChanges()[this.addedRecords].length > 1
                    || this.parent.getBatchChanges()[this.deletedRecords].length) {
                      index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                      if (this.parent.editSettings.newRowPosition !== 'Child') {
                        let batchChildCount: number = this.getBatchChildCount();
                        index = index + batchChildCount;
                      }
                } else {
                  index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                }
              }
            if (index >= rows.length) {
              index = rows.length - 1;
            }
            this.updateChildCount(this.parent.grid.getCurrentViewRecords());
            if (this.batchChildCount) {
              index += this.batchChildCount;
            }
            this.batchChildCount = 0;
          }
  return index;
}

}



