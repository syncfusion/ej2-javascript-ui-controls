import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { TextAlignmentType } from '../utils/enum';
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
     * @default 1
     */
    @Property(1)
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
