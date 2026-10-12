import { RectAttributes, Size } from '@syncfusion/ej2-svg-base';import { Chart3D } from '../chart3D';import { Chart3DSeries, Chart3DPoint } from '../series/chart-series';import { Chart3DAxis, Visible3DLabels } from '../axis/axis';import { BorderModel, FontModel } from '../../common/model/base-model';import { Chart3DSeriesModel } from '../series/chart-series-model';import { Matrix3D } from '../utils/chart3dRender';import { Alignment, ChartTheme, LegendShape, TextOverflow, TitlePosition } from '../../common/utils/enum';import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class Chart3DTextFont
 */
export interface Chart3DTextFontModel {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */

    fontStyle?: string;

    /**
     * Font size for the text.
     *
     * @default '16px'
     */

    size?: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */

    fontWeight?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */

    opacity?: number;

}

/**
 * Interface for a class TitleBorder
 */
export interface TitleBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */

    color?: string;

    /**
     * The width of the border in pixels.
     *
     * @default 0
     */

    width?: number;

    /**
     * corder radius for the border.
     *
     * @default 0.8
     */

    cornerRadius?: number;

}

/**
 * Interface for a class TitleSettings
 */
export interface TitleSettingsModel {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */

    fontStyle?: string;

    /**
     * Font size for the text.
     *
     * @default '15px'
     */

    size?: string;

    /**
     * FontWeight for the text.
     *
     * @default '500'
     */

    fontWeight?: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    color?: string;

    /**
     * text alignment.
     *
     * @default 'Center'
     */

    textAlignment?: Alignment;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */

    opacity?: number;

    /**
     * Specifies the chart title text overflow.
     *
     * @default 'Wrap'
     */

    textOverflow?: TextOverflow;

    /**
     * Defines the position for the chart title.
     * * Top: Displays the title at the top of the chart.
     * * Left: Displays the title at the left of the chart.
     * * Bottom: Displays the title at the bottom of the chart.
     * * Right: Displays the title at the right of the chart.
     * * Custom: Displays the title based on the given x and y values.
     *
     * @default 'Top'
     */

    position?: TitlePosition;

    /**
     * Defines the X coordinate for the chart title.
     *
     * @default 0
     */

    x?: number;

    /**
     * Defines the Y coordinate for the chart title.
     *
     * @default 0
     */

    y?: number;

    /**
     * Background of the title border.
     *
     * @default 'transparent'
     */

    background?: string;

    /**
     * Options to customize the border of the chart title.
     */

    border?: TitleBorderModel;

}