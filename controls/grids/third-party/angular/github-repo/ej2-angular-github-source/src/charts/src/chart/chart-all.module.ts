import { NgModule, ValueProvider } from '@angular/core';
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
import { ChartModule } from './chart.module';
import {LineSeries, ScatterSeries, ColumnSeries, SplineSeries, SplineAreaSeries, StripLine, AreaSeries, ScrollBar, StepLineSeries, StepAreaSeries, StackingColumnSeries, StackingLineSeries, StackingAreaSeries, StackingStepAreaSeries, BarSeries, StackingBarSeries, RangeColumnSeries, BubbleSeries, Tooltip, Crosshair, Category, DateTime, Logarithmic, Legend, Zoom, DataLabel, Selection, ChartAnnotation, HiloSeries, HiloOpenCloseSeries, WaterfallSeries, RangeAreaSeries, RangeStepAreaSeries, SplineRangeAreaSeries, CandleSeries, PolarSeries, RadarSeries, SmaIndicator, TmaIndicator, EmaIndicator, AccumulationDistributionIndicator, MacdIndicator, AtrIndicator, RsiIndicator, MomentumIndicator, StochasticIndicator, BollingerBands, BoxAndWhiskerSeries, HistogramSeries, ErrorBar, Trendlines, DateTimeCategory, MultiColoredLineSeries, MultiColoredAreaSeries, MultiLevelLabel, ParetoSeries, Export, DataEditing, Highlight, LastValueLabel, SeriesLabel} from '@syncfusion/ej2-charts'


export const LineSeriesService: ValueProvider = { provide: 'ChartsLineSeries', useValue: LineSeries};
export const ScatterSeriesService: ValueProvider = { provide: 'ChartsScatterSeries', useValue: ScatterSeries};
export const ColumnSeriesService: ValueProvider = { provide: 'ChartsColumnSeries', useValue: ColumnSeries};
export const SplineSeriesService: ValueProvider = { provide: 'ChartsSplineSeries', useValue: SplineSeries};
export const SplineAreaSeriesService: ValueProvider = { provide: 'ChartsSplineAreaSeries', useValue: SplineAreaSeries};
export const StripLineService: ValueProvider = { provide: 'ChartsStripLine', useValue: StripLine};
export const AreaSeriesService: ValueProvider = { provide: 'ChartsAreaSeries', useValue: AreaSeries};
export const ScrollBarService: ValueProvider = { provide: 'ChartsScrollBar', useValue: ScrollBar};
export const StepLineSeriesService: ValueProvider = { provide: 'ChartsStepLineSeries', useValue: StepLineSeries};
export const StepAreaSeriesService: ValueProvider = { provide: 'ChartsStepAreaSeries', useValue: StepAreaSeries};
export const StackingColumnSeriesService: ValueProvider = { provide: 'ChartsStackingColumnSeries', useValue: StackingColumnSeries};
export const StackingLineSeriesService: ValueProvider = { provide: 'ChartsStackingLineSeries', useValue: StackingLineSeries};
export const StackingAreaSeriesService: ValueProvider = { provide: 'ChartsStackingAreaSeries', useValue: StackingAreaSeries};
export const StackingStepAreaSeriesService: ValueProvider = { provide: 'ChartsStackingStepAreaSeries', useValue: StackingStepAreaSeries};
export const BarSeriesService: ValueProvider = { provide: 'ChartsBarSeries', useValue: BarSeries};
export const StackingBarSeriesService: ValueProvider = { provide: 'ChartsStackingBarSeries', useValue: StackingBarSeries};
export const RangeColumnSeriesService: ValueProvider = { provide: 'ChartsRangeColumnSeries', useValue: RangeColumnSeries};
export const BubbleSeriesService: ValueProvider = { provide: 'ChartsBubbleSeries', useValue: BubbleSeries};
export const TooltipService: ValueProvider = { provide: 'ChartsTooltip', useValue: Tooltip};
export const CrosshairService: ValueProvider = { provide: 'ChartsCrosshair', useValue: Crosshair};
export const CategoryService: ValueProvider = { provide: 'ChartsCategory', useValue: Category};
export const DateTimeService: ValueProvider = { provide: 'ChartsDateTime', useValue: DateTime};
export const LogarithmicService: ValueProvider = { provide: 'ChartsLogarithmic', useValue: Logarithmic};
export const LegendService: ValueProvider = { provide: 'ChartsLegend', useValue: Legend};
export const ZoomService: ValueProvider = { provide: 'ChartsZoom', useValue: Zoom};
export const DataLabelService: ValueProvider = { provide: 'ChartsDataLabel', useValue: DataLabel};
export const SelectionService: ValueProvider = { provide: 'ChartsSelection', useValue: Selection};
export const ChartAnnotationService: ValueProvider = { provide: 'ChartsChartAnnotation', useValue: ChartAnnotation};
export const HiloSeriesService: ValueProvider = { provide: 'ChartsHiloSeries', useValue: HiloSeries};
export const HiloOpenCloseSeriesService: ValueProvider = { provide: 'ChartsHiloOpenCloseSeries', useValue: HiloOpenCloseSeries};
export const WaterfallSeriesService: ValueProvider = { provide: 'ChartsWaterfallSeries', useValue: WaterfallSeries};
export const RangeAreaSeriesService: ValueProvider = { provide: 'ChartsRangeAreaSeries', useValue: RangeAreaSeries};
export const RangeStepAreaSeriesService: ValueProvider = { provide: 'ChartsRangeStepAreaSeries', useValue: RangeStepAreaSeries};
export const SplineRangeAreaSeriesService: ValueProvider = { provide: 'ChartsSplineRangeAreaSeries', useValue: SplineRangeAreaSeries};
export const CandleSeriesService: ValueProvider = { provide: 'ChartsCandleSeries', useValue: CandleSeries};
export const PolarSeriesService: ValueProvider = { provide: 'ChartsPolarSeries', useValue: PolarSeries};
export const RadarSeriesService: ValueProvider = { provide: 'ChartsRadarSeries', useValue: RadarSeries};
export const SmaIndicatorService: ValueProvider = { provide: 'ChartsSmaIndicator', useValue: SmaIndicator};
export const TmaIndicatorService: ValueProvider = { provide: 'ChartsTmaIndicator', useValue: TmaIndicator};
export const EmaIndicatorService: ValueProvider = { provide: 'ChartsEmaIndicator', useValue: EmaIndicator};
export const AccumulationDistributionIndicatorService: ValueProvider = { provide: 'ChartsAccumulationDistributionIndicator', useValue: AccumulationDistributionIndicator};
export const MacdIndicatorService: ValueProvider = { provide: 'ChartsMacdIndicator', useValue: MacdIndicator};
export const AtrIndicatorService: ValueProvider = { provide: 'ChartsAtrIndicator', useValue: AtrIndicator};
export const RsiIndicatorService: ValueProvider = { provide: 'ChartsRsiIndicator', useValue: RsiIndicator};
export const MomentumIndicatorService: ValueProvider = { provide: 'ChartsMomentumIndicator', useValue: MomentumIndicator};
export const StochasticIndicatorService: ValueProvider = { provide: 'ChartsStochasticIndicator', useValue: StochasticIndicator};
export const BollingerBandsService: ValueProvider = { provide: 'ChartsBollingerBands', useValue: BollingerBands};
export const BoxAndWhiskerSeriesService: ValueProvider = { provide: 'ChartsBoxAndWhiskerSeries', useValue: BoxAndWhiskerSeries};
export const HistogramSeriesService: ValueProvider = { provide: 'ChartsHistogramSeries', useValue: HistogramSeries};
export const ErrorBarService: ValueProvider = { provide: 'ChartsErrorBar', useValue: ErrorBar};
export const TrendlinesService: ValueProvider = { provide: 'ChartsTrendlines', useValue: Trendlines};
export const DateTimeCategoryService: ValueProvider = { provide: 'ChartsDateTimeCategory', useValue: DateTimeCategory};
export const MultiColoredLineSeriesService: ValueProvider = { provide: 'ChartsMultiColoredLineSeries', useValue: MultiColoredLineSeries};
export const MultiColoredAreaSeriesService: ValueProvider = { provide: 'ChartsMultiColoredAreaSeries', useValue: MultiColoredAreaSeries};
export const MultiLevelLabelService: ValueProvider = { provide: 'ChartsMultiLevelLabel', useValue: MultiLevelLabel};
export const ParetoSeriesService: ValueProvider = { provide: 'ChartsParetoSeries', useValue: ParetoSeries};
export const ExportService: ValueProvider = { provide: 'ChartsExport', useValue: Export};
export const DataEditingService: ValueProvider = { provide: 'ChartsDataEditing', useValue: DataEditing};
export const HighlightService: ValueProvider = { provide: 'ChartsHighlight', useValue: Highlight};
export const LastValueLabelService: ValueProvider = { provide: 'ChartsLastValueLabel', useValue: LastValueLabel};
export const SeriesLabelService: ValueProvider = { provide: 'ChartsSeriesLabel', useValue: SeriesLabel};

