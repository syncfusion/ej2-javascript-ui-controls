/**
 * Sparkline base API Class declarations.
 */
import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { SparklineBorderModel, LineSettingsModel, SparklineFontModel, LabelOffsetModel, TrackLineSettingsModel } from './base-model';
import { VisibleType, EdgeLabelMode } from './enum';
/**
 * Configures the borders in the Sparkline.
 */
export class SparklineBorder extends ChildProperty<SparklineBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     */
    @Property(0)
    public width: number;

}

/**
 * Configures the fonts in sparklines.
 */
export class SparklineFont extends ChildProperty<SparklineFont> {

    /**
     * Font size for the text.
     */
    @Property(null)
    public size: string;

    /**
     * Color for the text.
     */
    @Property(null)
    public color: string;

    /**
     * FontFamily for the text.
     */
    @Property('Roboto, Segoe UI, Noto, Sans-serif')
    public fontFamily: string;

    /**
     * FontWeight for the text.
     */
    @Property(null)
    public fontWeight: string;

    /**
     * FontStyle for the text.
     */
    @Property(null)
    public fontStyle: string;

    /**
     * Opacity for the text.
     */
    @Property(1)
    public opacity: number;
}
/**
 * To configure the tracker line settings.
 */
export class TrackLineSettings extends ChildProperty<TrackLineSettings> {
    /**
     * Toggle the tracker line visibility.
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * To config the tracker line color.
     */
    @Property(null)
    public color: string;
    /**
     * To config the tracker line width.
     * @default 1
     */
    @Property(1)
    public width: number;
}
/**
 * To configure the tooltip settings for sparkline.
 */
export class SparklineTooltipSettings extends ChildProperty<SparklineTooltipSettings> {
    /**
     * Toggle the tooltip visibility.
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * To customize the tooltip fill color.
     */
    @Property('')
    public fill: string;
    /**
     * To customize the tooltip template.
     */
    @Property('')
    public template: string;
    /**
     * To customize the tooltip format.
     */
    @Property('')
    public format: string;
    /**
     * To configure tooltip border color and width.
     */
    @Complex<SparklineBorderModel>({ color: '#cccccc', width: 0.5 }, SparklineBorder)
    public border: SparklineBorderModel;
    /**
     * To configure tooltip text styles.
     */
    // tslint:disable-next-line
    @Complex<SparklineFontModel>({ size: '13px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'}, SparklineFont)
    public textStyle: SparklineFontModel;
    /**
     * To configure the tracker line options.
     */
    @Complex<TrackLineSettingsModel>({}, TrackLineSettings)
    public trackLineSettings: TrackLineSettingsModel;
}
/**
 * To configure the sparkline container area customization
 */
export class ContainerArea extends ChildProperty<ContainerArea> {
    /**
     * To configure Sparkline background color.
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;
    /**
     * To configure Sparkline border color and width.
     */
    @Complex<SparklineBorderModel>({}, SparklineBorder)
    public border: SparklineBorderModel;
}
/**
 * To configure axis line settings
 */
export class LineSettings extends ChildProperty<LineSettings> {
    /**
     * To toggle the axis line visibility.
     * @default `false`
     */
    @Property(false)
    public visible: boolean;
    /**
     * To configure the sparkline axis line color.
     */
    @Property(null)
    public color: string;
    /**
     * To configure the sparkline axis line dashArray.
     * @default ''.
     */
    @Property('')
    public dashArray: string;
    /**
     * To configure the sparkline axis line width.
     * @default 1.
     */
    @Property(1)
    public width: number;
    /**
     * To configure the sparkline axis line opacity.
     * @default 1.
     */
    @Property(1)
    public opacity: number;
}
/**
 * To configure the sparkline rangeband
 */
