import { Dialog } from '@syncfusion/ej2-popups';
import { SanitizeHtmlHelper, getInstance } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotActionInfo, DrillThroughEventArgs, EditCompletedEventArgs } from '../base/interface';
import { createElement, setStyleAttribute, remove, isNullOrUndefined, KeyboardEvents, KeyboardEventArgs, closest } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { Grid, ColumnModel, Reorder, Resize, ColumnChooser, Toolbar, ExcelExport, PdfExport, ActionEventArgs } from '@syncfusion/ej2-grids';
import { VirtualScroll, Selection, Edit, Page, CommandColumn } from '@syncfusion/ej2-grids';
import { IDataSet, INumberIndex, IDataOptions, PivotEngine } from '../../base/engine';
import * as events from '../../common/base/constant';
import { OlapEngine } from '../../base/olap/engine';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { PivotUtil } from '../../base/util';

/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
/** @hidden */
export class DrillThroughDialog {
    /** @hidden */
    public parent: PivotView;
    /** @hidden */
    public dialogPopUp: Dialog;
    /** @hidden */
    public drillThroughGrid: Grid;
    /** @hidden */
    public indexString: string[] = [];
    private isUpdated: boolean = false;
    private engine: PivotEngine | OlapEngine;
    private drillthroughKeyboardModule: KeyboardEvents;

