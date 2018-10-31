import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { Alignment, TextOverflow } from '../utils/enum';
import { FontModel } from './base-model';
/**
 * Configures the fonts in heat map.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Font size for the text.
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Color for the text.
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
     * FontWeight for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * text alignment
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Specifies the heat map text overflow
     * @default 'Trim'
     */
    @Property('Trim')
    public textOverflow: TextOverflow;

}

/**
 * Configures the heat map margins.
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
 * Configures the borders in the heat map.
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

    /**
     * The radius of the border in pixels.
     * @default ''
     */
    @Property('')
    public radius: number;

}
/**
 * Configures the mapping name for size and color in SizeAndColor type.
 */
export class BubbleData extends ChildProperty<BubbleData> {

    /**
     * Mapping property to set size.
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Mapping property to set color.
     * @default null
     */
    @Property(null)
    public color: string;

}

/**
 * class used to maintain Title styles.
 */
export class Title extends ChildProperty<Title> {
    /**
     * Title text
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Options for customizing the title.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;
}
/**
 * class used to maintain palette information.
 */
export class PaletteCollection extends ChildProperty<PaletteCollection> {
    /**
     * Palette color value
     * @default null
     */
    @Property(null)
    public value: number;

    /**
     * Palette color text
     * @default ''
     */
    @Property(null)
    public color: string;
    /**
     * Palette color label
     * @default ''
     */
    @Property(null)
    public label: string;
}
/**
 * Internal class used to maintain colorcollection.
 */
export class ColorCollection {
    public value: number;
    public color: string;
    public label: string;
    constructor(value: number, color: string, label: string) {
        this.value = value;
        this.color = color;
        this.label = label;
    }
}
/**
 * class used to maintain color and value collection.
 */
export class BubbleTooltipData {
    public mappingName: string;
    public bubbleData: number;
    public valueType: string;
    constructor(mappingName: string, bubbleData: number, valueType: string) {
        this.mappingName = mappingName;
        this.bubbleData = bubbleData;
        this.valueType = valueType;
    }
}
/**
 * Internal class used to maintain legend colorcollection.
 */
export class LegendColorCollection {
    public value: number;
    public color: string;
    public label: string;
    public isHidden: boolean;
    constructor(value: number, color: string, label: string, isHidden: boolean) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.isHidden = isHidden;
    }
}