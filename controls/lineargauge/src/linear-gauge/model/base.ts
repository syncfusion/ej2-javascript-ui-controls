import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { BorderModel, FontModel } from '../model/base-model';
import { Placement, ContainerType } from '../utils/enum';

/**
 * Options for customizing the fonts.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Font size for text.
     */
    @Property('16px')
    public size: string;

    /**
     * Color for text.
     */
    @Property('')
    public color: string;

    /**
     * FontFamily for text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * FontWeight for text.
     */
    @Property('Regular')
    public fontWeight: string;

    /**
     * FontStyle for text.
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Opacity for text.
     */
    @Property(1)
    public opacity: number;

}

/**
 * Configures the margin of linear gauge.
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
 * Configures the border in linear gauge.
 */
export class Border extends ChildProperty<Border> {

    /**
     * The color of the border, which accepts value in hex, rgba as a valid CSS color string.
     */
    @Property(null)
    public color: string;

    /**
     * The width of the border in pixels.
     * @default '0'
     */
    @Property(0)
    public width: number;

}

/**
 * Options for customizing the annotation.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Specifies the id of html element.
     */
    @Property('')
    public content: string;

    /**
     * Specifies the position of x.
     */
    @Property(0)
    public x: number;

    /**
     * Specifies the position of y.
     */
    @Property(0)
    public y: number;

    /**
     * Specifies the vertical alignment of annotation.
     * @default None
     */
    @Property('None')
    public verticalAlignment: Placement;

    /**
     * Specifies the horizontal alignment of annotation.
     * @default None
     */
    @Property('None')
    public horizontalAlignment: Placement;

    /**
     * Specifies the zIndex of the annotation.
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;

    /**
     * The font of the axis labels.
     */

    @Complex<FontModel>({ size: '12px', color: null }, Font)
    public font: FontModel;

    /**
     * Specifies the index of axis.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public axisIndex: number;

    /**
     * Specifies the value of axis.
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public axisValue: number;

}

/**
 * Options for customizing the container of linear gauge.
 */

export class Container extends ChildProperty<Container> {
    /**
     * Specifies the type of container.
     * @default Normal
     */
    @Property('Normal')
    public type: ContainerType;

    /**
     * Specifies the height of the container.
     * @default 0
     */
    @Property(0)
    public height: number;

    /**
     * Specifies the width of the container.
     * @default 0
     */
    @Property(0)
    public width: number;

    /**
     * Specifies the corner radius for rounded rectangle.
     * @default 10
     */
    @Property(10)
    public roundedCornerRadius: number;

    /**
     * Specifies the background of the color.
     */
    @Property('transparent')
    public backgroundColor: string;

    /**
     * Specifies the border of container.
     */
    @Complex<BorderModel>({ width: 1, color: '#bfbfbf' }, Border)
    public border: BorderModel;

    /**
     * Specifies to move the container.
     */
    @Property(0)
    public offset: number;
}

/**
 * Options for customizing the tooltip in linear gauge.
 */

export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enable / Disable the visibility of tooltip.
     * @default false
     */

    @Property(false)
    public enable: boolean;

    /**
     * The fill color of the tooltip, which accepts value in hex, rgba as a valid CSS color string. 
     */

    @Property('#000000')
    public fill: string;

    /**
     * Options to customize the tooltip text.
     */

    @Complex<FontModel>({ color: '#ffffff', size: '13px' }, Font)
    public textStyle: FontModel;

    /**
     * Format of the tooltip content.
     * @default null
     */

    @Property(null)
    public format: string;

    /**
     * Custom template to format the tooltip content. Use ${x} and ${y} as a placeholder text to display the corresponding data point.
     * @default null
     */

    @Property(null)
    public template: string;

    /**
     * If set true, tooltip will animate, while moving from one point to another.
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Options to customize the border for tooltip.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
}


