import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { FontModel, BorderModel, RangeTooltipModel, AnnotationTooltipModel } from './base-model';

/**
 * Sets and gets the options to customize the color and width of the borders in circular gauge.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Gets and sets the color of the border in the circular gauge. This property accepts value in hex code,
     * rgba string as a valid CSS color string.
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
     */
      @Property('')
      public dashArray: string;

}

/**
 * Sets and gets the font style for the circular gauge.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Gets and sets the font size of the text in annotation, label, and tooltip, etc. The default of the size is '16px'.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Gets and sets the font color of the text in annotation, label and tooltip etc.
     */
    @Property('')
    public color: string;

    /**
     * Gets and sets the font family for the given text in annotation, tooltip etc.
     *
     * @default 'segoe UI'
     */
    @Property('segoe UI')
    public fontFamily: string;

    /**
     * Gets and sets the font weight for the text in annotation, tooltip etc.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Gets and sets the style of the font, which is in in annotation, tooltip etc.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Sets and gets the opacity for the annotation or tooltip text.
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
     * Sets and gets the options for the text style of the tooltip text for ranges in circular Gauge.
     */

    @Complex<FontModel>({ size: '13px' }, Font)
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
     */
    @Property(null)
    public template: string;

    /**
     * Enables and disables the animation for the range tooltip. The animation is set as true by default.
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
    @Complex<FontModel>({ size: '13px' }, Font)
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
     */

    @Property(null)
    public template: string;

    /**
     * Enables and disables the animation of the annotation tooltip. By default, the animation is set as true.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the border for annotation tooltip.
     */
    @Complex<BorderModel>({}, Border)
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
     * Enables or Disables the visibility of tooltip.
     *
     * @default false
     */

    @Property(false)
    public enable: boolean;

    /**
     * Sets and gets the fill color of the tooltip. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Gets and sets the text style of the gauge tooltip.
     */

    @Complex<FontModel>({ size: '13px' }, Font)
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
     * Sets and gets the format for the tooltip content in circular gauge.
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
     */

    @Property(null)
    public template: string;

    /**
     * Enables and disables the animation to take place in circular gauge.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Sets and gets the options to customize the border for circular gauge tooltip.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Enables and disables the tooltip of the circular gauge at mouse position. By default, it set as false.
     *
     * @default false
     */
    @Property(false)
    public showAtMousePosition: boolean;

    /**
     * Sets and gets the options to select the type of tooltip for range, annotation and pointer.
     *
     * @default Pointer
     */
    @Property('Pointer')
    public type: string[];
}
