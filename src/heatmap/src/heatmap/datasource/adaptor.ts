/**
 * HeatMap Adaptor file
 */
import { HeatMap } from '../heatmap';
import { isNullOrUndefined, DateFormatOptions, Complex } from '@syncfusion/ej2-base';
import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { AdaptorType } from '../utils/enum';
import { DataModel } from './adaptor-model';
import { DataUtil } from '@syncfusion/ej2-data';
import { increaseDateTimeInterval } from '../utils/helper';
import { AxisModel } from '../axis/axis-model';
import { BubbleDataModel } from '../model/base-model';
import { BubbleData } from '../model/base';
/**
 * Configures the Adaptor Property in the Heatmap.
 */
export class Data extends ChildProperty<Data> {
    /**
     * Property to provide Datasource.
     * @default null
     */

    @Property(null)
    public data: Object;

    /**
     * Specifies the provided datasource is an JSON data. 
     * @default false
     */

    @Property(false)
    public isJsonData: boolean;

    /**
     * specifies Adaptor type
     * @default cell
     */
    @Property('cell')
    public adaptorType: AdaptorType;

    /**
     * Specifies xAxis mapping. 
     * @default ''
     */

    @Property('')
    public xDataMapping: string;

    /**
     * Specifies yAxis mapping. 
     * @default ''
     */

    @Property('')
    public yDataMapping: string;

    /**
     * Specifies value mapping. 
     * @default ''
     */

    @Property('')
    public valueMapping: string;

    /**
     * Specifies data mapping for size and color bubble type. 
     */
    @Complex<BubbleDataModel>({}, BubbleData)
    public bubbleDataMapping: BubbleDataModel;

}

export class AdaptiveMinMax {
    public min: Object;
    public max: Object;
}

/**
 * 
 * The `Adaptor` module is used to handle JSON and Table data.
 */
