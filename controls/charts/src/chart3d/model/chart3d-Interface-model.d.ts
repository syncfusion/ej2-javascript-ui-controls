import { RectAttributes, Size } from '@syncfusion/ej2-svg-base';import { Chart3D } from '../chart3D';import { Chart3DSeries, Chart3DPoint } from '../series/chart-series';import { Chart3DAxis, Visible3DLabels } from '../axis/axis';import { BorderModel, FontModel } from '../../common/model/base-model';import { Chart3DSeriesModel } from '../series/chart-series-model';import { Matrix3D } from '../utils/chart3dRender';import { ChartTheme, LegendShape } from '../../common/utils/enum';import { VisibleRangeModel } from '../../common/model/interface';import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class Chart3DFont
 */
export interface Chart3DFontModel {

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