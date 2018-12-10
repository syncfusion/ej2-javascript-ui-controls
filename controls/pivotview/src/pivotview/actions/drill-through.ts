import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { IAxisSet, IDataSet } from '../../base';
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
        let valueCaption: string = this.parent.engineModule.fieldList[pivotValue.actualText.toString()] ?
            this.parent.engineModule.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
        let rawData: IDataSet[] = [];
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined && pivotValue.value !== undefined) {
            let indexArray: string[] = Object.keys(pivotValue.indexObject);
            for (let index of indexArray) {
                rawData.push((this.parent.dataSource.data as IDataSet[])[Number(index)]);
            }
            let aggType: string = this.parent.engineModule.fieldList[pivotValue.actualText].aggregateType;
            let valuetText: string = aggType === 'CalculatedField' ? valueCaption.toString() :
                (aggType + ' of ' + valueCaption);
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