import { HeatMap } from '../heatmap';import { isNullOrUndefined, DateFormatOptions, Complex } from '@syncfusion/ej2-base';import { Property, ChildProperty } from '@syncfusion/ej2-base';import { AdaptorType } from '../utils/enum';import { DataUtil } from '@syncfusion/ej2-data';import { increaseDateTimeInterval } from '../utils/helper';import { AxisModel } from '../axis/axis-model';import { BubbleDataModel } from '../model/base-model';import { BubbleData } from '../model/base';import { Axis } from '../axis/axis';

/**
 * Interface for a class Data
 */
export interface DataModel {

    /**
     * Specifies whether the provided data source is a JSON data or not.
     *
     * @default false
     */

    isJsonData?: boolean;

    /**
     * Specifies the type of the adaptor to process the data set in the heatmap.
     *
     * @default None
     */
    adaptorType?: AdaptorType;

    /**
     * Specifies the field name in the JSON data that maps to the labels on the x-axis.
     *
     * @default ''
     */

    xDataMapping?: string;

    /**
     * Specifies the field name in the JSON data that maps to the labels on the y-axis.
     *
     * @default ''
     */

    yDataMapping?: string;

    /**
     * Specifies the field name in the JSON data that maps to the value in the heatmap cell.
     *
     * @default ''
     */

    valueMapping?: string;

    /**
     * Specifies the options to configure the data mapping for size and color bubble types.
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