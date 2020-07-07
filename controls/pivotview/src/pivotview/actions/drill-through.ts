import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { IAxisSet, IDataSet, PivotEngine, OlapEngine, ITupInfo } from '../../base';
import { DrillThroughEventArgs } from '../../common';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
import { EventHandler, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { ColumnModel } from '@syncfusion/ej2-grids';

/**
 * `DrillThrough` module.
 */
export class DrillThrough {
    private parent: PivotView;
    /**
     * @hidden
     */
    public drillThroughDialog: DrillThroughDialog;

    /**
     * Constructor.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.drillThroughDialog = new DrillThroughDialog(this.parent);
        this.addInternalEvents();
    }

    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'drillthrough';
    }

    private addInternalEvents(): void {
        this.parent.on(contentReady, this.wireEvents, this);
    }

    private wireEvents(): void {
        this.unWireEvents();
        EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    }

    private mouseClickHandler(e: MouseEvent): void {
        let target: Element = (e.target as Element);
        let ele: Element = null;
        if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        } else if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        } else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        if (ele) {
            if (this.parent.allowDrillThrough && ele.classList.contains('e-valuescontent') || this.parent.editSettings.allowEditing) {
                let colIndex: number = Number(ele.getAttribute('aria-colindex'));
                let rowIndex: number = Number(ele.getAttribute('index'));
                this.executeDrillThrough(this.parent.pivotValues[rowIndex][colIndex] as IAxisSet, rowIndex, colIndex, ele);
            }
        }
    }

    /** @hidden */
    public executeDrillThrough(pivotValue: IAxisSet, rowIndex: number, colIndex: number, element?: Element): void {
        let engine: PivotEngine | OlapEngine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        let valueCaption: string = '';
        let aggType: string = '';
        let rawData: IDataSet[] = [];
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined && !isNullOrUndefined(pivotValue.value)) {
            if (this.parent.dataType === 'olap') {
                let tupleInfo: ITupInfo;
                if (this.parent.dataSourceSettings.valueAxis === 'row') {
                    tupleInfo = (engine as OlapEngine).tupRowInfo[pivotValue.rowOrdinal];
                } else {
                    tupleInfo = (engine as OlapEngine).tupColumnInfo[pivotValue.colOrdinal];
                }
                let measureName: string = tupleInfo ?
                    (engine as OlapEngine).getUniqueName(tupleInfo.measureName) : pivotValue.actualText as string;
                if (engine.fieldList[measureName] && (engine as OlapEngine).fieldList[measureName].isCalculatedField) {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(
                        this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('drillError'));
                    return;
                }
                valueCaption = engine.fieldList[measureName].caption;
                aggType = engine.fieldList[measureName].aggregateType;
                this.parent.olapEngineModule.getDrillThroughData(pivotValue, this.parent.maxRowsInDrillThrough);
                try {
                    rawData = JSON.parse((engine as OlapEngine).gridJSON);
                } catch (exception) {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(
                        this.parent.localeObj.getConstant('error'), (engine as OlapEngine).gridJSON);
                    return;
                }
            } else {
                valueCaption = engine.fieldList[pivotValue.actualText.toString()] ?
                    engine.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
                aggType = engine.fieldList[pivotValue.actualText] ? engine.fieldList[pivotValue.actualText].aggregateType : '';
                let currModule: DrillThrough = this;
                if (isBlazor() && this.parent.enableVirtualization) {
                    /* tslint:disable:no-any */
                    (currModule.parent as any).interopAdaptor.invokeMethodAsync(
                        'PivotInteropMethod', 'fetchRawData', { 'RowIndex': rowIndex, 'ColumnIndex': colIndex }).then((data: any) => {
                            rawData = JSON.parse(data.rawData);
                            let parsedObj: any = JSON.parse(data.indexObject);
                            let indexObject: any = {};
                            for (let len: number = 0; len < parsedObj.length; len++) {
                                indexObject[parsedObj[len].Key] = parsedObj[len].Value;
                            }
                            pivotValue.indexObject = indexObject;
                            currModule.triggerDialog(valueCaption, aggType, rawData, pivotValue, element);
                            /* tslint:enable:no-any */
                        });
                } else {
                    if (this.parent.enableVirtualization && this.parent.allowDataCompression) {
                        let indexArray: string[] = Object.keys(pivotValue.indexObject);
                        this.drillThroughDialog.indexString = [];
                        for (let cIndex of indexArray) {
                            for (let aIndex of this.parent.engineModule.groupRawIndex[Number(cIndex)]) {
                                rawData.push((this.parent.engineModule.actualData as IDataSet[])[aIndex]);
                                this.drillThroughDialog.indexString.push(aIndex.toString());
                            }
                        }
                    } else {
                        let indexArray: string[] = Object.keys(pivotValue.indexObject);
                        for (let index of indexArray) {
                            rawData.push((this.parent.engineModule.data as IDataSet[])[Number(index)]);
                        }
                    }
                }
            }
            if (!(isBlazor() && this.parent.enableVirtualization)) {
                this.triggerDialog(valueCaption, aggType, rawData, pivotValue, element);
            }
        }
    }

    /* tslint:disable:typedef no-any */
    private frameData(eventArgs: DrillThroughEventArgs): DrillThroughEventArgs {
        let keyPos: number = 0;
        let dataPos: number = 0;
        let data: any = [];
        while (dataPos < eventArgs.rawData.length) {
            let framedHeader: any = {};
            while (keyPos < eventArgs.gridColumns.length) {
                framedHeader[eventArgs.gridColumns[keyPos].field] =
                    eventArgs.rawData[dataPos][this.parent.engineModule.fieldKeys[eventArgs.gridColumns[keyPos].field] as any];
                keyPos++;
            }
            data.push(framedHeader);
            dataPos++;
            keyPos = 0;
        }
        eventArgs.rawData = data;
        return eventArgs;
    }

    private triggerDialog(valueCaption: string, aggType: string, rawData: IDataSet[], pivotValue: IAxisSet, element: Element): void {
        let valuetText: string = aggType === 'CalculatedField' ? valueCaption.toString() : aggType !== '' ?
            (this.parent.localeObj.getConstant(aggType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + valueCaption) :
            valueCaption;
        let eventArgs: DrillThroughEventArgs = {
            currentTarget: element,
            currentCell: pivotValue,
            rawData: rawData,
            rowHeaders: pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split('.').join(' - '),
            columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split('.').join(' - '),
            value: valuetText + '(' + pivotValue.formattedText + ')',
            gridColumns: this.drillThroughDialog.frameGridColumns(rawData)
        };
        if (this.parent.dataSourceSettings.type === 'CSV') {
            eventArgs = this.frameData(eventArgs);
        }
        let drillThrough: DrillThrough = this;
        let gridColumns: ColumnModel[] = eventArgs.gridColumns;
        this.parent.trigger(events.drillThrough, eventArgs, (observedArgs: DrillThroughEventArgs) => {
            if (isBlazor()) {
                for (let i: number = 0; i < observedArgs.gridColumns.length; i++) {
                    if (gridColumns[i].field === observedArgs.gridColumns[i].field) {
                        gridColumns[i].field = observedArgs.gridColumns[i].field;
                        gridColumns[i].editType = observedArgs.gridColumns[i].editType;
                        gridColumns[i].headerText = observedArgs.gridColumns[i].headerText;
                        gridColumns[i].type = observedArgs.gridColumns[i].type;
                        gridColumns[i].validationRules = observedArgs.gridColumns[i].validationRules;
                        gridColumns[i].visible = observedArgs.gridColumns[i].visible;
                        gridColumns[i].width = observedArgs.gridColumns[i].width;
                    }
                }
                observedArgs.gridColumns = gridColumns;
            }
            drillThrough.drillThroughDialog.showDrillThroughDialog(observedArgs);
        });
    }
}