import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { RangeNavigatorType, ThumbType } from '../utils/enum';
import { Border, Animation, Font } from '../../common/model/base';
import { BorderModel, AnimationModel, FontModel } from '../../common/model/base-model';
import { ThumbSettingsModel } from './range-base-model';
import { Axis, TooltipDisplayMode } from '../../index';
import { Rect } from '@syncfusion/ej2-svg-base';
import { RangeNavigator, DataPoint } from '../index';
import { RangeNavigatorTheme  } from '../utils/theme';

/**
 * Series class for the range navigator
 */
export class RangeNavigatorSeries extends ChildProperty<RangeNavigatorSeries> {

    /**
     * It defines the data source for a series.

     */
    @Property(null)
    public dataSource: Object | DataManager;

    /**
     * It defines the xName for the series

     */
    @Property(null)
    public xName: string;

    /**
     * It defines the yName for the series

     */
    @Property(null)
    public yName: string;

    /**
     * It defines the query for the data source

     */
    @Property()
    public query: Query;

    /**
     * It defines the series type of the range navigator

     */
    @Property('Line')
    public type: RangeNavigatorType;

    /**
     * Options to customizing animation for the series.
     */

    @Complex<AnimationModel>({ enable: false }, Animation)
    public animation: AnimationModel;

    /**
     * Options for customizing the color and width of the series border.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 2 }, Border)
    public border: BorderModel;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.

     */

    @Property(null)
    public fill: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.

     */

    @Property(1)
    public width: number;

    /**
     * The opacity for the background.

     */

    @Property(1)
    public opacity: number;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

     */
    @Property('0')
    public dashArray: string;
    /** @private */
    public seriesElement: Element;
    /** @private */
    public clipRectElement: Element;
    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);
    /** @private */
    public xAxis: Axis;
    /** @private */
    public yAxis: Axis;
    /** @private */
    public points: DataPoint[];
    /** @private */
    public interior: string;
    /** @private */
    public index: number;
    /** @private */
    public chart: RangeNavigator;
}

/**
 * Thumb settings
 */
export class ThumbSettings extends ChildProperty<ThumbSettings> {
    /**
     * width of thumb


     */
    @Property(null)
    public width: number;

    /**
     * height of thumb


     */
    @Property(null)
    public height: number;

    /**
     * border for the thumb
     */
    @Complex<BorderModel>({ width: 1, color: null }, Border)
    public border: BorderModel;

    /**
     * fill color for the thumb

     */
    @Property(null)
    public fill: string;

    /**
     * type of thumb

     */
    @Property('Circle')
    public type: ThumbType;
}

/**
 * Style settings
 */
export class StyleSettings extends ChildProperty<StyleSettings> {
    /**
     * thumb settings
     */
    @Complex<ThumbSettingsModel>({}, ThumbSettings)
    public thumb: ThumbSettingsModel;

    /**
     * Selected region color

     */
    @Property(null)
    public selectedRegionColor: string;

    /**
     * Un Selected region color

     */
    @Property(null)
    public unselectedRegionColor: string;

}

/*
 * Configures the ToolTips in the chart.
 */

export class RangeTooltipSettings extends ChildProperty<RangeTooltipSettings> {
    /**
     * Enables / Disables the visibility of the tooltip.

     */

    @Property(false)
    public enable: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 

     */

    @Property(0.85)
    public opacity: number;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 

     */

    @Property(null)
    public fill: string;

    /**
     * Format the ToolTip content.

     */

    @Property(null)
    public format: string;

    /**
     * Options to customize the ToolTip text.
     */

    @Complex<FontModel>(RangeNavigatorTheme.tooltipLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Custom template to format the ToolTip content. Use ${value} as the placeholder text to display the corresponding data point.

     */

    @Property(null)
    public template: string;

    /**
     * Options to customize tooltip borders.
     */
    @Complex<BorderModel>({ color: '#cccccc', width: 0.5 }, Border)
    public border: BorderModel;

    /**
     * It defines display mode for tooltip

     */
    @Property('OnDemand')
    public displayMode: TooltipDisplayMode;

}
