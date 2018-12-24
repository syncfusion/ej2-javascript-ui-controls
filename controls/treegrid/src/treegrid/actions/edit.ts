import { Grid, Edit as GridEdit, SaveEventArgs, CellSaveArgs, CellEditArgs, getUid} from '@syncfusion/ej2-grids';
import { BatchCancelArgs, Column, RecordDoubleClickEventArgs } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base/treegrid';
import { ITreeData } from '../base/interface';
import * as events from '../base/constant';
import { isNullOrUndefined, extend, setValue, removeClass, KeyboardEventArgs, TouchEventArgs } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { findChildrenRecords } from '../utils';
import { getPlainData, extendArray } from '../utils';

/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
export class Edit {
    private parent: TreeGrid;
    private isSelfReference: boolean;
    private addRowIndex: number;
    private isOnBatch: boolean;
    private keyPress: string;
    // private editedData: ITreeData;
    // private addedData: ITreeData;
    // private addedIndex: number;
    // private changedRecords: string = 'changedRecords';
    // private addedRecords: string = 'addedRecords';
    // private deletedRecords: string = 'deletedRecords';
    // private batchDeleted: Object;
    // private batchRecords: Object[];
    // private isAdd: boolean;
    // private batchChanges: Object;
    private selectedIndex: number;
    private doubleClickTarget: Element;
    /**
     * Constructor for Edit module
     */
    constructor(parent: TreeGrid) {
        Grid.Inject(GridEdit);
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        // this.batchDeleted = {};
        // this.batchRecords = [];
        // this.isAdd = false;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'edit';
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(events.crudAction, this.editAction, this);
        this.parent.on(events.beginEdit, this.beginEdit, this);
        this.parent.on(events.beginAdd, this.beginAdd, this);
        this.parent.on(events.recordDoubleClick, this.recordDoubleClick, this);
        this.parent.on(events.cellSave, this.cellSave, this);
        this.parent.on(events.batchCancel, this.batchCancel, this);
        this.parent.grid.on(events.keyPressed, this.keyPressed, this);
        this.parent.on(events.cellEdit, this.cellEdit, this);
        this.parent.grid.on(events.doubleTap, this.recordDoubleClick, this);
        // this.parent.on(events.beforeDataBound, this.beforeDataBound, this);
        // this.parent.on(events.cellSaved, this.cellSaved, this);
        // this.parent.on(events.batchDelete, this.batchDelete, this);
        // this.parent.on(events.batchAdd, this.batchAdd, this);
        // this.parent.on(events.beforeBatchAdd, this.beforeBatchAdd, this);
        // this.parent.on(events.beforeBatchSave, this.beforeBatchSave, this);
        // this.parent.on(events.batchSave, this.batchSave, this);
      }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.crudAction, this.editAction);
        this.parent.off(events.beginEdit, this.beginEdit);
        this.parent.off(events.beginAdd, this.beginAdd);
        this.parent.off(events.recordDoubleClick, this.recordDoubleClick);
        this.parent.off(events.cellSave, this.cellSave);
        this.parent.off(events.batchCancel, this.batchCancel);
        this.parent.grid.off(events.keyPressed, this.keyPressed);
        this.parent.off(events.cellEdit, this.cellEdit);
        this.parent.grid.off(events.doubleTap, this.recordDoubleClick);
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
    public applyFormValidation(cols?: Column[]): void {
      this.parent.grid.editModule.applyFormValidation(cols);
    }
    private recordDoubleClick(args: RecordDoubleClickEventArgs | TouchEventArgs): void {
      let target: HTMLElement = <HTMLElement>args.target;
      this.doubleClickTarget = target;
      let column: Column = this.parent.grid.getColumnByIndex(+target.closest('td').getAttribute('aria-colindex'));
      if (this.parent.editSettings.mode === 'Cell' && !this.isOnBatch && column && !column.isPrimaryKey &&
        column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
                 target.classList.contains('e-treegridcollapse'))) {
        this.isOnBatch = true;
        this.parent.grid.editSettings.mode = 'Batch';
        this.parent.grid.dataBind();
      }
    }
  private keyPressed(args: KeyboardEventArgs): void {
    if (this.isOnBatch) {
      this.keyPress = args.action;
    }
  }
  private cellEdit(args: CellEditArgs): void {
    if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
               this.doubleClickTarget.classList.contains('e-treegridcollapse'))) {
      args.cancel = true; this.doubleClickTarget = null;
      return;
    }
    if (this.parent.editSettings.mode === 'Cell') {
      if (this.keyPress === 'tab' || this.keyPress === 'shiftTab') {
        this.keyPress = null;
      } else if (this.keyPress === 'enter') {
        args.cancel = true;
        this.keyPress = null;
      }
      this.enableToolbarItems();
    }
    // if (this.isAdd && this.parent.editSettings.mode === 'Batch' && !args.cell.parentElement.classList.contains('e-insertedrow')) {
    //   this.isAdd = false;
    // }
  }

  private enableToolbarItems(): void {
    if (!isNullOrUndefined(this.parent.grid.toolbarModule)) {
      let toolbarID: string = this.parent.element.id  + '_gridcontrol_';
      this.parent.grid.toolbarModule.enableItems([toolbarID + 'add', toolbarID + 'edit', toolbarID + 'delete'], false);
      this.parent.grid.toolbarModule.enableItems([toolbarID + 'update', toolbarID + 'cancel'], true);
    }
  }

  private batchCancel(e: BatchCancelArgs): void {
    if (this.parent.editSettings.mode === 'Cell') {
      this.parent.renderModule.cellRender({
            data: this.parent.grid.getSelectedRecords()[0],
            cell: (<HTMLTableRowElement>this.parent.grid.getSelectedRows()[0]).cells[this.parent.treeColumnIndex],
            column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
          });
      this.parent.grid.editSettings.mode = 'Normal';
      this.parent.grid.dataBind();
      this.isOnBatch = false;
    }
    // this.batchRecords = [];
    // let keys: string[] = Object.keys(this.batchDeleted);
    // let primaryLey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
    // let currentViewRecords: ITreeData[] = this.parent.grid.getCurrentViewRecords();
    // for (let i: number = 0; i < keys.length; i++) {
    //   let index: number;
    //   currentViewRecords.map((e: ITreeData, j: number) => {
    //     if (this.batchDeleted.hasOwnProperty(keys[i]) && e[primaryLey] === this.batchDeleted[keys[i]][primaryLey]) {
    //       index = j; return;
    //     }
    //   });
    //   this.parent.renderModule.cellRender({
    //     data: currentViewRecords[index],
    //     cell: (<HTMLTableRowElement>this.parent.getRowByIndex(index)).cells[this.parent.treeColumnIndex],
    //     column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
    //   });
    // }
  }
    private cellSave(args: CellSaveArgs): void {
      if (this.parent.editSettings.mode === 'Cell') {
          args.cancel = true;
          if (this.keyPress !== 'tab' && this.keyPress !== 'shiftTab') {
            this.parent.grid.closeEdit();
            this.isOnBatch = false;
          }
          setValue('isEdit', false, this.parent.grid);
          args.rowData[args.columnName] = args.value;
          let row: HTMLTableRowElement = <HTMLTableRowElement>args.cell.parentNode;
          let rowIndex: number;
          if (isNullOrUndefined(row)) {
            let key: string = this.parent.getPrimaryKeyFieldNames()[0];
            this.parent.grid.getCurrentViewRecords().filter((e: ITreeData, i: number) => {
                 if (e[key] === args.rowData[key]) { rowIndex = i; return; }
                });
          } else {
            rowIndex = row.rowIndex;
          }
          this.parent.cellEditedColumn = args.columnName;
          row = <HTMLTableRowElement>this.parent.grid.getRows()[rowIndex];
          this.parent.grid.editModule.updateRow(rowIndex, args.rowData);
          this.enableToolbarItems();
          this.parent.grid.editModule.formObj.destroy();
          if (this.keyPress !== 'tab' && this.keyPress !== 'shiftTab') {
            this.parent.grid.editSettings.mode = 'Normal';
            this.parent.grid.dataBind();
          }
          removeClass([row], ['e-editedrow', 'e-batchrow']);
          removeClass(row.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
          this.editAction({ value: <ITreeData>args.rowData, action: 'edit' });
      }
    }
    private beginAdd(args?: SaveEventArgs): void {
      let position: string;
      let index: number = this.addRowIndex;
      let records: Object[] = this.parent.grid.getCurrentViewRecords();
      let rows: Element[] = this.parent.grid.getDataRows();
      if (this.parent.editSettings.mode !== 'Dialog') {
        if (this.parent.editSettings.newRowPosition === 'Child' && !((<ITreeData>records[index]).expanded)) {
          this.parent.expandRow(<HTMLTableRowElement>rows[index + 1], records[index]);
        }
        if (this.parent.editSettings.newRowPosition === 'Above') {
          position = 'before';
        } else if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
          && this.selectedIndex > -1) {
          position = 'after';
          // let records: Object[] = this.batchRecords.length ? this.batchRecords : this.parent.grid.getCurrentViewRecords();
          index += findChildrenRecords(records[index]).length;
        }
        if (this.selectedIndex > -1 && (index || (this.parent.editSettings.newRowPosition === 'Child'
          || this.parent.editSettings.newRowPosition === 'Below'))) {
          if (index >= rows.length) {
            index = rows.length - 2;
          }
          let focussedElement: HTMLInputElement = <HTMLInputElement>document.activeElement;
          rows[index + 1][position](rows[0]);
          if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
            let errors: NodeListOf<Element> = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
            for (let i: number = 0; i < errors.length; i++) {
              errors[i].remove();
            }
            setValue('errorRules', [], this.parent.grid.editModule.formObj);
          }
          focussedElement.focus();
        }
      }
    }
    // private beforeDataBound(args: BeforeDataBoundArgs): void {
    //   if (this.parent.grid.isEdit && this.parent.dataSource instanceof DataManager &&
    //         this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor) {
    //     let action: string = getValue('action', args);
    //     let data: Object = getValue('data', args);
    //     if (action === 'edit' && !isNullOrUndefined(this.editedData)) {
    //       data = extend(this.editedData, data);
    //       this.editedData = null;
    //     }
    //     if (!isNullOrUndefined(this.addedData)) {
    //       let addedData: Object = args.result[args.result.length - 1];
    //       addedData = extend(this.addedData, addedData);
    //       this.addedData = null;
    //       args.result.splice(this.addedIndex, 0, addedData);
    //       args.result.splice(args.result.length, 1);
    //     }
    //   }
    // }
    private beginEdit(args: SaveEventArgs): void {
        if (args.requestType === 'refresh' && this.isOnBatch) {
          args.cancel = true; return;
        }
        if (this.parent.editSettings.mode === 'Cell' && args.requestType === 'beginEdit') {
          args.cancel = true; return;
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
        this.doubleClickTarget.classList.contains('e-treegridcollapse'))) {
          args.cancel = true; this.doubleClickTarget = null;
          return;
        }
        if (args.requestType === 'delete') {
            let data: ITreeData[] = <ITreeData[]>args.data;
            for (let i: number = 0; i < data.length; i++) {
                args.data = [...data, ...findChildrenRecords(data[i])];
            }
        }
        if (args.requestType === 'add') {
            this.selectedIndex = this.parent.grid.selectedRowIndex;
            this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
        }
        args = this.beginAddEdit(args);
        // if (args.requestType === 'save' &&
        //    ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor))) {
        //      if (args.action === 'edit') {
        //           this.editedData = args.data;
        //      } else if (args.action === 'add') {
        //           this.addedData = value;
        //      }

        // }
    }
    private beginAddEdit(args: SaveEventArgs): SaveEventArgs {
      let value: ITreeData = args.data;
      if (args.action === 'add') {
          let key: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
          let position: string = null;
          // let currentData: ITreeData[] = this.batchRecords.length ? this.batchRecords :
          //            <ITreeData[]>this.parent.grid.getCurrentViewRecords();
          let currentData: ITreeData[] = <ITreeData[]>this.parent.grid.getCurrentViewRecords();
          let index: number =  this.addRowIndex;
          value.uniqueID = getUid(this.parent.element.id + '_data_');
          let level: number; let dataIndex: number; let idMapping: Object; let parentIndex: number;
          let parentUniqueID: string; let parentItem: Object; let parentIdMapping: string;
          if (currentData.length) {
              level = currentData[this.addRowIndex].level;
              dataIndex = currentData[this.addRowIndex].index;
              idMapping = currentData[this.addRowIndex][this.parent.idMapping];
              parentIndex = currentData[this.addRowIndex].parentIndex;
              parentIdMapping = currentData[this.addRowIndex][this.parent.parentIdMapping];
              if (currentData[this.addRowIndex].parentItem) {
                parentUniqueID = currentData[this.addRowIndex].parentItem.uniqueID;
              }
              parentItem = currentData[this.addRowIndex].parentItem;
          }
          if (this.parent.editSettings.newRowPosition !== 'Top') {
              if (this.parent.editSettings.newRowPosition === 'Above') {
                  position = 'before';
              } else if (this.parent.editSettings.newRowPosition === 'Below') {
                  position = 'after';
                  index += findChildrenRecords(currentData[this.addRowIndex]).length;
              } else if (this.parent.editSettings.newRowPosition === 'Child') {
                  position = 'after';
                  if (this.selectedIndex > -1) {
                    value.parentIndex = dataIndex;
                    value.parentItem = extend({}, currentData[this.addRowIndex]);
                    value.parentUniqueID = value.parentItem.uniqueID;
                    delete value.parentItem.childRecords; delete value.parentItem[this.parent.childMapping];
                  }
                  index += findChildrenRecords(currentData[this.addRowIndex]).length;
                  value.level = level + 1;
                  if (this.isSelfReference) {
                      value[this.parent.parentIdMapping] = idMapping;
                      if (!isNullOrUndefined(value.parentIndex)) {
                        this.updateParentRow(key, value.parentItem, 'add', value);
                      }
                  }
              }
              if (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below') {
                if (this.selectedIndex > -1 && level) {
                  value.parentIndex = parentIndex;
                  value.parentUniqueID = parentUniqueID;
                  value.parentItem = extend({}, parentItem);
                  delete value.parentItem.childRecords; delete value.parentItem[this.parent.childMapping];
                }
                value.level = level;
                if (this.isSelfReference) {
                  value[this.parent.parentIdMapping] = parentIdMapping;
                  if (!isNullOrUndefined(value.parentIndex)) {
                    this.updateParentRow(key, value.parentItem, 'add', value);
                  }
              }
              }
              if (position != null && this.selectedIndex > -1) {
                  args.index = position === 'before' ? index : index + 1;
              }
              if (this.parent.editSettings.newRowPosition === 'Bottom') {
                let dataSource: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
                           this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
                args.index = dataSource.length;
              }
          }
          // this.addedIndex = args.index;
          value.hasChildRecords = false;
          value.childRecords = [];
          value.index = 0;
      }
      return args;
    }
    private addAction(details: {value: ITreeData, action: string}, treeData: Object[]): {value: Object, isSkip: boolean} {
        let value: Object; let isSkip: boolean = false;
        let currentViewRecords: ITreeData[] = <ITreeData[]>this.parent.grid.getCurrentViewRecords();
        value  = extend({}, details.value);
        value = getPlainData(value);
        switch (this.parent.editSettings.newRowPosition) {
          case 'Top':
            treeData.unshift(value);
            isSkip = true;
            break;
          case 'Bottom':
            treeData.push(value);
            isSkip = true;
            break;
          case 'Above':
              value = currentViewRecords[this.addRowIndex + 1];
              break;
          case 'Below':
          case 'Child':
            value = currentViewRecords[this.addRowIndex];
            if (this.selectedIndex === -1) {
              treeData.unshift(value);
              isSkip = true;
            }
        }
        return { value: value, isSkip: isSkip };
    }
    private editAction(details: {value: ITreeData, action: string}): void {
        let value: ITreeData = details.value;
        let action: string = details.action;
        if (action === 'save') {
          action = 'edit';
        }
        let i: number; let j: number;
        let key: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let treeData: ITreeData[] = this.parent.dataSource instanceof DataManager ?
                            this.parent.dataSource.dataSource.json : <Object[]>this.parent.dataSource;
        let modifiedData: object[] = [];
        let originalData: ITreeData = value;
        let isSkip: boolean = false;
        let currentViewRecords: ITreeData[] = <ITreeData[]>this.parent.grid.getCurrentViewRecords();
        if (action === 'add') {
          let addAct: {value: Object, isSkip: boolean} = this.addAction(details, treeData);
          value = addAct.value; isSkip = addAct.isSkip;
        }
        if (value instanceof Array) {
          modifiedData = extendArray(value);
        } else {
          modifiedData.push(extend({}, value));
        }
        if (!isSkip && (action !== 'add' ||
             (this.parent.editSettings.newRowPosition !== 'Top' && this.parent.editSettings.newRowPosition !== 'Bottom'))) {
        for (let k: number = 0; k < modifiedData.length; k++) {
          let keys: string[] = Object.keys(modifiedData[k]);
          i = treeData.length;
          while (i-- && i >= 0) {
            if (treeData[i][key] === modifiedData[k][key]) {
              if (action === 'delete') {
                let currentData: Object = treeData[i];
                treeData.splice(i, 1);
                if (this.isSelfReference) {
                  if (!isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
                    let parentData: ITreeData = this.parent.flatData.filter((e: ITreeData) =>
                      e[this.parent.idMapping] === currentData[this.parent.parentIdMapping])[0];
                    let childRecords: Object[] = parentData ? parentData[this.parent.childMapping] : [];
                    for (let p: number = childRecords.length - 1; p >= 0; p--) {
                      if (childRecords[p][this.parent.idMapping] === currentData[this.parent.idMapping]) {
                        childRecords.splice(p, 1);
                        if (!childRecords.length) {
                          parentData.hasChildRecords = false;
                          this.updateParentRow(key, parentData, action);
                        }
                        break;
                      }
                    }
                  }
                  break;
                }
              } else {
                if (action === 'edit') {
                  for (j = 0; j < keys.length; j++) {
                    if (treeData[i].hasOwnProperty(keys[j])) {
                      treeData[i][keys[j]] = modifiedData[k][keys[j]];
                    }
                  }
                } else if (action === 'add') {
                  let index: number ;
                  if (this.parent.editSettings.newRowPosition === 'Child') {
                    if (this.isSelfReference) {
                      originalData[this.parent.parentIdMapping] = treeData[i][this.parent.idMapping];
                      treeData.splice(i + 1, 0, originalData);
                    } else {
                        if (!(<Object>treeData[i]).hasOwnProperty(this.parent.childMapping)) {
                            treeData[i][this.parent.childMapping] = [];
                        }
                        treeData[i][this.parent.childMapping].push(originalData);
                        this.updateParentRow(key, treeData[i], action);
                    }
                  } else if (this.parent.editSettings.newRowPosition === 'Below') {
                    treeData.splice(i + 1, 0, originalData);
                  } else if (!this.addRowIndex) {
                      index = 0;
                      treeData.splice(index, 0, originalData);
                  } else if (this.parent.editSettings.newRowPosition === 'Above') {
                    treeData.splice(i, 0, originalData);
                  }
                }
                break;
              }
            } else if (!isNullOrUndefined(treeData[i][this.parent.childMapping])) {
              if (this.removeChildRecords(treeData[i][this.parent.childMapping], modifiedData[k], action, key, originalData)) {
                this.updateParentRow(key, treeData[i], action);
              }
            }
          }
        }
        }
      }
      private removeChildRecords(childRecords: ITreeData[], modifiedData: object, action: string, key: string, originalData?: ITreeData)
        : boolean {
        let isChildAll: boolean = false;
        let j: number = childRecords.length;
        while (j-- && j >= 0) {
          if (childRecords[j][key] === modifiedData[key] ||
            (this.isSelfReference && childRecords[j][this.parent.parentIdMapping] === modifiedData[this.parent.idMapping])) {
            if (action === 'edit') {
              let keys: string[] = Object.keys(modifiedData);
              for (let i: number = 0; i < keys.length; i++) {
                if (childRecords[j].hasOwnProperty(keys[i])) {
                  childRecords[j][keys[i]] = modifiedData[keys[i]];
                }
              }
              break;
            } else if (action === 'add') {
                if (this.parent.editSettings.newRowPosition === 'Child') {
                    if (this.isSelfReference) {
                        originalData[this.parent.parentIdMapping] = childRecords[j][this.parent.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        this.updateParentRow(key, childRecords[j], action);
                    } else {
                        if (!(<Object>childRecords[j]).hasOwnProperty(this.parent.childMapping)) {
                            childRecords[j][this.parent.childMapping] = [];
                        }
                        childRecords[j][this.parent.childMapping].push(originalData);
                        this.updateParentRow(key, childRecords[j], action);
                    }
                } else if (this.parent.editSettings.newRowPosition === 'Above' ) {
                  childRecords.splice(j, 0, originalData);
                } else if (this.parent.editSettings.newRowPosition === 'Below' ) {
                  childRecords.splice(j + 1, 0, originalData);
                }
            } else {
              let parentItem: ITreeData = childRecords[j].parentItem;
              childRecords.splice(j, 1);
              if (!childRecords.length) {
                isChildAll = true;
              }
            }
          } else if (!isNullOrUndefined(childRecords[j][this.parent.childMapping])) {
            if (this.removeChildRecords(childRecords[j][this.parent.childMapping], modifiedData, action, key, originalData)) {
              this.updateParentRow(key, childRecords[j], action);
            }
          }
        }
        return isChildAll;
      }
      private updateParentRow(key: string, record: ITreeData, action: string, child?: ITreeData): void {
        let currentRecords: ITreeData[] = this.parent.grid.getCurrentViewRecords();
        let index: number;
        currentRecords.map((e: ITreeData, i: number) => { if (e[key] === record[key]) { index = i; return; } });
        record = currentRecords[index];
        record.hasChildRecords = false;
        if (action === 'add') {
            record.expanded = true;
            record.hasChildRecords = true;
            let childRecords: ITreeData = child ? child : currentRecords[index + 1];
            if (!(<Object>record).hasOwnProperty('childRecords')) {
              record.childRecords = [];
            }
            if (record.childRecords.indexOf(childRecords) === -1) {
              record.childRecords.unshift(childRecords);
            }
            if (this.isSelfReference) {
                if (!(<Object>record).hasOwnProperty(this.parent.childMapping)) {
                    record[this.parent.childMapping] = [];
                }
                if (record.childRecords.indexOf(childRecords) === -1) {
                  record[this.parent.childMapping].unshift(childRecords);
                }
            }
        }
        this.parent.grid.setRowData(key, record);
        let row: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getRowByIndex(index);
        this.parent.renderModule.cellRender({data: record, cell: row.cells[this.parent.treeColumnIndex],
            column: this.parent.grid.getColumns()[this.parent.treeColumnIndex] });
      }

    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    public editFormValidate(): boolean {
      return this.parent.grid.editModule.editFormValidate();
    }

    /**
     * @hidden
     */
    public destroyForm(): void {
      this.parent.grid.editModule.destroyForm();
  }
    //   private beforeBatchAdd(e: BeforeBatchAddArgs): void {
      //     this.selectedIndex = this.parent.grid.selectedRowIndex ;
      //     this.addRowIndex = this.selectedIndex > -1 ? this.selectedIndex : 0;
      //   }
      //   private beforeBatchSave(e: BeforeBatchSaveArgs): void {
      //     this.batchRecords = [];
      //     this.batchChanges = this.parent.grid.editModule.getBatchChanges();
      //   }
      //   private batchAdd(e: BatchAddArgs): void {
      //     this.isAdd = true;
      //     if (!this.batchRecords.length) {
      //       this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
      //     }
      //     this.beginAdd();
      //     let focusModule: FocusStrategy = getValue('focusModule', this.parent.grid);
      //     let index: number = this.addRowIndex;
      //     let records: Object[] = this.batchRecords.length ? this.batchRecords : this.parent.grid.getCurrentViewRecords();
      //     let childs: number = findChildrenRecords(records[index]).length;
      //     if (this.selectedIndex > -1) {
      //       switch (this.parent.editSettings.newRowPosition) {
      //         case 'Child':
      //         case 'Below':
      //         index += childs + 1;
      //         break;
      //       }
      //     }
      //     this.updateRowIndex();
      //  //update focus details
      //     focusModule.getContent().matrix.current = [index, focusModule.getContent().matrix.current[1]];
      //     e.row.setAttribute('aria-rowindex', index.toString());
      //     let parentRecord: ITreeData = this.batchRecords[this.addRowIndex];
      //     if(this.parent.editSettings.newRowPosition === 'Child') {
      //       parentRecord.expanded = true; parentRecord.hasChildRecords = true; parentRecord.childRecords = [];
      //       this.parent.renderModule.cellRender({data: parentRecord,
      //         cell: (<HTMLTableRowElement>this.parent.grid.getRows()[this.addRowIndex]).cells[this.parent.treeColumnIndex],
      //           column: this.parent.grid.getColumns()[this.parent.treeColumnIndex] });
      //     }
      //   }

    // private batchDelete(e: BatchDeleteArgs): void {
    //   if (!this.batchRecords.length) {
    //     this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
    //   }
    //   let row: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getRowByIndex(e.rowIndex - 1);
    //   let parentRecord: ITreeData = this.batchRecords.filter((item: Object) => {
    //        return item[e.primaryKey[0]] === (<ITreeData>e.rowData).parentItem[e.primaryKey[0]]; })[0];
    //   if (this.batchDeleted.hasOwnProperty(parentRecord[this.parent.grid.getPrimaryKeyFieldNames()[0]])) {
    //       parentRecord = this.batchDeleted[parentRecord[this.parent.grid.getPrimaryKeyFieldNames()[0]]];
    //   } else {
    //     this.batchDeleted[parentRecord[this.parent.grid.getPrimaryKeyFieldNames()[0]]] = parentRecord;
    //   }
    //   parentRecord.childRecords.splice(parentRecord.childRecords.indexOf(e.rowData), 1);
    //   if(!parentRecord.childRecords.length) {
    //     parentRecord.hasChildRecords = false;
    //     parentRecord.expanded = false;
    //     this.parent.renderModule.cellRender({data: parentRecord,
    //               cell: row.cells[this.parent.treeColumnIndex], column: this.parent.grid.getColumns()[this.parent.treeColumnIndex] });
    //   }
    //   this.batchRecords.splice(e.rowIndex, 1);
    // }
    // private recordClick(e: MouseEvent): void {
    //   if (this.parent.editSettings.mode === 'Cell' && this.parent.editSettings.allowAdding === true &&
    //            parentsUntil(e.target as Element, 'e-rowcell')) {
    //     let batchChanges: Object = this.parent.grid.editModule.getBatchChanges();
    //     if (batchChanges[this.addedRecords].length) {
    //       this.batchAddRecord(batchChanges[this.addedRecords[0]]);
    //     }
    //   }
    // }
//     private cellSaved(args: CellSaveArgs): void {
//       if ((<HTMLTableCellElement>args.cell).cellIndex === this.parent.treeColumnIndex) {
//         this.parent.renderModule.cellRender({
//           data: args.rowData,
//           cell: args.cell,
//           column: this.parent.grid.getColumnByIndex((<HTMLTableCellElement>args.cell).cellIndex)
//         });
//       }
//     }
//       let parentRecord: ITreeData, index: number;
//       parentRecord = this.selectedIndex > -1 ?  this.batchRecords[this.addRowIndex] : null;
//       let isRoot: boolean = parentRecord == null || !parentRecord.index;
//       let primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
//       if (this.isAdd && this.parent.editSettings.mode === 'Batch') {
//         let added: ITreeData = this.parent.grid.getRowsObject()[0].changes;
//         if (!added.hasOwnProperty('level')) {
// //update hierarchy details
//       if (this.parent.editSettings.newRowPosition === 'Child') {
//       added.parentItem = parentRecord;

//       added.index = this.addRowIndex + findChildrenRecords(parentRecord).length + 1;
//       parentRecord.childRecords.push(this.parent.grid.editModule.getBatchChanges()[this.addedRecords[0]]);
//       added.level = parentRecord.level + 1;
//       added.parentIndex = parentRecord.index;
//       if (this.isSelfReference) {
//         added.parentIdMapping = parentRecord[this.parent.idMapping];
//       }
//     } else {
//       added.parentItem = parentRecord;
//       added.index = this.parent.editSettings.newRowPosition === 'Below' && !isRoot ?
//                  this.addRowIndex + findChildrenRecords(parentRecord).length + 1 : this.addRowIndex;
//       if (!isRoot) {
//         added.level = parentRecord.level;
//       let keyValue: string = (<ITreeData>this.batchRecords[this.addRowIndex]).parentItem[primaryKey];
//       let parentItem: ITreeData = this.batchRecords.filter((item: Object) => {return item[primaryKey] === keyValue; })[0];
//       if (!(<Object>parentRecord.parentItem).hasOwnProperty('childRecords')) {
//         parentRecord.parentItem.childRecords = [];
//       }
//       parentRecord.parentItem.childRecords.push(this.parent.grid.editModule.getBatchChanges()[this.addedRecords[0]]);
//       added.parentIndex = parentRecord.index;
//       if (this.isSelfReference) {
//         added.parentIdMapping = parentRecord.parentItem[this.parent.idMapping];
//       }
//     }
//     }
//         }
//         this.batchRecords.splice(added.index, 0, added);
//         this.parent.grid.getRowsObject()[0].data = added;
//       }

//     }
    // private batchSave (args: SaveEventArgs): void {
    //   let i: number;
    //   for (i = 0; i < this.batchChanges[this.changedRecords].length; i++) {
    //     this.editAction({value: this.batchChanges[this.changedRecords][i], action: 'edit'});
    //   }
    //   for (i = 0; i < this.batchChanges[this.deletedRecords].length; i++) {
    //     this.editAction({value: this.batchChanges[this.deletedRecords][i], action: 'delete'});
    //   }
    //   let data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
    //                          this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
    //   let currentViewRecords: Object[] = this.parent.grid.getCurrentViewRecords();
    //   let rows: HTMLElement[] = <HTMLElement[]>this.parent.grid.getRows();
    //   let rowGenerator: RowModelGenerator = new RowModelGenerator(this.parent.grid);
    //   let addRecords: ITreeData[] = this.batchChanges[this.addedRecords];
    //   for (i = 0; i < addRecords.length; i++) {
    //     this.editAction({value: addRecords[i], action: 'add'});
    //     if (this.parent.editSettings.newRowPosition !== 'Bottom' ) {
    //     data.splice(addRecords[i].index, 0, addRecords[i]);
    //     data.splice(data.length - 1, 1);
    //     if (!this.parent.allowPaging || (this.parent.grid.pageSettings.totalRecordsCount / this.parent.grid.pageSettings.pageSize) < 2 &&
    //         currentViewRecords.length + (addRecords.length - i) <= this.parent.grid.pageSettings.pageSize)  {
    //       let position: string = 'before';
    //       rows[addRecords[i].index][position](rows[rows.length - 1]);
    //     } else {
    //       //let row: Row<Column>[] =  rowGenerator.generateRows(this.addedRecords[i]);
    //     }
    //     currentViewRecords.splice(addRecords[i].index, 0, addRecords[i]);
    //     currentViewRecords.splice(data.length - 1, 1);
    //   }
    //   }
    // }
        // private updateRowIndex(): void {
    //   let rows: Element[] = this.parent.grid.getDataRows();
    //   for (let i: number = 0 ; i < rows.length; i++) {
    //     rows[i].setAttribute('aria-rowindex', i.toString());
    //   }
    // }
}