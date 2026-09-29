import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendlineDirective, TrendlinesDirective } from './trendlines.directive';
import { SegmentDirective, SegmentsDirective } from './segments.directive';
import { SeriesDirective, SeriesCollectionDirective } from './series.directive';
import { StripLineDirective, StripLinesDirective } from './striplines.directive';
import { CategoryDirective, CategoriesDirective } from './categories.directive';
import { MultiLevelLabelDirective, MultiLevelLabelsDirective } from './multilevellabels.directive';
import { AxisDirective, AxesDirective } from './axes.directive';
import { RowDirective, RowsDirective } from './rows.directive';
import { ColumnDirective, ColumnsDirective } from './columns.directive';
import { RangeColorSettingDirective, RangeColorSettingsDirective } from './rangecolorsettings.directive';
import { AnnotationDirective, AnnotationsDirective } from './annotations.directive';
import { SelectedDataIndexDirective, SelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { IndicatorDirective, IndicatorsDirective } from './indicators.directive';
import { ChartComponent } from './chart.component';

const CHART_DIRECTIVES = [
    ChartComponent,
        TrendlineDirective,
        TrendlinesDirective,
        SegmentDirective,
        SegmentsDirective,
        SeriesDirective,
        SeriesCollectionDirective,
        StripLineDirective,
        StripLinesDirective,
        CategoryDirective,
        CategoriesDirective,
        MultiLevelLabelDirective,
        MultiLevelLabelsDirective,
        AxisDirective,
        AxesDirective,
        RowDirective,
        RowsDirective,
        ColumnDirective,
        ColumnsDirective,
        RangeColorSettingDirective,
        RangeColorSettingsDirective,
        AnnotationDirective,
        AnnotationsDirective,
        SelectedDataIndexDirective,
        SelectedDataIndexesDirective,
        IndicatorDirective,
        IndicatorsDirective
];

/**
 * NgModule definition for the Chart component.
 * Re-exports standalone Chart component and directives so existing apps can keep using:
 * `imports: [ChartModule]`
 */
@NgModule({
    imports: [CommonModule, ...CHART_DIRECTIVES],
    exports: [...CHART_DIRECTIVES]
})
export class ChartModule { }