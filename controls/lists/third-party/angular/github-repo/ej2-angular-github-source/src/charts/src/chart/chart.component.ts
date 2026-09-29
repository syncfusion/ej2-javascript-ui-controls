import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Chart } from '@syncfusion/ej2-charts';
import { Template } from '@syncfusion/ej2-angular-base';
import { SeriesCollectionDirective } from './series.directive';
import { AxesDirective } from './axes.directive';
import { RowsDirective } from './rows.directive';
import { ColumnsDirective } from './columns.directive';
import { RangeColorSettingsDirective } from './rangecolorsettings.directive';
import { AnnotationsDirective } from './annotations.directive';
import { SelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { IndicatorsDirective } from './indicators.directive';

export const inputs: string[] = ['accessibility','allowExport','allowMultiSelection','annotations','axes','background','backgroundImage','border','chartArea','columns','crosshair','currencyCode','dataSource','description','enableAnimation','enableAutoIntervalOnBothAxis','enableCanvas','enableExport','enableHtmlSanitizer','enablePersistence','enableRtl','enableSideBySidePlacement','enableWebMcp','focusBorderColor','focusBorderMargin','focusBorderWidth','height','highlightColor','highlightMode','highlightPattern','indicators','isMultiSelect','isTransposed','legendSettings','locale','margin','noDataTemplate','palettes','primaryXAxis','primaryYAxis','rangeColorSettings','rows','selectedDataIndexes','selectionMode','selectionPattern','series','stackLabels','subTitle','subTitleStyle','tabIndex','theme','title','titleStyle','tooltip','useGroupingSeparator','width','zoomSettings'];
export const outputs: string[] = ['afterExport','animationComplete','annotationRender','axisLabelClick','axisLabelRender','axisMultiLabelRender','axisRangeCalculated','beforeExport','beforePrint','beforeResize','beforeWebMcpToolExecute','chartDoubleClick','chartMouseClick','chartMouseDown','chartMouseLeave','chartMouseMove','chartMouseUp','crosshairLabelRender','drag','dragComplete','dragEnd','dragStart','legendClick','legendRender','load','loaded','multiLevelLabelClick','onZooming','pointClick','pointDoubleClick','pointMove','pointRender','resized','scrollChanged','scrollEnd','scrollStart','selectionComplete','seriesRender','sharedTooltipRender','textRender','tooltipRender','zoomComplete','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * Chart Component
 * ```html
 * <ejschart></ejschart>
 * ```
 */
@Component({
    selector: 'ejs-chart',
    inputs: inputs,
    outputs: outputs,
    template: '',
    standalone: true,
    queries: {
        childSeries: new ContentChild(SeriesCollectionDirective),
        childAxes: new ContentChild(AxesDirective),
        childRows: new ContentChild(RowsDirective),
        childColumns: new ContentChild(ColumnsDirective),
        childRangeColorSettings: new ContentChild(RangeColorSettingsDirective),
        childAnnotations: new ContentChild(AnnotationsDirective),
        childSelectedDataIndexes: new ContentChild(SelectedDataIndexesDirective),
        childIndicators: new ContentChild(IndicatorsDirective),
        tooltip_template: new ContentChild('tooltipTemplate'),
        legendSettings_template: new ContentChild('legendSettingsTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class ChartComponent extends Chart implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare afterExport: any;
	declare animationComplete: any;
	declare annotationRender: any;
	declare axisLabelClick: any;
	declare axisLabelRender: any;
	declare axisMultiLabelRender: any;
	declare axisRangeCalculated: any;
	declare beforeExport: any;
	declare beforePrint: any;
	declare beforeResize: any;
	declare beforeWebMcpToolExecute: any;
	declare chartDoubleClick: any;
	declare chartMouseClick: any;
	declare chartMouseDown: any;
	declare chartMouseLeave: any;
	declare chartMouseMove: any;
	declare chartMouseUp: any;
	declare crosshairLabelRender: any;
	declare drag: any;
	declare dragComplete: any;
	declare dragEnd: any;
	declare dragStart: any;
	declare legendClick: any;
	declare legendRender: any;
	declare load: any;
	declare loaded: any;
	declare multiLevelLabelClick: any;
	declare onZooming: any;
	declare pointClick: any;
	declare pointDoubleClick: any;
	declare pointMove: any;
	declare pointRender: any;
	declare resized: any;
	declare scrollChanged: any;
	declare scrollEnd: any;
	declare scrollStart: any;
	declare selectionComplete: any;
	declare seriesRender: any;
	declare sharedTooltipRender: any;
	declare textRender: any;
	declare tooltipRender: any;
	declare zoomComplete: any;
	public declare dataSourceChange: any;
    public declare childSeries: QueryList<SeriesCollectionDirective>;
    public declare childAxes: QueryList<AxesDirective>;
    public declare childRows: QueryList<RowsDirective>;
    public declare childColumns: QueryList<ColumnsDirective>;
    public declare childRangeColorSettings: QueryList<RangeColorSettingsDirective>;
    public declare childAnnotations: QueryList<AnnotationsDirective>;
    public declare childSelectedDataIndexes: QueryList<SelectedDataIndexesDirective>;
    public declare childIndicators: QueryList<IndicatorsDirective>;
    public tags: string[] = ['series', 'axes', 'rows', 'columns', 'rangeColorSettings', 'annotations', 'selectedDataIndexes', 'indicators'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ChartsLineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsScatterSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsColumnSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSplineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSplineAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStripLine');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsScrollBar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStepLineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStepAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStackingColumnSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStackingLineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStackingAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStackingStepAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsBarSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStackingBarSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRangeColumnSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsBubbleSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCrosshair');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCategory');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDateTime');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsLogarithmic');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsLegend');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsZoom');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDataLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsChartAnnotation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsHiloSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsHiloOpenCloseSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsWaterfallSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRangeAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRangeStepAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSplineRangeAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsCandleSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsPolarSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRadarSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSmaIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTmaIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsEmaIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAccumulationDistributionIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMacdIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsAtrIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsRsiIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMomentumIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsStochasticIndicator');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsBollingerBands');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsBoxAndWhiskerSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsHistogramSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsErrorBar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsTrendlines');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDateTimeCategory');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMultiColoredLineSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMultiColoredAreaSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsMultiLevelLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsParetoSeries');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsDataEditing');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsHighlight');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsLastValueLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ChartsSeriesLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childSeries;
        
	    if (this.childAxes) {
            this.tagObjects[1].instance = this.childAxes;
        }
        
	    if (this.childRows) {
            this.tagObjects[2].instance = this.childRows;
        }
        
	    if (this.childColumns) {
            this.tagObjects[3].instance = this.childColumns;
        }
        
	    if (this.childRangeColorSettings) {
            this.tagObjects[4].instance = this.childRangeColorSettings;
        }
        
	    if (this.childAnnotations) {
            this.tagObjects[5].instance = this.childAnnotations;
        }
        
	    if (this.childSelectedDataIndexes) {
            this.tagObjects[6].instance = this.childSelectedDataIndexes;
        }
        
	    if (this.childIndicators) {
            this.tagObjects[7].instance = this.childIndicators;
        }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(ChartComponent.prototype, 'tooltip_template');
Template()(ChartComponent.prototype, 'legendSettings_template');


