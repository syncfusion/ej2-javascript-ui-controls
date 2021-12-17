import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { Alignment, TextOverflow, BorderType } from '../utils/enum';
import { FontModel, MultiLevelCategoriesModel, AxisLabelBorderModel } from './base-model';
import { Theme } from './theme';
/**
 * Configures the fonts in heat map.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Font size for the text.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

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
     * FontWeight for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * text alignment
     *
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Specifies the heat map text overflow
     *
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
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Right margin in pixels.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Top margin in pixels.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Bottom margin in pixels.
     *
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

    /**
     * The radius of the border in pixels.
     *
     * @default ''
     */
    @Property('')
    public radius: number;

}

/**
 * Configures the tooltip borders in the heat map.
 */
export class TooltipBorder extends ChildProperty<TooltipBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     *
     * @default 0
     */
    @Property(0)
    public width: number;
}

/**
 * Configures the mapping name for size and color in SizeAndColor type.
 */
export class BubbleData extends ChildProperty<BubbleData> {

    /**
     * Mapping property to set size.
     *
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Mapping property to set color.
     *
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
     *
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
 * class used to maintain the fill color value for cell color range
 */
export class FillColor extends ChildProperty<FillColor> {
    /**
     * minimum fill color for cell color range
     *
     * @default '#eeeeee'
     */
    @Property('#eeeeee')
    public minColor: string;

    /**
     * maximum fill color for cell color range
     *
     * @default '#eeeeee'
     */
    @Property('#eeeeee')
    public maxColor: string;
}

/**
 * class used to maintain palette information.
 */
export class PaletteCollection extends ChildProperty<PaletteCollection> {
    /**
     * Palette color value
     *
     * @default null
     */
    @Property(null)
    public value: number;

    /**
     * Palette color text
     *
     * @default ''
     */
    @Property(null)
    public color: string;

    /**
     * Palette color label
     *
     * @default ''
     */
    @Property(null)
    public label: string;

    /**
     * Palette start value
     *
     * @default null
     */
    @Property(null)
    public startValue: number;

    /**
     * Palette end value
     *
     * @default null
     */
    @Property(null)
    public endValue: number;

    /**
     * Palette minColor value
     *
     * @default null
     */
    @Property(null)
    public minColor: string;

    /**
     * Palette maxColor value
     *
     * @default null
     */
    @Property(null)
    public maxColor: string;
}
/**
 * label border properties.
 */
export class AxisLabelBorder extends ChildProperty<AxisLabelBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property('#b5b5b5')
    public color: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top/Bottom Border
     * * Without Border
     * * Without Bottom Border
     * * Brace
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public type: BorderType;
}

export class BubbleSize extends ChildProperty<BubbleSize> {
    /**
     * Specifies the minimum radius value of the cell in percentage.
     *
     * @default '0%'
     */
    @Property('0%')
    public minimum: string;

    /**
     * Specifies the maximum radius value of the cell in percentage.
     *
     * @default '100%'
     */

    @Property('100%')
    public maximum: string;
}

/**
 * categories for multi level labels
 */
export class MultiLevelCategories extends ChildProperty<MultiLevelCategories> {

    /**
     * Start value of the multi level labels
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: number | Date | string;
    /**
     * End value of the multi level labels
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: number | Date | string;
    /**
     * multi level labels text.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Maximum width of the text for multi level labels.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public maximumTextWidth: number;

}

/**
 * MultiLevelLabels properties
 */
export class MultiLevelLabels extends ChildProperty<MultiLevelLabels[]> {

    /**
     * Defines the position of the multi level labels. They are,
     * * Near: Places the multi level labels at Near.
     * * Center: Places the multi level labels at Center.
     * * Far: Places the multi level labels at Far.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Defines the textOverFlow for multi level labels. They are,
     * * Trim: Trim textOverflow for multi level labels.
     * * Wrap: Wrap textOverflow for multi level labels.
     * * none: None textOverflow for multi level labels.
     *
     * @default 'Wrap'
     */
    @Property('Wrap')
    public overflow: TextOverflow;
    /**
     * Options to customize the multi level labels.
     */
    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public textStyle: FontModel;
    /**
     * Border of the multi level labels.
     */
    @Complex<AxisLabelBorderModel>({ color: '#b5b5b5', width: 1, type: 'Rectangle' }, AxisLabelBorder)
    public border: AxisLabelBorderModel;
    /**
     * multi level categories for multi level labels.
     */
    @Collection<MultiLevelCategories>([], MultiLevelCategories)
    public categories: MultiLevelCategoriesModel[];
}



/**
 * Internal class used to maintain colorcollection.
 */
export class ColorCollection {
    public value: number;
    public color: string;
    public label: string;
    public startValue: number;
    public endValue: number;
    public minColor: string;
    public maxColor: string;
    constructor(value: number, color: string, label: string, startValue: number, endValue: number, minColor: string, maxColor: string) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.startValue = startValue;
        this.endValue = endValue;
        this.minColor = minColor;
        this.maxColor = maxColor;

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
    public startValue: number;
    public endValue: number;
    public minColor: string;
    public maxColor: string;
    public isHidden: boolean;
    constructor(
        value: number, color: string, label: string, startValue: number, endValue: number, minColor: string,
        maxColor: string, isHidden: boolean) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.startValue = startValue;
        this.endValue = endValue;
        this.minColor = minColor;
        this.maxColor = maxColor;
        this.isHidden = isHidden;
    }
}
/**
 * class used to maintain xAxis labels details for multipleRow label intersect action.
 */
export class MultipleRow {
    public start: number;
    public end: number;
    public index: number = 1;
    public label: string;
    public row: number = 1;
    constructor(
        start: number, end: number, index: number, label: string, row: number) {
        this.start = start;
        this.end = end;
        this.index = index;
        this.label = label;
        this.row = row;
    }
}
