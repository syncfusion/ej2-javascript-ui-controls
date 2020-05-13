import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Ajax, isBlazor } from '@syncfusion/ej2-base';import { Complex, Collection, ModuleDeclaration, resetBlazorTemplate } from '@syncfusion/ej2-base';import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel, } from './model/base-model';import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings, } from './model/base';import { LayoutMode, TreeMapTheme, RenderingMode } from './utils/enum';import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs } from '../treemap/model/interface';import { ILegendItemRenderingEventArgs, ILegendRenderingEventArgs, IItemDataEventArgs } from '../treemap/model/interface';import { IItemRenderingEventArgs, IResizeEventArgs, IDoubleClickEventArgs, IRightClickEventArgs } from '../treemap/model/interface';import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';import { IItemHighlightEventArgs, IDrillEndEventArgs, IThemeStyle } from '../treemap/model/interface';import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren, removeElement } from '../treemap/utils/helper';import { removeClassNames, removeShape, textFormatter } from '../treemap/utils/helper';import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';import { load, loaded, itemSelected, drillStart, drillEnd } from '../treemap/model/constants';import { itemClick, itemMove, click, mouseMove, resize, doubleClick, rightClick } from '../treemap/model/constants';import { LayoutPanel } from './layout/render-panel';import { TreeMapTooltip } from './user-interaction/tooltip';import { ExportType } from '../treemap/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';import { TreeMapLegend } from './layout/legend';import { DataManager, Query } from '@syncfusion/ej2-data';import { getThemeStyle } from './model/theme';import { Print } from './model/print';import { ImageExport } from './model/image-export';import { PdfExport } from './model/pdf-export';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TreeMap
 */
export interface TreeMapModel extends ComponentModel{

    /**
     * Enables and disables the print functionality in treemap.
     * @default false
     */
    allowPrint?: boolean;

    /**
     * Enables and disables the export to image functionality in treemap.
     * @default false
     */
    allowImageExport?: boolean;

    /**
     * Enables and disables the export to pdf functionality in treemap.
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Sets and gets the width of the treemap component.
     * @default null
     */
    width?: string;

    /**
     * Sets and gets the height of the treemap component.
     * @default null
     */
    height?: string;

    /**
     * Sets and gets the options for customizing the color and width of the treemap border.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the margin in the treemap component.
     */
    margin?: MarginModel;

    /**
     * Sets and gets the background color of the treemap.
     */
    background?: string;

    /**
     * Sets and gets the options for customizing the theme of the treemap component.
     */
    theme?: TreeMapTheme;

    /**
     * Sets and gets the options for customizing the title of the treemap component.
     */
    titleSettings?: TitleSettingsModel;

    /**
     * Specifies the rendering type of layout of the treemap component.
     */
    layoutType?: LayoutMode;

    /**
     * Sets and gets the data source for the treemap component.
     * @isGenericType true
     * @isObservable true
     * @default null
     */
    dataSource?: DataManager | TreeMapAjax | Object[];

    /**
     * Sets and gets the query to select particular data from the shape data.
     * This property is applicable only when the data source is created by data manager.
     * @default null
     */
    query?: Query;

    /**
     * Sets and gets the value path of the weight from the data source, based on which the map item is rendered.
     */
    weightValuePath?: string;

    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     */
    rangeColorValuePath?: string;

    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     */
    equalColorValuePath?: string;

    /**
     * Sets and gets the value path from the data source, based on it color is filled in treemap.
     */
    colorValuePath?: string;

    /**
     * Sets and gets the set of colors to apply in the treemap items.
     */
    palette?: string[];

    /**
     * Specifies the rendering direction of layout of the treemap items.
     * @default TopLeftBottomRight
     */
    renderDirection?: RenderingMode;

    /**
     * Enables or disables the drill down functionality in treemap.
     */
    enableDrillDown?: boolean;

    /**
     * Enables or disables the connection text in the header of the treemap.
     */
    enableBreadcrumb?: boolean;

    /**
     * Specifies the connection between the two words.
     */
    breadcrumbConnector?: string;

    /**
     * Enables or disables the initial drill in the treemap.
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
     * Sets and gets the options for customizing the levels of the treemap.
     */
    levels?: LevelSettingsModel[];

    /**
     * Sets and gets the options for customizing the highlight of the treemap item on mouse over on the treemap component.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Sets and gets the options for customizing the selection of the treemap item on click event on the treemap component.
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
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Sets and gets the description for treemap.
     * @default null
     */
    description?: string;

    /**
     * Sets and gets the tab index value for treemap.
     * @default 1
     */
    tabIndex?: number;

    /**
     * Sets and gets format for the texts in the treemap.
     * @default null
     */
    format?: string;

    /**
     * Triggers when the treemap is on load.
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
     * Triggers after treemap is rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before item rendering in the treemap component.
     * @event
     * @blazorProperty 'ItemRendering'
     */
    itemRendering?: EmitType<IItemRenderingEventArgs>;

    /**
     * Triggers on performing drill down functionality in the treemap.
     * @event
     * @blazorProperty 'OnDrillStart'
     */
    drillStart?: EmitType<IDrillStartEventArgs>;

    /**
     * Triggers after drill down functionality gets completed in the treemap.
     * @event
     * @blazorProperty 'DrillCompleted'
     */
    drillEnd?: EmitType<IDrillEndEventArgs>;

    /**
     * Triggers after selecting a treemap item.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    itemSelected?: EmitType<IItemSelectedEventArgs>;

    /**
     * Triggers after highlighting on the treemap item.
     * @event
     * @blazorProperty 'ItemHighlighted'
     */
    itemHighlight?: EmitType<IItemHighlightEventArgs>;

    /**
     * Triggers on rendering of the tooltip in the treemap component.
     * @event
     * @blazorProperty 'TooltipRendering'
     * @blazorType ITreeMapTooltipArgs
     */
    tooltipRendering?: EmitType<ITreeMapTooltipRenderEventArgs>;

    /**
     * Triggers after clicking an item in the treemap.
     * @event
     * @blazorProperty 'OnItemClick'
     */
    itemClick?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers after mouse hover on the treemap item.
     * @event
     * @blazorProperty 'OnItemMove'
     */
    itemMove?: EmitType<IItemMoveEventArgs>;

    /**
     * Triggers after clicking on the treemap.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<IItemClickEventArgs>;

    /**
     * Triggers after double clicking on the treemap.
     * @event
     * @blazorProperty 'OnDoubleClick'
     */
    doubleClick?: EmitType<IDoubleClickEventArgs>;

    /**
     * Triggers after right clicking on the treemap.
     * @event
     * @blazorProperty 'OnRightClick'
     */
    rightClick?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers after mouse hover on the treemap.
     * @event
     * @blazorProperty 'OnMouseMove'
     */
    mouseMove?: EmitType<IMouseMoveEventArgs>;

    /**
     * Triggers after resizing the treemap component.
     * @event
     * @blazorProperty 'Resizing'
     */
    resize?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before rendering each legend item in the treemap.
     * @event
     * @blazorProperty 'LegendItemRendering'
     */
    legendItemRendering?: EmitType<ILegendItemRenderingEventArgs>;

    /**
     * Triggers before rendering the legend items in the treemap.
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