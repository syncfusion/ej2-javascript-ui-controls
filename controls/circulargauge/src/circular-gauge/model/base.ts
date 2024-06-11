import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { FontModel, BorderModel, RangeTooltipModel, AnnotationTooltipModel, MarginModel, LocationModel } from './base-model';
import { Alignment, GaugeShape, LegendPosition } from '../utils/enum';
import { Theme } from '../model/theme';

/**
 * Sets and gets the options to customize the styles of the borders in circular gauge.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Gets and sets the color of the border in the circular gauge. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Gets and sets the width of the border in circular gauge.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Gets and sets the dash-array of the border.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;

}

/**
 * Sets and gets the font style for the circular gauge.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Gets and sets the text font size in an annotation, label, tooltip, and so on. The default of the size is '16px'.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Gets and sets the font color of the text in annotation, label, tooltip, and so on.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Gets and sets the font family for the text in annotation, label, tooltip, and so on.
     *
     * @default 'segoe UI'
     */
    @Property('segoe UI')
    public fontFamily: string;

    /**
     * Gets and sets the font weight for the text in annotation, label, tooltip, and so on.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Gets and sets the font style for the text in annotation, label, tooltip, and so on.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Sets and gets the font opacity for the text in annotation, label, tooltip, and so on.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

}

/**
 * Sets and gets the options to customize the tooltip properties for range tooltip.
 */
export class RangeTooltip extends ChildProperty<RangeTooltip> {
    /**
     * Gets and sets the fill color of the range tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Sets and gets the options for the text style of the tooltip text for ranges in circular gauge.
     */

    @Complex<FontModel>({ size: null, fontFamily: null, opacity: null , fontWeight: null }, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the format of the range tooltip in circular gauge.
     *
     * @default null
     */
    @Property(null)
    public format: string;

    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y}
     * as a placeholder text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: string | Function;

    /**
     * Enables and disables the animation for the range tooltip. The animation is set as true by default.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the style properties of the border for range tooltip.
     */
    @Complex<BorderModel>({ color: null }, Border)
    public border: BorderModel;

    /**
     * Enables and disables the range tooltip to be shown at mouse position. By default, it set as false.
     *
     * @default false
     */
    @Property(false)
    public showAtMousePosition: boolean;
}

/**
 * Sets and gets the options to customize the tooltip for annotation in circular gauge.
 */
export class AnnotationTooltip extends ChildProperty<AnnotationTooltip> {

    /**
     * Sets and gets the fill color of the annotation tooltip. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Gets and sets the tooltip text style of annotation.
     */
    @Complex<FontModel>({ size: '13px', fontFamily: null, opacity: null }, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the format of annotation in tooltip.
     *
     * @default null
     */

    @Property(null)
    public format: string;

    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y}
     * as a placeholder text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * Enables and disables the animation of the annotation tooltip. By default, the animation is set as true.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the style properties of the border for annotation tooltip.
     */
    @Complex<BorderModel>({ color: null }, Border)
    public border: BorderModel;

}

/**
 * Sets and gets the margin of circular gauge.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Gets and sets the left margin value of the gauge.
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Gets and sets the right margin value of the gauge.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Gets and sets the top margin value of the gauge.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Gets and sets the bottom margin value of the gauge.
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}

/**
 * Sets and gets the options to customize the tooltip of the circular gauge.
 */

