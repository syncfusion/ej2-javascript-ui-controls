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

     */
    @Property('Line')
    public type: ConnectorType;

    /**
     * Color of the connector line.

     */
    @Property(null)
    public color: string;

    /**
     * Width of the connector line in pixels.

     */
    @Property(1)
    public width: number;

    /**
     * Length of the connector line in pixels.

     */
    @Property(null)
    public length: string;

    /**
     * dashArray of the connector line.

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

     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.

     */
    @Property('16px')
    public size: string;

    /**
     * FontWeight for the text.

     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Color for the text.

     */
    @Property('')
    public color: string;

    /**
     * text alignment

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

     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the chart title text overflow

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

     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.

     */
    @Property(1)
    public width: number;

}
/**
 * Configures the marker position in the chart.
 */
export class Offset extends ChildProperty<Offset> {

    /**
     * x value of the marker position

     */
    @Property(0)
    public x: number;

    /**
     * y value of the marker position

     */
    @Property(0)
    public y: number;

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

     */
    @Property('transparent')
    public background: string;

    /**
     * The opacity for background.

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

     */
    @Property(10)
    public left: number;

    /**
     * Right margin in pixels.

     */
    @Property(10)
    public right: number;

    /**
     * Top margin in pixels.

     */
    @Property(10)
    public top: number;

    /**
     * Bottom margin in pixels.

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

     */

    @Property(true)
    public enable: boolean;

    /**
     * The duration of animation in milliseconds.

     */

    @Property(1000)
    public duration: number;

    /**
     * The option to delay animation of the series.

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


     */
    @Property(0)
    public series: number;

    /**
     * Specifies the point index


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

     */
    @Property(0)
    public topLeft: number;
    /**
     * Specifies the top right corner radius value

     */
    @Property(0)
    public topRight: number;
    /**
     * Specifies the bottom left corner radius value

     */
    @Property(0)
    public bottomLeft: number;
    /**
     * Specifies the bottom right corner radius value

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

     */
    @Property(null)
    public fill: string;

    /**
     * Options to customize the border of empty points.

     */
    @Complex<BorderModel>({color: 'transparent', width: 0}, Border)
    public border: BorderModel;

    /**
     * To customize the mode of empty points.

     */
    @Property('Gap')
    public mode: EmptyPointMode | AccEmptyPointMode;
}

/**
 * Configures the drag settings of series
 */

export class DragSettings extends ChildProperty<DragSettings> {

    /**
     * To enable the drag the points

     */
    @Property(false)
    public enable: boolean;

    /**
     * To set the minimum y of the point

     */
    @Property(null)
    public minY: number;

    /**
     * To set the maximum y of the point

     */
    @Property(null)
    public maxY: number;

    /**
     * To set the color of the edited point

     */
    @Property(null)
    public fill: string;

}

/**
 * Configures the ToolTips in the chart.
 * @public
 */

export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables / Disables the visibility of the tooltip.

     */

    @Property(false)
    public enable: boolean;

    /**
     * Enables / Disables the visibility of the marker.

     */

    @Property(true)
    public enableMarker: boolean;

    /**
     * If set to true, a single ToolTip will be displayed for every index.

     */

    @Property(false)
    public shared: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.

     */

    @Property(null)
    public fill: string;

    /**
     * Header for tooltip. 

     */

    @Property(null)
    public header: string;

    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 

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

     */

    @Property(null)
    public format: string;

    /**
     * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.

     */

    @Property(null)
    public template: string;

    /**
     * If set to true, ToolTip will animate while moving from one point to another.

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

     */
    @Property('Years')
    public intervalType: RangeIntervalType;

    /**
     * Count value for the button

     */
    @Property(1)
    public interval: number;

    /**
     * Text to be displayed on the button

     */
    @Property(null)
    public text: string;

    /**
     * To select the default period

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

     */
    @Property(43)
    public height: number;

    /**
     * vertical position of the period selector

     */
    @Property('Bottom')
    public position: PeriodSelectorPosition;

    /**
     * Buttons
     */
    @Collection<PeriodsModel>([], Periods)
    public periods: PeriodsModel[];
}