export class Adaptor {
    private heatMap: HeatMap;
    public reconstructData: Object[][];
    public reconstructedXAxis: string[] = [];
    public reconstructedYAxis: string[] = [];
    // tslint:disable-next-line:no-any 
    private tempSplitDataCollection: any;
    public adaptiveXMinMax: AdaptiveMinMax = new AdaptiveMinMax();
    public adaptiveYMinMax: AdaptiveMinMax = new AdaptiveMinMax();
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
    }

    /**
     * Method to construct Two Dimentional Datasource.
     * @return {void}
     * @private
     */
    public constructDatasource(adaptData: DataModel): void {
        if (adaptData && adaptData.data === undefined) {
            this.heatMap.completeAdaptDataSource = adaptData;
        } else if (!adaptData.isJsonData && adaptData.adaptorType === 'Table' || adaptData.data === null) {
            this.heatMap.completeAdaptDataSource = adaptData.data;
        } else if (adaptData.isJsonData && adaptData.adaptorType === 'Table') {
            this.heatMap.completeAdaptDataSource = this.processJsonTableData(adaptData);
        } else if (adaptData.isJsonData && adaptData.adaptorType === 'Cell') {
            this.heatMap.completeAdaptDataSource = this.processJsonCellData(adaptData);
        } else if (!adaptData.isJsonData && adaptData.adaptorType === 'Cell') {
            let xAxis: AxisModel = this.heatMap.xAxis;
            let yAxis: AxisModel = this.heatMap.yAxis;
            this.adaptiveXMinMax.min = xAxis.minimum;
            this.adaptiveXMinMax.max = xAxis.maximum;
            this.adaptiveYMinMax.min = yAxis.minimum;
            this.adaptiveYMinMax.max = yAxis.maximum;
            if (((xAxis.valueType === 'Numeric' || xAxis.valueType === 'DateTime') &&
                (isNullOrUndefined(xAxis.minimum) || isNullOrUndefined(xAxis.maximum))) ||
                ((yAxis.valueType === 'Numeric' || yAxis.valueType === 'DateTime') &&
                    (isNullOrUndefined(yAxis.minimum) || isNullOrUndefined(yAxis.maximum)))) {
                this.getMinMaxValue(<Object[][]>adaptData.data, xAxis, yAxis);
            }
            this.constructAdaptiveAxis();
            this.heatMap.completeAdaptDataSource = this.processCellData(adaptData);
            this.heatMap.isCellData = true;
        }
    }

    /**
     * Method to construct Axis Collection.
     * @return {void}
     * @private
     */
    private constructAdaptiveAxis(): void {
        let xAxis: AxisModel = this.heatMap.xAxis;
        let yAxis: AxisModel = this.heatMap.yAxis;
        let intervalType: string;
        if (xAxis.valueType === 'Numeric') {
            this.reconstructedXAxis = this.getNumericAxisCollection(this.adaptiveXMinMax.min, this.adaptiveXMinMax.max, xAxis.increment);
        }
        if (yAxis.valueType === 'Numeric') {
            this.reconstructedYAxis = this.getNumericAxisCollection(this.adaptiveYMinMax.min, this.adaptiveYMinMax.max, yAxis.increment);
        }
        if (xAxis.valueType === 'DateTime') {
            this.reconstructedXAxis = this.getDateAxisCollection(
                this.adaptiveXMinMax.min, this.adaptiveXMinMax.max,
                xAxis.intervalType, xAxis.increment);
        }
        if (yAxis.valueType === 'DateTime') {
            this.reconstructedYAxis = this.getDateAxisCollection(
                this.adaptiveYMinMax.min, this.adaptiveYMinMax.max,
                yAxis.intervalType, yAxis.increment);
        }
    }

    /**
     * Method to calculate Numeric Axis Collection.
     * @return {string[]}
     * @private
     */
    private getNumericAxisCollection(min: Object, max: Object, increment: number): string[] {
        let loopIndex: number = <number>min;
        let tempAxisColl: string[] = [];
        while (loopIndex <= max) {
            tempAxisColl.push(loopIndex.toString());
            loopIndex = loopIndex + increment;
        }
        return tempAxisColl;
    }

    /**
     * Method to calculate DateTime Axis Collection.
     * @return {string[]}
     * @private
     */
    private getDateAxisCollection(min: Object, max: Object, intervalType: string, increment: number): string[] {
        let option: DateFormatOptions = {
            skeleton: 'full',
            type: 'dateTime'
        };
        let dateParser: Function = this.heatMap.intl.getDateParser(option);
        let dateFormatter: Function = this.heatMap.intl.getDateFormat(option);
        min = Date.parse(dateParser(dateFormatter(new Date(
            DataUtil.parse.parseJson({ val: min }).val
        ))));
        let tempInterval: number = <number>min;
        let tempAxisColl: string[] = [];
        while (tempInterval <= max) {
            tempAxisColl.push(new Date(tempInterval).toString());
            tempInterval = increaseDateTimeInterval(tempInterval, 1, intervalType, increment).getTime();
        }
        return tempAxisColl;
    }

    /**
     * Method to calculate Maximum and Minimum Value from datasource.
     * @return {void}
     * @private
     */
    private getMinMaxValue(data: Object[][], xAxis: AxisModel, yAxis: AxisModel): void {
        if (data.length > 0) {
            this.adaptiveXMinMax.min = !isNullOrUndefined(xAxis.minimum) ? xAxis.minimum : data[0][0];
            this.adaptiveYMinMax.min = !isNullOrUndefined(yAxis.minimum) ? yAxis.minimum : data[0][1];
            this.adaptiveXMinMax.max = !isNullOrUndefined(xAxis.maximum) ? xAxis.maximum : data[0][0];
            this.adaptiveYMinMax.max = !isNullOrUndefined(yAxis.maximum) ? yAxis.maximum : data[0][1];
        }
        for (let dataIndex: number = 0; dataIndex < data.length; dataIndex++) {
            if (data[dataIndex][0] < this.adaptiveXMinMax.min && isNullOrUndefined(xAxis.minimum)) {
                this.adaptiveXMinMax.min = data[dataIndex][0];
            }
            if (data[dataIndex][0] > this.adaptiveXMinMax.max && isNullOrUndefined(xAxis.maximum)) {
                this.adaptiveXMinMax.max = data[dataIndex][0];
            }
            if (data[dataIndex][1] < this.adaptiveYMinMax.min && isNullOrUndefined(yAxis.minimum)) {
                this.adaptiveYMinMax.min = data[dataIndex][1];
            }
            if (data[dataIndex][1] > this.adaptiveYMinMax.max && isNullOrUndefined(yAxis.maximum)) {
                this.adaptiveYMinMax.max = data[dataIndex][1];
            }
        }
    }

    /**
     * Method to process Cell datasource.
     * @return {Object}
     * @private
     */
    private processCellData(adaptordata: DataModel): Object {
        // tslint:disable-next-line:no-any 
        let tempDataCollection: any = adaptordata.data;
        let xLabels: string[] = this.reconstructedXAxis;
        let yLabels: string[] = this.reconstructedYAxis;
        let currentDataXIndex: number = 0;
        let currentDataYIndex: number = 0;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (let xindex: number = 0; xindex < tempDataCollection.length; xindex++) {
                if (this.heatMap.xAxis.valueType === 'Category') {
                    currentDataXIndex = tempDataCollection[xindex][0];
                } else {
                    currentDataXIndex = xLabels.indexOf(tempDataCollection[xindex][0].toString());
                }
                if (currentDataXIndex > -1) {
                    while (!this.reconstructData[currentDataXIndex]) {
                        this.reconstructData.push([]);
                    }
                    if (this.heatMap.yAxis.valueType === 'Category') {
                        currentDataYIndex = tempDataCollection[xindex][1];
                    } else {
                        currentDataYIndex = yLabels.indexOf(tempDataCollection[xindex][1].toString());
                    }
                    if (currentDataYIndex !== -1) {
                        while (this.reconstructData[currentDataXIndex][currentDataYIndex] !== '') {
                            this.reconstructData[currentDataXIndex].push('');
                        }
                        this.reconstructData[currentDataXIndex][currentDataYIndex] = isNullOrUndefined(tempDataCollection[xindex][2]) ?
                            '' : tempDataCollection[xindex][2];
                    }
                }
            }
        }
        return this.reconstructData;
    }

    /**
     * Method to process JSON Cell datasource.
     * @return {Object}
     * @private
     */
    private processJsonCellData(adaptordata: DataModel): Object {
        // tslint:disable-next-line:no-any 
        let tempDataCollection: any = adaptordata.data;
        let xLabels: string[] = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        let yLabels: string[] = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        let currentDataXIndex: number | string = 0;
        let currentDataYIndex: number | string = 0;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (let index: number = 0; index < tempDataCollection.length; index++) {
                currentDataXIndex = this.getSplitDataValue(
                    tempDataCollection[index], adaptordata, xLabels, adaptordata.xDataMapping.split('.'));
                if (currentDataXIndex !== -1) {
                    while (!this.reconstructData[currentDataXIndex as number]) {
                        this.reconstructData.push([]);
                    }
                    currentDataYIndex = this.getSplitDataValue(
                        tempDataCollection[index], adaptordata, yLabels, adaptordata.yDataMapping.split('.'));
                    if (currentDataYIndex !== -1) {
                        while (isNullOrUndefined(this.reconstructData[currentDataXIndex as number][currentDataYIndex as number])) {
                            this.reconstructData[currentDataXIndex as number].push('');
                        }
                        if (this.heatMap.bubbleSizeWithColor) {
                            this.reconstructData[currentDataXIndex as number][currentDataYIndex as number] = [
                                this.getSplitDataValue(
                                    tempDataCollection[index], adaptordata, null, adaptordata.bubbleDataMapping.size.split('.')),
                                this.getSplitDataValue(
                                    tempDataCollection[index], adaptordata, null, adaptordata.bubbleDataMapping.color.split('.'))];
                        } else {
                            this.reconstructData[currentDataXIndex as number][currentDataYIndex as number] = this.getSplitDataValue(
                                tempDataCollection[index], adaptordata, null, adaptordata.valueMapping.split('.'));
                        }
                    }
                }
            }
        }
        return this.reconstructData;
    }

    /**
     * Method to get data from complex mapping.
     * @return {number|string}
     * @private
     */
    private getSplitDataValue(
        // tslint:disable-next-line:no-any 
        tempSplitDataCollection: any, adaptordata: DataModel, labels: string[], tempSplitData: string[]): number | string {
        let value: number | string = -1;
        this.tempSplitDataCollection = tempSplitDataCollection;
        for (let splitIndex: number = 0; splitIndex < tempSplitData.length; splitIndex++) {
            value = !isNullOrUndefined(labels) ? labels.indexOf(this.tempSplitDataCollection[tempSplitData[splitIndex]]) : null;
            if (!isNullOrUndefined(this.tempSplitDataCollection)) {
                this.tempSplitDataCollection = value !== -1 && !isNullOrUndefined(labels) ?
                    this.tempSplitDataCollection : this.tempSplitDataCollection[tempSplitData[splitIndex]];
            }
            if (isNullOrUndefined(this.tempSplitDataCollection)) {
                break;
            }
        }
        value = !isNullOrUndefined(labels) ? value : isNullOrUndefined(this.tempSplitDataCollection) ||
            this.tempSplitDataCollection.toString() === '' ? '' : parseFloat(this.tempSplitDataCollection.toString());
        return value;
    }

    /**
     * Method to process JSON Table datasource.
     * @return {Object}
     * @private
     */
    private processJsonTableData(adaptordata: DataModel): Object {
        // tslint:disable-next-line:no-any 
        let tempDataCollection: any = adaptordata.data;
        let currentDataXIndex: number | string = 0;
        let currentDataYIndex: number | string = 0;
        let xLabels: string[] = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        let yLabels: string[] = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        let key: string;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (let xindex: number = 0; xindex < tempDataCollection.length; xindex++) {
                currentDataXIndex = this.getSplitDataValue(
                    tempDataCollection[xindex], adaptordata, xLabels, adaptordata.xDataMapping.split('.'));
                if (currentDataXIndex !== -1) {
                    while (!this.reconstructData[currentDataXIndex as number]) {
                        this.reconstructData.push([]);
                    }
                    for (let index: number = 0; index < Object.keys(this.tempSplitDataCollection).length; index++) {
                        key = Object.keys(this.tempSplitDataCollection)[index];
                        currentDataYIndex = key !== adaptordata.xDataMapping ? yLabels.indexOf(key) : -1;
                        if (currentDataYIndex !== -1) {
                            while (isNullOrUndefined(this.reconstructData[currentDataXIndex as number][currentDataYIndex as number])) {
                                this.reconstructData[currentDataXIndex as number].push('');
                            }
                            this.reconstructData[currentDataXIndex as number][currentDataYIndex as number] =
                                isNullOrUndefined(this.tempSplitDataCollection[key]) ?
                                    '' : this.tempSplitDataCollection[key];
                        }
                    }
                }
            }
        }
        return this.reconstructData;
    }

    /**
     * To destroy the Adaptor.
     * @return {void}
     * @private
     */
    public destroy(heatMap: HeatMap): void {
        /**
         * No Lines
         */
    };

    /**
     * To get Module name
     */
    protected getModuleName(): string {
        return 'Adaptor';
    }

}