import { Dialog } from '@syncfusion/ej2-popups';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotActionInfo, DrillThroughEventArgs, EditCompletedEventArgs } from '../base/interface';
import { createElement, setStyleAttribute, remove, isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, closest } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { Grid, ColumnModel, Reorder, Resize, ColumnChooser, Toolbar, ExcelExport, PdfExport } from '@syncfusion/ej2-grids';
import { VirtualScroll, Selection, Edit, Page, CommandColumn } from '@syncfusion/ej2-grids';
import { IDataSet, INumberIndex, IDataOptions, PivotEngine } from '../../base/engine';
import * as events from '../../common/base/constant';
import { OlapEngine } from '../../base/olap/engine';
import { NumericTextBox } from '@syncfusion/ej2-inputs';

/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
/** @hidden */
export class DrillThroughDialog {
    public parent: PivotView;
    /** @hidden */
    public dialogPopUp: Dialog;
    /** @hidden */
    public drillThroughGrid: Grid;
    /** @hidden */
    public indexString: string[] = [];
    private clonedData: IDataSet[] = [];
    private isUpdated: boolean = false;
    private gridIndexObjects: INumberIndex = {};
    private engine: PivotEngine | OlapEngine;
    private gridData: IDataSet[] = [];
    private numericTextBox: NumericTextBox;
    private formatList: { [key: string]: string } = {};
    private drillKeyConfigs: { [key: string]: string } = {
        escape: 'escape'
    };
    private drillthroughKeyboardModule: KeyboardEvents;

