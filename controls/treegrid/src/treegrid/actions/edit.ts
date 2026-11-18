import { Grid, Edit as GridEdit, SaveEventArgs, CellSaveArgs, CellEditArgs, getUid, getObject,
    NotifyArgs, Row, ActionEventArgs, resetRowIndex, BatchChanges} from '@syncfusion/ej2-grids';
import { Column, RecordDoubleClickEventArgs, RowInfo, parentsUntil } from '@syncfusion/ej2-grids';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base/treegrid';
import { ITreeData, CellSaveEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { isNullOrUndefined, extend, setValue, removeClass, KeyboardEventArgs, addClass, getValue } from '@syncfusion/ej2-base';
import { DataManager, Deferred, RemoteSaveAdaptor, AdaptorOptions, Query } from '@syncfusion/ej2-data';
import { findChildrenRecords, getParentData, isCountRequired, isRemoteData  } from '../utils';
import { editAction, updateParentRow } from './crud-actions';
import { RowPosition } from '../enum';
import { BatchEdit } from './batch-edit';
import { AggregateRow } from '../models/summary';

/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
export class Edit {
    private parent: TreeGrid;
    private isSelfReference: boolean;
    private addedRecords: string = 'addedRecords';
    private deletedRecords: string = 'deletedRecords';
    private addRowIndex: number;
    private addRowRecord: ITreeData;
    private isOnBatch: boolean;
    private keyPress: string;
    private selectedIndex: number;
    private doubleClickTarget: Element;
    private internalProperties: ITreeData;
    private previousNewRowPosition : RowPosition;
    private batchEditModule: BatchEdit;
    private isTabLastRow: boolean;
    private prevAriaRowIndex: string = '-1';
    private isAddedRowByMethod: boolean = false;
    private isAddedRowByContextMenu: boolean = false;
    private editedRowIndex: number;
    private isScrollByFocus : boolean;
    private isIndexUndefined : boolean = false;
    public isAddedMultipleRowsByMethod : boolean = false;
    private multipleRowIndex: number;
    private updatedRecords : BatchChanges;
    /**
     * Constructor for Edit module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent: TreeGrid) {
        initializeTelemetryFeature('Edit', 'TreeGrid');
        Grid.Inject(GridEdit);

        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        this.previousNewRowPosition = null;
        this.internalProperties = {};
        this.batchEditModule = new BatchEdit(this.parent);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Edit module name
     */
    protected getModuleName(): string {
        return 'edit';
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on(events.crudAction, this.crudAction, this);
        this.parent.on(events.beginEdit, this.beginEdit, this);
        this.parent.on(events.beginAdd, this.beginAdd, this);
        this.parent.on(events.recordDoubleClick, this.recordDoubleClick, this);
        this.parent.on(events.cellSave, this.cellSave, this);
        this.parent.on(events.batchCancel, this.batchCancel, this);
        this.parent.grid.on(events.keyPressed, this.keyPressed, this);
        this.parent.grid.on('batchedit-form', this.lastCellTab, this);
        this.parent.grid.on('content-ready', this.contentready, this);
        this.parent.on(events.cellEdit, this.cellEdit, this);
        this.parent.on('actionBegin', this.editActionEvents, this);
        this.parent.on('actionComplete', this.editActionEvents, this);
        this.parent.on('resetDoubleClickTarget', this.resetDoubleClickTarget, this);
        this.parent.grid.on(events.doubleTap, this.recordDoubleClick, this);
        this.parent.grid.on('dblclick', this.gridDblClick, this);
        this.parent.grid.on('recordAdded', this.customCellSave, this);
        this.parent.on('savePreviousRowPosition', this.savePreviousRowPosition, this);
        // this.parent.on(events.beforeDataBound, this.beforeDataBound, this);
        this.parent.grid.on(events.beforeStartEdit, this.beforeStartEdit, this);
        this.parent.grid.on('get-row-position', this.getRowPosition, this);
        this.parent.grid.on('last-row-validation', this.lastRowValidation, this);
    }
    private gridDblClick(e: MouseEvent): void {
        this.doubleClickTarget = e.target as HTMLElement;
        if ((e.target as HTMLElement).classList.contains('e-frame') && this.parent.getCurrentViewRecords().length === 0)
        {
            this.doubleClickTarget = null;
        }
        if ((e.target as HTMLElement).classList.contains('e-treegridcollapse') || (e.target as HTMLElement).classList.contains('e-treegridexpand')) {
            const tr: Element = parentsUntil(e.target as Element, 'e-row');
            const rowIndex: number = tr && parseInt(tr.getAttribute('aria-rowindex'), 10) - 1;
            if (!isNullOrUndefined(rowIndex) && rowIndex >= 0 && this.parent.allowPaging) {
                /* eslint-disable-next-line */
                (this.parent.grid.getDataRows()[rowIndex]as HTMLTableRowElement).dataset.uid = (this.parent.grid.contentModule.getRows()[rowIndex] as any).uid;
            }
        }
    }
    private getRowPosition(addArgs: { newRowPosition: RowPosition, addRowIndex: number, dataRowIndex: number }): void {
        addArgs.newRowPosition = this.parent.editSettings.newRowPosition;
        addArgs.addRowIndex = this.addRowIndex;
        addArgs.dataRowIndex = +this.prevAriaRowIndex;
    }
    private resetDoubleClickTarget(): void {
        this.doubleClickTarget = null;
    }
    private beforeStartEdit(args: Object) : void {
        if (this.parent.editSettings.mode === 'Cell') {
            this.parent.trigger(events.actionBegin, args);
        }
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.crudAction, this.crudAction);
        this.parent.off(events.beginEdit, this.beginEdit);
        this.parent.off(events.beginAdd, this.beginAdd);
        this.parent.off(events.recordDoubleClick, this.recordDoubleClick);
        this.parent.off(events.batchCancel, this.batchCancel);
        this.parent.grid.off(events.keyPressed, this.keyPressed);
        this.parent.grid.off('batchedit-form', this.lastCellTab);
        this.parent.grid.off('content-ready', this.contentready);
        this.parent.off(events.cellEdit, this.cellEdit);
        this.parent.off('actionBegin', this.editActionEvents);
        this.parent.off('actionComplete', this.editActionEvents);
        this.parent.grid.off('recordAdded', this.customCellSave);
        this.parent.grid.off(events.doubleTap, this.recordDoubleClick);
        this.parent.off('savePreviousRowPosition', this.savePreviousRowPosition);
        this.parent.grid.off(events.beforeStartEdit, this.beforeStartEdit);
        this.parent.off('resetDoubleClickTarget', this.resetDoubleClickTarget);
        this.parent.grid.off('dblclick', this.gridDblClick);
        this.parent.grid.off('get-row-position', this.getRowPosition);
        this.parent.grid.off('last-row-validation', this.lastRowValidation);
        //this.parent.grid.off('click', this.gridSingleClick);
    }
    /**
     * To destroy the editModule
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * @param {Column[]} cols - Column property Collection
     * @hidden
     * @returns {void}
     */
    public applyFormValidation(cols?: Column[]): void {
        this.parent.grid.editModule.applyFormValidation(cols);
    }
    private editActionEvents(args: Object): void {
        const eventArgs: ActionEventArgs | CellSaveEventArgs = getObject('editAction', args);
        const eventName: string = getObject('name', eventArgs);
        const treeObj: TreeGrid = this.parent;
        const adaptor: AdaptorOptions = !isNullOrUndefined((treeObj.dataSource as DataManager))
            && (treeObj.dataSource as DataManager).adaptor;
        if (!isNullOrUndefined(adaptor) && (isRemoteData(treeObj) || adaptor instanceof RemoteSaveAdaptor) &&
          (eventArgs.requestType === 'save' && eventArgs.action === 'add') &&
          (treeObj.editSettings.newRowPosition === 'Child' || treeObj.editSettings.newRowPosition === 'Below'
          || treeObj.editSettings.newRowPosition === 'Above')) {
            if (eventName === 'actionBegin') {
                const rowIndex: number = isNullOrUndefined(eventArgs.row) || !Object.keys(eventArgs.row).length ? this.selectedIndex :
                    (<HTMLTableRowElement>eventArgs.row).rowIndex - 1;
                const keyData: string = (!isNullOrUndefined(rowIndex) && rowIndex !== -1) ?
                    treeObj.getCurrentViewRecords()[parseInt(rowIndex.toString(), 10)][treeObj.getPrimaryKeyFieldNames()[0]] : -1;
                treeObj.grid.query.addParams('relationalKey', keyData);
            } else if (eventName === 'actionComplete') {
                const paramsLength: number = treeObj.grid.query.params.length;
                for (let i: number = 0; i < paramsLength; i++) {
                    if (treeObj.grid.query.params[parseInt(i.toString(), 10)].key === 'relationalKey') {
                        treeObj.grid.query.params.splice(i);
                    }
                }
            }
        }
        if (eventName === 'actionComplete' && eventArgs.requestType === 'save') {
            this.addRowRecord = null;
        }
        if (this.parent.enableInfiniteScrolling && eventName === 'actionComplete') {
            this.infiniteAddAction(eventArgs);
        }
        if (this.parent.editSettings.mode === 'Batch' &&  eventArgs.requestType === 'paging') {
            this.parent.notify('batchPageAction', {});
        }
    }
    private infiniteAddAction(args: ActionEventArgs | CellSaveEventArgs): void {
        if ((args.requestType === 'save' && args.action === 'add') || args.requestType === 'delete') {
            if (this.parent.editSettings.newRowPosition !== 'Top' && this.selectedIndex !== -1
         && (args.requestType === 'save' && args.action === 'add')) {
                const rowObjects: Row<Column>[] = this.parent.grid.getRowsObject();
                const newRowObject: Row<Column> = rowObjects.splice(0, 1)[0];
                let newRowObjectIndex: number = this.addRowIndex;
                const currentData: ITreeData[] = this.parent.getCurrentViewRecords();
                if (this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child') {
                    newRowObjectIndex += findChildrenRecords(currentData[newRowObjectIndex + 1]).length;
                }
                newRowObjectIndex = this.parent.editSettings.newRowPosition === 'Below' ? newRowObjectIndex + 1 : newRowObjectIndex;
                rowObjects.splice(newRowObjectIndex, 0, newRowObject);
                const newRecord: ITreeData = currentData.splice(0, 1)[0];
                currentData.splice(newRowObjectIndex, 0, newRecord);
                this.updateInfiniteCurrentViewData(newRecord, this.addRowIndex);
            }
            const movableRows: Element[] = this.parent.grid.getRows();
            const movableRowsObject: Row<Column>[] = this.parent.grid.getRowsObject();
            const isCache: boolean = this.parent.infiniteScrollSettings.enableCache;
            if (!isCache) {
                resetRowIndex(this.parent.grid, this.parent.grid.getRowsObject(), this.parent.grid.getRows() as HTMLTableRowElement[], 0);
                this.updateIndex(this.parent.grid.dataSource, this.parent.getRows(), this.parent.getCurrentViewRecords());
            }
            if (!isCache && this.parent.getFrozenColumns() > 0) {
                resetRowIndex(this.parent.grid, movableRowsObject, movableRows as HTMLTableRowElement[], 0);
                this.updateIndex(this.parent.grid.dataSource, movableRows, this.parent.getCurrentViewRecords());
            }
        }
    }
    private updateInfiniteCurrentViewData(newRecord: ITreeData, newRowIndex: number): void {
        const infiniteData: string = 'infiniteCurrentViewData'; const updateCurrentViewData: string = 'updateCurrentViewData';
        const size: number = Math.ceil(newRowIndex / this.parent.grid.pageSettings.pageSize);
        let page: number = size > 0 ? size : 1;
        let dataIndex: number = newRowIndex - ((page - 1) * this.parent.pageSettings.pageSize);
        const infiniteCurrentViewData: { [x: number]: Object[] } = this.parent.grid.infiniteScrollModule[`${infiniteData}`];
        infiniteCurrentViewData[1].splice(0, 1);
        let data: Object[] = infiniteCurrentViewData[parseInt(page.toString(), 10)];
        if (!isNullOrUndefined(this.addRowRecord)) {
            data.filter((e: ITreeData, index: number): void => {
                if (e.uniqueID === this.addRowRecord.uniqueID) {
                    dataIndex = index;
                }
            });
            if (this.addRowRecord.hasChildRecords && this.addRowRecord.childRecords.length &&
          this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child') {
                dataIndex += findChildrenRecords(this.addRowRecord).length;
            }
        }
        if (dataIndex >= this.parent.pageSettings.pageSize) {
            page += 1;
            data = infiniteCurrentViewData[parseInt(page.toString(), 10)];
            dataIndex = dataIndex - this.parent.pageSettings.pageSize >= 0 ? dataIndex - this.parent.pageSettings.pageSize : 0;
        }
        dataIndex = this.parent.editSettings.newRowPosition === 'Below' ? dataIndex + 1 : dataIndex;
        data.splice(dataIndex, 0, newRecord);
        this.parent.grid.infiniteScrollModule[`${updateCurrentViewData}`]();
    }

    private recordDoubleClick(args: RecordDoubleClickEventArgs): void {
        const target: HTMLElement = <HTMLElement>args.target;
        if (isNullOrUndefined(target.closest('td.e-rowcell'))) {
            return;
        }
        if (!(this.parent.grid.editSettings.allowEditing) || this.parent.grid.isEdit) {
            return;
        }
        const column: Column = this.parent.grid.getColumnByIndex(+target.closest('td.e-rowcell').getAttribute('aria-colindex') - 1);
        if (this.parent.editSettings.mode === 'Cell' && column && !column.isPrimaryKey &&
            this.parent.editSettings.allowEditing && column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
                target.classList.contains('e-treegridcollapse')) && this.parent.editSettings.allowEditOnDblClick) {
            this.parent.grid.setProperties({ selectedRowIndex: args.rowIndex }, true);
        }
    }

    private keyPressed(args: KeyboardEventArgs): void {
        if (this.isOnBatch  || args.action === 'tab' || args.action === 'shiftTab') {
            this.keyPress = args.action;
        }
        if (args.action === 'f2') {
            this.recordDoubleClick(args as Object);
        }
        if (args.action === 'escape') {
            if (this.parent.grid.isEdit) {
                this.closeEdit();
            }
        }
    }

    private deleteUniqueID( value: string) : void {
        const idFilter: string = 'uniqueIDFilterCollection';
        delete this.parent[`${idFilter}`][`${value}`];
        const id: string = 'uniqueIDCollection';
        delete this.parent[`${id}`][`${value}`];
    }

    private cellEdit(args: CellEditArgs): Deferred | void {
        const promise: string = 'promise';
        const prom: Deferred = args[`${promise}`];
        delete args[`${promise}`];
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-summarycell') ||
            this.doubleClickTarget.closest('.e-hierarchycheckbox'))) {
            args.cancel = true; this.doubleClickTarget = null;
            return;
        }
        if (this.parent.enableVirtualization && !isNullOrUndefined(this.prevAriaRowIndex) && this.prevAriaRowIndex !== '-1') {
            args.row.setAttribute('aria-rowindex', this.prevAriaRowIndex);
            this.prevAriaRowIndex = undefined;
        }
        if (this.keyPress !== 'enter') {
            this.parent.trigger(events.cellEdit, args, (celleditArgs: CellEditArgs) => {
                if (!celleditArgs.cancel && this.parent.editSettings.mode === 'Cell') {
                    this.enableToolbarItems('edit');
                }
                if (!isNullOrUndefined(prom)) {
                    prom.resolve(celleditArgs);
                }
            });
        }
        if (this.parent.editSettings.mode === 'Cell') {
            if (this.keyPress === 'tab' || this.keyPress === 'shiftTab') {
                this.keyPress = null;
            } else if (this.keyPress === 'enter') {
                args.cancel = true;
                this.keyPress = null;
                setValue('isEditCollapse', false, this.parent);
            }
            if (!args.columnObject.allowEditing) {
                args.cancel = true;
            }
        }
        if (this.parent.enableVirtualization) {
            this.parent.grid.contentModule['editedRowIndex'] = this.parent.grid.editModule.editModule['index'];
        }
    // if (this.isAdd && this.parent.editSettings.mode === 'Batch' && !args.cell.parentElement.classList.contains('e-insertedrow')) {
    //   this.isAdd = false;
    // }
    }

    private enableToolbarItems(request: string): void {
        if (!isNullOrUndefined(this.parent.grid.toolbarModule)) {
            const toolbarID: string = this.parent.element.id  + '_gridcontrol_';
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'add', toolbarID + 'edit', toolbarID + 'delete'], request === 'save');
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'update', toolbarID + 'cancel'], request === 'edit' );
        }
    }

    private batchCancel(): void {
        if (this.parent.editSettings.mode === 'Batch') {
            this.parent.notify('batchCancelAction', {});
        }
    }


    private customCellSave(args: ActionEventArgs): void {
        if (isCountRequired(this.parent) && this.parent.editSettings.mode === 'Cell' && args.action === 'edit') {
            this.updateCell(args as CellSaveArgs, args.rowIndex);
        }
    }

    private cellSave(args: CellSaveArgs): void {
        if (this.parent.enableVirtualization) {
            this.parent.grid.contentModule['virtualData'] = {};
        }
    }

    private lastCellTab(): void {
        if (!this.parent.grid.isEdit && this.keyPress === 'tab' && this.parent.editSettings.mode === 'Cell') {
            if (!this.parent.editSettings.allowNextRowEdit) {
                this.keyPress = null;
            } else {
                this.enableToolbarItems('edit');
            }
        }
    }

    private updateCell(args: CellSaveArgs, rowIndex: number): void {
        this.parent.grid.editModule.updateCell(rowIndex, args.columnName, args.rowData[args.columnName]);
        this.parent.grid.getRowsObject()[parseInt(rowIndex.toString(), 10)].data = args.rowData;
    }
    private crudAction(details: { value: ITreeData, action: string }, columnName?: string): void {
        editAction(details, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName, this.addRowRecord);
        this.parent.parentData = [];
        const data: Object = this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource;
        for (let i: number = 0; i < (<Object[]>data).length; i++) {
            data[parseInt(i.toString(), 10)].index = i;
            const key: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
            if (details.value[`${key}`] === data[parseInt(i.toString(), 10)][`${key}`]) {
                if (details.action === 'add') {
                    data[parseInt(i.toString(), 10)].level = this.internalProperties.level;
                    data[parseInt(i.toString(), 10)].taskData = this.internalProperties.taskData;
                    data[parseInt(i.toString(), 10)].uniqueID = this.internalProperties.uniqueID;
                    if (!isNullOrUndefined(this.internalProperties.parentItem)) {
                        data[parseInt(i.toString(), 10)].parentItem = this.internalProperties.parentItem;
                        data[parseInt(i.toString(), 10)].parentUniqueID = this.internalProperties.parentUniqueID;
                    }
                    data[parseInt(i.toString(), 10)].childRecords = this.internalProperties.childRecords;
                }
            }
            setValue('uniqueIDCollection.' + data[parseInt(i.toString(), 10)].uniqueID + '.index', i, this.parent);
            const adaptor: AdaptorOptions = (this.parent.dataSource as DataManager).adaptor;
            if ((isRemoteData(this.parent) || adaptor instanceof RemoteSaveAdaptor)) {
                setValue('uniqueIDCollection.' + data[parseInt(i.toString(), 10)].uniqueID, data[parseInt(i.toString(), 10)], this.parent);
            }
            if (!data[parseInt(i.toString(), 10)].level) {
                this.parent.parentData.push(data[parseInt(i.toString(), 10)]);
            }
        }
        if (!this.parent.enableInfiniteScrolling) {
            if (details.action === 'add' && this.previousNewRowPosition != null) {
                this.parent.setProperties({editSettings: {newRowPosition:  this.previousNewRowPosition}}, true);
                this.previousNewRowPosition = null;
            }}
    }
    private updateIndex (data: Object, rows: Object, records: Object): void {
        for (let j: number = 0; j < this.parent.getDataRows().length; j++ ) {
            const data1: ITreeData = records[parseInt(j.toString(), 10)];
            if (!isNullOrUndefined(data1)) {
                const index: number = getValue('uniqueIDCollection.' + data1.uniqueID + '.index', this.parent);
                data1.index = index;
                if (!isNullOrUndefined(data1.parentItem)) {
                    const parentIndex: number = getValue('uniqueIDCollection.' + data1.parentItem.uniqueID + '.index', this.parent);
                    data1.parentItem.index = parentIndex;
                }
            }
        }
        let count: number = -1;
        let treeColIndex: number = this.parent.treeColumnIndex;
        if (this.parent.getFrozenColumns() > 0) {
            const cells: NodeListOf<Element> = (rows[0] as Element).querySelectorAll('.e-rowcell');
            for (let l: number = 0; l < cells.length; l++) {
                if (cells[parseInt(l.toString(), 10)].classList.contains('e-gridrowindex0level0')) {
                    treeColIndex = l;
                    break;
                }
            }
        }
        for (let k: number = 0; k < this.parent.getRows().length; k++) {
            if (!rows[parseInt(k.toString(), 10)].classList.contains('e-detailrow')) {
                count++;
            }
            const data2: ITreeData = records[parseInt(count.toString(), 10)];
            if (!isNullOrUndefined(data2)) {
                let index: number = data2.index;
                const level: number = data2.level;
                const row: Element = rows[parseInt(k.toString(), 10)];
                if (!isNullOrUndefined(data2.parentItem)) {
                    index = getValue('uniqueIDCollection.' + data2.parentItem.uniqueID + '.index', this.parent);
                }
                const treecell: HTMLElement = (row as HTMLTableRowElement).cells[parseInt(treeColIndex.toString(), 10)];
                if (!isNullOrUndefined(treecell)) {
                    for (let l: number = 0; l < treecell.classList.length; l++) {
                        const value: string = treecell.classList[parseInt(l.toString(), 10)];
                        const remove: RegExp = /e-gridrowindex/i;
                        const removed: RegExp = /e-griddetailrowindex/i;
                        const result: RegExpMatchArray = value.match(remove);
                        const results: RegExpMatchArray = value.match(removed);
                        if (result != null) {
                            removeClass([treecell], value);
                        }
                        if (results != null) {
                            removeClass([treecell], value);
                        }
                    }
                    if (!rows[parseInt(k.toString(), 10)].classList.contains('e-detailrow')) {
                        addClass([treecell], 'e-gridrowindex' + index + 'level' + level);
                    }else {
                        addClass([treecell], 'e-griddetailrowindex' + index + 'level' + level);
                    }
                }
            }
        }
    }
    private beginAdd(): void {
        let position: string;
        let index: number = this.addRowIndex;
        let records: Object[] = this.parent.grid.getCurrentViewRecords();
        if (this.parent.editSettings.mode === 'Batch') {
            index = this.batchEditModule.getAddRowIndex();
            this.selectedIndex = this.batchEditModule.getSelectedIndex();
            if (this.parent.getBatchChanges()[this.addedRecords].length > 1
              || this.parent.getBatchChanges()[this.deletedRecords].length) {
                records = this.batchEditModule.getBatchRecords();
            }
        }
        const rows: Element[] = this.parent.grid.getDataRows();
        const firstAriaIndex: number = rows.length ? +rows[0].getAttribute('aria-rowindex') - 1 : 0;
        const lastAriaIndex: number = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') - 1 : 0;
        const withinRange: boolean = this.selectedIndex >= firstAriaIndex && this.selectedIndex <= lastAriaIndex;
        const isVirtualization: boolean = this.parent.enableVirtualization && this.addRowIndex > -1 && this.prevAriaRowIndex !== '-1';
        if (this.parent.editSettings.mode !== 'Dialog') {
            if (this.parent.editSettings.newRowPosition === 'Above') {
                position = 'before';
            } else if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                  && (this.selectedIndex > -1 || isVirtualization) && withinRange) {
                position = 'after';
                if (!isNullOrUndefined(records[parseInt(index.toString(), 10)]) &&
                 (records[parseInt(index.toString(), 10)] as ITreeData).expanded) {
                    if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
                || this.parent.getBatchChanges()[this.deletedRecords].length)) {
                        index += findChildrenRecords(records[parseInt(index.toString(), 10)]).length;
                        if (this.parent.editSettings.newRowPosition !== 'Child') {
                            const batchChildCount: number = this.batchEditModule.getBatchChildCount();
                            index = index + batchChildCount;
                        }
                    } else if (!this.parent.enableVirtualization) {
                        index += findChildrenRecords(records[parseInt(index.toString(), 10)]).length;
                    }
                }
            }
            if ((this.selectedIndex > -1 || isVirtualization) && withinRange
          && (index || (this.parent.editSettings.newRowPosition === 'Child'
          || this.parent.editSettings.newRowPosition === 'Below'))) {
                if (index >= rows.length - 1) {
                    index = rows.length - 2;
                }
                const r: string = 'rows';
                const newRowObject: Row<Column> =  this.parent.grid.contentModule[`${r}`][0];
                const focussedElement: HTMLInputElement = <HTMLInputElement>document.activeElement;
                rows[index + 1][`${position}`](rows[0]);
                setValue('batchIndex', index + 1, this.batchEditModule);
                const rowObjectIndex: number = this.parent.editSettings.newRowPosition  === 'Above' ? index : index + 1;
                if (this.parent.editSettings.mode === 'Batch') {
                    this.parent.grid.contentModule[`${r}`].splice(0, 1);
                    this.parent.grid.contentModule[`${r}`].splice(rowObjectIndex, 0, newRowObject);
                }
                if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
                    const errors: NodeListOf<Element> = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
                    for (let i: number = 0; i < errors.length; i++) {
                        errors[parseInt(i.toString(), 10)].remove();
                    }
                    setValue('errorRules', [], this.parent.grid.editModule.formObj);
                }
                if (isVirtualization) {
                    this.prevAriaRowIndex = '-1';
                }
                if (!this.parent.enableVirtualization || this.parent.enableVirtualization) {
                    this.isScrollByFocus = true;
                    focussedElement.focus();
                }
                if (this.parent.enableVirtualization && !Object.keys(this.parent.grid.contentModule['emptyRowData']).length) {
                    this.parent.grid.contentModule['createEmptyRowdata']();
                }
            }
        }
        if (this.parent.editSettings.mode === 'Batch' && !isNullOrUndefined(this.addRowIndex) && this.addRowIndex !== -1 &&
        !this.isAddedMultipleRowsByMethod && this['isAddedRowByMethod'] && !this.isAddedRowByContextMenu) {
            index = this.batchEditModule.getAddRowIndex();
            this.selectedIndex = this.batchEditModule.getSelectedIndex();
            const batchAddedRecords: ITreeData[] = this.parent.getBatchChanges()['addedRecords'];
            let newlyAddedRecord: ITreeData;
            if (batchAddedRecords.length) {
                for (let i: number = 0; i < batchAddedRecords.length; i++) {
                    if (isNullOrUndefined(batchAddedRecords[parseInt(i.toString(), 10)].uniqueID)) {
                        newlyAddedRecord = batchAddedRecords[parseInt(i.toString(), 10)];
                    }
                }
            }
            const args: Object = {
                action : 'add',
                data: newlyAddedRecord,
                index: index,
                seletedRow: 0
            };
            this.beginAddEdit(args);
            if (this.batchEditModule['addRowRecord']) {
                this.batchEditModule['batchAddRowRecord'].push(this.batchEditModule['addRowRecord']);
            }
            this.batchEditModule['batchAddedRecords'].push(args['data']);
        } else if (this.parent.editSettings.mode === 'Batch' && this.isAddedMultipleRowsByMethod && (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below')) {
            index = this.multipleRowIndex;
            this.selectedIndex = this.multipleRowIndex;
            const batchAddedRecords: ITreeData[] = this.updatedRecords.addedRecords;
            let newlyAddedRecord : ITreeData;
            if (batchAddedRecords.length) {
                for (let i: number = 0; i < batchAddedRecords.length; i++) {
                    if (isNullOrUndefined((batchAddedRecords[parseInt(i.toString(), 10)] as any).uniqueID)) {
                        newlyAddedRecord = batchAddedRecords[parseInt(i.toString(), 10)];
                    }
                    const args: Object = {
                        action: 'add',
                        data: newlyAddedRecord,
                        index: index,
                        seletedRow: 0
                    };
                    this.beginAddEdit(args);
                    if (this.batchEditModule['addRowRecord']) {
                        this.batchEditModule['batchAddRowRecord'].push(this.batchEditModule['addRowRecord']);
                    }
                    this.batchEditModule['batchAddedRecords'].push(args['data']);
                }
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
        if (this.parent.flatData.length === 0 && !isNullOrUndefined(this.addRowRecord)) {
            this.addRowRecord = undefined;
        }
        if (args.requestType === 'refresh' && this.isOnBatch) {
            args.cancel = true; return;
        }
        if (this.parent.editSettings.mode === 'Cell' && args.requestType === 'beginEdit' && (args.row as HTMLTableRowElement).classList.contains('e-summaryrow')) {
            args.cancel = true; return;
        }
        if (this.doubleClickTarget && args.requestType !== 'delete' && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-frame')  ||
            this.doubleClickTarget.closest('.e-hierarchycheckbox'))) {
            args.cancel = true; this.doubleClickTarget = null;
            return;
        }
        if (args.requestType === 'delete') {
            const data: ITreeData[] = <ITreeData[]>args.data;
            if (isNullOrUndefined((args.data[0] as ITreeData).uniqueID)) {
                const primaryKeys: string[] = this.parent.getPrimaryKeyFieldNames();
                for (let i: number = 0; i < data.length; i++) {
                    this.parent.flatData.filter((e: ITreeData) => {
                        if (e[`${primaryKeys[0]}`] === args.data[parseInt(i.toString(), 10)][primaryKeys[0]]) {
                            data[parseInt(i.toString(), 10)] = e;
                        }
                    });
                }
            }
            for (let i: number = 0; i < data.length; i++) {
                this.deleteUniqueID(data[parseInt(i.toString(), 10)].uniqueID);
                const childs: ITreeData[] = findChildrenRecords(data[parseInt(i.toString(), 10)]);
                for (let c: number = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[parseInt(c.toString(), 10)].uniqueID);
                }
                args.data = [...args.data as object[], ...childs];
            }
        }
        if (args.requestType === 'add' || (this.isAddedRowByMethod && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling))) {
            if (!(this.parent.grid.selectedRowIndex === -1 && this.isAddedRowByMethod)
            && args.index === this.parent.grid.selectedRowIndex || args.index === 0 ) {
                this.selectedIndex = this.parent.grid.selectedRowIndex;
            }
            if (this.parent.enableVirtualization) {
                let selector: string = '.e-row[aria-rowindex="' + (this.selectedIndex + 1) + '"]';
                let row: HTMLTableRowElement;
                if (this.selectedIndex > -1 && this.parent.editSettings.newRowPosition !== 'Top' &&
                  this.parent.editSettings.newRowPosition !== 'Bottom') {
                    this.prevAriaRowIndex = this.selectedIndex.toString();
                    row = <HTMLTableRowElement>this.parent.getContent().querySelector(selector);
                    this.addRowIndex = row ? row.rowIndex : 0;
                } else {
                    if (this.prevAriaRowIndex && this.prevAriaRowIndex !== '-1') {
                        selector = '.e-row[aria-rowindex="' + (this.prevAriaRowIndex + 1) + '"]';
                        row = <HTMLTableRowElement>this.parent.getContent().querySelector(selector);
                        this.addRowIndex = row ? row.rowIndex : 0;
                    } else {
                        this.addRowIndex = 0;
                    }
                }
            } else {
                if (this.isAddedRowByMethod && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                    if (args.index !== 0) {
                        this.addRowIndex = args.index;
                    } else {
                        this.addRowIndex = this.parent.grid.selectedRowIndex;
                    }
                } else {
                    this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
                }
            }
            const selectedRecords: any = this.parent.getSelectedRecords()[0];
            if ((this.isAddedRowByMethod || (this.isAddedRowByContextMenu && this.parent.grid.selectedRowIndex !== -1)) &&
                (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                this.addRowRecord = this.parent.flatData[this.parent.grid.selectedRowIndex];
                if (this.parent.enableVirtualization && this.isAddedRowByContextMenu) {
                    this.addRowRecord = this.parent.getCurrentViewRecords()[this.addRowIndex];
                }
            }
            else if (!isNullOrUndefined(selectedRecords)) {
                this.addRowRecord = selectedRecords;
            }
        }
        if (this.isAddedRowByMethod && args.index !== 0) {
            this.addRowRecord = this.parent.flatData[args.index];
            this.addRowIndex = args.index;
        }
        if (this.parent.editSettings.newRowPosition === 'Child'  && ( this.isIndexUndefined || this.isAddedRowByMethod) &&
            !isNullOrUndefined(this.parent.getSelectedRecords()[0])) {
            this.addRowRecord = this.parent.getSelectedRecords()[0];
            this.isIndexUndefined = false;
        }
        if (isNullOrUndefined(this.addRowRecord) && this.parent.getCurrentViewRecords().length > this.addRowIndex &&
            args.requestType === 'save' && this.parent.getSelectedRecords().length !== 0)
        {
            this.addRowRecord = this.parent.getCurrentViewRecords()[this.addRowIndex];
        }
        this.isAddedRowByMethod = false;
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
    private savePreviousRowPosition(): void {
        if (this.previousNewRowPosition === null) {
            this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        }
    }
    private beginAddEdit(args: SaveEventArgs): SaveEventArgs {
        const value: ITreeData = args.data;
        if (args.action === 'add') {
            const key: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
            let position: string = null;
            value.taskData = isNullOrUndefined(value.taskData) ? extend({}, args.data) : value.taskData;
            let currentData: ITreeData[];

            if (this.parent.enableVirtualization && args.index !== 0) {
                currentData = this.parent.flatData;
            }
            else if (this.parent.editSettings.mode === 'Batch' && this['isAddedRowByMethod'] && !isNullOrUndefined(this.addRowIndex)) {
                currentData = this.batchEditModule['batchRecords'];
            }
            else {
                currentData = <ITreeData[]>this.parent.grid.getCurrentViewRecords();
            }
            if (this.parent.enableVirtualization && args.index !== 0) {
                this.addRowIndex = this.parent.flatData.indexOf( this.addRowRecord);
                this.selectedIndex = this.addRowIndex;
            }
            let index: number =  this.addRowIndex;
            value.uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' +  value.uniqueID , value, this.parent);
            let level: number = 0; let idMapping: Object;
            let parentUniqueID: string; let parentItem: Object; let parentIdMapping: string;
            const isVirtualization: boolean = this.parent.enableVirtualization && this.addRowIndex > -1 && this.prevAriaRowIndex !== '-1';
            const rows: HTMLTableRowElement[] = this.parent.getRows();
            const firstAriaIndex: number = rows.length ? currentData.indexOf(currentData[0]) : 0;
            const lastAriaIndex: number = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') - 1 : 0;
            const withinRange: boolean = this.parent.enableVirtualization && args.index !== 0 ? true :
                this.selectedIndex >= firstAriaIndex && this.selectedIndex <= lastAriaIndex;
            if (currentData.length && !isNullOrUndefined(index)) {
                idMapping = currentData[this.addRowIndex][this.parent.idMapping];
                parentIdMapping = currentData[this.addRowIndex][this.parent.parentIdMapping];
                if (currentData[this.addRowIndex].parentItem) {
                    parentUniqueID = currentData[this.addRowIndex].parentItem.uniqueID;
                }
                parentItem = currentData[this.addRowIndex].parentItem;
            }
            if (this.parent.editSettings.newRowPosition !== 'Top' && currentData.length && !isNullOrUndefined(index)) {
                level = currentData[this.addRowIndex].level;
                if (this.parent.editSettings.newRowPosition === 'Above') {
                    position = 'before'; index = currentData[this.addRowIndex].index;
                } else if (this.parent.editSettings.newRowPosition === 'Below') {
                    position = 'after';
                    const childRecordCount: number = findChildrenRecords(currentData[this.addRowIndex]).length;
                    const currentDataIndex: number = currentData[this.addRowIndex].index;
                    index = (childRecordCount > 0) ? ( currentDataIndex + childRecordCount) : (currentDataIndex);
                } else if (this.parent.editSettings.newRowPosition === 'Child') {
                    position = 'after';
                    if ((this.selectedIndex > -1 || isVirtualization) && withinRange) {
                        value.parentItem = extend({}, currentData[this.addRowIndex]);
                        value.parentUniqueID = value.parentItem.uniqueID;
                        delete value.parentItem.childRecords; delete value.parentItem[this.parent.childMapping];
                    }
                    const childRecordCount1: number = findChildrenRecords(currentData[this.addRowIndex]).length;
                    const currentDataIndex1: number = currentData[this.addRowIndex].index;
                    if (this.selectedIndex >= 0) {
                        value.level = level + 1;
                    }
                    index = (childRecordCount1 > 0) ? ( currentDataIndex1 + childRecordCount1) : (currentDataIndex1);
                    if (this.isSelfReference) {
                        if (!this.parent.isLocalData && this.parent.editModule.selectedIndex === -1) {
                            value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = null;
                        }
                        else {
                            value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = idMapping;
                        }
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below') {
                    if ((this.selectedIndex > -1 || isVirtualization) && level && withinRange) {
                        value.parentUniqueID = parentUniqueID; value.parentItem = extend({}, parentItem);
                        delete value.parentItem.childRecords; delete value.parentItem[this.parent.childMapping];
                    }
                    value.level = level;
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = parentIdMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (position != null && (this.selectedIndex > -1 || isVirtualization) && withinRange) {
                    args.index = position === 'before' ? index : index + 1;
                }
                if (this.parent.editSettings.newRowPosition === 'Bottom') {
                    level = 0;
                    const dataSource: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
                        this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
                    args.index = dataSource.length;
                }
            }
            if (isNullOrUndefined(value.level)) {
                value.level = level;
            }
            value.hasChildRecords = false; value.childRecords = []; value.index = 0;
        }
        if (args.action === 'add') {
            this.internalProperties = { level: value.level, parentItem: value.parentItem, uniqueID: value.uniqueID,
                taskData: value.taskData, parentUniqueID: isNullOrUndefined(value.parentItem) ? undefined : value.parentItem.uniqueID,
                childRecords: value.childRecords };
        }
        if (args.requestType === 'delete') {
            const deletedValues: ITreeData[] = args.data as Object[];
            const primaryKeyField: string[] = this.parent.getPrimaryKeyFieldNames();
            if (!isNullOrUndefined(primaryKeyField) && primaryKeyField.length > 0) {
                for (let i: number = 0; i < deletedValues.length; i++) {
                    const deletevalue: any = deletedValues[parseInt(i.toString(), 10)].parentItem;
                    if (deletevalue) {
                        const parentItem: ITreeData = getParentData(this.parent, deletevalue.uniqueID);
                        if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                            const childIndex: number = parentItem.childRecords.findIndex((child: any) =>
                                (deletedValues[parseInt(i.toString(), 10)] as any)[primaryKeyField[0]] === child[primaryKeyField[0]]);
                            parentItem.childRecords.splice(childIndex, 1);
                        }
                    }
                }
            }
        }
        return args;
    }


    /**
     * If the data,index and position given, Adds the record to treegrid rows otherwise it will create edit form.
     *
     * @returns {void}
     */

    public addRecord(data?: Object | Object[], index?: number, position?: RowPosition): void {
        if (this.parent.editSettings.newRowPosition === this.previousNewRowPosition || this.previousNewRowPosition === null) {
            this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        }
        if (isNullOrUndefined(index)) {
            this.isIndexUndefined = true;
        }
        if (!isNullOrUndefined(data) && Array.isArray(data)) {
            let addRecords: ITreeData[] | Object[] | Object | any = [];
            const previousEditMode: string = this.parent.editSettings.mode;
            const previousGridEditMode: string = this.parent.grid.editSettings.mode;
            if (!this.isSelfReference && !isNullOrUndefined(data) && Object.hasOwnProperty.call(data, this.parent.childMapping)) {
                addRecords.push(data);
            } else if (Array.isArray(data)) {
                addRecords = data;
            }
            this.parent.setProperties({ editSettings: { mode: 'Batch' } }, true);
            this.parent.grid.setProperties({ editSettings: { mode: 'Batch' } }, true);
            if (!isNullOrUndefined(position)) { this.parent.setProperties({ editSettings: { newRowPosition: position } }, true); }
            this.updatedRecords = { addedRecords: addRecords, changedRecords: [], deletedRecords: [] };
            if ((position === 'Above' || position === 'Below') && this.isSelfReference) {
                this.isAddedMultipleRowsByMethod = true;
                this.multipleRowIndex = index;
                this.addRowIndex = index;
                this.parent.notify(events.batchAdd, { updatedRecords: this.updatedRecords, index: index });
            }
            const updatedRecords : BatchChanges = this.updatedRecords;
            this.parent.notify(events.batchSave, { updatedRecords, index });
            this.parent.setProperties({ editSettings: { mode: previousEditMode } }, true);
            this.parent.grid.setProperties({ editSettings: { mode: previousGridEditMode } }, true);
            this.parent.refresh();
        }
        else if (!this.isSelfReference && !isNullOrUndefined(data) && Object.hasOwnProperty.call(data, this.parent.childMapping)) {
            const addRecords: ITreeData[]  | Object[] | Object | any = [];
            const previousEditMode: string = this.parent.editSettings.mode;
            const previousGridEditMode: string = this.parent.grid.editSettings.mode;
            addRecords.push(data);
            this.parent.setProperties({ editSettings: { mode: 'Batch' } }, true);
            this.parent.grid.setProperties({ editSettings: { mode: 'Batch' } }, true);
            if (!isNullOrUndefined(position)) { this.parent.setProperties({ editSettings: { newRowPosition: position } }, true); }
            this.updatedRecords = { addedRecords: addRecords, changedRecords: [], deletedRecords: [] };
            const updatedRecords: BatchChanges = this.updatedRecords;
            this.parent.notify(events.batchSave, { updatedRecords, index });
            this.parent.setProperties({ editSettings: { mode: previousEditMode } }, true);
            this.parent.grid.setProperties({ editSettings: { mode: previousGridEditMode } }, true);
            this.parent.refresh();
        }
        else {
            if (data) {
                if (index > -1) {
                    this.selectedIndex = index;
                    this.addRowIndex = index;
                } else {
                    this.selectedIndex = this.parent.selectedRowIndex;
                    this.addRowIndex = this.parent.selectedRowIndex;
                    index = this.parent.selectedRowIndex;
                }
                if (position) {
                    this.parent.setProperties({ editSettings: { newRowPosition: position } }, true);
                }
                this.parent.grid.editModule.addRecord(data, index);
            } else {
                this.parent.grid.editModule.addRecord(data, index);
            }
        }
    }

    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     *
     * @returns {boolean} Returns form validation results
     */
    public editFormValidate(): boolean {
        return this.parent.grid.editModule.editFormValidate();
    }

    /**
     * @hidden
     * @returns {void}
     */
    public destroyForm(): void {
        this.parent.grid.editModule.destroyForm();
    }

    private contentready (e: { rows: Row<Column>[], args?: NotifyArgs }): void {
        if (!isNullOrUndefined(e.args.requestType)
      && (e.args.requestType.toString() === 'delete' || e.args.requestType.toString() === 'save'
        || (this.parent.editSettings.mode === 'Batch' && e.args.requestType.toString() === 'batchsave'))) {
            this.updateIndex(this.parent.grid.dataSource, this.parent.getRows(), this.parent.getCurrentViewRecords());
            if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
                if ((this.parent.grid.dataSource as Object[]).length === this.parent.getDataRows().length) {
                    this.updateIndex(this.parent.grid.dataSource, this.parent.getDataRows(), this.parent.getCurrentViewRecords());
                }
            }
        }
    }

    /**
     * If the row index and field is given, edits the particular cell in a row.
     *
     * @returns {void}
     */

    public editCell(rowIndex?: number, field?: string): void {
        if (this.parent.editSettings.mode === 'Cell' || this.parent.editSettings.mode === 'Batch') {
            this.parent.grid.editModule.editCell(rowIndex, field);
        }
    }

    /**
     * Cancels edited state.
     *
     * @returns {void}
     */
    private closeEdit(): void {
        if (this.parent.enableVirtualization && this.parent.grid.editSettings.mode === 'Batch' && this.parent.grid.pageSettings.currentPage > 1) {
            this.editedRowIndex = this.parent.grid.editModule.editModule['cellDetails'].rowIndex;
            this.parent.grid.editModule.editModule['cellDetails'].rowIndex = parseInt(this.parent.getRows()[this.parent.grid.editModule.editModule['cellDetails'].rowIndex].getAttribute('aria-rowIndex'), 10) - 1;
        }
        this.parent.grid.editModule.closeEdit();
    }

    /**
     * Handles TreeGrid-specific validation for tooltip positioning on last row.
     *
     * @param {Object} args - Validation flags
     * @param {boolean} args.isBeginEdit - Whether editing has begun
     * @param {boolean} args.isAddedRow - Whether the row is newly added
     * @param {boolean} args.isLastRow - Whether this is the last row
     * @param {boolean} args.validationPositionResult - Validation position result
     * @returns {void}
     * @hidden
     */
    private lastRowValidation(args: {
        isBeginEdit: boolean;
        isAddedRow: boolean;
        isLastRow: boolean;
        validationPositionResult: boolean;
    }): void {
        if (!this.parent.enableVirtualization) {
            return;
        }
        const { isBeginEdit, isAddedRow, isLastRow } = args;
        const newRowPosition: string = this.parent.editSettings.newRowPosition;

        if ((newRowPosition === 'Child' || newRowPosition === 'Below' || newRowPosition === 'Above') &&
            isAddedRow && isLastRow) {
            args.validationPositionResult = true;
        }
        else if (isBeginEdit && isLastRow) {
            args.validationPositionResult = true;
        }
    }
}
