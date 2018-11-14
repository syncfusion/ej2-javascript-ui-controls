import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { FontModel, BorderModel } from './base-model';

/**
 * Configures the borders in circular gauge.
 */
export class Border extends ChildProperty<Border> {

    /**
     * The color of the border, which accepts value in hex, rgba as a valid CSS color string.
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
 * Configures the fonts in circular gauge.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Font size for text.
     * @default '16px'
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
     * @default 'segoe UI'
     */
    @Property('segoe UI')
    public fontFamily: string;

    /**
     * FontWeight for text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontStyle for text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Opacity for text.
     * @default 1
     */
    @Property(1)
    public opacity: number;

}

/**
 * Configures the margin of circular gauge.
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
 * Configures the tooltip in circular gauge.
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
     * @default '#000000'
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

    /**
     * Options to show the tooltip position on pointer
     * @default false
     */
    @Property(false)
    public showAtMousePosition: boolean;

}