import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Ajax } from '@syncfusion/ej2-base';import { Complex, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';import { SvgRenderer, isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel, } from './model/base-model';import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings, } from './model/base';import { LayoutMode, TreeMapTheme } from './utils/enum';import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs, IItemRenderingEventArgs, IResizeEventArgs } from '../treemap/model/interface';import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';import { IItemHighlightEventArgs, IDrillEndEventArgs, IThemeStyle } from '../treemap/model/interface';import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren } from '../treemap/utils/helper';import { removeClassNames, removeShape } from '../treemap/utils/helper';import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';import { load, loaded, itemSelected, drillStart, drillEnd } from '../treemap/model/constants';import { itemClick, itemMove, click, mouseMove, resize } from '../treemap/model/constants';import { LayoutPanel } from './layout/render-panel';import { TreeMapTooltip } from './user-interaction/tooltip';import { ExportUtils } from '../treemap/utils/export';import { ExportType } from '../treemap/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';import { TreeMapLegend } from './layout/legend';import { DataManager, Query } from '@syncfusion/ej2-data';import { getThemeStyle } from './model/theme';
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
     * To enable or disable the drillDown.
     */
    enableDrillDown?: boolean;

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
     */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after treemap rendered.
     * @event
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before item rendering.
     * @event
     */
    itemRendering?: EmitType<IItemRenderingEventArgs>;

    /**
     * Triggers the drillDown start.
     * @event
     */
    drillStart?: EmitType<IDrillStartEventArgs>;

    /**
     * Triggers the drillDown end.
     * @event
     */
    drillEnd?: EmitType<IDrillEndEventArgs>;

    /**
     * Triggers the item selected.
     * @event
     */
    itemSelected?: EmitType<IItemSelectedEventArgs>;

    /**
     * Triggers the item highlight.
     * @event
     */
    itemHighlight?: EmitType<IItemHighlightEventArgs>;

    /**
     * Triggers the tooltip rendering.
     * @event
     */
    tooltipRendering?: EmitType<ITreeMapTooltipRenderEventArgs>;

    /**
     * Triggers the item click.
     * @event
     */
    itemClick?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers the item move.
     * @event
     */
    itemMove?: EmitType<IItemMoveEventArgs>;

    /**
     * Triggers the click event.
     * @event
     */
    click?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers the mouse move event.
     * @event
     */
    mouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers the resize event.
     * @event
     */
    resize?: EmitType<IResizeEventArgs>;

}