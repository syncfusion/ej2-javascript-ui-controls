import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, isNullOrUndefined } from '@syncfusion/ej2-base';import { ModuleDeclaration, EmitType, remove, Event, EventHandler } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, SvgRenderer, CanvasRenderer, setCulture, Browser } from '@syncfusion/ej2-base';import { Size, stringToNumber, RectOption, Rect, TextBasic, measureText, CurrentRect, LegendRange, ToggleVisibility } from './utils/helper';import { DrawSvgCanvas, TextOption, titlePositionX, getTitle, showTooltip, getElement, SelectedCellDetails } from './utils/helper';import { removeElement, CanvasTooltip, getTooltipText } from './utils/helper';import { FontModel, MarginModel, TitleModel } from './model/base-model';import { Margin, Title, ColorCollection, LegendColorCollection } from './model/base';import { Theme, getThemeColor } from './model/theme';import { IThemeStyle, ILoadedEventArgs, ICellClickEventArgs, ITooltipEventArgs } from './model/interface';import { ICellEventArgs, ISelectedEventArgs } from './model/interface';import { DrawType, HeatMapTheme } from './utils/enum';import { Axis } from './axis/axis';import { AxisModel } from './axis/axis-model';import { AxisHelper } from './axis/axis-helpers';import { Series, CellSettings } from './series/series';import { CellSettingsModel } from './series/series-model';import { PaletteSettingsModel } from './utils/colorMapping-model';import { PaletteSettings, CellColor } from './utils/colorMapping';import { TooltipSettings } from './utils/tooltip';import { TooltipSettingsModel } from './utils/tooltip-model';import { TwoDimensional } from './datasource/twodimensional';import { Tooltip } from './utils/tooltip';import { LegendSettingsModel } from '../heatmap/legend/legend-model';import { LegendSettings, Legend } from '../heatmap/legend/legend';import { Adaptor } from './datasource/adaptor';import { DataModel } from './datasource/adaptor-model';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class HeatMap
 */
export interface HeatMapModel extends ComponentModel{

    /**
     * The width of the heatmap as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, heatmap renders to the full width of its parent element.
     * @default null
     */

    width?: string;

    /**
     * The height of the heatmap as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, heatmap renders to the full height of its parent element.
     * @default null
     */

    height?: string;

    /**
     * Enable or disable the tool tip for heatmap
     * @default true
     */

    showTooltip?: boolean;

    /**
     * Triggers when click the heat map cell.
     * @event
     */
    tooltipRender?: EmitType<ITooltipEventArgs>;

    /**
     * Triggers before each heatmap cell renders.
     * @event
     */
    cellRender?: EmitType<ICellEventArgs>;

    /**
     * Triggers when multiple cells gets selected.
     * @event
     */
    cellSelected?: EmitType<ISelectedEventArgs>;

    /**
     * Specifies the rendering mode of heat map.
     * * SVG - Heat map is render using SVG draw mode.
     * * Canvas - Heat map is render using Canvas draw mode.
     * * Auto - Automatically switch the draw mode based on number of records in data source.
     * @default SVG
     */
    renderingMode?: DrawType;

    /**
     * Specifies the datasource for the heat map.
     * @default null
     */

    dataSource?: Object | DataModel;

    /**
     *  Specifies the theme for heatmap.
     * @default 'Material'
     */
    theme?: HeatMapTheme;

    /**
     * Enable or disable the selection of multiple cells in heatmap
     * @default false
     */

    allowSelection?: boolean;

    /**
     * Options to customize left, right, top and bottom margins of the heat map.
     */

    margin?: MarginModel;

    /**
     * Title of heat map
     * @default ''
     */
    titleSettings?: TitleModel;

    /**
     * Options to configure the horizontal axis.
     */

    xAxis?: AxisModel;

    /**
     * Options for customizing the legend of the heat map
     * @default ''
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Options for customizing the cell color of the heat map
     */
    paletteSettings?: PaletteSettingsModel;

    /**
     * Options for customizing the ToolTipSettings property  of the heat map
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Options to configure the vertical axis.
     */

    yAxis?: AxisModel;

    /**
     * Options to customize the heat map cell
     */

    cellSettings?: CellSettingsModel;

    /**
     * Triggers after heat map rendered.
     * @event
     */
    created?: EmitType<Object>;

    /**
     * Triggers before heat map load.
     * @event
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers when click the heat map cell.
     * @event
     */
    cellClick?: EmitType<ICellClickEventArgs>;

}