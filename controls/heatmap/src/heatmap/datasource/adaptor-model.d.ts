import { HeatMap } from '../heatmap';import { isNullOrUndefined, DateFormatOptions, Complex } from '@syncfusion/ej2-base';import { Property, ChildProperty } from '@syncfusion/ej2-base';import { AdaptorType } from '../utils/enum';import { DataUtil } from '@syncfusion/ej2-data';import { increaseDateTimeInterval } from '../utils/helper';import { AxisModel } from '../axis/axis-model';import { BubbleDataModel } from '../model/base-model';import { BubbleData } from '../model/base';import { Axis } from '../axis/axis';

/**
 * Interface for a class Data
 */
export interface DataModel {

    /**
     * Specifies the provided datasource is an JSON data. 
     * @default false
     */

    isJsonData?: boolean;

    /**
     * specifies Adaptor type
     * @default None
     */
    adaptorType?: AdaptorType;

    /**
     * Specifies xAxis mapping. 
     * @default ''
     */

    xDataMapping?: string;

    /**
     * Specifies yAxis mapping. 
     * @default ''
     */

    yDataMapping?: string;

    /**
     * Specifies value mapping. 
     * @default ''
     */

    valueMapping?: string;

    /**
     * Specifies data mapping for size and color bubble type. 
     */
    bubbleDataMapping?: BubbleDataModel;

}

/**
 * Interface for a class AdaptiveMinMax
 */
export interface AdaptiveMinMaxModel {

}

/**
 * Interface for a class Adaptor
 */
export interface AdaptorModel {

}