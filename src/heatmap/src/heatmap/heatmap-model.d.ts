import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, isNullOrUndefined, TapEventArgs } from '@syncfusion/ej2-base';import { ModuleDeclaration, EmitType, remove, Event, EventHandler, Touch } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, setCulture, Browser } from '@syncfusion/ej2-base';import { SvgRenderer, CanvasRenderer, Tooltip as tool } from '@syncfusion/ej2-svg-base';import { Size, stringToNumber, RectOption, Rect, TextBasic, measureText, CurrentRect, LegendRange, ToggleVisibility, removeMeasureElement } from './utils/helper';import { DrawSvgCanvas, TextOption, titlePositionX, getTitle, showTooltip, getElement, SelectedCellDetails } from './utils/helper';import { removeElement, CanvasTooltip, getTooltipText } from './utils/helper';import { FontModel, MarginModel, TitleModel } from './model/base-model';import { Margin, Title, ColorCollection, LegendColorCollection } from './model/base';import { Theme, getThemeColor } from './model/theme';import { IThemeStyle, ILoadedEventArgs, ICellClickEventArgs, ITooltipEventArgs, IResizeEventArgs } from './model/interface';import { ICellEventArgs, ISelectedEventArgs } from './model/interface';import { DrawType, HeatMapTheme, ColorGradientMode } from './utils/enum';import { Axis } from './axis/axis';import { AxisModel } from './axis/axis-model';import { AxisHelper } from './axis/axis-helpers';import { Series, CellSettings } from './series/series';import { CellSettingsModel } from './series/series-model';import { PaletteSettingsModel } from './utils/colorMapping-model';import { PaletteSettings, CellColor } from './utils/colorMapping';import { TooltipSettings } from './utils/tooltip';import { TooltipSettingsModel } from './utils/tooltip-model';import { TwoDimensional } from './datasource/twodimensional';import { Tooltip } from './utils/tooltip';import { LegendSettingsModel } from '../heatmap/legend/legend-model';import { LegendSettings, Legend } from '../heatmap/legend/legend';import { Adaptor, Data } from './datasource/adaptor';import { DataModel } from './datasource/adaptor-model';import { ILegendRenderEventArgs } from './model/interface';import { ExportUtils } from '../heatmap/utils/export';import { ExportType } from '../heatmap/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class HeatMap
 */
export interface HeatMapModel extends ComponentModel{

    /**
     * Sets and gets the width of the heatmap. The width of the heatmap accepts pixel or percentage values given in string format.
     *
     * If specified as '100%, heatmap renders to the full width of its parent element.
     *
     * @default null
     */

    width?: string;

    /**
     * Sets and gets the height of the heatmap. The height of the heatmap accepts pixel or percentage values given in string format.
     *
     * @default null
     */

    height?: string;

    /**
     * Enable or disable the visibility of the tooltip for heatmap.
     *
     * @default true
     */

    showTooltip?: boolean;

    /**
     * Triggers before the tooltip of the heatmap is rendered on the heatmap cell.
     *
     * {% codeBlock src='heatmap/tooltipRender/index.md' %}{% endcodeBlock %}
     *
     * @event 'object'
     */
    tooltipRender?: EmitType<ITooltipEventArgs>;

    /**
     * Triggers to notify the resize of the heatmap when the window is resized.
     *
     * @event 'object'
     */
    resized?: EmitType<IResizeEventArgs>;

    /**
     * Triggers after heatmap is loaded.
     *
     * @event 'object'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before each heatmap cell renders.
     * {% codeBlock src='heatmap/cellRender/index.md' %}{% endcodeBlock %}
     *
     * @deprecated
     * @event 'object'
     */
    cellRender?: EmitType<ICellEventArgs>;

    /**
     * Triggers when heatmap cell gets selected.
     *
     * @event 'object'
     */
    cellSelected?: EmitType<ISelectedEventArgs>;

    /**
     * Specifies the rendering mode of heatmap. The following are the available rendering modes.
     * * SVG - Heatmap is rendered using SVG element.
     * * Canvas - Heatmap is rendered using Canvas element.
     * * Auto - Automatically switches the rendering mode based on number of records in the data source.
     *
     * @default SVG
     */
    renderingMode?: DrawType;

    /**
     * Sets and gets the data to visualize in the heatmap.
     *
     * @isDataManager false
     * @default null
     */

    dataSource?: Object;

    /**
     * Sets and gets the options to customize the data mapping for the data in the heatmap.
     * {% codeBlock src='heatmap/dataSourceSettings/index.md' %}{% endcodeBlock %}
     */
    dataSourceSettings?: DataModel;

    /**
     * Specifies the background color of the entire heatmap.
     *
     * @default null
     */
    backgroundColor?: string;

    /**
     *  Sets and gets the theme styles supported for heatmap. When the theme is set, the styles associated with the theme will be set in the heatmap.
     *
     * @default 'Material'
     */
    theme?: HeatMapTheme;

    /**
     * Enable or disable the selection of cells in heatmap.
     * {% codeBlock src='heatmap/allowSelection/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */

    allowSelection?: boolean;

    /**
     * Enable or disable the multiple selection of cells in heatmap.
     *
     * @default true
     */

    enableMultiSelect?: boolean;

    /**
     * Sets and gets the options to customize left, right, top and bottom margins of the heatmap.
     */

    margin?: MarginModel;

    /**
     * Sets and gets the options to customize the title of the heatmap.
     * {% codeBlock src='heatmap/titleSettings/index.md' %}{% endcodeBlock %}
     */
    titleSettings?: TitleModel;

    /**
     * Sets and gets the options to configure the horizontal axis.
     */

    xAxis?: AxisModel;

    /**
     * Sets and gets the options for customizing the legend of the heatmap.
     * {% codeBlock src='heatmap/legendSettings/index.md' %}{% endcodeBlock %}
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Sets and gets the options for customizing the cell color of the heatmap.
     * {% codeBlock src='heatmap/paletteSettings/index.md' %}{% endcodeBlock %}
     */
    paletteSettings?: PaletteSettingsModel;

    /**
     * Sets and gets the options for customizing the tooltip of the heatmap.
     * {% codeBlock src='heatmap/tooltipSettings/index.md' %}{% endcodeBlock %}
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Sets and gets the options to configure the vertical axis.
     */

    yAxis?: AxisModel;

    /**
     * Sets and gets the options to customize the heatmap cells.
     * {% codeBlock src='heatmap/cellSettings/index.md' %}{% endcodeBlock %}
     */

    cellSettings?: CellSettingsModel;

    /**
     * Triggers after heatmap is completely rendered.
     *
     * @event 'object'
     */
    created?: EmitType<Object>;

    /**
     * Triggers before heatmap gets loaded.
     * {% codeBlock src='heatmap/load/index.md' %}{% endcodeBlock %}
     *
     * @event 'object'
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers when clicking on the heatmap cell.
     *
     * @event 'object'
     */
    cellClick?: EmitType<ICellClickEventArgs>;

    /**
     * Triggers when performing the double click operation on the cells in the HeatMap.
     *
     * @event cellDoubleClick
     */
    cellDoubleClick?: EmitType<ICellClickEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * {% codeBlock src='heatmap/legendRender/index.md' %}{% endcodeBlock %}
     *
     * @deprecated
     * @event 'object'
     */
    legendRender?: EmitType<ILegendRenderEventArgs>;

}