    /* eslint-disable-next-line */
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotView) {   /* eslint-disable-line */
        this.parent = parent;
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
    }

    private frameHeaderWithKeys(header: any): IDataSet {    /* eslint-disable-line */
        let keys: string[] = Object.keys(header);
        let keyPos: number = 0;
        let framedHeader: any = {}; /* eslint-disable-line */
        while (keyPos < keys.length) {
            framedHeader[keys[keyPos]] = header[keys[keyPos]];
            keyPos++;
        }
        return framedHeader;
    }

    /* eslint-disable-next-line */
    /** @hidden */
    public showDrillThroughDialog(eventArgs: DrillThroughEventArgs): void {
        this.gridData = eventArgs.rawData;
        for (let i: number = 0; i < eventArgs.rawData.length; i++) {
            this.clonedData.push(this.frameHeaderWithKeys(eventArgs.rawData[i]));
        }
        let actualText: string = eventArgs.currentCell.actualText.toString();
        try {
            if (this.parent.currentView === 'Table' && this.parent.editSettings.allowInlineEditing &&
                this.parent.editSettings.allowEditing && eventArgs.rawData.length === 1) {
                this.parent.actionObj.actionName = events.editRecord;
                if (this.parent.actionBeginMethod()) {
                    return;
                }
                this.editCell(eventArgs);
            } else {
                this.removeDrillThroughDialog();
                let drillThroughDialog: HTMLElement = createElement('div', {
                    id: this.parent.element.id + '_drillthrough',
                    className: cls.DRILLTHROUGH_DIALOG
                });
                this.parent.element.appendChild(drillThroughDialog);
                this.dialogPopUp = new Dialog({
                    animationSettings: { effect: 'Fade' },
                    allowDragging: false,
                    header: this.parent.localeObj.getConstant('details'),
                    content: this.createDrillThroughGrid(eventArgs),
                    cssClass: this.parent.cssClass,
                    beforeOpen: () => {
                        this.drillThroughGrid.setProperties({
                            dataSource: this.parent.editSettings.allowEditing ?
                                this.dataWithPrimarykey(eventArgs) : this.gridData,
                            height: !this.parent.editSettings.allowEditing ? 300 : 220
                        }, false);
                    },
                    beforeClose: () => {
                        if (this.parent.editSettings.allowEditing && this.isUpdated) {
                            if (this.parent.dataSourceSettings.type === 'CSV') {
                                this.updateData(this.drillThroughGrid.dataSource as IDataSet[]);
                            }
                            let gridIndexObjectsValue: string[] = Object.keys(this.gridIndexObjects);
                            let previousPosition: number[] = [];
                            for (let value of gridIndexObjectsValue) {
                                previousPosition.push(this.gridIndexObjects[value]);
                            }
                            let count: number = Object.keys(this.gridIndexObjects).length;
                            let addItems: IDataSet[] = [];
                            let prevItems: IDataSet[] = [];
                            let index: number = 0;
                            /* eslint-disable @typescript-eslint/dot-notation */
                            for (let item of this.drillThroughGrid.dataSource as IDataSet[]) {
                                if (isNullOrUndefined(item['__index']) || item['__index'] === '') {
                                    for (let field of this.engine.fields) {
                                        if (isNullOrUndefined(item[field])) {
                                            delete item[field];
                                        }
                                    }
                                    delete item['__index'];
                                    addItems.push(item);
                                } else if (count > 0) {
                                    delete this.gridIndexObjects[item['__index'].toString()];
                                    prevItems.push(item);
                                    count--;
                                }
                                if (this.parent.dataSourceSettings.mode === 'Server') {
                                    if (item['__index']) {
                                        delete item['__index'];
                                    }
                                    if (this.gridData[index]['__index']) {
                                        delete this.gridData[index]['__index'];
                                    }
                                }
                                index++;
                            }
                            count = 0;
                            if (this.parent.dataSourceSettings.mode === 'Server') {
                                let gridIndex: object[] = [];   /* eslint-disable-line */
                                let keys: string[] = Object.keys(this.gridIndexObjects);
                                for (let len: number = 0; len < keys.length; len++) {
                                    delete this.parent.drillThroughValue.indexObject[this.gridIndexObjects[keys[len]]];
                                    gridIndex.push({ Key: keys[len], Value: this.gridIndexObjects[keys[len]] });    /* eslint-disable-line */
                                }
                                let indexObject: object[] = []; /* eslint-disable-line */
                                keys = Object.keys(this.parent.drillThroughValue.indexObject);
                                for (let len: number = 0; len < keys.length; len++) {
                                    indexObject.push({ Key: keys[len], Value: this.parent.drillThroughValue.indexObject[keys[len]] });  /* eslint-disable-line */
                                }
                                this.parent.getEngine('updateRawData', null, null, null, null, null, null, null, { 'addedData': addItems, 'removedData': gridIndex, 'updatedData': prevItems, indexObject: indexObject });
                            } else {
                                let items: IDataSet[] = [];
                                let data: IDataSet[] | string[][] = (this.parent.allowDataCompression && this.parent.enableVirtualization) ?
                                    this.parent.engineModule.actualData : this.parent.engineModule.data;
                                for (let item of data as IDataSet[]) {
                                    delete item['__index'];
                                    if (this.gridIndexObjects[count.toString()] === undefined) {
                                        items.push(item);
                                    }
                                    count++;
                                }
                                /* eslint-enable @typescript-eslint/dot-notation */
                                items = items.concat(addItems);
                                let eventArgs: EditCompletedEventArgs = {
                                    currentData: this.drillThroughGrid.dataSource as IDataSet[],
                                    previousData: this.clonedData,
                                    previousPosition: previousPosition,
                                    cancel: false
                                };
                                this.parent.trigger(events.editCompleted, eventArgs);
                                if (!eventArgs.cancel) {
                                    this.parent.setProperties({ dataSourceSettings: { dataSource: items } }, true);
                                    (this.engine as PivotEngine).updateGridData(this.parent.dataSourceSettings as IDataOptions);
                                    this.parent.pivotValues = this.engine.pivotValues;
                                }
                            }
                            this.parent.actionObj.actionName = events.recordUpdated;
                            let actionInfo: PivotActionInfo = {
                                editInfo: {
                                    type: this.drillThroughGrid.editSettings.mode, action: 'Update', currentData: this.drillThroughGrid.dataSource as IDataSet[],
                                    previousData: this.clonedData, previousPosition: previousPosition
                                }
                            }
                            this.parent.actionObj.actionInfo = actionInfo;
                        }
                        this.isUpdated = false;
                        this.gridIndexObjects = {};
                    },
                    isModal: true,
                    visible: true,
                    showCloseIcon: true,
                    locale: this.parent.locale,
                    enableRtl: this.parent.enableRtl,
                    width: this.parent.isAdaptive ? '100%' : '60%',
                    position: { X: 'center', Y: 'center' }, /* eslint-disable-line */
                    closeOnEscape: !this.parent.editSettings.allowEditing,
                    target: document.body,
                    close: this.removeDrillThroughDialog.bind(this)
                });
                this.dialogPopUp.isStringTemplate = true;
                this.dialogPopUp.appendTo(drillThroughDialog);
                // this.dialogPopUp.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('details');
                setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
                if (this.parent.editSettings.allowEditing) {
                    this.drillthroughKeyboardModule = new KeyboardEvents(this.dialogPopUp.element, {
                        keyAction: this.drillthroughKeyActionHandler.bind(this),
                        keyConfigs: this.drillKeyConfigs,
                        eventName: 'keydown'
                    });
                }
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private editCell(eventArgs: DrillThroughEventArgs): void {
        let gridResize: boolean = this.parent.gridSettings.allowResizing;
        let actualText: string = eventArgs.currentCell.actualText.toString();
        let indexObject: number = Number(Object.keys(eventArgs.currentCell.indexObject));
        (eventArgs.currentTarget.firstElementChild as HTMLElement).style.display = 'none';
        let cellValue: number = Number(eventArgs.rawData[0][actualText]);
        /* eslint-disable */
        let previousData: any = this.frameHeaderWithKeys(eventArgs.rawData[eventArgs.rawData.length - 1]);
        let currentData: any = eventArgs.rawData[eventArgs.rawData.length - 1];
        /* eslint-enable */
        // if (eventArgs.currentCell.actualText in previousData) {
        //     currentData[eventArgs.currentCell.actualText] = eventArgs.currentCell.actualValue;
        // }
        let actionInfo: PivotActionInfo = {
            editInfo: { type: 'Inline editing', action: 'update', data: this.gridData }
        }
        this.parent.actionObj.actionInfo = actionInfo;
        this.numericTextBox = new NumericTextBox({
            value: cellValue,
            enableRtl: this.parent.enableRtl,
            enabled: true,
            format: '####.##',
            locale: this.parent.locale,
            cssClass: this.parent.cssClass,
            change: () => {
                let textBoxValue: number = this.numericTextBox.value;
                let indexValue: number = eventArgs.currentCell.indexObject[indexObject];
                eventArgs.rawData[0][actualText] = textBoxValue;
                this.parent.engineModule.data[indexValue] = eventArgs.rawData[0];
            },
            blur: () => {
                let eventArgs: EditCompletedEventArgs = {
                    currentData: currentData,
                    previousData: previousData,
                    previousPosition: currentData.index,
                    cancel: false
                };
                this.parent.trigger(events.editCompleted, eventArgs);
                if (!eventArgs.cancel) {
                    this.parent.setProperties({ dataSourceSettings: { dataSource: this.parent.engineModule.data } }, true);
                    (this.engine as PivotEngine).updateGridData(this.parent.dataSourceSettings as IDataOptions);
                    this.parent.pivotValues = this.engine.pivotValues;
                    this.parent.gridSettings.allowResizing = gridResize;
                }
            }
        });
        let textBoxElement: HTMLElement = createElement('input', {
            id: this.parent.element.id + '_inputbox'
        });
        eventArgs.currentTarget.appendChild(textBoxElement);
        this.numericTextBox.appendTo(textBoxElement);
        eventArgs.currentCell.value = this.numericTextBox.value;
        this.numericTextBox.focusIn();
        this.parent.gridSettings.allowResizing = false;
    }

    /* eslint-disable , @typescript-eslint/no-explicit-any */
    private updateData(dataSource: IDataSet[]): void {
        let dataPos: number = 0;
        let data: string[][] = (this.parent.allowDataCompression && this.parent.enableVirtualization) ?
            this.parent.engineModule.actualData as string[][] : this.parent.engineModule.data as string[][];
        while (dataPos < dataSource.length) {
            let fields: string[] = Object.keys((dataSource as any)[dataPos]);
            let keyPos: number = 0;
            let framedSet: any = [];
            while (keyPos < fields.length) {
                if (!isNullOrUndefined(this.parent.engineModule.fieldKeys[fields[keyPos]])) {
                    framedSet[this.parent.engineModule.fieldKeys[fields[keyPos]] as any] = (dataSource as any)[dataPos][fields[keyPos]];
                }
                keyPos++;
            }
            data[(dataSource as any)[dataPos]['__index']] = framedSet;  /* eslint-disable-line */
            dataPos++;
        }
        if (this.parent.allowDataCompression && this.parent.enableVirtualization) {
            this.parent.engineModule.actualData = data;
        } else {
            this.parent.engineModule.data = data;
        }
    }

    private removeDrillThroughDialog(): void {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.parent.actionObj.actionName = events.drillThroughClosed;
            if (this.parent.actionObj.actionName) {
                this.parent.actionCompleteMethod();
            }
            this.dialogPopUp.destroy();
        }
        let dialogElement: HTMLElement = document.getElementById(this.parent.element.id + '_drillthrough');
        if (dialogElement) {
            remove(dialogElement);
        }
        if (document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg')) {
            remove(document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg'));
        }
    }

    /* eslint-disable  */
    private createDrillThroughGrid(eventArgs: DrillThroughEventArgs): HTMLElement {
        let drillThroughBody: HTMLElement =
            createElement('div', { id: this.parent.element.id + '_drillthroughbody', className: cls.DRILLTHROUGH_BODY_CLASS });
        let drillThroughBodyHeader: HTMLElement =
            createElement('div', {
                id: this.parent.element.id +
                    '_drillthroughbodyheader', className: cls.DRILLTHROUGH_BODY_HEADER_CONTAINER_CLASS
            });
        if (eventArgs.rowHeaders !== '') {
            drillThroughBodyHeader.innerHTML = '<span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' + cls.DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                this.parent.localeObj.getConstant('row') + '</span> : <span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + eventArgs.rowHeaders + '</span></span>';
        }
        if (eventArgs.columnHeaders !== '') {
            drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                cls.DRILLTHROUGH_BODY_HEADER_CLASS + '>' + this.parent.localeObj.getConstant('column') +
                '</span> : <span class=' + cls.DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' +
                eventArgs.columnHeaders + '</span></span>';
        }
        if (eventArgs.value !== '') {
            let measure: string = eventArgs.value.split('(')[0];
            let value: string = eventArgs.value.split('(')[1].split(')')[0];
            if (value !== '0') {
                drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                    cls.DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                    cls.DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                    measure + '</span> : <span class=' + cls.DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + value + '</span></span>';
            }
        }
        let toolbarItems: string[] = ['ColumnChooser'];
        if (this.parent.editSettings.allowEditing) {
            if (this.parent.editSettings.allowCommandColumns) {
                toolbarItems = ['ColumnChooser', 'Add'];
            } else if (this.parent.editSettings.mode === 'Batch') {
                toolbarItems = ['ColumnChooser', 'Add', 'Delete', 'Update', 'Cancel'];
            } else if (this.parent.editSettings.mode === 'Dialog') {
                toolbarItems = ['ColumnChooser', 'Add', 'Edit', 'Delete'];
            } else {
                toolbarItems = ['ColumnChooser', 'Add', 'Edit', 'Delete', 'Update', 'Cancel'];
            }
        }
        let drillThroughGrid: HTMLElement =
            createElement('div', { id: this.parent.element.id + '_drillthroughgrid', className: cls.DRILLTHROUGH_GRID_CLASS });
        Grid.Inject(Selection, Reorder, Resize, Toolbar, ColumnChooser);
        this.drillThroughGrid = new Grid({
            cssClass: this.parent.cssClass,
            gridLines: 'Default',
            allowResizing: true,
            allowReordering: true,
            showColumnChooser: true,
            enableHover: false,
            toolbar: toolbarItems,
            columns: eventArgs.gridColumns,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enableVirtualization: !this.parent.editSettings.allowEditing,
            allowPaging: this.parent.editSettings.allowEditing,
            pageSettings: { pageSize: 20 },
            rowHeight: this.parent.gridSettings.rowHeight
        });
        if (this.parent.dataType === 'olap') {
            this.formatData();
        }
        let dialogModule: DrillThroughDialog = this;
        this.parent.trigger(events.beginDrillThrough, {
            cellInfo: eventArgs,
            gridObj: this.drillThroughGrid,
            type: 'editing'
        });
        if (this.drillThroughGrid.allowExcelExport) {
            Grid.Inject(ExcelExport);
        }
        if (this.drillThroughGrid.allowPdfExport) {
            Grid.Inject(PdfExport);
        }
        if (this.parent.editSettings.allowEditing) {
            Grid.Inject(Edit, Page);
            try {
                this.drillThroughGrid.editSettings = this.parent.editSettings;
                this.drillThroughGrid.actionBegin = (args: any) => {
                    let actionName: string = (args.requestType == 'save') ? events.saveEditedRecords : (args.requestType == 'add') ? events.addNewRecord : (args.requestType == 'delete') ? events.removeRecord : '';
                    this.parent.actionObj.actionName = actionName;
                    if (this.parent.actionObj.actionName) {
                        if (this.parent.actionBeginMethod()) {
                            return;
                        }
                    }
                }
                if (this.parent.editSettings.allowCommandColumns) {
                    this.drillThroughGrid.editSettings.mode = 'Normal';
                    this.drillThroughGrid.editSettings.allowEditOnDblClick = false;
                    Grid.Inject(CommandColumn);
                    (this.drillThroughGrid.columns as ColumnModel[]).push({
                        headerText: this.parent.localeObj.getConstant('manageRecords'), width: 160, showInColumnChooser: false,
                        commands: [
                            { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '') } },
                            { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '') } },
                            { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '') } },
                            { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : '') } }]
                    });
                } else {
                    this.drillThroughGrid.editSettings.allowEditOnDblClick = this.parent.editSettings.allowEditOnDblClick;
                }
                (this.drillThroughGrid.columns as ColumnModel[]).push({
                    field: '__index', visible: false, isPrimaryKey: true, type: 'string', showInColumnChooser: false
                });
            } catch (execption) {
                this.parent.actionFailureMethod(execption);
            }
            this.drillThroughGrid.actionComplete = (args: any) => {
                if (args.requestType === 'batchsave' || args.requestType === 'save' || args.requestType === 'delete') {
                    dialogModule.isUpdated = true;
                }
                this.parent.actionObj.actionName = this.parent.getActionCompleteName();
                let actionInfo: PivotActionInfo = {
                    editInfo: { type: this.drillThroughGrid.editSettings.mode, action: args.requestType, data: this.gridData }
                }
                this.parent.actionObj.actionInfo = actionInfo;
                if (this.parent.actionObj.actionName) {
                    this.parent.actionCompleteMethod();
                }
                if ((dialogModule.drillThroughGrid.editSettings.mode === 'Normal' && args.requestType === 'save' &&
                    dialogModule.drillThroughGrid.element.querySelectorAll('.e-tbar-btn:hover').length > 0 &&
                    !dialogModule.parent.editSettings.allowCommandColumns) || args.requestType === 'batchsave') {
                    dialogModule.dialogPopUp.hide();
                }
            };
            this.drillThroughGrid.beforeBatchSave = () => {
                dialogModule.isUpdated = true;
            };
            /* eslint-enable @typescript-eslint/indent */
        } else {
            Grid.Inject(VirtualScroll);
        }
        document.body.appendChild(drillThroughGrid);
        this.drillThroughGrid.isStringTemplate = true;
        this.drillThroughGrid.appendTo(drillThroughGrid);
        drillThroughBody.appendChild(drillThroughBodyHeader);
        drillThroughBody.appendChild(drillThroughGrid);
        return drillThroughBody;
    }
    /** @hidden */
    public frameGridColumns(rawData: IDataSet[]): ColumnModel[] {
        let keys: string[] = this.parent.dataType === 'olap' ? rawData[0] ? Object.keys(rawData[0]) : [] :
            Object.keys(this.engine.fieldList);
        let columns: ColumnModel[] = [];
        if (this.parent.dataSourceSettings.formatSettings.length > 0) {
            for (let i: number = 0; i < this.parent.dataSourceSettings.formatSettings.length; i++) {
                this.formatList[this.parent.dataSourceSettings.formatSettings[i].name] = this.parent.dataSourceSettings.formatSettings[i].format;
            }
        }
        if (this.parent.dataType === 'olap') {
            for (let key of keys) {
                columns.push({
                    field: key.replace(/_x005B_|_x0020_|_x005D_|_x0024_/g, '').replace('].[', '').split('.').reverse().join(''),
                    headerText: key.replace(/_x005B_|_x005D_|_x0024_/g, '').replace(/_x0020_/g, ' ').
                        replace('].[', '').split('.').reverse().join('.'),
                    width: 120,
                    visible: true,
                    validationRules: { required: true },
                    format: !isNullOrUndefined(this.formatList[key]) ? this.formatList[key] : null,
                    type: !isNullOrUndefined(this.formatList[key]) ? null : 'string'
                });
            }
        } else {
            for (let key of keys) {
                if (this.engine.fieldList[key].aggregateType !== 'CalculatedField') {
                    let editType: string = '';
                    let isDateField: boolean = ((this.engine.fieldList[key].type === 'date' || this.engine.fieldList[key].type === 'datetime')
                        && (this.isDateFieldExist(key) || (rawData[0] && rawData[0][key] && rawData[0][key].toString().indexOf(' ') === -1))) ? true : false;
                    if (this.engine.fieldList[key].type === 'number') {
                        editType = 'numericedit';
                    } else if (this.engine.fieldList[key].type === 'date' && isDateField) {
                        editType = 'datepickeredit';
                    } else if (this.engine.fieldList[key].type === 'datetime' && isDateField) {
                        editType = 'datetimepickeredit';
                    } else {
                        editType = 'defaultedit';
                    }
                    columns.push({
                        field: key,
                        headerText: this.engine.fieldList[key].caption,
                        width: 120,
                        visible: this.engine.fieldList[key].isSelected,
                        validationRules: { required: true },
                        editType: editType,
                        format: !isNullOrUndefined(this.formatList[key]) ? this.formatList[key] : undefined,
                        type: !isNullOrUndefined(this.formatList[key]) ? null : 'string'
                    });
                }
            }
        }
        return columns;
    }

    private isDateFieldExist(key: string): boolean {
        for (let len: number = 0; len < this.parent.dataSourceSettings.formatSettings.length; len++) {
            if (this.parent.dataSourceSettings.formatSettings[len].name === key &&
                this.parent.dataSourceSettings.formatSettings[len].type.indexOf('date') > -1) {
                return true;
            }
        }
        for (let len: number = 0; len < this.parent.dataSourceSettings.fieldMapping.length; len++) {
            if (this.parent.dataSourceSettings.fieldMapping[len].name === key &&
                this.parent.dataSourceSettings.fieldMapping[len].dataType &&
                this.parent.dataSourceSettings.fieldMapping[len].dataType.indexOf('date') > -1) {
                return true;
            }
        }
        return false;
    }

    private formatData(): void {
        let index: number = 0;
        while (index < this.gridData.length) {
            let data: IDataSet = this.gridData[index];
            let keys: string[] = Object.keys(this.gridData[index]);
            let newData: IDataSet = {};
            let i: number = 0;
            while (i < keys.length) {
                let key: string = keys[i].replace(/_x005B_|_x0020_|_x005D_|_x0024_/g, '').replace('].[', '').split('.').reverse().join('');
                newData[key] = data[keys[i]];
                i++;
            }
            this.gridData[index] = newData;
            index++;
        }
    }

    private dataWithPrimarykey(eventArgs: DrillThroughEventArgs): IDataSet[] {
        let indexString: string[] = this.indexString.length > 0 ? this.indexString : Object.keys(eventArgs.currentCell.indexObject);
        let rawData: IDataSet[] = this.gridData;
        let count: number = 0;
        for (let item of rawData) {
            item['__index'] = indexString[count];
            this.gridIndexObjects[indexString[count].toString()] = Number(indexString[count]);
            count++;
        }
        return rawData;
    }

    private drillthroughKeyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'escape':
                this.processClose(e);
                break;
        }
    }

    private processClose(e: Event): void {
        let target: Element = e.target as Element;
        if (target && closest(target, '.e-popup.e-popup-open')) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            let dialogInstance: Dialog = ((<HTMLElement>closest(target, '.e-popup.e-popup-open')) as any).ej2_instances[0] as Dialog;
            if (dialogInstance && !dialogInstance.closeOnEscape) {
                let button: string = dialogInstance.element.getAttribute('data-fieldName');
                dialogInstance.hide();
                if (this.parent.element) {
                    let pivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-pivot-button'));
                    for (let item of pivotButtons) {
                        if (item.getAttribute('data-uid') === button) {
                            item.focus();
                            break;
                        }
                    }
                }
                e.preventDefault();
                return;
            }
        }
    }

    /**
     * To destroy the drillthrough keyboard module.
     * @returns  {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.drillthroughKeyboardModule && !this.drillthroughKeyboardModule.isDestroyed) {
            this.drillthroughKeyboardModule.destroy();
            this.drillthroughKeyboardModule = null;
        }
        else {
            return;
        }
    }
}