export class RangeBandSettings extends ChildProperty<RangeBandSettings> {
    /**
     * To configure sparkline start range
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public startRange: number;
    /**
     * To configure sparkline end range
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public endRange: number;
    /**
     * To configure sparkline rangeband color
     */
    @Property(null)
    public color: string;
    /**
     * To configure sparkline rangeband opacity
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public opacity: number;
}
/**
 * To configure the sparkline axis
 */
export class AxisSettings extends ChildProperty<AxisSettings> {
    /**
     * To configure Sparkline x axis min value.
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public minX: number;
    /**
     * To configure Sparkline x axis max value.
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public maxX: number;
    /**
     * To configure Sparkline y axis min value.
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public minY: number;
    /**
     * To configure Sparkline y axis max value.
     * @aspDefaultValueIgnore 
     */
    @Property(null)
    public maxY: number;
    /**
     * To configure Sparkline horizontal axis line position.
     * @default 0
     */
    @Property(0)
    public value: number;
    /**
     * To configure Sparkline axis line settings.
     */
    @Complex<LineSettingsModel>({}, LineSettings)
    public lineSettings: LineSettingsModel;
}
/**
 * To configure the sparkline padding.
 */
export class Padding extends ChildProperty<Padding> {

    /**
     * To configure Sparkline left padding.
     * @default 5
     */
    @Property(5)
    public left: number;
    /**
     * To configure Sparkline right padding.
     * @default 5
     */
    @Property(5)
    public right: number;
    /**
     * To configure Sparkline bottom padding.
     * @default 5
     */
    @Property(5)
    public bottom: number;
    /**
     * To configure Sparkline top padding.
     * @default 5
     */
    @Property(5)
    public top: number;
}
/**
 * To configure the sparkline marker options.
 */
export class SparklineMarkerSettings extends ChildProperty<SparklineMarkerSettings> {
    /**
     * To toggle the marker visibility.
     * @default `[]`.
     */
    @Property([])
    public visible: VisibleType[];
    /**
     * To configure the marker opacity.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * To configure the marker size.
     * @default 5
     */
    @Property(5)
    public size: number;
    /**
     * To configure the marker fill color.
     * @default `#00bdae`.
     */
    @Property('#00bdae')
    public fill: string;
    /**
     * To configure Sparkline marker border color and width.
     */
    @Complex<SparklineBorderModel>({ width: 1 }, SparklineBorder)
    public border: SparklineBorderModel;
}
/**
 * To configure the datalabel offset
 */
export class LabelOffset extends ChildProperty<LabelOffset> {
    /**
     * To move the datalabel horizontally.
     */
    @Property(0)
    public x: number;
    /**
     * To move the datalabel vertically.
     */
    @Property(0)
    public y: number;
}
/**
 * To configure the sparkline dataLabel options.
 */
export class SparklineDataLabelSettings extends ChildProperty<SparklineDataLabelSettings> {
    /**
     * To toggle the dataLabel visibility.
     * @default `[]`.
     */
    @Property([])
    public visible: VisibleType[];
    /**
     * To configure the dataLabel opacity.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * To configure the dataLabel fill color.
     * @default `transparent`.
     */
    @Property('transparent')
    public fill: string;
    /**
     * To configure the dataLabel format the value.
     * @default ``.
     */
    @Property('')
    public format: string;
    /**
     * To configure Sparkline dataLabel border color and width.
     */
    @Complex<SparklineBorderModel>({ color: 'transparent', width: 0 }, SparklineBorder)
    public border: SparklineBorderModel;
    /**
     * To configure Sparkline dataLabel text styles.
     */
    // tslint:disable-next-line
    @Complex<SparklineFontModel>({ size: '14px', fontWeight: 'Medium', fontStyle: 'Medium', fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif' }, SparklineFont)
    public textStyle: SparklineFontModel;
    /**
     * To configure Sparkline dataLabel offset.
     */
    @Complex<LabelOffsetModel>({}, LabelOffset)
    public offset: LabelOffsetModel;
    /**
     * To change the edge dataLabel placement.
     * @default 'None'.
     */
    @Property('None')
    public edgeLabelMode: EdgeLabelMode;
}