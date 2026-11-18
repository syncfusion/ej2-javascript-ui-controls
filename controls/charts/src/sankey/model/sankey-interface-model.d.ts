import { Rect, Size } from '@syncfusion/ej2-svg-base';import { FontModel } from '../../common/model/base-model';import { ChildProperty, Property } from '@syncfusion/ej2-base';import { ChartLocation } from '../../common/utils/helper';import { ChartTheme } from '../../common/utils/enum';import { SankeyNode, SankeyLink } from '../model/sankey-base';import { Sankey } from '../sankey';

/**
 * Interface for a class SankeyTextStyle
 */
export interface SankeyTextStyleModel {

    /**
     * Specifies the color of the text.
     *
     * @default null
     */
    color?: string;

    /**
     * Specifies the font family for the text.
     *
     * @default null
     */
    fontFamily?: string;

    /**
     * Specifies the font style for the text.
     *
     * @default null
     */
    fontStyle?: string;

    /**
     * Specifies the weight of the text.
     *
     * @default null
     */
    fontWeight?: string;

    /**
     * Specifies the font size for the text.
     *
     * @default null
     */
    fontSize?: string;

}