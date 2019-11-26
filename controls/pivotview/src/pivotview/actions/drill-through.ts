import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { IAxisSet, IDataSet, PivotEngine, OlapEngine, ITupInfo } from '../../base';
import { DrillThroughEventArgs } from '../../common';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
import { EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';

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
                this.executeDrillThrough(ele);
            }
        }
    }

    private executeDrillThrough(ele: Element): void {
        let colIndex: number = Number(ele.getAttribute('aria-colindex'));
        let rowIndex: number = Number(ele.getAttribute('index'));
        let pivotValue: IAxisSet = this.parent.pivotValues[rowIndex][colIndex] as IAxisSet;
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
            let valuetText: string = aggType === 'CalculatedField' ? valueCaption.toString() : aggType !== '' ?
                (this.parent.localeObj.getConstant(aggType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + valueCaption) :
                valueCaption;
            let eventArgs: DrillThroughEventArgs = {
                currentTarget: ele,
                currentCell: pivotValue,
                rawData: rawData,
                rowHeaders: pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split('.').join(' - '),
                columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split('.').join(' - '),
                value: valuetText + '(' + pivotValue.formattedText + ')'
            };
            let drillThrough: DrillThrough = this;
            this.parent.trigger(events.drillThrough, eventArgs, (observedArgs: DrillThroughEventArgs) => {
                drillThrough.drillThroughDialog.showDrillThroughDialog(observedArgs);
            });
        }
    }
}