import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, Complex } from '@syncfusion/ej2-base';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { remove, L10n, Internationalization, Event, EmitType, ModuleDeclaration, isNullOrUndefined } from '@syncfusion/ej2-base';import { Browser, EventHandler, Touch, Collection } from '@syncfusion/ej2-base';import { SparklineBorder, SparklineTooltipSettings, ContainerArea, AxisSettings, Padding, SparklineMarkerSettings } from './model/base';import { SparklineDataLabelSettings, RangeBandSettings } from './model/base';import { SparklineBorderModel, SparklineTooltipSettingsModel, ContainerAreaModel, AxisSettingsModel } from './model/base-model';import { SparklineMarkerSettingsModel, SparklineDataLabelSettingsModel, RangeBandSettingsModel, PaddingModel } from './model/base-model';import { SparklineType, SparklineValueType, SparklineRangePadding, SparklineTheme } from './model/enum';import { Size, createSvg, RectOption, Rect, drawRectangle, getIdElement, SparkValues, withInBounds, removeElement } from './utils/helper';import { ISparklineLoadedEventArgs, ISparklineLoadEventArgs, IDataLabelRenderingEventArgs, IPointRegionEventArgs } from './model/interface';import { IMarkerRenderingEventArgs, ISparklinePointEventArgs, ISparklineMouseEventArgs } from './model/interface';import { IAxisRenderingEventArgs, ISparklineResizeEventArgs, ITooltipRenderingEventArgs } from './model/interface';import { ISeriesRenderingEventArgs, IThemes } from './model/interface';import { SparklineRenderer } from './rendering/sparkline-renderer';import { SparklineTooltip } from './rendering/sparkline-tooltip';import { getThemeColor } from './utils/helper';import { DataManager, Query } from '@syncfusion/ej2-data';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Sparkline
 */
export interface SparklineModel extends ComponentModel{

    /**
     * To configure Sparkline width.
     */
    width?: string;

    /**
     * To configure Sparkline height.
     */
    height?: string;

    /**
     * To configure Sparkline points border color and width.
     */
    border?: SparklineBorderModel;

    /**
     * To configure Sparkline series type.
     * @default 'Line'
     */
    type?: SparklineType;

    /**
     * To configure Sparkline series type.
     * @default 'None'
     */
    rangePadding?: SparklineRangePadding;

    /**
     * To configure sparkline data source.
     * @isGenericType true
     * @default null
     */
    dataSource?: Object[] | DataManager;

    /**
     * Specifies the query for filter the data.
     * @default null
     */
    query?: Query;

    /**
     * To configure sparkline series value type.
     * @default 'Numeric'
     */
    valueType?: SparklineValueType;

    /**
     * To configure sparkline series xName.
     * @default null
     */
    xName?: string;

    /**
     * To configure sparkline series yName.
     * @default null
     */
    yName?: string;

    /**
     * To configure sparkline series fill.
     * @default '#00bdae'
     */
    fill?: string;

    /**
     * To configure sparkline series highest y value point color.
     * @default ''
     */
    highPointColor?: string;

    /**
     * To configure sparkline series lowest y value point color.
     * @default ''
     */
    lowPointColor?: string;

    /**
     * To configure sparkline series first x value point color.
     * @default ''
     */
    startPointColor?: string;

    /**
     * To configure sparkline series last x value point color.
     * @default ''
     */
    endPointColor?: string;

    /**
     * To configure sparkline series negative y value point color.
     * @default ''
     */
    negativePointColor?: string;

    /**
     * To configure sparkline winloss series tie y value point color.
     * @default ''
     */
    tiePointColor?: string;

    /**
     * To configure sparkline series color palette. It applicable to column and pie type series.
     * @default []
     */
    palette?: string[];

    /**
     * To configure sparkline line series width.
     * @default '1'
     */
    lineWidth?: number;

    /**
     * To configure sparkline line series opacity.
     * @default '1'
     */
    opacity?: number;

    /**
     * To apply internationalization for sparkline.
     * @default null
     */
    format?: string;

    /**
     * To enable the separator
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * To configure Sparkline tooltip settings.
     */
    tooltipSettings?: SparklineTooltipSettingsModel;

    /**
     * To configure Sparkline container area customization.
     */
    containerArea?: ContainerAreaModel;

    /**
     * To configure Sparkline axis line customization.
     */
    rangeBandSettings?: RangeBandSettingsModel[];

    /**
     * To configure Sparkline container area customization.
     */
    axisSettings?: AxisSettingsModel;

    /**
     * To configure Sparkline marker configuration.
     */
    markerSettings?: SparklineMarkerSettingsModel;

    /**
     * To configure Sparkline dataLabel configuration.
     */
    dataLabelSettings?: SparklineDataLabelSettingsModel;

    /**
     * To configure Sparkline container area customization.
     */
    padding?: PaddingModel;

    /**
     * To configure sparkline theme.
     * @default 'Material'
     */
    theme?: SparklineTheme;

    /**
     * Triggers after sparkline rendered.
     * @event
     */
    loaded?: EmitType<ISparklineLoadedEventArgs>;

    /**
     * Triggers before sparkline render.
     * @event
     */
    load?: EmitType<ISparklineLoadEventArgs>;

    /**
     * Triggers before sparkline tooltip render.
     * @event
     */
    tooltipInitialize?: EmitType<ITooltipRenderingEventArgs>;

    /**
     * Triggers before sparkline series render.
     * @event
     */
    seriesRendering?: EmitType<ISeriesRenderingEventArgs>;

    /**
     * Triggers before sparkline axis render.
     * @event
     */
    axisRendering?: EmitType<IAxisRenderingEventArgs>;

    /**
     * Triggers before sparkline points render.
     * @event
     */
    pointRendering?: EmitType<ISparklinePointEventArgs>;

    /**
     * Triggers while mouse move on the sparkline point region.
     * @event
     */
    pointRegionMouseMove?: EmitType<IPointRegionEventArgs>;

    /**
     * Triggers while mouse click on the sparkline point region.
     * @event
     */
    pointRegionMouseClick?: EmitType<IPointRegionEventArgs>;

    /**
     * Triggers while mouse move on the sparkline container.
     * @event
     */
    sparklineMouseMove?: EmitType<ISparklineMouseEventArgs>;

    /**
     * Triggers while mouse click on the sparkline container.
     * @event
     */
    sparklineMouseClick?: EmitType<ISparklineMouseEventArgs>;

    /**
     * Triggers before the sparkline datalabel render.
     * @event
     */
    dataLabelRendering?: EmitType<IDataLabelRenderingEventArgs>;

    /**
     * Triggers before the sparkline marker render.
     * @event
     */
    markerRendering?: EmitType<IMarkerRenderingEventArgs>;

    /**
     * Triggers on resizing the sparkline.
     * @event
     */
    resize?: EmitType<ISparklineResizeEventArgs>;

}