import { Component, Event, EmitType, INotifyPropertyChanged, extend, isNullOrUndefined, getComponent, getUniqueID } from '@syncfusion/ej2-base';import {import { ChartModel } from '../base/chart';import { LegendPosition, ChartTheme, ChartType, ChartShape } from '../common';import {import { chartCreated, chartDeleted, chartRefreshed, chartUpdated, beforeChartAction, afterChartAction } from '../common/event';import { OfficeSeriesModel } from '../integrations/data-provider';import { IOverlayHost, DefaultOverlayHost } from '../integrations/overlay-host';import { IUndoRedoHost } from '../integrations/undo-redo-host';import { ChartRenderer, IChartRenderOptions, getThemeBgColor } from '../renderers/chart-renderer';import { OverlayService } from '../services/overlay';import { JsonSeriesProcessor, JsonChartProcessResult } from '../data/json-series-processor';import {import { SeriesProcessor, ISeriesProcessResult } from '../data/series-processor';import { LifecycleManager, IChartLifecycleItem } from './lifecycle-manager';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ChartManager
 */
export interface ChartManagerModel extends ComponentModel{

    /**
     * Triggered when a chart is created.
     */
    chartCreated?: EmitType<ChartCreatedEventArgs>;

    /**
     * Triggered when a chart is updated.
     */
    chartUpdated?: EmitType<ChartUpdatedEventArgs>;

    /**
     * Triggered when a chart is refreshed.
     */
    chartRefreshed?: EmitType<ChartRefreshedEventArgs>;

    /**
     * Triggered when a chart is deleted.
     */
    chartDeleted?: EmitType<ChartDeletedEventArgs>;

    /**
     * Triggered before a chart action (theme, chartType, title, legend, etc.) is executed.
     * Can be canceled by setting args.cancel = true.
     */
    beforeChartAction?: EmitType<IChartBeforeActionEventArgs>;

    /**
     * Triggered after a chart action has been executed and applied.
     */
    afterChartAction?: EmitType<IChartAfterActionEventArgs>;

}