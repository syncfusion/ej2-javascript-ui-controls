import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { Alignment, TextOverflow, BorderType } from '../utils/enum';
import { FontModel, MultiLevelCategoriesModel, AxisLabelBorderModel } from './base-model';
import { Theme } from './theme';
/**
 * Sets and gets the options to customize the text in heatmap.
 */

export class Font extends ChildProperty<Font> {

    /**
     * Specifies the font size for the text.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Specifies the color for the text.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Specifies the font family for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Specifies the font weight for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Specifies the font style for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Specifies the text alignment.
     *
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Specifies the overflow style for the text in heatmap.
     *
     * @default 'Trim'
     */
    @Property('Trim')
    public textOverflow: TextOverflow;

}

/**
 * Sets and gets the options to configures the margins of the heatmap.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Specifies the left margin in pixels.
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Specifies the right margin in pixels.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Specifies the top margin in pixels.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Specifies the bottom margin in pixels.
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}

/**
 * Sets and gets the options to customize the borders in the heatmap.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Sets and gets the color of the border that accepts value in hex value and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Specifies the width of the border in pixels.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Specifies the radius of the border in pixels.
     *
     * @default ''
     */
    @Property('')
    public radius: number;

}

/**
 * Sets and gets the options to customize the tooltip borders in the heatmap.
 */
export class TooltipBorder extends ChildProperty<TooltipBorder> {

    /**
     * Specifies the color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Sets and gets the width of the border in pixels.
     *
     * @default 0
     */
    @Property(0)
    public width: number;
}

/**
 * Sets and gets the options to configure the mapping value for size and color in bubble cell type.
 */
export class BubbleData extends ChildProperty<BubbleData> {

    /**
     * Specifies the mapping value to set size from the data source.
     *
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Specifies the mapping value to set color from the data source.
     *
     * @default null
     */
    @Property(null)
    public color: string;

}

/**
 * Sets and gets the options to customize the title of heatmap.
 */
export class Title extends ChildProperty<Title> {
    /**
     * Sets and gets the text for the title.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Sets and gets the options to customize the text of the title.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;
}

/**
 * Sets and gets the options to apply the fill color value for cell color range.
 */
export class FillColor extends ChildProperty<FillColor> {
    /**
     * Specifies the minimum fill color for cell color range.
     *
     * @default '#eeeeee'
     */
    @Property('#eeeeee')
    public minColor: string;

    /**
     * Specifies the maximum fill color for cell color range.
     *
     * @default '#eeeeee'
     */
    @Property('#eeeeee')
    public maxColor: string;
}

/**
 * Sets and gets the options to customize palette colors.
 */
export class PaletteCollection extends ChildProperty<PaletteCollection> {
    /**
     * Sets and gets the value in the heatmap data to set the palette color.
     *
     * @default null
     */
    @Property(null)
    public value: number;

    /**
     * Sets and gets the color for a palette.
     *
     * @default ''
     */
    @Property(null)
    public color: string;

    /**
     * Sets and gets the label to be set in the corresponding legend for the palette color.
     *
     * @default ''
     */
    @Property(null)
    public label: string;

    /**
     * Sets and gets the start value in the heatmap data to set the palette color.
     *
     * @default null
     */
    @Property(null)
    public startValue: number;

    /**
     * Sets and gets the end value in the heatmap data to set the palette color.
     *
     * @default null
     */
    @Property(null)
    public endValue: number;

    /**
     * Sets and gets the minimum color for color range in a palette.
     *
     * @default null
     */
    @Property(null)
    public minColor: string;

    /**
     * Sets and gets the maximum color for color range in a palette.
     *
     * @default null
     */
    @Property(null)
    public maxColor: string;
}
/**
 * Sets and gets the options to customize the label border.
 */
export class AxisLabelBorder extends ChildProperty<AxisLabelBorder> {

    /**
     * Sets and gets the color of the border that accepts value in hex value and rgba as a valid CSS color string.
     *
     * @default ''
     */
    @Property('#b5b5b5')
    public color: string;

    /**
     * Specifies the width of the border in pixels.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Specifies the type of the border for the axis labels. The following are the available types.
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

/**
 * Sets and gets the options to customize the size of the bubble heatmap cell type.
 */
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
 * Sets and gets the options to configure the multi-level labels.
 */
export class MultiLevelCategories extends ChildProperty<MultiLevelCategories> {

    /**
     * Specifies the start value of the multi-level label.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: number | Date | string;
    /**
     * Specifies the end value of the multi-level label.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: number | Date | string;
    /**
     * Specifies the text for multi-level label.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the maximum width of the text for multi-level label.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public maximumTextWidth: number;

}

/**
 * Sets and gets the options to customize the multi-level labels.
 */
export class MultiLevelLabels extends ChildProperty<MultiLevelLabels[]> {

    /**
     * Specifies the position of the multi-level labels. The available positions are,
     * * Near: Places the multi-level labels at left end of the available space.
     * * Center: Places the multi-level labels at center of the available space.
     * * Far: Places the multi-level labels at right end of the available space.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Sets and gets the overflow style of the multi-level labels. The available types are,
     * * None: No action is taken when the text overflows.
     * * Wrap: Wraps the multi-level labels when the text overflows.
     * * Trim: Trims the multi-level labels when the text overflows.
     *
     * @default 'Wrap'
     */
    @Property('Wrap')
    public overflow: TextOverflow;
    /**
     * Sets and gets the options to customize the text of the multi-level labels.
     */
    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the options to customize the border of the multi-level labels.
     */
    @Complex<AxisLabelBorderModel>({ color: '#b5b5b5', width: 1, type: 'Rectangle' }, AxisLabelBorder)
    public border: AxisLabelBorderModel;
    /**
     * Sets and gets the options to configure the multi-level labels.
     */
    @Collection<MultiLevelCategories>([], MultiLevelCategories)
    public categories: MultiLevelCategoriesModel[];
}



/**
 * Internal class used to maintain colorcollection.
 * @private
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
 * Specifies the current data of the bubble cell.
 */
export class BubbleTooltipData {
    /** Defines the field name from the data source which is mapped to the bubble cell. */
    public mappingName: string;
    /** Defines the value which mapped to the bubble cell. */
    public bubbleData: number;
    /** Defines the type of the bubble heatmap. */
    public valueType: string;
    // eslint-disable-next-line valid-jsdoc
    /**
     * @private
     */
    constructor(mappingName: string, bubbleData: number, valueType: string) {
        this.mappingName = mappingName;
        this.bubbleData = bubbleData;
        this.valueType = valueType;
    }
}

/**
 * Internal class used to maintain legend colorcollection.
 * @private
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
 * @private
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
