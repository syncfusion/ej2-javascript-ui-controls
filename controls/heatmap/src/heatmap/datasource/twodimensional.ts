/**
 * HeatMap TwoDimensional file
 */
import { HeatMap } from '../heatmap';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Axis } from '../axis/axis';

export class TwoDimensional {
    private heatMap: HeatMap;
    // tslint:disable-next-line:no-any 
    private completeDataSource: any[];
    private tempSizeArray: number[];
    private tempColorArray: number[];
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
    }

    /**
     * To reconstruct proper two dimensional dataSource depends on min and max values.
     *  @private
     */
    public processDataSource(dataSource: Object): void {
        // tslint:disable-next-line:no-any
        let tempCloneData: any = <Object[][]|Object[][][]>extend([], dataSource, null, true);
        this.heatMap.clonedDataSource = [];
        this.completeDataSource = [];
        let axis: Axis[] = this.heatMap.axisCollections;
        let dataLength: number = axis[0].maxLength + 1;
        let labelLength: number = axis[0].axisLabelSize + (axis[0].min > 0 ? axis[0].min : 0);
        let xLength: number = dataLength > labelLength ? dataLength : labelLength;
        let minVal: number;
        let maxVal: number;
        dataLength = axis[1].maxLength + 1;
        labelLength = axis[1].axisLabelSize + (axis[1].min > 0 ? axis[1].min : 0);
        let yLength: number = dataLength > labelLength ? dataLength : labelLength;
        // tslint:disable-next-line:no-any 
        let tempVariable: any;
        let cloneDataIndex: number = 0;
        let minMaxDatasource: Object[] = [];
        this.tempSizeArray = [];
        this.tempColorArray = [];
        this.heatMap.minColorValue = null;
        this.heatMap.maxColorValue = null;

        for (let z: number = axis[1].valueType === 'Category' ? axis[1].min : 0; z < yLength; z++) {
            let tempIndex: number = axis[0].valueType === 'Category' ? axis[0].min : 0;
            this.completeDataSource.push([]);
            while (tempIndex < xLength) {
                if (tempIndex >= axis[0].min && tempIndex <= axis[0].max) {
                    this.processDataArray(tempCloneData, tempIndex, z, cloneDataIndex);
                }
                tempIndex++;
            }
            tempVariable = <number[]>extend([], this.completeDataSource[cloneDataIndex], null, true);
            let minMaxVal: number[] = this.getMinMaxValue(minVal, maxVal, tempVariable);
            minVal = minMaxVal[0];
            maxVal = minMaxVal[1];
            if (this.heatMap.xAxis.isInversed) {
                this.completeDataSource[cloneDataIndex] = this.completeDataSource[cloneDataIndex].reverse();
            }
            if (z >= this.heatMap.axisCollections[1].min && z <= this.heatMap.axisCollections[1].max) {
                minMaxDatasource.push(this.completeDataSource[cloneDataIndex]);
            }
            cloneDataIndex++;
        }
        if (!this.heatMap.yAxis.isInversed) {
            this.completeDataSource.reverse();
            minMaxDatasource.reverse();
        }
        this.heatMap.clonedDataSource = minMaxDatasource;
        this.heatMap.dataSourceMinValue = isNullOrUndefined(minVal) ? 0 : parseFloat(minVal.toString());
        this.heatMap.dataSourceMaxValue = isNullOrUndefined(maxVal) ? 0 : parseFloat(maxVal.toString());
        this.heatMap.isColorValueExist = isNullOrUndefined(this.heatMap.minColorValue) ? false : true;
        this.heatMap.minColorValue = isNullOrUndefined(this.heatMap.minColorValue) ?
            this.heatMap.dataSourceMinValue : parseFloat(this.heatMap.minColorValue.toString());
        this.heatMap.maxColorValue = isNullOrUndefined(this.heatMap.maxColorValue) ?
            this.heatMap.dataSourceMaxValue : parseFloat(this.heatMap.maxColorValue.toString());
    }

    /**
     * To process and create a proper data array.
     *  @private
     */
    // tslint:disable-next-line:no-any
    private processDataArray(tempCloneData: any, tempIndex: number, z: number, cloneDataIndex: number): void {
        if (this.heatMap.bubbleSizeWithColor) {
            if (tempCloneData[tempIndex] && !isNullOrUndefined(tempCloneData[tempIndex][z])
                && typeof (tempCloneData[tempIndex][z]) === 'object') {
                // tslint:disable-next-line:no-any 
                let internalArray: any[] = tempCloneData[tempIndex][z];
                for (let tempx: number = 0; tempx < internalArray.length; tempx++) {
                    if (isNullOrUndefined(internalArray[tempx])) {
                        internalArray[tempx] = '';
                    }
                    if (tempx === 0) {
                        this.tempSizeArray.push(internalArray[tempx]);
                    } else if (tempx === 1) {
                        this.tempColorArray.push(internalArray[tempx]);
                        break;
                    }
                }
                this.completeDataSource[cloneDataIndex].push(internalArray);
            } else {
                if (!isNullOrUndefined(tempCloneData[tempIndex]) && (tempCloneData[tempIndex][z] ||
                    (tempCloneData[tempIndex][z] === 0 &&
                        tempCloneData[tempIndex][z].toString() !== ''))) {
                    this.completeDataSource[cloneDataIndex].push([tempCloneData[tempIndex][z]]);
                    this.tempSizeArray.push(tempCloneData[tempIndex][z]);
                } else {
                    this.completeDataSource[cloneDataIndex].push('');
                }
            }
        } else {
            if (tempCloneData[tempIndex] && (tempCloneData[tempIndex][z] ||
                (tempCloneData[tempIndex][z] === 0 &&
                    tempCloneData[tempIndex][z].toString() !== ''))) {
                if (typeof (tempCloneData[tempIndex][z]) === 'object') {
                    if (tempCloneData[tempIndex][z].length > 0 && !isNullOrUndefined(tempCloneData[tempIndex][z][0])) {
                        this.completeDataSource[cloneDataIndex].push(tempCloneData[tempIndex][z][0]);
                    } else {
                        this.completeDataSource[cloneDataIndex].push('');
                    }
                } else {
                    this.completeDataSource[cloneDataIndex].push(tempCloneData[tempIndex][z]);
                }
            } else {
                this.completeDataSource[cloneDataIndex].push('');
            }
        }
    }

    /**
     * To get minimum and maximum value
     *  @private
     */
    private getMinMaxValue(minVal: number, maxVal: number, tempVariable: number[]): number[] {
        let minMaxValue: number[] = [];
        if (this.heatMap.bubbleSizeWithColor) {
            minMaxValue.push(this.getMinValue(minVal, this.tempSizeArray));
            minMaxValue.push(this.getMaxValue(maxVal, this.tempSizeArray));
            this.heatMap.minColorValue = this.getMinValue(this.heatMap.minColorValue, this.tempColorArray);
            this.heatMap.maxColorValue = this.getMaxValue(this.heatMap.maxColorValue, this.tempColorArray);
        } else {
            minMaxValue.push(this.getMinValue(minVal, tempVariable));
            minMaxValue.push(this.getMaxValue(maxVal, tempVariable));
        }
        return minMaxValue;
    }

    /**
     * To get minimum value
     *  @private
     */
    private getMinValue(minVal: number, tempVariable: number[]): number {
        if (isNullOrUndefined(minVal)) {
            minVal = this.performSort(tempVariable);
        } else if (this.performSort(tempVariable) < minVal) {
            minVal = this.performSort(tempVariable);
        }
        return !isNullOrUndefined(minVal) ? parseFloat(minVal.toString()) : minVal;
    }

    /**
     * To get maximum value
     *  @private
     */
    private getMaxValue(maxVal: number, tempVariable: number[]): number {
        if (isNullOrUndefined(maxVal) && tempVariable.length > 0) {
            maxVal = Math.max(...tempVariable);
        } else if (Math.max(...tempVariable) > maxVal) {
            maxVal = Math.max(...tempVariable);
        }
        return !isNullOrUndefined(maxVal) ? parseFloat(maxVal.toString()) : maxVal;
    }

    /**
     * To perform sort operation.
     *  @private
     */
    // tslint:disable-next-line:no-any
    private performSort(tempVariable: any): number {
        return tempVariable.sort((a: number, b: number) => a - b).filter(this.checkmin)[0];
    }

    /**
     * To get minimum value
     *  @private
     */
    private checkmin(val: Object): boolean {
        return !isNullOrUndefined(val) && val.toString() !== '';
    }
}