export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables the visibility of tooltip.
     *
     * @default false
     */

    @Property(false)
    public enable: boolean;

    /**
     * Sets and gets the fill color of the pointer tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Gets and sets the text style of the pointer tooltip.
     */

    @Complex<FontModel>({ size: null, fontFamily: null, opacity: null, fontWeight: null }, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the tooltip settings of the range in circular gauge.
     */

    @Complex<RangeTooltipModel>({}, RangeTooltip)
    public rangeSettings: RangeTooltipModel;

    /**
     * Gets and sets the tooltip settings for the annotation in circular gauge.
     */

    @Complex<AnnotationTooltipModel>({}, AnnotationTooltip)
    public annotationSettings: AnnotationTooltipModel;

    /**
     * Sets and gets the format for the pointer tooltip content in circular gauge. Use ${value} as a placeholder text to display corresponding pointer value.
     *
     * @default null
     */

    @Property(null)
    public format: string;

    /**
     * Sets and gets the custom template to format the tooltip content. Use ${x} and ${y}
     * as a placeholder text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * Enables and disables the animation of the pointer tooltip in circular gauge.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the style properties of the border for pointer tooltip.
     */
    @Complex<BorderModel>({ color: null }, Border)
    public border: BorderModel;

    /**
     * Enables and disables to show the tooltip of the pointer at mouse position. When set as false which is the default value, the tooltip will be displayed over the axis line.
     *
     * @default false
     */
    @Property(false)
    public showAtMousePosition: boolean;

    /**
     * Sets and gets the elements such as range, annotation and pointer to which the tooltip must be displayed.
     *
     * @default Pointer
     */
    @Property('Pointer')
    public type: string[];
}

/**
 * Sets and gets the location of the legend in circular gauge.
 */
export class Location extends ChildProperty<Location>  {
    /**
     * Sets and gets the X coordinate of the legend in the circular gauge.
     *
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Sets and gets the Y coordinate of the legend in the circular gauge.
     *
     * @default 0
     */
    @Property(0)
    public y: number;
}
/**
 * Sets and gets the options to customize the legend for the ranges in the circular gauge.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {

    /**
     * Enable and disables the visibility of the legend in circular gauge.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Enables and disables the visibility of the ranges. When the legend is clicked, the visibility of the legend will be toggled.
     *
     * @default true
     */
    @Property(true)
    public toggleVisibility: boolean;

    /**
     * Sets and gets the alignment of the legend in the circular gauge.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Sets and gets the options to customize the style properties of the border of the legend.
     *
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Sets and gets the options to customize the style properties of the border for the shape of the legend in the circular gauge.
     */
    @Complex<BorderModel>({}, Border)
    public shapeBorder: BorderModel;

    /**
     * Sets and gets the options to customize the padding between legend items.
     *
     * @default 8
     */
    @Property(8)
    public padding: number;

    /**
     * Sets and gets the opacity of the legend.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Sets and gets the position of the legend in the circular gauge.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public position: LegendPosition;

    /**
     * Sets and gets the shape of the legend in circular gauge.
     *
     * @default Circle
     */
    @Property('Circle')
    public shape: GaugeShape;

    /**
     * Sets and gets the height of the legend in the circular gauge.
     *
     * @default null
     */
    @Property(null)
    public height: string;

    /**
     * Sets and gets the width of the legend in the circular gauge.
     *
     * @default null
     */
    @Property(null)
    public width: string;

    /**
     * Sets and gets the options to customize the text of the legend item.
     */
    @Complex<FontModel>(Theme.legendLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the height of the legend shape in circular gauge.
     *
     * @default 10
     */
    @Property(10)
    public shapeHeight: number;

    /**
     * Sets and gets the width of the legend shape in circular gauge.
     *
     * @default 10
     */
    @Property(10)
    public shapeWidth: number;

    /**
     * Sets and gets the padding for the legend shape in circular gauge.
     *
     * @default 5
     */
    @Property(5)
    public shapePadding: number;

    /**
     * Sets and gets the location of the legend, relative to the circular gauge.
     * If x is 20, legend moves by 20 pixels to the right of the gauge. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Gauge'></div>
     * ```
     * ```typescript
     * let gauge: CircularGauge = new CircularGauge({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * this.gauge.appendTo('#Gauge');
     * ```
     */
    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Sets and gets the background color of the legend in circular gauge.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Sets and gets the options to customize the legend margin.
     */
    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public margin: MarginModel;
}
