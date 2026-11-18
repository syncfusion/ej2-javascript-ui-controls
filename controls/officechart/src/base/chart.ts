/**
 * Chart model.
 */
import { ChartTheme, ChartType } from '../common/enum';
import { AxisModel, DataLabelSettingsModel, LegendSettingsModel, MarkerSettingsModel } from './chart-model';
import { OfficeSeriesModel } from '../integrations/data-provider';

/**
 * Chart series range definition.
 */
export interface ChartSeriesRange {
    range?: string;
    name?: string;
    category?: string;
}

/**
 * Chart model contract.
 */
export interface ChartModel {
    /**
     * Specifies the type of a chart.
     *
     * @default 'Line'
     */
    type?: ChartType;

    /**
     * Specifies the theme of a chart.
     *
     * @default 'Material'
     */
    theme?: ChartTheme;

    /**
     * Specifies to switch the row or a column.
     *
     * @default false
     */
    isSeriesInRows?: boolean;

    /**
     * Options to configure the marker
     *
     * @default {}
     */
    markerSettings?: MarkerSettingsModel;

    /**
     * Specifies the selected range or specified range.
     *
     * @default ''
     */
    range?: string;

    /**
     * Specifies chart element id.
     *
     * @default ''
     */
    id?: string;

    /**
     * Title of the chart
     *
     * @default ''
     */
    title?: string;

    /**
     * Specifies the height of the chart.
     *
     * @default 290
     */
    height?: number;

    /**
     * Specifies the width of the chart.
     *
     * @default 480
     */
    width?: number;

    /**
     * Specifies the top position of the chart.
     *
     * @default 0
     * @hidden
     */
    top?: number;

    /**
     * Specifies the left side of the chart.
     *
     * @default 0
     * @hidden
     */
    left?: number;

    /**
     * Options for customizing the legend of the chart.
     *
     * @default {}
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Options to configure the horizontal axis.
     *
     * @default {}
     */
    primaryXAxis?: AxisModel;

    /**
     * Options to configure the vertical axis.
     *
     * @default {}
     */
    primaryYAxis?: AxisModel;

    /**
     * The data label for the series.
     *
     * @default {}
     */
    dataLabelSettings?: DataLabelSettingsModel;

    /**
     * Internal address coordinates.
     *
     * @hidden
     */
    address?: number[];

    /**
     * Whether canvas is enabled.
     *
     * @hidden
     */
    enableCanvas?: boolean;

    /**
     * Whether date interpolation is skipped.
     *
     * @hidden
     */
    skipDateInterpolation?: boolean;

    /**
     * The data label for the series.
     *
     * @default null
     * @hidden
     */
    series?: ChartSeriesRange[] | OfficeSeriesModel[];
}


