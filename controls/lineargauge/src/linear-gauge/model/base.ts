import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { BorderModel, FontModel, RangeTooltipModel } from '../model/base-model';
import { Placement, ContainerType, TooltipPosition } from '../utils/enum';

/**
 * Sets and gets the options for customizing the fonts.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Sets and gets the size of the font in text.
     */
    @Property('16px')
    public size: string;

    /**
     * Sets and gets the font color for text.
     * 
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Sets and gets the font-family for text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Sets and gets the font weight of the text.
     * 
     * @default 'Regular'
     */
    @Property('Regular')
    public fontWeight: string;

    /**
     * Sets and gets the font style for the text.
     * 
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Sets and gets the opacity of the text.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

}

/**
 * Sets and gets the margin for the linear gauge.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Sets and gets the left margin for linear gauge.
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Sets and gets the right margin for linear gauge.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Sets and gets the top margin for linear gauge.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Sets and gets the bottom margin for linear gauge.
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}

/**
 * Sets and gets the options to customize the style properties of the border for the linear gauge.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Sets and gets the color of the border. This property accepts value in hex code, rgba string as a valid CSS color string.
     */
    @Property(null)
    public color: string;

    /**
     * Sets and gets the width of the border.
     *
     * @default 0
     */
    @Property(0)
    public width: number;

    /**
     * Sets and gets the dash-array of the border.
     */
    @Property('')
    public dashArray: string;

}

/**
 * Sets and gets the options for customizing the annotation in linear gauge.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Sets and gets the content for the annotation.
     * @default ''
     * @aspType string
     */
    @Property('')
    public content: string | Function;

    /**
     * Sets and gets the x position for the annotation in linear gauge.
     * 
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Sets and gets the y position for the annotation in linear gauge.
     * 
     * @default 0
     */
    @Property(0)
    public y: number;

    /**
     * Sets and gets the vertical alignment of annotation.
     *
     * @default None
     */
    @Property('None')
    public verticalAlignment: Placement;

    /**
     * Sets and gets the horizontal alignment of annotation.
     *
     * @default None
     */
    @Property('None')
    public horizontalAlignment: Placement;

    /**
     * Sets and gets the z-index of the annotation.
     *
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;

    /**
     * Sets and gets the options to customize the font of the annotation in linear gauge.
     */

    @Complex<FontModel>({ size: '12px', color: null }, Font)
    public font: FontModel;

    /**
     * Sets and gets the axis index which places the annotation in the specified axis in the linear gauge.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public axisIndex: number;

    /**
     * Sets and gets the value of axis which places the annotation near the specified axis value.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public axisValue: number;

}

/**
 * Sets and gets the options for customizing the container of linear gauge.
 */

export class Container extends ChildProperty<Container> {
    /**
     * Sets and gets the type of container in linear gauge.
     *
     * @default Normal
     */
    @Property('Normal')
    public type: ContainerType;

    /**
     * Sets and gets the height of the container in linear gauge.
     *
     * @default 0
     */
    @Property(0)
    public height: number;

    /**
     * Sets and gets the width of the container in linear gauge.
     *
     * @default 0
     */
    @Property(0)
    public width: number;

    /**
     * Sets and gets the corner radius for the rounded rectangle container in linear gauge.
     *
     * @default 10
     */
    @Property(10)
    public roundedCornerRadius: number;

    /**
     * Sets and gets the background color of the container in linear gauge.
     * 
     * @default 'transparent'
     */
    @Property('transparent')
    public backgroundColor: string;

    /**
     * Sets and gets the options to customize the border of container.
     */
    @Complex<BorderModel>({ width: 1, color: null }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the offset value from where the container must be placed in the linear gauge.
     *
     * @default 0
     */
    @Property(0)
    public offset: number;
}

/**
 * Sets and gets the options to customize the tooltip for range in axis.
 */
export class RangeTooltip extends ChildProperty<RangeTooltip> {
    /**
     * Sets and gets the fill color of the range tooltip, which accepts the value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Sets and gets the options to customize the tooltip text of range in axis.
     */

    @Complex<FontModel>({ size: null, opacity: null, fontFamily: null, fontWeight: null }, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the format for the tooltip content of the range. Use "{start}" and "{end}" as a placeholder
     * text to display the corresponding start and end value of the range in the tooltip.
     *
     * @default null
     */

    @Property(null)
    public format: string;

    /**
     * Sets and gets the custom template to format the tooltip content.
     *
     * @default null
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * Enables or disables the animation for the range tooltip when moved from one place to another.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the border for range tooltip.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Sets and gets the position type to place the tooltip in the axis .
     *
     * @default End
     */
    @Property('End')
    public position: TooltipPosition;
    /**
     * Enables and disables to show the tooltip of the range at mouse position. When set as false which is the default value, the tooltip will be displayed over the axis line.
     *
     * @default false
     */
    @Property(false)
    public showAtMousePosition: boolean;
}
/**
 * Sets and gets the options for customizing the tooltip in linear gauge.
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
     * Sets and gets the color of the tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     */

    @Property('')
    public fill: string;

    /**
     * Sets and gets the options to customize the text in tooltip.
     */

    @Complex<FontModel>({ color: '', size: null, opacity: null, fontFamily: null, fontWeight: null }, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the format of the tooltip content in linear gauge. Use "{value}" as a placeholder
     * text to display the corresponding pointer value of in the tooltip.
     *
     * @default null
     */

    @Property(null)
    public format: string;

    /**
     * Enables and disables to show the tooltip of the pointer at mouse position. When set as false which is the default value, the tooltip will be displayed over the axis line.
     *
     * @default false
     */
    @Property(false)
    public showAtMousePosition: boolean;
    /**
     * Sets and gets the options to customize the range tooltip.
     */
    @Complex<RangeTooltipModel>({}, RangeTooltip)
    public rangeSettings: RangeTooltipModel;

    /**
     * Sets and gets the position type to place the tooltip in the axis.
     *
     * @default End
     */
    @Property('End')
    public position: TooltipPosition;
    /**
     * Sets and gets the custom template to format the tooltip content.
     *
     * @default null
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * Enables or disables the animation for the tooltip while moving from one place to another.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the border for tooltip.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Sets and gets the option to display the tooltip for range and pointer.
     *
     * @default Pointer
     */
    @Property('Pointer')
    public type: string[];
}
