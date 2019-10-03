import { HeatMap } from '../heatmap';import { isNullOrUndefined, DateFormatOptions, Complex } from '@syncfusion/ej2-base';import { Property, ChildProperty } from '@syncfusion/ej2-base';import { AdaptorType } from '../utils/enum';import { DataUtil } from '@syncfusion/ej2-data';import { increaseDateTimeInterval } from '../utils/helper';import { AxisModel } from '../axis/axis-model';import { BubbleDataModel } from '../model/base-model';import { BubbleData } from '../model/base';import { Axis } from '../axis/axis';

/**
 * Interface for a class Data
 */
export interface DataModel {

    /**
     * Specifies the provided datasource is an JSON data. 

     */

    isJsonData?: boolean;

    /**
     * specifies Adaptor type

     */
    adaptorType?: AdaptorType;

    /**
     * Specifies xAxis mapping. 

     */

    xDataMapping?: string;

    /**
     * Specifies yAxis mapping. 

     */

    yDataMapping?: string;

    /**
     * Specifies value mapping. 

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