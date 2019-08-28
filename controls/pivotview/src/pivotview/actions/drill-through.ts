import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { IAxisSet, IDataSet, PivotEngine, OlapEngine, ITupInfo } from '../../base';
import { DrillThroughEventArgs } from '../../common';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
import { EventHandler } from '@syncfusion/ej2-base';

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
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined && pivotValue.value !== undefined) {
            if (this.parent.dataType === 'olap') {
                let measure: ITupInfo = engine.valueAxis === 'column' ? (engine as OlapEngine).tupColumnInfo[pivotValue.colOrdinal] :
                    (engine as OlapEngine).tupRowInfo[pivotValue.rowOrdinal];
                valueCaption = engine.fieldList[measure.measureName].caption;
                aggType = engine.fieldList[measure.measureName].aggregateType;
                this.parent.olapEngineModule.getDrillThroughData(pivotValue, this.parent.maxRowsForDrillThrough);
                rawData = JSON.parse((engine as OlapEngine).gridJSON);
            } else {
                valueCaption = engine.fieldList[pivotValue.actualText.toString()] ?
                    engine.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
                aggType = engine.fieldList[pivotValue.actualText] ? engine.fieldList[pivotValue.actualText].aggregateType : '';
                let indexArray: string[] = Object.keys(pivotValue.indexObject);
                for (let index of indexArray) {
                    rawData.push((this.parent.dataSourceSettings.dataSource as IDataSet[])[Number(index)]);
                }
            }
            let valuetText: string = aggType === 'CalculatedField' ? valueCaption.toString() :
                aggType !== '' ? (aggType + ' ' + this.parent.localeObj.getConstant('of') + ' ' + valueCaption) : valueCaption;
            let eventArgs: DrillThroughEventArgs = {
                currentTarget: ele,
                currentCell: pivotValue,
                rawData: rawData,
                rowHeaders: pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split('.').join(' - '),
                columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split('.').join(' - '),
                value: valuetText + '(' + pivotValue.formattedText + ')'
            };
            this.parent.trigger(events.drillThrough, eventArgs);
            this.drillThroughDialog.showDrillThroughDialog(eventArgs);
        }
    }
}