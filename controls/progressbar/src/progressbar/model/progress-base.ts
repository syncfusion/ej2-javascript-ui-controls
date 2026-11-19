import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { TextAlignmentType } from '../utils/enum';
import { BorderModel, FontModel } from './progress-base-model';

/**
 * progress bar complex interface
 */
export class Margin extends ChildProperty<Margin> {
    /**
     * To customize top margin value
     *
     * @default 10
     */

    @Property(10)
    public top: number;

    /**
     * To customize top bottom value
     *
     * @default 10
     */

    @Property(10)
    public bottom: number;

    /**
     * To customize top left value
     *
     * @default 10
     */

    @Property(10)
    public left: number;

    /**
     * To customize top right value
     *
     * @default 10
     */

    @Property(10)
    public right: number;

}

/**
 * Configures the fonts in progressbar
 */
export class Font extends ChildProperty<Font> {
    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Color for the text.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * FontFamily for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Opacity for the text.
     *
     * @default null
     */
    @Property(null)
    public opacity: number;

    /**
     * text alignment for label
     *
     * @default Far
     */
    @Property('Far')
    public textAlignment: TextAlignmentType;

    /**
     * label text
     *
     * @default ''
     */
    @Property('')
    public text: string;
}

/**
 * Animation
 */
export class Animation extends ChildProperty<Animation> {
    /**
     * enable
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * duration
     *
     * @default 2000
     */
    @Property(2000)
    public duration: number;
    /**
     * delay
     *
     * @default 0
     */
    @Property(0)
    public delay: number;
}
/**
 * Annotation
 */
export class ProgressAnnotationSettings extends ChildProperty<ProgressAnnotationSettings> {
    /**
     * Content of the annotation, which accepts the id of the custom element.
     *
     * @default null
     */
    @Property(null)
    public content: string;
    /**
     * to move annotation
     *
     * @default 0
     */
    @Property(0)
    public annotationAngle: number;
    /**
     * to move annotation
     *
     * @default '0%'
     */
    @Property('0%')
    public annotationRadius: string;
}

/**
 * Configures the border for the tooltip of the progress bar.
 */
export class Border extends ChildProperty<Border> {
    /**
     * The color of the border that accepts value in hex as a valid CSS color string.
     *
     * @default ''
     */

    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

}

/**
 *  Options to customize the tooltip for the progress bar. 
 *
 *  @default {} 
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * If set to true, tooltip will be displayed for the progress bar.
     *
     * @default false.
     */

    @Property(false)
    public enable: boolean;

    /**
     * The fill color of the tooltip that accepts value in hex as a valid CSS color string.
     *
     * @default null.
     */

    @Property(null)
    public fill: string;

    /**
     * Format the tooltip content. Use ${value} as the placeholder text to display the corresponding progress value.
     *
     * @default null.
     */

    @Property(null)
    public format: string;

    /**
     * If set to true, tooltip will be displayed for the progress bar on mouse hover.
     *
     * @default false.
     */

    @Property(false)
    public showTooltipOnHover: boolean;

    /**
     * Options to customize the tooltip text.
     *
     */

    @Complex<FontModel>({fontFamily: null, size: '12px', fontWeight: null, fontStyle: 'Normal', color: null}, Font)
    public textStyle: FontModel;

    /**
     * Options to customize tooltip borders.
     *
     * @default {}
     */

    @Complex<BorderModel>({ color: '#cccccc', width: 0.5 }, Border)
    public border: BorderModel;
}

/**
 * RangeColor
 */
export class RangeColor extends ChildProperty<RangeColor> {
    /**
     * color
     *
     * @default null
     */
    @Property('')
    public color: string;
    /**
     * start
     *
     * @default null
     */
    @Property(null)
    public start: number;
    /**
     * end
     *
     * @default null
     */
    @Property(null)
    public end: number;
}
