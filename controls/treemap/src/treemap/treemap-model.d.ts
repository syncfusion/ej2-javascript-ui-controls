import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Ajax, isBlazor } from '@syncfusion/ej2-base';import { Complex, Collection, ModuleDeclaration, resetBlazorTemplate } from '@syncfusion/ej2-base';import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel, } from './model/base-model';import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings, } from './model/base';import { LayoutMode, TreeMapTheme, RenderingMode } from './utils/enum';import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs } from '../treemap/model/interface';import { ILegendItemRenderingEventArgs, ILegendRenderingEventArgs, IItemDataEventArgs } from '../treemap/model/interface';import { IItemRenderingEventArgs, IResizeEventArgs, IDoubleClickEventArgs, IRightClickEventArgs } from '../treemap/model/interface';import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';import { IItemHighlightEventArgs, IDrillEndEventArgs, IThemeStyle } from '../treemap/model/interface';import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren } from '../treemap/utils/helper';import { removeClassNames, removeShape } from '../treemap/utils/helper';import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';import { load, loaded, itemSelected, drillStart, drillEnd } from '../treemap/model/constants';import { itemClick, itemMove, click, mouseMove, resize, doubleClick, rightClick } from '../treemap/model/constants';import { LayoutPanel } from './layout/render-panel';import { TreeMapTooltip } from './user-interaction/tooltip';import { ExportUtils } from '../treemap/utils/export';import { ExportType } from '../treemap/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';import { TreeMapLegend } from './layout/legend';import { DataManager, Query } from '@syncfusion/ej2-data';import { getThemeStyle } from './model/theme';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeMap
 */
export interface TreeMapModel extends ComponentModel{

    /**
     * Specifies the width by given pixel or percentage.
     * @default null
     */
    width?: string;

    /**
     * Specifies the height by given pixel or percentage.
     * @default null
     */
    height?: string;

    /**
     * Specifies the border of tree map.
     */
    border?: BorderModel;

    /**
     * Specifies the margin to move the render area.
     */
    margin?: MarginModel;

    /**
     * Specifies the background.
     */
    background?: string;

    /**
     * Specifies the theme.
     */
    theme?: TreeMapTheme;

    /**
     * Specifies the title for tree map.
     */
    titleSettings?: TitleSettingsModel;

    /**
     * Specifies the rendering of layout type.
     */
    layoutType?: LayoutMode;

    /**
     * Specifies the dataSource.
     * @isGenericType true
     * @isObservable true
     * @default null
     */
    dataSource?: DataManager | TreeMapAjax | Object[];

    /**
     * Specifies the query for filter the data.
     * @default null
     */
    query?: Query;

    /**
     * Specifies the weight value path
     */
    weightValuePath?: string;

    /**
     * Specifies the colorValuePath
     */
    rangeColorValuePath?: string;

    /**
     * Specifies the colorValuePath
     */
    equalColorValuePath?: string;

    /**
     * Specifies the colorValuePath from dataSource
     */
    colorValuePath?: string;

    /**
     * Specifies the palette colors.
     */
    palette?: string[];

    /**
     * Specifies the rendering of layout of the treemap items.
     * @default TopLeftBottomRight
     */
    renderDirection?: RenderingMode;

    /**
     * To enable or disable the drillDown.
     */
    enableDrillDown?: boolean;

    /**
     * To render the text from right to left.
     */
    enableBreadcrumb?: boolean;

    /**
     * To add the breadCrumb connector.
     */
    breadcrumbConnector?: string;

    /**
     * To control the drillDown view.
     */
    drillDownView?: boolean;

    /**
     * Specifies the initial drillDown.
     */
    initialDrillDown?: InitialDrillSettingsModel;

    /**
     * Specifies to access all leaf items in levels.
     */
    leafItemSettings?: LeafItemSettingsModel;

    /**
     * Specifies the item levels.
     */
    levels?: LevelSettingsModel[];

    /**
     * To specifies the highlight settings.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * To specifies the selection settings.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Specifies the tooltip settings.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Specifies the legend settings.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * To enable the separator
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Description for maps.
     * @default null
     */
    description?: string;

    /**
     * TabIndex value for treemap.
     * @default 1
     */
    tabIndex?: number;

    /**
     * To apply internationalization for treemap
     * @default null
     */
    format?: string;

    /**
     * Triggers before treemap rendered.
     * @event
     */
    load?: EmitType<ILoadEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after treemap rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before item rendering.
     * @event
     * @blazorProperty 'ItemRendering'
     */
    itemRendering?: EmitType<IItemRenderingEventArgs>;

    /**
     * Triggers the drillDown start.
     * @event
     * @blazorProperty 'OnDrillStart'
     */
    drillStart?: EmitType<IDrillStartEventArgs>;

    /**
     * Triggers the drillDown end.
     * @event
     * @blazorProperty 'DrillCompleted'
     */
    drillEnd?: EmitType<IDrillEndEventArgs>;

    /**
     * Triggers the item selected.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    itemSelected?: EmitType<IItemSelectedEventArgs>;

    /**
     * Triggers the item highlight.
     * @event
     * @blazorProperty 'ItemHighlighted'
     */
    itemHighlight?: EmitType<IItemHighlightEventArgs>;

    /**
     * Triggers the tooltip rendering.
     * @event
     * @blazorProperty 'TooltipRendering'
     * @blazorType ITreeMapTooltipArgs
     */
    tooltipRendering?: EmitType<ITreeMapTooltipRenderEventArgs>;

    /**
     * Triggers the item click.
     * @event
     * @blazorProperty 'OnItemClick'
     */
    itemClick?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers the item move.
     * @event
     * @blazorProperty 'OnItemMove'
     */
    itemMove?: EmitType<IItemMoveEventArgs>;

    /**
     * Triggers the click event.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers on double clicking the maps.
     * @event
     * @blazorProperty 'OnDoubleClick'
     */
    doubleClick?: EmitType<IDoubleClickEventArgs>;

    /**
     * Triggers on right clicking the maps.
     * @event
     * @blazorProperty 'OnRightClick'
     */
    rightClick?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers the mouse move event.
     * @event
     * @blazorProperty 'OnMouseMove'
     */
    mouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers the resize event.
     * @event
     * @blazorProperty 'Resizing'
     */
    resize?: EmitType<IResizeEventArgs>;

    /**
     * Triggers the legend item rendering.
     * @event
     * @blazorProperty 'LegendItemRendering'
     */
    legendItemRendering?: EmitType<ILegendItemRenderingEventArgs>;

    /**
     * Triggers the legend rendering event.
     * @event
     * @deprecated
     * @blazorProperty 'LegendRendering'
     */
    legendRendering?: EmitType<ILegendRenderingEventArgs>;

}

/**
 * Interface for a class LevelsData
 * @private
 */
export interface LevelsDataModel {

}