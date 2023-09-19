import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Fetch } from '@syncfusion/ej2-base';import { Complex, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel } from './model/base-model';import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings } from './model/base';import { LayoutMode, TreeMapTheme, RenderingMode } from './utils/enum';import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs } from '../treemap/model/interface';import { ILegendItemRenderingEventArgs, ILegendRenderingEventArgs } from '../treemap/model/interface';import { IItemRenderingEventArgs, IResizeEventArgs, IDoubleClickEventArgs, IRightClickEventArgs } from '../treemap/model/interface';import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';import { IItemHighlightEventArgs, IDrillEndEventArgs, IThemeStyle } from '../treemap/model/interface';import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren, removeElement, setItemTemplateContent } from '../treemap/utils/helper';import { removeClassNames, removeShape, textFormatter } from '../treemap/utils/helper';import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';import { load, loaded, drillStart, drillEnd } from '../treemap/model/constants';import { itemClick, itemMove, click, mouseMove, resize, doubleClick, rightClick } from '../treemap/model/constants';import { LayoutPanel } from './layout/render-panel';import { TreeMapTooltip } from './user-interaction/tooltip';import { ExportType } from '../treemap/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';import { TreeMapLegend } from './layout/legend';import { DataManager, Query } from '@syncfusion/ej2-data';import { getThemeStyle } from './model/theme';import { Print } from './model/print';import { ImageExport } from './model/image-export';import { PdfExport } from './model/pdf-export';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeMap
 */
export interface TreeMapModel extends ComponentModel{

    /**
     * Enables and disables the print functionality in treemap.
     *
     * @default false
     */
    allowPrint?: boolean;

    /**
     * Enables and disables the export to image functionality in treemap.
     *
     * @default false
     */
    allowImageExport?: boolean;

    /**
     * Enables and disables the export to pdf functionality in treemap.
     *
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Sets and gets the width of the treemap.
     *
     * @default null
     */
    width?: string;

    /**
     * Sets and gets the height of the treemap.
     *
     * @default null
     */
    height?: string;

    /**
     * Sets and gets the options for customizing the color and width of the treemap border.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the margin in the treemap.
     */
    margin?: MarginModel;

    /**
     * Sets and gets the background color of the treemap.
     *
     * @default null
     */
    background?: string;

    /**
     * Sets and gets the theme styles supported for treemap. When the theme is set, the styles associated with the theme will be set in the treemap.
     *
     * @default Material
     */
    theme?: TreeMapTheme;

    /**
     * Sets and gets the options for customizing the title of the treemap.
     */
    titleSettings?: TitleSettingsModel;

    /**
     * Specifies the rendering type for the layout of the treemap.
     *
     * @default 'Squarified'
     */
    layoutType?: LayoutMode;

    /**
     * Sets and gets the data source for the treemap.
     *
     * @isGenericType true
     * @isObservable true
     * @default null
     */
    dataSource?: DataManager | TreeMapAjax | Object[];

    /**
     * Sets and gets the query to select particular data from the shape data.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    query?: Query;

    /**
     * Sets and gets the value path of the weight from the data source, based on which the treemap item is rendered.
     *
     * @default null
     */
    weightValuePath?: string;

    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     * This property is used when range color mapping is set in the treemap.
     *
     * @default ''
     */
    rangeColorValuePath?: string;

    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     * This property is used when equal color mapping is set in the treemap.
     *
     * @default ''
     */
    equalColorValuePath?: string;

    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     *
     * @default null
     */
    colorValuePath?: string;

    /**
     * Sets and gets a set of colors to apply in the treemap items.
     *
     * @default []
     */
    palette?: string[];

    /**
     * Specifies the rendering direction of layout of the treemap items.
     *
     * @default TopLeftBottomRight
     */
    renderDirection?: RenderingMode;

    /**
     * Enables or disables the drill down functionality in treemap.
     *
     * @default false
     */
    enableDrillDown?: boolean;

    /**
     * Enables or disables the connection text in the header of the treemap when drill down is enabled.
     *
     * @default false
     */
    enableBreadcrumb?: boolean;

