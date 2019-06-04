import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { BorderModel, FontModel, PeriodsModel } from './base-model';
import { EmptyPointMode} from '../../chart/utils/enum';
import { AccEmptyPointMode, ConnectorType} from '../../accumulation-chart/model/enum';
import { Alignment, TextOverflow } from '../utils/enum';
import { RangeIntervalType, PeriodSelectorPosition } from '../utils/enum';
import {  Theme } from '../model/theme';

/**
 * Defines the appearance of the connectors
 */
export class Connector extends ChildProperty<Connector> {
    /**
     * specifies the type of the connector line. They are
     * * Smooth
     * * Line
     * @default 'Line'
     */
    @Property('Line')
    public type: ConnectorType;

    /**
     * Color of the connector line.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Width of the connector line in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Length of the connector line in pixels.
     * @default null
     */
    @Property(null)
    public length: string;

    /**
     * dashArray of the connector line.
     * @default ''
     */
    @Property('')
    public dashArray: string;


}
/**
 * Configures the fonts in charts.
 */

export class Font extends ChildProperty<Font> {

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Color for the text.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * text alignment
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * FontFamily for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the chart title text overflow
     * @default 'Trim'
     */
    @Property('Trim')
    public textOverflow: TextOverflow;

}
/**
 * Configures the borders in the chart.
 */
export class Border extends ChildProperty<Border> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

}
/**
 * Configures the chart area.
 */
export class ChartArea extends ChildProperty<ChartArea> {

    /**
     * Options to customize the border of the chart area.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * The background of the chart area that accepts value in hex and rgba as a valid CSS color string..
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * The opacity for background.
     * @default 1
     */
    @Property(1)
    public opacity: number;

}
/**
 * Configures the chart margins.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Left margin in pixels.
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Right margin in pixels.
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Top margin in pixels.
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Bottom margin in pixels.
     * @default 10
     */
    @Property(10)
    public bottom: number;
}
/**
 * Configures the animation behavior for chart series.
 */

export class Animation extends ChildProperty<Animation> {

    /**
     * If set to true, series gets animated on initial loading.
     * @default true
     */

    @Property(true)
    public enable: boolean;

    /**
     * The duration of animation in milliseconds.
     * @default 1000
     */

    @Property(1000)
    public duration: number;

    /**
     * The option to delay animation of the series.
     * @default 0
     */

    @Property(0)
    public delay: number;
}
/** 
 * Series and point index
 * @public
 */
export class Indexes extends ChildProperty<Indexes> {
    /**
     * Specifies the series index
     * @default 0
     * @aspType int
     */
    @Property(0)
    public series: number;

    /**
     * Specifies the point index
     * @default 0
     * @aspType int
     */
    @Property(0)
    public point: number;

}
/**
 * Column series rounded corner options
 */
export class CornerRadius extends ChildProperty<CornerRadius> {
    /**
     * Specifies the top left corner radius value
     * @default 0
     */
    @Property(0)
    public topLeft: number;
    /**
     * Specifies the top right corner radius value
     * @default 0
     */
    @Property(0)
    public topRight: number;
    /**
     * Specifies the bottom left corner radius value
     * @default 0
     */
    @Property(0)
    public bottomLeft: number;
    /**
     * Specifies the bottom right corner radius value
     * @default 0
     */
    @Property(0)
    public bottomRight: number;
}
 /**
  * @private
  */
export class Index {
    public series: number;
    public point: number;
    constructor(seriesIndex: number, pointIndex?: number) {
        this.series = seriesIndex;
        this.point = pointIndex;
    }
}
/**
 * Configures the Empty Points of series
 */

export class EmptyPointSettings extends ChildProperty<EmptyPointSettings> {

    /**
     * To customize the fill color of empty points.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Options to customize the border of empty points.
     * @default "{color: 'transparent', width: 0}"
     */
    @Complex<BorderModel>({color: 'transparent', width: 0}, Border)
    public border: BorderModel;

    /**
     * To customize the mode of empty points.
     * @default Gap
     */
    @Property('Gap')
    public mode: EmptyPointMode | AccEmptyPointMode;
}

/**
 * Configures the ToolTips in the chart.
 * @public
 */

export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables / Disables the visibility of the tooltip.
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * Enables / Disables the visibility of the marker.
     * @default true.
     */

    @Property(true)
    public enableMarker: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.
     * @default false.
     */

    @Property(false)
    public shared: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @default null 
     */

    @Property(null)
    public fill: string;

    /**
     * Header for tooltip. 
     * @default null
     */

    @Property(null)
    public header: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
     * @default 0.75
     */

    @Property(0.75)
    public opacity: number;

    /**
     * Options to customize the ToolTip text.
     */

    @Complex<FontModel>(Theme.tooltipLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Format the ToolTip content.
     * @default null.
     */

    @Property(null)
    public format: string;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     */

    @Property(null)
    public template: string;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.
     * @default true.
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Options to customize tooltip borders.
     */
    @Complex<BorderModel>({ color: '#cccccc', width: 0.5 }, Border)
    public border: BorderModel;

}

/**
 * button settings in period selector
 */
export class Periods extends ChildProperty<Periods> {
    /**
     * IntervalType of button
     * @default 'Years'
     */
    @Property('Years')
    public intervalType: RangeIntervalType;

    /**
     * Count value for the button
     * @default 1
     */
    @Property(1)
    public interval: number;

    /**
     * Text to be displayed on the button
     * @default null
     */
    @Property(null)
    public text: string;

    /**
     * To select the default period
     * @default false
     */
    @Property(false)
    public selected: boolean;
}

/**
 * Period Selector Settings
 */
export class PeriodSelectorSettings extends ChildProperty<PeriodSelectorSettings> {

    /**
     * Height for the period selector
     * @default 43
     */
    @Property(43)
    public height: number;

    /**
     * vertical position of the period selector
     * @default 'Bottom'
     */
    @Property('Bottom')
    public position: PeriodSelectorPosition;

    /**
     * Buttons
     */
    @Collection<PeriodsModel>([], Periods)
    public periods: PeriodsModel[];
}