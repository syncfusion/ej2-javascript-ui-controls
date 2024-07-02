import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';
import { ZIndex, Anchor, BorderType, SizeType } from '../utils/enum';
import { Font, Border } from '../../common/model/base';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { LabelBorderModel, MultiLevelCategoriesModel, ScrollbarSettingsRangeModel  } from '../../chart/model/chart-base-model';
import { Units, Alignment, Regions, Position, TextOverflow } from '../../common/utils/enum';

/**
 * Configures the annotation for the chart.
 */
export class ChartAnnotationSettings extends ChildProperty<ChartAnnotationSettings> {
    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate
     *
     * @default '0'
     * @aspType object
     */
    @Property('0')
    public x: string | Date | number;

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate
     *
     * @default '0'
     */
    @Property('0')
    public y: string | number;

    /**
     * Content of the annotation, which accepts the id of the custom element.
     *
     * @default null
     */
    @Property(null)
    public content: string;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as left side.
     * * Far - Align the annotation element as right side.
     * * Center - Align the annotation element as mid point.
     *
     * @default 'Center'
     * @deprecated
     */

    @Property('Center')
    public horizontalAlignment: Alignment;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.
     *
     * @default 'Pixel'
     */

    @Property('Pixel')
    public coordinateUnits: Units;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.
     *
     * @default 'Chart'
     */

    @Property('Chart')
    public region: Regions;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.
     *
     * @default 'Middle'
     * @deprecated
     */

    @Property('Middle')
    public verticalAlignment: Position;

    /**
     * The name of horizontal axis associated with the annotation.
     * It requires `axes` of chart.
     *
     * @default null
     */

    @Property(null)
    public xAxisName: string;

    /**
     * The name of vertical axis associated with the annotation.
     * It requires `axes` of chart.
     *
     * @default null
     */

    @Property(null)
    public yAxisName: string;

    /**
     * Information about annotation for assistive technology.
     *
     * @default null
     */
    @Property(null)
    public description: string;
}

/**
 * Configures the label border properties.
 */
export class LabelBorder extends ChildProperty<LabelBorder> {

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
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top and BottomBorder
     * * Without Border
     * * Brace
     * * CurlyBrace
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public type: BorderType;

}
/**
 * Categories for multi-level labels.
 */
export class MultiLevelCategories extends ChildProperty<MultiLevelCategories> {

    /**
     * Start value of the multi level labels.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: number | Date | string;
    /**
     * End value of the multi-level labels.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: number | Date | string;
    /**
     * Multi level labels text.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Maximum width of the text for multi-level labels.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public maximumTextWidth: number;

    /**
     * Custom data for multi-level labels.
     *
     * @default null
     */
    @Property(null)
    public customAttributes: object;

    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top and Bottom Border
     * * Without Border
     * * Brace
     * * Curly Brace
     *
     * @default 'Rectangle'
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     */
    @Property('')
    public type: BorderType;

}
/**
 * Specifies the properties for the strip line.
 */
export class StripLineSettings extends ChildProperty<StripLineSettings> {

    /**
     * If set true, strip line for axis renders.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     *  If set true, strip line get render from axis origin.
     *
     *  @default false
     */
    @Property(false)
    public startFromAxis: boolean;

    /**
     * Start value of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: Object | number | Date;

    /**
     * End value of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: Object | number | Date;

    /**
     * Size of the strip line, when it starts from the origin.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public size: number;

    /**
     * Specifies the color of the strip line.
     *
     * @default '#808080'
     */
    @Property('#808080')
    public color: string;

    /**
     * Dash array of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public dashArray: string;

    /**
     * Size type of the strip line.
     *
     * @default Auto
     */
    @Property('Auto')
    public sizeType: SizeType;

    /**
     * Specifies whether the strip line is repeated.
     *
     * @default false
     * @aspDefaultValueIgnore
     */
    @Property(false)
    public isRepeat: boolean;

    /**
     * repeatEvery value of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public repeatEvery: Object | number | Date;

    /**
     * repeatUntil value of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public repeatUntil: Object | number | Date;

    /**
     * Specifies whether the strip line is segmented.
     *
     * @default false
     * @aspDefaultValueIgnore
     */
    @Property(false)
    public isSegmented: boolean;