    /**
     * Specifies the symbol to show connection between the two words in the header of the treemap during drill down.
     *
     * @default ' - '
     */
    breadcrumbConnector?: string;

    /**
     * Enables or disables the initial drill in the treemap.
     *
     * @default false
     */
    drillDownView?: boolean;

    /**
     * Specifies the options for customizing the initial drill down in treemap.
     */
    initialDrillDown?: InitialDrillSettingsModel;

    /**
     * Sets and gets the options for customizing the leaf item of the treemap.
     */
    leafItemSettings?: LeafItemSettingsModel;

    /**
     * Sets and gets the options to configure and customize the levels of treemap items.
     */
    levels?: LevelSettingsModel[];

    /**
     * Sets and gets the options to customize the highlight functionality of the treemap.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Sets and gets the options for customizing the selection functionality of the treemap.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Sets and gets the options for customizing the tooltip of the treemap.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Sets and gets the options for customizing the legend of the treemap.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Enables or disables the visibility state of the separator for grouping.
     *
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Sets and gets the description for treemap.
     *
     * @default null
     */
    description?: string;

    /**
     * Sets and gets the tab index value for treemap.
     *
     * @default 1
     */
    tabIndex?: number;

    /**
     * Sets and gets format for the texts in the treemap. This property accepts any global string format like 'C', 'N1', 'P' etc.
     *
     * @default null
     */
    format?: string;

    /**
     * Triggers before the treemap is rendered.
     *
     * @event load
     */
    load?: EmitType<ILoadEventArgs>;

    /**
     * Triggers before the print gets started.
     *
     * @event beforePrint
     */
    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after treemap is rendered.
     *
     * @event loaded
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before item rendering in the treemap.
     *
     * @event itemRendering
     */
    itemRendering?: EmitType<IItemRenderingEventArgs>;

    /**
     * Triggers on performing drill down functionality in the treemap.
     *
     * @event drillStart
     */
    drillStart?: EmitType<IDrillStartEventArgs>;

    /**
     * Triggers after drill down functionality gets completed in the treemap.
     *
     * @event drillEnd
     */
    drillEnd?: EmitType<IDrillEndEventArgs>;

    /**
     * Triggers after selecting a treemap item.
     *
     * @event itemSelected
     */
    itemSelected?: EmitType<IItemSelectedEventArgs>;

    /**
     * Triggers after highlighting on the treemap item.
     *
     * @event itemHighlight
     */
    itemHighlight?: EmitType<IItemHighlightEventArgs>;

    /**
     * Triggers on rendering of the tooltip in the treemap.
     *
     * @event tooltipRendering
     */
    tooltipRendering?: EmitType<ITreeMapTooltipRenderEventArgs>;

    /**
     * Triggers after clicking an item in the treemap.
     *
     * @event itemClick
     */
    itemClick?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers after mouse hover on the treemap item.
     *
     * @event itemMove
     */
    itemMove?: EmitType<IItemMoveEventArgs>;

    /**
     * Triggers after clicking on the treemap.
     *
     * @event click
     */
    click?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers after double clicking on the treemap.
     *
     * @event doubleClick
     */
    doubleClick?: EmitType<IDoubleClickEventArgs>;

    /**
     * Triggers after right clicking on the treemap.
     *
     * @event rightClick
     */
    rightClick?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers after mouse hover on the treemap.
     *
     * @event mouseMove
     */
    mouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers to notify the resize of the treemap when the window is resized.
     *
     * @event resize
     */
    resize?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before rendering each legend item in the treemap.
     *
     * @event legendItemRendering
     */
    legendItemRendering?: EmitType<ILegendItemRenderingEventArgs>;

    /**
     * Triggers before rendering the legend items in the treemap.
     *
     * @event legendRendering
     * @deprecated
     */
    legendRendering?: EmitType<ILegendRenderingEventArgs>;

}

/**
 * Interface for a class LevelsData
 * @private
 */
export interface LevelsDataModel {

}