    /**
     * Constructor for the dialog action.
     *
     * @param {PivotView} parent - parent.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
    }

    /**
     * show Drill Through Dialog
     *
     * @param {DrillThroughEventArgs} eventArgs - eventArgs.
     * @returns {void}
     * @hidden */
    public showDrillThroughDialog(eventArgs: DrillThroughEventArgs): void {
        const gridData: IDataSet[] = eventArgs.rawData;
        const clonedData: IDataSet[] = [];
        let gridIndexObjects: INumberIndex = {};
        for (let i: number = 0; i < eventArgs.rawData.length; i++) {
            clonedData.push(PivotUtil.frameHeaderWithKeys(eventArgs.rawData[i as number]) as IDataSet);
        }
        // let actualText: string = eventArgs.currentCell.actualText.toString();
        try {
            if (this.parent.currentView === 'Table' && this.parent.editSettings.allowInlineEditing &&
                this.parent.editSettings.allowEditing && eventArgs.rawData.length === 1) {
                this.parent.actionObj.actionName = events.editRecord;
                if (this.parent.actionBeginMethod()) {
                    return;
                }
                this.editCell(eventArgs, gridData);
            } else {
                this.removeDrillThroughDialog();
                const drillThroughDialog: HTMLElement = createElement('div', {
                    id: this.parent.element.id + '_drillthrough',
                    className: cls.DRILLTHROUGH_DIALOG
                });
                this.parent.element.appendChild(drillThroughDialog);
                this.dialogPopUp = new Dialog({
                    animationSettings: { effect: 'Fade' },
                    allowDragging: false,
                    header: this.parent.localeObj.getConstant('details'),
                    content: this.createDrillThroughGrid(eventArgs, gridData),
                    cssClass: this.parent.cssClass,
                    beforeOpen: () => {
                        this.drillThroughGrid.setProperties({
                            dataSource: this.parent.editSettings.allowEditing ?
                                this.dataWithPrimarykey(eventArgs, gridData, gridIndexObjects) : gridData,
                            height: !this.parent.editSettings.allowEditing ? 300 : 220
                        }, false);
                    },
                    beforeClose: () => {
                        if (this.parent.editSettings.allowEditing && this.isUpdated) {
                            if (this.parent.dataSourceSettings.type === 'CSV') {
                                this.updateData(this.drillThroughGrid.dataSource as IDataSet[]);
                            }
                            const gridIndexObjectsValue: string[] = Object.keys(gridIndexObjects);
                            const previousPosition: number[] = [];
                            for (const value of gridIndexObjectsValue) {
                                previousPosition.push(gridIndexObjects[value as string]);
                            }
                            let count: number = Object.keys(gridIndexObjects).length;
                            const addItems: IDataSet[] = [];
                            const prevItems: IDataSet[] = [];
                            let index: number = 0;
                            for (const item of this.drillThroughGrid.dataSource as IDataSet[]) {
                                if (item['__index'] === '0' || item['__index'] === '') {
                                    for (const field of this.engine.fields) {
                                        if (isNullOrUndefined(item[field as string])) {
                                            delete item[field as string];
                                        }
                                    }
                                    delete item['__index'];
                                    addItems.push(item);
                                } else if (count > 0) {
                                    delete gridIndexObjects[item['__index'].toString()];
                                    prevItems.push(item);
                                    count--;
                                }
                                if (this.parent.dataSourceSettings.mode === 'Server') {
                                    if (item['__index']) {
                                        delete item['__index'];
                                    }
                                    if (gridData[index as number]['__index']) {
                                        delete gridData[index as number]['__index'];
                                    }
                                }
                                index++;
                            }
                            count = 0;
                            if (this.parent.dataSourceSettings.mode === 'Server') {
                                const gridIndex: object[] = [];
                                const keys: string[] = Object.keys(gridIndexObjects);
                                for (let len: number = 0; len < keys.length; len++) {
                                    delete this.parent.drillThroughValue.indexObject[gridIndexObjects[keys[len as number]]];
                                    gridIndex.push({ Key: keys[len as number], Value: gridIndexObjects[keys[len as number]] });
                                }
                                this.parent.getEngine('updateRawData', null, null, null, null, null, null, null, {
                                    'addedData': addItems, 'removedData': gridIndex, 'updatedData': prevItems,
                                    indexObject: this.parent.drillThroughValue.indexObject as ReturnType<typeof Object>
                                });
                            } else {
                                let items: IDataSet[] = [];
                                const data: IDataSet[] | string[][] = this.parent.allowDataCompression
                                    ? this.parent.engineModule.actualData : this.parent.engineModule.data;
                                for (const item of data as IDataSet[]) {
                                    delete item['__index'];
                                    if (gridIndexObjects[count.toString()] === undefined) {
                                        items.push(item);
                                    }
                                    count++;
                                }
                                items = items.concat(addItems);
                                const eventArgs: EditCompletedEventArgs = {
                                    currentData: this.drillThroughGrid.dataSource as IDataSet[],
                                    previousData: clonedData,
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
                            const actionInfo: PivotActionInfo = {
                                editInfo: {
                                    type: this.drillThroughGrid.editSettings.mode, action: 'Update', currentData: this.drillThroughGrid.dataSource as IDataSet[],
                                    previousData: clonedData, previousPosition: previousPosition
                                }
                            };
                            this.parent.actionObj.actionInfo = actionInfo;
                        }
                        this.isUpdated = false;
                        gridIndexObjects = {};
                    },
                    isModal: true,
                    visible: true,
                    showCloseIcon: true,
                    locale: this.parent.locale,
                    enableRtl: this.parent.enableRtl,
                    enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                    width: this.parent.isAdaptive ? '100%' : '60%',
                    position: { X: 'center', Y: 'center' },
                    closeOnEscape: !this.parent.editSettings.allowEditing,
                    target: document.body,
                    close: this.removeDrillThroughDialog.bind(this)
                });
                this.dialogPopUp.isStringTemplate = true;
                this.dialogPopUp.appendTo(drillThroughDialog);
                // this.dialogPopUp.element.querySelector('.e-dlg-header').innerText = this.parent.localeObj.getConstant('details');
                setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
                const drillKeyConfigs: { [key: string]: string } = {
                    escape: 'escape'
                };
                if (this.parent.editSettings.allowEditing) {
                    this.drillthroughKeyboardModule = new KeyboardEvents(this.dialogPopUp.element, {
                        keyAction: this.drillthroughKeyActionHandler.bind(this),
                        keyConfigs: drillKeyConfigs,
                        eventName: 'keydown'
                    });
                }
            }
        } catch (execption) {
            this.parent.actionFailureMethod(execption);
        }
    }

    private editCell(eventArgs: DrillThroughEventArgs, gridData: IDataSet[]): void {
        const gridResize: boolean = this.parent.gridSettings.allowResizing;
        const actualText: string = eventArgs.currentCell.actualText.toString();
        const indexObject: number = Number(Object.keys(eventArgs.currentCell.indexObject));
        (eventArgs.currentTarget.firstElementChild as HTMLElement).style.display = 'none';
        const cellValue: number = Number(eventArgs.rawData[0][actualText as string]);
        const previousData: IDataSet = PivotUtil.frameHeaderWithKeys(eventArgs.rawData[eventArgs.rawData.length - 1]) as IDataSet;
        const currentData: IDataSet = eventArgs.rawData[eventArgs.rawData.length - 1];
        // if (eventArgs.currentCell.actualText in previousData) {
        //     currentData[eventArgs.currentCell.actualText] = eventArgs.currentCell.actualValue;
        // }
        const actionInfo: PivotActionInfo = {
            editInfo: { type: 'Inline editing', action: 'update', data: gridData }
        };
        this.parent.actionObj.actionInfo = actionInfo;
        const numericTextBox: NumericTextBox = new NumericTextBox({
            value: cellValue,
            enableRtl: this.parent.enableRtl,
            enabled: true,
            format: '####.##',
            locale: this.parent.locale,
            cssClass: this.parent.cssClass,
            change: () => {
                const textBoxValue: number = isNullOrUndefined(numericTextBox.value) ? 0 : numericTextBox.value;
                const indexValue: number = eventArgs.currentCell.indexObject[indexObject as number];
                eventArgs.rawData[0][actualText as string] = textBoxValue;
                this.parent.engineModule.data[indexValue as number] = eventArgs.rawData[0];
            },
            blur: () => {
                const eventArgs: EditCompletedEventArgs = {
                    currentData: [currentData],
                    previousData: [previousData],
                    previousPosition: [currentData.index as number],
                    cancel: false
                };
                this.parent.trigger(events.editCompleted, eventArgs);
                if (!eventArgs.cancel) {
                    if (this.parent.dataSourceSettings.mode === 'Server') {
                        const dataIndex: { [key: string]: Object } = {};
                        dataIndex[indexObject as number] = indexObject;
                        const prevItems: IDataSet[] = [currentData];
                        this.parent.getEngine('updateRawData', null, null, null, null, null, null, null, {
                            'addedData': [], 'removedData': [], 'updatedData': prevItems,
                            indexObject: dataIndex as ReturnType<typeof Object>
                        });
                    } else {
                        this.parent.setProperties({ dataSourceSettings: { dataSource: this.parent.engineModule.data } }, true);
                        (this.engine as PivotEngine).updateGridData(this.parent.dataSourceSettings as IDataOptions);
                        this.parent.pivotValues = this.engine.pivotValues;
                        this.parent.gridSettings.allowResizing = gridResize;
                    }
                }
            }
        });
        const textBoxElement: HTMLElement = createElement('input', {
            id: this.parent.element.id + '_inputbox'
        });
        eventArgs.currentTarget.appendChild(textBoxElement);
        numericTextBox.appendTo(textBoxElement);
        eventArgs.currentCell.value = numericTextBox.value;
        numericTextBox.focusIn();
        this.parent.gridSettings.allowResizing = false;
    }

    private updateData(dataSource: IDataSet[]): void {
        let dataPos: number = 0;
        const data: string[][] = this.parent.allowDataCompression ?
            this.parent.engineModule.actualData as string[][] : this.parent.engineModule.data as string[][];
        while (dataPos < dataSource.length) {
            const fields: string[] = Object.keys(dataSource[dataPos as number]);
            let keyPos: number = 0;
            const framedSet: string[] = [];
            while (keyPos < fields.length) {
                if (!isNullOrUndefined(this.parent.engineModule.fieldKeys[fields[keyPos as number]])) {
                    framedSet[this.parent.engineModule.fieldKeys[fields[keyPos as number]] as number] =
                        ((dataSource)[dataPos as number])[fields[keyPos as number]] as string;
                }
                keyPos++;
            }
            data[Number(dataSource[dataPos as number]['__index'])] = framedSet;
            dataPos++;
        }
        if (this.parent.allowDataCompression) {
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
        const dialogElement: HTMLElement = document.getElementById(this.parent.element.id + '_drillthrough');
        if (dialogElement) {
            remove(dialogElement);
        }
        if (document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg')) {
            remove(document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg'));
        }
    }

    private createDrillThroughGrid(eventArgs: DrillThroughEventArgs, gridData: IDataSet[]): HTMLElement {
        const drillThroughBody: HTMLElement =
            createElement('div', { id: this.parent.element.id + '_drillthroughbody', className: cls.DRILLTHROUGH_BODY_CLASS });
        const drillThroughBodyHeader: HTMLElement =
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
            const measure: string = eventArgs.value.split('(')[0];
            const value: string = eventArgs.value.split('(')[1].split(')')[0];
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
        const drillThroughGrid: HTMLElement =
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
            rowHeight: this.parent.gridSettings.rowHeight,
            height: '100%'
        });
        if (this.parent.dataType === 'olap') {
            this.formatData(gridData);
        }
        const dialogModule: DrillThroughDialog = this as DrillThroughDialog;
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
                this.drillThroughGrid.actionBegin = (args: ActionEventArgs) => {
                    const actionName: string = (args.requestType === 'save') ? events.saveEditedRecords :
                        (args.requestType === 'add') ? events.addNewRecord : (args.requestType === 'delete') ?
                            events.removeRecord : '';
                    this.parent.actionObj.actionName = actionName;
                    if (this.parent.actionObj.actionName) {
                        if (this.parent.actionBeginMethod()) {
                            return;
                        }
                    }
                };
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
                    field: '__index', visible: false, isPrimaryKey: true, type: 'string', showInColumnChooser: false,
                    defaultValue: '0', validationRules: { required: true }
                });
            } catch (execption) {
                this.parent.actionFailureMethod(execption);
            }
            this.drillThroughGrid.actionComplete = (args: ActionEventArgs) => {
                if (args.requestType === 'batchsave' || args.requestType === 'save' || args.requestType === 'delete') {
                    dialogModule.isUpdated = true;
                }
                this.parent.actionObj.actionName = this.parent.getActionCompleteName();
                const actionInfo: PivotActionInfo = {
                    editInfo: { type: this.drillThroughGrid.editSettings.mode, action: args.requestType, data: gridData }
                };
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
    /**
     * frame Grid Columns
     *
     * @param {IDataSet[]} rawData - rawData.
     * @returns {ColumnModel[]} - frame Grid Columns
     * @hidden */
    public frameGridColumns(rawData: IDataSet[]): ColumnModel[] {
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        const keys: string[] = this.parent.dataType === 'olap' ? rawData[0] ? Object.keys(rawData[0]) : [] :
            Object.keys(this.engine.fieldList);
        const columns: ColumnModel[] = [];
        const formatList: { [key: string]: string } = {};
        if (this.parent.dataSourceSettings.formatSettings.length > 0) {
            for (let i: number = 0; i < this.parent.dataSourceSettings.formatSettings.length; i++) {
                formatList[this.parent.dataSourceSettings.formatSettings[i as number].name] =
                    this.parent.dataSourceSettings.formatSettings[i as number].format;
            }
        }
        if (this.parent.dataType === 'olap') {
            for (const key of keys) {
                columns.push({
                    field: key.replace(/_x005B_|_x0020_|_x005D_|_x0024_/g, '').replace('].[', '').split('.').reverse().join(''),
                    headerText: key.replace(/_x005B_|_x005D_|_x0024_/g, '').replace(/_x0020_/g, ' ').
                        replace('].[', '').split('.').reverse().join('.'),
                    width: 120,
                    visible: true,
                    validationRules: { required: true },
                    format: !isNullOrUndefined(formatList[key as string]) ? formatList[key as string] : null,
                    type: !isNullOrUndefined(formatList[key as string]) ? null : 'string'
                });
            }
        } else {
            for (const key of keys) {
                if (this.engine.fieldList[key as string].aggregateType !== 'CalculatedField') {
                    let editType: string = '';
                    const isDateField: boolean = ((this.engine.fieldList[key as string].type === 'date' || this.engine.fieldList[key as string].type === 'datetime')
                        && (this.isDateFieldExist(key) || (rawData[0] && rawData[0][key as string] && rawData[0][key as string].toString().indexOf(' ') === -1))) ? true : false;
                    if (this.engine.fieldList[key as string].type === 'number') {
                        editType = 'numericedit';
                    } else if (this.engine.fieldList[key as string].type === 'date' && isDateField) {
                        editType = 'datepickeredit';
                    } else if (this.engine.fieldList[key as string].type === 'datetime' && isDateField) {
                        editType = 'datetimepickeredit';
                    } else {
                        editType = 'defaultedit';
                    }
                    const caption: string = this.parent.enableHtmlSanitizer ?
                        SanitizeHtmlHelper.sanitize(this.engine.fieldList[key as string].caption)
                        : this.engine.fieldList[key as string].caption;
                    columns.push({
                        field: key,
                        headerText: caption,
                        width: 120,
                        visible: this.engine.fieldList[key as string].isSelected,
                        validationRules: { required: true },
                        editType: editType,
                        format: !isNullOrUndefined(formatList[key as string]) ? formatList[key as string] : undefined,
                        type: !isNullOrUndefined(formatList[key as string]) ? null : 'string'
                    });
                }
            }
        }
        return columns;
    }

    private isDateFieldExist(key: string): boolean {
        for (let len: number = 0; len < this.parent.dataSourceSettings.formatSettings.length; len++) {
            if (this.parent.dataSourceSettings.formatSettings[len as number].name === key &&
                this.parent.dataSourceSettings.formatSettings[len as number].type.indexOf('date') > -1) {
                return true;
            }
        }
        for (let len: number = 0; len < this.parent.dataSourceSettings.fieldMapping.length; len++) {
            if (this.parent.dataSourceSettings.fieldMapping[len as number].name === key &&
                this.parent.dataSourceSettings.fieldMapping[len as number].dataType &&
                this.parent.dataSourceSettings.fieldMapping[len as number].dataType.indexOf('date') > -1) {
                return true;
            }
        }
        return false;
    }

    private formatData(gridData: IDataSet[]): void {
        let index: number = 0;
        while (index < gridData.length) {
            const data: IDataSet = gridData[index as number];
            const keys: string[] = Object.keys(gridData[index as number]);
            const newData: IDataSet = {};
            let i: number = 0;
            while (i < keys.length) {
                const key: string = keys[i as number].replace(/_x005B_|_x0020_|_x005D_|_x0024_/g, '').replace('].[', '').split('.').reverse().join('');
                newData[key as string] = data[keys[i as number]];
                i++;
            }
            gridData[index as number] = newData;
            index++;
        }
    }

    private dataWithPrimarykey(eventArgs: DrillThroughEventArgs, gridData: IDataSet[], gridIndexObjects: INumberIndex): IDataSet[] {
        const indexString: string[] = this.indexString.length > 0 ? this.indexString : Object.keys(eventArgs.currentCell.indexObject);
        const rawData: IDataSet[] = gridData;
        let count: number = 0;
        for (const item of rawData) {
            item['__index'] = indexString[count as number];
            gridIndexObjects[indexString[count as number].toString()] = Number(indexString[count as number]);
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
        const target: Element = e.target as Element;
        if (target && closest(target, '.e-popup.e-popup-open')) {
            const dialogInstance: Dialog = getInstance(<HTMLElement>closest(target, '.e-popup.e-popup-open'), Dialog) as Dialog;
            if (dialogInstance && !dialogInstance.closeOnEscape) {
                const button: string = dialogInstance.element.getAttribute('data-fieldName');
                dialogInstance.hide();
                if (this.parent.element) {
                    const pivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-pivot-button'));
                    for (const item of pivotButtons) {
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
     *
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