/**
 * NgModule definition for the Chart component with providers.
 */
@NgModule({
    imports: [CommonModule, ChartModule],
    exports: [
        ChartModule
    ],
    providers:[
        LineSeriesService,
        ScatterSeriesService,
        ColumnSeriesService,
        SplineSeriesService,
        SplineAreaSeriesService,
        StripLineService,
        AreaSeriesService,
        ScrollBarService,
        StepLineSeriesService,
        StepAreaSeriesService,
        StackingColumnSeriesService,
        StackingLineSeriesService,
        StackingAreaSeriesService,
        StackingStepAreaSeriesService,
        BarSeriesService,
        StackingBarSeriesService,
        RangeColumnSeriesService,
        BubbleSeriesService,
        TooltipService,
        CrosshairService,
        CategoryService,
        DateTimeService,
        LogarithmicService,
        LegendService,
        ZoomService,
        DataLabelService,
        SelectionService,
        ChartAnnotationService,
        HiloSeriesService,
        HiloOpenCloseSeriesService,
        WaterfallSeriesService,
        RangeAreaSeriesService,
        RangeStepAreaSeriesService,
        SplineRangeAreaSeriesService,
        CandleSeriesService,
        PolarSeriesService,
        RadarSeriesService,
        SmaIndicatorService,
        TmaIndicatorService,
        EmaIndicatorService,
        AccumulationDistributionIndicatorService,
        MacdIndicatorService,
        AtrIndicatorService,
        RsiIndicatorService,
        MomentumIndicatorService,
        StochasticIndicatorService,
        BollingerBandsService,
        BoxAndWhiskerSeriesService,
        HistogramSeriesService,
        ErrorBarService,
        TrendlinesService,
        DateTimeCategoryService,
        MultiColoredLineSeriesService,
        MultiColoredAreaSeriesService,
        MultiLevelLabelService,
        ParetoSeriesService,
        ExportService,
        DataEditingService,
        HighlightService,
        LastValueLabelService,
        SeriesLabelService
    ]
})
export class ChartAllModule { }