    /**
     * segmentStart value of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentStart: Object | number | Date;

    /**
     * segmentEnd value of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentEnd: Object | number | Date;

    /**
     * segmentAxisName of the strip line.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentAxisName: string;

    /**
     * Border of the strip line.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Strip line text.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * The angle to which the strip line text gets rotated.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public rotation: number;

    /**
     * Defines the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     *
     * @default 'Middle'
     */
    @Property('Middle')
    public horizontalAlignment: Anchor;

    /**
     * Defines the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     *
     * @default 'Middle'
     */
    @Property('Middle')
    public verticalAlignment: Anchor;

    /**
     * Options to customize the strip line text.
     */
    @Complex<FontModel>({ size: '12px', color: null, fontStyle: 'Normal', fontWeight: '400', fontFamily: null }, Font)
    public textStyle: FontModel;

    /**
     * Specifies the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.
     *
     * @default 'Behind'
     */
    @Property('Behind')
    public zIndex: ZIndex;

    /**
     * Strip line Opacity.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * The URL of the background image for the strip line.
     *
     * @default ''
     */
    @Property('')
    public imageUrl : string;
}

/**
 * Specifies the properties for multi-level labels.
 */
export class MultiLevelLabels extends ChildProperty<MultiLevelLabels[]> {

    /**
     * Defines the position of the multi level labels. The available options are,
     * * Near: Places the multi-level labels near.
     * * Center: Places the multi-level label in the center.
     * * Far: Places the multi-level labels far.
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
     * Options to customize the multi-level labels.
     */
    @Complex<FontModel>({fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: '400', color: null}, Font)
    public textStyle: FontModel;
    /**
     * Border of the multi-level labels.
     */
    @Complex<LabelBorderModel>({ color: null, width: 1, type: 'Rectangle' }, LabelBorder)
    public border: LabelBorderModel;
    /**
     * Multi level categories for multi-level labels.
     */
    @Collection<MultiLevelCategories>([], MultiLevelCategories)
    public categories: MultiLevelCategoriesModel[];

}

/**
 * Specifies the range for the scrollbar settings property.
 *
 * @public
 */
export class ScrollbarSettingsRange extends ChildProperty<ScrollbarSettingsRange> {

    /**
     * Specifies the minimum range of a scrollbar.
     *
     * @default null
     */

    @Property(null)
    public minimum: Date | string | number;

    /**
     * Specifies the maximum range of an scrollbar.
     *
     * @default null
     */

    @Property(null)
    public maximum: Date | string | number;

}

/**
 * Specifies properties for customizing the scrollbar settings in lazy loading.
 */
export class ScrollbarSettings extends ChildProperty<ScrollbarSettings> {
    /**
     * Enables the scrollbar for lazy loading.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines the length of the points for numeric and logarithmic values.
     *
     * @default null
     */
    @Property(null)
    public pointsLength: number;

    /**
     * Specifies the range for date time values alone.
     */
    @Complex<ScrollbarSettingsRangeModel>({}, ScrollbarSettingsRange)
    public range: ScrollbarSettingsRangeModel;

    /**
     * Defines the color of the back track.
     *
     * @default null
     */
    @Property(null)
    public trackColor: string;

    /**
     * Defines the border radius for the scroll bar.
     *
     * @default 0
     */
    @Property(0)
    public scrollbarRadius: number;

    /**
     * Defines the color for the scroll bar.
     *
     * @default null
     */
    @Property(null)
    public scrollbarColor: string;

    /**
     * Defines the border radius for back rect.
     *
     * @default 0
     */
    @Property(0)
    public trackRadius: number;

    /**
     * Defines the color for thumb grip.
     *
     * @default null
     */
    @Property(null)
    public gripColor: string;

    /**
     * Defines the height of the back rect and scroll bar.
     *
     * @default 16
     */
    @Property(16)
    public height: number;

    /**
     * Specifies whether zooming by scroll bar is enabled or disabled.
     *
     * @default true
     */
    @Property(true)
    public enableZoom: boolean;
}
