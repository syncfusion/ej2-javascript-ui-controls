/**
 * HeatMap TwoDimensional file
 */
import { HeatMap } from '../heatmap';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Axis } from '../axis/axis';

export class TwoDimensional {
    private heatMap: HeatMap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private completeDataSource: any[];
    private tempSizeArray: number[];
    private tempColorArray: number[];
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
    }

    /**
     * To reconstruct proper two dimensional dataSource depends on min and max values.
     *
     *  @private
     */

    public processDataSource(dataSource: Object): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempCloneData: any = <Object[][] | Object[][][]>extend([], dataSource, null, true);
        this.heatMap.clonedDataSource = [];
        this.completeDataSource = [];
        const axis: Axis[] = this.heatMap.axisCollections;
        let dataLength: number = axis[0].maxLength + 1;
        let labelLength: number = axis[0].axisLabelSize + (axis[0].min > 0 ? axis[0].min : 0);
        let xLength: number = dataLength > labelLength ? dataLength : labelLength;
        let minVal: number;
        let maxVal: number;
        dataLength = axis[1].maxLength + 1;
        labelLength = axis[1].axisLabelSize + (axis[1].min > 0 ? axis[1].min : 0);
        const yLength: number = dataLength > labelLength ? dataLength : labelLength;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let tempVariable: any;
        let cloneDataIndex: number = 0;
        const minMaxDatasource: Object[] = [];
        this.tempSizeArray = [];
        this.tempColorArray = [];
        this.heatMap.minColorValue = null;
        this.heatMap.maxColorValue = null;
        this.heatMap.dataMax = [];
        this.heatMap.dataMin = [];
        if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && xLength < yLength ) {
            xLength = yLength;
        }
        for (let z: number = axis[1].valueType === 'Category' ? axis[1].min : 0; z < (
            this.heatMap.paletteSettings.colorGradientMode === 'Column' ? xLength : yLength); z++) {
            let tempIndex: number = axis[0].valueType === 'Category' ? axis[0].min : 0;
            this.completeDataSource.push([]);
            while (tempIndex < xLength) {
                if (tempIndex >= axis[0].min && tempIndex <= axis[0].max) {
                    this.processDataArray(tempCloneData, tempIndex, z, cloneDataIndex);
                }
                tempIndex++;
            }
            if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.paletteSettings.type === 'Gradient') {
                tempVariable = <number[]>extend([], tempCloneData[cloneDataIndex], null, true);
                for (let i: number = 0; i < tempVariable.length; i++) {
                    if (typeof (tempVariable[i]) === 'object' && (tempVariable[i]) !== null || undefined || '') {
                        tempVariable[i] = tempVariable[i][0];
                    }
                }
            } else {
                tempVariable = <number[]>extend([], this.completeDataSource[cloneDataIndex], null, true);

            }
            const minMaxVal: number[] = this.getMinMaxValue(minVal, maxVal, tempVariable);
            if ((this.heatMap.paletteSettings.colorGradientMode === 'Column' ||
                this.heatMap.paletteSettings.colorGradientMode === 'Row') && this.heatMap.paletteSettings.type === 'Gradient') {
                this.heatMap.dataMax[z] = minMaxVal[1];
                this.heatMap.dataMin[z] = minMaxVal[0];
            }
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
        if (this.heatMap.paletteSettings.colorGradientMode === 'Row' && !this.heatMap.yAxis.isInversed &&
            this.heatMap.paletteSettings.type === 'Gradient') {
            this.heatMap.dataMax = this.heatMap.dataMax.reverse();
            this.heatMap.dataMin = this.heatMap.dataMin.reverse();
        }
        if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.xAxis.isInversed &&
            this.heatMap.paletteSettings.type === 'Gradient') {
            this.heatMap.dataMax = this.heatMap.dataMax.reverse();
            this.heatMap.dataMin = this.heatMap.dataMin.reverse();
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
     *
     *  @private
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processDataArray(tempCloneData: any, tempIndex: number, z: number, cloneDataIndex: number): void {
        if (this.heatMap.bubbleSizeWithColor) {
            if (tempCloneData[tempIndex] && !isNullOrUndefined(tempCloneData[tempIndex][z])
                && typeof (tempCloneData[tempIndex][z]) === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const internalArray: any[] = tempCloneData[tempIndex][z];
                for (let tempx: number = 0; tempx < internalArray.length; tempx++) {
                    if (isNullOrUndefined(internalArray[tempx])  || isNaN(internalArray[tempx])) {
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
     *
     *  @private
     */

    private getMinMaxValue(minVal: number, maxVal: number, tempVariable: number[]): number[] {
        const minMaxValue: number[] = [];
        if (this.heatMap.bubbleSizeWithColor) {
            if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.paletteSettings.type === 'Gradient') {
                this.tempSizeArray = tempVariable;
            }
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
     *
     *  @private
     */

    private getMinValue(minVal: number, tempVariable: number[]): number {
        if (isNullOrUndefined(minVal)) {
            minVal = this.performSort(tempVariable);
        } else if (this.performSort(tempVariable) < minVal) {
            minVal = this.performSort(tempVariable);
        } else if ((this.heatMap.paletteSettings.colorGradientMode === 'Row' ||
            this.heatMap.paletteSettings.colorGradientMode === 'Column') && this.heatMap.paletteSettings.type === 'Gradient') {
            minVal = this.performSort(tempVariable);
        }
        return !isNullOrUndefined(minVal) ? parseFloat(minVal.toString()) : minVal;
    }

    /**
     * To get maximum value
     *
     *  @private
     */

    private getMaxValue(maxVal: number, tempVariable: number[]): number {
        if (isNullOrUndefined(maxVal) && tempVariable.length > 0) {
            maxVal = Math.max(...tempVariable);
        } else if (Math.max(...tempVariable) > maxVal) {
            maxVal = Math.max(...tempVariable);
        } else if ((this.heatMap.paletteSettings.colorGradientMode === 'Row' ||
            this.heatMap.paletteSettings.colorGradientMode === 'Column') && this.heatMap.paletteSettings.type === 'Gradient') {
            maxVal = Math.max(...tempVariable);
        }
        return !isNullOrUndefined(maxVal) ? parseFloat(maxVal.toString()) : maxVal;
    }

    /**
     * To perform sort operation.
     *
     *  @private
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private performSort(tempVariable: any): number {
        return tempVariable.sort((a: number, b: number) => a - b).filter(this.checkmin)[0];
    }

    /**
     * To get minimum value
     *
     *  @private
     */

    private checkmin(val: Object): boolean {
        return !isNullOrUndefined(val) && val.toString() !== '';
    }
}
