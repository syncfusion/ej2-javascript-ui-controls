import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { IAxisSet, IDataSet, PivotEngine, OlapEngine, ITupInfo } from '../../base';
import { DrillThroughEventArgs } from '../../common/base/interface';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
import { EventHandler, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';

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
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.drillThroughDialog = new DrillThroughDialog(this.parent);
        this.addInternalEvents();
    }

    /**
     * It returns the Module name.
     *
     * @returns {string} - string.
     * @hidden
     */
    public getModuleName(): string {
        return 'drillThrough';
    }

    private addInternalEvents(): void {
        this.parent.on(contentReady, this.wireEvents, this);
    }

    private wireEvents(): void {
        this.unWireEvents();
        EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    }

    private unWireEvents(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    }

    private mouseClickHandler(e: MouseEvent): void {
        const target: Element = (e.target as Element);
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
                const colIndex: number = Number(ele.getAttribute('data-colindex'));
                const rowIndex: number = Number(ele.getAttribute('index'));
                this.executeDrillThrough(this.parent.pivotValues[rowIndex as number][colIndex as number] as IAxisSet, rowIndex,
                                         colIndex, ele);
            }
        }
    }

    /** @hidden */

    public executeDrillThrough(pivotValue: IAxisSet, rowIndex: number, colIndex: number, element?: Element): void {
        this.parent.drillThroughElement = element;
        this.parent.drillThroughValue = pivotValue;
        const engine: PivotEngine | OlapEngine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        let valueCaption: string = '';
        let aggType: string = '';
        let rawData: IDataSet[] = [];
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined) {
            if (this.parent.dataType === 'olap') {
                let tupleInfo: ITupInfo;
                if (this.parent.dataSourceSettings.valueAxis === 'row') {
                    tupleInfo = (engine as OlapEngine).tupRowInfo[pivotValue.rowOrdinal];
                } else {
                    tupleInfo = (engine as OlapEngine).tupColumnInfo[pivotValue.colOrdinal];
                }
                const measureName: string = tupleInfo ?
                    (engine as OlapEngine).getUniqueName(tupleInfo.measureName) : pivotValue.actualText as string;
                if (engine.fieldList[measureName as string] && (engine as OlapEngine).fieldList[measureName as string].isCalculatedField) {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(
                        this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('drillError'));
                    return;
                }
                valueCaption = engine.fieldList[measureName || pivotValue.actualText].caption;
                aggType = engine.fieldList[measureName || pivotValue.actualText].aggregateType;
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
                if (this.parent.dataSourceSettings.mode === 'Server') {
                    this.parent.getEngine('fetchRawData', null, null, null, null, null, null, { rowIndex: rowIndex, columnIndex: colIndex });
                } else {
                    if (this.parent.allowDataCompression) {
                        const indexArray: string[] = Object.keys(pivotValue.indexObject);
                        this.drillThroughDialog.indexString = [];
                        for (const cIndex of indexArray) {
                            for (const aIndex of this.parent.engineModule.groupRawIndex[Number(cIndex)]) {
                                rawData.push((this.parent.engineModule.actualData as IDataSet[])[aIndex as number]);
                                this.drillThroughDialog.indexString.push(aIndex.toString());
                            }
                        }
                    } else {
                        const indexArray: string[] = Object.keys(pivotValue.indexObject);
                        for (const index of indexArray) {
                            rawData.push((this.parent.engineModule.data as IDataSet[])[Number(index)]);
                        }
                    }
                }
            }
            if (this.parent.dataSourceSettings.mode !== 'Server') {
                this.triggerDialog(valueCaption, aggType, rawData, pivotValue, element);
            }
        }
    }

    private getCalcualtedFieldValue(indexArray: string[], rawData: IDataSet[]): IDataSet[] {
        for (let k: number = 0; k < indexArray.length; k++) {
            const colIndex: { [key: string]: string } = {};
            colIndex[indexArray[k as number]] = indexArray[k as number];
            for (let i: number = 0; i < this.parent.dataSourceSettings.calculatedFieldSettings.length; i++) {
                let indexValue: number;
                for (let j: number = this.parent.engineModule.fields.length - 1; j >= 0; j--) {
                    if (this.parent.engineModule.fields[j as number] ===
                            this.parent.dataSourceSettings.calculatedFieldSettings[i as number].name) {
                        indexValue = j;
                        break;
                    }
                }
                if (!isNullOrUndefined(rawData[k as number])) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const calculatedFeildValue: number = this.parent.engineModule.getAggregateValue([Number(indexArray[k as number])], colIndex as any, indexValue, 'calculatedfield', false);
                    rawData[k as number][this.parent.dataSourceSettings.calculatedFieldSettings[i as number].name] = (isNaN(calculatedFeildValue) && isNullOrUndefined(calculatedFeildValue)) ? '#DIV/0!' : calculatedFeildValue;
                }
            }
        }
        return rawData;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private frameData(eventArgs: DrillThroughEventArgs): DrillThroughEventArgs {
        let keyPos: number = 0;
        let dataPos: number = 0;
        const data: any = [];
        while (dataPos < eventArgs.rawData.length) {
            const framedHeader: any = {};
            while (keyPos < eventArgs.gridColumns.length) {
                framedHeader[eventArgs.gridColumns[keyPos as number].field] = this.parent.dataSourceSettings.mode === 'Server' ?
                    eventArgs.rawData[dataPos as number][this.parent.engineModule.fields.indexOf(eventArgs.gridColumns[keyPos as number]
                        .field) !== -1 ? this.parent.engineModule.fields.indexOf(eventArgs.gridColumns[keyPos as number].field) : 0] :
                    eventArgs.rawData[dataPos as number][this.parent.engineModule.fieldKeys[eventArgs.gridColumns[keyPos as number]
                        .field] as any];
                keyPos++;
            }
            data.push(framedHeader);
            dataPos++;
            keyPos = 0;
        }
        eventArgs.rawData = data;
        return eventArgs;
    }

    /** @hidden */

    public triggerDialog(valueCaption: string, aggType: string, rawData: IDataSet[], pivotValue: IAxisSet, element: Element): void {
        let valuetText: string = aggType === 'CalculatedField' ? valueCaption.toString() : aggType !== '' ?
            (this.parent.localeObj.getConstant(aggType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + valueCaption) :
            valueCaption;
        valuetText = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(valuetText) : valuetText;
        const rowHeaders: string = this.parent.dataSourceSettings.valueAxis === 'row' ? this.parent.getRowText(Number(element.getAttribute('index')), 0) :
            pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - ');
        let eventArgs: DrillThroughEventArgs = {
            currentTarget: element,
            currentCell: pivotValue,
            rawData: rawData,
            rowHeaders: rowHeaders,
            columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - '),
            value: valuetText + '(' + pivotValue.formattedText + ')',
            gridColumns: this.drillThroughDialog.frameGridColumns(rawData),
            cancel: false
        };
        if (this.parent.dataSourceSettings.type === 'CSV') {
            eventArgs = this.frameData(eventArgs);
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const drillThrough: DrillThrough = this;
        this.parent.trigger(events.drillThrough, eventArgs, (observedArgs: DrillThroughEventArgs) => {
            if (!eventArgs.cancel) {
                drillThrough.drillThroughDialog.showDrillThroughDialog(observedArgs);
            }
        });
    }

    /**
     * To destroy the drillthrough module.
     *
     * @returns  {void}
     * @hidden
     */
    public destroy(): void {
        this.unWireEvents();
        if (this.drillThroughDialog) {
            this.drillThroughDialog.destroy();
            this.drillThroughDialog = null;
        }
        else {
            return;
        }
    }
}
